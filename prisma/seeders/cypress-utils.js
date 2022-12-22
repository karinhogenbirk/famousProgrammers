const programmers = require("../../programmers.json");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const prisma = require("../client");

async function seeddb() {
  console.log("Test Cypress");
  const programmer = await prisma.programmer.createMany({
    data: programmers,
  });

  const newUser = await prisma.user.upsert({
    data: {
      password: "$2b$10$qm3mb3KenoJFIwY55XqcTOUl8xlXZDA0OcIPwVM8uC.Tk72ICcwmO",
    },
    where: {
      email: "karinhogenbirk93@gmail.com",
    },
  });
  return null;
}

module.exports = { seeddb };
