"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Share2, Users, X } from "lucide-react";
import styles from "./LiveStream.module.css";

const RANDOM_NAMES = [
  "Akash",
  "Neha",
  "Rahul",
  "Priya",
  "Arjun",
  "Zara",
  "Karan",
  "Pooja",
  "Vikram",
  "Sarah",
  "Mike",
  "Emma",
  "Dev",
  "Lisa",
  "John",
];

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

interface LiveJoin {
  id: string;
  name: string;
  timestamp: string;
}

interface Toast {
  id: string;
  name: string;
  timestamp: number;
}

export default function LiveStream() {
  const [likes, setLikes] = useState(2847);
  const [viewers, setViewers] = useState(1324);

  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [liveJoins, setLiveJoins] = useState<LiveJoin[]>([
    { id: "1", name: "Sarah", timestamp: "now" },
    { id: "2", name: "Mike", timestamp: "30s" },
    { id: "3", name: "EmmaSD", timestamp: "1m" },
  ]);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-generate viewers change
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomName =
        RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

      setLiveJoins((prev) => [
        ...prev.slice(-8),
        {
          id: `join-${Date.now()}`,
          name: randomName,
          timestamp: "now",
        },
      ]);

      setToasts((prev) => [
        ...prev,
        {
          id: `toast-${Date.now()}`,
          name: randomName,
          timestamp: Date.now(),
        },
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.filter((toast) => Date.now() - toast.timestamp < 3000)
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Handle double-tap or click for likes
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const isDoubleTap = now - lastTapRef.current < 300;

    if (isDoubleTap) {
      e.preventDefault();
      createHearts(e);
      setLikes((prev) => prev + 1);
    }

    lastTapRef.current = now;
  };

  // Create multiple hearts from click position
  const createHearts = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Bottom-right coordinates
    const startX = rect.width - 60;   // 60px from right
    const startY = rect.height - 120; // a bit above bottom

    // Create 2–3 hearts
    const newHearts = Array.from({ length: 3 }).map((_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: startX + (Math.random() - 0.5) * 40, // slight horizontal spread
      y: startY + (Math.random() - 0.5) * 40, // slight vertical spread
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    // remove after animation ends
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      );
    }, 1200);
  };


  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };





  return (
    <main
      ref={containerRef}
      onClick={handleContainerClick}
      className={styles.container}
    >
      {/* Background Video */}
      <video
        className={styles.backgroundVideo}
        src="https://cdn.evhomes.tech/0c05bfea-875e-4b85-a7ed-93dbb8f8c8db-10mb.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6IjBjMDViZmVhLTg3NWUtNGI4NS1hN2VkLTkzZGJiOGY4YzhkYi0xMG1iLm1wNCIsImlhdCI6MTc2NTM1Mjc2MX0.T92po-8MpP6gNbBiJ7xPRzAQnZ8RMWf4xd4b9UuX0rA"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay Gradient */}
      <div className={styles.overlay} />

      {/* Floating Hearts Layer */}
      <div className={styles.heartsLayer}>
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className={styles.floatingHeart}
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>

            <span className={styles.headerTitle}>Marina Bay Video</span>

          </div>


          <div className={styles.likeAndshareContainer}>

            <button className={styles.shareButton} aria-label="Share">
              <Share2 className="w-5 h-5" />
            </button>

          </div>

        </div>
      </div>

      {/* Viewers Count */}
      <div className={styles.viewersCount}>
        <div className={styles.VisiticonWrapper}><Users className={styles.viewersIcon} /></div>
        

        <span className={styles.viewersText}>
          {viewers.toLocaleString()}
        </span>
      </div>




      <div
        className={`${styles.membersPanel} ${isPanelOpen ? styles.panelOpen : styles.panelClosed
          }`}
      >
        <div className={styles.membersPanelHeader}>
          <span className={styles.membersPanelTitle}>Fill the Details</span>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={styles.collapseButton}
            aria-label="Toggle members panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.formWrapper}>
          <form className={styles.userForm}>
            <label className={styles.formLabel}>Name</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Enter Your Name"
            />

            <label className={styles.formLabel}>Mobile Number</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Enter Mobile Number"
            />

            <button className={styles.formSubmit}>Submit</button>
          </form>
        </div>

      </div>

      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={styles.toast}>
            <span className={styles.toastEmoji}>👤</span>
            <span className={styles.toastText}>
              <p>{formatNumber(viewers)}</p>
              Watching !!</span>
          </div>
        ))}
      </div>



      <div className={styles.bottomBtns}>
        <div className={styles.likeCount}>
        <span className={styles.likeEmoji}>❤️</span>

      </div>
      
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={styles.openPanelButton}
        aria-label="Show members"
      >
        <p className={styles.Knowmore}>Know More</p>
      </button>

      </div>


      

      {/* Bottom Gradient */}
      <div className={styles.bottomGradient} />
    </main>
  );
}
