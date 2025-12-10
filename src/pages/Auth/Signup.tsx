import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthForm.module.css';
import authStyles from './AuthShared.module.css';
import { BACKEND_URL } from '../../constant';

const Signup = () => {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Caretaker');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false); return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false); return;
        }

        try {
            await axios.post(`${BACKEND_URL}/api/auth/signup`, { fullname, email, password, role });
            alert("Account created successfully! Please log in.");
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to create account.");
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
                        <img src="/images/girumdom_icon.png" alt="Logo" className={styles.logo} />
                        <h2 className={styles.title}>Create Account</h2>
                        <p className={styles.subtitle}>Join Girumdom to care for your loved ones</p>
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}

                    <form onSubmit={handleSignup} className={styles.form}>
                        <div className={styles.field}>
                            <label>Full Name</label>
                            <input type="text" placeholder="Juan Dela Cruz" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
                        </div>
                        <div className={styles.field}>
                            <label>Email Address</label>
                            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className={styles.field}>
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
                                <option value="Caretaker">Professional Caretaker</option>
                                <option value="Family Member">Family Member</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Password</label>
                            <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className={styles.field}>
                            <label>Confirm Password</label>
                            <input type="password" placeholder="********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
                    </form>
                    <div className={styles.footer}>
                        <p>Already have an account? <Link to="/login" className={styles.link}>Log In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;