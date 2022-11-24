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

//test users
async function main() {
  const user = await prisma.user.create({
    data: {
      email: "hoihoi@prisma.io",
      password: "hallo",
    },
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
