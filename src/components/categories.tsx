import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import type { CategoryDto, SongDto } from "../types";
import { getSongsByCatId } from "../services/songService";
import '../style/categories.css';

// --- קומפוננטת המגירה הפנימית ---
interface DrawerProps {
    categoryId: number;
    isOpen: boolean;
}

function CategoryDrawer({ categoryId, isOpen }: DrawerProps) {
    const [songs, setSongs] = useState<SongDto[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            // שולפים רק אם המגירה נפתחת ועדיין אין שירים ב-state
            if (isOpen && songs.length === 0) {
                console.log(`מנסה לשלוף שירים לקטגוריה מספר: ${categoryId}`);
                setLoading(true);
                try {
                    const data = await getSongsByCatId(categoryId);
                    console.log("נתונים שהתקבלו מהשרת:", data);
                    setSongs(data);
                } catch (err) {
                    console.error("שגיאה בשליפת השירים:", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSongs();
    }, [isOpen, categoryId, songs.length]);

    // אם המגירה סגורה, לא מרנדרים אותה בכלל
    if (!isOpen) return null;

    return (
        <div className="category-drawer expanded">
            {loading ? (
                <div className="drawer-loader">טוען שירים...</div>
            ) : songs.length > 0 ? (
                songs.map((song) => (
                    <div className="drawer-song-row" key={song.id}>
                        <div className="drawer-song-info">
                            <span className="drawer-song-name">{song.name}</span>
                            <span className="drawer-song-artist">{song.artist || "אמן לא ידוע"}</span>
                        </div>
                        <button 
                            className="drawer-chords-btn" 
                            onClick={() => navigate(`/chords/${song.id}`)}
                        >
                            <span>לאקורדים</span>
                            <span className="arrow-left">←</span>
                        </button>
                    </div>
                ))
            ) : (
                !loading && <div className="no-songs">אין שירים בקטגוריה זו כרגע.</div>
            )}
        </div>
    );
}

// --- הקומפוננטה הראשית ---
function Categories() {
    // שליפת קטגוריות מה-Redux (מדלגים על הראשונה אם היא "הכל")
    const categories: CategoryDto[] = useSelector((state: RootState) => state.categories.categories).slice(1);
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

    const toggleCategory = (id: number) => {
        setOpenCategoryId(openCategoryId === id ? null : id);
    };

    return (
        <div className="catDisplay1">
            <h3>רשימת הקטגוריות</h3>
            
            <div className="categories-list-container">
                {categories.map((cat) => (
                    <div className="category-item-wrapper" key={cat.id}>
                        {/* שורת הקטגוריה הלחיצה */}
                        <div 
                            className={`cat-row ${openCategoryId === cat.id ? 'open' : ''}`} 
                            onClick={() => toggleCategory(cat.id!)}
                        > 
                            <div className="cat-main-content">
                                <div className="cat-name">{cat.name}</div>
                                <div className="cat-count">{`${cat.songsCount} שירים`}</div>
                            </div>
                            
                            <div className={`cat-arrow-icon ${openCategoryId === cat.id ? 'rotate' : ''}`}>
                                ▼
                            </div>
                        </div>

                        {/* המגירה שנפתחת */}
                        <CategoryDrawer 
                            categoryId={cat.id!} 
                            isOpen={openCategoryId === cat.id} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Categories;