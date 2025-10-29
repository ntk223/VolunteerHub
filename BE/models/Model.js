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
User.hasOne(Volunteer, { foreignKey: 'userId', as: 'volunteer' });
Volunteer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User ↔ Manager (1-1)
User.hasOne(Manager, { foreignKey: 'userId', as: 'manager' });
Manager.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Category ↔ Event (1-n)
Category.hasMany(Event, { foreignKey: 'categoryId', as: 'events' });
Event.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Manager ↔ Event (1-n)
Manager.hasMany(Event, { foreignKey: 'managerId', as: 'events' });
Event.belongsTo(Manager, { foreignKey: 'managerId', as: 'manager' });

// Event ↔ Post (1-n)
Event.hasMany(Post, { foreignKey: 'eventId', as: 'posts' });
Post.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// User ↔ Post (1-n)
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Post ↔ Comment (1-n)
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Post ↔ Like (1-n)
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User ↔ Comment (1-n)
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// User ↔ Like (1-n)
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Volunteer ↔ Application (1-n)
Volunteer.hasMany(Application, { foreignKey: 'volunteerId', as: 'applications' });
Application.belongsTo(Volunteer, { foreignKey: 'volunteerId', as: 'volunteer' });

// Event ↔ Application (1-n)
Event.hasMany(Application, { foreignKey: 'eventId', as: 'applications' });
Application.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

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
