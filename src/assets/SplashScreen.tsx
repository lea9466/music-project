import { useEffect, useState } from 'react';
import '../style/splashScreen.css';

function SplashScreen({ onDone }: { onDone: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onDone, 2200); // נעלם אחרי 3 שניות
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="splash">
            <div className="ripple" /><div className="ripple" /><div className="ripple" />
            <div className="logo-wrap">
                <div className="logo-text">
                    {'Harmonia'.split('').map((l, i) => (
                        <span key={i} style={{ animationDelay: `${i * 0.3}s` }}>{l}</span>
                    ))}
                </div>
                <p className="subtitle">אקורדים · מוזיקה · קהילה</p>
            </div>
            <div className="bars">
                {[18,28,36,24,32,20,28].map((h, i) => (
                    <div key={i} className="bar" style={{ height: h, animationDelay: `${i * 0.6}s` }} />
                ))}
            </div>
        </div>
    );
}

export default SplashScreen;