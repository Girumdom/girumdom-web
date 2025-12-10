import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { IoCalendarOutline, IoTimeOutline, IoPencil, IoTrashOutline, IoAdd } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import EditReminderModal from './EditReminderModal';
import styles from './Reminders.module.css'; // We will create this next
import { BACKEND_URL } from '../../constant';

// Types
interface Reminder {
    reminder_id: number;
    title: string;
    description: string | null;
    reminder_date: string;
    repeat_interval: string;
    user_id: number;     // The Target (Senior)
    created_by: number;  // The Author
    // Optional: You might want to ask your backend to send the Senior's Name too
    // For now, we'll just show the date and title
}

const CalendarIcon = IoCalendarOutline as React.ElementType;
const TimeIcon = IoTimeOutline as React.ElementType;
const PencilIcon = IoPencil as React.ElementType;
const TrashIcon = IoTrashOutline as React.ElementType;
const AddIcon = IoAdd as React.ElementType;

const Reminders = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

    // Fetch Logic
    const fetchReminders = useCallback(async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/reminders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReminders(res.data);
        } catch (error) {
            console.error("Failed to load reminders", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchReminders();
    }, [token, fetchReminders]);

    // Delete Logic
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this reminder?")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/reminders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReminders(prev => prev.filter(r => r.reminder_id !== id));
        } catch (error) {
            alert("Failed to delete reminder");
        }
    };

    if (loading) return <div className={styles.loading}>Loading tasks...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>All Reminders</h1>
                    <p className={styles.subtitle}>Manage tasks for all your seniors</p>
                </div>
                <button 
                    className={styles.addBtn}
                    onClick={() => navigate('/create-reminder')}
                >
                    <AddIcon size={20} /> New Reminder
                </button>
            </header>

            <div className={styles.grid}>
                {reminders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <CalendarIcon size={48} color="#D1D5DB" />
                        <p>No reminders found.</p>
                    </div>
                ) : (
                    reminders.map(rem => (
                        <div key={rem.reminder_id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.dateBadge}>
                                    <CalendarIcon />
                                    <span>{new Date(rem.reminder_date).toLocaleDateString()}</span>
                                </div>
                                <span className={styles.repeatBadge}>
                                    {rem.repeat_interval === 'never' ? 'One-time' : rem.repeat_interval}
                                </span>
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{rem.title}</h3>
                                <div className={styles.timeRow}>
                                    <TimeIcon color="#6B7280" />
                                    <span>
                                        {new Date(rem.reminder_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {rem.description && <p className={styles.desc}>{rem.description}</p>}
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.actionBtn} 
                                        onClick={() => setEditingReminder(rem)}
                                        title="Edit"
                                    >
                                        <PencilIcon size={18} />
                                    </button>
                                    <button 
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                        onClick={() => handleDelete(rem.reminder_id)}
                                        title="Delete"
                                    >
                                        <TrashIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {editingReminder && (
                <EditReminderModal
                    isOpen={!!editingReminder}
                    reminder={editingReminder}
                    token={token || ""}
                    onClose={() => setEditingReminder(null)}
                    onUpdate={fetchReminders}
                />
            )}
        </div>
    );
};

export default Reminders;