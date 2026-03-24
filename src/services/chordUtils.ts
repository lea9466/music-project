export function normalizeChordName(chordName: string): string {
  const flatToSharp: Record<string, string> = {
    "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#"
  };
  const match = chordName.match(/^([A-G]b?)(.*)$/);
  if (!match) return chordName;
  const [, root, suffix] = match;
  return `${flatToSharp[root] ?? root}${suffix}`;
}

export function enharmonicNormalize(note: string): string {
  const map: Record<string, string> = {
    "B#": "C", "E#": "F", "Cb": "B", "Fb": "E",
    "F##": "G", "C##": "D", "G##": "A", "D##": "E", "A##": "B",
  };
  return map[note] ?? note;
}