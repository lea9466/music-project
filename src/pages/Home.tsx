import { useEffect } from 'react';
import ChordsDisplay from '../components/chordsDisplay';
import '../style/home.css'
import { getNewSongs } from '../services/songService';
import { useNavigate } from 'react-router-dom';
import SongRequest from '../components/songRequest';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { setSongs } from '../redux/songs/songSlice';

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const songs = useSelector((state: RootState) => state.songs.newSongs)

    useEffect(() => {
        const loadData = async () => {
            try {
                const newSongs = await getNewSongs();
                dispatch(setSongs({ items: newSongs }));
            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }
        };
        loadData();
    }, []);

    return (
        <div className='home'>
            <div className="welcome">
                <h1>לנגן זה לא קשה!!</h1>
                <h2>כאן תוכלו למצוא אקורדים למגוון שירים ברמות שונות ובצורה הנוחה ביותר</h2>
                <h3>שימו לב אם הינכם יודעים לכתוב אקורדים תוכלו להעלות שירים בעצמכם אנא צרו קשר עם מנהל האתר</h3>
                <button className="menuBtns" onClick={() => navigate('categories')}>התחילו לנגן ←</button>
            </div>
            <div className="content">
                <h1>אקורדים חדשים באתר</h1>
                <ChordsDisplay songs={songs} />
                <h1 id="newReq">בקשות שירים מהקהילה</h1>
                <SongRequest />
            </div>
        </div>
    );
}
export default Home