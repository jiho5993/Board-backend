module.exports = (sequelize, DataTypes) => {
  return sequelize.define('article', {
    article_no: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    writer: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reg_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    view_cnt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};