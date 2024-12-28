// seeders/20241224150000-demo-data.js
'use strict';
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../helpers/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: hashPassword('password123'),
        name: 'Admin User',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'john@example.com',
        password: hashPassword('password123'),
        name: 'John Doe',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'jane@example.com',
        password: hashPassword('password123'),
        name: 'Jane Smith',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const tags = [
      {
        id: uuidv4(),
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology',
        postCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Programming',
        slug: 'programming',
        description: 'Programming related content',
        postCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development topics',
        postCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const posts = [
      {
        id: uuidv4(),
        title: 'Getting Started with React',
        slug: 'getting-started-with-react',
        description: 'A beginner\'s guide to React',
        content: 'React is a popular JavaScript library for building user interfaces. It was developed and is maintained by Facebook. React makes it easy to create reusable UI components that can efficiently update and render data as it changes.\n\nKey concepts:\n1. Components\n2. JSX\n3. Virtual DOM\n4. State and Props\n5. Hooks',
        images: JSON.stringify([{
          url: 'https://api.dicebear.com/7.x/shapes/svg?seed=react',
          alt: 'React Logo',
          caption: 'React Logo'
        }]),
        published: true,
        authorId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Understanding Node.js',
        slug: 'understanding-nodejs',
        description: 'Deep dive into Node.js',
        content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows developers to run JavaScript on the server side. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.\n\nCore features:\n1. Event Loop\n2. NPM\n3. Modules\n4. Streams\n5. File System Operations',
        images: JSON.stringify([{
          url: 'https://api.dicebear.com/7.x/shapes/svg?seed=nodejs',
          alt: 'Node.js Logo',
          caption: 'Node.js Logo'
        }]),
        published: true,
        authorId: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const comments = [
      {
        id: uuidv4(),
        content: 'Great article! Really helpful for beginners.',
        postId: posts[0].id,
        userId: users[2].id,
        likes: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        content: 'Thanks for sharing this knowledge!',
        postId: posts[1].id,
        userId: users[1].id,
        likes: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        content: 'Looking forward to more articles like this.',
        postId: posts[0].id,
        userId: users[0].id,
        likes: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const postTags = [
      {
        id: uuidv4(),
        postId: posts[0].id,
        tagId: tags[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        postId: posts[0].id,
        tagId: tags[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        postId: posts[1].id,
        tagId: tags[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const commentUsers = [
      {
        id: uuidv4(),
        commentId: comments[0].id,
        userId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        commentId: comments[1].id,
        userId: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Users', users);
    await queryInterface.bulkInsert('Tags', tags);
    await queryInterface.bulkInsert('Posts', posts);
    await queryInterface.bulkInsert('Comments', comments);
    await queryInterface.bulkInsert('PostTags', postTags);
    await queryInterface.bulkInsert('CommentUsers', commentUsers);

    for (const tag of tags) {
      const count = postTags.filter(pt => pt.tagId === tag.id).length;
      await queryInterface.bulkUpdate('Tags', 
        { postCount: count },
        { id: tag.id }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CommentUsers', null, {});
    await queryInterface.bulkDelete('PostTags', null, {});
    await queryInterface.bulkDelete('Comments', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('Tags', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};