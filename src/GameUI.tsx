import { useState, useEffect } from 'react';
import { useStore } from './store';
import './GameUI.css';

export function GameUI() {
    const currentObjective = useStore((state) => state.currentObjective);
    const showTutorial = useStore((state) => state.showTutorial);
    const setShowTutorial = useStore((state) => state.setShowTutorial);
    const isPaused = useStore((state) => state.isPaused);
    const togglePause = useStore((state) => state.togglePause);
    const restartGame = useStore((state) => state.restartGame);
    const startTime = useStore((state) => state.startTime);
    const isCompleted = currentObjective === 'completed';

    const [timeString, setTimeString] = useState("00:00");

    // Timer logic
    useEffect(() => {
        if (isPaused || isCompleted) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            setTimeString(`${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isPaused, isCompleted]);

    return (
        <div className="game-ui">
            {/* Top Bar: Controls */}
            <div className="top-bar">
                <div className="game-controls">
                    <button className="control-btn" onClick={togglePause}>
                        {isPaused ? '▶ Resume' : '⏸ Pause'}
                    </button>
                    <button className="control-btn" onClick={restartGame}>
                        🔄 Restart
                    </button>
                </div>
            </div>

            {/* Pause Overlay */}
            {isPaused && !showTutorial && !isCompleted && (
                <div className="pause-overlay">
                    <h1>PAUSED</h1>
                    <button className="resume-btn" onClick={togglePause}>Resume Game</button>
                </div>
            )}

            {/* Tutorial / Help Overlay */}
            {showTutorial && !isCompleted && (
                <div className="tutorial-overlay">
                    <div className="tutorial-box">
                        <h2>🚑 VR Rescue Training</h2>
                        <p className="tutorial-intro">Learn how to respond to a street accident emergency.</p>

                        <div className="controls-grid">
                            <div className="control-section">
                                <h3>🎮 Controls</h3>
                                <p><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Move</p>
                                <p><kbd>Mouse</kbd> Look</p>
                                <p><kbd>Click</kbd> Interact</p>
                                <p><kbd>C</kbd> Call EMS</p>
                            </div>
                            <div className="control-section">
                                <h3>📋 Objectives</h3>
                                <p>Look at the <b>billboard on the building</b> for your tasks.</p>
                                <p>Complete all tasks to save the victim.</p>
                            </div>
                        </div>
                        <button className="close-tutorial" onClick={() => setShowTutorial(false)}>
                            Start Training
                        </button>
                    </div>
                </div>
            )}

            {/* Victory Screen */}
            {isCompleted && (
                <div className="victory-overlay">
                    <div className="victory-box">
                        <h1>🎉 Mission Complete! 🎉</h1>
                        <p>You successfully rescued the injured person!</p>
                        <div className="victory-stats">
                            <div className="stat">
                                <span className="stat-label">Time Taken</span>
                                <span className="stat-value">{timeString}</span>
                            </div>
                        </div>
                        <button className="replay-button" onClick={restartGame}>
                            Play Again
                        </button>
                    </div>
                </div>
            )}

            {/* Help Toggle */}
            {!showTutorial && !isCompleted && !isPaused && (
                <button className="help-button" onClick={() => setShowTutorial(true)}>
                    ?
                </button>
            )}
        </div>
    );
}
