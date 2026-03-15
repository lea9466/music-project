import { useState } from "react";
import type { ChordDto } from "../types";
import PianoChord from "./pianoChord";
import GuitarChord from "./GuitarChord";
import ToggleButtons from "./toggleButton";
import '../style/chordsViewer.css'

interface ChordsViewerProps {
    // המילון שמגיע מהשרת (מפתח: מספר שורה, ערך: מערך אקורדים)
    chordsByLine: Record<number, ChordDto[]>;
}

export default function ChordsViewer({ chordsByLine }: ChordsViewerProps) {

    const [activeTab, setActiveTab] = useState<string>("piano");
    const btns = [
        { str: "גיטרה", icon: "" },
        { str: "פסנתר", icon: "piano" },
    ];



    // 1. איסוף כל האקורדים מכל השורות למערך אחד שטוח
    const allChords = Object.values(chordsByLine || {}).flat();

    // 2. סינון כפילים ובניית מחרוזת אקורד (שם + תוספת)
    const uniqueChords = Array.from(
        new Set(allChords.map((c) => (c.name || "") + (c.adding || "")))
    ).filter((name) => name !== ""); // מוודא שלא נכנסו אקורדים ריקים

    return (
        <div className="chords-viewer-container">
            <ToggleButtons btns={btns} activeTab={activeTab} onSet={setActiveTab} />
            <div className="chords-grid">
                {activeTab == "piano" &&
                    uniqueChords.map((chordStr, index) => (
                        <PianoChord key={index} chordName={chordStr} />
                    ))
                }
                {activeTab == "" &&
                    uniqueChords.map((chordStr, index) => (
                        <GuitarChord key={index} chordName={chordStr} />
                    ))
                }

            </div>
        </div>
    );
}