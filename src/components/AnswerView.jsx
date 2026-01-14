import React from 'react';

export function AnswerView({
    riddle,
    status,
    onMarkCorrect,
    onMarkIncorrect,
    onBack
}) {
    const answerFile = riddle.replace('.jpg', 'R.jpg');

    return (
        <div className="view-container fade-in">
            <header className="app-header">
                <h1 className="title">Respuesta</h1>
            </header>

            <div className="card image-card">
                <img
                    src={`/assets/${answerFile}`}
                    alt="Respuesta"
                    className="riddle-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Respuesta+No+Encontrada";
                    }}
                />
            </div>

            <div className="status-display">
                {status === 'Correcto' && <span className="status-badge correct">¡Te salió!</span>}
                {status === 'Incorrecto' && <span className="status-badge incorrect">No te salió</span>}
                {!status && <span className="status-badge neutral">Sin responder</span>}
            </div>

            <div className="controls-area">
                <div className="answer-actions">
                    <button onClick={onMarkCorrect} className="btn btn-success">
                        ✓ Correcto
                    </button>
                    <button onClick={onMarkIncorrect} className="btn btn-danger">
                        ✕ Incorrecto
                    </button>
                </div>

                <button onClick={onBack} className="btn btn-secondary full-width mt-4">
                    Volver al Desafío
                </button>
            </div>
        </div>
    );
}
