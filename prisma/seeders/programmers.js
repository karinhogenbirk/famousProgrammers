// database
// const programmers = require("../../programmers.json");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// to fill the database
// async function main() {
//   const programmer = await prisma.programmer.createMany({
//     data: programmers,
//   });
//   console.log(programmer);
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
