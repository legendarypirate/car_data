const { Router } = require("express");
const { Op } = require("sequelize");
const { Car } = require("../models");

const router = Router();

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function toCarPayload(body, { partial = false } = {}) {
  const payload = {};
  const fields = [
    "slug",
    "name",
    "brand",
    "year",
    "price",
    "type",
    "fuelType",
    "drivetrain",
    "rangeKm",
    "rangeLabel",
    "batteryKwh",
    "powerKw",
    "acceleration",
    "chargeMinutes",
    "seats",
    "color",
    "status",
    "badge",
    "badgeColor",
    "eta",
    "description",
    "image",
    "bodyLabel",
    "featured",
    "tabs",
  ];

  for (const field of fields) {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  if (body.highlights !== undefined) {
    payload.highlights = parseList(body.highlights);
  }
  if (body.gallery !== undefined) {
    payload.gallery = parseList(body.gallery);
  }
  if (payload.year !== undefined) payload.year = Number(payload.year);
  if (payload.price !== undefined) payload.price = Number(payload.price);
  if (payload.rangeKm !== undefined) payload.rangeKm = Number(payload.rangeKm);
  if (payload.batteryKwh !== undefined) {
    payload.batteryKwh = payload.batteryKwh === "" ? null : Number(payload.batteryKwh);
  }
  if (payload.powerKw !== undefined) payload.powerKw = Number(payload.powerKw);
  if (payload.chargeMinutes !== undefined) {
    payload.chargeMinutes =
      payload.chargeMinutes === "" ? null : Number(payload.chargeMinutes);
  }
  if (payload.seats !== undefined) payload.seats = Number(payload.seats);
  if (payload.featured !== undefined) {
    payload.featured = Boolean(payload.featured);
  }
  if (!payload.slug && payload.name && !partial) {
    payload.slug = slugify(`${payload.brand || ""} ${payload.name}`);
  }
  if (payload.gallery && payload.gallery.length === 0 && payload.image) {
    payload.gallery = [payload.image];
  }

  return payload;
}

router.get("/", async (req, res, next) => {
  try {
    const { search, status, brand } = req.query;
    const where = {};

    if (status) where.status = status;
    if (brand) where.brand = brand;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const cars = await Car.findAll({
      where,
      order: [
        ["featured", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    res.json(cars);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const car = /^\d+$/.test(req.params.id)
      ? await Car.findByPk(req.params.id)
      : await Car.findOne({ where: { slug: req.params.id } });
    if (!car) {
      return res.status(404).json({ message: "Машин олдсонгүй" });
    }
    res.json(car);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = toCarPayload(req.body);
    if (!payload.name || !payload.brand || !payload.price) {
      return res.status(400).json({ message: "Нэр, брэнд, үнэ шаардлагатай" });
    }
    const car = await Car.create(payload);
    res.status(201).json(car);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Машин олдсонгүй" });
    }
    await car.update(toCarPayload(req.body, { partial: true }));
    res.json(car);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Машин олдсонгүй" });
    }
    await car.destroy();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
