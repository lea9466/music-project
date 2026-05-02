import React, { useState, useRef, useEffect } from 'react';
import '../style/aestheticSongEditor.css';

const ROOTS_DATA: Record<string, string[]> = {
    "C Major / A Minor": ["C", "D", "E", "F", "G", "A", "B"],
    "C# Major / Bb Minor": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
    "Db Major / Bb Minor": ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    "D Major / B Minor": ["D", "E", "F#", "G", "A", "B", "C#"],
    "Eb Major / C Minor": ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    "E Major / C# Minor": ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "F Major / D Minor": ["F", "G", "A", "Bb", "C", "D", "E"],
    "F# Major / D# Minor": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "Gb Major / Eb Minor": ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
    "G Major / E Minor": ["G", "A", "B", "C", "D", "E", "F#"],
    "Ab Major / F Minor": ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    "A Major / F# Minor": ["A", "B", "C#", "D", "E", "F#", "G#"],
    "Bb Major / G Minor": ["Bb", "C", "D", "Eb", "F", "G", "A"],
    "B Major / G# Minor": ["B", "C#", "D#", "E", "F#", "G#", "A#"]
};

const ADDITIONS = ["m", "dim", "sus4", "7", "maj7", "6", "9", "aug"];

interface AestheticChordEditorProps {
    onUpdate?: (newLyrics: string) => void;
    initialValue?: string;
    selectedScale?: string;
}

export const AestheticSongEditor: React.FC<AestheticChordEditorProps> = ({
    onUpdate,
    initialValue = "",
    selectedScale = "C Major / A Minor"
}) => {
    const [lyrics, setLyrics] = useState<string>(initialValue);
    const [scale, setScale] = useState<string>(selectedScale);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // עדכון המצב הפנימי אם הפרופס משתנים מבחוץ
    useEffect(() => {
        setLyrics(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setScale(selectedScale);
    }, [selectedScale]);

    const availableRoots = ROOTS_DATA[scale] || ROOTS_DATA["C Major / A Minor"];

    // פונקציה מרכזית לעדכון הטקסט ושליחה ל-Parent
    const updateText = (newText: string) => {
        setLyrics(newText);
        if (onUpdate) onUpdate(newText);
    };

    const insertRootAtPos = (root: string, pos: number) => {
        const val = `[${root}]`;
        const newText = lyrics.substring(0, pos) + val + lyrics.substring(pos);
        updateText(newText);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(pos + val.length, pos + val.length);
            }
        }, 0);
    };

    const handleRootClick = (root: string) => {
        if (!textareaRef.current) return;
        insertRootAtPos(root, textareaRef.current.selectionStart);
    };

    const onDragStart = (e: React.DragEvent, root: string) => {
        e.dataTransfer.setData("chordRoot", root);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const root = e.dataTransfer.getData("chordRoot");
        if (!root || !textareaRef.current) return;

        const textarea = textareaRef.current;
        const dropPos = textarea.selectionStart;
        insertRootAtPos(root, dropPos);
    };

    const insertAddition = (ext: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const textBefore = lyrics.substring(0, start);
        let newText = "";
        let newPos = 0;

        if (textBefore.endsWith(']')) {
            const modifiedBefore = textBefore.slice(0, -1);
            const val = `/${ext}]`;
            newText = modifiedBefore + val + lyrics.substring(start);
            newPos = start + val.length - 1;
        } else {
            const val = `[/${ext}]`;
            newText = textBefore + val + lyrics.substring(start);
            newPos = start + val.length;
        }

        updateText(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const insertHeader = () => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const newText = lyrics.substring(0, start) + "\n# " + lyrics.substring(start);
        updateText(newText);
        setTimeout(() => textareaRef.current?.focus(), 0);
    };

    return (
        <div className="aes-editor-container">
            <div className="aes-editor-main">
                <div className="aes-header-actions">
                    <button type="button" onClick={insertHeader} className="aes-action-btn">
                        + כותרת מודגשת (#)
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    value={lyrics}
                    onChange={(e) => updateText(e.target.value)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    className="aes-textarea"
                    placeholder="גרור אקורדים לכאן או הקלד מילים..."
                    rows={15}
                />
            </div>

            <div className="aes-sidebar">
                <label className="aes-sidebar-title">בחר סולם לשיר:</label>
                <select
                    className="aes-select"
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
                >
                    {Object.keys(ROOTS_DATA).map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="aes-section">
                    <span className="aes-section-label">אקורד בסיס (גרירה/לחיצה):</span>
                    <div className="aes-grid">
                        {availableRoots.map(root => (
                            <button
                                key={root}
                                type="button"
                                draggable
                                onDragStart={(e) => onDragStart(e, root)}
                                onClick={() => handleRootClick(root)}
                                className="aes-root-btn"
                            >
                                {root}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="aes-section">
                    <span className="aes-section-label">תוספת (לחיצה בלבד):</span>
                    <div className="aes-grid">
                        {ADDITIONS.map(ext => (
                            <button key={ext} type="button" onClick={() => insertAddition(ext)} className="aes-ext-btn">
                                /{ext}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="aes-info-box">
                    <p>💡 <b>טיפ:</b> גרור אקורד בסיס למילה, ואז לחץ על תוספת כדי לקבל למשל [D/m].</p>
                </div>
            </div>
        </div>
    );
};