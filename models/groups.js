module.exports = (sequelize, Sequelize) => {
    const Group = sequelize.define('Group', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        descr: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        created_time: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
    });

    return Group;
};
