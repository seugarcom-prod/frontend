"use client";

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Verificar se window está disponível (apenas do lado do cliente)
        if (typeof window !== 'undefined') {
            const media = window.matchMedia(query);

            // Definir o estado inicial
            setMatches(media.matches);

            // Definir callback para mudanças
            const listener = () => setMatches(media.matches);

            // Adicionar listener
            media.addEventListener('change', listener);

            // Limpar listener
            return () => media.removeEventListener('change', listener);
        }
    }, [query]);

    return matches;
}