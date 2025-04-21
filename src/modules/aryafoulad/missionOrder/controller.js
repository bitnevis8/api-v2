const BaseController = require('../../../core/baseController');
const MissionOrder = require('./model');
const { Op } = require('sequelize');

class MissionOrderController extends BaseController {
    constructor() {
        super(MissionOrder);
        this.model = MissionOrder;
    }

    async getAll(req, res) {
        try {
            const docs = await this.model.findAll();
            
            // Parse destinations for each document
            docs.forEach(doc => {
                if (doc.destinations) {
                    try {
                        doc.destinations = JSON.parse(doc.destinations);
                    } catch (e) {
                        console.error('Error parsing destinations:', e);
                        doc.destinations = [];
                    }
                }
            });
            
            return this.response(res, 200, true, 'تمام حکم‌های ماموریت دریافت شدند.', docs);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در دریافت حکم‌های ماموریت.', null, err);
        }
    }

    async getById(req, res) {
        try {
            const doc = await this.model.findByPk(req.params.id);
            if (!doc) return this.response(res, 404, false, 'حکم ماموریت یافت نشد.');
            
            // Parse destinations from JSON string
            if (doc.destinations) {
                try {
                    doc.destinations = JSON.parse(doc.destinations);
                } catch (e) {
                    console.error('Error parsing destinations:', e);
                    doc.destinations = [];
                }
            }
            
            return this.response(res, 200, true, 'حکم ماموریت یافت شد.', doc);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در دریافت حکم ماموریت.', null, err);
        }
    }

    async create(req, res) {
        try {
            console.log("=== Request Body ===");
            console.log(JSON.stringify(req.body, null, 2));
            
            // تبدیل آرایه مقصدها به رشته
            const destinations = Array.isArray(req.body.destinations) ? req.body.destinations : [];
            
            // محاسبه مسافت و زمان برای یک یا چند مقصد
            let totalDistance = 0;
            let roundTripDistance = 0;
            let estimatedTime = req.body.estimatedTime || '0';
            let estimatedReturnTime = req.body.estimatedReturnTime || '0';
            
            if (destinations.length > 0) {
                // اگر فقط یک مقصد داریم
                if (destinations.length === 1) {
                    totalDistance = parseFloat(destinations[0].distance) || 0;
                    roundTripDistance = totalDistance * 2; // رفت و برگشت
                } else {
                    // محاسبه مسافت برای چند مقصد
                    for (let i = 0; i < destinations.length; i++) {
                        if (destinations[i].distance) {
                            totalDistance += parseFloat(destinations[i].distance);
                        }
                    }
                    roundTripDistance = totalDistance * 2;
                }
            }

            // استفاده از هزینه نهایی که از فرانت‌اند ارسال شده است
            const ratePerKm = parseFloat(req.body.ratePerKm) || 2500;
            const finalCost = parseFloat(req.body.finalCost) || 0;

            console.log("=== Calculated Values ===");
            console.log("totalDistance:", totalDistance);
            console.log("roundTripDistance:", roundTripDistance);
            console.log("estimatedTime:", estimatedTime);
            console.log("estimatedReturnTime:", estimatedReturnTime);
            console.log("ratePerKm:", ratePerKm);
            console.log("finalCost:", finalCost);

            // Convert string values to numbers and handle destinations
            const data = {
                firstName: req.body.firstName || null,
                lastName: req.body.lastName || null,
                personnelNumber: req.body.personnelNumber || null,
                fromUnit: req.body.fromUnit || null,
                day: req.body.day || null,
                time: req.body.time || null,
                destinations: JSON.stringify(destinations),
                missionCoordinates: req.body.missionCoordinates || null,
                missionSubject: req.body.missionSubject || null,
                missionDescription: req.body.missionDescription || null,
                companions: req.body.companions || null,
                transport: req.body.transport || null,
                totalWeightKg: req.body.totalWeightKg ? parseFloat(req.body.totalWeightKg) : null,
                distance: totalDistance,
                roundTripDistance: roundTripDistance,
                estimatedTime: estimatedTime,
                estimatedReturnTime: estimatedReturnTime,
                sessionCode: req.body.sessionCode || null,
                ratePerKm: ratePerKm,
                finalCost: finalCost
            };
            
            console.log("=== Processed Data ===");
            console.log(JSON.stringify(data, null, 2));
            
            const doc = await MissionOrder.create(data);
            
            // تبدیل destinations به آرایه قبل از ارسال پاسخ
            if (doc.destinations) {
                try {
                    doc.destinations = JSON.parse(doc.destinations);
                } catch (e) {
                    console.error('Error parsing destinations:', e);
                    doc.destinations = [];
                }
            }
            
            return this.response(res, 201, true, 'حکم ماموریت با موفقیت ایجاد شد.', doc);
        } catch (err) {
            console.error("Error details:", err);
            console.error("Error message:", err.message);
            console.error("Error stack:", err.stack);
            return this.response(res, 500, false, 'خطا در ایجاد حکم ماموریت: ' + err.message, null, err);
        }
    }

