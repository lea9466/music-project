import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor לבקשות (הוספת טוקן)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor לתגובות (טיפול בשגיאות והצלחות)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "קרתה שגיאה בלתי צפויה";

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // 1. טיפול ספציפי בשגיאת הרשאה (טוקן חסר או לא תקין)
            if (status === 401) {
                message = "פג תוקף ההתחברות, נא להתחבר מחדש";
                // אופציונלי: לנקות שאריות טוקן ולשלוח לדף התחברות
                localStorage.removeItem("token");
                // window.location.href = "/login"; 
            }
            // 2. טיפול בשגיאת "שיטה לא מורשית" (ה-405 שקיבלת קודם)
            else if (status === 405) {
                message = "פעולה לא מורשית (Method Not Allowed)";
            }
            // 3. חילוץ הודעה מה-Middleware או BadRequest (כמו קודם)
            else if (data?.details) {
                message = data.details;
            }
            else if (data?.message) {
                message = data.message;
            }
            else if (typeof data === 'string' && data.length > 0) {
                message = data;
            }
            else {
                message = `שגיאת שרת (${status})`;
            }
        }
        else if (error.request) {
            message = "אין מענה מהשרת - בדקו חיבור אינטרנט";
        }

        toast.error(message);
        return Promise.reject(error);
    }
);

export default axiosInstance;