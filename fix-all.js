// 完整的功能修复文件
// 这个文件将修复所有功能问题，包括语言切换和权限控制

(function() {
    console.log('HKTCWAC Fix-All Script Loaded');
    
    // ===== 修复语言切换功能 =====
    window.setupLanguageToggle = function() {
        console.log('Setting up language toggle...');
        
        // 获取语言切换按钮
        const langToggle = document.getElementById('lang-toggle');
        const langToggleMobile = document.getElementById('lang-toggle-mobile');
        
        console.log('Language toggle buttons:', langToggle, langToggleMobile);
        
        // 检查本地存储中的语言设置
        const savedLang = localStorage.getItem('language') || 'zh';
        setLanguage(savedLang);
        
        // 语言切换事件
        function toggleLanguage() {
            console.log('Toggle language clicked');
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            
            console.log('Switching language from', currentLang, 'to', newLang);
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        }
        
        // 为按钮添加点击事件
        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguage);
            console.log('Added click listener to desktop language toggle');
        }
        
        if (langToggleMobile) {
            langToggleMobile.addEventListener('click', toggleLanguage);
            console.log('Added click listener to mobile language toggle');
        }
    };
    
    // 设置页面语言
    window.setLanguage = function(lang) {
        console.log('Setting language to:', lang);
        
        // 更新HTML根元素的lang属性
        document.documentElement.lang = lang;
        
        // 显示对应语言的元素
        const zhElements = document.querySelectorAll('[data-lang="zh"]');
        const enElements = document.querySelectorAll('[data-lang="en"]');
        
        console.log('Found', zhElements.length, 'zh elements and', enElements.length, 'en elements');
        
        zhElements.forEach(el => {
            el.classList.toggle('hidden', lang !== 'zh');
        });
        
        enElements.forEach(el => {
            el.classList.toggle('hidden', lang !== 'en');
        });
        
        // 更新语言切换按钮文本
        const toggleText = lang === 'zh' ? 'English' : '中文';
        const currentLangElements = document.querySelectorAll('[data-lang="current"]');
        currentLangElements.forEach(el => {
            el.textContent = toggleText;
        });
        
        console.log('Language set to', lang, 'successfully');
    };
    
    // ===== 修复权限控制功能 =====
    window.checkAdminLogin = function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        console.log('Checking admin login status:', isLoggedIn);
        return isLoggedIn;
    };
    
    window.showPermissionStatus = function() {
        console.log('Showing permission status...');
        
        const isLoggedIn = checkAdminLogin();
        const username = localStorage.getItem('adminUsername');
        
        console.log('Login status:', isLoggedIn, 'Username:', username);
        
        // 创建或更新权限状态显示
        let statusElement = document.getElementById('permission-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'permission-status';
            statusElement.className = 'fixed top-4 right-4 z-50';
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .permission-badge {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(8px);
                    transition: all 0.3s ease;
                    z-index: 9999;
                }
                
                /* 桌面端样式 */
                @media (min-width: 768px) {
                    #permission-status {
                        top: 80px !important;
                        right: 20px !important;
                        left: auto !important;
                    }
                }
                
                /* 平板端样式 */
                @media (min-width: 640px) and (max-width: 767px) {
                    #permission-status {
                        top: 70px !important;
                        right: 16px !important;
                        left: auto !important;
                    }
                }
                
                /* 手机端样式 */
                @media (max-width: 639px) {
                    #permission-status {
                        top: 100px !important;
                        right: 12px !important;
                        left: 12px !important;
                        width: auto;
                        max-width: none;
                    }
                    
                    .permission-badge {
                        justify-content: center;
                        font-size: 0.8rem;
                        padding: 0.4rem 0.8rem;
                    }
                }
                .permission-badge.admin {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    color: #065f46;
                }
                .permission-badge.guest {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    color: #1e40af;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(statusElement);
            console.log('Created permission status element');
        }
        
        // 更新状态内容
        if (isLoggedIn && username) {
            statusElement.innerHTML = `
                <div class="permission-badge admin">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span data-lang="zh">管理員: ${username}</span>
                    <span data-lang="en" class="hidden">Admin: ${username}</span>
                </div>
            `;
            console.log('Displaying admin status');
        } else {
            statusElement.innerHTML = `
                <div class="permission-badge guest">
                    <i data-lucide="user" class="w-4 h-4"></i>
                    <span data-lang="zh">訪客模式</span>
                    <span data-lang="en" class="hidden">Guest Mode</span>
                </div>
            `;
            console.log('Displaying guest status');
        }
        
        // 渲染图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('Rendered Lucide icons');
        }
    };
    
    window.showNotification = function(message, type = 'info', duration = 3000) {
        console.log('Showing notification:', message, type);
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : type === 'warning' ? 'alert-triangle' : 'info'}" class="w-5 h-5 text-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">${message}</p>
                </div>
            </div>
        `;
        
        // 添加样式
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 360px;
                    background: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    padding: 1rem;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    z-index: 9999;
                }
                
                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .notification.info {
                    border-left: 4px solid #3b82f6;
                }
                
                .notification.success {
                    border-left: 4px solid #10b981;
                }
                
                .notification.error {
                    border-left: 4px solid #ef4444;
                }
                
                .notification.warning {
                    border-left: 4px solid #f59e0b;
                }
            `;
            document.head.appendChild(style);
        }
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    };
    
    window.adminLogout = function() {
        console.log('Admin logout initiated');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('adminUsername');
        showNotification('已成功登出', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    };
    
    window.showAdminMenu = function() {
        console.log('Showing admin menu...');
        
        const adminMenu = document.getElementById('admin-menu');
        const adminMenuMobile = document.getElementById('admin-menu-mobile');
        
        console.log('Admin menu elements:', adminMenu, adminMenuMobile);
        
        if (adminMenu) {
            adminMenu.classList.remove('hidden');
            console.log('Shown desktop admin menu');
        }
        
        if (adminMenuMobile) {
            adminMenuMobile.classList.remove('hidden');
            console.log('Shown mobile admin menu');
        }
        
        // 显示权限状态
        showPermissionStatus();
    };
    
    window.setupAdminFeatures = function() {
        console.log('Setting up admin features...');
        
        const adminLoginBtn = document.getElementById('admin-login-btn');
        const adminLoginBtnMobile = document.getElementById('admin-login-btn-mobile');
        
        console.log('Admin login buttons:', adminLoginBtn, adminLoginBtnMobile);
        
        // 检查是否已登录
        if (checkAdminLogin()) {
            showAdminMenu();
            
            // 隐藏登录按钮
            if (adminLoginBtn) {
                adminLoginBtn.classList.add('hidden');
                console.log('Hidden desktop login button');
            }
            if (adminLoginBtnMobile) {
                adminLoginBtnMobile.classList.add('hidden');
                console.log('Hidden mobile login button');
            }
            
            // 设置登出按钮事件
            const logoutButtons = document.querySelectorAll('.admin-logout');
            console.log('Found', logoutButtons.length, 'logout buttons');
            
            logoutButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Logout button clicked');
                    adminLogout();
                });
            });
        } else {
            // 显示登录按钮
            if (adminLoginBtn) {
                adminLoginBtn.classList.remove('hidden');
                console.log('Shown desktop login button');
            }
            if (adminLoginBtnMobile) {
                adminLoginBtnMobile.classList.remove('hidden');
                console.log('Shown mobile login button');
            }
        }
        
        // 显示权限状态
        showPermissionStatus();
    };
    
    // ===== 修复移动端菜单功能 =====
    window.setupMobileMenu = function() {
        console.log('Setting up mobile menu...');
        
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        console.log('Mobile menu elements:', mobileMenuButton, mobileMenu);
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                console.log('Mobile menu button clicked');
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // 设置下拉菜单
        const mobileSubmenuButtons = document.querySelectorAll('[id$="-menu-button"]');
        console.log('Found', mobileSubmenuButtons.length, 'mobile submenu buttons');
        
        mobileSubmenuButtons.forEach(button => {
            const menuId = button.id.replace('-button', '');
            const menu = document.getElementById(menuId);
            
            if (menu) {
                button.addEventListener('click', () => {
                    console.log('Mobile submenu button clicked:', button.id);
                    menu.classList.toggle('hidden');
                });
            }
        });
    };
    
    // ===== 页面初始化 =====
    function initializePage() {
        console.log('Initializing page...');
        
        // 等待Lucide加载完成
        if (typeof lucide === 'undefined') {
            console.log('Lucide not loaded yet, waiting...');
            setTimeout(initializePage, 100);
            return;
        }
        
        console.log('Initializing all features...');
        
        // 初始化语言切换功能
        setupLanguageToggle();
        
        // 初始化移动端菜单
        setupMobileMenu();
        
        // 设置管理员功能
        setupAdminFeatures();
        
        // 为所有需要权限的按钮添加权限检查
        document.querySelectorAll('.edit-btn, .delete-btn, #add-announcement-btn').forEach(btn => {
            const originalClick = btn.onclick;
            btn.onclick = function(e) {
                if (e && e.preventDefault) e.preventDefault();
                
                console.log('Button clicked, checking permissions:', btn.id);
                
                // 检查管理员权限
                if (!checkAdminLogin()) {
                    showNotification('请先登录管理员账户', 'error');
                    return false;
                }
                
                // 如果有原始点击事件，执行它
                if (originalClick) {
                    originalClick.call(this, e);
                }
                
                return false;
            };
        });
        
        console.log('Page initialization completed');
    }
    
    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage);
    } else {
        initializePage();
    }
})();

