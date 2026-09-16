const { SiteChrome } = require("../models/SiteChrome");
const { CmsPage } = require("../models/CmsPage");
const { defaultHeader, defaultFooter, defaultPages } = require("../data/cmsDefaults");

async function ensureCms() {
  await SiteChrome.findOrCreate({
    where: { id: 1 },
    defaults: { id: 1, header: defaultHeader, footer: defaultFooter },
  });

  for (const page of defaultPages) {
    const [record, created] = await CmsPage.findOrCreate({
      where: { slug: page.slug },
      defaults: page,
    });
    if (!created && page.slug === "about") {
      const types = (record.sections || []).map((section) => section.type);
      if (!types.includes("storySplit") || !types.includes("team")) {
        record.title = page.title;
        record.sections = page.sections;
        await record.save();
      }
    }
  }
}

module.exports = { ensureCms };
