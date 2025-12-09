import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
    IoGridOutline, 
    IoAlarmOutline, 
    IoImageOutline, 
    IoLogOutOutline,
    IoPersonCircleOutline,
    IoNotificationsOutline,
    IoMenu
} from "react-icons/io5";

import { FaUsers } from "react-icons/fa";

// Fix for Icon Types
const DashboardIcon = IoGridOutline as React.ElementType;
const ReminderIcon = IoAlarmOutline as React.ElementType;
const MemoryIcon = IoImageOutline as React.ElementType;
const LogoutIcon = IoLogOutOutline as React.ElementType;
const ProfileIcon = IoPersonCircleOutline as React.ElementType;
const NotifIcon = IoNotificationsOutline as React.ElementType;
const MenuIcon = IoMenu as React.ElementType;
const ColabIcon = FaUsers as React.ElementType;

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. STATE: Track if sidebar is open or collapsed
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: DashboardIcon },
        { label: 'Reminders', path: '/reminders', icon: ReminderIcon },
        { label: 'Memories', path: '/memories', icon: MemoryIcon },
        { label: 'Collaboration', path: '/collaboration', icon: ColabIcon },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div style={styles.layoutContainer}>
            
            {/* --- LEFT SIDEBAR --- */}
            <aside style={{
                ...styles.sidebar,
                width: isCollapsed ? '80px' : '260px', // Dynamic Width
            }}>
                {/* Brand Area */}
                <div style={{
                    ...styles.brandContainer,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    padding: isCollapsed ? '30px 0' : '30px 20px',
                }}>
                    <img 
                        src="/images/girumdom_icon.png" 
                        alt="Logo" 
                        style={{ ...styles.logo, width: isCollapsed ? '40px' : '40px' }} 
                    />
                    {/* Hide Title if Collapsed */}
                    {!isCollapsed && <h2 style={styles.brandTitle}>Girumdom</h2>}
                </div>

                {/* Navigation Links */}
                <nav style={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button 
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                title={isCollapsed ? item.label : ''} // Tooltip when collapsed
                                style={{
                                    ...styles.navItem,
                                    ...(isActive ? styles.navItemActive : {}),
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                }}
                            >
                                <item.icon size={22} />
                                {/* Hide Label if Collapsed */}
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div style={styles.sidebarFooter}>
                    <button 
                        onClick={handleLogout} 
                        style={{
                            ...styles.logoutBtn,
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                        }}
                    >
                        <LogoutIcon size={22} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div style={{
                ...styles.mainContent,
                marginLeft: isCollapsed ? '80px' : '260px', // Match Sidebar Width
            }}>
                
                {/* --- TOP HEADER --- */}
                <header style={styles.topHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        
                        {/* 2. BURGER BUTTON (Toggles State) */}
                        <button 
                            onClick={() => setIsCollapsed(!isCollapsed)} 
                            style={styles.burgerBtn}
                        >
                            <MenuIcon size={24} color="#5A2167" />
                        </button>

                        <h3 style={styles.pageTitle}>Girumdom Portal</h3>
                    </div>

                    <div style={styles.headerActions}>
                        <button style={styles.iconBtn}>
                            <NotifIcon size={24} color="#6B7280" />
                            <div style={styles.notifDot} />
                        </button>
                        
                        <div style={styles.userProfile}>
                            <span style={styles.userName}>{user?.fullname}</span>
                            <ProfileIcon size={32} color="#5A2167" />
                        </div>
                    </div>
                </header>

                <main style={styles.pageWrapper}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    layoutContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: "'Open Sans', sans-serif",
    },
    // Sidebar
    sidebar: {
        backgroundColor: '#5A2167',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 10,
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        transition: 'width 0.3s ease', // Smooth animation
        overflowX: 'hidden', // Hides content while animating
    },
    brandContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        whiteSpace: 'nowrap', // Prevents title from wrapping during collapse
    },
    logo: {
        borderRadius: '8px',
    },
    brandTitle: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
    },
    nav: {
        padding: '20px 10px', // Reduce horizontal padding to fit collapsed state
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        flex: 1,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    navItemActive: {
        backgroundColor: '#E87127',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    },
    sidebarFooter: {
        padding: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    logoutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        color: 'white',
        width: '100%',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },

    // Main Content
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease', // Smooth animation for content push
    },
    topHeader: {
        height: '70px',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        borderBottom: '1px solid #e5e7eb',
    },
    // New Burger Button Style
    burgerBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
    },
    pageTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        padding: '5px',
    },
    notifDot: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '8px',
        height: '8px',
        backgroundColor: '#EF4444',
        borderRadius: '50%',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    userName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    pageWrapper: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
};

export default MainLayout;