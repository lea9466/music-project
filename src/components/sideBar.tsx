import { useEffect, useState } from "react";
import '../style/sideBar.css'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { setCategories } from "../redux/categoreis/categorieSlice";

function SideBar() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [openTatLinks, setOpenTatLinks] = useState(false);

    const sidLinks = {
        link1: 'בית',
        link2: 'אזור אישי',
        link3: 'קטגוריות',
        link4: 'תקנון'
    }
    const categories = useSelector((state: RootState) => state.categories.categories);

    // בדיקה שמגנה על .map
    const TatLinks = Array.isArray(categories) ? categories.slice(1) : [];
    const newTatLinks = TatLinks.map(cat => (
        <Link to={`/cat/${cat.id}`} onClick={() => setOpen(false)} key={cat.id}>{cat.name}</Link>
    ))

    useEffect(() => {
        const loadData = async () => {
            if (!Array.isArray(categories) || categories.length === 0) {
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
            {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}

            <button className="sidebar-btn" onClick={() => setOpen(!open)}>
                ☰
            </button>

            <div className={`sidebar ${open ? "open" : ""}`}>
                <Link to={'/'} onClick={() => setOpen(false)}>{sidLinks.link1}</Link>
                <Link to={'/PersonalArea'} onClick={() => setOpen(false)}>{sidLinks.link2}</Link>
                <Link to={'/terms'} >{sidLinks.link4}</Link>

                <button onClick={() => setOpenTatLinks(!openTatLinks)}>
                    {sidLinks.link3 + ' '} ▼
                </button>

                <div className={`divOfTatLinks ${openTatLinks ? "show" : ""}`}>
                    {newTatLinks}
                </div>
            </div>
        </>
    )
}
export default SideBar

