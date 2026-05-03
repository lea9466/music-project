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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loadData = async () => {
            if (newSongs.length == 0) {
                try {
                    const newSongs = await getNewSongs();
                    dispatch(setSongs({ items: newSongs }));
                } catch (err) {
                    console.error("שגיאה בקריאת הנתונים:", err);
                }
            }

        };
        loadData();
    }, []);

    if (!mounted) return null;

    function setShowSplash(arg0: boolean): void {
        throw new Error('Function not implemented.');
    }

    return (
        <div className='home' suppressHydrationWarning>
            {/* <div className="welcome" suppressHydrationWarning> */}
            {/* <h1>Harmonia</h1>
                <h2>כאן תוכלו למצוא אקורדים למגוון שירים ברמות שונות ובצורה הנוחה ביותר</h2>
                <button className="menuBtns" onClick={() => navigate('categories')}>התחילו לנגן ←</button> */}
            {/* <SplashScreen onDone={() => setShowSplash(true)} /> */}
            <HeroSection />
            {/* </div> */}
            <div className="content" suppressHydrationWarning>
                <h1>אקורדים חדשים באתר</h1>
                <ChordsDisplay songs={newSongs} />
                <h1 id="newReq">בקשות שירים מהקהילה</h1>
                <SongRequest />
            </div>
        </div>
    );
}

export default Home