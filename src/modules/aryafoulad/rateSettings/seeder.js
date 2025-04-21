const RateSetting = require('./model');

const seedRateSettings = async () => {
    try {
        // بررسی وجود نرخ فعال
        const activeRate = await RateSetting.findOne({
            where: { isActive: true }
        });

        if (!activeRate) {
            // ایجاد نرخ پیش‌فرض
            await RateSetting.create({
                ratePerKm: 2500,
                description: 'نرخ پیش‌فرض',
                isActive: true
            });
            console.log('نرخ پیش‌فرض با موفقیت ایجاد شد');
        }
    } catch (error) {
        console.error('خطا در ایجاد نرخ پیش‌فرض:', error);
    }
};

module.exports = seedRateSettings; 