javascript
// =============================================
// app.js - إدارة الحركات وتفاعل المستخدم
// المسؤول عن عرض الشاشات والتعامل مع الأحداث
// =============================================

// =============================================
// دوال عرض الشاشات الأساسية
// =============================================

// شاشة تسجيل الدخول
function showLogin() {
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `
        <div class="glass-card-dark" style="max-width: 400px; margin: 50px auto;">
            <div style="text-align: center; margin-bottom: 30px;">
                <i class="fas fa-store" style="font-size: 4rem; color: var(--accent);"></i>
                <h1 style="color: white; margin-top: 15px;">نظام إدارة الوكالة</h1>
                <p style="color: rgba(255,255,255,0.8);">الرجاء تسجيل الدخول للمتابعة</p>
            </div>
            
            <div class="form-group">
                <label style="color: white;">اسم المستخدم</label>
                <input type="text" id="username" class="form-control" placeholder="أدخل اسم المستخدم" value="admin">
            </div>
            
            <div class="form-group">
                <label style="color: white;">كلمة المرور</label>
                <input type="password" id="password" class="form-control" placeholder="أدخل كلمة المرور" value="admin">
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 30px;">
                <button id="loginBtn" class="btn btn-primary" style="flex: 2;">
                    <i class="fas fa-sign-in-alt"></i> دخول
                </button>
                <button onclick="showDashboard()" class="btn btn-glass" style="flex: 1;">
                    <i class="fas fa-eye"></i> معاينة
                </button>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                <i class="fas fa-info-circle"></i> للاختبار: admin / admin
            </div>
            
            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
                <span class="shortcut-badge"><i class="fas fa-keyboard"></i> F1 مبيعات</span>
                <span class="shortcut-badge">F2 مشتريات</span>
                <span class="shortcut-badge">F3 عمالة</span>
                <span class="shortcut-badge">F4 رئيسية</span>
            </div>
        </div>
    `;

    document.getElementById('loginBtn')?.addEventListener('click', () => {
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        
        if (username === 'admin' && password === 'admin') {
            showToast('تم تسجيل الدخول بنجاح', 'success');
            showDashboard();
        } else {
            showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        }
    });
}

