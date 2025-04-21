const mysqlConnection = require("./mysql/connection");
const mongoDBConnection = require("./mongodb/connection");
const seedMySQLDatabase = require("./mysql/seeders");
const seedMongoDB = require("./mongodb/seeders");

// Import MySQL models
require("../../modules/user/user/model");
require("../../modules/user/role/model");
require("../../modules/user/permission/model");
require("../../modules/user/associations");
require("../../modules/aryafoulad/missionOrder/model");
require("../../modules/aryafoulad/rateSettings/model");

/**
 * راه‌اندازی اتصال به دیتابیس‌ها و اجرای migrations
 * @param {Object} options - تنظیمات راه‌اندازی
 * @param {boolean} options.force - آیا جداول موجود حذف و دوباره ساخته شوند
 * @param {boolean} options.seed - آیا داده‌های اولیه وارد شوند
 * @param {boolean} options.useMongoDB - آیا از MongoDB استفاده شود
 */
const initializeDatabase = async (options = { force: false, seed: false, useMongoDB: false }) => {
  try {
    // اتصال و راه‌اندازی MySQL
    await mysqlConnection.authenticate();
    console.log("✅ MySQL Connection has been established successfully.");

    if (options.force) {
      // غیرفعال کردن موقت Foreign Key Checks
      await mysqlConnection.query('SET FOREIGN_KEY_CHECKS = 0');
      await mysqlConnection.sync({ force: true });
      await mysqlConnection.query('SET FOREIGN_KEY_CHECKS = 1');
    } else {
      await mysqlConnection.sync();
    }
    
    console.log(`✅ MySQL Database ${options.force ? "recreated" : "synchronized"} successfully.`);

    if (options.seed) {
      await seedMySQLDatabase();
      console.log("✅ MySQL Database seeded successfully.");
    }

    // اتصال و راه‌اندازی MongoDB
    if (options.useMongoDB) {
      await mongoDBConnection.connect();
      await mongoDBConnection.authenticate();
      
      if (options.seed) {
        await seedMongoDB();
        console.log("✅ MongoDB Database seeded successfully.");
      }
    }

  } catch (error) {
    console.error("❌ Unable to initialize database:", error);
    throw error;
  }
};

module.exports = initializeDatabase; 