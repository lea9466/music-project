import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { ChordDto, FullSongDto, GeminiSongResponse, SongDto, WordLineDto } from "../types";
import '../style/songController.css'
import { addSong, updateSong } from "../services/songService";
import ChordsDiv from "../components/chordsDiv";
import { AIScan } from "../services/AIService";
import { useLocation } from 'react-router-dom';

function SongController() {
    const [isAIScaning, setAIScaning] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user);
    if (user.role == 0 || user.role == 'Regular')
        return <>אינך מורשה לגשת לדף זה</>
    const categories = useSelector((state: RootState) => state.categories.categories);
    const location = useLocation();
    const [data, setData] = useState<SongDto>(location.state || {
        name: '',
        artist: '',
        utubLink: '',
        language: '',
        majorOrMinor: '',
        categoryId: 0,
        userId: user.id,
        sourceText: ''
    });
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const types = ["Major", "Minor"];
    const allKeys = notes.flatMap(note => types.map(type => `${note} ${type}`));

    async function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const arrs = scanText(data.sourceText)
            const newFullSong: FullSongDto = { song: data, wordLines: arrs.wordLines, chords: arrs.chordsLines }
            debugger
            if (data.id) {
                const upSong = await updateSong(newFullSong)
                alert('השיר עודכן בהצלחה')
            }
            else {
                const newSong = await addSong(newFullSong)
                alert('השיר נשמר בהצלחה')
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData({ ...data, [name]: value })
    }

    return (
        <><div className="formAndScan">
            {isAIScaning && <div className="vewChords"><AIScaning songText={data.sourceText} song={data} /></div>}
            <form onSubmit={onSubmit} autoComplete="off" className="addSong"
                style={{ width: `${isAIScaning ? '30%' : '50%'}` }}>
                <h1>הוספה/עדכון שיר</h1>
                <div className="inputsDiv">
                    <input name="name" type="text" placeholder="שם שיר" value={data.name} onChange={onChange} />
                    <input name="artist" type="text" placeholder="אומן/מבצע" value={data.artist} onChange={onChange} />
                    <input name="utubLink" type="text" placeholder="קישור ליוטיוב" value={data.utubLink} onChange={onChange} />
                </div>
                <div className="inputsDiv">
                    {/* <input name="language" type="text" placeholder="שפה" value={data.language} onChange={onChange} /> */}
                    <select
                        value={data.language}
                        onChange={(e) => setData({ ...data, language: e.target.value })}
                    >
                        <option value='' disabled hidden>בחר שפה</option>
                        <option value="H">עברית</option>
                        <option value="E">אנגלית</option>
                        <option value="O">אחר</option>
                    </select>
                    <select
                        value={data.majorOrMinor}
                        onChange={(e) => setData({ ...data, majorOrMinor: e.target.value })}
                    >
                        <option value='' disabled hidden>בחר סולם</option>
                        {allKeys.map((n, index) => (
                            <option key={index} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                    <select name="categoryId"
                        value={data.categoryId}
                        onChange={(e) => setData({ ...data, categoryId: Number(e.target.value) })}>
                        <option value={0} disabled hidden>בחר קטגוריה</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="points">
                    <h3>שים לב חשוב מאד!</h3>
                    <span>כותרת שברצונך שתהיה מודגשת עלייך להכניס עם # בתחילה</span><br />
                    <span>שורה שהיא מילים של שיר הכנס בצורה רגילה</span><br />
                    <span>אקורד עלייך להכניס בפורמט כזה: לדוגמא [A]</span><br />
                    <span>אם ברצונך להכניס אקורד עם תוספת עלייך להכניסו כך: [A/m7]</span><br />
                </div>
                <textarea className="songText"
                    value={data.sourceText}
                    onChange={(e) => setData({ ...data, sourceText: e.target.value })} >

                </textarea>
                <div className="formBtns">
                    <button>שמור</button>
                    <button type="button" onClick={() => { setAIScaning(true) }}>סריקת AI</button>
                </div>

            </form>

        </div>



        </>
    )
}
export default SongController

type Props = {
    songText: string,
    song: SongDto
}

function AIScaning(props: Props) {
    const hasFetched = useRef(false);
    const [result, setResult] = useState<GeminiSongResponse | null>(null);
    const [tranChordsFromAI, setTranChordsFromAI] = useState<Record<number, ChordDto[]> | undefined>([]);
    const { newFullSongToFront, newFullSongToServer } = useMemo(() => {
        const arrs = scanText(props.songText);
        const chordsByLine = transformChordsToRecord(arrs.chordsLines);

        return {
            newFullSongToFront: {
                song: props.song,
                wordLines: arrs.wordLines,
                chordsByLine: chordsByLine
            },
            newFullSongToServer: {
                song: props.song,
                wordLines: arrs.wordLines,
                chords: arrs.chordsLines
            }
        };
    }, [props.songText, props.song]);

    useEffect(() => {
        if (hasFetched.current) return;
        const loadAI = async () => {
            try {
                hasFetched.current = true;
                console.log("Sending to AI:", JSON.stringify(newFullSongToServer));
                const message = await AIScan(newFullSongToServer);
                setResult(message);
                let transChords = transformChordsToRecord(message.Chords || [])
                setTranChordsFromAI(transChords)
            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
                hasFetched.current = false;
            }
        };

        loadAI();
    }, [newFullSongToServer]);

    // 3. תצוגת טעינה
    if (!result) {
        return (
            <div className="loading-container">
                <p>מנתח את השיר ומבצע אופטימיזציה ב-AI...</p>
            </div>
        );
    }

    return (
        <>
            <ChordsDiv fullSong={newFullSongToFront} isFromScaning={true} chordsFromAI={tranChordsFromAI} />
        </>
    );
}

const scanText = (text: string) => {
    const lines = text.split('\n');
    let index = 0;
    const wordLines: WordLineDto[] = []
    let chordsLines: ChordDto[] = []
    lines.forEach((line) => {

        if (!line.includes('[') && line != '') {
            index++
            const wordLine: WordLineDto = { lineNumber: index, text: line }
            wordLines.push(wordLine)
        }
        else {
            if (line != '') {
                index++
                const arr: ChordDto[] = makeChords(line, index)
                chordsLines = [...chordsLines, ...arr]
            }
        }
    });
    debugger
    return { wordLines, chordsLines }
};

function makeChords(line: string, lineNumber: number) {
    const chordsLines: ChordDto[] = []
    let spaces = 0
    let count = 0
    let end = 0
    let adding = ''
    for (let index = 0; index < line.length; index++) {
        if (line[index] == '[') {
            spaces = index - end
            count++
            end = line.indexOf(']', index + 1)
            let ch = line.slice(index + 1, end)
            if (ch.indexOf('/') != -1) {
                let supperd = ch.split('/');
                ch = supperd[0]
                adding = supperd[1]
            }
            const chord: ChordDto = { name: ch, indexInLine: count, spaces: spaces, lineNumber: lineNumber, adding: adding }
            chordsLines.push(chord)
            index = end
            adding = ''
        }
    }
    return chordsLines
}
function transformChordsToRecord(chords: ChordDto[]): Record<number, ChordDto[]> {
    return chords.reduce((acc, chord) => {
        const lineNum = chord.lineNumber;

        // אם השורה עדיין לא קיימת בתוך האובייקט, ניצור לה מערך ריק
        if (!acc[lineNum]) {
            acc[lineNum] = [];
        }

        // נוסיף את האקורד למערך של השורה המתאימה
        acc[lineNum].push(chord);

        // נמיין את האקורדים בתוך השורה לפי Spaces (המיקום שלהם בשורה)
        // כך שהם יופיעו לפי הסדר משמאל לימין (או ימין לשמאל)
        acc[lineNum].sort((a, b) => a.indexInLine - b.indexInLine);
        return acc;
    }, {} as Record<number, ChordDto[]>);
};