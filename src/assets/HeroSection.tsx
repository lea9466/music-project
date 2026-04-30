import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/heroSection.css';

function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight || 480;

        const NUM = 6;
        const strings = Array.from({ length: NUM }, (_, i) => ({
            y: (i + 1) * (canvas.height / (NUM + 1)),
            amp: 0, wave: 0,
            speed: 0.018 + i * 0.003,
            color: `hsla(${260 + i * 12}, 70%, 70%, 0.18)`
        }));

        const pluck = (s: typeof strings[0]) => { s.amp = 18 + Math.random() * 10; };
        strings.forEach((s, i) => setTimeout(() => pluck(s), 800 + i * 220));
        const interval = setInterval(() => pluck(strings[Math.floor(Math.random() * NUM)]), 2200);

        let raf: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            strings.forEach(s => {
                s.wave += s.speed;
                s.amp *= 0.985;
                ctx.beginPath();
                ctx.strokeStyle = s.color;
                ctx.lineWidth = 1;
                for (let x = 0; x <= canvas.width; x += 2) {
                    const prog = x / canvas.width;
                    const y = s.y + Math.sin(prog * Math.PI * 3 + s.wave) * s.amp * Math.sin(prog * Math.PI);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); clearInterval(interval); };
    }, []);

    const chords = ['Am', 'C', 'G', 'Em', 'F', 'Dm', 'E'];

    return (
        <div className="hero">
            <canvas ref={canvasRef} className="hero-canvas" />
            <div className="hero-content">
                <h1 className="hero-title">Harmonia</h1>
                <p className="hero-tagline">מוזיקה · אקורדים · קהילה</p>
                <div className="chord-bubbles">
                    {chords.map((c, i) => (
                        <div key={c} className="chord-bubble" style={{ animationDelay: `${0.6 + i * 0.12}s` }}>{c}</div>
                    ))}
                </div>
                <button className="hero-cta" onClick={() => navigate('categories')}>התחילו לנגן ←</button>
            </div>
        </div>
    );
}
export default HeroSection;