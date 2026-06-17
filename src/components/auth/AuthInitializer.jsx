'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initAuth } from '@/store/authSlice';

/**
 * Invisible auth initializer — dispatches initAuth on mount.
 * No UI rendered. Place inside StoreProvider in layout.
 */
export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const { initialized } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(initAuth());
    }, [dispatch]);

    // Render children immediately — don't block the UI.
    // API calls will just fail gracefully if token isn't ready yet.
    return children;
}
