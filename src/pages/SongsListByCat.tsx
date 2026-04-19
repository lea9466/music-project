import { useEffect, useState } from "react";
import type { CategoryDto, SongDto } from "../types";
import { getSongsByCatId } from "../services/songService";
import ChordsDisplay from "../components/chordsDisplay";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useParams } from "react-router-dom";

function SongsListByCat() {
    debugger
    const { id } = useParams();
    const cat = useSelector((state: RootState) => state.categories.categories).find(c => c.id == id);
    const [songs, setSongs] = useState<SongDto[]>([]);
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await getSongsByCatId(cat == undefined ? 0 : cat.id!);
                setSongs(data);
            } catch (err) {
                console.error("שגיאה בשליפת השירים:", err);
            }
        };

        fetchSongs();
    }, [id, cat]);

    if (!cat)
        return (<><h2>טוען...</h2></>)

    return (
        <>
            <h1>{cat!.name}</h1>
            <h4>{cat!.songsCount} :שירים בקטגוריה זו</h4>
            <ChordsDisplay songs={songs} />
        </>)

}
export default SongsListByCat