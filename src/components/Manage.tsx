import { useDispatch, useSelector } from "react-redux";
import GenericTable from "./table";
import { convertUser, type CategoryDto, type SongDto, type SongRequestDto, type UserDto } from "../types";
import type { RootState } from "../redux/store";
import { use, useEffect, useState } from "react";
import ToggleButtons from "./toggleButton";
import { deleteSong, getSongs, getSongsByUserId } from "../services/songService";
import { deleteUser, getUsers } from "../services/userService";
import { useNavigate } from "react-router-dom";
import AddCategory from "./addCategory";
import { deleteCategory } from "../services/categoryService";
import { deleteCategoryFromStore } from "../redux/categoreis/categorieSlice";
import { fillSongRequest, getAllRequests } from "../services/songRequestService";
import SetUserRole from "./setUserRole";
import { toast } from "react-toastify";
import IDidSong from "./iDidSong";


//קומפוננטת ניהול מידע
function Manage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [openWindow, setOpenWindow] = useState(false);
    const [openWindowOfUser, setOpenWindowOfUser] = useState(false);
    const [openWindowOSongReq, setOpenWindowOfSongReq] = useState(false);
    const [cat, setCat] = useState<CategoryDto>({ name: '', description: '', songsCount: 0 });
    const [songReq, setsongReq] = useState<SongRequestDto>({ songDes: '' });
    const [userEdit, setUserEdit] = useState<UserDto>({ name: '', email: '' });

    const user = useSelector((state: RootState) => state.auth.user);
    const categories: CategoryDto[] = useSelector((state: RootState) => state.categories.categories);

    const catHeaders = ['שם', 'תאור', 'מספר שירים']
    const catDisplayKeys = ['name', 'description', 'songsCount'];

    const songHeaders = ['שם', 'אומן', 'תאריך הפצה', 'קטגוריה', 'צפיות', 'לייקים']
    const songDisplayKeys = ['name', 'artist', 'date', 'catName', 'viewsCount', 'chordLikesCount'];

    const userHeaders = ['שם', 'אימייל', 'הרשאות', 'תאריך הצטרפות']
    const userDisplayKeys = ['name', 'email', 'role', 'date'];

    const SRHeaders = ['בקשה', 'מצביעים', 'דרוג', 'תאריך בקשה', 'בוצע']
    const SRDisplayKeys = ['songDes', 'votesCount', 'priorityScore', 'date'];

    const [songs, setSongs] = useState<SongDto[]>([])
    const [users, setUsers] = useState<UserDto[]>([])
    const [songRequests, setSongRequests] = useState<SongRequestDto[]>([])
    useEffect(() => {
        const loadData = async () => {
            try {
                const songs = user.role == 2 ? await getSongs() : await getSongsByUserId();
                songs.map(s => s.catName = categories.find(c => c.id == s.categoryId)?.name)
                const users = await getUsers()
                const songRequests = await getAllRequests()
                setSongs(songs)
                setUsers(users)
                setSongRequests(songRequests)

            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }
        };

        loadData();
    }, []);

    async function onDeletCat(item: CategoryDto) {
        // if (item.SongsCount! > 0) {
        const message = `שימי לב! בקטגוריה זו יש ${item.songsCount} פריטים. 
                            מחיקת הקטגוריה תעביר את כל השירים המשוייכים אליה לקטגוריה כללית .
                            האם את בטוחה שברצונך להמשיך?`;
        const confirmed = window.confirm(message);
        if (!confirmed) {
            return;
        }
        // }
        const success = await deleteCategory(item.id!)
        if (success) {
            dispatch(deleteCategoryFromStore(item.id!));
            toast.success("Done!");
        }
    }
    async function onDeletSong(item: SongDto) {
        const message = 'שים לב שיר זה ימחק לחלוטין כולל מסימוני משתמשים!';
        const confirmed = window.confirm(message);
        if (!confirmed) {
            return;
        }
        const success = await deleteSong(item.id!)
        if (success) {
            setSongs(songs.filter(s => s.id != item.id))
            toast.success("Done!");
        }
    }
    function onEditUser(item: UserDto) {
        setUserEdit(item)
        setOpenWindowOfUser(true)
    }

    function onEditCat(item: CategoryDto) {
        setCat(item)
        setOpenWindow(true)
    }

    function onEditSong(item: SongDto) {
        navigate('/SongController', {
            state: item
        });
    }
    async function onDeletUser(item: UserDto) {
        const message = 'אתה בטוח שברצונך למחוק משתמש זה?';
        const confirmed = window.confirm(message);
        if (!confirmed) {
            return;
        }
        const success = await deleteUser(item.id!)
        setUsers(users.filter(u => u.id != item.id))
        if (success)
            toast.success("Done!");
    }

    async function onEditSongReq(item: SongRequestDto) {
        setsongReq(item)
        setOpenWindowOfSongReq(true)

    }
    function onAddCat() {
        setCat({ name: '', description: '', songsCount: 0 });
        setOpenWindow(true);
    }
    const btns = [{ str: 'שירים', icon: 'music_note_2' }, { str: 'בקשות שירים', icon: 'folded_hands' }]
    if (user.role == 2)
        btns.push({ str: 'משתמשים', icon: 'group' }, { str: 'קטגוריות', icon: 'dataset' },)
    const [activeTab, setActiveTab] = useState<string>(btns[btns.length - 1].icon);

    return (
        <>
            <ToggleButtons btns={btns} onSet={setActiveTab} activeTab={activeTab} />
            {activeTab == 'dataset' && <GenericTable elements={categories} displayKeys={catDisplayKeys as (keyof CategoryDto)[]} onDelete={(item: CategoryDto) => onDeletCat(item)} onEdit={(item: CategoryDto) => onEditCat(item)} tableHeaders={catHeaders} buttunAdd={{ text: 'add', function: () => onAddCat() }} showAction={true} />}
            {activeTab == 'music_note_2' && <GenericTable elements={songs} displayKeys={songDisplayKeys as (keyof SongDto)[]} onDelete={onDeletSong} onEdit={(item: SongDto) => onEditSong(item)} tableHeaders={songHeaders} buttunAdd={{ text: 'add', function: () => navigate('/SongController') }} showAction={true} />}
            {activeTab == 'group' && <GenericTable elements={users.map(convertUser)} displayKeys={userDisplayKeys as (keyof UserDto)[]} onDelete={(item: UserDto) => onDeletUser(item)} onEdit={(item: UserDto) => onEditUser(item)} tableHeaders={userHeaders} showAction={true} />}
            {activeTab == 'folded_hands' && <GenericTable elements={songRequests} displayKeys={SRDisplayKeys as (keyof SongRequestDto)[]} onDelete={() => { }} onEdit={(item: SongRequestDto) => onEditSongReq(item)} tableHeaders={SRHeaders} showAction={false} />}
            {openWindow && <AddCategory setOpen={setOpenWindow} editCat={cat} />}
            {openWindowOfUser && <SetUserRole setOpen={setOpenWindowOfUser} user={userEdit} users={users} />}
            {openWindowOSongReq && <IDidSong setOpen={setOpenWindowOfSongReq} mySongs={songs} songRequests={songRequests} setSongRequests={setSongRequests} SongRequest={songReq} />}

        </>

    );


}


export default Manage