import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { loginUser } from '../../services/authService';
import { useAuth } from '../../context/authContext';
import styles from './Login.module.css';
import authStyles from './AuthShared.module.css';

const MailIcon = IoMailOutline as React.ElementType;
const LockIcon = IoLockClosedOutline as React.ElementType;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        setError('');

        try {
            const response = await loginUser(email, password);
            
            if (response.user.role === 'Elderly') {
                setError("Access Denied: Please use the mobile app.");
                return; 
            }

            await login(response.token, response.user);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={authStyles.authContainer}>
            <div className={authStyles.authOverlay} />
            <div className={authStyles.authCardWrapper}>
                <div className={styles.loginContainer}>
                    {/* LEFT: Branding */}
                    <div className={styles.brandPanel}>
                        <div>
                            <img src="/images/girumdom_icon.png" alt="Logo" className={styles.brandLogo} />
                            <h1 className={styles.brandTitle}>Girumdom</h1>
                            <p className={styles.brandTagline}>
                                Recalling memories, connecting hearts.<br/>Welcome to the Girumdom Portal.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Form */}
                    <div className={styles.formPanel}>
                        <h2 className={styles.welcomeTitle}>Welcome Back</h2>
                        <p className={styles.welcomeSub}>Please enter your details to sign in.</p>

                        {error && <div className={styles.errorBanner}>{error}</div>}

                        <form onSubmit={handleLogin}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.inputIcon}><MailIcon size={20} /></div>
                                    <input 
                                        className={styles.input}
                                        type="email" 
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Password</label>
                                <div className={styles.inputWrapper}>
                                    <div className={styles.inputIcon}><LockIcon size={20} /></div>
                                    <input 
                                        className={styles.input}
                                        type="password" 
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.optionsRow}>
                                <button type="button" onClick={() => navigate('/forgot-password')} className={styles.forgotPasswordLink}>
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" className={`${styles.signInButton} ${isLoading ? styles.buttonDisabled : ''}`} disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <div className={styles.signupContainer}>
                                <span>Don't have an account? </span>
                                <button type="button" onClick={() => navigate('/signup')} className={styles.signupLink}>
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;