

// import { useTheme } from "./theme/useTheme";
import { NavLink, useNavigate } from 'react-router-dom'; // החלפת Link ב-NavLink
import '../style/header.css'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { loginSuccess, logout } from '../redux/auth/authSlice';

//תצוגת ראש הדף - הדר
function Header() {
    const user = useSelector((state: RootState) => state.auth.user);
    // const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate()

    const dispatch = useDispatch();


    return (
        <>
            <header className="header">
                <div className="left">
                    <button className='headeBtns' onClick={() => navigate(`${user?.name ? '/PersonalArea' : '/sign-in'}`)}>{user?.name || 'הרשמה/התחברות'}</button>
                    {/* <button onClick={toggleTheme}>{theme}</button> */}
                    <button className='headeBtns' onClick={() => { dispatch(logout()); navigate('/') }}>התנתקות</button>
                </div>
                <div className="mainLinks">
                    <NavLink to='/'>בית</NavLink>
                    <NavLink to='/categories'>קטגוריות</NavLink>
                    <a href='#newReq'>בקשת שיר</a>
                    <NavLink to='/search'>חיפוש</NavLink>
                </div>
                {/* <div className="right">ימין</div> */}

            </header >
            <div className="space"></div>

        </>

    )

}

export default Header