import { useState, type ChangeEvent } from "react";
import type { ChordDto, searchObjDto, SongDto } from "../types";
import { searchSongs } from "../services/songService";
import ChordsDisplay from "../components/chordsDisplay";
import '../style/search.css'

//דף חיפוש לפי הרבה אופציות
function Search() {
    const [searchObj, setData] = useState<searchObjDto>({
        nameSong: '', nameArtist: '', chords: [], wordLine: '', chordsText: ''
    });
    const [songs, setSongs] = useState<SongDto[]>([]);
    const [isLoading, setIsLoading] = useState(false); // מצב טעינה

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData({ ...searchObj, [name]: value })
    }

    async function setSearch() {
        setIsLoading(true); // מתחילים לחפש
        try {
            const transChords: ChordDto[] = parseChordsString(searchObj.chordsText || '')
            // שימי לב: setData הוא אסינכרוני, אז נשלח לשרת אובייקט מעודכן ידנית
            const updatedSearchObj = { ...searchObj, chords: transChords };
            const songsFromServer = await searchSongs(updatedSearchObj);
            setSongs(songsFromServer);
        } catch (error) {
            console.error("חיפוש נכשל", error);
        } finally {
            setIsLoading(false); // סיימנו (גם אם נכשל)
        }
    }

    return (
        <>
            <div className="searchSection">
                <h1>חיפוש חכם</h1>
                <div className="searchForm">
                    <input type="text" placeholder="שם שיר" onChange={onChange} value={searchObj.nameSong} name="nameSong" />
                    <input type="text" placeholder="שם אמן" onChange={onChange} value={searchObj.nameArtist} name="nameArtist" />
                    <input type="text" placeholder="מילים מהשיר" onChange={onChange} value={searchObj.wordLine} name="wordLine" />
                    <input type="text" placeholder="אקורדים (מופרדים בפסיק)" onChange={onChange} value={searchObj.chordsText} name="chordsText" className="searchInput" />
                    <h5 >שים לב בחיפוש לפי אקורדים עלייך לכתוב אקורד בפורמט כזה לדוגמא A/m ז"א כל תוספת שהיא תהיה אחרי /</h5>
                    <h5 >בנוסף שים לב ש #/b הינם חלק מהאקורד הבסיסי ולכן יופיעו לפני ה/</h5>
                    <button onClick={setSearch} disabled={isLoading} className="searchBtn">
                        {isLoading ? <div className="spinner"></div> : "חפש שירים"}
                    </button>
                </div>
            </div>

            {/* תוצאות החיפוש - מחוץ לעיצוב של הקונטיינר למעלה */}
            {songs.length > 0 && <div className="box">
                <ChordsDisplay songs={songs} />
            </div>}
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