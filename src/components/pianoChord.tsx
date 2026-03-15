import { Chord } from "@tonaljs/tonal";
import "../style/PianoChord.css";

interface PianoChordProps {
  chordName: string;
}

function PianoChord({ chordName }: PianoChordProps) {
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
    { note: "C#", x: 6.5 },  // המיקומים עודכנו בהתאם לרוחב החדש
    { note: "D#", x: 16.5 },
    { note: "F#", x: 36.5 },
    { note: "G#", x: 46.5 },
    { note: "A#", x: 56.5 },
  ];

  return (
    <div className="piano-card">
      <h3 className="chord-title">{chordName}</h3>

      <svg className="piano-svg" width="100%" height="90" viewBox="0 -3 72 50">
        {/* קלידים לבנים - צרים יותר (8.5 במקום 10) */}
        {whiteKeys.map((note, i) => {
          const activeName = getActiveNoteName(note);
          return (
            <g key={`white-${note}`}>
              <rect
                className="white-key"
                x={i * 10} y="0"
                width="10" height="40"
                fill={activeName ? "var(--active-key-color)" : "var(--inactive-key-color)"}
                rx="1" // עיגול פינות עדין
              />
              {activeName && (
                <text
                  x={i * 10 + 4.25}
                  y="34"
                  fill="var(--key-text-white)"
                  textAnchor="middle"
                  fontSize="5"
                  style={{ fontWeight: 'bold', fontFamily: 'Arial' }}
                >
                  {activeName}
                </text>
              )}
            </g>
          );
        })}

        {/* קלידים שחורים - דקים יותר (4.5 במקום 6) */}
        {blackKeys.map((k) => {
          const activeName = getActiveNoteName(k.note);
          return (
            <g key={`black-${k.note}`}>
              <rect
                className="black-key"
                x={k.x} y="0"
                width="5" height="27"
                fill={activeName ? "var(--active-black-key-color)" : "var(--inactive-black-key-color)"}
                rx="0.8"
              />
              {activeName && (
                <text
                  x={k.x + 2.5}
                  y="16"
                  fill="var(--key-text-black)"
                  textAnchor="middle"
                  fontSize="3.5"
                  style={{ fontWeight: '900', fontFamily: 'Arial' }}
                >
                  {activeName.replace("b", "♭")}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default PianoChord;