"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  footerId?: string;
  heroId?: string;
  bottomOffsetPx?: number;
  className?: string;
  centerVertically?: boolean;
};

export default function ScrollToggleArrow({
  footerId = "limited-edition",
  heroId = "hero",
  bottomOffsetPx = 24,
  className = "",
  centerVertically = false,
}: Props) {
  const [atFooter, setAtFooter] = useState(false);
  const [inHeroSection, setInHeroSection] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const getFooter = useMemo(() => {
    return () => {
      const byId = document.getElementById(footerId);
      if (byId) return byId;
      const byTag = document.querySelector("footer") as HTMLElement | null;
      return byTag || null;
    };
  }, [footerId]);

  const getHero = useMemo(() => {
    return () => {
      return document.getElementById(heroId) || null;
    };
  }, [heroId]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReducedMotion(mq.matches);
    set();
    mq.addEventListener?.("change", set);
    return () => mq.removeEventListener?.("change", set);
  }, []);

  useEffect(() => {
    const footerEl = getFooter();
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      (entries) => setAtFooter(entries.some((e) => e.isIntersecting)),
      { root: null, threshold: [0, 0.1] },
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [getFooter]);

  useEffect(() => {
    const heroEl = getHero();
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setInHeroSection(entries.some((e) => e.isIntersecting));
      },
      { root: null, threshold: 0.1 },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [getHero]);

  const handleClick = () => {
    const footerEl = getFooter();
    const behavior = reducedMotion ? "auto" : "smooth";

    if (atFooter) {
      window.scrollTo({ top: 0, behavior });
    } else if (footerEl) {
      footerEl.scrollIntoView({ behavior, block: "start" });
    }
  };

  const style: React.CSSProperties = {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
    backgroundColor: "transparent",
    color: "currentColor",
    border: "none",
    cursor: "pointer",
    outline: "none",
    transition: "opacity 0.3s ease, visibility 0.3s ease",
    visibility: inHeroSection ? "visible" : "hidden",
    opacity: inHeroSection ? 1 : 0,
  };

  if (centerVertically) {
    style.bottom = "30px";
    style.transform = "translateX(-50%)";
  } else {
    style.bottom = `calc(env(safe-area-inset-bottom, 0px) + ${bottomOffsetPx}px)`;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Scroll to footer"
        onClick={handleClick}
        style={style}
        className={className}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        <span
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Jump to footer
        </span>

        <svg
          width="50"
          height="50"
          viewBox="-2 -2 28 28"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 0 10px rgba(212,165,116,0.6))",
          }}
        >
          <defs>
            <linearGradient
              id="goldGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#835016" />
              <stop offset="40%" stopColor="#bc954c" />
              <stop offset="70%" stopColor="#fcecce" />
              <stop offset="100%" stopColor="#835016" />
            </linearGradient>
          </defs>

          <polyline
            points="6 7 12 13 18 7"
            style={{ animation: "glowDown 1.5s infinite ease-in-out" }}
          />
          <polyline
            points="6 11 12 17 18 11"
            style={{
              animation: "glowDown 1.5s infinite ease-in-out",
              animationDelay: "0.3s",
            }}
          />
          <polyline
            points="6 15 12 21 18 15"
            style={{
              animation: "glowDown 1.5s infinite ease-in-out",
              animationDelay: "0.6s",
            }}
          />
        </svg>
      </button>
    </>
  );
}
