'use client';

import styles from './ChatBubbleUser.module.css';

export default function ChatBubbleUser({ message }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.bubble}>
                <p className={styles.content}>{message}</p>
            </div>
        </div>
    );
}
