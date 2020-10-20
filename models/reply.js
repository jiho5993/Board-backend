module.exports = (sequelize, DataTypes) => {
  return sequelize.define('reply', {
    reply_no: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    article_no: {
      type: DataTypes.INTEGER(255)
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reg_date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};