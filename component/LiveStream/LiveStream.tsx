"use client";
import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Share2, Users, X } from "lucide-react";
import styles from "./LiveStream.module.css";
import { useData } from "@/provider/dataContext";

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
  type: "real" | "fake"; // Track if it's a real or fake join
}

interface FormState {
  name: string;
  phoneNumber: string;
}

export default function LiveStream() {
  const { addExhibitionVideo, getVideoCount, videoCount } = useData();
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phoneNumber: "",
  });
  const [likes, setLikes] = useState(2847);
    const [windowWidth, setWindowWidth] = useState<number>(0);

  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [liveJoins, setLiveJoins] = useState<LiveJoin[]>([
    { id: "1", name: "Sarah", timestamp: "now" },
    { id: "2", name: "Mike", timestamp: "30s" },
    { id: "3", name: "Emma", timestamp: "1m" },
  ]);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [displayCount, setDisplayCount] = useState<number>(0);

  // Track fake joins count
  const [fakeJoins, setFakeJoins] = useState<number>(0);
  const fakeJoinsRef = useRef<number>(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatNumberWithSuffix = (num: number): string => {
    if (num >= 100000) {
      // For lakhs (Indian numbering system)
      const lakhs = (num / 100000).toFixed(1);
      return `${lakhs.endsWith(".0") ? parseInt(lakhs) : lakhs}L`;
    } else if (num >= 1000) {
      // For thousands
      const thousands = (num / 1000).toFixed(1);
      return `${thousands.endsWith(".0") ? parseInt(thousands) : thousands}K`;
    }
    // For numbers less than 1000
    return num.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getVideoCount();
  }, []);

  useEffect(() => {
    if (videoCount?.count != null) {
      setDisplayCount(Number(videoCount.count));
      fakeJoinsRef.current = 0;
      setFakeJoins(0);
    }
  }, [videoCount]);

  // Main display count effect with fake joins
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCount((prev) => {
        if (!videoCount?.count) return prev;

        const actual = Number(videoCount.count);
        const currentFakeJoins = fakeJoinsRef.current;
        const total = actual + currentFakeJoins;

        // Create natural fluctuation +/- 1
        const fluctuation = Math.floor(Math.random() * 3) - 1; // -1, 0, +1

        let next = total + fluctuation;

        // Keep it reasonable
        if (next < actual) next = actual;
        if (next > actual + 5) next = actual + 5;

        return next;
      });
    }, 1000); // Update every 1 second

    return () => clearInterval(interval);
  }, [videoCount]);

  // Fake join interval - add 1-2 fake users every few seconds
  useEffect(() => {
    const fakeJoinInterval = setInterval(() => {
      // 70% chance to trigger fake joins
      if (Math.random() > 0.3) {
        const fakeCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 fake joins

        setFakeJoins((prev) => {
          const newFakeCount = prev + fakeCount;
          fakeJoinsRef.current = newFakeCount;
          return newFakeCount;
        });

        // Add toasts for each fake join
        for (let i = 0; i < fakeCount; i++) {
          const randomName =
            RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

          setToasts((prev) => [
            ...prev,
            {
              id: `fake-toast-${Date.now()}-${i}`,
              name: randomName,
              timestamp: Date.now(),
              type: "fake",
            },
          ]);
        }
      }
    }, 8000); // Check every 8 seconds

    return () => clearInterval(fakeJoinInterval);
  }, []);

  // Real joins interval (as before, but now marked as 'real')
  useEffect(() => {
    const interval = setInterval(() => {
      const randomName =
        RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

      // Add real join toast
      setToasts((prev) => [
        ...prev,
        {
          id: `toast-${Date.now()}`,
          name: randomName,
          timestamp: Date.now(),
          type: "real",
        },
      ]);

      // Add to live joins
      setLiveJoins((prev) => [
        ...prev.slice(-8),
        {
          id: `join-${Date.now()}`,
          name: randomName,
          timestamp: "now",
        },
      ]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Clean up old toasts
  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.filter((toast) => Date.now() - toast.timestamp < 3000)
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async () => {
    try {
      const exhibitionVideo = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      };
      console.log("pass");

      console.log(exhibitionVideo);
      const resp = await addExhibitionVideo(exhibitionVideo);
      console.log(resp);
    } catch (e) {
      alert("Server Error");
    }
  };

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

  const desktopVideoUrl = "https://cdn.evhomes.tech/0c05bfea-875e-4b85-a7ed-93dbb8f8c8db-10mb.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6IjBjMDViZmVhLTg3NWUtNGI4NS1hN2VkLTkzZGJiOGY4YzhkYi0xMG1iLm1wNCIsImlhdCI6MTc2NTM1Mjc2MX0.T92po-8MpP6gNbBiJ7xPRzAQnZ8RMWf4xd4b9UuX0rA";

  const mobileVideoUrl = "https://cdn.evhomes.tech/4e2f701e-ff09-400e-836a-9dcd8ba4072c-10mb_vid_vertical.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6IjRlMmY3MDFlLWZmMDktNDAwZS04MzZhLTlkY2Q4YmE0MDcyYy0xMG1iX3ZpZF92ZXJ0aWNhbC5tcDQiLCJpYXQiOjE3NjU0NjUwMTF9.6ZU5mgBJVSo1b4bGYach6iuy4nCYpZWnYft2G9YNXdw";
  
  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoUrl = windowWidth < 768 ? mobileVideoUrl : desktopVideoUrl;

  return (
    <main
      ref={containerRef}
      onClick={handleContainerClick}
      className={styles.container}
    >
      {/* Background Video */}
      <video
        className={styles.backgroundVideo}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        key={videoUrl}
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
            {/* You can show fake joins count here if needed */}
            {/* {fakeJoins > 0 && (
              <span className={styles.fakeJoinsBadge}>
                +{fakeJoins} recently
              </span>
            )} */}
          </div>
          <div className={styles.viewersCount}>
            <Users className={styles.viewersIcon} />
            <span className={styles.viewersText}>
              {formatNumberWithSuffix(displayCount)}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`${styles.membersPanel} ${
          isPanelOpen ? styles.panelOpen : styles.panelClosed
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
          <div className={styles.userForm}>
            <label className={styles.formLabel}>Name</label>

            <input
              type="text"
              name="name"
              className={styles.formInput}
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phoneNumber"
              className={styles.formInput}
              placeholder="Enter Mobile Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />

            <button className={styles.submitbtn} onClick={onSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${
              toast.type === "fake" ? styles.fakeToast : ""
            }`}
          >
            <span className={styles.toastEmoji}>👤</span>
            <span className={styles.toastText}>
              {formatNumberWithSuffix(displayCount)} People Watching
              {toast.type === "fake" && " just now"}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={styles.openPanelButton}
        aria-label="Show members"
      >
        <p className={styles.Knowmore}>Know More</p>
      </button>

      {/* Bottom Gradient */}
      <div className={styles.bottomGradient} />
    </main>
  );
}