// لوحة التحكم الرئيسية
function showDashboard() {
    const content = document.getElementById('content');
    if (!content) return;

    refreshData(); // تحديث البيانات

    // حساب الإحصائيات
    const totalSales = Sales.reduce((sum, sale) => sum + (sale.totalSales || 0), 0);
    const totalPurchases = Purchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);
    const totalExpenses = Expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const workersCount = Workers.filter(w => w.status === 'active').length;
    const productsCount = Products.length;
    const netProfit = totalSales - totalPurchases - totalExpenses;

    content.innerHTML = `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h1 style="color: white; font-size: 1.8rem;">
                    <i class="fas fa-tachometer-alt"></i> لوحة التحكم
                </h1>
                <div>
                    <button onclick="showLogin()" class="btn btn-glass">
                        <i class="fas fa-sign-out-alt"></i> خروج
                    </button>
                </div>
            </div>

            <!-- بطاقات الخزينة -->
            <div class="treasury-cards">
                <div class="treasury-card">
                    <div class="label"><i class="fas fa-cash-register"></i> إجمالي المبيعات</div>
                    <div class="value">${formatNumber(totalSales)} ${SystemSettings.currency}</div>
                    <div class="change"><i class="fas fa-arrow-up"></i> من ${Sales.length} عملية</div>
                </div>
                <div class="treasury-card" style="background: linear-gradient(145deg, #1e4a6f, #0f2c40);">
                    <div class="label"><i class="fas fa-shopping-cart"></i> إجمالي المشتريات</div>
                    <div class="value">${formatNumber(totalPurchases)} ${SystemSettings.currency}</div>
                    <div class="change"><i class="fas fa-arrow-down"></i> من ${Purchases.length} عملية</div>
                </div>
                <div class="treasury-card" style="background: linear-gradient(145deg, #6f4f1e, #4a3514);">
                    <div class="label"><i class="fas fa-file-invoice"></i> إجمالي المصروفات</div>
                    <div class="value">${formatNumber(totalExpenses)} ${SystemSettings.currency}</div>
                    <div class="change">آخر شهر: ${formatNumber(Expenses.slice(-30).reduce((s, e) => s + (e.amount || 0), 0))}</div>
                </div>
                <div class="treasury-card" style="background: linear-gradient(145deg, #1e6f4a, #144a32);">
                    <div class="label"><i class="fas fa-chart-line"></i> صافي الأرباح</div>
                    <div class="value" style="color: ${netProfit >= 0 ? '#a5d6a5' : '#ffb3b3'}">${formatNumber(netProfit)} ${SystemSettings.currency}</div>
                    <div class="change">${netProfit >= 0 ? 'ربح' : 'خسارة'}</div>
                </div>
            </div>

            <!-- إحصائيات سريعة -->
            <div class="glass-card" style="margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    <div><i class="fas fa-box"></i> منتجات: <strong>${productsCount}</strong></div>
                    <div><i class="fas fa-users"></i> عمالة نشطة: <strong>${workersCount}</strong></div>
                    <div><i class="fas fa-hand-holding-usd"></i> نسبة العمولة: <strong>${SystemSettings.commissionRate}%</strong></div>
                    <div><i class="fas fa-calendar"></i> تاريخ: <strong>${new Date().toLocaleDateString('ar-EG')}</strong></div>
                </div>
            </div>

            <!-- أزرار الوظائف الرئيسية -->
            <div class="grid grid-6" style="gap: 15px;">
                <button onclick="showProductsList()" class="btn btn-glass" style="flex-direction: column; padding: 20px;">
                    <i class="fas fa-box" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>المنتجات</span>
                    <span class="shortcut-badge" style="margin-top: 5px;">F5</span>
                </button>
                <button onclick="showPurchasesList()" class="btn btn-glass" style="flex-direction: column; padding: 20px;">
                    <i class="fas fa-truck" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>المشتريات</span>
                    <span class="shortcut-badge">F2</span>
                </button>
                <button onclick="showSalesList()" class="btn btn-glass" style="flex-direction: column; padding: 20px;">
                    <i class="fas fa-cash-register" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>المبيعات</span>
                    <span class="shortcut-badge">F1</span>
                </button>
                <button onclick="showWorkersList()" class="btn btn-glass" style="flex-direction: column; padding: 20px;">
                    <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>العمالة</span>
                    <span class="shortcut-badge">F3</span>
                </button>
                <button onclick="showExpensesList()" class="btn btn-glass" style="flex-direction: column; padding: 20px;">
                    <i class="fas fa-file-invoice" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>المصروفات</span>
                    <span class="shortcut-badge">F6</span>
                </button>
                <button onclick="showSettings()" class="btn btn-glass" style="flex-direction: column; padding: 20px;">
                    <i class="fas fa-cog" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <span>الإعدادات</span>
                    <span class="shortcut-badge">F12</span>
                </button>
            </div>

            <!-- آخر العمليات -->
            <div class="glass-card" style="margin-top: 30px;">
                <h3 style="color: white; margin-bottom: 15px;"><i class="fas fa-history"></i> آخر العمليات</h3>
                <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px;">
                    ${generateRecentActivities()}
                </div>
            </div>
        </div>
    `;
}

// دالة مساعدة لعرض آخر الأنشطة
function generateRecentActivities() {
    let activities = [];
    
    // آخر 3 مبيعات
    Sales.slice(-3).forEach(sale => {
        activities.push(`<div><i class="fas fa-cash-register" style="color: #74c69d;"></i> مبيعات: ${sale.buyer || 'زبون'} - ${formatNumber(sale.totalSales)} ${SystemSettings.currency} (${sale.date || 'بدون تاريخ'})</div>`);
    });
    
    // آخر 3 مشتريات
    Purchases.slice(-3).forEach(purchase => {
        activities.push(`<div><i class="fas fa-truck" style="color: #40916c;"></i> مشتريات: ${purchase.supplier || 'مورد'} - ${formatNumber(purchase.totalCost)} ${SystemSettings.currency}</div>`);
    });
    
    if (activities.length === 0) {
        return '<p style="color: rgba(255,255,255,0.7); text-align: center;">لا توجد عمليات بعد</p>';
    }
    
    return activities.join('<hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">');
}

// =============================================
// إدارة المنتجات
// =============================================

