require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Car, Inquiry, sequelize } = require("./models");

const featuredSlugs = [
  "toyota-bz3x",
  "byd-sealion-7",
  "tesla-model-y",
  "zeekr-7x",
];

function loadCarsFromFrontend() {
  const carsPath = path.join(__dirname, "../../car/src/data/cars.ts");
  const source = fs.readFileSync(carsPath, "utf8");
  const start = source.indexOf("export const cars: Car[] = ");
  const end = source.indexOf("\nexport const featuredSlugs");
  if (start === -1 || end === -1) {
    throw new Error("Could not locate cars array in car/src/data/cars.ts");
  }
  const literal = source.slice(start + "export const cars: Car[] = ".length, end).trim();
  const cars = eval(literal.replace(/;$/, ""));
  return cars.map((car) => ({
    ...car,
    featured: featuredSlugs.includes(car.slug),
    gallery: car.gallery?.length ? car.gallery : [car.image],
    highlights: car.highlights || [],
  }));
}

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  const cars = loadCarsFromFrontend();
  await Inquiry.destroy({ where: {} });
  await Car.destroy({ where: {} });
  await Car.bulkCreate(cars);
  await Inquiry.bulkCreate([
    {
      name: "Бат-Эрдэнэ",
      email: "bat@example.com",
      phone: "99112233",
      car: "Tesla Model Y",
      notes: "Цагаан өнгө, энэ сард үзэх хүсэлтэй",
      status: "new",
    },
    {
      name: "Oyunaa",
      email: "oyunaa@example.com",
      phone: "88001122",
      car: "BYD Sealion 7",
      notes: "Санхүүжилтийн нөхцөл асуусан",
      status: "contacted",
    },
  ]);

  console.log(`Seeded ${cars.length} cars and sample inquiries`);
  await sequelize.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
