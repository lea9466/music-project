import { useEffect, useRef, useState } from "react";
import '../style/autoScroller.css'

function AutoScroller() {
    const [isScrolling, setIsScrolling] = useState(false);
    const [fast, setFast] = useState(50)
    const intervalRef = useRef<any>(null);
    const stopScrolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        if (isScrolling) {
            intervalRef.current = setInterval(() => {
                window.scrollBy({
                    top: 1,
                    behavior: 'auto'
                });
            }, fast);
        } else {
            stopScrolling();
        }
        return () => {
            stopScrolling();
        };
    }, [isScrolling, fast]);
    useEffect(() => {
        return () => stopScrolling();
    }, []);

    return (
        <div className="divBtns">
            <button
                className={`btn-main ${isScrolling ? 'active' : ''}`}
                onClick={() => setIsScrolling(!isScrolling)}
            >
                {isScrolling ? 'Stop' : 'Start Scroll'}
            </button>

            <div className="speed-controls">
                {/* פלוס = יותר מהירות = פחות מילי-שניות */}
                <button
                    className="btn-speed material-symbols-outlined"
                    onClick={() => setFast(prev => prev - 10)}
                    title="מהיר יותר"
                >
                    add
                </button>

                {/* מינוס = פחות מהירות = יותר מילי-שניות */}
                <button
                    className="btn-speed material-symbols-outlined"
                    onClick={() => setFast(prev => prev + 10)}
                    title="איטי יותר"
                >
                    remove
                </button>
            </div>
        </div>
    );
}
export default AutoScroller