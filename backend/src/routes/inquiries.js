const { Router } = require("express");
const { Inquiry } = require("../models");

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const inquiries = await Inquiry.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, car, notes } = req.body;
    if (!name || !email || !phone || !car) {
      return res.status(400).json({ message: "Нэр, имэйл, утас, машин шаардлагатай" });
    }
    const inquiry = await Inquiry.create({ name, email, phone, car, notes });
    res.status(201).json(inquiry);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Хүсэлт олдсонгүй" });
    }
    if (req.body.status) {
      inquiry.status = req.body.status;
    }
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Хүсэлт олдсонгүй" });
    }
    await inquiry.destroy();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
