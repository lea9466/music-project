import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { ChordDto, FullSongDto, GeminiSongResponse, SongDto, WordLineDto } from "../types";
import '../style/songController.css';
import { addSong, updateSong } from "../services/songService";
import ChordsDiv from "../components/chordsDiv";
import { AIScan } from "../services/AIService";
import { useLocation } from 'react-router-dom';
import { setCategories } from "../redux/categoreis/categorieSlice";
import { getCategories } from "../services/categoryService";
import { AestheticSongEditor } from "../components/aestheticSongEditor";
import { toast } from "react-toastify";
import guideVideo from '../assets/guide-video.mp4'; // שנה לנתיב האמיתי

function SongController() {
    const [isAIScaning, setAIScaning] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null); // Ref לנגן הוידאו
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

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
        sourceText: '',
        tips: '',
        credit: ''
    });

    // פונקציה לקביעת מהירות הניגון ל-1.5
    const onVideoLoad = () => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.5;
        }
    };

    if (user.role == 0 || user.role == 'Regular')
        return <>אינך מורשה לגשת לדף זה</>;

    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const types = ["Major", "Minor"];
    const allKeys = notes.flatMap(note => types.map(type => `${note} ${type}`));

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        setIsLoading(true);
        event.preventDefault();
        try {
            const arrs = scanText(data.sourceText);
            const newFullSong: FullSongDto = { song: data, wordLines: arrs.wordLines, chords: arrs.chordsLines };
            if (data.name === '' || data.artist === '' || data.language === '' || data.categoryId === 0 || data.sourceText === '') {
                toast.error("חסר פרטים");
                setIsLoading(false);
                return;
            }
            if (data.id) {
                await updateSong(newFullSong);
                dispatch(setCategories(await getCategories()));
                toast.success('השיר עודכן בהצלחה');
            } else {
                await addSong(newFullSong);
                toast.success('השיר נשמר בהצלחה');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const updateDataDirectly = (newData: Partial<SongDto>) => {
        setData(prev => ({ ...prev, ...newData }));
    };

    useEffect(() => {
        const loadData = async () => {
            if (categories.length === 0) {
                try {
                    const categoryData = await getCategories();
                    dispatch(setCategories(categoryData));
                } catch (err) {
                    console.error("שגיאה בקריאת הנתונים:", err);
                }
            }
        };
        loadData();
    }, [dispatch, categories.length]);

    return (
        <div className="formAndScan">
            <form onSubmit={onSubmit} autoComplete="off" className="addSong"
                style={{
                    width: isAIScaning ? '50%' : '100%',
                    maxWidth: isAIScaning ? 'none' : '100%'
                }}>

                <h1>הוספה/עדכון שיר</h1>

                {/* כפתור המדריך */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        type="button"
                        className="demo-button"
                        onClick={() => setIsVideoModalOpen(true)}
                    >
                        🎥 צפה במדריך להוספה (1.5x)
                    </button>
                </div>

                <div className="inputsDiv">
                    <input name="name" type="text" placeholder="שם שיר" value={data.name} onChange={onChange} />
                    <input name="artist" type="text" placeholder="אומן/מבצע" value={data.artist} onChange={onChange} />
                    <input name="utubLink" type="text" placeholder="קישור ליוטיוב" value={data.utubLink} onChange={onChange} />
                </div>

                <div className="inputsDiv">
                    <select value={data.language} onChange={(e) => setData({ ...data, language: e.target.value })}>
                        <option value='' disabled hidden>בחר שפה</option>
                        <option value="H">עברית</option>
                        <option value="E">אנגלית</option>
                        <option value="O">אחר</option>
                    </select>

                    <select value={data.majorOrMinor} onChange={(e) => setData({ ...data, majorOrMinor: e.target.value })}>
                        <option value='' disabled hidden>בחר סולם</option>
                        {allKeys.map((n, index) => (
                            <option key={index} value={n}>{n}</option>
                        ))}
                    </select>

                    <select name="categoryId" value={data.categoryId}
                        onChange={(e) => setData({ ...data, categoryId: Number(e.target.value) })}>
                        <option value={0} disabled hidden>בחר קטגוריה</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* מודל הסרטון שלך */}
                {isVideoModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsVideoModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="close-button" onClick={() => setIsVideoModalOpen(false)}>&times;</button>
                            <div className="video-container">
                                <video
                                    ref={videoRef}
                                    controls
                                    autoPlay
                                    onCanPlay={onVideoLoad}
                                    style={{ width: '100%', borderRadius: '8px' }}
                                >
                                    <source src={guideVideo} type="video/mp4" />
                                    הדפדפן שלך לא תומך בנגן הוידאו.
                                </video>
                            </div>
                        </div>
                    </div>
                )}

                <div className="points">
                    <h3>שים לב חשוב מאד!</h3>
                    <div>כותרת שברצונך שתהיה מודגשת עלייך להכניס עם # בתחילה</div>
                    <div>שורה שהיא מילים של שיר הכנס בצורה רגילה</div>
                    <div>אקורד עלייך להכניס בפורמט כזה: לדוגמא [A]</div>
                    <div>אם ברצונך להכניס אקורד עם תוספת עלייך להכניסו כך: [A/m7]</div>
                </div>

                <AestheticSongEditor
                    initialValue={data.sourceText}
                    onUpdate={(val) => setData({ ...data, sourceText: val })}
                    selectedScale={data.majorOrMinor}
                />

                <input name="credit" type="text" placeholder="קרדיט" value={data.credit} onChange={onChange} />

                <div className="titlle-logo">
                    <h3>טיפים לנגינת השיר מ- Gemini</h3>
                    <img width="25" height="25" src="https://img.icons8.com/3d-fluency/94/gemini-ai.png" alt="gemini-ai" />
                </div>

                <textarea className="tips"
                    value={data.tips}
                    onChange={(e) => setData({ ...data, tips: e.target.value })}
                    placeholder="הטיפים של ה-AI יופיעו כאן..."
                />

                <div className="formBtns">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <div className="spinner" /> : <>שמור</>}
                    </button>
                    <button type="button" onClick={() => { setAIScaning(true) }}>
                        <div className="titlle-logo" style={{ margin: 0, gap: '8px' }}>
                            <h4>סריקת AI</h4>
                            <img width="22" height="22" src="https://img.icons8.com/3d-fluency/94/gemini-ai.png" alt="gemini-ai" />
                        </div>
                    </button>
                </div>
            </form>

            {isAIScaning && (
                <div className="vewChords">
                    <AIScaning songText={data.sourceText} song={data} setTips={updateDataDirectly} />
                </div>
            )}
        </div>
    );
}