// عرض قائمة المنتجات
function showProductsList() {
    const content = document.getElementById('content');
    if (!content) return;

    refreshData();

    if (Products.length === 0) {
        content.innerHTML = `
            <div class="glass-card-dark" style="text-align: center; padding: 50px;">
                <i class="fas fa-box-open" style="font-size: 5rem; color: rgba(255,255,255,0.5); margin-bottom: 20px;"></i>
                <h2 style="color: white; margin-bottom: 20px;">لا يوجد منتجات بعد</h2>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="showProductForm()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> إضافة منتج
                    </button>
                    <button onclick="showDashboard()" class="btn btn-glass">
                        <i class="fas fa-arrow-right"></i> عودة
                    </button>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h1 style="color: white;"><i class="fas fa-boxes"></i> قائمة المنتجات</h1>
                <div>
                    <button onclick="showProductForm()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> إضافة منتج
                    </button>
                    <button onclick="showDashboard()" class="btn btn-glass">
                        <i class="fas fa-home"></i> الرئيسية
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>المنتج</th>
                            <th>السعر</th>
                            <th>التكلفة</th>
                            <th>الكمية</th>
                            <th>الربح المتوقع</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    Products.forEach((product, index) => {
        const expectedProfit = (product.price || 0) - (product.cost || 0);
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${product.name || 'غير محدد'}</strong></td>
                <td>${formatNumber(product.price)} ${SystemSettings.currency}</td>
                <td>${formatNumber(product.cost || 0)} ${SystemSettings.currency}</td>
                <td>${formatNumber(product.quantity || 0)}</td>
                <td style="color: ${expectedProfit >= 0 ? '#28a745' : '#dc3545'};">${formatNumber(expectedProfit)} ${SystemSettings.currency}</td>
                <td>
                    <button onclick="editProduct(${product.id})" class="btn btn-sm" style="background: #17a2b8; color: white; padding: 5px 10px; border-radius: 5px;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="btn btn-sm" style="background: #dc3545; color: white; padding: 5px 10px; border-radius: 5px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// نموذج إضافة منتج
function showProductForm() {
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <div class="glass-card-dark">
                <h2 style="color: white; margin-bottom: 20px;"><i class="fas fa-plus-circle"></i> إضافة منتج جديد</h2>
                
                <div class="form-group">
                    <label style="color: white;">اسم المنتج</label>
                    <input type="text" id="productName" class="form-control" placeholder="أدخل اسم المنتج">
                </div>
                
                <div class="grid grid-2" style="gap: 15px;">
                    <div class="form-group">
                        <label style="color: white;">سعر البيع (${SystemSettings.currency})</label>
                        <input type="number" id="productPrice" class="form-control" placeholder="0" min="0" step="0.01" value="0">
                    </div>
                    <div class="form-group">
                        <label style="color: white;">سعر الشراء (${SystemSettings.currency})</label>
                        <input type="number" id="productCost" class="form-control" placeholder="0" min="0" step="0.01" value="0">
                    </div>
                </div>
                
                <div class="grid grid-2" style="gap: 15px;">
                    <div class="form-group">
                        <label style="color: white;">الكمية المتوفرة</label>
                        <input type="number" id="productQuantity" class="form-control" placeholder="0" min="0" step="1" value="0">
                    </div>
                    <div class="form-group">
                        <label style="color: white;">الحد الأدنى</label>
                        <input type="number" id="productMin" class="form-control" placeholder="0" min="0" step="1" value="5">
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">الوصف</label>
                    <textarea id="productDescription" class="form-control" rows="3" placeholder="وصف المنتج..."></textarea>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="saveProductBtn" class="btn btn-primary" style="flex: 2;">
                        <i class="fas fa-save"></i> حفظ المنتج
                    </button>
                    <button onclick="showProductsList()" class="btn btn-glass" style="flex: 1;">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
}

// حفظ المنتج
function saveProduct() {
    const name = document.getElementById('productName')?.value.trim();
    const price = parseFloat(document.getElementById('productPrice')?.value) || 0;
    const cost = parseFloat(document.getElementById('productCost')?.value) || 0;
    const quantity = parseInt(document.getElementById('productQuantity')?.value) || 0;
    const minQuantity = parseInt(document.getElementById('productMin')?.value) || 5;
    const description = document.getElementById('productDescription')?.value.trim() || '';

    if (!name) {
        showToast('يرجى إدخال اسم المنتج', 'error');
        return;
    }

    if (price <= 0) {
        showToast('يرجى إدخال سعر صحيح', 'error');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        cost: cost || price * 0.7, // إذا لم يتم إدخال تكلفة، افترض 70% من السعر
        quantity,
        minQuantity,
        description,
        createdAt: new Date().toISOString()
    };

    Products.push(newProduct);
    Storage.set('wakala_products', Products);

    showToast('تم إضافة المنتج بنجاح', 'success');
    showProductsList();
}

// =============================================
// إدارة المبيعات
// =============================================

// نموذج تسجيل مبيعات
function showSaleForm() {
    const content = document.getElementById('content');
    if (!content) return;

    refreshData();

    if (Products.length === 0) {
        showToast('يجب إضافة منتجات أولاً', 'error');
        showProductsList();
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    content.innerHTML = `
        <div style="max-width: 1000px; margin: 0 auto;">
            <div class="glass-card-dark">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: white;"><i class="fas fa-cash-register"></i> تسجيل مبيعات</h2>
                    <button onclick="showSalesList()" class="btn btn-glass">
                        <i class="fas fa-list"></i> السجل
                    </button>
                </div>
                
                <div class="grid grid-2" style="gap: 15px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="color: white;">المشتري</label>
                        <input type="text" id="buyer" class="form-control" placeholder="اسم المشتري">
                    </div>
                    <div class="form-group">
                        <label style="color: white;">التاريخ</label>
                        <input type="date" id="saleDate" class="form-control" value="${today}">
                    </div>
                </div>
                
                <h3 style="color: white; margin: 20px 0 10px;"><i class="fas fa-shopping-basket"></i> المنتجات المباعة</h3>
                <div id="sale-items-container">
                    ${generateSaleItemRow(0)}
                </div>
                
                <button id="addSaleItemBtn" class="btn btn-secondary" style="margin: 15px 0; width: 100%;">
                    <i class="fas fa-plus"></i> إضافة منتج آخر
                </button>
                
                <h3 style="color: white; margin: 20px 0 10px;"><i class="fas fa-users"></i> العمالة المشاركة</h3>
                <div id="sale-workers-container">
                    ${generateSaleWorkerRow(0)}
                </div>
                
                <button id="addSaleWorkerBtn" class="btn btn-secondary" style="margin: 15px 0; width: 100%;">
                    <i class="fas fa-user-plus"></i> إضافة عامل
                </button>
                
                <div class="grid grid-2" style="gap: 15px; margin: 20px 0;">
                    <div class="form-group">
                        <label style="color: white;">تكلفة العتالة (${SystemSettings.currency})</label>
                        <input type="number" id="handlingCost" class="form-control" value="0" min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label style="color: white;">عدد العتالة</label>
                        <input type="number" id="handlingCount" class="form-control" value="0" min="0" step="1">
                    </div>
                </div>
                
                <div class="grid grid-3" style="gap: 15px; margin: 20px 0; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;">
                    <div class="form-group">
                        <label style="color: white;">نسبة العمولة (%)</label>
                        <input type="number" id="commissionRate" class="form-control" value="${SystemSettings.commissionRate}" min="0" max="100" step="0.1">
                    </div>
                    <div class="form-group">
                        <label style="color: white;">قيمة العمولة</label>
                        <input type="text" id="commissionAmount" class="form-control" readonly placeholder="0">
                    </div>
                    <div class="form-group">
                        <label style="color: white;">صافي الربح</label>
                        <input type="text" id="netProfit" class="form-control" readonly placeholder="0">
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">ملاحظات</label>
                    <textarea id="saleNotes" class="form-control" rows="2" placeholder="أي ملاحظات..."></textarea>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="saveSaleBtn" class="btn btn-primary" style="flex: 2;">
                        <i class="fas fa-save"></i> تسجيل المبيعات
                    </button>
                    <button onclick="showSalesList()" class="btn btn-glass" style="flex: 1;">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;

    // إضافة مستمعي الأحداث
    document.getElementById('addSaleItemBtn')?.addEventListener('click', () => {
        const container = document.getElementById('sale-items-container');
        const itemCount = container.children.length;
        container.insertAdjacentHTML('beforeend', generateSaleItemRow(itemCount));
        attachSaleItemListeners();
        calculateSaleTotals();
    });

    document.getElementById('addSaleWorkerBtn')?.addEventListener('click', () => {
        const container = document.getElementById('sale-workers-container');
        const workerCount = container.children.length;
        container.insertAdjacentHTML('beforeend', generateSaleWorkerRow(workerCount));
        attachSaleWorkerListeners();
        calculateSaleTotals();
    });

    // إضافة مستمعي الأحداث للحقول
    attachSaleItemListeners();
    attachSaleWorkerListeners();

    document.getElementById('handlingCost')?.addEventListener('input', calculateSaleTotals);
    document.getElementById('commissionRate')?.addEventListener('input', calculateSaleTotals);

    document.getElementById('saveSaleBtn')?.addEventListener('click', saveSale);
}

// دالة مساعدة لتوليد صف منتج في المبيعات
function generateSaleItemRow(index) {
    const productsOptions = Products.map(p => 
        `<option value="${p.id}" data-price="${p.price || 0}" data-cost="${p.cost || 0}">${p.name} - ${formatNumber(p.price)} ${SystemSettings.currency}</option>`
    ).join('');

    return `
        <div class="sale-item-row grid grid-4" style="gap: 10px; margin-bottom: 10px;">
            <div style="grid-column: span 2;">
                <select class="sale-product-select form-control">
                    <option value="">اختر منتج</option>
                    ${productsOptions}
                </select>
            </div>
            <div>
                <input type="number" class="sale-quantity form-control" placeholder="الكمية" min="0" step="0.01" value="1">
            </div>
            <div style="display: flex; gap: 5px;">
                <input type="number" class="sale-price form-control" placeholder="السعر" min="0" step="0.01" value="0">
                <button class="remove-sale-item btn btn-danger" style="padding: 5px 10px;" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
}

// دالة مساعدة لتوليد صف عامل في المبيعات
function generateSaleWorkerRow(index) {
    const workersOptions = Workers.filter(w => w.status === 'active').map(w =>
        `<option value="${w.id}" data-wage="${w.dailyWage || 0}">${w.name} - ${formatNumber(w.dailyWage)} ${SystemSettings.currency}/يوم</option>`
    ).join('');

    return `
        <div class="sale-worker-row grid grid-3" style="gap: 10px; margin-bottom: 10px;">
            <div style="grid-column: span 1;">
                <select class="sale-worker-select form-control">
                    <option value="">اختر عامل</option>
                    ${workersOptions}
                </select>
            </div>
            <div>
                <input type="number" class="sale-worker-days form-control" placeholder="الأيام" min="0" step="0.5" value="1">
            </div>
            <div style="display: flex; gap: 5px;">
                <input type="number" class="sale-worker-wage form-control" placeholder="الأجر" min="0" step="0.01" value="0">
                <button class="remove-sale-worker btn btn-danger" style="padding: 5px 10px;" ${index === 0 ? 'disabled' : ''}>
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
}

// إضافة مستمعي الأحداث لمنتجات المبيعات
function attachSaleItemListeners() {
    document.querySelectorAll('.sale-product-select, .sale-quantity, .sale-price').forEach(el => {
        el.removeEventListener('input', calculateSaleTotals);
        el.addEventListener('input', calculateSaleTotals);
    });

    document.querySelectorAll('.remove-sale-item:not([disabled])').forEach(btn => {
        btn.removeEventListener('click', removeSaleItem);
        btn.addEventListener('click', removeSaleItem);
    });
}

// إضافة مستمعي الأحداث لعمال المبيعات
function attachSaleWorkerListeners() {
    document.querySelectorAll('.sale-worker-select, .sale-worker-days, .sale-worker-wage').forEach(el => {
        el.removeEventListener('input', calculateSaleTotals);
        el.addEventListener('input', calculateSaleTotals);
    });

    document.querySelectorAll('.remove-sale-worker:not([disabled])').forEach(btn => {
        btn.removeEventListener('click', removeSaleWorker);
        btn.addEventListener('click', removeSaleWorker);
    });
}

// حذف صف منتج
function removeSaleItem(e) {
    const row = e.target.closest('.sale-item-row');
    if (row) {
        row.remove();
        calculateSaleTotals();
    }
}

// حذف صف عامل
function removeSaleWorker(e) {
    const row = e.target.closest('.sale-worker-row');
    if (row) {
        row.remove();
        calculateSaleTotals();
    }
}

// حساب مجاميع المبيعات
function calculateSaleTotals() {
    try {
        // جمع بيانات المنتجات
        const items = [];
        document.querySelectorAll('.sale-item-row').forEach(row => {
            const select = row.querySelector('.sale-product-select');
            const quantity = parseFloat(row.querySelector('.sale-quantity')?.value) || 0;
            const price = parseFloat(row.querySelector('.sale-price')?.value) || 0;
            
            if (select?.value && quantity > 0 && price > 0) {
                items.push({
                    productId: select.value,
                    quantity,
                    price,
                    costPerUnit: parseFloat(select.selectedOptions[0]?.dataset.cost) || 0
                });
            }
        });

        // جمع بيانات العمال
        const workers = [];
        document.querySelectorAll('.sale-worker-row').forEach(row => {
            const select = row.querySelector('.sale-worker-select');
            const days = parseFloat(row.querySelector('.sale-worker-days')?.value) || 0;
            const wage = parseFloat(row.querySelector('.sale-worker-wage')?.value) || 0;
            
            if (select?.value && days > 0 && wage > 0) {
                workers.push({ days, wage });
            }
        });

        // حساب المجاميع باستخدام دوال calculations.js
        const totalSales = calculateTotalSales(items);
        const totalCost = calculateTotalCost(items);
        const workersCost = calculateWorkersCost(workers);
        const handlingCost = parseFloat(document.getElementById('handlingCost')?.value) || 0;
        const commissionRate = parseFloat(document.getElementById('commissionRate')?.value) || SystemSettings.commissionRate;

        // حساب صافي الربح
        const result = calculateNetProfit({
            totalSales,
            totalCost,
            workersCost,
            commissionRate,
            handlingCost,
            advance: 0,
            preventZero: !SystemSettings.allowNegativeProfit,
            minimumProfit: SystemSettings.minimumProfit
        });

        // عرض النتائج
        document.getElementById('commissionAmount').value = formatNumber(result.commission);
        document.getElementById('netProfit').value = formatNumber(result.netProfit);

    } catch (error) {
        console.error('خطأ في الحساب:', error);
    }
}

// حفظ المبيعات
function saveSale() {
    try {
        const buyer = document.getElementById('buyer')?.value.trim() || 'زبون';
        const date = document.getElementById('saleDate')?.value || new Date().toISOString().split('T')[0];
        const handlingCost = parseFloat(document.getElementById('handlingCost')?.value) || 0;
        const handlingCount = parseInt(document.getElementById('handlingCount')?.value) || 0;
        const commissionRate = parseFloat(document.getElementById('commissionRate')?.value) || SystemSettings.commissionRate;
        const notes = document.getElementById('saleNotes')?.value.trim() || '';

        // جمع المنتجات
        const items = [];
        document.querySelectorAll('.sale-item-row').forEach(row => {
            const select = row.querySelector('.sale-product-select');
            const quantity = parseFloat(row.querySelector('.sale-quantity')?.value) || 0;
            const price = parseFloat(row.querySelector('.sale-price')?.value) || 0;
            
            if (select?.value && quantity > 0 && price > 0) {
                const product = Products.find(p => p.id == select.value);
                items.push({
                    productId: select.value,
                    productName: product?.name || 'غير محدد',
                    quantity,
                    pricePerUnit: price,
                    costPerUnit: parseFloat(select.selectedOptions[0]?.dataset.cost) || 0,
                    total: quantity * price
                });
            }
        });

        if (items.length === 0) {
            showToast('يرجى إضافة منتج واحد على الأقل', 'error');
            return;
        }

        // جمع العمال
        const workers = [];
        document.querySelectorAll('.sale-worker-row').forEach(row => {
            const select = row.querySelector('.sale-worker-select');
            const days = parseFloat(row.querySelector('.sale-worker-days')?.value) || 0;
            const wage = parseFloat(row.querySelector('.sale-worker-wage')?.value) || 0;
            
            if (select?.value && days > 0 && wage > 0) {
                const worker = Workers.find(w => w.id == select.value);
                workers.push({
                    workerId: select.value,
                    workerName: worker?.name || 'غير محدد',
                    days,
                    dailyWage: wage,
                    total: days * wage
                });
            }
        });

        // حساب المجاميع
        const totalSales = calculateTotalSales(items);
        const totalCost = calculateTotalCost(items);
        const workersCost = calculateWorkersCost(workers) + handlingCost;
        const commission = (totalSales * commissionRate) / 100;
        const netProfit = totalSales - totalCost - workersCost - commission;

        // إنشاء كائن المبيعة
        const sale = {
            id: Date.now(),
            buyer,
            date,
            items,
            workers,
            handlingCost,
            handlingCount,
            commissionRate,
            commission,
            totalSales,
            totalCost,
            workersCost,
            netProfit,
            notes,
            createdAt: new Date().toISOString()
        };

        // حفظ في المصفوفة والتخزين
        Sales.push(sale);
        Storage.set('wakala_sales', Sales);

        showToast('تم تسجيل المبيعات بنجاح', 'success');
        showSalesList();

    } catch (error) {
        console.error('خطأ في حفظ المبيعات:', error);
        showToast('حدث خطأ أثناء الحفظ', 'error');
    }
}

// عرض قائمة المبيعات
function showSalesList() {
    const content = document.getElementById('content');
    if (!content) return;

    refreshData();

    if (Sales.length === 0) {
        content.innerHTML = `
            <div class="glass-card-dark" style="text-align: center; padding: 50px;">
                <i class="fas fa-cash-register" style="font-size: 5rem; color: rgba(255,255,255,0.5); margin-bottom: 20px;"></i>
                <h2 style="color: white; margin-bottom: 20px;">لا يوجد مبيعات بعد</h2>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="showSaleForm()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> تسجيل مبيعات
                    </button>
                    <button onclick="showDashboard()" class="btn btn-glass">
                        <i class="fas fa-arrow-right"></i> عودة
                    </button>
                </div>
            </div>
        `;
        return;
    }

    let totalSalesAmount = 0;
    let totalNetProfit = 0;

    let html = `
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h1 style="color: white;"><i class="fas fa-history"></i> سجل المبيعات</h1>
                <div>
                    <button onclick="showSaleForm()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> تسجيل
                    </button>
                    <button onclick="showDashboard()" class="btn btn-glass">
                        <i class="fas fa-home"></i> الرئيسية
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>التاريخ</th>
                            <th>المشتري</th>
                            <th>عدد المنتجات</th>
                            <th>إجمالي المبيعات</th>
                            <th>التكلفة</th>
                            <th>عمالة</th>
                            <th>العمولة</th>
                            <th>صافي الربح</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    Sales.slice().reverse().forEach((sale, index) => {
        totalSalesAmount += sale.totalSales || 0;
        totalNetProfit += sale.netProfit || 0;

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${sale.date || sale.createdAt?.split('T')[0] || '-'}</td>
                <td>${sale.buyer || 'زبون'}</td>
                <td>${sale.items?.length || 0}</td>
                <td>${formatNumber(sale.totalSales)} ${SystemSettings.currency}</td>
                <td>${formatNumber(sale.totalCost)} ${SystemSettings.currency}</td>
                <td>${formatNumber(sale.workersCost)} ${SystemSettings.currency}</td>
                <td>${formatNumber(sale.commission)} ${SystemSettings.currency}</td>
                <td style="color: ${sale.netProfit >= 0 ? '#28a745' : '#dc3545'}; font-weight: bold;">
                    ${formatNumber(sale.netProfit)} ${SystemSettings.currency}
                </td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                    <tfoot>
                        <tr style="background: #f2f2f2; font-weight: bold;">
                            <td colspan="4" style="text-align: left;">الإجمالي:</td>
                            <td>${formatNumber(totalSalesAmount)} ${SystemSettings.currency}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>${formatNumber(totalNetProfit)} ${SystemSettings.currency}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// =============================================
// دوال أخرى سيتم إضافتها بنفس النمط:
// - showPurchasesList(), showPurchaseForm(), savePurchase()
// - showWorkersList(), showWorkerForm(), saveWorker()
// - showExpensesList(), showExpenseForm(), saveExpense()
// - showSettings(), saveSettings()
// - deleteProduct(), deleteWorker(), deleteExpense()
// =============================================

// تصدير الدوال للاستخدام العام
window.showLogin = showLogin;
window.showDashboard = showDashboard;
window.showProductsList = showProductsList;
window.showProductForm = showProductForm;
window.showSaleForm = showSaleForm;
window.showSalesList = showSalesList;
window.editProduct = (id) => showToast('جاري تطوير خاصية التعديل', 'info');
window.deleteProduct = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        Products = Products.filter(p => p.id !== id);
        Storage.set('wakala_products', Products);
        showToast('تم الحذف بنجاح', 'success');
        showProductsList();
    }
};
