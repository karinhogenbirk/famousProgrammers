const programmers = require("../../programmers.json");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const prisma = require("../client");

async function seeddb() {
  console.log("Test Cypress");
  const programmer = await prisma.programmer.createMany({
    data: programmers,
  });
  return null;
}

module.exports = { seeddb };
