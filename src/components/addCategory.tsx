import { useEffect, useState, type ChangeEvent } from 'react';
import { addCategory, updateCategory } from '../services/categoryService'
import '../style/addCategory.css'
import { addCategoryToStore, updateCategoryFromStore } from '../redux/categoreis/categorieSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { CategoryDto } from '../types';
import type { RootState } from '../redux/store';

function AddCategory(props: { setOpen: (flaag: boolean) => void, editCat?: CategoryDto }) {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    // מצב התחלתי ריק
    const initialState: CategoryDto = { name: '', description: '', songsCount: 0 };
    const [cat, setCat] = useState<CategoryDto>(initialState);

    useEffect(() => {
        // אם קיבלנו אובייקט לעריכה - נטען אותו. אם לא - ננקה את הטופס
        if (props.editCat) {
            setCat(props.editCat);
        } else {
            setCat(initialState);
        }
    }, [props.editCat]);

    // פונקציה לסגירה ואיפוס
    const handleClose = () => {
        setCat(initialState);
        props.setOpen(false);
    };

    async function addOrSetCat() {
        try {
            if (!token) {
                alert('בשביל לבצע פעולה זו עלייך להתחבר מחדש');
                return;
            }

            // בדיקה לפי ID - הדרך הכי בטוחה לדעת אם זה עדכון או הוספה
            if (cat.id) {
                const success = await updateCategory(cat);
                if (success) {
                    dispatch(updateCategoryFromStore(cat));
                    alert('עודכן בהצלחה');
                } else {
                    alert('שגיאה בעדכון');
                }
            }
            else {
                const newCat = await addCategory(cat);
                newCat.songsCount = 0;
                dispatch(addCategoryToStore(newCat));
                alert('הקטגוריה נוספה בהצלחה!');
            }

            handleClose(); // סגירה ואיפוס לאחר הצלחה

        } catch (error) {
            console.error(error);
        }
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCat({ ...cat, [name]: value });
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>{cat.id ? 'עריכת קטגוריה' : 'הוספת קטגוריה'}</h2>
                    <span onClick={handleClose}>✕</span>
                </div>

                <div className="modal-body">
                    <label>שם הקטגוריה *</label>
                    <input
                        type="text"
                        placeholder="למשל: מרגש"
                        name='name'
                        value={cat.name}
                        onChange={onChange}
                    />

                    <label>תיאור</label>
                    <input
                        type="text"
                        placeholder="תיאור קצר..."
                        name='description'
                        value={cat.description}
                        onChange={onChange}
                    />
                </div>

                <div className="modal-footer">
                    <button onClick={handleClose}>ביטול</button>
                    <button className="add" onClick={addOrSetCat}>
                        {cat.id ? 'עדכן שינויים' : 'שמירה'}
                    </button>
                </div>

            </div>
        </div>
    );
}
export default AddCategory


