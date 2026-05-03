import plusIcon from "../img/stat_1_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg";
import minusIcon from "../img/stat_minus_1_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg";
import { data, useNavigate, useParams } from 'react-router-dom';
import '../style/chord.css'
import { useEffect, useState } from 'react';
import { getFullSong } from '../services/songService';
import type { CategoryDto, FullSongDto, SongDto, UserFavoriteSong } from '../types';
import AutoScroller from '../components/autoScroller';
import ChordsDiv from "../components/chordsDiv";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { toggleFavoriteSongService } from "../services/favoriteSongsService";
import { addFavoriteSong, removeFavoriteSong } from "../redux/auth/authSlice";
import ChordsViewer from "../components/chordsViewer";
import ToggleButtons from "../components/toggleButton";
import { toast } from "react-toastify";
import heartFull from "../img/לב מלא.png";
import heartEmpty from "../img/לב ריק.png";
import ChordLikeButton from "../components/chordLikeButton";

//פונקציה לניקוי לינק של יוטיוב
const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // רג'קס שתופס את ה-ID מכל סוגי הקישורים של יוטיוב
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    const videoId = (match && match[2].length === 11) ? match[2] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};


//הדיב הראשי שמוצגים בו פרטי השיר והאקורדים שלו - שיר שלם
function ChordsOfSong() {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    const [ton, setTon] = useState(0)
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const [fullSong, setFullSong] = useState<FullSongDto>({
        song: {} as SongDto,
        wordLines: [],
        chordsByLine: {}
    });
    const categories: CategoryDto[] = useSelector((state: RootState) => state.categories.categories)
    const [heartSrc, setheartSrc] = useState(
        user.favoriteSongs?.includes(fullSong.song.id!) ? heartFull : heartEmpty
    )
    // console.log(user.favoriteSongs);

    // const allChords = Object.values(fullSong.chordsByLine || {}).flat();

    useEffect(() => {
        const isFavorite = user.favoriteSongs?.includes(fullSong.song.id!);
        setheartSrc(isFavorite ? heartFull : heartEmpty);
    }, [user.favoriteSongs, fullSong.song.id]);

    useEffect(() => {
        const loadSong = async () => {
            // בדיקה שה-id קיים והוא אכן מספר תקין
            const songId = Number(id);
            if (isNaN(songId)) {
                console.error("ID לא תקין:", id);
                return;
            }
            try {
                const data = await getFullSong(songId);
                setFullSong(data);
            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }
        };
        loadSong();
    }, [id]);


    async function toggleFavoriteSong() {

        if (!user.id) {
            toast.warn('עליך להתחבר כדי לסמן שירים מועדפים');
            return;
        }
        if (!token) {
            toast.warn('כדי לסמן מועדפים עליך להתחבר מחדש');
            return
        }
        const dataToSend = {
            songId: fullSong.song.id!
        };

        try {
            const response = await toggleFavoriteSongService(dataToSend);
            if (response.songId) {
                setheartSrc(heartFull);
                dispatch(addFavoriteSong(fullSong.song.id!));
            } else {
                setheartSrc(heartEmpty);
                dispatch(removeFavoriteSong(fullSong.song.id!));
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }

    const [activeTab, setActiveTab] = useState<string>("♯");
    const btns = [
        { str: "מצב במולים", icon: "♭" },
        { str: "מצב דיאזים", icon: "♯" },
    ];

    if (!fullSong.song.name) {
        return <h3>טוען...</h3>
    }

    return (
        <>
            <div className='wrappwr'>
                <AutoScroller />
                <div className="chordsOfSong">

                    <h1>{`אקורדים לשיר ${fullSong.song.name}  של ${fullSong.song.artist}` }</h1>
                    <div className="song-details-container">
                        {/* מבצע במקור */}
                        <div className="info-item artist-item">
                            <span className="material-symbols-outlined icon">person</span>
                            <div className="text-content">
                                <span className="label">מבצע במקור:</span>
                                <span className="value">{fullSong.song.artist}</span>
                            </div>
                        </div>

                        {/* קטגוריה */}
                        <div className="info-item category-item">
                            <span className="material-symbols-outlined icon">category</span>
                            <div className="text-content">
                                <span className="label">קטגוריה:</span>
                                <span className="value">
                                    {categories.find(cat => fullSong.song.categoryId == cat.id)?.name}
                                </span>
                            </div>
                        </div>

                        {/* תאריך הפצה */}
                        <div className="info-item date-item">
                            <span className="material-symbols-outlined icon">calendar_today</span>
                            <div className="text-content">
                                <span className="label">תאריך הפצה:</span>
                                <span className="value">{fullSong.song.date}</span>
                            </div>
                        </div>

                        {/* כמות צפיות */}
                        <div className="info-item views-item">
                            <span className="material-symbols-outlined icon">visibility</span>
                            <div className="text-content">
                                <span className="label">צפיות:</span>
                                <span className="value">{fullSong.song.viewsCount}</span>
                            </div>
                        </div>
                    </div>
                    <iframe className="utubLink"
                        radioGroup=""
                        src={getEmbedUrl(fullSong.song.utubLink || '')}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>

                    <ChordLikeButton songId={fullSong.song.id || 0} initialLikesCount={fullSong.song.chordLikesCount || 0} />

                    <div className="creator-info-card">
                        <span className="material-symbols-outlined creator-icon">
                            person
                        </span>
                        <div className="creator-details">
                            <span className="creator-label">משתמש שהעלה:</span>
                            <span className="creator-name">{fullSong.song.creatorName}</span>
                        </div>
                    </div>

                    <button className="like" onClick={toggleFavoriteSong}>
                        <img className="likeImg" src={heartSrc} alt="" />
                    </button>

                    <ChordsViewer useFlats={activeTab == '♭' ? true : false} ton={ton} chordsByLine={fullSong.chordsByLine!} />
                    <ToggleButtons btns={btns} activeTab={activeTab} onSet={setActiveTab} />
                    <ChordsDiv fullSong={fullSong} ton={ton} useFlats={activeTab == '♭' ? true : false} isFromScaning={false} />
                    <div className="modolationDiv">
                        <img src={plusIcon} alt=""
                            onClick={() => { if (ton < 12) setTon(ton + 1) }}
                            className="plus" />
                        <div className="scale">{ton}</div>
                        <img src={minusIcon} alt=""
                            onClick={() => { if (ton > -12) setTon(ton - 1) }}
                            className="minus" />
                    </div>
                    {fullSong.song.credit!='' && <div>קרדיט: {fullSong.song.credit}</div>}
                    <div className="tipsAI">
                        <h4>טיפים לניגון השיר מאת AI</h4>
                        <div>{fullSong.song.tips}</div>
                    </div>

                </div>
            </div>

        </>
    )




}






export default ChordsOfSong


