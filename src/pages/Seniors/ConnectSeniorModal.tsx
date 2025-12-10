import React, { useState } from 'react';
import axios from 'axios';
import { IoClose, IoMailOutline, IoPersonAddOutline } from "react-icons/io5";
import styles from './ConnectSeniorModal.module.css';
import { BACKEND_URL } from '../../constant';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    token: string;
}

const CloseIcon = IoClose as React.ElementType;
const MailIcon = IoMailOutline as React.ElementType;
const PersonAddIcon = IoPersonAddOutline as React.ElementType;

const ConnectSeniorModal = ({ isOpen, onClose, token }: Props) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(`${BACKEND_URL}/api/collaborations/request-access`, {
                senior_email: email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setEmail('');
            }, 2000); // Close after 2 seconds

        } catch (err: any) {
            console.error(err);
            // Show specific error from backend (e.g., "Senior not found")
            setError(err.response?.data?.error || "Failed to send request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>
                    <CloseIcon size={24} />
                </button>

                {success ? (
                    <div className={styles.successState}>
                        <div className={styles.checkIcon}>✓</div>
                        <h3>Request Sent!</h3>
                        <p>Ask the senior to check their app notifications to accept.</p>
                    </div>
                ) : (
                    <>
                        <header className={styles.header}>
                            <div className={styles.iconCircle}>
                                <PersonAddIcon size={28} color="#5A2167" />
                            </div>
                            <h3>Connect to a Senior</h3>
                            <p>Enter their email to request access to their profile.</p>
                        </header>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>Senior's Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <MailIcon className={styles.inputIcon} />
                                    <input 
                                        type="email" 
                                        placeholder="grandma@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            {error && <p className={styles.errorMessage}>{error}</p>}

                            <button 
                                type="submit" 
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Request"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ConnectSeniorModal;