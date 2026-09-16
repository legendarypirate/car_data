const { Router } = require("express");
const { Car, Inquiry } = require("../models");

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [totalCars, inStock, inTransit, onOrder, inquiries, cars] =
      await Promise.all([
        Car.count(),
        Car.count({ where: { status: "in-stock" } }),
        Car.count({ where: { status: "in-transit" } }),
        Car.count({ where: { status: "order" } }),
        Inquiry.count(),
        Car.findAll({ attributes: ["price", "brand"] }),
      ]);

    const inventoryValue = cars.reduce(
      (sum, car) => sum + Number(car.price || 0),
      0,
    );
    const brandCounts = cars.reduce((acc, car) => {
      acc[car.brand] = (acc[car.brand] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalCars,
      inStock,
      inTransit,
      onOrder,
      inquiries,
      inventoryValue,
      brands: Object.entries(brandCounts)
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
