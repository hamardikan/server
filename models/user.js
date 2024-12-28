module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'authorId',
        as: 'posts'
      });
      
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments'
      });

      User.belongsToMany(models.Comment, {
        through: 'CommentUsers',
        as: 'likedComments',
        foreignKey: 'userId'
      });
    }
  }
  
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    picture: DataTypes.STRING,
    googleId: {
      type: DataTypes.STRING,
      unique: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'admin']]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    indexes: [
      {
        fields: ['email'],
        unique: true
      },
      {
        fields: ['googleId'],
        unique: true
      }
    ]
  });
  return User;
};
