import plusIcon from "../img/stat_1_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg";
import minusIcon from "../img/stat_minus_1_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg";
import { useNavigate, useParams } from 'react-router-dom';
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
            try {
                const data = await getFullSong(Number(id));
                setFullSong(data)
            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }
        };
        loadSong();
    }, [id]);



    const baseSong = fullSong.song
    const song = {
        Id: baseSong?.id || -1,
        catId: baseSong.categoryId,
        userId: '2552',
        name: baseSong.name,
        songer: baseSong.artist,
        utubLink: baseSong.utubLink,
        rating: 10,
        mazorOrMinor: baseSong.majorOrMinor,
        languagu: baseSong.language
    }

    async function toggleFavoriteSong() {
        
        if (!user.id) {
            alert('עליך להתחבר כדי לסמן שירים מועדפים');
            return;
        }
        if(!token){
            alert('כדי לסמן מועדפים עליך להתחבר מחדש')
            return
        }
        const dataToSend = {
            songId: song.Id
        };

        try {
            const response = await toggleFavoriteSongService(dataToSend);
            if (response.songId) {
                setheartSrc('../src/img/לב מלא.png');
                dispatch(addFavoriteSong(song.Id));
            }
            else {
                setheartSrc('../src/img/לב ריק.png');
                dispatch(removeFavoriteSong(song.Id));
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
                    <h1>{`אקורדים לשיר ${song.name}`}</h1>
                    <iframe className="utubLink"
                        radioGroup=""
                        src={`https://www.youtube.com/embed/${song.utubLink}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    ></iframe>
                    <div className='information'>
                        <div>{`מבצע במקור: ${song.songer}`}</div>
                        {/* <div>{`${song.scale} :סולם`}</div> */}
                    </div>
                    <button onClick={() => setUseFlats(!useFlats)}>
                        {useFlats ? "מצב דיאזים" : "מצב במולים"}
                    </button>
                    <button className="like" onClick={toggleFavoriteSong}>
                        <img className="likeImg" src={heartSrc} alt="" />
                    </button>
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


