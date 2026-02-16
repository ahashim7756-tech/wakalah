// ==================== توافق مع الأسماء القديمة ====================
// هذا لضمان عمل الأيقونات في index.html
window.showDashboard = function() {
    if (typeof showDashboard === 'function') showDashboard();
    else console.error('showDashboard غير موجودة');
};

window.showSaleForm = function() {
    if (typeof showSaleForm === 'function') showSaleForm();
    else console.error('showSaleForm غير موجودة');
};

window.showPurchaseForm = function() {
    if (typeof showPurchaseForm === 'function') showPurchaseForm();
    else console.error('showPurchaseForm غير موجودة');
};

window.showWorkersList = function() {
    if (typeof showWorkersList === 'function') showWorkersList();
    else console.error('showWorkersList غير موجودة');
};

window.showExpensesList = function() {
    if (typeof showExpensesList === 'function') showExpensesList();
    else console.error('showExpensesList غير موجودة');
};

window.showProductsList = function() {
    if (typeof showProductsList === 'function') showProductsList();
    else console.error('showProductsList غير موجودة');
};

window.showFarmersList = function() {
    if (typeof showFarmersList === 'function') showFarmersList();
    else console.error('showFarmersList غير موجودة');
};

window.showReports = function() {
    if (typeof showReports === 'function') showReports();
    else console.error('showReports غير موجودة');
};

window.showSettings = function() {
    if (typeof showSettings === 'function') showSettings();
    else console.error('showSettings غير موجودة');
};
// ==================== نظام التخزين المحلي ====================
class LocalDB {
    constructor() {
        this.stores = ['products', 'purchases', 'sales', 'workers', 'farmers', 'expenses', 'settings'];
        this.init();
    }

    init() {
        this.stores.forEach(store => {
            if (!localStorage.getItem(store)) {
                localStorage.setItem(store, JSON.stringify([]));
            }
        });
        
        // الإعدادات الافتراضية
        if (!localStorage.getItem('settings')) {
            const defaultSettings = {
                commissionRate: 5,
                currency: 'ج.م',
                companyName: 'الوكالة الزراعية'
            };
            localStorage.setItem('settings', JSON.stringify(defaultSettings));
        }
    }

