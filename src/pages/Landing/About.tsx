import styles from './About.module.css';
import React, { useState, useEffect, useRef } from 'react';

import { FaChalkboardTeacher, FaMicrophoneAlt, FaCogs, FaPlay, FaPause, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { MdOutlineArchitecture, MdSpeed } from "react-icons/md";

import TrainingDiagram from '../../assets/images/training-workflow.png'; 
import InferenceDiagram from '../../assets/images/inference-workflow.png'; 
import MCDScoreDiagram from '../../assets/images/mcd_comparison_graph.png';
import SpectrogramComparison from '../../assets/images/spectrogram_comparison.png';

import TagalogModelAudio from '../../assets/audio/tgl-model-output.wav';
import GirumdomModelAudio from '../../assets/audio/finetuned_1.wav';

const ChalkboardIcon = FaChalkboardTeacher as React.ElementType;
const MicrophoneIcon = FaMicrophoneAlt as React.ElementType;
const CogsIcon = FaCogs as React.ElementType;
const SpeedIcon = MdSpeed as React.ElementType;
const ArchitectureIcon = MdOutlineArchitecture as React.ElementType;
const PlayIcon = FaPlay as React.ElementType;
const PauseIcon = FaPause as React.ElementType;
const UpIcon = FaChevronUp as React.ElementType;
const DownIcon = FaChevronDown as React.ElementType;


const About: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [isTechOpen, setIsTechOpen] = useState<boolean>(false);

  // audio refs (initialized once)
  const audioRefs = useRef<Record<'generic' | 'girumdom', HTMLAudioElement>>({
    generic: new Audio(TagalogModelAudio),
    girumdom: new Audio(GirumdomModelAudio),
  });

  useEffect(() => {
    // When any audio ends, clear playing state
    const onEnded = () => setPlaying(null);
    const { generic, girumdom } = audioRefs.current;
    generic.addEventListener('ended', onEnded);
    girumdom.addEventListener('ended', onEnded);

    return () => {
      // cleanup: pause and reset
      generic.pause(); generic.currentTime = 0;
      girumdom.pause(); girumdom.currentTime = 0;
      generic.removeEventListener('ended', onEnded);
      girumdom.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggleAudio = (id: 'generic' | 'girumdom') => {
    const otherId = id === 'generic' ? 'girumdom' : 'generic';
    const selected = audioRefs.current[id];
    const other = audioRefs.current[otherId];

    if (playing === id) {
      // pause currently playing audio
      selected.pause();
      selected.currentTime = 0;
      setPlaying(null);
    } else {
      // stop other audio if playing
      if (playing) {
        other.pause();
        other.currentTime = 0;
      }
      // play selected audio
      selected.play()
        .then(() => setPlaying(id))
        .catch((err) => {
          // play can fail on some browsers; keep state consistent
          console.error('Audio play failed', err);
          setPlaying(null);
        });
    }
  };

  return (
    <div className={styles.container}>

      {/* HEADER SECTION */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>The Technology Behind the Voice</h1>
          <p className={styles.pageSubtitle}>
            How Girumdom uses the VITS Framework to bring the <span className={styles.highlight}>Central Bikol</span> language to life.
          </p>
        </div>
      </header>

      <main className={styles.mainContent}>

        {/* TRAINING PHASE */}
        <section className={styles.processSection}>
          <div className={styles.processContent}>
            
            {/* Diagram Side */}
            <div className={styles.visualSide}>
              <div className={styles.diagramWrapper}>
                <img src={TrainingDiagram} alt="VITS Training Diagram" className={styles.diagramImage} />
                <div className={styles.captionTag}>Figure 1: The "Learning" Process</div>
              </div>
            </div>

            {/* Text Side */}
            <div className={styles.textSide}>
              <div className={styles.phaseLabel}>Part 1: The Training Phase</div>
              <h2 className={styles.sectionHeading}>Teaching the AI to Speak Bikol</h2>
              
              <p className={styles.conceptText}>
                Before the app can speak, the AI model must go through a rigorous "Fine-Tuning" phase. 
                Think of this as a <strong>student in a classroom</strong> learning a new dialect.
              </p>

              <div className={styles.stepList}>
                <div className={styles.stepItem}>
                  <div className={styles.iconBox}><MicrophoneIcon /></div>
                  <div>
                    <h4 className={styles.stepTitle}>The Inputs (The Study Material)</h4>
                    <p className={styles.stepDesc}>We feed the model pairs of data: text transcripts and actual audio recordings of native Bikol speakers.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.iconBox}><ChalkboardIcon /></div>
                  <div>
                    <h4 className={styles.stepTitle}>The Teachers (Discriminator)</h4>
                    <p className={styles.stepDesc}>Special components compare the AI's attempts against human audio. If it sounds robotic, the "teacher" forces it to try again.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.iconBox}><SpeedIcon /></div>
                  <div>
                    <h4 className={styles.stepTitle}>Learning Rhythm (Alignment)</h4>
                    <p className={styles.stepDesc}>The model learns exactly how long to hold each phoneme (e.g., the "aa" in "Magayon"), capturing the unique Bicolano cadence.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* INFERENCE PHASE */}
        <section className={`${styles.processSection} ${styles.reversedSection}`}>
          <div className={styles.processContent}>
            
            {/* Diagram Side */}
            <div className={styles.visualSide}>
              <div className={styles.diagramWrapper}>
                <img src={InferenceDiagram} alt="VITS Inference Diagram" className={styles.diagramImage} />
                <div className={styles.captionTag}>Figure 2: The "Speaking" Process</div>
              </div>
            </div>

            {/* Text Side */}
            <div className={styles.textSide}>
              <div className={styles.phaseLabel}>Part 2: The Inference Phase</div>
              <h2 className={styles.sectionHeading}>Real-Time Synthesis on Your Device</h2>
              
              <p className={styles.conceptText}>
                When you use Girumdom, the heavy "teachers" are removed. The model is now a 
                <strong> "graduate"</strong> that works independently on your mobile device.
              </p>

              <div className={styles.stepList}>
                <div className={styles.stepItem}>
                  <div className={styles.iconBox}><CogsIcon /></div>
                  <div>
                    <h4 className={styles.stepTitle}>Text Input Only</h4>
                    <p className={styles.stepDesc}>You type a reminder. There is no reference audio anymore—the AI must create it from scratch.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.iconBox}><ArchitectureIcon /></div>
                  <div>
                    <h4 className={styles.stepTitle}>Predicting Duration</h4>
                    <p className={styles.stepDesc}>Since it learned the rhythm earlier, it "stretches" your text to match the expected timing of a human speaker.</p>
                  </div>
                </div>

                <div className={styles.stepItem}>
                  <div className={styles.iconBox}><MicrophoneIcon /></div>
                  <div>
                    <h4 className={styles.stepTitle}>Generating Sound</h4>
                    <p className={styles.stepDesc}>The lightweight decoder converts these features into a high-fidelity waveform in milliseconds.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Audio Demo Section */}
        <section className={styles.sectionAudioDemo}>
          <div className={styles.audioContent}>
            <h2 className={styles.sectionHeading}>Hear the Difference</h2>
            <p className={styles.audioSubtitle}>
              Comparing a standard robotic synthesizer against Girumdom's Bikol-trained model.
            </p>

            <div className={styles.audioGrid}>
              
              {/* Card 1: Generic/Robotic */}
              <div className={`${styles.audioCard} ${styles.audioCardGeneric}`}>
                <div className={styles.audioLabel}>Standard AI</div>
                <div className={styles.waveformVisual}>
                   {/* CSS animated bars or a static image of a flat waveform */}
                   <div className={styles.bar}></div>
                   <div className={styles.bar}></div>
                   <div className={styles.bar}></div>
                   <div className={styles.bar}></div>
                </div>
                <button 
                  className={styles.playButton}
                  onClick={() => toggleAudio('generic')}
                >
                  {playing === 'generic' ? <PauseIcon /> : <PlayIcon />}
                  <span>Play Sample</span>
                </button>
                <p className={styles.sampleText}>"Monotonous and struggles with pronunciation."</p>
              </div>

              {/* Card 2: Girumdom (The Hero) */}
              <div className={`${styles.audioCard} ${styles.audioCardPro}`}>
                <div className={styles.audioBadge}>Powered by VITS</div>
                <div className={styles.audioLabel}>Girumdom Model</div>
                <div className={`${styles.waveformVisual} ${styles.activeWaveform}`}>
                   <div className={styles.bar}></div>
                   <div className={styles.barActive}></div>
                   <div className={styles.barActive}></div>
                   <div className={styles.bar}></div>
                   <div className={styles.barActive}></div>
                </div>
                <button 
                  className={`${styles.playButton} ${styles.playButtonPro}`}
                  onClick={() => toggleAudio('girumdom')}
                >
                  {playing === 'girumdom' ? <PauseIcon /> : <PlayIcon />}
                  <span>Play Sample</span>
                </button>
                <p className={styles.sampleText}>"Natural cadence with correct Bikol intonation."</p>
              </div>

            </div>
          </div>
        </section>

        {/* TECHNICAL DEEP DIVE */}
        <section className={styles.techSection}>
          <div className={styles.techContainer}>
            <button 
              className={styles.techToggleBtn} 
              onClick={() => setIsTechOpen(!isTechOpen)}
            >
              <span>Additional Information</span>
              {isTechOpen ? <UpIcon /> : <DownIcon />}
            </button>

            <div className={`${styles.techContent} ${isTechOpen ? styles.showTech : ''}`}>
              
              {/* Architecture Summary */}
              <div className={styles.techGrid}>
                <div className={styles.techCard}>
                  <h3>Architecture: VITS</h3>
                  <p>Conditional Variational Autoencoder with Adversarial Learning for End-to-End Text-to-Speech.</p>
                </div>
                <div className={styles.techCard}>
                  <h3>Key Innovation</h3>
                  <p>End-to-End training connects text input directly to audio waveform, removing the need for a separate vocoder.</p>
                </div>
                <div className={styles.techCard}>
                  <h3>Optimization</h3>
                  <p>Flow-based modules handle speech complexity, ensuring expressive rather than monotonous voice output.</p>
                </div>
              </div>

              {/* Training Outcomes */}
              <div className={styles.resultsSection}>
                <h3 className={styles.resultsTitle}>Training Validation & Performance</h3>
                <p className={styles.resultsSubtitle}>
                  Objective and qualitative assessment of the fine-tuned model on the Central Bikol dataset (1 hour of audio).
                </p>

                <div className={styles.resultsGrid}>
                  
                  {/* Result 1: MCD Score */}
                  <div className={styles.resultBlock}>
                    <h4 className={styles.blockTitle}>Objective Quality (MCD Score)</h4>
                    <div className={styles.graphWrapper}>
                      <img src={MCDScoreDiagram} alt="MCD Comparison Graph" className={styles.resultImage} />
                    </div>
                    <p className={styles.blockDesc}>
                      <strong>13.8% Improvement:</strong> Mel-Cepstral Distortion decreased from 12.39 (50 epochs) to 10.68 (100 epochs). While limited by data scarcity, this confirms the model successfully adapted to the speaker's acoustic characteristics.
                    </p>
                  </div>

                  {/* Result 2: Spectrogram */}
                  <div className={styles.resultBlock}>
                    <h4 className={styles.blockTitle}>Acoustic Fidelity (Spectrogram)</h4>
                    <div className={styles.graphWrapper}>
                      <img src={SpectrogramComparison} alt="Spectrogram Comparison" className={styles.resultImage} />
                    </div>
                    <p className={styles.blockDesc}>
                      <strong>Strong Temporal Alignment:</strong> The synthesized output (bottom) closely mirrors the ground truth (top) in phoneme timing. Lower-frequency formants align well, ensuring intelligibility, though some high-frequency smoothing is present.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default About;

