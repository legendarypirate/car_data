const { randomUUID } = require("crypto");
const { sequelize } = require("../config/database");
const { Car } = require("./Car");
const { Inquiry } = require("./Inquiry");
const { SiteChrome } = require("./SiteChrome");
const { CmsPage } = require("./CmsPage");
const { Brand } = require("./Brand");
const { ensureCms } = require("../lib/ensureCms");
const { ensureBrands } = require("../lib/ensureBrands");

async function ensureCarUuids() {
  await sequelize.query(`ALTER TABLE cars ADD COLUMN IF NOT EXISTS uuid UUID`);
  const missing = await Car.findAll({ where: { uuid: null } });
  for (const car of missing) {
    await car.update({ uuid: randomUUID() });
  }
  await sequelize.query(`CREATE UNIQUE INDEX IF NOT EXISTS cars_uuid_unique ON cars (uuid)`);
  try {
    await sequelize.query(`ALTER TABLE cars ALTER COLUMN uuid SET DEFAULT gen_random_uuid()`);
  } catch {
    // Sequelize UUIDV4 covers inserts if the database has no gen_random_uuid()
  }
  await sequelize.query(`ALTER TABLE cars ALTER COLUMN uuid SET NOT NULL`);
}

async function syncModels() {
  await sequelize.authenticate();
  await sequelize.sync();
  await sequelize.query(`
    ALTER TABLE cars ADD COLUMN IF NOT EXISTS tabs JSONB NOT NULL DEFAULT '{}'::jsonb
  `);
  await ensureCarUuids();
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
