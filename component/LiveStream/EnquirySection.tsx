"use client";

import React, { useState } from "react";
import styles from "./LiveStream.module.css";
interface FormState {
  name: string;
  phoneNumber: string;
  email: string;
  optIn: boolean;
}

const EnquirySection = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phoneNumber: "",
    email: "",
    optIn: true,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleConsultationSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    await onSubmit();
  };

  const onSubmit = async () => {
    try {
      const exhibitionVideo = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        optIn: formData.optIn,
      };
      console.log("pass");

      console.log(exhibitionVideo);
    } catch {
      alert("Server Error");
    }
  };

  return (
    <section id="building" className={styles.consultationSection}>
      <div className={styles.consultationBackdrop} aria-hidden="true">
        <span className={styles.backdropLineOne} />
        <span className={styles.backdropLineTwo} />
        <span className={styles.backdropLineThree} />
      </div>

      <div className={styles.consultationShell}>
        <div className={styles.consultationContext} aria-hidden="true">
          <span>Society Planning</span>
          <span>Resident Benefits</span>
          <span>Project Feasibility</span>
        </div>

        <form
          className={styles.consultationCard}
          onSubmit={handleConsultationSubmit}
        >
          <div className={styles.consultationHeader}>
            <div>
              <h2 className={styles.consultationTitle}>
                Discover Redevelopment Opportunities
              </h2>
              <p className={styles.consultationIntro}>
                Share your details to receive expert guidance on society
                redevelopment, project planning, and the benefits available to
                residents and committee members.
              </p>
            </div>
          </div>

          <div className={styles.consultationField}>
            <label htmlFor="consultationName">* Full Name</label>
            <input
              id="consultationName"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.consultationGrid}>
            <div className={styles.consultationField}>
              <label htmlFor="consultationPhone">Mobile Number</label>
              <div className={styles.phoneRow}>
                <select aria-label="Country code" defaultValue="+91">
                  <option value="+91">IN +91</option>
                </select>
                <input
                  id="consultationPhone"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+91 -Enter your phone"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.consultationField}>
              <label htmlFor="consultationEmail">* Email Address</label>
              <input
                id="consultationEmail"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className={styles.consentRow}>
            <input
              type="checkbox"
              name="optIn"
              checked={formData.optIn}
              onChange={handleChange}
            />
            <span>
              I would like to receive redevelopment updates, consultation
              details, and project insights via WhatsApp, Email, SMS, or Call.
            </span>
          </label>

          <button className={styles.consultationButton} type="submit">
            Book a Redevelopment Consultation {"->"}
          </button>

          <p className={styles.consultationFooter}>
            Speak with our Redevelopment Advisors: +91 7034204545
          </p>
        </form>

        <div className={styles.consultationHighlights} aria-hidden="true">
          <div>
            <strong>01</strong>
            <span>Feasibility Review</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Committee Guidance</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Benefit Mapping</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnquirySection;
