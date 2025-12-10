import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import authStyles from './AuthShared.module.css';
import { BACKEND_URL } from '../../constant';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');

        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email });
            setMessage(response.data.message);
            setTimeout(() => navigate('/verify-reset', { state: { email } }), 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to send code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={authStyles.authContainer}>
            <div className={authStyles.authOverlay} />
            <div className={authStyles.authCardWrapper}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Forgot Password?</h2>
                        <p className={styles.subtitle}>Enter your email to receive a reset code.</p>
                    </div>
                    {message && <div className={styles.successBanner}>{message}</div>}
                    {error && <div className={styles.errorBanner}>{error}</div>}
                    <form onSubmit={handleSendCode} className={styles.form}>
                        <div className={styles.field}>
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Sending..." : "Send Code"}</button>
                    </form>
                    <div className={styles.footer}>
                        <Link to="/login" className={styles.link}>Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;