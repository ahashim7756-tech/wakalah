javascript
// =============================================
// calculations.js - عقل النظام المحاسبي
// المسؤول عن جميع العمليات الحسابية بدقة 100%
// =============================================

/**
 * دالة حساب إجمالي المنتج (الكمية × السعر)
 * @param {number} quantity - الكمية
 * @param {number} price - السعر
 * @returns {number} - إجمالي المنتج
 */
function calculateItemTotal(quantity, price) {
    if (quantity <= 0 || price <= 0) return 0;
    return quantity * price;
}

/**
 * دالة حساب إجمالي المنتجات (مجموع الأصناف)
 * @param {Array} items - مصفوفة الأصناف (كل صنف يحتوي على quantity, price)
 * @returns {number} - إجمالي المبيعات
 */
function calculateTotalSales(items) {
    if (!items || !Array.isArray(items) || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return total + (quantity * price);
    }, 0);
}

/**
 * دالة حساب تكلفة المنتجات (سعر الشراء)
 * @param {Array} items - مصفوفة الأصناف (كل صنف يحتوي على quantity, costPerUnit)
 * @returns {number} - إجمالي التكلفة
 */
function calculateTotalCost(items) {
    if (!items || !Array.isArray(items) || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const cost = parseFloat(item.costPerUnit) || 0;
        return total + (quantity * cost);
    }, 0);
}

/**
 * دالة حساب تكلفة العمالة (الأيام × الأجر اليومي)
 * @param {Array} workers - مصفوفة العمال (كل عامل يحتوي على days, dailyWage)
 * @returns {number} - إجمالي تكلفة العمالة
 */
function calculateWorkersCost(workers) {
    if (!workers || !Array.isArray(workers) || workers.length === 0) return 0;
    
    return workers.reduce((total, worker) => {
        const days = parseFloat(worker.days) || 0;
        const wage = parseFloat(worker.dailyWage) || 0;
        return total + (days * wage);
    }, 0);
}

/**
 * الدالة الرئيسية - حساب صافي الربح (بمنع النتائج السالبة أو الصفر إن لزم)
 * @param {Object} params - معاملات الحساب
 * @param {number} params.totalSales - إجمالي المبيعات
 * @param {number} params.totalCost - إجمالي التكلفة (سعر الشراء)
 * @param {number} params.workersCost - تكلفة العمالة
 * @param {number} params.commissionRate - نسبة العمولة (مثلاً 10 تعني 10%)
 * @param {number} params.handlingCost - تكلفة العتالة
 * @param {number} params.advance - السلفة (إن وجدت)
 * @param {boolean} params.preventZero - منع النتيجة صفر (إذا أردت ألا تقل عن حد معين)
 * @param {number} params.minimumProfit - الحد الأدنى للربح (إذا منع الصفر)
 * @returns {Object} - نتائج الحسابات التفصيلية
 */
