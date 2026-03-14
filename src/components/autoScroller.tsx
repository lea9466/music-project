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
    }, [isScrolling,fast]);
    useEffect(() => {
        return () => stopScrolling();
    }, []);

    return (
        <>
            <div className="divBtns">
                <button className="btn" onClick={() => setIsScrolling(!isScrolling)}>
                    {isScrolling ? 'Stop' : 'Start Scroll'}
                </button>
                <div className="btns">
                    <button onClick={() => setFast(fast - 10)}>+</button>
                    <button onClick={() => setFast(fast + 10)}>-</button>
                </div>
            </div>
        </>

    );
}
export default AutoScroller