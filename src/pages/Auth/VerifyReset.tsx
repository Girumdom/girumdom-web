import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AuthForm.module.css';
import authStyles from './AuthShared.module.css';
import { BACKEND_URL } from '../../constant';

const VerifyReset = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [email, setEmail] = useState(emailFromState);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!email) navigate('/forgot-password');
    }, [email, navigate]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
        if (newPassword.length < 8) { setError("Password must be > 8 chars"); return; }

        setLoading(true);
        try {
            await axios.post(`${BACKEND_URL}/api/auth/reset-password`, { email, code, newPassword });
            alert("Password reset successfully! Please login.");
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || "Reset failed.");
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
                        <h2 className={styles.title}>Reset Password</h2>
                        <p className={styles.subtitle}>Enter code sent to <strong>{email}</strong></p>
                    </div>
                    {error && <div className={styles.errorBanner}>{error}</div>}
                    <form onSubmit={handleReset} className={styles.form}>
                        <div className={styles.field}>
                            <label>6-Digit Code</label>
                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="123456" maxLength={6} />
                        </div>
                        <div className={styles.field}>
                            <label>New Password</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="********" />
                        </div>
                        <div className={styles.field}>
                            <label>Confirm Password</label>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="********" />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyReset;