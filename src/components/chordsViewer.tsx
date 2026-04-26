import { useState } from "react";
import type { ChordDto } from "../types";
import PianoChord from "./pianoChord";
import ToggleButtons from "./toggleButton";
import '../style/chordsViewer.css'
import GuitarChords from "./guitarChord";

type ChordsViewerProps = {
    // המילון שמגיע מהשרת (מפתח: מספר שורה, ערך: מערך אקורדים)
    chordsByLine: Record<number, ChordDto[]>;
    ton: number
    useFlats: boolean
}


//תצוגה ויזואלית של אקורדים לאורגנית ופסנתר
export default function ChordsViewer({ chordsByLine, ton, useFlats }: ChordsViewerProps) {
    const sharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    const [activeTab, setActiveTab] = useState<string>("piano");
    const btns = [
        { str: "גיטרה", icon: "" },
        { str: "פסנתר", icon: "piano" },
    ];

    const kind = useFlats ? flats : sharps;

    // 1. איסוף וחישוב מחדש של כל אקורד בנפרד (בלי לדרוס את המקור!)
    const allChords = Object.values(chordsByLine || {}).flat();

    const translatedChords = allChords.map(ch => {
        // נמצא את המיקום המקורי (נחפש גם בבמולים וגם בדיאזים ליתר ביטחון)
        let originalIndex = sharps.indexOf(ch.name);
        if (originalIndex === -1) originalIndex = flats.indexOf(ch.name);

        if (originalIndex === -1) return ""; // אם לא מצאנו, נחזיר ריק

        // חישוב המיקום החדש לפי הטרנספוזיציה
        const newIndex = ((originalIndex + ton) % 12 + 12) % 12;
        const newName = kind[newIndex];

        // נחזיר את השם המלא (שם + תוספת כמו m, 7, sus4 וכו')
        return `${newName}${ch.adding || ""}`;
    });

    // 2. יצירת רשימה ייחודית מהשמות המלאים
    const uniqueChords = Array.from(new Set(translatedChords)).filter(c => c !== "");

    return (
        <div className="chords-viewer-container" >
            <ToggleButtons btns={btns} activeTab={activeTab} onSet={setActiveTab} />

            <div className="chords-grid">
                {uniqueChords.map((fullChordName) => (
                    activeTab === "piano" ? (
                        <PianoChord key={fullChordName} chordName={fullChordName} />
                    ) : (
                        <GuitarChords key={fullChordName} chordName={fullChordName} />
                    )
                ))}
            </div>
        </div>
    );
}