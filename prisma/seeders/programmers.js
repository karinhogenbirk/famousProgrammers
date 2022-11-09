// database
// const programmers = require("../../programmers.json");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// database vullen
// async function main() {
//   const programmer = await prisma.programmer.createMany({
//     data: programmers,
//   });
//   console.log(programmer);
// }

//test users
// async function main() {
//   const user = await prisma.user.create({
//     data: {
//       email: "alice@prisma.io",
//       password: "hallo",
//     },
//   });
//   console.log(user);
// }

//test exists

async function exists(args) {
  const count = await prisma.user.count(args);
  return Boolean(count);
}
async function main() {
  const userExists = await exists({
    where: {
      email: "karinhogenbirk93@gmail.com",
    },
  });
  console.log(userExists);
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
