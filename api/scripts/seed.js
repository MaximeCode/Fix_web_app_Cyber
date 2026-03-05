const mongoose = require('mongoose');
const UserModel = require('../app/models/user.js');

async function seedUsers() {
    try {
        const config = require('../app/config.js').development; // or process.argv[2]
        const host = config.mongodb;
        const connect = mongoose.createConnection(host);
        console.log(connect);

        const User = connect.model('User', UserModel);

        // Example users
        const users = [
            { name: 'admin', password: 'password123', status: 'active' },
            { name: 'user1', password: 'pass456', status: 'active' }
        ];

        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`User ${userData.name} created`);
        }

        console.log('Seeding complete');
        connect.close();
    } catch (err) {
        console.error('Error seeding:', err);
    }
}

seedUsers();