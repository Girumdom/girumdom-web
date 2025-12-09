import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import { IoArrowBack, IoCamera, IoCloseCircle, IoMic } from "react-icons/io5";
import styles from './CreateMemory.module.css';
import { BACKEND_URL } from '../../constant';

const HF_API_URL = "https://cuhgrel-nemo-tts-api.hf.space/synthesize/";

const ArrowBackIcon = IoArrowBack as React.ElementType;
const CameraIcon = IoCamera as React.ElementType;
const CloseCircleIcon = IoCloseCircle as React.ElementType;
const MicIcon = IoMic as React.ElementType;

const CreateMemory = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    
    // State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [language, setLanguage] = useState('tgl');
    const [images, setImages] = useState<File[]>([]); // Store actual File objects
    const [previews, setPreviews] = useState<string[]>([]); // For display
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [collaborations, setCollaborations] = useState<any[]>([]);
    const [selectedCollabId, setSelectedCollabId] = useState<string>('');

    useEffect(() => {
        const fetchCollabs = async () => {
            try {
                // Reuse your existing endpoint to get list of seniors
                const res = await axios.get(`${BACKEND_URL}/api/collaborations/seniors`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCollaborations(res.data);
                // Default to the first one if available
                if (res.data.length > 0) setSelectedCollabId(res.data[0].collaboration_id);
            } catch (err) {
                console.error("Failed to load seniors", err);
            }
        };
        if (token) fetchCollabs();
    }, [token]);

    // --- 1. Image Handling ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            
            // Create preview URLs for the UI
            const newPreviews = fileList.map(file => URL.createObjectURL(file));
            
            setImages(prev => [...prev, ...fileList]);
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // --- 2. Helper: Convert File/Blob to Base64 ---
    const toBase64 = (file: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // --- 3. TTS Generation  ---
    const generateAndUploadTTS = async (text: string, lang: string, memoryId: number) => {
        setLoadingMessage('Generating audio narration...');
        
        // A. Fetch Audio from Hugging Face
        const hfResponse = await fetch(HF_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: lang }),
        });

        if (!hfResponse.ok) throw new Error("TTS Generation Failed");

        const audioBlob = await hfResponse.blob();
        
        // B. Convert to Base64 for your Backend
        const base64Audio = await toBase64(audioBlob);

        // C. Upload to your Backend
        setLoadingMessage('Uploading audio...');
        await axios.post(`${BACKEND_URL}/api/tts/audio/base64`, {
            memory_id: memoryId,
            audio_data: base64Audio, // Send the full data URI string
            user_id: user?.user_id
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    };

    // --- 4. Submit Logic ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        // 1. Validation
        if (!selectedCollabId) {
            alert("Please select a senior to associate this memory with.");
            return;
        }

        try {
            setIsSubmitting(true);
            setLoadingMessage('Saving and linking memory...');

            // 2. A. Create Memory Entry (THE CHANGE)
            // Instead of /api/memory, we hit the specific collaboration route.
            // This ensures the memory is created AND linked to the Senior in one step.
            const memoryRes = await axios.post(
                `${BACKEND_URL}/api/collaborations/${selectedCollabId}/memories/new`, 
                {
                    title,
                    content,
                    date_of_event: date,
                    // Note: We don't need to send user_id/creator_id manually here.
                    // The backend grabs your ID from the 'token' automatically.
                }, 
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Capture the ID returned by your new endpoint
            const memoryId = memoryRes.data.memory_id;

            // B. Upload Images (Unchanged - Logic is perfect)
            if (images.length > 0) {
                setLoadingMessage(`Uploading ${images.length} photos...`);
                const base64Images = await Promise.all(images.map(file => toBase64(file)));

                await axios.post(`${BACKEND_URL}/api/images/base64/bulk`, {
                    memory_id: memoryId,
                    images: base64Images
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // C. Generate TTS (Unchanged - Logic is perfect)
            if (content.trim()) {
                await generateAndUploadTTS(content, language, memoryId);
            }

            alert("Memory Created Successfully!");
            navigate('/dashboard');

        } catch (error) {
            console.error(error);
            alert("Failed to create memory. Please try again.");
        } finally {
            setIsSubmitting(false);
            setLoadingMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <ArrowBackIcon size={24} />
                    </button>
                    <h1>Create a Memory</h1>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* NEW DROPDOWN: Select Senior */}
                    <div className={styles.section}>
                        <label className={styles.label}>Who is this memory for?</label>
                        <select 
                            className={styles.select}
                            value={selectedCollabId}
                            onChange={(e) => setSelectedCollabId(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a Senior</option>
                            {collaborations.map(collab => (
                                <option key={collab.collaboration_id} value={collab.collaboration_id}>
                                    {collab.senior_name} (Collab: {collab.collaboration_name})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Photos */}
                    <div className={styles.section}>
                        <label className={styles.label}>Photos</label>
                        <div className={styles.imageGrid}>
                            {previews.map((src, idx) => (
                                <div key={idx} className={styles.imageWrapper}>
                                    <img src={src} alt="preview" className={styles.previewImg} />
                                    <button type="button" onClick={() => removeImage(idx)} className={styles.removeBtn}>
                                        <CloseCircleIcon size={20} color="red" />
                                    </button>
                                </div>
                            ))}
                            
                            {/* Hidden File Input + Custom Button */}
                            <label className={styles.uploadBtn}>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    hidden 
                                />
                                <CameraIcon size={24} />
                                <span>Add Photos</span>
                            </label>
                        </div>
                    </div>

                    {/* Details */}
                    <div className={styles.section}>
                        <label className={styles.label}>Title</label>
                        <input 
                            className={styles.input} 
                            placeholder="e.g., Christmas 2023"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Date of Memory</label>
                        <input 
                            type="date" 
                            className={styles.input}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                            max={new Date().toISOString().split("T")[0]} // No future dates
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Story / Description</label>
                        <textarea 
                            className={styles.textarea}
                            placeholder="Type the story here..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>Narration Language</label>
                        <select 
                            className={styles.select}
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                        >
                            <option value="tgl">Tagalog (Filipino)</option>
                            <option value="en">English</option>
                            <option value="bikol">Bikol</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? loadingMessage : "Save Memory"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateMemory;