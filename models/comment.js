module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
      
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'author'
      });

      Comment.hasMany(Comment, {
        foreignKey: 'parentId',
        as: 'replies'
      });
      
      Comment.belongsTo(Comment, {
        foreignKey: 'parentId',
        as: 'parent'
      });

      Comment.belongsToMany(models.User, {
        through: 'CommentUsers',
        as: 'likedBy',
        foreignKey: 'commentId'
      });
    }
  }
  
  Comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Comment',
    indexes: [
      {
        fields: ['postId']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['parentId']
      }
    ]
  });
  return Comment;
};