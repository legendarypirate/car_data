const { Brand } = require("../models/Brand");

const defaults = [
  { name: "Toyota", image: "/car-toyota-bz3x.jpg" },
  { name: "BYD", image: "/car-byd-sealion7.jpg" },
  { name: "Tesla", image: "/car-tesla-modely.jpg" },
  { name: "Zeekr", image: "/car-zeekr-7x.jpg" },
  { name: "XPeng", image: "/car-tesla-modely.jpg" },
  { name: "AITO", image: "/car-byd-sealion7.jpg" },
  { name: "Xiaomi", image: "/car-toyota-bz3x.jpg" },
  { name: "NIO", image: "/car-byd-sealion7.jpg" },
];

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureBrands() {
  const count = await Brand.count();
  if (count > 0) return;

  await Brand.bulkCreate(
    defaults.map((brand) => ({
      ...brand,
      slug: slugify(brand.name),
    })),
  );
}

async function resetBrandDefaults() {
  await Brand.destroy({ where: {} });
  await Brand.bulkCreate(
    defaults.map((brand) => ({
      ...brand,
      slug: slugify(brand.name),
    })),
  );
}

module.exports = { ensureBrands, resetBrandDefaults, brandDefaults: defaults };
