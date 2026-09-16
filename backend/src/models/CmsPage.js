const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CmsPage = sequelize.define(
  "CmsPage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sections: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "cms_pages",
  },
);

module.exports = { CmsPage };