    // المنتجات
    getProducts() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    addProduct(product) {
        const products = this.getProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...product,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        return newProduct;
    }

    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
    }

    // المشتريات
    getPurchases() {
        return JSON.parse(localStorage.getItem('purchases')) || [];
    }

    addPurchase(purchase) {
        const purchases = this.getPurchases();
        const newPurchase = {
            id: Date.now().toString(),
            ...purchase,
            createdAt: new Date().toISOString()
        };
        purchases.push(newPurchase);
        localStorage.setItem('purchases', JSON.stringify(purchases));
        
        // تحديث المخزون
        this.updateStock(purchase.items, 'add');
        return newPurchase;
    }

    // المبيعات
    getSales() {
        return JSON.parse(localStorage.getItem('sales')) || [];
    }

    addSale(sale) {
        const sales = this.getSales();
        const newSale = {
            id: Date.now().toString(),
            ...sale,
            createdAt: new Date().toISOString()
        };
        sales.push(newSale);
        localStorage.setItem('sales', JSON.stringify(sales));
        
        // تحديث المخزون
        this.updateStock(sale.items, 'remove');
        return newSale;
    }

    // تحديث المخزون
    updateStock(items, operation) {
        const products = this.getProducts();
        items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                if (operation === 'add') {
                    product.stock = (product.stock || 0) + item.quantity;
                } else if (operation === 'remove') {
                    product.stock = (product.stock || 0) - item.quantity;
                }
            }
        });
        localStorage.setItem('products', JSON.stringify(products));
    }

    // العمالة
    getWorkers() {
        return JSON.parse(localStorage.getItem('workers')) || [];
    }

    addWorker(worker) {
        const workers = this.getWorkers();
        const newWorker = {
            id: Date.now().toString(),
            ...worker,
            createdAt: new Date().toISOString()
        };
        workers.push(newWorker);
        localStorage.setItem('workers', JSON.stringify(workers));
        return newWorker;
    }

    deleteWorker(id) {
        const workers = this.getWorkers().filter(w => w.id !== id);
        localStorage.setItem('workers', JSON.stringify(workers));
    }

    // الفلاحين
    getFarmers() {
        return JSON.parse(localStorage.getItem('farmers')) || [];
    }

    addFarmer(farmer) {
        const farmers = this.getFarmers();
        const newFarmer = {
            id: Date.now().toString(),
            ...farmer,
            createdAt: new Date().toISOString()
        };
        farmers.push(newFarmer);
        localStorage.setItem('farmers', JSON.stringify(farmers));
        return newFarmer;
    }

    deleteFarmer(id) {
        const farmers = this.getFarmers().filter(f => f.id !== id);
        localStorage.setItem('farmers', JSON.stringify(farmers));
    }

    // المصروفات
    getExpenses() {
        return JSON.parse(localStorage.getItem('expenses')) || [];
    }

    addExpense(expense) {
        const expenses = this.getExpenses();
        const newExpense = {
            id: Date.now().toString(),
            ...expense,
            createdAt: new Date().toISOString()
        };
        expenses.push(newExpense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        return newExpense;
    }

    deleteExpense(id) {
        const expenses = this.getExpenses().filter(e => e.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // الإعدادات
    getSettings() {
        return JSON.parse(localStorage.getItem('settings')) || {
            commissionRate: 5,
            currency: 'ج.م',
            companyName: 'الوكالة الزراعية'
        };
    }

    updateSettings(settings) {
        const currentSettings = this.getSettings();
        const newSettings = { ...currentSettings, ...settings };
        localStorage.setItem('settings', JSON.stringify(newSettings));
        return newSettings;
    }

    // الإحصائيات
    getStats() {
        const products = this.getProducts();
        const purchases = this.getPurchases();
        const sales = this.getSales();
        const expenses = this.getExpenses();
        const workers = this.getWorkers();
        const farmers = this.getFarmers();

        const totalPurchases = purchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);
        const totalSales = sales.reduce((sum, s) => sum + (s.totalSales || 0), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalWorkersCost = sales.reduce((sum, s) => sum + (s.workersCost || 0), 0);
        const totalCommission = sales.reduce((sum, s) => sum + (s.commission || 0), 0);
        const netProfit = sales.reduce((sum, s) => sum + (s.netProfit || 0), 0);

        return {
            productsCount: products.length,
            purchasesCount: purchases.length,
            salesCount: sales.length,
            workersCount: workers.length,
            farmersCount: farmers.length,
            totalPurchases,
            totalSales,
            totalExpenses,
            totalWorkersCost,
            totalCommission,
            netProfit
        };
    }
}

// ==================== تهيئة قاعدة البيانات ====================
const db = new LocalDB();

// ==================== المتغيرات العامة ====================
const app = document.getElementById('app');

// ==================== دالة عرض التنبيهات ====================
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-${type} shadow-2xl`;
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} text-xl"></i>
            <span class="font-bold">${message}</span>
        </div>
    `;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ==================== شاشة تسجيل الدخول ====================
function showLogin() {
    app.innerHTML = `
    <div class="w-full max-w-md">
        <!-- الشعار -->
        <div class="text-center mb-8">
            <div class="inline-block p-4 bg-amber-500/20 rounded-full mb-4">
                <i class="fas fa-seedling text-5xl text-amber-400"></i>
            </div>
            <h1 class="text-4xl font-extrabold text-amber-400 mb-2">وكالة</h1>
            <p class="text-gray-400 text-lg">نظام إدارة الوكالات الزراعية</p>
        </div>
        
        <!-- بطاقة تسجيل الدخول -->
        <div class="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
            <h2 class="text-2xl mb-6 text-amber-400 font-bold flex items-center gap-2">
                <i class="fas fa-lock"></i>
                <span>تسجيل دخول الإدارة</span>
            </h2>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-300 mb-2">كلمة المرور</label>
                    <input id="password" type="password" placeholder="أدخل كلمة المرور" 
                           class="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white focus:border-amber-500 transition"/>
                </div>
                
                <button id="loginBtn" 
                        class="w-full bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 transition transform hover:scale-[1.02]">
                    <i class="fas fa-sign-in-alt ml-2"></i>
                    دخول
                </button>
                
                <p id="msg" class="mt-4 text-red-500 font-bold text-center"></p>
            </div>
        </div>
        
        <!-- حقوق النشر -->
        <p class="text-center text-gray-500 mt-8 text-sm">
            © 2024 وكالة - جميع الحقوق محفوظة
        </p>
    </div>
    `;
    
    document.getElementById('loginBtn').addEventListener('click', login);
    
    // تفعيل Enter لتسجيل الدخول
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
}

function login() {
    const pwd = document.getElementById('password').value;
    if(pwd === "wakala123") {
        showToast('تم تسجيل الدخول بنجاح', 'success');
        showDashboard();
    } else {
        document.getElementById('msg').innerText = "❌ كلمة المرور غير صحيحة";
        showToast('كلمة المرور غير صحيحة', 'error');
    }
}

// ==================== لوحة التحكم الرئيسية ====================
function showDashboard() {
    const settings = db.getSettings();
    
    app.innerHTML = `
    <div class="w-full max-w-7xl">
        <!-- رأس الصفحة -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-8">
            <div class="flex items-center gap-3 mb-4 md:mb-0">
                <div class="p-3 bg-amber-500/20 rounded-2xl">
                    <i class="fas fa-chart-pie text-3xl text-amber-400"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-extrabold text-amber-400">${settings.companyName}</h2>
                    <p class="text-gray-400">نظام إدارة الوكالة المتكامل</p>
                </div>
            </div>
            
            <div class="flex gap-3">
                <button id="refreshBtn" class="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl transition" title="تحديث">
                    <i class="fas fa-sync-alt text-amber-400"></i>
                </button>
                <button id="logoutBtn" class="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>تسجيل خروج</span>
                </button>
            </div>
        </div>
        
        <!-- الإحصائيات -->
        <div id="stats" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"></div>
        
        <!-- القائمة الرئيسية - أيقونات كبيرة -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <button id="menuProducts" class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 p-6 rounded-2xl border border-blue-500/30 transition transform hover:scale-105">
                <i class="fas fa-boxes text-4xl text-blue-400 mb-2"></i>
                <p class="font-bold text-lg">المنتجات</p>
            </button>
            
            <button id="menuPurchases" class="bg-gradient-to-br from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 p-6 rounded-2xl border border-green-500/30 transition transform hover:scale-105">
                <i class="fas fa-truck text-4xl text-green-400 mb-2"></i>
                <p class="font-bold text-lg">المشتريات</p>
            </button>
            
            <button id="menuSales" class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 p-6 rounded-2xl border border-purple-500/30 transition transform hover:scale-105">
                <i class="fas fa-chart-line text-4xl text-purple-400 mb-2"></i>
                <p class="font-bold text-lg">المبيعات</p>
            </button>
            
            <button id="menuWorkers" class="bg-gradient-to-br from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 p-6 rounded-2xl border border-orange-500/30 transition transform hover:scale-105">
                <i class="fas fa-users text-4xl text-orange-400 mb-2"></i>
                <p class="font-bold text-lg">العمالة</p>
            </button>
            
            <button id="menuFarmers" class="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500/30 hover:to-emerald-600/30 p-6 rounded-2xl border border-emerald-500/30 transition transform hover:scale-105">
                <i class="fas fa-user-tie text-4xl text-emerald-400 mb-2"></i>
                <p class="font-bold text-lg">الفلاحين</p>
            </button>
            
            <button id="menuExpenses" class="bg-gradient-to-br from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 p-6 rounded-2xl border border-red-500/30 transition transform hover:scale-105">
                <i class="fas fa-wallet text-4xl text-red-400 mb-2"></i>
                <p class="font-bold text-lg">المصروفات</p>
            </button>
            
            <button id="menuReports" class="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 p-6 rounded-2xl border border-indigo-500/30 transition transform hover:scale-105">
                <i class="fas fa-chart-pie text-4xl text-indigo-400 mb-2"></i>
                <p class="font-bold text-lg">التقارير</p>
            </button>
            
            <button id="menuSettings" class="bg-gradient-to-br from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 p-6 rounded-2xl border border-gray-500/30 transition transform hover:scale-105">
                <i class="fas fa-cog text-4xl text-gray-400 mb-2"></i>
                <p class="font-bold text-lg">الإعدادات</p>
            </button>
        </div>
        
        <!-- المحتوى الديناميكي -->
        <div id="content" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 min-h-[400px]">
            <!-- المحتوى يظهر هنا -->
        </div>
    </div>
    `;
    
    // إضافة مستمعي الأحداث للقائمة
    document.getElementById('menuProducts').addEventListener('click', () => showProductsList());
    document.getElementById('menuPurchases').addEventListener('click', () => showPurchasesList());
    document.getElementById('menuSales').addEventListener('click', () => showSalesList());
    document.getElementById('menuWorkers').addEventListener('click', () => showWorkersList());
    document.getElementById('menuFarmers').addEventListener('click', () => showFarmersList());
    document.getElementById('menuExpenses').addEventListener('click', () => showExpensesList());
    document.getElementById('menuReports').addEventListener('click', () => showReports());
    document.getElementById('menuSettings').addEventListener('click', () => showSettings());
    
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    document.getElementById('logoutBtn').addEventListener('click', showLogin);
    
    // تحميل البيانات الأولية
    refreshData();
    showProductsList(); // العرض الافتراضي
}

// ==================== تحديث الإحصائيات ====================
function updateStats() {
    const statsDiv = document.getElementById('stats');
    if (!statsDiv) return;
    
    const stats = db.getStats();
    const settings = db.getSettings();
    
    statsDiv.innerHTML = `
        <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/30">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400">إجمالي المنتجات</p>
                    <p class="text-2xl font-bold text-blue-400">${stats.productsCount}</p>
                </div>
                <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <i class="fas fa-boxes text-blue-400"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-xl border border-green-500/30">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400">إجمالي المشتريات</p>
                    <p class="text-2xl font-bold text-green-400">${stats.totalPurchases.toLocaleString()} ${settings.currency}</p>
                </div>
                <div class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <i class="fas fa-truck text-green-400"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/30">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400">إجمالي المبيعات</p>
                    <p class="text-2xl font-bold text-purple-400">${stats.totalSales.toLocaleString()} ${settings.currency}</p>
                </div>
                <div class="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <i class="fas fa-chart-line text-purple-400"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 rounded-xl border border-emerald-500/30">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-400">صافي الربح</p>
                    <p class="text-2xl font-bold text-emerald-400">${stats.netProfit.toLocaleString()} ${settings.currency}</p>
                </div>
                <div class="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <i class="fas fa-coins text-emerald-400"></i>
                </div>
            </div>
        </div>
    `;
}

// ==================== إدارة المنتجات ====================
function showProductsList() {
    const content = document.getElementById('content');
    const products = db.getProducts();
    
    if (products.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-boxes text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400 mb-4">لا يوجد منتجات بعد</p>
                <button onclick="showProductForm()" class="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    إضافة منتج
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">قائمة المنتجات</h3>
            <button onclick="showProductForm()" class="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <i class="fas fa-plus"></i>
                إضافة منتج
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="p-3 text-right">#</th>
                        <th class="p-3 text-right">اسم المنتج</th>
                        <th class="p-3 text-right">الوحدة</th>
                        <th class="p-3 text-right">سعر التكلفة</th>
                        <th class="p-3 text-right">سعر البيع</th>
                        <th class="p-3 text-right">الكمية</th>
                        <th class="p-3 text-right">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    products.forEach((product, index) => {
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3 font-bold">${product.name}</td>
                <td class="p-3">${product.unit || 'كجم'}</td>
                <td class="p-3">${(product.costPrice || 0).toLocaleString()} ج.م</td>
                <td class="p-3 text-green-400">${(product.sellingPrice || 0).toLocaleString()} ج.م</td>
                <td class="p-3">${product.stock || 0}</td>
                <td class="p-3">
                    <button onclick="editProduct('${product.id}')" class="text-blue-400 hover:text-blue-300 mx-1" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct('${product.id}')" class="text-red-400 hover:text-red-300 mx-1" title="حذف">
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
    `;
    
    content.innerHTML = html;
}

// ==================== نموذج إضافة منتج ====================
function showProductForm() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-box text-blue-400"></i>
                <span>إضافة منتج جديد</span>
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-300 mb-2">اسم المنتج</label>
                    <input id="productName" type="text" placeholder="أدخل اسم المنتج" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">الوحدة</label>
                        <select id="productUnit" class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                            <option value="كجم">كيلو جرام (كجم)</option>
                            <option value="طن">طن</option>
                            <option value="كرتونة">كرتونة</option>
                            <option value="شيكارة">شيكارة</option>
                            <option value="حبة">حبة</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">الكمية الافتتاحية</label>
                        <input id="productStock" type="number" value="0" min="0"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">سعر التكلفة (ج.م)</label>
                        <input id="costPrice" type="number" value="0" min="0" step="0.01"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">سعر البيع (ج.م)</label>
                        <input id="sellingPrice" type="number" value="0" min="0" step="0.01"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="saveProduct" class="flex-1 bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        حفظ المنتج
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('saveProduct').addEventListener('click', saveProduct);
    document.getElementById('cancelForm').addEventListener('click', showProductsList);
}

function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const unit = document.getElementById('productUnit').value;
    const stock = parseFloat(document.getElementById('productStock').value) || 0;
    const costPrice = parseFloat(document.getElementById('costPrice').value) || 0;
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
    
    if(!name) {
        showToast('يرجى إدخال اسم المنتج', 'error');
        return;
    }
    
    db.addProduct({
        name,
        unit,
        stock,
        costPrice,
        sellingPrice,
        updatedAt: new Date().toISOString()
    });
    
    showToast('تم إضافة المنتج بنجاح', 'success');
    showProductsList();
}

// ==================== إدارة المشتريات ====================
function showPurchasesList() {
    const content = document.getElementById('content');
    const purchases = db.getPurchases();
    const settings = db.getSettings();
    
    if (purchases.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-truck text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400 mb-4">لا يوجد مشتريات بعد</p>
                <button onclick="showPurchaseForm()" class="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    تسجيل مشتريات
                </button>
            </div>
        `;
        return;
    }
    
    let totalAmount = 0;
    let html = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">سجل المشتريات</h3>
            <button onclick="showPurchaseForm()" class="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <i class="fas fa-plus"></i>
                تسجيل مشتريات
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="p-3 text-right">#</th>
                        <th class="p-3 text-right">التاريخ</th>
                        <th class="p-3 text-right">المورد</th>
                        <th class="p-3 text-right">عدد المنتجات</th>
                        <th class="p-3 text-right">الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    purchases.slice().reverse().forEach((purchase, index) => {
        totalAmount += purchase.totalCost || 0;
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3">${purchase.date || new Date(purchase.createdAt).toLocaleDateString('ar-EG')}</td>
                <td class="p-3 font-bold">${purchase.supplier || 'غير محدد'}</td>
                <td class="p-3">${purchase.items?.length || 0}</td>
                <td class="p-3 text-green-400">${(purchase.totalCost || 0).toLocaleString()} ${settings.currency}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot class="bg-gray-700">
                    <tr>
                        <td colspan="4" class="p-3 text-left font-bold">الإجمالي الكلي:</td>
                        <td class="p-3 font-bold text-green-400">${totalAmount.toLocaleString()} ${settings.currency}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

// ==================== نموذج تسجيل مشتريات ====================
function showPurchaseForm() {
    const products = db.getProducts();
    
    if (products.length === 0) {
        showToast('يجب إضافة منتجات أولاً', 'error');
        showProductsList();
        return;
    }
    
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-truck text-green-400"></i>
                <span>تسجيل مشتريات جديدة</span>
            </h3>
            
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">اسم المورد</label>
                        <input id="supplier" type="text" placeholder="أدخل اسم المورد" 
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">التاريخ</label>
                        <input id="purchaseDate" type="date" value="${new Date().toISOString().split('T')[0]}" 
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">المنتجات</label>
                    <div id="items-container" class="space-y-2">
                        <div class="purchase-item grid grid-cols-12 gap-2">
                            <div class="col-span-6">
                                <select class="product-select w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                                    <option value="">اختر منتج</option>
                                    ${products.map(p => `<option value="${p.id}" data-cost="${p.costPrice || 0}">${p.name} (${p.unit})</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-span-3">
                                <input type="number" class="quantity w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="الكمية" min="1" value="1">
                            </div>
                            <div class="col-span-3">
                                <input type="number" class="price w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="السعر" min="0" step="0.01" value="0">
                            </div>
                        </div>
                    </div>
                    <button id="addItem" type="button" class="mt-2 text-amber-400 hover:text-amber-300">
                        <i class="fas fa-plus ml-1"></i> إضافة منتج آخر
                    </button>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">تكلفة النقل (ج.م)</label>
                        <input id="transportCost" type="number" value="0" min="0" step="0.01"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">تكاليف أخرى (ج.م)</label>
                        <input id="otherCosts" type="number" value="0" min="0" step="0.01"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">ملاحظات</label>
                    <textarea id="purchaseNotes" rows="3" placeholder="أي ملاحظات..."
                              class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"></textarea>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="savePurchase" class="flex-1 bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        تسجيل المشتريات
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('addItem').addEventListener('click', () => {
        const container = document.getElementById('items-container');
        const newItem = document.createElement('div');
        newItem.className = 'purchase-item grid grid-cols-12 gap-2 mt-2';
        newItem.innerHTML = `
            <div class="col-span-6">
                <select class="product-select w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    <option value="">اختر منتج</option>
                    ${products.map(p => `<option value="${p.id}" data-cost="${p.costPrice || 0}">${p.name} (${p.unit})</option>`).join('')}
                </select>
            </div>
            <div class="col-span-3">
                <input type="number" class="quantity w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="الكمية" min="1" value="1">
            </div>
            <div class="col-span-3">
                <input type="number" class="price w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="السعر" min="0" step="0.01" value="0">
            </div>
        `;
        container.appendChild(newItem);
    });
    
    document.getElementById('savePurchase').addEventListener('click', savePurchase);
    document.getElementById('cancelForm').addEventListener('click', showPurchasesList);
}

function savePurchase() {
    const supplier = document.getElementById('supplier').value.trim();
    const date = document.getElementById('purchaseDate').value;
    const transportCost = parseFloat(document.getElementById('transportCost').value) || 0;
    const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;
    const notes = document.getElementById('purchaseNotes').value;
    
    const items = [];
    document.querySelectorAll('.purchase-item').forEach(item => {
        const productSelect = item.querySelector('.product-select');
        const quantity = parseFloat(item.querySelector('.quantity').value);
        const price = parseFloat(item.querySelector('.price').value);
        
        if (productSelect.value && quantity > 0 && price > 0) {
            items.push({
                productId: productSelect.value,
                productName: productSelect.options[productSelect.selectedIndex].text,
                quantity,
                pricePerUnit: price,
                total: quantity * price
            });
        }
    });
    
    if (items.length === 0) {
        showToast('يرجى إضافة منتج واحد على الأقل', 'error');
        return;
    }
    
    const totalItemsCost = items.reduce((sum, item) => sum + item.total, 0);
    const totalCost = totalItemsCost + transportCost + otherCosts;
    
    db.addPurchase({
        supplier,
        date,
        items,
        transportCost,
        otherCosts,
        totalItemsCost,
        totalCost,
        notes,
        status: 'completed'
    });
    
    showToast('تم تسجيل المشتريات بنجاح', 'success');
    showPurchasesList();
}

// ==================== قائمة المبيعات ====================
function showSalesList() {
    const content = document.getElementById('content');
    const sales = db.getSales();
    const settings = db.getSettings();
    
    if (sales.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-chart-line text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400 mb-4">لا يوجد مبيعات بعد</p>
                <button onclick="showSaleForm()" class="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    تسجيل مبيعات
                </button>
            </div>
        `;
        return;
    }
    
    let totalSales = 0;
    let totalProfit = 0;
    let html = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">سجل المبيعات</h3>
            <button onclick="showSaleForm()" class="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <i class="fas fa-plus"></i>
                تسجيل مبيعات
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="p-3 text-right">#</th>
                        <th class="p-3 text-right">التاريخ</th>
                        <th class="p-3 text-right">المشتري</th>
                        <th class="p-3 text-right">عدد المنتجات</th>
                        <th class="p-3 text-right">الإجمالي</th>
                        <th class="p-3 text-right">صافي الربح</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    sales.slice().reverse().forEach((sale, index) => {
        totalSales += sale.totalSales || 0;
        totalProfit += sale.netProfit || 0;
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3">${sale.date || new Date(sale.createdAt).toLocaleDateString('ar-EG')}</td>
                <td class="p-3 font-bold">${sale.buyer || 'غير محدد'}</td>
                <td class="p-3">${sale.items?.length || 0}</td>
                <td class="p-3 text-purple-400">${(sale.totalSales || 0).toLocaleString()} ${settings.currency}</td>
                <td class="p-3 ${sale.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}">${(sale.netProfit || 0).toLocaleString()} ${settings.currency}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot class="bg-gray-700">
                    <tr>
                        <td colspan="4" class="p-3 text-left font-bold">الإجمالي:</td>
                        <td class="p-3 font-bold text-purple-400">${totalSales.toLocaleString()} ${settings.currency}</td>
                        <td class="p-3 font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}">${totalProfit.toLocaleString()} ${settings.currency}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

// ==================== نموذج تسجيل مبيعات ====================
function showSaleForm() {
    const products = db.getProducts();
    const workers = db.getWorkers();
    const settings = db.getSettings();
    
    if (products.length === 0) {
        showToast('يجب إضافة منتجات أولاً', 'error');
        showProductsList();
        return;
    }
    
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-chart-line text-purple-400"></i>
                <span>تسجيل مبيعات جديدة</span>
            </h3>
            
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">اسم المشتري</label>
                        <input id="buyer" type="text" placeholder="أدخل اسم المشتري" 
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">التاريخ</label>
                        <input id="saleDate" type="date" value="${new Date().toISOString().split('T')[0]}" 
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">المنتجات المباعة</label>
                    <div id="sale-items-container" class="space-y-2">
                        <div class="sale-item grid grid-cols-12 gap-2">
                            <div class="col-span-6">
                                <select class="product-select w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                                    <option value="">اختر منتج</option>
                                    ${products.map(p => `<option value="${p.id}" data-cost="${p.costPrice || 0}">${p.name} (${p.unit})</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-span-3">
                                <input type="number" class="quantity w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="الكمية" min="1" value="1">
                            </div>
                            <div class="col-span-3">
                                <input type="number" class="price w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="السعر" min="0" step="0.01" value="0">
                            </div>
                        </div>
                    </div>
                    <button id="addSaleItem" type="button" class="mt-2 text-amber-400 hover:text-amber-300">
                        <i class="fas fa-plus ml-1"></i> إضافة منتج آخر
                    </button>
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">العمالة المشاركة</label>
                    <div id="workers-container" class="space-y-2">
                        <!-- يمكن إضافة عمال هنا -->
                    </div>
                    <button id="addWorker" type="button" class="mt-2 text-amber-400 hover:text-amber-300">
                        <i class="fas fa-plus ml-1"></i> إضافة عامل
                    </button>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">نسبة عمولة الوكالة (%)</label>
                        <input id="commissionRate" type="number" value="${settings.commissionRate}" min="0" max="100" step="0.1"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">قيمة العمولة</label>
                        <input id="commissionAmount" type="text" readonly
                               class="w-full p-3 rounded-lg bg-gray-600 border border-gray-600 text-white" value="0">
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-300 mb-2">تكلفة العتالة (ج.م)</label>
                        <input id="handlingCost" type="number" value="0" min="0" step="0.01"
                               class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    </div>
                    <div>
                        <label class="block text-gray-300 mb-2">صافي الربح</label>
                        <input id="netProfit" type="text" readonly
                               class="w-full p-3 rounded-lg bg-gray-600 border border-gray-600 text-white" value="0">
                    </div>
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">ملاحظات</label>
                    <textarea id="saleNotes" rows="3" placeholder="أي ملاحظات..."
                              class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"></textarea>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="saveSale" class="flex-1 bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        تسجيل المبيعات
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة منتج جديد
    document.getElementById('addSaleItem').addEventListener('click', () => {
        const container = document.getElementById('sale-items-container');
        const newItem = document.createElement('div');
        newItem.className = 'sale-item grid grid-cols-12 gap-2 mt-2';
        newItem.innerHTML = `
            <div class="col-span-6">
                <select class="product-select w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    <option value="">اختر منتج</option>
                    ${products.map(p => `<option value="${p.id}" data-cost="${p.costPrice || 0}">${p.name} (${p.unit})</option>`).join('')}
                </select>
            </div>
            <div class="col-span-3">
                <input type="number" class="quantity w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="الكمية" min="1" value="1">
            </div>
            <div class="col-span-3">
                <input type="number" class="price w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="السعر" min="0" step="0.01" value="0">
            </div>
        `;
        container.appendChild(newItem);
        attachCalculationListeners();
    });
    
    // إضافة عامل
    document.getElementById('addWorker').addEventListener('click', () => {
        if (workers.length === 0) {
            showToast('لا يوجد عمالة مسجلة', 'error');
            return;
        }
        
        const container = document.getElementById('workers-container');
        const newWorker = document.createElement('div');
        newWorker.className = 'worker-item grid grid-cols-12 gap-2 mt-2';
        newWorker.innerHTML = `
            <div class="col-span-6">
                <select class="worker-select w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                    <option value="">اختر عامل</option>
                    ${workers.map(w => `<option value="${w.id}" data-wage="${w.dailyWage || 0}">${w.name} (${w.role})</option>`).join('')}
                </select>
            </div>
            <div class="col-span-3">
                <input type="number" class="days w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="الأيام" min="1" value="1">
            </div>
            <div class="col-span-3">
                <input type="number" class="wage w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white" placeholder="الأجر" min="0" step="0.01" value="0">
            </div>
        `;
        container.appendChild(newWorker);
        attachCalculationListeners();
    });
    
    // حساب العمولة والربح
    function calculateTotals() {
        let totalSales = 0;
        let totalCost = 0;
        
        document.querySelectorAll('.sale-item').forEach(item => {
            const quantity = parseFloat(item.querySelector('.quantity').value) || 0;
            const price = parseFloat(item.querySelector('.price').value) || 0;
            const productSelect = item.querySelector('.product-select');
            const costPerUnit = parseFloat(productSelect.selectedOptions[0]?.dataset.cost || 0);
            
            totalSales += quantity * price;
            totalCost += quantity * costPerUnit;
        });
        
        // تكاليف العمالة
        let workersCost = 0;
        document.querySelectorAll('.worker-item').forEach(item => {
            const days = parseFloat(item.querySelector('.days').value) || 0;
            const wage = parseFloat(item.querySelector('.wage').value) || 0;
            workersCost += days * wage;
        });
        
        const handlingCost = parseFloat(document.getElementById('handlingCost').value) || 0;
        const commissionRate = parseFloat(document.getElementById('commissionRate').value) || 0;
        
        const commission = (totalSales * commissionRate) / 100;
        const netProfit = totalSales - totalCost - workersCost - handlingCost - commission;
        
        document.getElementById('commissionAmount').value = commission.toFixed(2);
        document.getElementById('netProfit').value = netProfit.toFixed(2);
    }
    
    function attachCalculationListeners() {
        document.querySelectorAll('.sale-item input, .sale-item select, .worker-item input, .worker-item select').forEach(el => {
            el.removeEventListener('input', calculateTotals);
            el.addEventListener('input', calculateTotals);
        });
    }
    
    document.getElementById('commissionRate').addEventListener('input', calculateTotals);
    document.getElementById('handlingCost').addEventListener('input', calculateTotals);
    attachCalculationListeners();
    
    document.getElementById('saveSale').addEventListener('click', saveSale);
    document.getElementById('cancelForm').addEventListener('click', showSalesList);
}

function saveSale() {
    const buyer = document.getElementById('buyer').value.trim();
    const date = document.getElementById('saleDate').value;
    const commissionRate = parseFloat(document.getElementById('commissionRate').value) || 0;
    const handlingCost = parseFloat(document.getElementById('handlingCost').value) || 0;
    const notes = document.getElementById('saleNotes').value;
    
    const items = [];
    document.querySelectorAll('.sale-item').forEach(item => {
        const productSelect = item.querySelector('.product-select');
        const quantity = parseFloat(item.querySelector('.quantity').value);
        const price = parseFloat(item.querySelector('.price').value);
        
        if (productSelect.value && quantity > 0 && price > 0) {
            items.push({
                productId: productSelect.value,
                productName: productSelect.options[productSelect.selectedIndex].text,
                quantity,
                pricePerUnit: price,
                total: quantity * price,
                costPerUnit: parseFloat(productSelect.selectedOptions[0]?.dataset.cost || 0)
            });
        }
    });
    
    if (items.length === 0) {
        showToast('يرجى إضافة منتج واحد على الأقل', 'error');
        return;
    }
    
    const workers = [];
    document.querySelectorAll('.worker-item').forEach(item => {
        const workerSelect = item.querySelector('.worker-select');
        const days = parseFloat(item.querySelector('.days').value);
        const wage = parseFloat(item.querySelector('.wage').value);
        
        if (workerSelect.value && days > 0 && wage > 0) {
            workers.push({
                workerId: workerSelect.value,
                workerName: workerSelect.options[workerSelect.selectedIndex].text,
                days,
                dailyWage: wage,
                total: days * wage
            });
        }
    });
    
    const totalSales = items.reduce((sum, item) => sum + item.total, 0);
    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
    const workersCost = workers.reduce((sum, w) => sum + w.total, 0) + handlingCost;
    const commission = (totalSales * commissionRate) / 100;
    const netProfit = totalSales - totalCost - workersCost - commission;
    
    db.addSale({
        buyer,
        date,
        items,
        workers,
        handlingCost,
        commissionRate,
        commission,
        totalSales,
        totalCost,
        workersCost,
        netProfit,
        notes
    });
    
    showToast('تم تسجيل المبيعات بنجاح', 'success');
    showSalesList();
}

// ==================== إدارة العمالة ====================
function showWorkersList() {
    const content = document.getElementById('content');
    const workers = db.getWorkers();
    
    if (workers.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-users text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400 mb-4">لا يوجد عمالة بعد</p>
                <button onclick="showWorkerForm()" class="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    إضافة عامل
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">قائمة العمالة</h3>
            <button onclick="showWorkerForm()" class="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <i class="fas fa-plus"></i>
                إضافة عامل
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="p-3 text-right">#</th>
                        <th class="p-3 text-right">الاسم</th>
                        <th class="p-3 text-right">الوظيفة</th>
                        <th class="p-3 text-right">رقم الهاتف</th>
                        <th class="p-3 text-right">الأجر اليومي</th>
                        <th class="p-3 text-right">الحالة</th>
                        <th class="p-3 text-right">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    workers.forEach((worker, index) => {
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3 font-bold">${worker.name}</td>
                <td class="p-3">${worker.role || '-'}</td>
                <td class="p-3">${worker.phone || '-'}</td>
                <td class="p-3">${(worker.dailyWage || 0).toLocaleString()} ج.م</td>
                <td class="p-3">
                    <span class="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">نشط</span>
                </td>
                <td class="p-3">
                    <button onclick="editWorker('${worker.id}')" class="text-blue-400 hover:text-blue-300 mx-1" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteWorker('${worker.id}')" class="text-red-400 hover:text-red-300 mx-1" title="حذف">
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
    `;
    
    content.innerHTML = html;
}

// ==================== نموذج إضافة عامل ====================
function showWorkerForm() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-user-plus text-orange-400"></i>
                <span>إضافة عامل جديد</span>
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-300 mb-2">الاسم الكامل</label>
                    <input id="workerName" type="text" placeholder="أدخل اسم العامل" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">الوظيفة</label>
                    <input id="workerRole" type="text" placeholder="أدخل الوظيفة" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">رقم الهاتف</label>
                    <input id="workerPhone" type="text" placeholder="أدخل رقم الهاتف" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">الأجر اليومي (ج.م)</label>
                    <input id="workerWage" type="number" value="0" min="0" step="0.01"
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">العنوان</label>
                    <input id="workerAddress" type="text" placeholder="أدخل العنوان" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">ملاحظات</label>
                    <textarea id="workerNotes" rows="3" placeholder="أي ملاحظات..."
                              class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"></textarea>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="saveWorker" class="flex-1 bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        حفظ البيانات
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('saveWorker').addEventListener('click', saveWorker);
    document.getElementById('cancelForm').addEventListener('click', showWorkersList);
}

function saveWorker() {
    const name = document.getElementById('workerName').value.trim();
    const role = document.getElementById('workerRole').value.trim();
    const phone = document.getElementById('workerPhone').value.trim();
    const dailyWage = parseFloat(document.getElementById('workerWage').value) || 0;
    const address = document.getElementById('workerAddress').value.trim();
    const notes = document.getElementById('workerNotes').value;
    
    if(!name) {
        showToast('يرجى إدخال اسم العامل', 'error');
        return;
    }
    
    db.addWorker({
        name,
        role,
        phone,
        dailyWage,
        address,
        notes,
        status: 'active'
    });
    
    showToast('تم إضافة العامل بنجاح', 'success');
    showWorkersList();
}

// ==================== إدارة الفلاحين ====================
function showFarmersList() {
    const content = document.getElementById('content');
    const farmers = db.getFarmers();
    
    if (farmers.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-user-tie text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400 mb-4">لا يوجد فلاحين بعد</p>
                <button onclick="showFarmerForm()" class="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    إضافة فلاح
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">قائمة الفلاحين</h3>
            <button onclick="showFarmerForm()" class="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <i class="fas fa-plus"></i>
                إضافة فلاح
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="p-3 text-right">#</th>
                        <th class="p-3 text-right">الاسم</th>
                        <th class="p-3 text-right">رقم الهاتف</th>
                        <th class="p-3 text-right">العنوان</th>
                        <th class="p-3 text-right">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    farmers.forEach((farmer, index) => {
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3 font-bold">${farmer.name}</td>
                <td class="p-3">${farmer.phone || '-'}</td>
                <td class="p-3">${farmer.address || '-'}</td>
                <td class="p-3">
                    <button onclick="editFarmer('${farmer.id}')" class="text-blue-400 hover:text-blue-300 mx-1" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteFarmer('${farmer.id}')" class="text-red-400 hover:text-red-300 mx-1" title="حذف">
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
    `;
    
    content.innerHTML = html;
}

// ==================== نموذج إضافة فلاح ====================
function showFarmerForm() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-user-plus text-emerald-400"></i>
                <span>إضافة فلاح جديد</span>
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-300 mb-2">الاسم الكامل</label>
                    <input id="farmerName" type="text" placeholder="أدخل اسم الفلاح" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">رقم الهاتف</label>
                    <input id="farmerPhone" type="text" placeholder="أدخل رقم الهاتف" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">العنوان</label>
                    <input id="farmerAddress" type="text" placeholder="أدخل العنوان" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">ملاحظات</label>
                    <textarea id="farmerNotes" rows="3" placeholder="أي ملاحظات..."
                              class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"></textarea>
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="saveFarmer" class="flex-1 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        حفظ البيانات
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('saveFarmer').addEventListener('click', saveFarmer);
    document.getElementById('cancelForm').addEventListener('click', showFarmersList);
}

function saveFarmer() {
    const name = document.getElementById('farmerName').value.trim();
    const phone = document.getElementById('farmerPhone').value.trim();
    const address = document.getElementById('farmerAddress').value.trim();
    const notes = document.getElementById('farmerNotes').value;
    
    if(!name) {
        showToast('يرجى إدخال اسم الفلاح', 'error');
        return;
    }
    
    db.addFarmer({
        name,
        phone,
        address,
        notes
    });
    
    showToast('تم إضافة الفلاح بنجاح', 'success');
    showFarmersList();
}

// ==================== إدارة المصروفات ====================
function showExpensesList() {
    const content = document.getElementById('content');
    const expenses = db.getExpenses();
    const settings = db.getSettings();
    
    if (expenses.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-wallet text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400 mb-4">لا يوجد مصروفات بعد</p>
                <button onclick="showExpenseForm()" class="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    إضافة مصروف
                </button>
            </div>
        `;
        return;
    }
    
    let totalExpenses = 0;
    let html = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">سجل المصروفات</h3>
            <button onclick="showExpenseForm()" class="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2">
                <i class="fas fa-plus"></i>
                إضافة مصروف
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="p-3 text-right">#</th>
                        <th class="p-3 text-right">التاريخ</th>
                        <th class="p-3 text-right">النوع</th>
                        <th class="p-3 text-right">الوصف</th>
                        <th class="p-3 text-right">المبلغ</th>
                        <th class="p-3 text-right">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    expenses.slice().reverse().forEach((expense, index) => {
        totalExpenses += expense.amount || 0;
        html += `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3">${expense.date || new Date(expense.createdAt).toLocaleDateString('ar-EG')}</td>
                <td class="p-3">${expense.type || 'أخرى'}</td>
                <td class="p-3">${expense.description}</td>
                <td class="p-3 text-red-400">${(expense.amount || 0).toLocaleString()} ${settings.currency}</td>
                <td class="p-3">
                    <button onclick="deleteExpense('${expense.id}')" class="text-red-400 hover:text-red-300 mx-1" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot class="bg-gray-700">
                    <tr>
                        <td colspan="4" class="p-3 text-left font-bold">الإجمالي:</td>
                        <td class="p-3 font-bold text-red-400">${totalExpenses.toLocaleString()} ${settings.currency}</td>
                        <td class="p-3"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    content.innerHTML = html;
}

// ==================== نموذج إضافة مصروف ====================
function showExpenseForm() {
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-plus-circle text-red-400"></i>
                <span>تسجيل مصروف جديد</span>
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-300 mb-2">نوع المصروف</label>
                    <select id="expenseType" class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                        <option value="إيجار">إيجار</option>
                        <option value="رواتب">رواتب</option>
                        <option value="فواتير">فواتير</option>
                        <option value="نقل">نقل</option>
                        <option value="صيانة">صيانة</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">الوصف</label>
                    <input id="expenseDesc" type="text" placeholder="أدخل وصف المصروف" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">المبلغ (ج.م)</label>
                    <input id="expenseAmount" type="number" placeholder="أدخل المبلغ" min="0" step="0.01"
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">التاريخ</label>
                    <input id="expenseDate" type="date" value="${new Date().toISOString().split('T')[0]}" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="saveExpense" class="flex-1 bg-gradient-to-l from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        تسجيل المصروف
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('saveExpense').addEventListener('click', saveExpense);
    document.getElementById('cancelForm').addEventListener('click', showExpensesList);
}

function saveExpense() {
    const type = document.getElementById('expenseType').value;
    const description = document.getElementById('expenseDesc').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;
    
    if(!description || !amount || amount <= 0) {
        showToast('يرجى إدخال وصف المصروف ومبلغ صحيح', 'error');
        return;
    }
    
    db.addExpense({
        type,
        description,
        amount,
        date
    });
    
    showToast('تم تسجيل المصروف بنجاح', 'success');
    showExpensesList();
}

// ==================== التقارير ====================
function showReports() {
    const content = document.getElementById('content');
    const stats = db.getStats();
    const settings = db.getSettings();
    
    content.innerHTML = `
        <div class="space-y-6">
            <h3 class="text-2xl font-bold mb-6">التقارير والإحصائيات</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- تقرير المنتجات -->
                <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h4 class="text-xl font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-boxes text-blue-400"></i>
                        <span>تقرير المنتجات</span>
                    </h4>
                    <div class="space-y-2">
                        <p>إجمالي المنتجات: <span class="font-bold text-amber-400">${stats.productsCount}</span></p>
                        <p>قيمة المخزون: <span class="font-bold text-amber-400">جاري الحساب...</span></p>
                    </div>
                </div>
                
                <!-- تقرير المبيعات -->
                <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h4 class="text-xl font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-chart-line text-purple-400"></i>
                        <span>تقرير المبيعات</span>
                    </h4>
                    <div class="space-y-2">
                        <p>عدد المبيعات: <span class="font-bold text-amber-400">${stats.salesCount}</span></p>
                        <p>إجمالي المبيعات: <span class="font-bold text-amber-400">${stats.totalSales.toLocaleString()} ${settings.currency}</span></p>
                        <p>صافي الربح: <span class="font-bold text-green-400">${stats.netProfit.toLocaleString()} ${settings.currency}</span></p>
                    </div>
                </div>
                
                <!-- تقرير المشتريات -->
                <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h4 class="text-xl font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-truck text-green-400"></i>
                        <span>تقرير المشتريات</span>
                    </h4>
                    <div class="space-y-2">
                        <p>عدد المشتريات: <span class="font-bold text-amber-400">${stats.purchasesCount}</span></p>
                        <p>إجمالي المشتريات: <span class="font-bold text-amber-400">${stats.totalPurchases.toLocaleString()} ${settings.currency}</span></p>
                    </div>
                </div>
                
                <!-- تقرير المصروفات -->
                <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h4 class="text-xl font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-wallet text-red-400"></i>
                        <span>تقرير المصروفات</span>
                    </h4>
                    <div class="space-y-2">
                        <p>إجمالي المصروفات: <span class="font-bold text-amber-400">${stats.totalExpenses.toLocaleString()} ${settings.currency}</span></p>
                    </div>
                </div>
                
                <!-- تقرير العمالة -->
                <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h4 class="text-xl font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-users text-orange-400"></i>
                        <span>تقرير العمالة</span>
                    </h4>
                    <div class="space-y-2">
                        <p>عدد العمال: <span class="font-bold text-amber-400">${stats.workersCount}</span></p>
                    </div>
                </div>
                
                <!-- تقرير الفلاحين -->
                <div class="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h4 class="text-xl font-bold mb-4 flex items-center gap-2">
                        <i class="fas fa-user-tie text-emerald-400"></i>
                        <span>تقرير الفلاحين</span>
                    </h4>
                    <div class="space-y-2">
                        <p>عدد الفلاحين: <span class="font-bold text-amber-400">${stats.farmersCount}</span></p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== الإعدادات ====================
function showSettings() {
    const settings = db.getSettings();
    const content = document.getElementById('content');
    
    content.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">
                <i class="fas fa-cog text-gray-400"></i>
                <span>إعدادات النظام</span>
            </h3>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-gray-300 mb-2">اسم الشركة</label>
                    <input id="companyName" type="text" value="${settings.companyName || ''}" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">نسبة عمولة الوكالة (%)</label>
                    <input id="commissionRate" type="number" value="${settings.commissionRate || 5}" min="0" max="100" step="0.1"
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div>
                    <label class="block text-gray-300 mb-2">العملة</label>
                    <input id="currency" type="text" value="${settings.currency || 'ج.م'}" 
                           class="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                </div>
                
                <div class="flex gap-3 pt-4">
                    <button id="saveSettings" class="flex-1 bg-gradient-to-l from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-save ml-2"></i>
                        حفظ الإعدادات
                    </button>
                    <button id="cancelForm" class="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition">
                        <i class="fas fa-times ml-2"></i>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('saveSettings').addEventListener('click', () => {
        const companyName = document.getElementById('companyName').value.trim();
        const commissionRate = parseFloat(document.getElementById('commissionRate').value) || 0;
        const currency = document.getElementById('currency').value.trim();
        
        db.updateSettings({ companyName, commissionRate, currency });
        showToast('تم حفظ الإعدادات بنجاح', 'success');
        showDashboard();
    });
    
    document.getElementById('cancelForm').addEventListener('click', showDashboard);
}

// ==================== دوال مساعدة ====================
function refreshData() {
    updateStats();
}

// دوال الحذف
window.deleteProduct = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        db.deleteProduct(id);
        showToast('تم الحذف بنجاح', 'success');
        showProductsList();
    }
};

window.deleteWorker = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا العامل؟')) {
        db.deleteWorker(id);
        showToast('تم الحذف بنجاح', 'success');
        showWorkersList();
    }
};

window.deleteFarmer = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا الفلاح؟')) {
        db.deleteFarmer(id);
        showToast('تم الحذف بنجاح', 'success');
        showFarmersList();
    }
};

window.deleteExpense = (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
        db.deleteExpense(id);
        showToast('تم الحذف بنجاح', 'success');
        showExpensesList();
    }
};

// دوال التعديل (للنسخ القادمة)
window.editProduct = (id) => {
    showToast('خاصية التعديل قيد التطوير', 'info');
};

window.editWorker = (id) => {
    showToast('خاصية التعديل قيد التطوير', 'info');
};

window.editFarmer = (id) => {
    showToast('خاصية التعديل قيد التطوير', 'info');
};

// تصدير الدوال للاستخدام العام
window.showProductForm = showProductForm;
window.showPurchaseForm = showPurchaseForm;
window.showSaleForm = showSaleForm;
window.showWorkerForm = showWorkerForm;
window.showFarmerForm = showFarmerForm;
window.showExpenseForm = showExpenseForm;
window.showProductsList = showProductsList;
window.showPurchasesList = showPurchasesList;
window.showSalesList = showSalesList;
window.showWorkersList = showWorkersList;
window.showFarmersList = showFarmersList;
window.showExpensesList = showExpensesList;
window.showReports = showReports;
window.showSettings = showSettings;

// بدء التطبيق
document.addEventListener('DOMContentLoaded', () => {
    showLogin();
});
