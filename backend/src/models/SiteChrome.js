const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SiteChrome = sequelize.define(
  "SiteChrome",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    header: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    footer: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    tableName: "site_chrome",
  },
);

module.exports = { SiteChrome };
