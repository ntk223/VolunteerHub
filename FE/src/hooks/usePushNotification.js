import { useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../api';

const usePushNotification = (user) => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check if browser supports notifications
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      
      if (user) {
        checkSubscription();
      }
    } else {
      console.warn('Push notifications are not supported in this browser');
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setIsSubscribed(!!sub);
      console.log('Current subscription:', sub);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      return perm === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    if (!isSupported) {
      message.error('Trình duyệt không hỗ trợ thông báo đẩy');
      return false;
    }

    if (!user) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng này');
      return false;
    }

    setLoading(true);
    try {
      // Request permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        message.warning('Bạn cần cho phép thông báo để sử dụng tính năng này');
        setLoading(false);
        return false;
      }

      // Register service worker
      let registration;
      try {
        registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (swError) {
        console.error('Service Worker registration failed:', swError);
        message.error('Lỗi khi đăng ký Service Worker');
        setLoading(false);
        return false;
      }

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('Service Worker ready');

      // Get public key from server
      const { data } = await api.get('/push/public-key');
      const publicKey = data.publicKey;

      if (!publicKey) {
        message.error('Không thể lấy public key từ server');
        setLoading(false);
        return false;
      }

      // Subscribe to push
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      console.log('Push subscription:', sub);

      // Send subscription to server
      await api.post('/push/subscribe', { subscription: sub });
      console.log(11111);
      setSubscription(sub);
      setIsSubscribed(true);
      message.success('Đã bật thông báo đẩy thành công!');
      return true;
    } catch (error) {
      console.error('Subscribe error:', error);
      
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn');
      } else {
        message.error('Lỗi khi đăng ký nhận thông báo');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) {
      message.warning('Bạn chưa đăng ký nhận thông báo');
      return false;
    }

    setLoading(true);
    try {
      // Unsubscribe from push
      await subscription.unsubscribe();
      
      // Tell server to remove subscription
      await api.post('/push/unsubscribe', { 
        endpoint: subscription.endpoint 
      });

      setSubscription(null);
      setIsSubscribed(false);
      message.success('Đã tắt thông báo đẩy');
      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      message.error('Lỗi khi hủy đăng ký');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    if (!isSubscribed) {
      message.warning('Vui lòng bật thông báo đẩy trước');
      return;
    }

    try {
      await api.post('/push/test');
      message.success('Đã gửi thông báo thử nghiệm');
    } catch (error) {
      console.error('Test notification error:', error);
      message.error('Lỗi khi gửi thông báo thử nghiệm');
    }
  };

  return {
    isSupported,
    isSubscribed,
    loading,
    permission,
    subscribe,
    unsubscribe,
    testNotification,
  };
};

export default usePushNotification;
