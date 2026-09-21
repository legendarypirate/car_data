const { SiteChrome } = require("../models/SiteChrome");
const { CmsPage } = require("../models/CmsPage");
const { defaultHeader, defaultFooter, defaultPages } = require("../data/cmsDefaults");

async function ensureCms() {
  const chromeCount = await SiteChrome.count();
  if (chromeCount === 0) {
    await SiteChrome.create({
      id: 1,
      header: defaultHeader,
      footer: defaultFooter,
    });
  }

  const pageCount = await CmsPage.count();
  if (pageCount === 0) {
    await CmsPage.bulkCreate(defaultPages);
  }
}

async function resetCmsDefaults() {
  await SiteChrome.destroy({ where: {} });
  await CmsPage.destroy({ where: {} });
  await SiteChrome.create({
    id: 1,
    header: defaultHeader,
    footer: defaultFooter,
  });
  await CmsPage.bulkCreate(defaultPages);
}

module.exports = { ensureCms, resetCmsDefaults };
