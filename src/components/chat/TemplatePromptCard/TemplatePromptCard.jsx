'use client';

import styles from './TemplatePromptCard.module.css';

export default function TemplatePromptCard({ text, icon, onClick }) {
    return (
        <button className={styles.card} onClick={onClick}>
            <span className={styles.bullet}>●</span>
            <span className={styles.text}>{text}</span>
        </button>
    );
}
