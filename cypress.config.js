const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        "db:teardown": async () => {
          const { cleardb } = require("./prisma/utils/cypress-utils");
          return await cleardb();
        },
        "db:seed": async () => {
          const { seeddb } = require("./prisma/seeders/cypress-utils");
          return await seeddb();
        },
      });
    },
  },
});
