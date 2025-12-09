import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";
import { useAuth } from '../../context/authContext';

// 1. IMPORT STYLES
import styles from './Login.module.css';

const MailIcon = IoMailOutline as React.ElementType;
const LockIcon = IoLockClosedOutline as React.ElementType;

// --- Helper Component ---
interface InputWithIconProps {
    icon: React.ReactNode;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const InputWithIcon = ({ icon, label, placeholder, value, onChange, type = "text" }: InputWithIconProps) => (
    <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>{label}</label>
        <div className={styles.inputWrapper}>
            <div className={styles.inputIcon}>{icon}</div>
            <input 
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                type={type}
                required
            />
        </div>
    </div>
);

// --- Main Login Component ---
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError('');

        try {
            // 1. Authenticate with Backend
            const response = await loginUser(email, password);
            
            // 2. Role-Based Access Control
            
            if (response.user.role === 'Elderly') {
                // Show Error
                setError("Access Denied: This web portal is for Caretakers and Family Members only. Please use the mobile app.");
                
                // Stop loading state
                setIsLoading(false);
                
                // Return immediately so we don't save the token
                return; 
            }

            // 2. If role is Caretaker or Family Member, proceed to save token
            await login(response.token, response.user);
            navigate('/dashboard');

        } catch (err) {
            setError('Invalid email or password.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            
            {/* LEFT SIDE: Branding Panel */}
            <div className={styles.brandPanel}>
                <div className={styles.brandContent}>
                    <img 
                        src="/images/girumdom_icon.png" 
                        alt="Girumdom Logo" 
                        className={styles.brandLogo} 
                    />
                    <h1 className={styles.brandTitle}>Girumdom</h1>
                    <p className={styles.brandTagline}>
                        Recalling memories, connecting hearts. <br/>
                        Welcome to the Caretaker Portal.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className={styles.formPanel}>
                <div className={styles.formCard}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.welcomeTitle}>Welcome Back</h2>
                        <p className={styles.welcomeSub}>Please enter your details to sign in.</p>
                    </div>

                    {error && <div className={styles.errorBanner}>{error}</div>}

                    <form onSubmit={handleLogin} className={styles.form}>
                        <InputWithIcon 
                            label="Email Address"
                            icon={<MailIcon size={18} color="#6B7280" />}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                        />

                        <InputWithIcon 
                            label="Password"
                            icon={<LockIcon size={18} color="#6B7280" />}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        />

                        <div className={styles.optionsRow}>
                            <button 
                                type="button" 
                                onClick={() => navigate('/forgot-password')} 
                                className={styles.forgotPasswordLink}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            // Combine classes dynamically for disabled state
                            className={`${styles.signInButton} ${isLoading ? styles.buttonDisabled : ''}`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>

                        <div className={styles.signupContainer}>
                            <span>Don't have an account? </span>
                            <button 
                                type="button" 
                                onClick={() => navigate('/signup')} 
                                className={styles.signupLink}
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;