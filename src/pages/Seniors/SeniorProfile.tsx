import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import EditReminderModal from '../Reminders/EditReminderModal';
import { IoArrowBack, IoPersonCircle, IoCalendar, IoImage, IoPlayCircleOutline, IoTrashOutline, IoPencil } from "react-icons/io5";
import styles from './SeniorProfile.module.css';
import { BACKEND_URL } from '../../constant';

// --- Types ---
interface Memory {
    memory_id: number;
    title: string;
    date_of_event: string;
    images: { file_path: string }[]; 
    audio_url?: string;
}

interface Reminder {
    reminder_id: number;
    title: string;
    reminder_date: string;
    description: string | null;
    repeat_interval: string;
}

interface SeniorData {
    fullname: string;
    email: string;
    profile_picture: string;
    memories: Memory[];
    reminders: Reminder[];
}

const ArrowBackIcon = IoArrowBack as React.ElementType;
const CalendarIcon = IoCalendar as React.ElementType;
const ImageIcon = IoImage as React.ElementType;
const PlayCircleIcon = IoPlayCircleOutline as React.ElementType;
const PersonIcon = IoPersonCircle as React.ElementType;
const TrashIcon = IoTrashOutline as React.ElementType;
const PencilIcon = IoPencil as React.ElementType;

const SeniorProfile = () => {
    const { id } = useParams(); // Get :senior_id from URL
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [data, setData] = useState<SeniorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'memories' | 'reminders'>('memories');
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

    const handleDeleteReminder = async (reminderId: number) => {
        if (!window.confirm("Are you sure you want to delete this reminder?")) return;

        try {
            await axios.delete(`${BACKEND_URL}/api/reminders/${reminderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update UI immediately (Optimistic update)
            if (data) {
                setData({
                    ...data,
                    reminders: data.reminders.filter(r => r.reminder_id !== reminderId)
                });
            }
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete reminder.");
        }
    };

    const fetchDetails = useCallback(async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/collaborations/seniors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error("Failed to load profile", error);
            alert("Could not load senior details.");
            navigate('/seniors');
        } finally {
            setLoading(false);
        }
    }, [id, token, navigate]);

    useEffect(() => {
        if (token && id) fetchDetails();
    }, [fetchDetails, token, id]);

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (!data) return null;

    return (
        <div className={styles.container}>
            {/* Header / Profile Card */}
            <div className={styles.headerCard}>
                <button onClick={() => navigate('/seniors')} className={styles.backButton}>
                    <ArrowBackIcon size={24} /> Back
                </button>
                
                <div className={styles.profileInfo}>
                    {data.profile_picture ? (
                        <img src={data.profile_picture} alt="Profile" className={styles.avatar} />
                    ) : (
                        <PersonIcon size={80} color="#A78BFA" />
                    )}
                    <div>
                        <h1 className={styles.name}>{data.fullname}</h1>
                        <p className={styles.email}>{data.email}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabContainer}>
                <button 
                    className={`${styles.tab} ${activeTab === 'memories' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('memories')}
                >
                    Memories ({data.memories.length})
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'reminders' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('reminders')}
                >
                    Upcoming Reminders ({data.reminders.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className={styles.contentArea}>
                {activeTab === 'memories' && (
                    <div className={styles.grid}>
                        {data.memories.map(mem => (
                            <div key={mem.memory_id} className={styles.memoryCard}>
                                {/* IMAGE LOGIC */}
                                <div className={styles.imgPlaceholder}>
                                    {mem.images && mem.images.length > 0 ? (
                                        <img 
                                            src={mem.images[0].file_path} 
                                            alt={mem.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        /* Fallback Icon */
                                        <ImageIcon size={40} color="#5A2167" />
                                    )}
                                </div>

                                <div className={styles.cardBody}>
                                    <h4>{mem.title}</h4>
                                    <p>{new Date(mem.date_of_event).toLocaleDateString()}</p>
                                    {mem.audio_url && (
                                        <button className={styles.playBtn}>
                                            <PlayCircleIcon size={20} /> Listen
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'reminders' && (
                    <div className={styles.list}>
                        {data.reminders.length === 0 ? (
                            <p className={styles.emptyText}>No upcoming reminders.</p>
                        ) : (
                            data.reminders.map(rem => (
                                <div key={rem.reminder_id} className={styles.reminderItem}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                                        <CalendarIcon size={24} color="#E87127" />
                                        <div>
                                            <h4>{rem.title}</h4>
                                            <p>{new Date(rem.reminder_date).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* EDIT BUTTON */}
                                    <button 
                                        className={styles.actionIconBtn} 
                                        onClick={() => setEditingReminder(rem)}
                                        title="Edit"
                                    >
                                        <PencilIcon size={18} />
                                    </button>

                                    {/* DELETE BUTTON */}
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteReminder(rem.reminder_id)}
                                        title="Delete Reminder"
                                    >
                                        <TrashIcon size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {editingReminder && (
                <EditReminderModal
                    isOpen={!!editingReminder}
                    reminder={editingReminder}
                    token={token ?? ""}
                    onClose={() => setEditingReminder(null)}
                    onUpdate={fetchDetails}
                />
            )}
        </div>
    );
};

export default SeniorProfile;