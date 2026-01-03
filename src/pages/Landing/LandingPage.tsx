import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

import { DOWNLOAD_LINK } from '../../constant';
import heroImage from '../../assets/images/web-bg.jpg';
import SeniorPuzzleImage from '../../assets/images/senior-missing-puzzle.jpeg';
import ForgetfulSeniorImage from '../../assets/images/forgetful-senior.jpeg';

// Images for features section
import CreateMemory1 from '../../assets/images/create-memory.jpg'; 
import CreateMemory2 from '../../assets/images/memory-screen.jpg';
import CreateMemory3 from '../../assets/images/memory-details.jpg';

import Collab1 from '../../assets/images/create-collab.jpg';
import Collab2 from '../../assets/images/collab-screen.jpg'; 
import Collab3 from '../../assets/images/collab-details.jpg'; 

import ScreenshotPortal from '../../assets/images/web-portal.png'; 

import { FaRegHourglassHalf } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { GoMoveToEnd } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";

const DownloadIcon = IoMdDownload as React.ElementType;
const MoveToEndIcon = GoMoveToEnd as React.ElementType;
const UserIcon = FaRegUser as React.ElementType;
const HourglassIcon = FaRegHourglassHalf as React.ElementType;
const BrainIcon = LuBrain as React.ElementType;

