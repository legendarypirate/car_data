const { Router } = require("express");
const { Op } = require("sequelize");
const { Brand } = require("../models/Brand");
const { Car } = require("../models/Car");

const router = Router();

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function withCarCount(brand) {
  const json = brand.toJSON();
  json.carCount = await Car.count({ where: { brand: brand.name } });
  return json;
}

router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    const brands = await Brand.findAll({
      where,
      order: [["name", "ASC"]],
    });
    const cars = await Car.findAll({ attributes: ["brand"] });
    const counts = cars.reduce((acc, car) => {
      acc[car.brand] = (acc[car.brand] || 0) + 1;
      return acc;
    }, {});
    res.json(
      brands.map((brand) => ({
        ...brand.toJSON(),
        carCount: counts[brand.name] || 0,
      })),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Брэнд олдсонгүй" });
    }
    res.json(await withCarCount(brand));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const image = String(req.body.image || "").trim();
    if (!name || !image) {
      return res.status(400).json({ message: "Нэр болон зураг шаардлагатай" });
    }
    const brand = await Brand.create({
      name,
      image,
      slug: req.body.slug ? slugify(req.body.slug) : slugify(name),
    });
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Брэнд олдсонгүй" });
    }
    const previousName = brand.name;
    if (req.body.name !== undefined) brand.name = String(req.body.name).trim();
    if (req.body.image !== undefined) brand.image = String(req.body.image).trim();
    if (req.body.slug !== undefined) {
      brand.slug = slugify(req.body.slug);
    } else if (req.body.name) {
      brand.slug = slugify(req.body.name);
    }
    if (!brand.name || !brand.image) {
      return res.status(400).json({ message: "Нэр болон зураг шаардлагатай" });
    }
    await brand.save();
    if (previousName !== brand.name) {
      await Car.update({ brand: brand.name }, { where: { brand: previousName } });
    }
    res.json(await withCarCount(brand));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Брэнд олдсонгүй" });
    }
    await brand.destroy();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
