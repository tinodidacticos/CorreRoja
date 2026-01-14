import React, { useEffect, useState } from 'react';

export function RiddleView({
    riddle,
    index,
    total,
    mode,
    isTimerEnabled,
    duration,
    userStateItem,
    onNext,
    onPrev,
    onOpenAnswer,
    onOpenSettings,
    onOpenIndex,
    onToggleFavorite,
    onSetStatus
}) {
    const [timeLeft, setTimeLeft] = useState(duration);

    // Timer Logic
    useEffect(() => {
        if (!isTimerEnabled || mode === 'Presentation') return;

        setTimeLeft(duration);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [riddle, isTimerEnabled, duration, mode]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/?id=${riddle.id}`;
        const shareData = {
            title: 'Corre Roja - Desafío Visual',
            text: `¿Puedes resolver este desafío? #${riddle.id.replace('.jpg', '')}`,
            url: url
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error al compartir', err);
            }
        } else {
            navigator.clipboard.writeText(url);
            alert('Enlace copiado al portapapeles!');
        }
    };


    const isFav = userStateItem?.favorite;
    const status = userStateItem?.status || 0; // 0=none, 1=correct, 2=incorrect

    return (
        <div className="view-container fade-in">
            <header className="app-header">
                <h1 className="title">Desafío {index + 1} <span style={{ fontSize: '0.6em', opacity: 0.7 }}>({total})</span></h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleShare} className="btn-icon">🔗</button>
                    <button onClick={onOpenIndex} className="btn-icon">▦</button>
                    <button onClick={onOpenSettings} className="btn-icon">⚙️</button>
                </div>
            </header>

            <div className="card image-card" style={{ position: 'relative' }}>
                <img
                    src={`/assets/${riddle.id}`}
                    alt={`Desafío ${riddle.id}`}
                    className="riddle-image"
                />

                {/* Favorite Button */}
                <button
                    className={`fav-btn ${isFav ? 'active' : ''}`}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                    onClick={() => onToggleFavorite(riddle.id)}
                >
                    {isFav ? '★' : '☆'}
                </button>
            </div>

            <div className="controls-area">
                {mode === 'Normal' && isTimerEnabled && (
                    <div className={`timer-display ${timeLeft === 0 ? 'time-up' : ''}`}>
                        {timeLeft === 0 ? "¡TIEMPO AGOTADO!" : formatTime(timeLeft)}
                    </div>
                )}

                {mode === 'Normal' && (
                    <div className="flex-between">
                        <button
                            className={`btn-toggle ${status === 1 ? 'active-success' : ''}`}
                            onClick={() => onSetStatus(riddle.id, status === 1 ? 0 : 1)}
                        >
                            Me salió ✅
                        </button>
                        <button
                            className={`btn-toggle ${status === 2 ? 'active-danger' : ''}`}
                            onClick={() => onSetStatus(riddle.id, status === 2 ? 0 : 2)}
                        >
                            No me salió ❌
                        </button>
                    </div>
                )}

                <div className="nav-buttons">
                    <button onClick={onPrev} disabled={index === 0 && false} className="btn btn-secondary">
                        ◀ Anterior
                    </button>

                    <button onClick={onOpenAnswer} className="btn btn-primary">
                        Ver Respuesta
                    </button>

                    <button onClick={onNext} className="btn btn-secondary">
                        Siguiente ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
