import React from 'react';
import guitarDb from '@tombatossals/chords-db/lib/guitar.json';
import '../style/guitarChord.css'
interface GuitarChordDisplayProps {
    chordName: string;
}

const GuitarChordDisplay: React.FC<GuitarChordDisplayProps> = ({ chordName }) => {
    
    const getChordData = () => {
        const root = chordName.charAt(0).toUpperCase() + (chordName[1] === '#' || chordName[1] === 'b' ? chordName[1] : '');
        let suffix = chordName.replace(root, '');
        
        if (suffix === '') suffix = 'major';
        if (suffix === 'm') suffix = 'minor';

        const keyData = (guitarDb.chords as any)[root];
        if (!keyData) return null;

        const variation = keyData.find((v: any) => v.suffix === suffix);
        return variation ? variation.positions[0] : null;
    };

    const data = getChordData();

    if (!data) return <div className="chord-error">אקורד {chordName} לא נמצא</div>;

    const stringSpacing = 20;
    const fretSpacing = 25;
    const xStart = 20;
    const yStart = 30;

    return (
        <div className="guitar-chord-card">
            <div className="chord-title">{chordName}</div>
            
            <svg width="150" height="170">
                {/* ציור סריגים */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                        key={`fret-${i}`}
                        className={`fret-line ${i === 0 && data.baseFret === 1 ? 'nut-line' : ''}`}
                        x1={xStart}
                        y1={yStart + i * fretSpacing}
                        x2={xStart + 5 * stringSpacing}
                        y2={yStart + i * fretSpacing}
                    />
                ))}

                {/* ציור מיתרים */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                        key={`string-${i}`}
                        className="string-line"
                        x1={xStart + i * stringSpacing}
                        y1={yStart}
                        x2={xStart + i * stringSpacing}
                        y2={yStart + 5 * fretSpacing}
                    />
                ))}

                {/* ציור בארה (Barre) - הפס של אקורד F ודומיו */}
                {data.barres && data.barres.map((barreFret: number, index: number) => {
                    const stringsWithFret = data.frets
                        .map((f: number, i: number) => f === barreFret ? i : -1)
                        .filter((i: number) => i !== -1);
                    
                    if (stringsWithFret.length > 1) {
                        const first = Math.min(...stringsWithFret);
                        const last = Math.max(...stringsWithFret);
                        return (
                            <rect
                                key={`barre-${index}`}
                                className="barre-rect"
                                x={xStart + first * stringSpacing - 8}
                                y={yStart + (barreFret - 0.8) * fretSpacing}
                                width={(last - first) * stringSpacing + 16}
                                height={15}
                                rx={7}
                            />
                        );
                    }
                    return null;
                })}

                {/* מספר סריג צדדי */}
                {data.baseFret > 1 && (
                    <text className="fret-number" x={xStart + 5 * stringSpacing + 7} y={yStart + 15}>
                        {data.baseFret}fr
                    </text>
                )}

                {/* ציור אצבעות, X ו-O */}
                {data.frets.map((fret: number, i: number) => {
                    const x = xStart + i * stringSpacing;
                    
                    if (fret === -1) {
                        return <text key={i} className="muted-string-x" x={x - 5} y={yStart - 10}>X</text>;
                    }
                    if (fret === 0) {
                        return <circle key={i} className="open-string-circle" cx={x} cy={yStart - 12} r={4} />;
                    }

                    // אם האצבע היא חלק מבארה, לא נצייר עיגול נפרד (הפס כבר מכסה)
                    const isPartOfBarre = data.barres && data.barres.includes(fret);
                    if (isPartOfBarre) return null;

                    return (
                        <g key={i}>
                            <circle className="finger-circle" cx={x} cy={yStart + (fret - 0.5) * fretSpacing} r={8} />
                            {data.fingers[i] > 0 && (
                                <text className="finger-text" x={x} y={yStart + (fret - 0.5) * fretSpacing + 4}>
                                    {data.fingers[i]}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default GuitarChordDisplay;