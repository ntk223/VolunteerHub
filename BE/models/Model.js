import User from './User.js';
import Volunteer from './Volunteer.js';
import Manager from './Manager.js';
// Define associations
Volunteer.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user' // Alias for the association
})

User.hasOne(Volunteer, {
    foreignKey: 'user_id',
    as: 'volunteer' // Alias for the association
})

Manager.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user' // Alias for the association
})

User.hasOne(Manager, {
    foreignKey: 'user_id',
    as: 'manager' // Alias for the association
})

export {
    User,
    Volunteer,
    Manager
};