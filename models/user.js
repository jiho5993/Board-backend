module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    userid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};