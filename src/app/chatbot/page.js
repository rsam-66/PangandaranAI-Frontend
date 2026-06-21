
'use client';

import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { injectChatbotSlices } from '@/store/store';
import { templatePrompts } from '@/data/faqData';
import AppBar from '@/components/layout/AppBar/AppBar';
import BottomNav from '@/components/layout/BottomNav/BottomNav';
import ChatBubbleBot from '@/components/chat/ChatBubbleBot/ChatBubbleBot';
import ChatBubbleUser from '@/components/chat/ChatBubbleUser/ChatBubbleUser';
import TemplatePromptCard from '@/components/chat/TemplatePromptCard/TemplatePromptCard';
import MessageInput from '@/components/chat/MessageInput/MessageInput';
import DestinationCarousel from '@/components/chat/DestinationCarousel/DestinationCarousel';
import styles from './page.module.css';
import { checkBackendHealth } from '@/services/api';

/**
 * Chatbot page — AI-powered tourism assistant.
 * Has two views: session list (all conversations) and chat view (active conversation).
 * Uses RAG (Retrieval-Augmented Generation) for context-aware responses.
 */
export default function ChatbotPage() {
    const dispatch = useDispatch();
    const { messages, loading, loadingHistory, error } = useSelector((state) => state.chat);
    const { sessions, activeSessionId, loading: sessionsLoading } = useSelector((state) => state.history);
    const { initialized } = useSelector((state) => state.auth);
    const chatEndRef = useRef(null);
    const [slicesReady, setSlicesReady] = useState(false);

    // View: 'list' | 'chat'
    const [view, setView] = useState('list');

    const hasMessages = messages.length > 0;
    const activeSession = sessions.find((s) => s.id === activeSessionId);

    // Inject heavy Redux slices on first mount, then init auth
    useEffect(() => {
        let cancelled = false;
        (async () => {
            await injectChatbotSlices();
            if (cancelled) return;
            setSlicesReady(true);
            // Dynamically import and dispatch auth init
            const { initAuth } = await import('@/store/authSlice');
            dispatch(initAuth());
        })();
        return () => { cancelled = true; };
    }, [dispatch]);

    // Fetch sessions from API when auth is ready
    useEffect(() => {
        if (!slicesReady || !initialized) return;
        (async () => {
            const { loadSessions } = await import('@/store/historySlice');
            dispatch(loadSessions());
        })();
    }, [initialized, slicesReady, dispatch]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (view === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, view]);

    // ---- Actions ----
    const handleNewChat = async () => {
        // Pre-flight check: is the backend alive?
        console.log('[ChatBot] Checking backend health...');
        const health = await checkBackendHealth();
        console.log('[ChatBot] Health check result:', health);

        if (!health.ok) {
            console.error('[ChatBot] Backend is unreachable, aborting session creation.');
            return;  // Don't call createSession at all
        }

        console.log('[ChatBot] Backend is healthy, creating session...');
        const { createSession } = await import('@/store/historySlice');
        const { clearMessages } = await import('@/store/chatSlice');
        const result = await dispatch(createSession('New Chat'));
        if (result.meta.requestStatus === 'fulfilled') {
            dispatch(clearMessages());
            setView('chat');
        }
    };


    const handleOpenSession = async (session) => {
        const { switchSession, deleteSession } = await import('@/store/historySlice');
        const { loadSessionMessages } = await import('@/store/chatSlice');
        dispatch(switchSession(session.id));
        const result = await dispatch(loadSessionMessages(session.id));
        // If loading messages failed (e.g. session 404 on backend), treat it as
        // an orphaned session — clean it up from Redux and stay on the list view.
        if (result.meta.requestStatus === 'rejected') {
            dispatch(deleteSession(session.id));
            return;
        }
        setView('chat');
    };

    const handleDeleteSession = async (e, sessionId) => {
        e.stopPropagation();
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus obrolan ini?');
        if (!confirmed) return;
        // Redux fulfilled/rejected both remove the session immediately.
        // Do NOT call loadSessions() — it re-fetches and may re-add ghost sessions.
        const { deleteSession } = await import('@/store/historySlice');
        dispatch(deleteSession(sessionId));
    };

    const handleBackToList = async () => {
        const { clearMessages } = await import('@/store/chatSlice');
        dispatch(clearMessages());
        setView('list');
        // Do NOT call loadSessions() here — createSession.fulfilled already added
        // the new session to Redux optimistically. Re-fetching overwrites it.
    };

    const handleSend = async (text) => {
        if (!text?.trim()) return;
        const { addUserMessage, sendMessage } = await import('@/store/chatSlice');
        if (!activeSessionId) {
            // Create session first, then send
            const { createSession } = await import('@/store/historySlice');
            const result = await dispatch(createSession('New Chat'));
            // If session creation failed, abort — don't send to a non-existent session
            if (result.meta.requestStatus !== 'fulfilled') return;
        }
        // Dispatch both unconditionally — works for typed text AND speech transcriptions
        dispatch(addUserMessage(text));
        dispatch(sendMessage());
    };

    const handleTemplateClick = (promptText) => {
        handleSend(promptText);
    };

    // ---- Format helpers ----
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hari ini';
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // ---- SESSION LIST VIEW ----
    if (view === 'list') {
        return (
            <>
                <AppBar title="Chatbot" />
                <main className={`pageContent ${styles.listArea}`}>
                    {sessionsLoading ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>Memuat percakapan...</p>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15C21 15.55 20.78 16.05 20.41 16.41C20.05 16.78 19.55 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" fill="#e0e0e0" />
                                </svg>
                            </div>
                            <p className={styles.emptyText}>Belum ada percakapan</p>
                            <p className={styles.emptySubtext}>Mulai percakapan baru dengan Pangandaran.ai</p>
                        </div>
                    ) : (
                        <div className={styles.sessionList}>
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={styles.sessionCard}
                                    onClick={() => handleOpenSession(session)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className={styles.sessionIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 15C21 15.55 20.78 16.05 20.41 16.41C20.05 16.78 19.55 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" fill="#00897B" />
                                        </svg>
                                    </div>
                                    <div className={styles.sessionInfo}>
                                        <h4 className={styles.sessionTitle}>{session.title || 'New Chat'}</h4>
                                        <span className={styles.sessionDate}>
                                            {formatDate(session.created_at || session.createdAt)}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        aria-label="Delete session"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FAB - New Chat */}
                    <button className={styles.fab} onClick={handleNewChat} aria-label="New chat">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </main>
                <BottomNav />
            </>
        );
    }

    // ---- CHAT VIEW (Welcome + Conversation) ----
    return (
        <>
            <AppBar
                showBack
                title={activeSession?.title || 'New Chat'}
                onBack={handleBackToList}
            />
            <main className={`pageContent ${styles.chatArea}`}>
                {loadingHistory ? (
                    <div className={styles.welcomeState}>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Memuat pesan...
                        </p>
                    </div>
                ) : !hasMessages ? (
                    /* ---- Welcome State ---- */
                    <div className={styles.welcomeState}>
                        <div className={styles.welcomeLabel}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15C21 15.55 20.78 16.05 20.41 16.41C20.05 16.78 19.55 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" fill="#00897B" />
                            </svg>
                            <span>Percakapan tentang wisata</span>
                        </div>

                        {/* Bot greeting */}
                        <ChatBubbleBot
                            message={"Hai pangandaran.ai\n\nHai, bagaimana kabarmu?, apakah ada yang bisa saya bantu?"}
                        />

                        {/* Template prompts */}
                        <div className={styles.promptsContainer}>
                            {templatePrompts.map((prompt) => (
                                <TemplatePromptCard
                                    key={prompt.id}
                                    text={prompt.text}
                                    icon={prompt.icon}
                                    onClick={() => handleTemplateClick(prompt.text)}
                                />
                            ))}
                        </div>

                        <p className={styles.voiceHint}>Tekan lalu ucapkan</p>
                    </div>
                ) : (
                    /* ---- Conversation State ---- */
                    <div className={styles.messagesContainer}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={styles.messageRow}>
                                {msg.role === 'user' ? (
                                    <ChatBubbleUser message={msg.content} />
                                ) : (
                                    <>
                                        <ChatBubbleBot
                                            message={msg.content}
                                            timestamp={msg.timestamp}
                                        />
                                        {msg.destinations && (
                                            <DestinationCarousel destinations={msg.destinations} />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className={styles.messageRow}>
                                <div className={styles.typingIndicator}>
                                    <div className={styles.avatarSmall}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 15C21 15.55 20.78 16.05 20.41 16.41C20.05 16.78 19.55 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z" fill="white" />
                                        </svg>
                                    </div>
                                    <div className={styles.dots}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div className={styles.errorMsg}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>
                )}
            </main>

            <MessageInput onSend={handleSend} disabled={loading} />
            <BottomNav />
        </>
    );
}
