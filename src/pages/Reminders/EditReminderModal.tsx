import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import styles from './EditReminderModal.module.css';
import { BACKEND_URL } from '../../constant'; // Ensure you import your constant

interface Reminder {
    reminder_id: number;
    title: string;
    description: string | null;
    reminder_date: string;
    repeat_interval: string;
}

interface Props {
    reminder: Reminder;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void; // Function to refresh the parent list
    token: string;
}

const CloseIcon = IoClose as React.ElementType;

const EditReminderModal = ({ reminder, isOpen, onClose, onUpdate, token }: Props) => {
    // 1. Initialize state with existing data
    const [title, setTitle] = useState(reminder.title);
    const [desc, setDesc] = useState(reminder.description || '');
    
    // Parse the ISO date string into Date and Time parts for the inputs
    const d = new Date(reminder.reminder_date);
    // Note: This naive split works for ISO strings. 
    // If you have timezone issues, use: d.toLocaleDateString('en-CA') for YYYY-MM-DD
    const [date, setDate] = useState(d.toISOString().split('T')[0]);
    
    // Extract HH:MM (Local time)
    // We padStart to ensure 09:00 instead of 9:0
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const [time, setTime] = useState(`${hours}:${minutes}`);
    
    const [repeat, setRepeat] = useState(reminder.repeat_interval);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Recombine Date and Time for MySQL
            const combinedDateTime = `${date} ${time}:00`;
            
            await axios.put(`${BACKEND_URL}/api/reminders/${reminder.reminder_id}`, {
                title,
                description: desc,
                reminder_date: combinedDateTime,
                repeat_interval: repeat
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onUpdate(); // Trigger refresh in parent
            onClose();  // Close modal
        } catch (error) {
            console.error(error);
            alert("Failed to update reminder. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <h3>Edit Reminder</h3>
                    <button type="button" onClick={onClose} className={styles.closeBtn}>
                        <CloseIcon size={24}/>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Title</label>
                        <input 
                            className={styles.input}
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Description</label>
                        <textarea 
                            className={styles.textarea}
                            value={desc} 
                            onChange={e => setDesc(e.target.value)} 
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Date</label>
                            <input 
                                type="date" 
                                className={styles.input}
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Time</label>
                            <input 
                                type="time" 
                                className={styles.input}
                                value={time} 
                                onChange={e => setTime(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Repeat</label>
                        <select 
                            className={styles.select}
                            value={repeat} 
                            onChange={e => setRepeat(e.target.value)}
                        >
                            <option value="never">Never</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" disabled={loading} className={styles.saveBtn}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReminderModal;