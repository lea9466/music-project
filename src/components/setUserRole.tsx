
import { use, useEffect, useState, type ChangeEvent } from 'react';
import { addCategory, updateCategory } from '../services/categoryService'
import '../style/addCategory.css'
import { addCategoryToStore, updateCategoryFromStore } from '../redux/categoreis/categorieSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { CategoryDto, UserDto } from '../types';
import type { RootState } from '../redux/store';
import { updateUser } from '../redux/auth/authSlice';
import { setEmailOrPass, setRole } from '../services/userService';
import { toast } from 'react-toastify';


//חלון קופץ של עריכת דרגת משתמש
function SetUserRole(props: { setOpen: (flaag: boolean) => void, user: UserDto, users: UserDto[] }) {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();

    // מצב התחלתי ריק
    const [user, setUser] = useState<UserDto>(props.user);

    useEffect(() => {
        if (props.user) {
            // המרה מפורשת למספר כדי למנוע בעיות תצוגה ב-Select
            setUser({
                ...props.user,
                role: props.user.role == 'Regular' ? 0 : user.role == 'Admin' ? 1 : 2
            });
        }
    }, [props.user]); // מבטיח שכל פעם ש-props.user משתנה, הסטייט הפנימי יתעדכן
    // פונקציה לסגירה ואיפוס
    const handleClose = () => {
        props.setOpen(false);
    };

    async function setUserRole() {

        if (!token) {
            toast.warn('בשביל לבצע פעולה זו עלייך להתחבר מחדש');
            return;
        }
        

        // user.role = user.role == 'Regular' ? 0 : user.role == 'Admin' ? 1 : 2
        const success = await setRole(user);
        props.users.map(u => {
            if (u.id == user.id)
                u.role = (user.role == 0 ? 'Regular' : user.role == 1 ? 'Admin' : 'Manager')
        })
        if (success) {
            toast.success("Done!");
            handleClose(); // סגירה ואיפוס לאחר הצלחה
        }
    }


    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>{'עריכת משתמש: ' + user.name}</h2>
                    <span onClick={handleClose}>✕</span>
                </div>

                <div className="modal-body">
                    <select
                        value={user.role !== undefined ? Number(user.role) : 0}
                        onChange={(e) => setUser({ ...user, role: Number(e.target.value) })}
                    >
                        <option value={0}>Regular</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Manager</option>
                    </select>

                </div>

                <div className="modal-footer">
                    <button onClick={handleClose}>ביטול</button>
                    <button className="add" onClick={setUserRole}>
                        {'שמירה'}
                    </button>
                </div>

            </div>
        </div>
    );
}
export default SetUserRole


