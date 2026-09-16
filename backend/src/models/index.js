const { sequelize } = require("../config/database");
const { Car } = require("./Car");
const { Inquiry } = require("./Inquiry");
const { SiteChrome } = require("./SiteChrome");
const { CmsPage } = require("./CmsPage");
const { Brand } = require("./Brand");
const { ensureCms } = require("../lib/ensureCms");
const { ensureBrands } = require("../lib/ensureBrands");

async function syncModels() {
  await sequelize.authenticate();
  await sequelize.sync();
  await sequelize.query(`
    ALTER TABLE cars ADD COLUMN IF NOT EXISTS tabs JSONB NOT NULL DEFAULT '{}'::jsonb
  `);
  await ensureCms();
  await ensureBrands();
}

module.exports = {
  sequelize,
  Car,
  Inquiry,
  SiteChrome,
  CmsPage,
  Brand,
  syncModels,
};
