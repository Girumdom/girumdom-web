import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircleOutline, IoChevronForward, IoPersonAddOutline } from "react-icons/io5";
import styles from './Seniors.module.css';
import { BACKEND_URL } from '../../constant';
import ConnectSeniorModal from './ConnectSeniorModal';

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

interface Invite {
    id: number // invite_id
    collaboration_name: string;
    inviter_name: string;
    role: string;
    created_at: string;
}

const PersonIcon = IoPersonCircleOutline as React.ElementType;
const ChevronIcon = IoChevronForward as React.ElementType;
const AddPersonIcon = IoPersonAddOutline as React.ElementType;

const Seniors = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [seniors, setSeniors] = useState<MonitoredSenior[]>([]);
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

    const fetchData = async () => {
        if (!token) return;
        try {
            // 1. Fetch Active Seniors 
            const seniorsRes = await axios.get(`${BACKEND_URL}/api/collaborations/seniors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSeniors(seniorsRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Monitored Seniors</h1>

                {/* Button Group */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        className={styles.connectBtn}
                        onClick={() => setIsConnectModalOpen(true)}
                    >
                        <AddPersonIcon size={18} />
                        Connect New Senior
                    </button>

                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </header>

            {/* --- SENIORS GRID --- */}
            <h2 className={styles.sectionTitle}>Active Connections</h2>
            <div className={styles.grid}>
                {loading ? <p>Loading...</p> : seniors.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>You are not monitoring any seniors yet.</p>
                        {invites.length === 0 && <p>Ask them to invite you via email.</p>}
                    </div>
                ) : (
                    seniors.map(senior => (
                        <div key={senior.collaboration_id} className={styles.card}>
                             {/* ... Your existing Card Code ... */}
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
                                onClick={() => navigate(`/seniors/${senior.senior_id}`)}
                            >
                                View Profile <ChevronIcon size={20} color="#5A2167" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL */}
            <ConnectSeniorModal 
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
                token={token || ""}
            />
        </div>
    );
};

export default Seniors;