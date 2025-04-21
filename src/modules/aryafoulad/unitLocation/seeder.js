const UnitLocation = require('./model');

async function seedUnitLocations() {
    try {
        // اضافه کردن شرکت بازرسی مهندسی آریا فولاد قرن به عنوان واحد پیش‌فرض
        await UnitLocation.findOrCreate({
            where: { name: 'شرکت بازرسی مهندسی آریا فولاد قرن' },
            defaults: {
                name: 'شرکت بازرسی مهندسی آریا فولاد قرن',
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