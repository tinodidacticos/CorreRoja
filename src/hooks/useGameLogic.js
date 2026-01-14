import { useState, useEffect, useMemo, useCallback } from 'react';

export function useGameLogic() {
    const [allRiddles, setAllRiddles] = useState([]);

    // -- PERSISTENT STATE --
    const [deck, setDeck] = useState(() => {
        const saved = localStorage.getItem('deck');
        return saved ? JSON.parse(saved) : null;
    });

    const [currentDeckIndex, setCurrentDeckIndex] = useState(() => {
        return parseInt(localStorage.getItem('current_deck_index') || '0', 10);
    });

    const [mode, setMode] = useState(() => localStorage.getItem('mode') || 'Normal');

    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('filters');
        return saved ? JSON.parse(saved) : { category: 'All', onlyFavorites: false };
    });

    const [isRandom, setIsRandom] = useState(() => localStorage.getItem('is_random') === 'true');

    const [isTimerEnabled, setIsTimerEnabled] = useState(() => localStorage.getItem('timer_enabled') === 'true');
    const [timerDuration, setTimerDuration] = useState(() => parseInt(localStorage.getItem('timer_duration') || '60', 10));

    const [userState, setUserState] = useState(() => {
        const saved = localStorage.getItem('user_state');
        return saved ? JSON.parse(saved) : {};
    });

    // -- COMPUTED --
    const visibleRiddles = useMemo(() => {
        if (allRiddles.length === 0) return [];
        const cat = filters.category;
        const fav = filters.onlyFavorites;

        return allRiddles.filter(r => {
            const matchCat = cat === 'All' || r.category === cat;
            if (fav) {
                return matchCat && userState[r.id]?.favorite;
            }
            return matchCat;
        });
        // We split dependencies to avoid rebuild on userState change unless filtering by fav
    }, [allRiddles, filters.category, filters.onlyFavorites, filters.onlyFavorites ? userState : undefined]);

    // -- LOAD DATA --
    useEffect(() => {
        fetch('/riddles.json')
            .then(res => res.json())
            .then(data => {
                const list = Array.isArray(data) ? data : [];
                // Parse categories and create Objects
                const parsed = list.map(filename => ({
                    id: filename,
                    category: filename.startsWith('C') ? 'C' : (filename.startsWith('L') ? 'L' : 'Other')
                }));

                // Natural Sort for consistent ID ordering
                parsed.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }));

                setAllRiddles(parsed);
            })
            .catch(err => console.error("Failed to load riddles", err));
    }, []);

    // -- DECK MANAGEMENT --
    const shuffleDeck = useCallback((items) => {
        const indices = items.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }, []);

    const initializeDeck = useCallback(() => {
        if (visibleRiddles.length === 0) {
            setDeck([]);
            setCurrentDeckIndex(0);
            return;
        }

        let newDeck;
        if (isRandom) {
            newDeck = shuffleDeck(visibleRiddles);
        } else {
            newDeck = visibleRiddles.map((_, i) => i);
        }
        setDeck(newDeck);
        setCurrentDeckIndex(0);
    }, [visibleRiddles, isRandom, shuffleDeck]);

    // Re-init deck if filters change or it's invalid
    useEffect(() => {
        // If deck is null, we need to init.
        // If deck is empty BUT we have visible riddles, we also need to init (this happens on first load after fetch).
        if (!deck || (deck.length === 0 && visibleRiddles.length > 0)) {
            initializeDeck();
        }
    }, [deck, visibleRiddles, initializeDeck]);

    // Reset deck when filters/random mode changes explicitly?
    // We'll expose a method to force reset.

    // -- PERSISTENCE --
    useEffect(() => { if (deck) localStorage.setItem('deck', JSON.stringify(deck)); }, [deck]);
    useEffect(() => localStorage.setItem('current_deck_index', currentDeckIndex), [currentDeckIndex]);
    useEffect(() => localStorage.setItem('mode', mode), [mode]);
    useEffect(() => localStorage.setItem('filters', JSON.stringify(filters)), [filters]);
    useEffect(() => localStorage.setItem('is_random', isRandom), [isRandom]);
    useEffect(() => localStorage.setItem('timer_enabled', isTimerEnabled), [isTimerEnabled]);
    useEffect(() => localStorage.setItem('timer_duration', timerDuration), [timerDuration]);
    useEffect(() => localStorage.setItem('user_state', JSON.stringify(userState)), [userState]);

    // -- HELPERS --
    const currentRiddle = useMemo(() => {
        if (!deck || !visibleRiddles || deck.length === 0 || currentDeckIndex >= deck.length) return null;
        const realIndex = deck[currentDeckIndex];
        return visibleRiddles[realIndex]; // deck holds indices of visibleRiddles
    }, [deck, currentDeckIndex, visibleRiddles]);

    const goToNext = () => {
        if (!deck) return;

        const maxIndex = deck.length - 1;

        if (currentDeckIndex < maxIndex) {
            setCurrentDeckIndex(prev => prev + 1);
        } else if (isRandom && deck.length > 0) {
            // End of random deck -> Reshuffle
            const newDeck = shuffleDeck(visibleRiddles);
            setDeck(newDeck);
            setCurrentDeckIndex(0);
            window.alert("Se reinició el mazo (Aleatorio sin repetir).");
        } else {
            // End of normal deck
            window.alert("¡Has llegado al último desafío!");
        }
    };

    const goToPrev = () => {
        if (currentDeckIndex > 0) {
            setCurrentDeckIndex(prev => prev - 1);
        }
    };

    const goToRiddleId = (id) => {
        // Find index in visibleRiddles
        const vIndex = visibleRiddles.findIndex(r => r.id === id);
        if (vIndex !== -1) {
            // Find where this vIndex is in the current deck
            const dIndex = deck.findIndex(idx => idx === vIndex);
            if (dIndex !== -1) {
                setCurrentDeckIndex(dIndex);
                return true;
            }
        }
        return false;
    };

    const setStatus = (id, status) => { // 0, 1, 2
        setUserState(prev => ({
            ...prev,
            [id]: { ...(prev[id] || {}), status }
        }));
    };

    const toggleFavorite = (id) => {
        setUserState(prev => ({
            ...prev,
            [id]: { ...(prev[id] || {}), favorite: !prev[id]?.favorite }
        }));
    };

    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        // When filters change, we usually want to reset the view/deck
        // We'll effect this by setting deck to null to trigger re-init
        setDeck(null);
    };

    const applyRandom = (val) => {
        setIsRandom(val);
        setDeck(null); // Force re-shuffle/re-order
    };

    const resetProgress = () => {
        if (confirm("¿Reiniciar TODO el progreso?")) {
            setUserState({});
            setDeck(null); // Re-init
            setCurrentDeckIndex(0);
        }
    };

    return {
        allRiddles,
        visibleRiddles,
        currentRiddle,
        currentDeckIndex,
        totalVisible: deck?.length || 0,

        // State
        mode, setMode,
        filters, applyFilters,
        isRandom, applyRandom,
        isTimerEnabled, setIsTimerEnabled,
        timerDuration, setTimerDuration,
        userState,

        // Actions
        setStatus,
        toggleFavorite,
        goToNext,
        goToPrev,
        goToRiddleId,
        resetProgress
    };
}