function calculateNetProfit(params) {
    // استخراج المعاملات مع قيم افتراضية آمنة
    const {
        totalSales = 0,
        totalCost = 0,
        workersCost = 0,
        commissionRate = 0,
        handlingCost = 0,
        advance = 0,
        preventZero = false,
        minimumProfit = 0.01
    } = params;

    // التحقق من صحة المدخلات
    const validTotalSales = Math.max(0, parseFloat(totalSales) || 0);
    const validTotalCost = Math.max(0, parseFloat(totalCost) || 0);
    const validWorkersCost = Math.max(0, parseFloat(workersCost) || 0);
    const validCommissionRate = Math.max(0, Math.min(100, parseFloat(commissionRate) || 0));
    const validHandlingCost = Math.max(0, parseFloat(handlingCost) || 0);
    const validAdvance = Math.max(0, parseFloat(advance) || 0);

    // حساب العمولة (نسبة من إجمالي المبيعات)
    const commission = (validTotalSales * validCommissionRate) / 100;

    // إجمالي التكاليف
    const totalExpenses = validTotalCost + validWorkersCost + validHandlingCost + commission;

    // صافي الربح قبل السلفة
    const grossProfit = validTotalSales - totalExpenses;

    // صافي الربح بعد خصم السلفة
    let netProfit = grossProfit - validAdvance;

    // تطبيق منع الصفر أو السالب إذا طُلب
    if (preventZero && netProfit <= 0) {
        netProfit = minimumProfit;
    }

    // إرجاع جميع التفاصيل المحاسبية
    return {
        // المدخلات
        totalSales: validTotalSales,
        totalCost: validTotalCost,
        workersCost: validWorkersCost,
        commissionRate: validCommissionRate,
        handlingCost: validHandlingCost,
        advance: validAdvance,

        // المخرجات المحسوبة
        commission: commission,
        totalExpenses: totalExpenses,
        grossProfit: grossProfit,
        netProfit: netProfit,

        // نسب مئوية للمساعدة في التحليل
        profitMargin: validTotalSales > 0 ? (netProfit / validTotalSales) * 100 : 0,
        expenseRatio: validTotalSales > 0 ? (totalExpenses / validTotalSales) * 100 : 0,

        // حالة الربح
        isProfitable: netProfit > 0,
        isLoss: netProfit < 0,
        isBreakEven: netProfit === 0
    };
}

/**
 * دالة حساب صافي الربح المبسطة (للاستخدام السريع)
 * @param {number} quantity - الكمية
 * @param {number} price - سعر البيع
 * @param {number} costPrice - سعر الشراء
 * @param {number} commissionRate - نسبة العمولة
 * @param {number} handlingCost - تكلفة العتالة
 * @param {number} advance - السلفة
 * @returns {number} - صافي الربح
 */
function simpleNetProfit(quantity, price, costPrice, commissionRate = 10, handlingCost = 0, advance = 0) {
    const totalSales = quantity * price;
    const totalCost = quantity * costPrice;
    const commission = (totalSales * commissionRate) / 100;
    
    return totalSales - totalCost - commission - handlingCost - advance;
}

/**
 * دالة حساب الربح من صفقة واحدة
 * @param {Object} sale - بيانات الصفقة
 * @returns {Object} - تفاصيل الربح
 */
function calculateSaleProfit(sale) {
    if (!sale) return null;

    const {
        items = [],
        workers = [],
        handlingCost = 0,
        commissionRate = 10,
        advance = 0
    } = sale;

    // حساب إجمالي المبيعات من الأصناف
    const totalSales = items.reduce((sum, item) => {
        return sum + ((item.quantity || 0) * (item.pricePerUnit || 0));
    }, 0);

    // حساب إجمالي التكلفة من الأصناف
    const totalCost = items.reduce((sum, item) => {
        return sum + ((item.quantity || 0) * (item.costPerUnit || 0));
    }, 0);

    // حساب تكلفة العمالة
    const workersCost = workers.reduce((sum, worker) => {
        return sum + ((worker.days || 0) * (worker.dailyWage || 0));
    }, 0);

    // حساب صافي الربح
    return calculateNetProfit({
        totalSales,
        totalCost,
        workersCost,
        commissionRate,
        handlingCost,
        advance
    });
}

/**
 * دالة التحقق من صحة الأرقام (منع الأخطاء الحسابية)
 * @param {any} value - القيمة المراد التحقق منها
 * @returns {number} - رقم صالح
 */
function validateNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) ? num : 0;
}

/**
 * دالة تنسيق العملة
 * @param {number} value - القيمة الرقمية
 * @param {string} currency - رمز العملة (افتراضي ج.م)
 * @returns {string} - نص منسق
 */
function formatCurrency(value, currency = 'ج.م') {
    const validValue = validateNumber(value);
    return `${validValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ${currency}`;
}

// تصدير الدوال للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateItemTotal,
        calculateTotalSales,
        calculateTotalCost,
        calculateWorkersCost,
        calculateNetProfit,
        simpleNetProfit,
        calculateSaleProfit,
        validateNumber,
        formatCurrency
    };
}