const LandingPage: React.FC = () => {

  // data for the middle donut chart
  const frequencyData = [
    { label: "Sometimes (A few times a month)", percentage: 52, color: "#9333ea" }, // Brand Purple
    { label: "Often (A few times a week)", percentage: 28, color: "#c084fc" },      // Light Purple
    { label: "Very Often (Daily)", percentage: 12, color: "#581c87" },              // Dark Purple
    { label: "Rarely (Still sharp)", percentage: 8, color: "#e5e7eb" },             // Gray
  ];

  // data for the lower stats graph
  const statsData = [
    { label: "No tools being used", percentage: 48 },
    { label: "Writing it down on paper", percentage: 36 },
    { label: "Using Applications (e.g. Notes)", percentage: 12 },
    { label: "Verbal Reminder", percentage: 4 }
  ]

  const featuresData = [
    {
      type: "mobile", // Added type to help with styling logic
      images: [CreateMemory1, CreateMemory2, CreateMemory3], 
      alt: "Screenshots of the memory creation process",
      title: "Voice-Powered Recollection",
      description: "Our interface is designed with large, clear buttons and uses Text-to-Speech technology to read prompts aloud."
    },
    {
      type: "mobile",
      images: [Collab1, Collab2, Collab3],
      alt: "Screenshots of family collaboration features",
      title: "Collaborate with Loved Ones",
      description: "Family members can contribute by adding photos and important dates through the portal, fostering a collaborative environment."
    },
    {
      type: "desktop",
      images: [ScreenshotPortal], // Only 1 image for desktop view
      alt: "Desktop screenshot showing family management dashboard",
      title: "Family Management Portal",
      description: "Caregivers and family members can log in via the web to manage content, upload cherished photos, curate memories, and manage reminders remotely."
    },
  ];

  return (
    <div className={styles.container}>

      {/* HERO SECTION */}
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <div className={styles.heroTextSection}>
            <h1 className={styles.heroTitle}>
              Preserving the Past, <br/>
              <span className={styles.highlightText}>One Story at a Time.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A digital recollection application designed for seniors, managed by family members and caregivers, and powered by Text-to-Speech Technology.
            </p>
            <div className={styles.ctaContainer}>
              <Link to="/login" className={styles.portalLink}>
                <MoveToEndIcon size={20} color="#9333ea" />
                Go to the Web Portal
              </Link>
              <a href={DOWNLOAD_LINK} className={styles.downloadLink}>
                <DownloadIcon size={20} color="white" />
                Download the Mobile App
              </a>
            </div>
          </div>
          
          {/* Hero Image Area */}
          <div className={styles.heroImageSection}>
            <img 
              src={heroImage}
              alt="Elderly person using a tablet with family"
              className={styles.heroImage}
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        <div className={styles.sectionChallenges}>
          
          {/* Upper content section - IMAGES */}
          <div className={styles.sectionChallengesLeft}>
            {/* Image 1: Bottom Left (The larger background one) */}
            <img 
              src={ForgetfulSeniorImage}
              alt="Forgetful senior"
              className={styles.imageBottomLeft}
            />
            {/* Image 2: Top Right (The overlapping one) */}
            <img 
              src={SeniorPuzzleImage}
              alt="Senior with puzzle"
              className={styles.imageTopRight}
            />
          </div>

          {/* Upper content section - TEXT */}
          <div className={styles.sectionChallengesRight}>
            <div className={styles.upperRightTextSection}>
              <h1 className={styles.sectionChallengesTitle}>
                Common Problems <br/> Faced by Seniors
              </h1>
              
              <div className={styles.featureItem}>
                <div className={styles.iconWrapper}>
                  <UserIcon size={30} color="#492565" />
                </div>
                <h3 className={styles.featureTitle}>Misplacing personal items</h3>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.iconWrapper}>
                  <HourglassIcon size={30} color="#492565" />
                </div>
                <h3 className={styles.featureTitle}>Losing Track of Daily Activities</h3>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.iconWrapper}>
                  <BrainIcon size={30} color="#492565" />
                </div>
                <h3 className={styles.featureTitle}>Difficulty recalling past experiences and conversations</h3>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE CONTENT*/}
        <div className={styles.sectionResearchFrequency}>
          
          <div className={styles.sectionResearchFrequencyContainer}>
            {/* Left Side: Text */}
            <div className={styles.sectionResearchFrequencyTextSection}>
              <h1 className={styles.sectionResearchFrequencyTitle}>
                How often do memory issues occur?
              </h1>
              <p className={styles.sectionResearchFrequencySubtitle}>
                Our research shows that memory difficulties are a widespread challenge, affecting <strong>92%</strong> of the respondents we surveyed.
              </p>
            </div>

            {/* Right Side: Donut Chart + Legend */}
            <div className={styles.chartWrapper}>
              
              {/* The Donut Circle */}
              <div className={styles.donutContainer}>
                {/* We use CSS conic-gradient for the chart segments */}
                <div className={styles.donutChart}></div>
                <div className={styles.donutHole}>
                  <div className={styles.donutCenterText}>
                    <span className={styles.donutNumber}>25</span>
                    <span className={styles.donutLabel}>Responses</span>
                  </div>
                </div>
              </div>

              {/* The Legend */}
              <div className={styles.chartLegend}>
                {frequencyData.map((item, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div 
                      className={styles.legendColorBox} 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className={styles.legendTextGroup}>
                      <span className={styles.legendPercent}>{item.percentage}%</span>
                      <span className={styles.legendLabel}>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        <div className={styles.sectionResearchTools}>
          <div className={styles.sectionResearchToolsContent}>
            <div className={styles.sectionResearchToolsTextSection}>
              <h1 className={styles.sectionResearchToolsTitle}>
                Tools Currently Used by Seniors
              </h1>
              
              <div className={styles.graphContainer}>
                {statsData.map((item, index) => (
                  <div key={index} className={styles.graphItem}>
                    {/* Label Row: Text and Percentage */}
                    <div className={styles.graphLabelRow}>
                      <span className={styles.graphLabel}>{item.label}</span>
                      <span className={styles.graphPercentage}>{item.percentage}%</span>
                    </div>
                    
                    {/* The Bar */}
                    <div className={styles.progressBarBackground}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* --- SECTION 4: FEATURES --- */}
      <div className={styles.sectionFeatures}>
        <div className={styles.featuresContent}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.sectionTitle}>See Girumdom in Action</h2>
            <p className={styles.sectionSubtitle}>
              Designed for simplicity, connected by voice.
            </p>
          </div>

          <div className={styles.featuresList}>
            {featuresData.map((feature, index) => (
              <div key={index} className={styles.featureBlock}>
                
                {/* Image Side - Dynamic rendering based on count */}
                <div className={styles.featureImageWrapper}>
                  {feature.images.length > 1 ? (
                    // MOBILE GRID LAYOUT (3 Screens)
                    <div className={styles.mobileScreenGrid}>
                      {feature.images.map((img, i) => (
                        <img key={i} src={img} alt={`${feature.alt} ${i + 1}`} className={styles.mobileScreenshot} />
                      ))}
                    </div>
                  ) : (
                    // DESKTOP SINGLE LAYOUT
                    <img src={feature.images[0]} alt={feature.alt} className={styles.desktopScreenshot} />
                  )}
                </div>
                
                {/* Text Side */}
                <div className={styles.featureTextBox}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA (Conversion) */}
      <div className={styles.sectionFinalCTA}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to preserve their legacy?</h2>
          <p className={styles.ctaSubtitle}>
            Start capturing memories today. It's free to get started.
          </p>
          <div className={styles.ctaButtons}>
             <a href={DOWNLOAD_LINK} className={styles.finalDownloadBtn}>
                <DownloadIcon size={20} />
                Download App
              </a>
              <Link to="/login" className={styles.finalPortalBtn}>
                Login to Portal
              </Link>
          </div>
        </div>
      </div>

      </main>

    </div>
  );
};

export default LandingPage;