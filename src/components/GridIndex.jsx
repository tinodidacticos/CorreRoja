import React from 'react';

export function GridIndex({
    riddles,
    userState,
    onSelect,
    onClose
}) {
    return (
        <div className="view-container fade-in">
            <header className="app-header">
                <h1 className="title">Índice</h1>
                <button onClick={onClose} className="btn-icon">✕</button>
            </header>

            <div className="grid-container">
                {riddles.map((riddle, index) => {
                    const state = userState[riddle.id] || {};
                    const statusClass = state.status === 1 ? 'grid-correct' : (state.status === 2 ? 'grid-incorrect' : '');

                    return (
                        <div
                            key={riddle.id}
                            className={`grid-item ${statusClass}`}
                            onClick={() => onSelect(riddle.id)}
                        >
                            <div className="grid-thumb-container">
                                <img src={`/assets/${riddle.id}`} alt={riddle.id} loading="lazy" />
                                {state.favorite && <span className="grid-star">★</span>}
                            </div>
                            <div className="grid-label">{riddle.id.replace('.jpg', '')}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
