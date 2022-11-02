// database
// const programmers = require("../../programmers.json");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// database vullen
// async function main() {
//   const programmer = await prisma.programmer.create({
//     data: programmers,
//   });
//   console.log(programmer);
// }

//test update
// async function main() {
//   const updateProgrammer = await prisma.programmer.update({
//     where: { name: "Karin Hogenbirk" },
//     data: { vote: 1 },
//     // data: { vote: { increment: 1 } },
//   });

//   const programmer = await prisma.programmer.find({
//     where: { name: "Karin Hogenbirk" },
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
