import React from 'react';

export function Settings({
    mode, setMode,
    filters, applyFilters,
    isRandom, applyRandom,
    isTimerEnabled, setIsTimerEnabled,
    timerDuration, setTimerDuration,
    resetProgress,
    onClose
}) {

    const handleFilterChange = (key, value) => {
        applyFilters({ ...filters, [key]: value });
    };

    return (
        <div className="backdrop-overlay">
            <div className="settings-modal card">
                <div className="settings-header">
                    <h2>Configuración</h2>
                    <button onClick={onClose} className="btn-icon close-btn">✕</button>
                </div>

                <div className="settings-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                    {/* Filters Section */}
                    <div className="setting-group">
                        <label className="setting-label">Filtrar Desafíos</label>
                        <div className="flex-between mb-2">
                            <span>Categoría</span>
                            <select
                                className="input-field"
                                style={{ width: 'auto' }}
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="All">Todas</option>
                                <option value="C">Categoría C</option>
                                <option value="L">Categoría L</option>
                            </select>
                        </div>

                        <div className="flex-between">
                            <span>Solo Favoritos</span>
                            <div
                                className={`switch ${filters.onlyFavorites ? 'on' : 'off'}`}
                                onClick={() => handleFilterChange('onlyFavorites', !filters.onlyFavorites)}
                            >
                                <div className="switch-handle" />
                            </div>
                        </div>
                    </div>

                    {/* Random Mode */}
                    <div className="setting-group">
                        <div className="flex-between">
                            <label className="setting-label">Aleatorio sin repetir</label>
                            <div
                                className={`switch ${isRandom ? 'on' : 'off'}`}
                                onClick={() => applyRandom(!isRandom)}
                            >
                                <div className="switch-handle" />
                            </div>
                        </div>
                        <p className="text-xs text-muted mt-1">Baraja los desafíos disponibles.</p>
                    </div>

                    {/* Mode Selection */}
                    <div className="setting-group">
                        <label className="setting-label">Modo de Juego</label>
                        <div className="mode-toggle">
                            <label className={`mode-option ${mode === 'Normal' ? 'active normal' : ''}`}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="Normal"
                                    checked={mode === 'Normal'}
                                    onChange={() => setMode('Normal')}
                                />
                                <span>Normal</span>
                            </label>
                            <label className={`mode-option ${mode === 'Presentation' ? 'active presentation' : ''}`}>
                                <input
                                    type="radio"
                                    name="mode"
                                    value="Presentation"
                                    checked={mode === 'Presentation'}
                                    onChange={() => setMode('Presentation')}
                                />
                                <span>Presentación</span>
                            </label>
                        </div>
                    </div>

                    {/* Timer Settings */}
                    <div className="setting-group">
                        <div className="flex-between">
                            <label className="setting-label">Temporizador</label>
                            <div
                                className={`switch ${isTimerEnabled ? 'on' : 'off'}`}
                                onClick={() => setIsTimerEnabled(!isTimerEnabled)}
                            >
                                <div className="switch-handle" />
                            </div>
                        </div>

                        {isTimerEnabled && (
                            <div className="timer-input-container mt-2">
                                <label>Duración</label>
                                <div className="flex gap-2">
                                    {[30, 45, 60, 90].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setTimerDuration(val)}
                                            className={`btn-secondary ${timerDuration === val ? 'active' : ''}`}
                                            style={{ padding: '5px 10px', fontSize: '0.9rem', background: timerDuration === val ? '#e5e7eb' : 'white' }}
                                        >
                                            {val}s
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Danger Zone */}
                    <div className="setting-group danger-zone">
                        <button onClick={resetProgress} className="btn btn-danger full-width">
                            Reiniciar Todo el Progreso
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.6, fontSize: '0.8rem' }}>
                        <p>creado por TINO DIDÁCTICOS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
