
import { useState } from "react";
import SongCard from "./songCard";
import SongList from "./songList";
import '../style/chordsDisplay.css'
import type { SongDto } from "../types";
import { useNavigate } from "react-router-dom";
import { createSlug } from "../services/utils";


//קומפוננטה המחזירה תצוגת שירים - כרטיסים או רשימה
function ChordsDisplay(props: { songs?: SongDto[] }) {
    const songs = Array.isArray(props.songs) ? props.songs : [];
    if (songs.length === 0)
        return <>אין נתונים להצגה</>

    const [cardsDisplay, setDisplay] = useState('list')
    const navigate = useNavigate()
    function onChordsClick(song: SongDto) {
        navigate(`/chords/${createSlug(song)}`);
    }

    const cards = songs.map((s: SongDto, index: number) => <SongCard
        song={s}
        onClick={() => onChordsClick(s)}
        key={index}
    />)

    const list = songs.map((s: SongDto, index: number) => <SongList
        song={s}
        onClick={() => onChordsClick(s)}
        key={index}
    />)

    return (
        <>
            <div className="display">
                <div className="displayBtns">
                    <button
                        className={`material-symbols-outlined ${cardsDisplay === 'list' ? 'active' : ''}`} onClick={() => setDisplay('list')}
                        title="תצוגת רשימה"
                    >
                        list
                    </button>

                    <button
                        className={`material-symbols-outlined ${cardsDisplay === 'cards' ? 'active' : ''}`} onClick={() => setDisplay('cards')}
                        title="תצוגת כרטיסים"
                    >
                        dashboard
                    </button>
                </div>
                <div className={`${cardsDisplay === 'cards' ? 'songListGrid' : 'songListFlex'}`}>
                    {cardsDisplay === 'cards' ? cards : list}
                </div>
            </div>
        </>
    );
}
export default ChordsDisplay