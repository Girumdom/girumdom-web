import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline, IoChevronForward } from "react-icons/io5";
import styles from './Seniors.module.css';
import { BACKEND_URL } from '../../constant';

// Types based on the SQL query above
interface MonitoredSenior {
    collaboration_id: number;
    collaboration_name: string;
    senior_id: number;
    senior_name: string;
    senior_pfp: string | null;
    memory_count: number;
    my_role: string;
}

const PersonIcon = IoPersonCircleOutline as React.ElementType;
const ChevronIcon = IoChevronForward as React.ElementType;

const Seniors = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [seniors, setSeniors] = useState<MonitoredSenior[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeniors = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/collaborations/seniors`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSeniors(response.data);
            } catch (error) {
                console.error("Error fetching seniors:", error);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchSeniors();
    }, [token]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Monitored Seniors</h1>
                <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </header>

            <div className={styles.grid}>
                {loading ? <p>Loading...</p> : seniors.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>You are not monitoring any seniors yet.</p>
                        <p>Ask them to invite you to their collaboration.</p>
                    </div>
                ) : (
                    seniors.map(senior => (
                        <div key={senior.collaboration_id} className={styles.card}>
                            <div className={styles.avatarSection}>
                                {senior.senior_pfp ? (
                                    <img src={senior.senior_pfp} alt={senior.senior_name} className={styles.avatar} />
                                ) : (
                                    <PersonIcon size={64} color="#A78BFA" />
                                )}
                            </div>
                            
                            <div className={styles.infoSection}>
                                <h3 className={styles.name}>{senior.senior_name}</h3>
                                <span className={styles.roleBadge}>{senior.my_role}</span>
                                <p className={styles.stats}>
                                    {senior.memory_count} Memories Shared
                                </p>
                            </div>

                            <button 
                                className={styles.actionButton}
                                // Navigate to a detailed view of THEIR memories
                                onClick={() => navigate(`/seniors/${senior.senior_id}`)}
                            >
                                View Profile <ChevronIcon size={20} color="#5A2167" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Seniors;