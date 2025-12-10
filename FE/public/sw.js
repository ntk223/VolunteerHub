// Service Worker for Push Notifications
// This file handles push notifications when the app is closed or in background

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
  event.waitUntil(clients.claim());
});

// Lắng nghe push notifications từ server
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  if (!event.data) {
    console.log('[Service Worker] Push event but no data');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[Service Worker] Push data:', data);
    
    const options = {
      body: data.body || 'Bạn có thông báo mới',
      icon: data.icon || '/logo.png',
      badge: '/logo.png',
      data: {
        url: data.url || '/',
        ...data.data,
      },
      actions: data.actions || [],
      tag: data.tag || 'default',
      requireInteraction: data.requireInteraction || false,
      vibrate: [200, 100, 200], // Rung khi nhận notification
      timestamp: Date.now(),
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'VolunteerHub', options)
    );
  } catch (error) {
    console.error('[Service Worker] Error parsing push data:', error);
  }
});

// Xử lý khi user click vào notification
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    })
    .then((clientList) => {
      // Nếu đã có tab mở VolunteerHub, focus vào tab đó
      for (const client of clientList) {
        if (client.url.includes(new URL(urlToOpen, self.location.origin).pathname) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Nếu có tab mở nhưng URL khác, navigate đến URL mới
      if (clientList.length > 0) {
        return clientList[0].focus().then(client => {
          if ('navigate' in client) {
            return client.navigate(urlToOpen);
          }
        });
      }
      
      // Nếu chưa có tab nào, mở tab mới
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Xử lý khi user đóng notification mà không click
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed:', event.notification.tag);
});

// Error handling cho push subscription
self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[Service Worker] Push subscription changed');
  
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
      .then((subscription) => {
        console.log('[Service Worker] Resubscribed:', subscription);
        // TODO: Gửi subscription mới lên server
        return fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscription }),
        });
      })
  );
});
