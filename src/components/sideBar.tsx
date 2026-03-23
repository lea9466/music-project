import { useState } from "react";
import '../style/sideBar.css'
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link } from "react-router-dom";

function SideBar() {
    const [open, setOpen] = useState(false);
    const [openTatLinks, setOpenTatLinks] = useState(false);

    const sidLinks = {
        link1: 'קטגוריות',
        link2: 'יצירת קשר',
        link3: 'בלוג'
    }
    const categories = useSelector((state: RootState) => state.categories.categories);

    const TatLinks = categories.map(c => { return c.name }).slice(1)
    const newTatLinks = TatLinks.map(link => (
        <Link to={''}>{link}</Link>
    ))


    return (
        <>
            <button className="sidebar-btn" onClick={() => setOpen(!open)}>
                ☰
            </button>
            <div className={`sidebar ${open ? "open" : ""}`}>
                <button onClick={() => setOpenTatLinks(!openTatLinks)}>{sidLinks.link1 + ' '} ▼</button>
                <div className={`divOfTatLinks ${openTatLinks ? "show" : ""}`} style={{ display: `${openTatLinks == true ? 'block' : 'none'}` }}>
                    {newTatLinks}
                </div>
                <a href="">{sidLinks.link2}</a>
                <a href="">{sidLinks.link3}</a>
            </div>

        </>
    )
}

export default SideBar