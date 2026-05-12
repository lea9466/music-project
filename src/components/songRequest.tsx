import { useEffect, useState } from "react";
import { type ApiResponse, type SongDto, type SongRequestDto } from "../types";
import { getAllRequests, addSongRequest } from "../services/songRequestService";
import { ToggleVote } from "../services/songRequestVoteService";
import '../style/SongRequest.css';
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { createSlug } from "../services/utils";

const spanOptions = [1, 1, 2, 1, 2, 1, 1, 2];

//בקשות שירים של משמתשים
function SongRequest() {
    const [requests, setRequests] = useState<SongRequestDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newRequestDes, setNewRequestDes] = useState<string>("");
    const [isMobile, setIsMobile] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        handleResize(); // ← הפעלה מיידית!
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await getAllRequests();
            console.log(data); // ← תיקון: data ולא SongRequest
            setRequests(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    if (loading) return <div className="loader">טוען בקשות...</div>;
    const handleVote = async (id: number) => {
        try {
            const response: ApiResponse = await ToggleVote(id);
            setRequests(prev => prev.map(req =>
                req.id === id ? {
                    ...req,
                    isVotedByMe: response.status,
                    votesCount: response.status ? (req.votesCount || 0) + 1 : (req.votesCount || 0) - 1
                } : req
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddRequest = async () => {
        if (!token) {
            toast.warn('אנא התחבר כדי לבצע את הבקשה');
            return;
        }
        if (!newRequestDes.trim()) return;
        try {
            const response = await addSongRequest({ songDes: newRequestDes });
            setRequests([response, ...requests]);
            toast.success("בקשתך נשלחה בהצלחה");
            setNewRequestDes("");
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="page-wrapper" dir="rtl">
            <div className="add-request-section">
                <div className="add-request-card">
                    <input
                        type="text"
                        className="add-request-input"
                        placeholder="איזה שיר בא לך לדעת לנגן?"
                        value={newRequestDes}
                        onChange={(e) => setNewRequestDes(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRequest()}
                    />
                    <button className="submit-request-btn" onClick={handleAddRequest}>שלח בקשה</button>
                </div>
            </div>

            <div className="requests-masonry-container">
                {requests.length > 0 ? (
                    requests.map((req, index) => (
                        <div
                            key={req.id}
                            className="request-card"
                            style={{
                                gridColumn: `span ${isMobile ? 1 : spanOptions[index % spanOptions.length]}`
                            }}
                        >
                            <div className="request-header">
                                <span className="creator-name">מאת: {req.creatorName || 'אנונימי'}</span>
                                <span className="votes-count">🔥 {req.votesCount || 0}</span>
                            </div>
                            <div className="request-body">{req.songDes}</div>
                            <div className="request-footer">
                                <span className="created-at">
                                    {req.date ? new Date(req.date).toLocaleDateString('he-IL') : ''}
                                </span>
                                {!req.isFulfilled ? (
                                    <button
                                        className={req.isVotedByMe ? "vote-button active" : "vote-button"}
                                        onClick={() => handleVote(req.id!)}
                                    >
                                        {req.isVotedByMe ? "ביטול" : "גם אני רוצה"}
                                    </button>
                                ) : (
                                    <>
                                        <span className="status-done">✅ בוצע</span>
                                        <Link to={`/chords/${createSlug({ name: "", artist: '', id: req.songLink } as SongDto)}`}>לאקרודים</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-requests">אין בקשות כרגע...</p>
                )}
            </div>
        </div>
    );
}

export default SongRequest;