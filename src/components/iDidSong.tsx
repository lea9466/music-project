import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import type { SongDto, SongRequestDto } from '../types';
import type { RootState } from '../redux/store';
import { fillSongRequest } from '../services/songRequestService';
import '../style/iDidSing.css';

interface IDidSongProps {
    setOpen: (flag: boolean) => void;
    SongRequest?: SongRequestDto;
    mySongs: SongDto[];
    songRequests: SongRequestDto[];
    setSongRequests: (requests: SongRequestDto[]) => void;
}

function IDidSong(props: IDidSongProps) {
    const token = localStorage.getItem("token");
    const user = useSelector((state: RootState) => state.auth.user);

    // מצב התחלתי ריק - מוודא ש-songLink הוא 0 כברירת מחדל
    const initialState: SongRequestDto = { 
        songDes: '', 
        songLink: 0,
        isFulfilled: false 
    };

    const [songRequest, setSongRequest] = useState<SongRequestDto>(initialState);

    useEffect(() => {
        if (props.SongRequest) {
            setSongRequest(props.SongRequest);
        }
    }, [props.SongRequest]);

    const handleClose = () => {
        setSongRequest(initialState);
        props.setOpen(false);
    };

    async function handleSave() {
        if (!token) {
            toast.error('בשביל לבצע פעולה זו עלייך להתחבר מחדש');
            return;
        }

        if (songRequest.songLink === 0) {
            toast.warning('אנא בחר שיר מהרשימה');
            return;
        }

        if (songRequest.id) {
            debugger
            // הכנת האובייקט לעדכון
            const updatedRequest: SongRequestDto = {
                ...songRequest,
                isFulfilled: true,
                fulfillerId: user.id,
                fulfillerName: user.name,
                
                
            };

            const success = await fillSongRequest(updatedRequest);
            
            if (success) {
                toast.success("הבקשה עודכנה בהצלחה!");
                
                // עדכון הרשימה המקומית - מסירים את הבקשה שבוצעה מהתצוגה
                const remainingRequests = props.songRequests.filter(s => s.id !== songRequest.id);
                props.setSongRequests(remainingRequests);
                
                handleClose();
            } else {
                toast.error("אירעה שגיאה בעדכון הבקשה");
            }
        }
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>מילאתי בקשת משתמש</h2>
                    <span className="close-icon" onClick={handleClose}>✕</span>
                </div>

                <div className="modal-body">
                    <div className="request-info">
                        <label>תיאור הבקשה:</label>
                        <p>{songRequest.songDes}</p>
                    </div>

                    <div className="selection-area">
                        <label htmlFor="song-select">בחר שיר מהרשימה שלך:</label>
                        <select 
                            id="song-select"
                            name="songLink" 
                            value={songRequest.songLink}
                            onChange={(e) => setSongRequest({ ...songRequest, songLink: Number(e.target.value) })}
                        >
                            <option value={0} disabled hidden>--- בחר שיר ---</option>
                            {props.mySongs.map((song) => (
                                <option key={song.id} value={song.id}>
                                    {song.name} - {song.artist}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={handleClose}>ביטול</button>
                    <button className="btn-primary" onClick={handleSave}>
                        שמור וסגור בקשה
                    </button>
                </div>

            </div>
        </div>
    );
}

export default IDidSong;