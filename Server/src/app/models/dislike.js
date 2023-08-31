const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

const Dislike = sequelize.define(
  "Dislike",
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

Dislike.associate = (models) => {
  Dislike.belongsTo(models.User, { foreignKey: "userId" }); // Establishes relationship with User model
};

module.exports = Dislike;
