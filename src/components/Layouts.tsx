import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { getCategories } from '../services/categoryService';
import { setCategories } from '../redux/categoreis/categorieSlice';
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import SideBar from "./sideBar";
import { ToastContainer } from "react-toastify";
import { getNewSongs } from "../services/songService";
import { setSongs } from "../redux/songs/songSlice";
import type { SongDto } from "../types";


//פריסה בסיסית של כל הדפים
const Layout = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const newSongs = useSelector((state: RootState) => state.songs.newSongs);

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
  return (
    <>
      <Header />
      <SideBar />
      <main>
        <Outlet /> {/* כאן יוצגו הדפים המשתנים */}
      </main>
      <ToastContainer />
      {/* <Footer /> */}
    </>
  );
};

export default Layout;