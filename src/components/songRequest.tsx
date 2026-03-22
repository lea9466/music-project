
import { useEffect, useState } from "react";
import { type ApiResponse, type SongRequestDto } from "../types";
import { getAllRequests } from "../services/songRequestService";
import '../style/SongRequest.css'
import { ToggleVote } from "../services/songRequestVoteService";

function SongRequest() {
    const [requests, setRequests] = useState<SongRequestDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<boolean>(false);

    // קריאה לשרת עם טעינת הקומפוננטה
    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await getAllRequests();
            setRequests(data);
            console.log(data);

        } catch (err) {
            console.error("שגיאה בטעינת הבקשות:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);


    const handleVote = async (id: number) => {
        try {
            // 1. קריאה לשרת - מקבלים את הנתונים החדשים (newScore)
            const response: ApiResponse = await ToggleVote(id);
            const nweReq = requests.map(req => {
                if (req.id == id) {
                    req.isVotedByMe = response.status
                    req.votesCount = response.status ? req.votesCount! + 1 : req.votesCount! - 1
                }
                return req
            })
            setRequests(nweReq)

        } catch (err) {
            console.error("שגיאה בהצבעה:", err);
            // אופציונלי: כאן אפשר להגיד למשתמש "צריך להתחבר כדי להצביע"
        }
    };
    if (loading) return <div className="loader">טוען בקשות...</div>;

    return (
        <div className="requests-container" dir="rtl">
            <h2 className="title">בקשות שירים מהקהילה</h2>

            {requests.length === 0 ? (
                <p className="no-requests">אין בקשות כרגע, תהיו הראשונים לבקש!</p>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="request-card">
                        <div className="request-header">
                            <span className="creator-name">מאת: <strong>{req.creatorName || 'אנונימי'}</strong></span>
                            <span className="votes-count">🔥 {req.votesCount || 0}</span>
                        </div>

                        <div className="request-body">
                            {req.songDes}
                        </div>

                        <div className="request-footer">
                            <span className="created-at">
                                {req.date || ''}
                            </span>

                            {!req.isFulfilled ? (
                                <button
                                    className={req.isVotedByMe ? "vote-button-active" : "vote-button"}
                                    onClick={() => handleVote(req.id!)}
                                >
                                    {req.isVotedByMe ? "ביטול הצבעה" : "גם אני רוצה"}
                                </button>
                            ) : (
                                <span className="status-done">✅ בוצע</span>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default SongRequest;