// פונקציות העזר נשמרו ללא שינוי
const scanText = (text: string) => {
    const lines = text.split('\n');
    let index = 0;
    const wordLines: WordLineDto[] = [];
    let chordsLines: ChordDto[] = [];
    lines.forEach((line) => {
        if (!line.includes('[') && line !== '') {
            index++;
            wordLines.push({ lineNumber: index, text: line });
        } else if (line !== '') {
            index++;
            const arr = makeChords(line, index);
            chordsLines = [...chordsLines, ...arr];
        }
    });
    return { wordLines, chordsLines };
};

function makeChords(line: string, lineNumber: number) {
    const chords: ChordDto[] = [];
    let end = 0;
    let count = 0;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '[') {
            count++;
            const start = i;
            end = line.indexOf(']', start);
            let ch = line.slice(start + 1, end);
            let adding = '';
            if (ch.includes('/')) {
                const parts = ch.split('/');
                ch = parts[0];
                adding = parts[1];
            }
            chords.push({
                name: ch,
                indexInLine: count,
                spaces: start,
                lineNumber: lineNumber,
                adding: adding
            });
            i = end;
        }
    }
    return chords;
}

function transformChordsToRecord(chords: ChordDto[]): Record<number, ChordDto[]> {
    return chords.reduce((acc, chord) => {
        const lineNum = chord.lineNumber;
        if (!acc[lineNum]) acc[lineNum] = [];
        acc[lineNum].push(chord);
        acc[lineNum].sort((a, b) => a.indexInLine - b.indexInLine);
        return acc;
    }, {} as Record<number, ChordDto[]>);
}

function AIScaning(props: { songText: string, song: SongDto, setTips: Function }) {
    const hasFetched = useRef(false);
    const [result, setResult] = useState<GeminiSongResponse | null>(null);
    const [tranChordsFromAI, setTranChordsFromAI] = useState<Record<number, ChordDto[]> | undefined>({});

    const { newFullSongToFront, newFullSongToServer } = useMemo(() => {
        const arrs = scanText(props.songText);
        const chordsByLine = transformChordsToRecord(arrs.chordsLines);
        return {
            newFullSongToFront: { song: props.song, wordLines: arrs.wordLines, chordsByLine },
            newFullSongToServer: { song: props.song, wordLines: arrs.wordLines, chords: arrs.chordsLines }
        };
    }, [props.songText, props.song]);

    useEffect(() => {
        if (hasFetched.current) return;
        const loadAI = async () => {
            try {
                hasFetched.current = true;
                const message = await AIScan(newFullSongToServer);
                setResult(message);
                props.setTips({ tips: message.musicalRecommendations });
                setTranChordsFromAI(transformChordsToRecord(message.chords || []));
            } catch (err) {
                console.error(err);
                hasFetched.current = false;
            }
        };
        loadAI();
    }, [newFullSongToServer]);

    if (!result) return <div className="loading-container"><p>מנתח את השיר ב-AI...</p></div>;
    return <ChordsDiv fullSong={newFullSongToFront} isFromScaning={true} chordsFromAI={tranChordsFromAI} />;
}

export default SongController;