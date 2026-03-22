import { useDispatch, useSelector } from "react-redux";
import GenericTable from "../components/table";
import { convertUser, type CategoryDto, type SongDto, type SongRequestDto, type UserDto } from "../types";
import type { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import ToggleButtons from "../components/toggleButton";
import { deleteSong, getSongs, getSongsByUserId } from "../services/songService";
import { getUsers } from "../services/userService";
import { useNavigate } from "react-router-dom";
import AddCategory from "../components/addCategory";
import { deleteCategory } from "../services/categoryService";
import { deleteCategoryFromStore } from "../redux/categoreis/categorieSlice";
import { getAllRequests } from "../services/songRequestService";

function Manage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [openWindow, setOpenWindow] = useState(false);
    const [cat, setCat] = useState<CategoryDto>({ name: '', description: '', songsCount: 0 });

    const user = useSelector((state: RootState) => state.auth.user);
    const categories: CategoryDto[] = useSelector((state: RootState) => state.categories.categories);

    const catHeaders = ['שם', 'תאור', 'מספר שירים']
    const catDisplayKeys = ['name', 'description', 'songsCount'];

    const songHeaders = ['שם', 'אומן', 'תאריך הפצה', 'קטגוריה']
    const songDisplayKeys = ['name', 'artist', 'date', 'CategoryId'];

    const userHeaders = ['שם', 'אימייל', 'הרשאות']
    const userDisplayKeys = ['name', 'email', 'role'];

    const SRHeaders = ['בקשה', 'מצביעים', 'דרוג', 'תאריך בקשה']
    const SRDisplayKeys = ['songDes', 'votesCount', 'priorityScore', 'date'];

    const [songs, setSongs] = useState<SongDto[]>([])
    const [users, setUsers] = useState<UserDto[]>([])
    const [songRequests, seSongRequests] = useState<SongRequestDto[]>([])
    useEffect(() => {
        const loadData = async () => {
            try {
                const songs = await getSongsByUserId();
                const users = await getUsers()
                const songRequests = await getAllRequests()
                const convertedUsers = users.map(convertUser);
                setSongs(songs)
                setUsers(convertedUsers)
                seSongRequests(songRequests)

            } catch (err) {
                console.error("שגיאה בקריאת הנתונים:", err);
            }

        };

        loadData();
    }, []);

    async function onDeletCat(item: CategoryDto) {
        // if (item.SongsCount! > 0) {
        console.log("The count is:", item.songsCount);
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
            alert('הקטגוריה נמחקה בהצלחה ')
        }
    }
    async function onDeletSong(item: SongDto) {
        const message = 'שים לב שיר זה ימחק לחלוטין כולל מסימוני משתמשים!';
        const confirmed = window.confirm(message);
        if (!confirmed) {
            return;
        }
        const success = await deleteSong(item.id!)
        setSongs(songs.filter(s => s.id != item.id))
        if (success)
            alert('השיר נמחק בהצלחה!')
        else alert('שגיאה')
    }
    function onDeletUser(item: any) {

    }
    function onEditCat(item: CategoryDto) {
        setCat(item)
        setOpenWindow(true)
    }
    function onEditSong(item: SongDto) {
        debugger
        navigate('/SongController', {
            state: item
        });
    }
    function onEditUser() {

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
            {activeTab == 'dataset' && <GenericTable elements={categories} displayKeys={catDisplayKeys as (keyof CategoryDto)[]} onDelete={(item: CategoryDto) => onDeletCat(item)} onEdit={(item: CategoryDto) => onEditCat(item)} tableHeaders={catHeaders} buttunAdd={{ text: 'add', function: () => onAddCat() }} showAction={true}/>}
            {activeTab == 'music_note_2' && <GenericTable elements={songs} displayKeys={songDisplayKeys as (keyof SongDto)[]} onDelete={onDeletSong} onEdit={(item: SongDto) => onEditSong(item)} tableHeaders={songHeaders} buttunAdd={{ text: 'add', function: () => navigate('/SongController') }} showAction={true}/>}
            {activeTab == 'group' && <GenericTable elements={users} displayKeys={userDisplayKeys as (keyof UserDto)[]} onDelete={onDeletUser} onEdit={onEditUser} tableHeaders={userHeaders} showAction={true}/>}
            {activeTab == 'folded_hands' && <GenericTable elements={songRequests} displayKeys={SRDisplayKeys as (keyof SongRequestDto)[]} onDelete={()=>{}} onEdit={()=>{}} tableHeaders={SRHeaders} showAction={false}/>}
            {openWindow && <AddCategory setOpen={setOpenWindow} editCat={cat} />}
        </>

    );


}


export default Manage