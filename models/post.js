const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class posts extends Model {
        static associate(models) {
            this.belongsTo(models.users, { foreignKey: 'userId', as: 'user' });
        }
    }

    posts.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'posts'
    });

    return posts;
};