'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.TEXT
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      images: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      authorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Posts', ['authorId']);
    await queryInterface.addIndex('Posts', ['slug'], { unique: true });
    await queryInterface.addIndex('Posts', ['published']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};
