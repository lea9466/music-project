import React from 'react';
import '../style/banner.css'
// הגדרת סוגי הנתונים (Types/Interface) שהקומפוננטה מקבלת
interface TopBannerProps {
    isVisible: boolean;
    onRegister: () => void;
    onLogin: () => void;
    onClose: () => void;
}

const TopBanner: React.FC<TopBannerProps> = ({ isVisible, onRegister, onLogin, onClose }) => {
    // אם הבאנר לא אמור להיות מוצג, נחזיר null
    if (!isVisible) return null;

    return (
        <div className="top-banner">
            <div className="banner-content">
                <span className="material-symbols-outlined banner-icon">
                    star
                </span>
                <p>
                    <strong>רוצים לקחת חלק בקהילה?</strong>
                    <span> הירשמו עכשיו (זה לוקח פחות מדקה) ותוכלו להעלות אקורדים, לבקש שירים ולצבור לייקים!</span>
                </p>
            </div>
            
            <div className="banner-actions">
                <button className="banner-btn register-btn" onClick={onRegister}>
                    הירשם עכשיו
                </button>
                <button className="banner-close" onClick={onClose} aria-label="סגור באנר">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default TopBanner;