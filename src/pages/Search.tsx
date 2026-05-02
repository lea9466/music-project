import { useState, type ChangeEvent } from "react";
import type { ChordDto, searchObjDto, SongDto } from "../types";
import { searchSongs } from "../services/songService";
import ChordsDisplay from "../components/chordsDisplay";
import '../style/search.css'

function Search() {
    const [searchObj, setData] = useState<searchObjDto>({
        nameSong: '', nameArtist: '', chords: [], wordLine: '', chordsText: ''
    });
    const [songs, setSongs] = useState<SongDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...searchObj, [name]: value });
    };

    async function setSearch() {
        setIsLoading(true);
        try {
            const transChords: ChordDto[] = parseChordsString(searchObj.chordsText || '');
            const updatedSearchObj = { ...searchObj, chords: transChords };
            const songsFromServer = await searchSongs(updatedSearchObj);
            setSongs(songsFromServer);
        } catch (error) {
            console.error("חיפוש נכשל", error);
        } finally {
            setIsLoading(false);
        }
    }

    const quickSearches = [
        { song: 'תדבר איתו', artist: 'שמוליק סוכות', tag: 'חסידי' },
        { song: '', artist: 'אברהם פריד', tag: 'חסידי' },
        { song: 'יהי רצון', artist: 'שי וינר', tag: 'יבוא שלום' },
        { song: '', artist: 'מרדכי בן דוד', tag: 'חסידי' },
        { song: 'רואה אותי', artist: 'שמוליק סוכות', tag: 'תפילה' },
        { song: '', artist: 'יעקב שוואקי', tag: 'חרדי' },
    ];

    return (
        <div className="searchPage">
            <div className="searchHero">
                <h1>
                    <svg className="heroIcon" viewBox="0 0 24 24">
                        <path d="M9 18V5l12-2v13M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                    </svg>
                    חיפוש חכם
                </h1>
                <p>מצא שירים לפי שם, אמן, מילים או אקורדים</p>
            </div>

            {/* אזור 1: טופס החיפוש - שקוף */}
            <div className="formSection">
                <div className="fieldsGrid">
                    <div className="fieldGroup">
                        <label className="fieldLabel">שם שיר</label>
                        <input className="searchInput" type="text" placeholder="למשל: הילד הזה"
                            onChange={onChange} value={searchObj.nameSong} name="nameSong" />
                    </div>
                    <div className="fieldGroup">
                        <label className="fieldLabel">שם אמן</label>
                        <input className="searchInput" type="text" placeholder="למשל: אברהם פריד"
                            onChange={onChange} value={searchObj.nameArtist} name="nameArtist" />
                    </div>
                    <div className="fieldGroup fieldWide">
                        <label className="fieldLabel">מילים מהשיר</label>
                        <input className="searchInput" type="text" placeholder='למשל: "אנא בכח גדולת ימינך"'
                            onChange={onChange} value={searchObj.wordLine} name="wordLine" />
                    </div>
                    <div className="fieldGroup fieldWide">
                        <label className="fieldLabel">אקורדים (מופרדים בפסיק)</label>
                        <input className="searchInput chordsInput" type="text" placeholder="Am, G, C, Em"
                            onChange={onChange} value={searchObj.chordsText} name="chordsText" />
                    </div>
                    <div className="fieldGroup fieldWide">
                        <div className="chordNote">
                            פורמט: <code>A/m</code> = Am &nbsp;|&nbsp; <code>G/7</code> = G7 &nbsp;|&nbsp; סימני <code>#</code> ו-<code>b</code> מופיעים לפני ה-/
                        </div>
                    </div>
                </div>

                <div className="btnRow">
                    <button className="btnSearch" onClick={setSearch} disabled={isLoading}>
                        {isLoading ? <div className="spinner" /> : (
                            <>
                                <svg className="searchIcon" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                חיפוש שירים
                            </>
                        )}
                    </button>
                    <button className="btnClear"
                        onClick={() => setData({ nameSong: '', nameArtist: '', chords: [], wordLine: '', chordsText: '' })}>
                        נקה
                    </button>
                </div>
            </div>

            {/* אזור 2: דוגמאות / חיפושים מהירים - שקוף */}
            {/* <div className="examplesSection">
                <div className="quickTitle">חיפושים מהירים</div>
                <div className="quickGrid">
                    {quickSearches.map((q, i) => (
                        <div key={i} className="quickCard"
                            onClick={() => setData({ ...searchObj, nameSong: q.song, nameArtist: q.artist })}>
                            <span className="quickSong">{q.song || `כל שירי ${q.artist}`}</span>
                            <span className="quickArtist">{q.artist}</span>
                            <span className="quickTag">{q.tag}</span>
                        </div>
                    ))}
                </div>
            </div> */}

            {songs.length > 0 && (
                <div className="box">
                    <ChordsDisplay songs={songs} />
                </div>
            )}
        </div>
    );
}

export default Search;

export const parseChordsString = (chordsStr: string): ChordDto[] => {
    const chordParts = chordsStr.split(',')
        .map(part => part.trim())
        .filter(part => part.length > 0);
    return chordParts.map((part, index) => {
        const [name, adding] = part.split('/');
        return {
            name: name,
            adding: adding || "",
            indexInLine: index,
            lineNumber: 0
        };
    });
};