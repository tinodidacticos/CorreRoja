import React, { useEffect, useState } from 'react';

export function SplashScreen({ onFinish }) {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        // Check if already seen in this session
        if (sessionStorage.getItem('splashSeen')) {
            onFinish();
            return;
        }

        // Start fade out after 2s
        const timer1 = setTimeout(() => {
            setFading(true);
        }, 2000);

        // Remove component after 2.5s
        const timer2 = setTimeout(() => {
            sessionStorage.setItem('splashSeen', 'true');
            onFinish();
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fading ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <img src="/logo-corre-roja.png" alt="Corre Roja Logo" className="splash-logo" />
                <h1 className="splash-title">Corre Roja</h1>
                <p className="splash-credit">creado por TINO DIDÁCTICOS</p>
            </div>
        </div>
    );
}
