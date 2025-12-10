import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { IoAdd, IoImageOutline, IoTrashOutline, IoPlayCircle, IoCalendarOutline } from "react-icons/io5";
import styles from './Memories.module.css'; // We will create this next
import { BACKEND_URL } from '../../constant';

interface Memory {
    memory_id: number;
    title: string;
    content: string;
    date_of_event: string;
    images: { file_path: string }[]; // Array of images
    audio_url?: string;
    user_id: number;     // Owner
    creator_id: number;  // Uploader
}

const AddIcon = IoAdd as React.ElementType;
const ImageIcon = IoImageOutline as React.ElementType;
const TrashIcon = IoTrashOutline as React.ElementType;
const PlayIcon = IoPlayCircle as React.ElementType;
const CalendarIcon = IoCalendarOutline as React.ElementType;

const Memories = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);

    // 1. Fetch Logic
    const fetchMemories = useCallback(async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/memory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMemories(res.data);
        } catch (error) {
            console.error("Failed to load memories", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchMemories();
        // Cleanup audio on unmount
        return () => {
            if (playingAudio) playingAudio.pause();
        };
    }, [token, fetchMemories, playingAudio]);

    // 2. Delete Logic
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this memory? This cannot be undone.")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/memory/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistic update
            setMemories(prev => prev.filter(m => m.memory_id !== id));
        } catch (error) {
            alert("Failed to delete memory. You might not have permission.");
        }
    };

    // 3. Audio Player Logic
    const handlePlayAudio = (url: string) => {
        if (playingAudio) {
            playingAudio.pause(); // Stop current if playing
            setPlayingAudio(null);
        }
        const audio = new Audio(url);
        audio.play();
        setPlayingAudio(audio);
        audio.onended = () => setPlayingAudio(null);
    };

    if (loading) return <div className={styles.loading}>Loading gallery...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Memory Gallery</h1>
                    <p className={styles.subtitle}>Shared moments and stories</p>
                </div>
                <button 
                    className={styles.addBtn}
                    onClick={() => navigate('/create-memory')}
                >
                    <AddIcon size={20} /> Add Memory
                </button>
            </header>

            <div className={styles.grid}>
                {memories.length === 0 ? (
                    <div className={styles.emptyState}>
                        <ImageIcon size={48} color="#D1D5DB" />
                        <p>No memories shared yet.</p>
                    </div>
                ) : (
                    memories.map(mem => (
                        <div key={mem.memory_id} className={styles.card}>
                            {/* IMAGE COVER */}
                            <div className={styles.imageContainer}>
                                {mem.images && mem.images.length > 0 ? (
                                    <img 
                                        src={mem.images[0].file_path} 
                                        alt={mem.title} 
                                        className={styles.coverImage}
                                    />
                                ) : (
                                    <div className={styles.placeholder}>
                                        <ImageIcon size={30} color="#A78BFA" />
                                    </div>
                                )}
                                
                                {/* Overlay Date Badge */}
                                <div className={styles.dateBadge}>
                                    <CalendarIcon size={12}/>
                                    <span>{new Date(mem.date_of_event).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>{mem.title}</h3>
                                <p className={styles.desc}>{mem.content}</p>
                                
                                <div className={styles.footer}>
                                    {/* AUDIO BUTTON */}
                                    {mem.audio_url ? (
                                        <button 
                                            className={styles.audioBtn}
                                            onClick={() => handlePlayAudio(mem.audio_url!)}
                                        >
                                            <PlayIcon size={18} /> Listen
                                        </button>
                                    ) : (
                                        <span className={styles.noAudio}>No Audio</span>
                                    )}

                                    {/* DELETE BUTTON */}
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(mem.memory_id)}
                                        title="Delete Memory"
                                    >
                                        <TrashIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Memories;