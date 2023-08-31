const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Like.associate = (models) => {
  Like.belongsTo(models.User, { foreignKey: "userId" }); // Establishes relationship with User model
};

module.exports = Like;
