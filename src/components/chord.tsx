import plusIcon from "../img/stat_1_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg";
import minusIcon from "../img/stat_minus_1_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg";
import { data, useNavigate, useParams } from 'react-router-dom';
import '../style/chord.css'
import { useEffect, useState } from 'react';
import { getFullSong } from '../services/songService';
import type { FullSongDto, SongDto, UserFavoriteSong } from '../types';
import AutoScroller from './autoScroller';
import ChordsDiv from "./chordsDiv";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { toggleFavoriteSongService } from "../services/favoriteSongsService";
import { addFavoriteSong, removeFavoriteSong } from "../redux/auth/authSlice";
import ChordsViewer from "./chordsViewer";
function ChordsOfSong() {
    const dispatch = useDispatch();

    const [useFlats, setUseFlats] = useState(false);
    const { id } = useParams<{ id: string }>();
    const [ton, setTon] = useState(0)
    const user = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const [fullSong, setFullSong] = useState<FullSongDto>({
        song: {} as SongDto,
        wordLines: [],
        chordsByLine: {}
    });
    const [heartSrc, setheartSrc] = useState(`${user.favoriteSongs?.includes(fullSong.song.id!) ? '../src/img/לב מלא.png' : '../src/img/לב ריק.png'}`)

    useEffect(() => {
        const isFavorite = user.favoriteSongs?.includes(fullSong.song.id!);
        setheartSrc(isFavorite ? '../src/img/לב מלא.png' : '../src/img/לב ריק.png');
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
            alert('עליך להתחבר כדי לסמן שירים מועדפים');
            return;
        }
        if (!token) {
            alert('כדי לסמן מועדפים עליך להתחבר מחדש')
            return
        }
        const dataToSend = {
            songId: fullSong.song.id!
        };

        try {
            const response = await toggleFavoriteSongService(dataToSend);
            if (response.songId) {
                setheartSrc('../src/img/לב מלא.png');
                dispatch(addFavoriteSong(fullSong.song.id!));
            }
            else {
                setheartSrc('../src/img/לב ריק.png');
                dispatch(removeFavoriteSong(fullSong.song.id!));
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }
    return (
        <>
            <div className='wrappwr'>
                <AutoScroller />
                <div className="chordsOfSong">
                    <h1>{`אקורדים לשיר ${fullSong.song.name}`}</h1>
                    <iframe className="utubLink"
                        radioGroup=""
                        src={`https://www.youtube.com/embed/${fullSong.song.utubLink}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                    <div className='information'>
                        <div>{`מבצע במקור: ${fullSong.song.artist}`}</div>
                        {/* <div>{`${song.scale} :סולם`}</div> */}
                    </div>
                    <button onClick={() => setUseFlats(!useFlats)}>
                        {useFlats ? "מצב דיאזים" : "מצב במולים"}
                    </button>
                    <button className="like" onClick={toggleFavoriteSong}>
                        <img className="likeImg" src={heartSrc} alt="" />
                    </button>
                    <ChordsViewer chordsByLine={fullSong.chordsByLine!} />
                    <ChordsDiv fullSong={fullSong} ton={ton} useFlats={useFlats} isFromScaning={false} />
                    <div className="modolationDiv">
                        <img src={plusIcon} alt=""
                            onClick={() => { if (ton < 12) setTon(ton + 1) }}
                            className="plus" />
                        <div className="scale">{ton}</div>
                        <img src={minusIcon} alt=""
                            onClick={() => { if (ton > -12) setTon(ton - 1) }}
                            className="minus" />
                    </div>

                </div>
            </div>

        </>
    )




}






export default ChordsOfSong


