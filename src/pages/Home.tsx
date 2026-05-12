import { useEffect, useState } from 'react';
import ChordsDisplay from '../components/chordsDisplay';
import '../style/home.css'
import { getNewSongs } from '../services/songService';
import { useNavigate } from 'react-router-dom';
import SongRequest from '../components/songRequest';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import { setSongs } from '../redux/songs/songSlice';
import SplashScreen from '../assets/SplashScreen';
import HeroSection from '../assets/HeroSection';

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const newSongs = useSelector((state: RootState) => state.songs.newSongs);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedSongs = await getNewSongs(); // ← שם שונה
                dispatch(setSongs({ items: fetchedSongs }));
            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }
        };
        loadData();
    }, []);

    return (
        <div className='home'>
            {/* <HeroSection /> */}
            <div className="content">
                <h1>אקורדים חדשים באתר</h1>
                <ChordsDisplay songs={newSongs} />
                <h1 id="newReq">בקשות שירים מהקהילה</h1>
                <SongRequest />
            </div>
        </div>
    );
}

export default Home