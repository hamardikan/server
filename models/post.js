odule.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
      
      Post.belongsToMany(models.Tag, {
        through: 'PostTags',
        as: 'tags',
        foreignKey: 'postId'
      });

      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments'
      });
    }
  }
  
  Post.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    description: DataTypes.TEXT,
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
    indexes: [
      {
        fields: ['authorId']
      },
      {
        fields: ['slug'],
        unique: true
      },
      {
        fields: ['published']
      }
    ]
  });
  return Post;
};