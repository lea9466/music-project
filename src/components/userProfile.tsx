import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { updateSuccess } from '../store/userSlice'; // הפעולה שמעדכנת את הרדוקס והלוקאל-סטורג'
import type { RootState } from '../redux/store';
import '../style/UserProfile.css'
import { setNameOrImg } from '../services/userService';
import type { UserDto } from '../types';
import { updateNameOrImg } from '../redux/auth/authSlice';
const UserProfile = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    // סטייט לפרטים רגילים
    const [formData, setFormData] = useState<UserDto>({ name: user.name, email: user.email });

    // סטייט לשינויים רגישים
    const [securityData, setSecurityData] = useState({
        email: user?.email || '',
        currentPassword: '', // חובה לאימות
        newPassword: ''
    });

    const handleGeneralUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isSucces = await setNameOrImg(formData)
        if (isSucces) {
            dispatch(updateNameOrImg({name:formData.name}))
            alert("הפרטים הכלליים עודכנו בהצלחה!");

        }
       
    };

    const handleSecurityUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!securityData.currentPassword) {
            alert("חובה להזין סיסמה נוכחית לביצוע שינוי זה");
            return;
        }
        // שליחה לשרת (למשל POST /api/user/security)
        console.log("מעדכן פרטים רגישים עם אימות סיסמה...");
    };

    return (
        <div className="profile-container">
            <h2>עריכת פרופיל</h2>

            {/* חלק 1: פרטים כלליים */}
            <form onSubmit={handleGeneralUpdate} className="profile-section">
                <h3>פרטים כלליים</h3>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="שם מלא"
                />
                <button type="submit">עדכן פרטים</button>
            </form>

            <hr />

            {/* חלק 2: אבטחה (דורש סיסמה) */}
            <form onSubmit={handleSecurityUpdate} className="profile-section security">
                <h3>שינוי אימייל או סיסמה</h3>
                <p className="warning">לשינוי פרטים אלו יש להזין סיסמה נוכחית</p>

                <input
                    type="email"
                    value={securityData.email}
                    onChange={(e) => setSecurityData({ ...securityData, email: e.target.value })}
                    placeholder="אימייל חדש"
                />

                <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    placeholder="סיסמה נוכחית (חובה)"
                    required
                />

                <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    placeholder="סיסמה חדשה (אופציונלי)"
                />

                <button type="submit" className="btn-danger">בצע שינויים רגישים</button>
            </form>
        </div>
    );
};

export default UserProfile;