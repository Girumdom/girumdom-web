import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { IoArrowBack, IoTimeOutline, IoCalendarOutline } from "react-icons/io5";
import styles from './CreateReminder.module.css';
import { BACKEND_URL } from '../../constant';

const ArrowBackIcon = IoArrowBack as React.ElementType;
const TimeIcon = IoTimeOutline as React.ElementType;
const CalendarIcon = IoCalendarOutline as React.ElementType;

const CreateReminder = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [repeat, setRepeat] = useState('never');
    
    // Senior Selection State
    const [collaborations, setCollaborations] = useState<any[]>([]);
    const [selectedCollabId, setSelectedCollabId] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch Seniors on Mount
    useEffect(() => {
        const fetchSeniors = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/collaborations/seniors`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCollaborations(res.data);
                if (res.data.length > 0) setSelectedCollabId(res.data[0].collaboration_id);
            } catch (err) {
                console.error("Error loading seniors", err);
            }
        };
        if (token) fetchSeniors();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (!selectedCollabId) return alert("Please select a senior.");

        try {
            setIsSubmitting(true);
            
            // 1. Create a Date object using the user's LOCAL time input
            // The 'T' character ensures the browser parses it correctly as local ISO format
            const localDateObj = new Date(`${date}T${time}:00`);

            // 2. Convert it to a UTC ISO String immediately
            const utcDateTime = localDateObj.toISOString();

            await axios.post(`${BACKEND_URL}/api/collaborations/${selectedCollabId}/reminders`, {
                title,
                description: desc,
                reminder_date: utcDateTime, // Send the UTC string!
                repeat_interval: repeat
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Reminder set successfully!");
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            alert("Failed to set reminder.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <ArrowBackIcon size={24} />
                    </button>
                    <h1>Set a Reminder</h1>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    
                    {/* Senior Selector */}
                    <div className={styles.section}>
                        <label className={styles.label}>Who is this for?</label>
                        <select 
                            className={styles.select}
                            value={selectedCollabId}
                            onChange={(e) => setSelectedCollabId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a Senior</option>
                            {collaborations.map(c => (
                                <option key={c.collaboration_id} value={c.collaboration_id}>
                                    {c.senior_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Title</label>
                        <input 
                            className={styles.input}
                            placeholder="e.g., Take Heart Medication"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Description (Optional)</label>
                        <textarea 
                            className={styles.textarea}
                            placeholder="Details..."
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.section} style={{flex: 1}}>
                            <label className={styles.label}>Date</label>
                            <div className={styles.inputWrapper}>
                                <CalendarIcon style={{marginRight: 8}} />
                                <input 
                                    type="date" 
                                    className={styles.input}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>
                        <div className={styles.section} style={{flex: 1}}>
                            <label className={styles.label}>Time</label>
                            <div className={styles.inputWrapper}>
                                <TimeIcon style={{marginRight: 8}} />
                                <input 
                                    type="time" 
                                    className={styles.input}
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Repeat</label>
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

                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Set Reminder"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateReminder;