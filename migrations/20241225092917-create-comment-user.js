'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CommentUsers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      commentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Comments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        type: Sequelize.UUID,
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

    // Add composite unique constraint to prevent duplicate likes
    await queryInterface.addConstraint('CommentUsers', {
      fields: ['commentId', 'userId'],
      type: 'unique',
      name: 'unique_comment_user_like'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CommentUsers');
  }
};