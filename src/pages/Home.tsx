
import { useEffect, useState } from 'react';
import ChordsDisplay from '../components/chordsDisplay';
import '../style/home.css'
import { getSongs } from '../services/songService';
import type { SongDto } from '../types';
import { useNavigate } from 'react-router-dom';
import SongRequest from '../components/songRequest';
function Home() {
    const [songs, setSongs] = useState<SongDto[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getSongs();
                setSongs(data)
            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }

        };

        loadData();
    }, []);

    return (
        <div>
            <div className="hero"></div>
            <div className="content">
                <h1>אקורדים חדשים באתר</h1>
                <ChordsDisplay songs={songs} />
                <div className="menuBtnsDiv">
                    <button className="menuBtns" onClick={()=>navigate('categories') }>
                        <h3>היכנס כדי לנגן לפי הז'אנר המועדף עלייך</h3>
                        <div>מאות אקורדים מחולקים לקטגוריות לפי סגנון</div>
                        <img className="icon" src="../src/img/queue_music_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg" alt="" />

                    </button>
                    <button className="menuBtns">
                        <h3>כל האקורדים בסינון חופשי</h3>
                        <div>מצא את השירים האהובים עלייך בחיפוש חופשי לפי שם אומן שם שיר</div>
                        <img className="icon" src="../src/img/search_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg" alt="" />
                    </button>
                </div>
                <SongRequest/>

            </div>
        </div>
    );
}
export default Home