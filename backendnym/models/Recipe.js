module.exports = (sequelize, DataTypes) => {
    const Recipe = sequelize.define('Recipe', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cuisine: {
            type: DataTypes.STRING,
            allowNull: false
        },
        servings: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        preparation_time:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image_url:{

        },
        authorID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
        },
    });

    Recipe.associate = (models) => {
        Recipe.belongsTo(models.User, { foreignKey: 'authorID' }); // Связь с моделью User
    };

    return Recipe;
};
