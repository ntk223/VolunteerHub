import User from './User.js';
import Volunteer from './Volunteer.js';
import Manager from './Manager.js';
import Event from './Event.js';
import Category from './Category.js';
import Post from './Post.js';
import Comment from './Comment.js';
import Like from './Like.js';
import Application from './Application.js';

// User ↔ Volunteer (1-1)
User.hasOne(Volunteer, { foreignKey: 'user_id', as: 'volunteer' });
Volunteer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User ↔ Manager (1-1)
User.hasOne(Manager, { foreignKey: 'user_id', as: 'manager' });
Manager.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category ↔ Event (1-n)
Category.hasMany(Event, { foreignKey: 'category_id', as: 'events' });
Event.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Manager ↔ Event (1-n)
Manager.hasMany(Event, { foreignKey: 'manager_id', as: 'events' });
Event.belongsTo(Manager, { foreignKey: 'manager_id', as: 'manager' });

// Event ↔ Post (1-n)
Event.hasMany(Post, { foreignKey: 'event_id', as: 'posts' });
Post.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// User ↔ Post (1-n)
User.hasMany(Post, { foreignKey: 'author_id', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// Post ↔ Comment (1-n)
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// Post ↔ Like (1-n)
Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// User ↔ Comment (1-n)
User.hasMany(Comment, { foreignKey: 'author_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// User ↔ Like (1-n)
User.hasMany(Like, { foreignKey: 'user_id', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Volunteer ↔ Application (1-n)
Volunteer.hasMany(Application, { foreignKey: 'volunteer_id', as: 'applications' });
Application.belongsTo(Volunteer, { foreignKey: 'volunteer_id', as: 'volunteer' });

// Event ↔ Application (1-n)
Event.hasMany(Application, { foreignKey: 'event_id', as: 'applications' });
Application.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

export {
  User,
  Volunteer,
  Manager,
  Event,
  Category,
  Post,
  Comment,
  Like,
  Application
};
