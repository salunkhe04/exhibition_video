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
  const createHearts = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create 3-5 hearts in a small radius
    const newHearts = Array.from({ length: 4 }).map((_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: x + (Math.random() - 0.5) * 60,
      y: y + (Math.random() - 0.5) * 60,
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    // Remove hearts after animation completes
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      );
    }, 1200);
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
        src="/videos/live_video.mp4"
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
          <button className={styles.shareButton} aria-label="Share">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Viewers Count */}
      <div className={styles.viewersCount}>
        <Users className={styles.viewersIcon} />
        <span className={styles.viewersText}>{viewers.toLocaleString()}</span>
      </div>

      {/* Like Count Display */}
      <div className={styles.likeCount}>
        <span className={styles.likeEmoji}>❤️</span>

      </div>

      <div
        className={`${styles.membersPanel} ${
          isPanelOpen ? styles.panelOpen : styles.panelClosed
        }`}
      >
        <div className={styles.membersPanelHeader}>
          <span className={styles.membersPanelTitle}>Members Joined</span>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={styles.collapseButton}
            aria-label="Toggle members panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.membersList}>
          {liveJoins
            .slice()
            .reverse()
            .map((join) => (
              <div key={join.id} className={styles.memberItem}>
                <span className={styles.memberEmoji}>👤</span>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>{join.name}</span>
                  <span className={styles.memberTime}>
                    joined {join.timestamp}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={styles.toast}>
            <span className={styles.toastEmoji}>👤</span>
            <span className={styles.toastText}>{toast.name} joined</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={styles.openPanelButton}
        aria-label="Show members"
      >
        <Users className="w-5 h-5" />
      </button>

      {/* Bottom Gradient */}
      <div className={styles.bottomGradient} />
    </main>
  );
}
