import { useState } from "react"
import '../style/SingIn.css'
import { Link, useNavigate } from 'react-router'
import { type ChangeEvent, type FormEvent } from "react"
import { addUser, getUsers, login } from "../services/userService"
import { loginSuccess } from "../redux/auth/authSlice"
import { useDispatch } from "react-redux"
import type { UserDto, UserRole } from "../types"
import { toast } from "react-toastify"


//דף התחברות
function SignIn() {
    const dispatch = useDispatch();

    const [canWriteChords, setCanWriteChords] = useState(false);
    const [signOrLog, setSign] = useState('log')
    
    // נגדיר את ה-role כמספר, כפי שה-Backend ב-#C דורש. נניח ש-0 זה Regular ו-1 זה Admin
    const [data, setData] = useState<UserDto>({ 
        name: '', 
        password: '', 
        email: '', 
        role: 0 
    });
    
    const navigate = useNavigate()

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (data.email == '' || data.password == '') {
            alert('חסר פרטים')
            return
        }

        const log: UserDto = { name: data.name, password: data.password, email: data.email };
        debugger
        if (signOrLog === 'log') {
            const { token, user } = await login(log);
            if (user && token) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                dispatch(loginSuccess({ user, token }));
                toast.success("האימות הושלם!")
                navigate('/PersonalArea');
            }
        } else {
            if (data.name == '') {
                toast.error("חסר פרטים")
                return
            }
            const { token, user } = await login(data);
            if (user) { 
                toast.error("משתמש קיים"); 
                return; 
            } else {
                // עוטפים את האובייקט תחת userDto כפי שה-Backend דורש
                const { token, user } = await addUser(data);
                
                if (user && token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    dispatch(loginSuccess({ user, token }));
                    toast.success("נרשמת בהצלחה")
                    navigate('/PersonalArea');
                }
            }
        }
    };

    const handleToggle = () => {
        const nextValue = !canWriteChords;
        setCanWriteChords(nextValue);
        
        // מעדכנים את ה-Role כמספר (0 או 1)
        setData(prevData => ({
            ...prevData,
            role: nextValue ? 1 : 0 // 1 = Admin, 0 = Regular
        }));
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData({ ...data, [name]: value })
    }

    return (
        <>
            <form onSubmit={onSubmit} autoComplete="off" className="log-in-form">
                <h1>ברוך הבא</h1>
                <div className="btns">
                    <button className={`btn1 ${signOrLog === 'sign' ? 'active' : ''}`} type="button" onClick={() => setSign('sign')} >הרשמה</button>
                    <button className={`btn1 ${signOrLog === 'log' ? 'active' : ''}`} type="button" autoFocus onClick={() => setSign('log')} >התחברות</button>
                </div>
                {signOrLog == 'sign' &&
                    <>
                        <input name="name" type="text" placeholder="שם משתמש" value={data.name} onChange={onChange} />
                        <input name="email" type="email" placeholder="אימייל" value={data.email} onChange={onChange} />
                        <input name="password" type="password" placeholder="סיסמא" value={data.password} onChange={onChange} />
                        
                        {/* מתג (Toggle Switch) */}
                        <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0' }}>
                            <div
                                onClick={handleToggle}
                                style={{
                                    position: 'relative',
                                    width: '56px',
                                    height: '28px',
                                    backgroundColor: canWriteChords ? '#cc30d1' : '#cbd5e1', 
                                    borderRadius: '28px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    marginLeft: '12px'
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: canWriteChords ? '30px' : '2px', 
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s ease',
                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                                    }}
                                />
                            </div>

                            <span
                                onClick={handleToggle}
                                style={{ cursor: 'pointer', fontSize: '0.95rem', userSelect: 'none' }}
                            >
                                אני יודע/ת לכתוב אקורדים לשירים בעצמי
                            </span>
                        </div>
                        <button type="submit">הרשם</button>
                    </>
                }
                {signOrLog == 'log' &&
                    <>
                        <input name="email" type="email" placeholder="אימייל" value={data.email} onChange={onChange} />
                        <input name="password" type="password" placeholder="סיסמא" value={data.password} onChange={onChange} />
                        <button type="submit">התחבר</button>
                    </>
                }
            </form>
        </>
    )
}

export default SignIn;