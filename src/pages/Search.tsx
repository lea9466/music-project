import { useState, type ChangeEvent } from "react";
import type { ChordDto, searchObjDto, SongDto } from "../types";
import { searchSongs } from "../services/songService";
import ChordsDisplay from "../components/chordsDisplay";
import { Chord } from "@tonaljs/tonal";

function Search() {

    const [searchObj, setData] = useState<searchObjDto>({
        nameSong: '', nameArtist: '', chords: [], wordLine: '', chordsText: ''
    });
    const [songs, setSongs] = useState<SongDto[]>([]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData({ ...searchObj, [name]: value })
    }

    async function setSearch() {

        const songsFromServer = await searchSongs(searchObj)
        setData({ ...searchObj, chords: parseChordsString(searchObj.chordsText || '') })
        setSongs(songsFromServer)
    }
    return (
        <>
            <h1>חיפוש חכם</h1>
            <input type="text" placeholder="חיפוש לפי שם" onChange={onChange} value={searchObj.nameSong} name="nameSong" />
            <input type="text" placeholder="מילים בשיר" onChange={onChange} value={searchObj.wordLine} name="wordLine" />
            <input type="text" placeholder="שם אמן" onChange={onChange} value={searchObj.nameArtist} name="nameArtist" />
            <input type="text" placeholder="אקורדים שים לב אם תכניס כמה אקורדים עליך להפרידם בפסיק" onChange={onChange} value={searchObj.chordsText} name="chordsText" />
            <button onClick={setSearch}>חפש</button>
            {songs.length > 0 && <ChordsDisplay songs={songs} />}
        </>
    )

}
export default Search

export const parseChordsString = (chordsStr: string): ChordDto[] => {
    const chordParts = chordsStr.split(',')
        .map(part => part.trim())
        .filter(part => part.length > 0);
    return chordParts.map((part, index) => {
        // מפרקים כל אקורד לפי הסלאש (Name/Adding)
        const [name, adding] = part.split('/');
        return {
            name: name, // השם של האקורד (למשל A)
            adding: adding || "", // התוספת (למשל m7), אם אין - מחרוזת ריקה
            indexInLine: index, // סתם אינדקס זמני כדי למלא את ה-DTO
            lineNumber: 0      // כנ"ל
        };
    });
};