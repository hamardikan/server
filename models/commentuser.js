'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommentUser extends Model {
    static associate(models) {
      // No need to define associations here since they're defined in Comment and User models
    }
  }
  
  CommentUser.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    commentId: {
      type: DataTypes.UUID,
      references: {
        model: 'Comments',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'CommentUser',
    // Adding indexes for better query performance
    indexes: [
      {
        unique: true,
        fields: ['commentId', 'userId']
      }
    ]
  });
  return CommentUser;
};