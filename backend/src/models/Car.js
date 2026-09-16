const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Car = sequelize.define(
  "Car",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "fuel_type",
    },
    drivetrain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rangeKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "range_km",
    },
    rangeLabel: {
      type: DataTypes.STRING,
      field: "range_label",
    },
    batteryKwh: {
      type: DataTypes.FLOAT,
      field: "battery_kwh",
    },
    powerKw: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "power_kw",
    },
    acceleration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chargeMinutes: {
      type: DataTypes.INTEGER,
      field: "charge_minutes",
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "in-stock",
    },
    badge: DataTypes.STRING,
    badgeColor: {
      type: DataTypes.STRING,
      field: "badge_color",
    },
    eta: DataTypes.STRING,
    highlights: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gallery: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    bodyLabel: {
      type: DataTypes.STRING,
      field: "body_label",
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    tabs: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    tableName: "cars",
  },
);

module.exports = { Car };
