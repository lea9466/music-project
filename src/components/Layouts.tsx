import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { getCategories } from '../services/categoryService';
import { setCategories } from '../redux/categoreis/categorieSlice';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import SideBar from "./sideBar";
import { ToastContainer } from "react-toastify";
import { getNewSongs } from "../services/songService";
import { setSongs } from "../redux/songs/songSlice";
import type { SongDto } from "../types";
import TopBanner from "./baner";
const Layout = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const newSongs = useSelector((state: RootState) => state.songs.newSongs);

  // דוגמה למצב התחברות (אם יש לך משתנה כזה ב-Redux, אפשר להשתמש בו)
  // const user = useSelector((state: RootState) => state.auth.user);

  // ניהול המצב של הבאנר
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const navigate = useNavigate()

  useEffect(() => {
    const isBannerClosed = sessionStorage.getItem('isBannerClosed');
    if (isBannerClosed) {
      setShowBanner(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (categories.length === 0) {
        try {
          const data = await getCategories();
          dispatch(setCategories(data));
        } catch (err) {
          console.error("שגיאה בקריאת הנתונים:", err);
        }
      }
      if (newSongs.length === 0) {
        try {
          const newSongs: SongDto[] = await getNewSongs();
          dispatch(setSongs({ items: newSongs }));
        } catch (err) {
          console.error("שגיאה בקריאת הנתונים:", err);
        }
      }
    };

    loadData();
  }, [dispatch, categories.length]);

  const handleCloseBanner = (): void => {
    setShowBanner(false);
    sessionStorage.setItem('isBannerClosed', 'true');
  };

  const handleRegisterClick = (): void => {
    navigate('/sign-in')
  };

  const handleLoginClick = (): void => {
    console.log('פתח פופאפ התחברות');
    // כאן תפתחי את מודל/פופ-אפ ההתחברות שלך
  };

  return (
    <>
      {/* הבאנר העליון יופיע רק אם לא סגרו אותו (וגם אפשר להוסיף תנאי אם הוא מחובר) */}
      <TopBanner
        isVisible={showBanner} // אפשר להוסיף כאן גם: && !user
        onRegister={handleRegisterClick}
        onLogin={handleLoginClick}
        onClose={handleCloseBanner}
      />

      <Header />
      <SideBar />
      <main>
        <Outlet /> {/* כאן יוצגו הדפים המשתנים */}
      </main>
      <ToastContainer />
      <ScrollRestoration />
      <Footer />
    </>
  );
};

export default Layout;