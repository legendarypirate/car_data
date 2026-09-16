const { Router } = require("express");
const { SiteChrome } = require("../models/SiteChrome");
const { CmsPage } = require("../models/CmsPage");
const { defaultHeader, defaultFooter } = require("../data/cmsDefaults");

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const chrome = await SiteChrome.findByPk(1);
    const pages = await CmsPage.findAll({
      attributes: ["slug", "title"],
      order: [["id", "ASC"]],
    });
    res.json({
      header: chrome?.header || defaultHeader,
      footer: chrome?.footer || defaultFooter,
      pages,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/chrome", async (_req, res, next) => {
  try {
    const chrome = await SiteChrome.findByPk(1);
    res.json({
      header: chrome?.header || defaultHeader,
      footer: chrome?.footer || defaultFooter,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/chrome", async (req, res, next) => {
  try {
    const [chrome] = await SiteChrome.findOrCreate({
      where: { id: 1 },
      defaults: { id: 1, header: defaultHeader, footer: defaultFooter },
    });
    if (req.body.header) chrome.header = req.body.header;
    if (req.body.footer) chrome.footer = req.body.footer;
    await chrome.save();
    res.json({ header: chrome.header, footer: chrome.footer });
  } catch (error) {
    next(error);
  }
});

router.get("/pages", async (_req, res, next) => {
  try {
    const pages = await CmsPage.findAll({ order: [["id", "ASC"]] });
    res.json(pages);
  } catch (error) {
    next(error);
  }
});

router.get("/pages/:slug", async (req, res, next) => {
  try {
    const page = await CmsPage.findOne({ where: { slug: req.params.slug } });
    if (!page) {
      return res.status(404).json({ message: "Хуудас олдсонгүй" });
    }
    res.json(page);
  } catch (error) {
    next(error);
  }
});

router.put("/pages/:slug", async (req, res, next) => {
  try {
    const page = await CmsPage.findOne({ where: { slug: req.params.slug } });
    if (!page) {
      return res.status(404).json({ message: "Хуудас олдсонгүй" });
    }
    if (req.body.title !== undefined) page.title = req.body.title;
    if (req.body.sections !== undefined) page.sections = req.body.sections;
    await page.save();
    res.json(page);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
