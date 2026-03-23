

// import { useTheme } from "./theme/useTheme";
import { Link, useNavigate } from 'react-router-dom'
import '../style/header.css'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { loginSuccess, logout } from '../redux/auth/authSlice';
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
                    <Link to='/'>בית</Link>
                    <Link to='/categories'>קטגוריות</Link>
                    <a href='#newReq'>בקשת שיר</a>
                </div>
                {/* <div className="right">ימין</div> */}

            </header >
            <div className="space"></div>

        </>

    )

}

export default Header