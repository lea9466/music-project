import React, { useState, useEffect } from 'react';
import '../style/chordLikeButton.css';
import { toggleLike } from '../services/songService';

interface ChordLikeButtonProps {
    songId: number;
    initialLikesCount: number;
}

const ChordLikeButton: React.FC<ChordLikeButtonProps> = ({ songId, initialLikesCount }) => {
    const [likesCount, setLikesCount] = useState<number>(initialLikesCount);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    // טעינת המצב מ-localStorage או יצירתו אם אינו קיים
    useEffect(() => {
        const storedLikes = localStorage.getItem('chord_likes');
        
        if (!storedLikes) {
            localStorage.setItem('chord_likes', JSON.stringify([]));
            setIsLiked(false);
        } else {
            const likedSongs = JSON.parse(storedLikes) as number[];
            setIsLiked(likedSongs.includes(songId));
        }
    }, [songId]);

    const handleLike = async (): Promise<void> => {
        let likedSongs: number[] = [];
        const storedLikes = localStorage.getItem('chord_likes');

        if (storedLikes) {
            likedSongs = JSON.parse(storedLikes) as number[];
        } else {
            localStorage.setItem('chord_likes', JSON.stringify([]));
        }

        let newIsLiked = false;

        // 1. עדכון מקומי (Optimistic UI)
        if (isLiked) {
            likedSongs = likedSongs.filter(id => id !== songId);
            setLikesCount(prev => prev - 1);
            newIsLiked = false;
        } else {
            likedSongs.push(songId);
            setLikesCount(prev => prev + 1);
            newIsLiked = true;
        }

        localStorage.setItem('chord_likes', JSON.stringify(likedSongs));
        setIsLiked(newIsLiked);

        // 2. שליחת הבקשה לשרת בעזרת Axios
        try {
            await toggleLike(songId, newIsLiked);
        } catch (error) {
            console.error('Error updating chord like:', error);
            
            // 3. שחזור המצב במקרה של שגיאה בשרת
            if (newIsLiked) {
                likedSongs = likedSongs.filter(id => id !== songId);
                setLikesCount(prev => prev - 1);
            } else {
                likedSongs.push(songId);
                setLikesCount(prev => prev + 1);
            }
            
            localStorage.setItem('chord_likes', JSON.stringify(likedSongs));
            setIsLiked(!newIsLiked);
            alert('אירעה שגיאה בעדכון הלייק, אנא נסה שוב.');
        }
    };

    return (
        <button 
            onClick={handleLike}
            className={`chord-like-btn ${isLiked ? 'liked' : ''}`}
        >
            <span className="material-symbols-outlined">
                thumb_up
            </span>
            <span>האקורדים עזרו לי ({likesCount})</span>
        </button>
    );
};

export default ChordLikeButton;