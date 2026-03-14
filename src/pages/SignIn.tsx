import { useState } from "react"
import '../style/SingIn.css'
import { Link, useNavigate } from 'react-router'
import { type ChangeEvent, type FormEvent } from "react"
import { addUser, getUsers, login } from "../services/userService"
import { loginSuccess } from "../redux/auth/authSlice"
import { useDispatch } from "react-redux"
import type { UserDto } from "../types"

function SignIn() {
    const dispatch = useDispatch();


    const [signOrLog, setSign] = useState('log')
    const [data, setData] = useState({ name: '', password: '', email: '' })
    const navigate = useNavigate()

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            debugger
            const log: UserDto = { name: data.name, password: data.password, email: data.email };
            const { token, user } = await login(log);
            if (signOrLog === 'log') {
                if (user && token) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    dispatch(loginSuccess({ user, token }));
                    alert('ברוך הבא');
                    navigate('/PersonalArea');
                }
                else
                    alert('פרטי התחברות שגויים');
            }
            else {
                if (user) {
                    alert('משתמש קיים');
                    return;
                }
                else {
                    console.log("vhh");

                    const { token, user } = await addUser(data);
                    if (user && token) {
                        // 1. שמירה לזיכרון הדפדפן (חובה כדי שהטוקן לא יתנדף)
                        localStorage.setItem("token", token);
                        localStorage.setItem("user", JSON.stringify(user));

                        // 2. עדכון ה-Redux (כדי שה-UI יתעדכן מיד)
                        dispatch(loginSuccess({ user, token }));

                        alert("נרשמת בהצלחה");
                        navigate('/PersonalArea');
                    } else {
                        alert('שגיאה בהרשמה');
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData({ ...data, [name]: value })
    }
    return (
        <>
            <form onSubmit={onSubmit} autoComplete="off">
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
                        <button>הרשם</button>
                    </>
                }
                {signOrLog == 'log' &&
                    <>
                        <input name="email" type="email" placeholder="אימייל" value={data.email} onChange={onChange} />
                        <input name="password" type="password" placeholder="סיסמא" value={data.password} onChange={onChange} />
                        <button>התחבר</button>
                    </>
                }


            </form>
        </>
    )
}
export default SignIn




