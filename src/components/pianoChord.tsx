import { Chord } from "@tonaljs/tonal";
import "../style/PianoChord.css";

interface PianoChordProps {
  chordName: string;
}

export default function PianoChord({ chordName }: PianoChordProps) {
  const chordData = Chord.get(chordName);
  const notes = chordData.notes;

  function getActiveNoteName(keyNote: string) {
    const synonyms: Record<string, string> = {
      "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb",
      "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#"
    };
    return notes.find(chordNote => chordNote === keyNote || synonyms[chordNote] === keyNote);
  }

  const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
  const blackKeys = [
    { note: "C#", x: 7 },
    { note: "D#", x: 17 },
    { note: "F#", x: 37 },
    { note: "G#", x: 47 },
    { note: "A#", x: 57 },
  ];

  return (
    <div className="piano-card">
      <h3 className="chord-title">{chordName}</h3>

      {/* הגודל של הציור*/}
      <svg width="200" height="100" viewBox="0 0 70 40">
        {/* קלידים לבנים */}
        {whiteKeys.map((note, i) => {
          const activeName = getActiveNoteName(note);
          return (
            <g key={`white-${note}`}>
              <rect
                className="white-key"
                x={i * 10} y="0" width="10" height="40"
                fill={activeName ? "var(--active-key-color)" : "var(--inactive-key-color)"}
                rx="1"
              />
              {activeName && (
                <text
                  x={i * 10 + 5}
                  y="32" /* מיקום האות בלבן */
                  fill="var(--key-text-white)"
                  textAnchor="middle"
                  fontSize="5.5" /* הגדלתי את האות בלבן */
                  style={{ fontWeight: 'bold', fontFamily: 'Arial' }}
                >
                  {activeName}
                </text>
              )}
            </g>
          );
        })}

        {/* קלידים שחורים */}
        {blackKeys.map((k) => {
          const activeName = getActiveNoteName(k.note);
          return (
            <g key={`black-${k.note}`}>
              <rect
                className="black-key"
                x={k.x} y="0" width="6" height="25"
                fill={activeName ? "var(--active-black-key-color)" : "var(--inactive-black-key-color)"}
                rx="0.5"
              />
              {activeName && (
                <text
                  x={k.x + 3}
                  y="16" /* מיקום האות בשחור - גבוה יותר כדי שיהיה מקום */
                  fill="var(--key-text-black)"
                  textAnchor="middle"
                  fontSize="4" /* האות בשחור עכשיו כמעט ברוחב כל הקליד! */
                  style={{ fontWeight: '900', fontFamily: 'Arial' }}
                >
                  {activeName.replace("b", "♭")}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* <div className="notes-display">
        {notes.join(" • ")}
      </div> */}
    </div>
  );
}