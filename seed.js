const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Message = require('./models/Message');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding.');
    await Message.deleteMany({});
    await Registration.deleteMany({});
    await Event.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log('Old data cleared.');

    // Create categories
    const categories = {};

    const categoryData = [
      {
        name: 'Technology',
        description: 'Technology and programming events'
      },
      {
        name: 'Sports',
        description: 'Sports and competition events'
      },
      {
        name: 'Business',
        description: 'Business and entrepreneurship events'
      }
    ];

    for (const data of categoryData) {
      const category = await Category.create(data);
      categories[data.name] = category;
    }

    console.log('Categories seeded.');

    // Create admin user
    const hashedPassword = await bcrypt.hash(
      process.env.SEED_ADMIN_PASSWORD,
      10
    );

    const admin = await User.create(
      {
        name: process.env.SEED_ADMIN_NAME,
        email: process.env.SEED_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      }
    );

    console.log(`Admin seeded: ${admin.email}`);

    // Create events
    const eventData = [
      {
        title: 'Node.js Workshop',
        description: 'Learn backend development with Node.js and Express.',
        category: categories.Technology._id,
        date: new Date('2026-09-10'),
        city: 'Cairo',
        venue: 'Cairo Technology Center',
        capacity: 100,
        organizer: admin._id
      },
      {
        title: 'Robotics Competition',
        description: 'A competition for robotics enthusiasts.',
        category: categories.Technology._id,
        date: new Date('2026-09-20'),
        city: 'Alexandria',
        venue: 'Alexandria Youth Center',
        capacity: 50,
        organizer: admin._id
      },

      {
        title: 'Entrepreneurship Summit',
        description: 'A summit about startups and entrepreneurship.',
        category: categories.Business._id,
        date: new Date('2026-10-05'),
        city: 'Cairo',
        venue: 'Cairo Conference Center',
        capacity: 200,
        organizer: admin._id
      },
      {
        title: 'Cairo 5K Charity Run',
        description: 'A community running event supporting local charity initiatives.',
        category: categories.Sports._id,
        date: new Date('2026-10-15'),
        city: 'Cairo',
        venue: 'Al-Azhar Park',
        capacity: 300,
        organizer: admin._id
      }
    ];

    for (const data of eventData) {
      const event = await Event.create(data);
      event[data.title] = event;
    }

    console.log('Events seeded.');
    console.log('Database seeding completed successfully.');

  } catch (error) {
    console.error('Database seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();