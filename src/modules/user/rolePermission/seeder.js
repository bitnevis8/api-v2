const Role = require("../role/model");
const Permission = require("../permission/model");
const seederData = require("./seederData.json");

async function seedRolePermissions() {
  try {
    for (const { roleName, permissions } of seederData) {
      // پیدا کردن role با نام مشخص شده
      const role = await Role.findOne({ where: { name: roleName } });
      if (!role) {
        console.error(`❌ Role ${roleName} not found`);
        continue;
      }

      // پیدا کردن permission ها
      for (const permissionName of permissions) {
        const permission = await Permission.findOne({ where: { name: permissionName } });
        if (!permission) {
          console.error(`❌ Permission ${permissionName} not found`);
          continue;
        }

        // اضافه کردن permission به role
        await role.addPermission(permission);
      }
    }
    console.log("✅ Role permissions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding role permissions:", error);
  }
}

module.exports = seedRolePermissions; 