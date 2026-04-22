"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./LiveStream.module.css";

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

export default function LiveStream() {
  const [, setLikes] = useState(2847);
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth
  );
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const lastTapRef = useRef<number>(0);
  const heartIdRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = e.timeStamp;
    const isDoubleTap = now - lastTapRef.current < 300;

    if (isDoubleTap) {
      e.preventDefault();
      createHearts(e);
      setLikes((prev) => prev + 1);
    }

    lastTapRef.current = now;
  };

  const createHearts = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create 3-5 hearts in a small radius
    const newHearts = Array.from({ length: 4 }).map((_, i) => ({
      id: `heart-${heartIdRef.current++}-${i}`,
      x: x + (Math.random() - 0.5) * 60,
      y: y + (Math.random() - 0.5) * 60,
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.some((nh) => nh.id === h.id))
      );
    }, 1200);
  };

  const desktopVideoUrl = "https://cdn.evhomes.tech/0c05bfea-875e-4b85-a7ed-93dbb8f8c8db-10mb.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6IjBjMDViZmVhLTg3NWUtNGI4NS1hN2VkLTkzZGJiOGY4YzhkYi0xMG1iLm1wNCIsImlhdCI6MTc2NTM1Mjc2MX0.T92po-8MpP6gNbBiJ7xPRzAQnZ8RMWf4xd4b9UuX0rA";

  const mobileVideoUrl = "https://cdn.evhomes.tech/4e2f701e-ff09-400e-836a-9dcd8ba4072c-10mb_vid_vertical.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6IjRlMmY3MDFlLWZmMDktNDAwZS04MzZhLTlkY2Q4YmE0MDcyYy0xMG1iX3ZpZF92ZXJ0aWNhbC5tcDQiLCJpYXQiOjE3NjU0NjUwMTF9.6ZU5mgBJVSo1b4bGYach6iuy4nCYpZWnYft2G9YNXdw";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const videoUrl = windowWidth < 768 ? mobileVideoUrl : desktopVideoUrl;

  return (
    <main
      id="hero"
      ref={containerRef}
      onClick={handleContainerClick}
      className={styles.container}
    >
      <video
        className={styles.backgroundVideo}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        key={videoUrl}
      />

      <div className={styles.overlay} />

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
    </main>
  );
}
