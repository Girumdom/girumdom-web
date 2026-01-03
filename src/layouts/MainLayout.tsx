import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getPendingInvitations, acceptInvite, declineInvite } from '../services/collaboration';
import { BACKEND_URL } from '../constant';

// STYLES
import styles from './MainLayout.module.css';

import { 
    IoGridOutline, 
    IoAlarmOutline, 
    IoImageOutline, 
    IoLogOutOutline,
    IoPersonCircleOutline,
    IoNotificationsOutline,
    IoMenu,
    IoMailOpenOutline,
    IoCamera
} from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

// Icons
const DashboardIcon = IoGridOutline as React.ElementType;
const ReminderIcon = IoAlarmOutline as React.ElementType;
const MemoryIcon = IoImageOutline as React.ElementType;
const LogoutIcon = IoLogOutOutline as React.ElementType;
const ProfileIcon = IoPersonCircleOutline as React.ElementType;
const NotifIcon = IoNotificationsOutline as React.ElementType;
const MenuIcon = IoMenu as React.ElementType;
const ColabIcon = FaUsers as React.ElementType;
const MailIcon = IoMailOpenOutline as React.ElementType;
const CameraIcon = IoCamera as React.ElementType;

// Cloudinary Upload Config
const CLOUDINARY_UPLOAD_PRESET = 'girumdom_upload';
const CLOUDINARY_CLOUD_NAME = 'dicllpbrr';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const MainLayout = () => {
    const { user, logout, token, updateUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Notifications State
    const [invites, setInvites] = useState<any[]>([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);

    // Profile Picture Upload States
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Invites Logic (Same as before)
    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const data = await getPendingInvitations(token);
            setInvites(data);
        } catch (error) {
            console.error("Failed to load notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

    // Profile Picture Upload Handlers
    // file selection & upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // A. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const cloudRes = await fetch(CLOUDINARY_API_URL, { method: 'POST', body: formData });
            const cloudData = await cloudRes.json();

            if (!cloudData.secure_url) throw new Error("Cloudinary upload failed");
            const newImageUrl = cloudData.secure_url;

            // B. Update Backend
            const backendRes = await fetch(`${BACKEND_URL}/api/user/${user?.user_id}/profile-picture`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ profile_picture: newImageUrl })
            });

            if (!backendRes.ok) throw new Error("Backend update failed");

            // C. Update Context (Optimistic UI)
            if (updateUser && user) {
                updateUser({ ...user, profile_picture: newImageUrl });
            } else {
                // Fallback if updateUser isn't available
                window.location.reload(); 
            }
            
            alert("Profile picture updated successfully!");

        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to update profile picture.");
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset file input
        }
    };

    
    // Notification Handlers
    const handleAccept = async (inviteId: number) => {
        setIsLoadingNotifs(true);
        try {
            await acceptInvite(inviteId, token!);
            alert("Invitation Accepted!");
            fetchNotifications();
            navigate('/seniors');
            setShowNotifDropdown(false);
        } catch (error) {
            alert("Failed to accept");
        } finally {
            setIsLoadingNotifs(false);
        }
    };

    const handleDecline = async (inviteId: number) => {
        if(!window.confirm("Decline this invitation?")) return;
        setIsLoadingNotifs(true);
        try {
            await declineInvite(inviteId, token!);
            fetchNotifications();
        } catch (error) {
            alert("Failed to decline");
        } finally {
            setIsLoadingNotifs(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: DashboardIcon },
        { label: 'Reminders', path: '/reminders', icon: ReminderIcon },
        { label: 'Memories', path: '/memories', icon: MemoryIcon },
        { label: 'Collaboration', path: '/seniors', icon: ColabIcon },
    ];

    return (
        <div className={styles.layoutContainer}>
            <input 
                id="profile-upload-input"
                type="file" 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleFileChange}
                disabled={isUploading} // Disable while uploading
            />
            
            {/* SIDEBAR */}
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
                
                {/* Brand */}
                <div className={styles.brandContainer} 
                     style={{ 
                         justifyContent: isCollapsed ? 'center' : 'flex-start',
                         padding: isCollapsed ? '30px 0' : '30px 20px' 
                     }}>
                    <img src="/images/girumdom_icon.png" alt="Logo" className={styles.logo} />
                    {!isCollapsed && <h2 className={styles.brandTitle}>Girumdom</h2>}
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button 
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                title={isCollapsed ? item.label : ''}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                            >
                                <item.icon size={22} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className={styles.sidebarFooter}>
                    <button 
                        onClick={handleLogout} 
                        className={styles.logoutBtn}
                        style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                    >
                        <LogoutIcon size={22} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className={`${styles.mainContent} ${isCollapsed ? styles.contentCollapsed : styles.contentExpanded}`}>
                
                <header className={styles.topHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className={styles.burgerBtn}>
                            <MenuIcon size={24} color="#5A2167" />
                        </button>
                        <h3 className={styles.pageTitle}>Girumdom Portal</h3>
                    </div>

                    <div className={styles.headerActions}>
                        {/* NOTIFICATION BELL */}
                        <div style={{ position: 'relative' }}>
                            <button className={styles.iconBtn} onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                                <NotifIcon size={24} color="#6B7280" />
                                {invites.length > 0 && <div className={styles.notifDot} />}
                            </button>

                            {/* DROPDOWN */}
                            {showNotifDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <h4 className={styles.dropdownHeader}>Notifications</h4>
                                    {invites.length === 0 ? (
                                        <div className={styles.emptyNotif}>
                                            <p>No new notifications</p>
                                        </div>
                                    ) : (
                                        <div className={styles.notifList}>
                                            {invites.map(invite => (
                                                <div key={invite.invite_id} className={styles.notifItem}>
                                                    <div className={styles.notifContent}>
                                                        <MailIcon color="#5A2167" size={16} style={{marginTop: 3}}/>
                                                        <div>
                                                            <p className={styles.notifText}>
                                                                <strong>{invite.inviter_name}</strong> invited you to join <strong>{invite.collaboration_name}</strong>
                                                            </p>
                                                            <span className={styles.notifTime}>Role: {invite.role}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.notifActions}>
                                                        <button 
                                                            className={styles.acceptBtnSmall}
                                                            onClick={() => handleAccept(invite.invite_id)}
                                                            disabled={isLoadingNotifs}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            className={styles.declineBtnSmall}
                                                            onClick={() => handleDecline(invite.invite_id)}
                                                            disabled={isLoadingNotifs}
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* PROFILE */}
                        <label 
                            htmlFor="profile-upload-input" 
                            className={styles.userProfile} 
                            title="Click to update profile picture"
                            style={{ cursor: isUploading ? 'wait' : 'pointer' }}
                        >
                            <span className={styles.userName}>{user?.fullname}</span>
                            
                            {isUploading ? (
                                <div className={styles.loader} />
                            ) : user?.profile_picture ? (
                                <img 
                                    src={user.profile_picture} 
                                    alt="Profile" 
                                    className={styles.profileImage}
                                    style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover',
                                        border: '2px solid #5A2167' 
                                    }}
                                />
                            ) : (
                                <ProfileIcon size={32} color="#5A2167" />
                            )}
                        </label>
                    </div>
                </header>

                <main className={styles.pageWrapper}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;