import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { 
    IoCalendarClearOutline, 
    IoAlarmOutline, 
    IoImageOutline, 
    IoPlayCircleOutline,
    IoAddCircle,
    IoPeopleOutline,
    IoCloudUploadOutline
} from "react-icons/io5";
import styles from './Dashboard.module.css';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

const CalendarIcon = IoCalendarClearOutline as React.ElementType;
const AlarmIcon = IoAlarmOutline as React.ElementType;
const ImageIcon = IoImageOutline as React.ElementType;
const PlayIcon = IoPlayCircleOutline as React.ElementType;
const AddIcon = IoAddCircle as React.ElementType;
const PeopleIcon = IoPeopleOutline as React.ElementType;
const CloudIcon = IoCloudUploadOutline as React.ElementType;


// Types 
interface Memory {
    memory_id: number;
    title: string;
    content: string;
    date_of_event: string;
    images: { file_path: string }[];
    image_url: string;
    audio_url: string;
}

interface Reminder {
    reminder_id: number;
    title: string;
    reminder_date: string;
}

const Dashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    // Date Formatting
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const [memories, setMemories] = useState<Memory[]>([]); 
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [seniorCount, setSeniorCount] = useState(0);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!token) return;
            
            try {

                // Fetch Senior Count
                const seniorsRes = await axios.get(`${BACKEND_URL}/api/collaborations/seniors`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSeniorCount(seniorsRes.data.length);

                // Fetch Reminders
                const reminderRes = await axios.get(`${BACKEND_URL}/api/reminders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReminders(reminderRes.data);

                // Fetch Memories
                const memoryRes = await axios.get(`${BACKEND_URL}/api/memory`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // We slice(0, 4) to show only the 4 most recent memories
                setMemories(memoryRes.data.slice(0, 4));

            } catch (error) {
                console.error("Dashboard load failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [token]);

    return (
        <div className={styles.container}>
            
            {/* HEADER SECTION */}
            <header className={styles.header}>
                <div className={styles.welcomeSection}>
                    <h1 className={styles.greeting}>Welcome back, {user?.fullname?.split(' ')[0]}!</h1>
                    <div className={styles.dateBadge}>
                        <CalendarIcon size={16} color="#5A2167" />
                        <span className={styles.dateText}>{dayOfWeek}, {formattedDate}</span>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className={styles.actionGroup}>
                    <button onClick={() => navigate('/create-reminder')} className={styles.actionButtonSecondary}>
                        <AddIcon size={20} />
                        <span>Add Reminder</span>
                    </button>
                    <button onClick={() => navigate('/create-memory')} className={styles.actionButtonPrimary}>
                        <AddIcon size={20} />
                        <span>Add Memory</span>
                    </button>
                </div>
            </header>

            {/* STATS OVERVIEW */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard} onClick={() => navigate('/seniors')} style={{cursor: 'pointer'}}>
                    <div className={styles.statIconBoxPurple}>
                        <PeopleIcon size={28} color="#5A2167" />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Seniors Monitored</p>
                        <h2 className={styles.statValue}>{seniorCount}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIconBoxOrange}>
                        <CloudIcon size={28} color="#E87127" />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Memories Uploaded</p>
                        <h2 className={styles.statValue}>{user?.memory_count || 0}</h2>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className={styles.contentGrid}>
                
                {/* LEFT COLUMN: Reminders */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Upcoming Reminders</h3>
                        <button onClick={() => navigate('/reminders')} className={styles.seeAllLink}>See all</button>
                    </div>

                    <div className={styles.listContainer}>
                        {/* Empty State / Placeholder */}
                        {reminders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <AlarmIcon size={40} color="#DABDEC" />
                                <p className={styles.emptyText}>No upcoming reminders scheduled.</p>
                            </div>
                        ) : (
                            reminders.map(r => (
                                <div key={r.reminder_id} className={styles.reminderItem}>
                                    <AlarmIcon size={40} color="#DABDEC" />
                                    <div style={{marginLeft: '15px'}}>
                                        <p className={styles.itemTitle}>{r.title}</p>
                                        <p className={styles.itemSub}>{new Date(r.reminder_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Recent Memories */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Recent Memories</h3>
                        <button onClick={() => navigate('/memories')} className={styles.seeAllLink}>View Gallery</button>
                    </div>

                    <div className={styles.listContainer}>
                        {/* Empty State / Placeholder */}
                        {memories.length === 0 ? (
                            <div className={styles.emptyState}>
                                <ImageIcon size={40} color="#DABDEC" />
                                <p className={styles.emptyText}>No memories shared yet.</p>
                            </div>
                        ) : (
                            memories.map(m => (
                                <div key={m.memory_id} className={styles.memoryCard}>
                                    {/* Image Logic from Mobile */}
                                    <div className={styles.memoryImageContainer}>
                                        {(m.image_url || (m.images && m.images.length > 0)) ? (
                                            <img 
                                                src={m.image_url || m.images[0].file_path} 
                                                alt="memory" 
                                                className={styles.memoryImg} 
                                            />
                                        ) : (
                                            <div className={styles.placeholderImg}>
                                                <ImageIcon size={28} color="#A78BFA" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{flex: 1, padding: '0 15px'}}>
                                        <p className={styles.itemTitle}>{m.title}</p>
                                        <p className={styles.itemSub}>{new Date(m.date_of_event).toLocaleDateString()}</p>
                                    </div>

                                    {/* Play Button Visual */}
                                    <button className={styles.playBtn}>
                                        <PlayIcon size={28} color="#5A2167" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;