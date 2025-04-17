const UnitLocation = require('./model');

async function seedUnitLocations() {
    try {
        // اضافه کردن آریا فولاد قرن اهواز به عنوان واحد پیش‌فرض
        await UnitLocation.findOrCreate({
            where: { name: 'آریا فولاد قرن اهواز' },
            defaults: {
                name: 'آریا فولاد قرن اهواز',
                latitude: 31.348808655624506,
                longitude: 48.72288275224326,
                isDefault: true
            }
        });

        console.log('✅ Default unit location seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding default unit location:', error);
        throw error;
    }
}

module.exports = seedUnitLocations; 