    async update(req, res) {
        try {
            const doc = await this.model.findByPk(req.params.id);
            if (!doc) return this.response(res, 404, false, 'حکم ماموریت یافت نشد.');
            
            // تبدیل آرایه مقصدها به رشته
            const destinations = Array.isArray(req.body.destinations) ? req.body.destinations : [];
            
            // محاسبه مسافت و زمان برای یک یا چند مقصد
            let totalDistance = 0;
            let roundTripDistance = 0;
            
            if (destinations.length > 0) {
                // اگر فقط یک مقصد داریم
                if (destinations.length === 1) {
                    totalDistance = parseFloat(destinations[0].distance) || 0;
                    roundTripDistance = totalDistance * 2; // رفت و برگشت
                } else {
                    // محاسبه مسافت برای چند مقصد
                    for (let i = 0; i < destinations.length; i++) {
                        if (destinations[i].distance) {
                            totalDistance += parseFloat(destinations[i].distance);
                        }
                    }
                    roundTripDistance = totalDistance * 2;
                }
            }

            // استفاده از هزینه نهایی که از فرانت‌اند ارسال شده است
            const ratePerKm = parseFloat(req.body.ratePerKm) || 2500;
            const finalCost = parseFloat(req.body.finalCost) || 0;

            // Convert string values to numbers and handle destinations
            const data = {
                ...req.body,
                totalWeightKg: req.body.totalWeightKg ? parseFloat(req.body.totalWeightKg) : null,
                distance: totalDistance,
                roundTripDistance: roundTripDistance,
                destinations: JSON.stringify(destinations),
                ratePerKm: ratePerKm,
                finalCost: finalCost
            };
            
            await doc.update(data);
            
            // تبدیل destinations به آرایه قبل از ارسال پاسخ
            if (doc.destinations) {
                try {
                    doc.destinations = JSON.parse(doc.destinations);
                } catch (e) {
                    console.error('Error parsing destinations:', e);
                    doc.destinations = [];
                }
            }
            
            return this.response(res, 200, true, 'حکم ماموریت با موفقیت بروزرسانی شد.', doc);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در بروزرسانی حکم ماموریت.', null, err);
        }
    }

    async delete(req, res) {
        try {
            const doc = await this.model.findByPk(req.params.id);
            if (!doc) return this.response(res, 404, false, 'حکم ماموریت یافت نشد.');
            await doc.destroy();
            return this.response(res, 200, true, 'حکم ماموریت با موفقیت حذف شد.');
        } catch (err) {
            return this.response(res, 500, false, 'خطا در حذف حکم ماموریت.', null, err);
        }
    }

    async search(req, res) {
        try {
            const query = req.query.q;
            const docs = await this.model.findAll({
                where: {
                    missionSubject: {
                        [Op.like]: `%${query}%`
                    }
                }
            });
            return this.response(res, 200, true, 'نتایج جستجو دریافت شد.', docs);
        } catch (err) {
            return this.response(res, 500, false, 'خطا در جستجو.', null, err);
        }
    }
}

module.exports = new MissionOrderController(); 