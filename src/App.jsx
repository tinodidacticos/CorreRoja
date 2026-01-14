import React, { useState, useEffect } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { RiddleView } from './components/RiddleView';
import { AnswerView } from './components/AnswerView';
import { Settings } from './components/Settings';
import { GridIndex } from './components/GridIndex';
import { SplashScreen } from './components/SplashScreen';

function App() {
  const {
    currentRiddle,
    currentDeckIndex,
    totalVisible,
    visibleRiddles,
    userState,
    mode, setMode,
    filters, applyFilters,
    isRandom, applyRandom,
    isTimerEnabled, setIsTimerEnabled,
    timerDuration, setTimerDuration,
    setStatus,
    toggleFavorite,
    goToNext,
    goToPrev,
    goToRiddleId,
    resetProgress
  } = useGameLogic();

  const [view, setView] = useState('riddle'); // 'riddle', 'answer', 'index'
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Deep Linking & Initial Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedId = params.get('id');
    if (linkedId) {
      // Attempt to go to this riddle
      // We might need to wait for riddles to load? 
      // The hook loads riddles async. 
      // For simplicity, we'll try it once riddles are ready.
      // But useGameLogic doesn't expose 'loading'.
      // We can assume if visibleRiddles > 0 we can try.
    }
  }, []);

  // Effect to handle deep list when data is ready
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkedId = params.get('id');
    if (linkedId && visibleRiddles.length > 0) {
      if (goToRiddleId(linkedId)) {
        // Clean URL so refresh doesn't stick
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, [visibleRiddles]); // Only retry when riddles change (load)

  const handleFinishSplash = () => {
    setShowSplash(false);
  };

  const handleOpenAnswer = () => setView('answer');
  const handleBackToRiddle = () => setView('riddle');

  const handleSelectFromGrid = (id) => {
    goToRiddleId(id);
    setView('riddle');
  };

  // Wrapper for next/prev to ensure view reset
  const handleNext = () => {
    setView('riddle');
    goToNext();
  };

  const handlePrev = () => {
    setView('riddle');
    goToPrev();
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleFinishSplash} />;
  }

  if (!currentRiddle) {
    return (
      <div className="loading-screen" style={{ height: '100vh', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p>{visibleRiddles.length === 0 ? "No hay desafíos con estos filtros." : "Cargando..."}</p>

        {visibleRiddles.length === 0 && (
          <button
            onClick={() => applyFilters({ category: 'All', onlyFavorites: false })}
            className="btn btn-secondary mt-4"
          >
            Limpiar Filtros
          </button>
        )}

        {/* Fallback Reset if stuck */}
        <button
          onClick={() => { resetProgress(); window.location.reload(); }}
          className="btn btn-secondary mt-8 text-sm opacity-70"
        >
          ¿Se quedó pegado? Toca aquí
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {view === 'index' && (
        <GridIndex
          riddles={visibleRiddles}
          userState={userState}
          onSelect={handleSelectFromGrid}
          onClose={() => setView('riddle')}
        />
      )}

      {view === 'riddle' && (
        <RiddleView
          riddle={currentRiddle}
          index={currentDeckIndex}
          total={totalVisible}
          mode={mode}
          isTimerEnabled={isTimerEnabled}
          duration={timerDuration}
          userStateItem={userState[currentRiddle.id]}
          onNext={handleNext}
          onPrev={handlePrev}
          onOpenAnswer={handleOpenAnswer}
          onOpenSettings={() => setShowSettings(true)}
          onOpenIndex={() => setView('index')}
          onToggleFavorite={toggleFavorite}
          onSetStatus={setStatus}
        />
      )}

      {view === 'answer' && (
        <AnswerView
          riddle={currentRiddle.id} // AnswerView expects ID string based on previous impl? Check RiddleView logic. 
          // Previous impl: AnswerView { riddle } -> riddle was "C1.jpg"
          // Current logic: currentRiddle is Object { id, category }
          // So passing currentRiddle.id
          status={userState[currentRiddle.id]?.status === 1 ? 'Correcto' : (userState[currentRiddle.id]?.status === 2 ? 'Incorrecto' : null)}
          onMarkCorrect={() => setStatus(currentRiddle.id, 1)}
          onMarkIncorrect={() => setStatus(currentRiddle.id, 2)}
          onBack={handleBackToRiddle}
        />
      )}

      {showSettings && (
        <Settings
          mode={mode}
          setMode={setMode}
          filters={filters}
          applyFilters={applyFilters}
          isRandom={isRandom}
          applyRandom={applyRandom}
          isTimerEnabled={isTimerEnabled}
          setIsTimerEnabled={setIsTimerEnabled}
          timerDuration={timerDuration}
          setTimerDuration={setTimerDuration}
          resetProgress={() => {
            resetProgress();
            setShowSettings(false);
            setView('riddle');
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
