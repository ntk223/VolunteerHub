import User from './User.js';
import Volunteer from './Volunteer.js';
import Manager from './Manager.js';
import Event from './Event.js';
import Category from './Category.js';

// Define associations
Volunteer.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user' // Alias for the association
})

User.hasOne(Volunteer, {
    foreignKey: 'user_id',
    as: 'volunteer'
})

Manager.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
})

User.hasOne(Manager, {
    foreignKey: 'user_id',
    as: 'manager'
})

Event.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
})

Category.hasMany(Event, {
    foreignKey: 'category_id',
    as: 'events'
})

Event.belongsTo(Manager, {
    foreignKey: 'manager_id',
    as: 'manager'
})

Manager.hasMany(Event, {
    foreignKey: 'manager_id',
    as: 'events'
})
export {
    User,
    Volunteer,
    Manager,
    Event,
    Category
};