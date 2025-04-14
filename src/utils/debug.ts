'use client';

import { useEffect } from 'react';

export function DebugAuthState() {
    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        console.log("====== DEBUG AUTH STATE ======");
        console.log("Token:", token ? "Presente" : "Ausente");
        if (token) {
            try {
                // Decodificar payload do token
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("Token payload:", payload);
                console.log("Expiração:", new Date(payload.exp * 1000).toLocaleString());
            } catch (e) {
                console.log("Erro ao decodificar token");
            }
        }
        console.log("============================");
    }, []);

    return null;
}