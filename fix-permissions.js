// 修复权限控制功能的补丁文件
// 这个文件将在页面加载时自动执行，确保所有权限控制功能正常工作

(function() {
    // 确保必要的函数存在
    if (typeof checkAdminLogin === 'undefined') {
        window.checkAdminLogin = function() {
            return localStorage.getItem('isLoggedIn') === 'true';
        };
    }
    
    if (typeof showPermissionStatus === 'undefined') {
        window.showPermissionStatus = function() {
            const isLoggedIn = checkAdminLogin();
            const username = localStorage.getItem('adminUsername');
            
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
            } else {
                statusElement.innerHTML = `
                    <div class="permission-badge guest">
                        <i data-lucide="user" class="w-4 h-4"></i>
                        <span data-lang="zh">訪客模式</span>
                        <span data-lang="en" class="hidden">Guest Mode</span>
                    </div>
                `;
            }
            
            // 渲染图标
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        };
    }
    
    // 确保通知函数存在
    if (typeof showNotification === 'undefined') {
        window.showNotification = function(message, type = 'info', duration = 3000) {
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
    }
    
    // 确保管理员登出函数存在
    if (typeof adminLogout === 'undefined') {
        window.adminLogout = function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('adminUsername');
            showNotification('已成功登出', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        };
    }
    
    // 确保管理员菜单显示函数存在
    if (typeof showAdminMenu === 'undefined') {
        window.showAdminMenu = function() {
            const adminMenu = document.getElementById('admin-menu');
            const adminMenuMobile = document.getElementById('admin-menu-mobile');
            
            if (adminMenu) {
                adminMenu.classList.remove('hidden');
            }
            
            if (adminMenuMobile) {
                adminMenuMobile.classList.remove('hidden');
            }
            
            // 显示权限状态
            showPermissionStatus();
        };
    }
    
    // 确保管理员功能设置函数存在
    if (typeof setupAdminFeatures === 'undefined') {
        window.setupAdminFeatures = function() {
            const adminLoginBtn = document.getElementById('admin-login-btn');
            const adminLoginBtnMobile = document.getElementById('admin-login-btn-mobile');
            
            // 检查是否已登录
            if (checkAdminLogin()) {
                showAdminMenu();
                
                // 隐藏登录按钮
                if (adminLoginBtn) adminLoginBtn.classList.add('hidden');
                if (adminLoginBtnMobile) adminLoginBtnMobile.classList.add('hidden');
                
                // 设置登出按钮事件
                const logoutButtons = document.querySelectorAll('.admin-logout');
                logoutButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        adminLogout();
                    });
                });
            } else {
                // 显示登录按钮
                if (adminLoginBtn) adminLoginBtn.classList.remove('hidden');
                if (adminLoginBtnMobile) adminLoginBtnMobile.classList.remove('hidden');
            }
            
            // 显示权限状态
            showPermissionStatus();
        };
    }
    
    // 页面加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 显示权限状态
        showPermissionStatus();
        
        // 设置管理员功能
        setupAdminFeatures();
        
        // 为所有需要权限的按钮添加权限检查
        document.querySelectorAll('.edit-btn, .delete-btn, #add-announcement-btn').forEach(btn => {
            const originalClick = btn.onclick;
            btn.onclick = function(e) {
                if (e && e.preventDefault) e.preventDefault();
                
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
    });
})();