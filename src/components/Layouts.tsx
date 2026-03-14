import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { getCategories } from '../services/categoryService';
import { setCategories } from '../redux/categoreis/categorieSlice';
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Layout = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.categories.categories);

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
    };

    loadData();
  }, [dispatch, categories.length]);
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* כאן יוצגו הדפים המשתנים */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;