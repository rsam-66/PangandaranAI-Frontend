"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./MessageInput.module.css";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

export default function MessageInput({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Auto-grow textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const { startListening, isListening } = useSpeechRecognition((transcript) => {
    setText((prev) => {
      const newText = prev ? prev + " " + transcript : transcript;

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          Math.min(textareaRef.current.scrollHeight, 120) + "px";
      }

      return newText;
    });
  });

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Generate a name of ..."
          rows={1}
          disabled={disabled}
        />
        <div className={styles.actions}>
          {/* Microphone icon — placeholder */}
          <button
            className={`${styles.actionBtn} ${isListening ? styles.listening : ""}`}
            aria-label="Voice input"
            disabled={disabled}
            onClick={startListening}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
                stroke={isListening ? "#ff4d4f" : "#757575"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10"
                stroke={isListening ? "#ff4d4f" : "#757575"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19V23M8 23H16"
                stroke={isListening ? "#ff4d4f" : "#757575"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Attachment icon — placeholder */}
          <button
            className={styles.actionBtn}
            aria-label="Attach file"
            disabled={disabled}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.44 11.05L12.25 20.24C10.72 21.77 8.18 21.77 6.65 20.24C5.12 18.71 5.12 16.17 6.65 14.64L15.84 5.45C16.81 4.48 18.37 4.48 19.34 5.45C20.31 6.42 20.31 7.98 19.34 8.95L10.15 18.14C9.66 18.63 8.88 18.63 8.39 18.14C7.9 17.65 7.9 16.87 8.39 16.38L16.59 8.18"
                stroke="#757575"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Send button */}
          <button
            className={`${styles.sendBtn} ${text.trim() ? styles.sendActive : ""}`}
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
