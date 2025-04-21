const Permission = require("./model");
const seederData = require("./seederData.json");

async function seedPermissions() {
  try {
    for (const permissionData of seederData) {
      await Permission.findOrCreate({
        where: { name: permissionData.name },
        defaults: permissionData
      });
    }
    console.log("✅ Permissions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding permissions:", error);
  }
}

module.exports = seedPermissions; 