'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    static associate(models) {
      // No need to define associations here since they're defined in Post and Tag models
    }
  }
  
  PostTag.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    postId: {
      type: DataTypes.UUID,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.UUID,
      references: {
        model: 'Tags',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'PostTag',
    // Adding indexes for better query performance
    indexes: [
      {
        unique: true,
        fields: ['postId', 'tagId']
      }
    ]
  });
  return PostTag;
};