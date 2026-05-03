import { useState } from "react";
import '../style/sideBar.css'
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link } from "react-router-dom";

function SideBar() {
    const [open, setOpen] = useState(false);
    const [openTatLinks, setOpenTatLinks] = useState(false);

    const sidLinks = {
        link1: 'בית',
        link2: 'אזור אישי',
        link3: 'קטגוריות',
        link4: 'תקנון'
    }
    const categories = useSelector((state: RootState) => state.categories.categories);

    const TatLinks = categories.map(c => { return c }).slice(1)
    const newTatLinks = TatLinks.map(cat => (
        <Link to={`/cat/${cat.id}`} onClick={() => setOpen(false)} key={cat.id}>{cat.name}</Link>
    ))


    return (
        <>
            {/* ה-Overlay: מופיע רק כשהסיידבר פתוח */}
            {open && <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>}

            <button className="sidebar-btn" onClick={() => setOpen(!open)}>
                ☰
            </button>

            <div className={`sidebar ${open ? "open" : ""}`}>
                {/* כאן הוספתי סגירה של הסיידבר כשלוחצים על לינק פנימי - חווית משתמש טובה יותר */}
                <Link to={'/'} onClick={() => setOpen(false)}>{sidLinks.link1}</Link>
                <Link to={'/PersonalArea'} onClick={() => setOpen(false)}>{sidLinks.link2}</Link>

                <button onClick={() => setOpenTatLinks(!openTatLinks)}>
                    {sidLinks.link3 + ' '} ▼
                </button>
                <Link to={'/terms'} >{sidLinks.link4}</Link>

                <div className={`divOfTatLinks ${openTatLinks ? "show" : ""}`}
                    style={{ display: openTatLinks ? 'block' : 'none' }}>
                    {/* גם כאן כדאי להוסיף onClick לסגירת הסיידבר הראשי כשבוחרים קטגוריה */}
                    {newTatLinks}
                </div>
            </div>
        </>
    )
}

export default SideBar