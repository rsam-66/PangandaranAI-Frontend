'use client';

import styles from './ChatBubbleBot.module.css';

/**
 * ChatBubbleBot — renders a single bot message bubble.
 * Supports markdown-like formatting: **bold**, bullet points (•),
 * and auto-links URLs (both bare URLs and angle-bracket URLs like <https://...>).
 *
 * @param {Object} props
 * @param {string} props.message - The bot's message text
 * @param {string} [props.timestamp] - Optional timestamp to display
 */
export default function ChatBubbleBot({ message, timestamp }) {
    /**
     * Parse the full message text into rendered lines.
     * Handles bullet points, empty lines (line breaks), and paragraphs.
     */
    const renderContent = (text) => {
        if (!text) return null;

        const lines = text.split('\n');

        return lines.map((line, i) => {
            // Handle bullet points
            if (line.startsWith('• ')) {
                const content = line.slice(2);
                return (
                    <li key={i} className={styles.listItem}>
                        {renderInline(content)}
                    </li>
                );
            }

            // Handle empty lines
            if (line.trim() === '') {
                return <br key={i} />;
            }

            // Regular paragraph
            return (
                <p key={i} className={styles.paragraph}>
                    {renderInline(line)}
                </p>
            );
        });
    };

    /**
     * Render inline formatting within a single line.
     * Detects and converts:
     *   - **bold** text → <strong>
     *   - <https://...> angle-bracket URLs → clickable <a> links
     *   - Bare https://... URLs → clickable <a> links
     */
    const renderInline = (text) => {
        // Combined regex: match **bold**, <url>, or bare URLs
        const pattern = /(\*\*.*?\*\*|<(https?:\/\/[^>]+)>|(https?:\/\/[^\s)<>,]+))/g;

        const result = [];
        let lastIndex = 0;
        let match;

        while ((match = pattern.exec(text)) !== null) {
            // Push text before this match
            if (match.index > lastIndex) {
                result.push(text.slice(lastIndex, match.index));
            }

            const fullMatch = match[0];

            if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
                // Bold text
                result.push(
                    <strong key={match.index}>{fullMatch.slice(2, -2)}</strong>
                );
            } else {
                // URL — either from <url> (group 2) or bare url (group 3)
                const url = match[2] || match[3];
                result.push(
                    <a
                        key={match.index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        {url}
                    </a>
                );
            }

            lastIndex = match.index + fullMatch.length;
        }

        // Push remaining text after last match
        if (lastIndex < text.length) {
            result.push(text.slice(lastIndex));
        }

        return result.length > 0 ? result : text;
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.avatarRow}>
                <div className={styles.avatar}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M21 15C21 15.55 20.78 16.05 20.41 16.41C20.05 16.78 19.55 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <span className={styles.name}>pangandaran.ai</span>
            </div>
            <div className={styles.bubble}>
                <div className={styles.content}>{renderContent(message)}</div>
            </div>
        </div>
    );
}