// 检查并显示自定义Logo
function checkCustomLogo() {
    console.log('检查自定义Logo...');
    
    const customLogo = localStorage.getItem('customLogo');
    const logoImage = document.getElementById('logo-image');
    
    if (customLogo && logoImage) {
        console.log('发现自定义Logo，更新显示');
        logoImage.src = customLogo;
    } else {
        console.log('未发现自定义Logo，使用默认Logo');
    }
}

// 处理Logo上传功能
function handleLogoUpload(event) {
    console.log('Logo上传处理函数被调用');
    
    // 检查管理员权限
    if (!checkAdminLogin()) {
        showNotification('请先登录管理员账户', 'error');
        return;
    }
    
    const file = event.target.files[0];
    if (!file) {
        console.log('没有选择文件');
        return;
    }
    
    console.log('选择的文件:', file.name, file.type, file.size);
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showNotification('请选择图片文件', 'error');
        return;
    }
    
    // 检查文件大小（限制为2MB）
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        showNotification('图片大小不能超过2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('文件读取完成，更新Logo');
        
        // 更新Logo图片
        const logoImage = document.getElementById('logo-image');
        if (logoImage) {
            logoImage.src = e.target.result;
            console.log('Logo图片已更新');
        }
        
        // 保存到localStorage（Base64格式）
        try {
            localStorage.setItem('customLogo', e.target.result);
            console.log('Logo已保存到localStorage');
            showNotification('Logo上传成功！', 'success');
        } catch (error) {
            console.error('保存Logo失败:', error);
            showNotification('Logo保存失败，请重试', 'error');
        }
    };
    
    reader.onerror = function() {
        console.error('文件读取失败');
        showNotification('图片读取失败，请重试', 'error');
    };
    
    console.log('开始读取文件...');
    reader.readAsDataURL(file);
}