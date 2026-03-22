import { useNavigate } from "react-router-dom"
import Categories from "../components/categories"
import Manage from "./Manage"
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import '../style/personalArea.css'
import ToggleButtons from "../components/toggleButton";
import { useEffect, useState } from "react";
import ChordsDisplay from "../components/chordsDisplay";
import { convertUser, type SongDto } from "../types";
import { getSongsByIDs } from "../services/songService";
import UserProfile from "../components/userProfile";

function PersonalArea() {
    const user = useSelector((state: RootState) => state.auth.user);
    const btns = [{ str: 'פרטים עלי', icon: 'person' }, { str: 'שירים שאהבתי', icon: 'favorite' },]
    const [activeTab, setActiveTab] = useState<string>(btns[1].icon);
    const [favSongs, setFavSongs] = useState<SongDto[]>([])
    console.log(JSON.stringify(user.favoriteSongs));

    useEffect(() => {
        const loadData = async () => {
            try {
                const full_favSongs = await getSongsByIDs(user.favoriteSongs ?? [])
                console.log(full_favSongs);
                setFavSongs(full_favSongs)

            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }
        };

        loadData();
    }, []);

    const navigate = useNavigate()
    return (
        <>
            <div className="personalArea">
                <div className="user-card">
                    <div className="user-info">
                        <div className="user-text">
                            <span className="user-name">{user.name}</span>
                            <div className="userName_andIcon">
                                <span className="user-email">{user.email}</span>
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                        </div>
                        <div className="user-avatar">
                            {/* {user.srcImage ? (
                                <img src={user.srcImage} alt={user.name} />
                            ) : ( */}
                                <div className="default-avatar">👤</div>
                            {/* )} */}
                        </div>
                    </div>
                    <span>{convertUser(user).role}</span>

                </div>
                {(user.role == 1 || user.role == 2) && <Manage />}

                <ToggleButtons btns={btns} onSet={setActiveTab} activeTab={activeTab} />
                {activeTab == 'favorite' && <ChordsDisplay songs={favSongs} />}


                {activeTab == 'person' && <UserProfile />}


                {/* <Categories />  */}

            </div>


        </>

    );

}

export default PersonalArea