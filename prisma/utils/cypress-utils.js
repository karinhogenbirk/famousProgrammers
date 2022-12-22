const prisma = require("../client");

async function cleardb() {
  const programmer = await prisma.programmer.deleteMany({
    where: {},
  });
  return null;
}

module.exports = { cleardb };
