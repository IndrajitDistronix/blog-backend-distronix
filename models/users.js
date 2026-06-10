const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      this.hasMany(models.posts, { foreignKey: 'userId', as: 'posts' });
    }

    static findByEmail(email) {
      return this.findOne({ where: { email } });
    }

    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    generateAccessToken() {
      return jwt.sign(
        { userId: this.id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
      );
    };

    generateRefreshToken() {
      return jwt.sign(
        { userId: this.id, email: this.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
      );
    };
  }
  users.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING
    },
    refresh_token: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};

// module.exports = (sequelize, DataTypes) => {
//   sequelize.define('users', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     name: {
//       type: DataTypes.STRING
//     },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//       validate: {
//         isEmail: true
//       }
//     },
//     password: {
//       type: DataTypes.STRING
//     },
//     refresh_token: {
//       type: DataTypes.STRING
//     }
//   }, {
//     timestamps: true,
//   });
//   return users;
// };