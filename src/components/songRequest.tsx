import { useEffect, useState } from "react";
import { type ApiResponse, type SongRequestDto } from "../types";
import { getAllRequests, addSongRequest } from "../services/songRequestService";
import { ToggleVote } from "../services/songRequestVoteService";
import '../style/SongRequest.css';
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

function SongRequest() {
    const [requests, setRequests] = useState<SongRequestDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newRequestDes, setNewRequestDes] = useState<string>("");
    const token = useSelector((state: RootState) => state.auth.token);

    const loadRequests = async () => {
        
        try {
            setLoading(true);
            const data = await getAllRequests();
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

    const handleAddRequest = async () => {
        if (!token) {
            alert('אנא התחבר כדי לשלוח את הבקשה')
            return
        }
        if (!newRequestDes.trim()) return;
        try {
            const response = await addSongRequest({ songDes: newRequestDes });
            setRequests([response, ...requests]);
            alert('בקשתך נשלחה בהצלחה')
            setNewRequestDes("");
        } catch (err) {
            console.error(err);
        }
    };

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

    if (loading) return <div className="loader">טוען בקשות...</div>;

    return (
        <div className="requests-container" dir="rtl">

            <div className="add-request-card">
                <input
                    type="text"
                    className="add-request-input"
                    placeholder="איזה שיר בא לך לדעת לנגן?"
                    value={newRequestDes}
                    onChange={(e) => setNewRequestDes(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddRequest()}
                />
                <button className="vote-button" onClick={handleAddRequest}>שלח בקשה</button>
            </div>

            {requests.length === 0 ? (
                <p className="no-requests">אין בקשות כרגע...</p>
            ) : (
                requests.map((req) => (
                    <div key={req.id} className="request-card">
                        <div className="request-header">
                            <span className="creator-name">מאת: <strong>{req.creatorName || 'אנונימי'}</strong></span>
                            <span className="votes-count">🔥 {req.votesCount || 0}</span>
                        </div>
                        <div className="request-body">{req.songDes}</div>
                        <div className="request-footer">
                            <span className="created-at">{req.date || ''}</span>
                            {!req.isFulfilled ? (
                                <button
                                    className={req.isVotedByMe ? "vote-button active" : "vote-button"}
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