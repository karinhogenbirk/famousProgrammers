const prisma = require("../client");
const { seeddb } = require("./cypress-utils");

seeddb()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
