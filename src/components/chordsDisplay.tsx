
import { useState } from "react";
import SongCard from "./songCard";
import SongList from "./songList";
import '../style/chordsDisplay.css'
import type { SongDto } from "../types";
import { useNavigate } from "react-router-dom";
function ChordsDisplay(props: { songs: SongDto[] }) {
    const songs = props.songs;
    if (songs.length == 0)
        return <>אין נתונים להצגה</>
    const [cardsDisplay, setDisplay] = useState('cards')
    const navigate = useNavigate()
    function onChordsClick(song: SongDto) {
        debugger
        navigate(`/chords/${song.id}`);
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
    console.log(songs);


    return (
        <>
            <div className="display">
                <div className="displayBtns">
                    <button onClick={() => setDisplay('list')}>
                        <img src="../src/img/format_list_bulleted_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg" alt="" />
                    </button>
                    <button onClick={() => setDisplay('cards')}>
                        <img src="../src/img/dashboard_24dp_CC30D1A7_FILL0_wght400_GRAD0_opsz24.svg" alt="" />
                    </button>
                </div>
                <div className={`${cardsDisplay == 'cards' ? 'songListGrid' : 'songListFlex'}`}>
                    {cardsDisplay == 'cards' ? cards : list}
                </div>
            </div>

        </>

    );


}
export default ChordsDisplay