import axios from "./axios"
import { type FullSongDto, type GeminiSongResponse } from "../types"
const url = 'Gemini'

export const AIScan = async (song: Omit<FullSongDto, 'id'>) => {
    const response = await axios.post<GeminiSongResponse>(url, song)
    return response.data
    // return answer
}

const answer: GeminiSongResponse = {
    "Chords": [
        { "name": "G", "indexInLine": 1, "lineNumber": 2, "spaces": 0, "adding": "7", "reason": "פתיחה דומיננטית ליצירת תנועה למנגינה" },
        { "name": "D", "indexInLine": 2, "lineNumber": 2, "spaces": 3, "adding": "m6", "reason": "הוספת הדרמה של ה-6 למודוס המינורי" },
        { "name": "F", "indexInLine": 3, "lineNumber": 2, "spaces": 3, "adding": "maj7", "reason": "ריכוך המעבר לפני הסיומת של הפתיחה" },
        { "name": "E", "indexInLine": 4, "lineNumber": 2, "spaces": 4, "adding": "7", "reason": "אקורד דומיננטה קלאסי שמושך ל-Am של הבית" },
        { "name": "A", "indexInLine": 1, "lineNumber": 4, "spaces": 0, "adding": "m9", "reason": "הוספת הנונה (9) מעניקה תחושת מרחב ו'יקום עצום'" },
        { "name": "D", "indexInLine": 1, "lineNumber": 6, "spaces": 0, "adding": "m6", "reason": "יצירת מתח הרמוני על המילה 'בלימה'" },
        { "name": "A", "indexInLine": 2, "lineNumber": 6, "spaces": 10, "adding": "m", "reason": "חזרה ליציבות של טוניקת הבית" },
        { "name": "D", "indexInLine": 1, "lineNumber": 8, "spaces": 0, "adding": "m", "reason": "ביסוס התחושה המלנכולית של הלב הנדהם" },
        { "name": "D", "indexInLine": 2, "lineNumber": 8, "spaces": 14, "adding": "m6", "reason": "גוון נוסטלגי לאקורד המינורי" },
        { "name": "A", "indexInLine": 1, "lineNumber": 10, "spaces": 8, "adding": "madd9", "reason": "הדגשת הדלות של הלשון מול גודל המציאות" },
        { "name": "D", "indexInLine": 1, "lineNumber": 12, "spaces": 0, "adding": "m7", "reason": "יצירת זרימה לכיוון המתח של ה-E7" },
        { "name": "E", "indexInLine": 2, "lineNumber": 12, "spaces": 16, "adding": "7(b9)", "reason": "הוספת הבמול 9 יוצרת מתח דרמטי לפני ה'כמיהה'" },
        { "name": "A", "indexInLine": 1, "lineNumber": 15, "spaces": 1, "adding": "m", "reason": "נחיתה רכה על המילה 'נפשי'" },
        { "name": "D", "indexInLine": 1, "lineNumber": 17, "spaces": 1, "adding": "m6", "reason": "חיזוק תחושת הצעקה הפנימית" },
        { "name": "E", "indexInLine": 1, "lineNumber": 19, "spaces": 15, "adding": "7", "reason": "הכנה הרמונית לקראת השאלה שבפזמון" },
        { "name": "A", "indexInLine": 1, "lineNumber": 22, "spaces": 1, "adding": "m", "reason": "פתיחת הפזמון בטוניקה מוכרת" },
        { "name": "F", "indexInLine": 2, "lineNumber": 22, "spaces": 14, "adding": "maj7", "reason": "מעבר מפתיע למז'ור שמעלה את האנרגיה" },
        { "name": "G", "indexInLine": 1, "lineNumber": 24, "spaces": 5, "adding": "sus4", "reason": "יצירת השהיה לפני המעבר ל-C" },
        { "name": "C", "indexInLine": 2, "lineNumber": 24, "spaces": 12, "adding": "maj7", "reason": "תחושת פלא והרחבה של הסאונד" },
        { "name": "D", "indexInLine": 1, "lineNumber": 26, "spaces": 1, "adding": "m9", "reason": "סאונד מודרני לתיאור ה'ברייה המופלאה'" },
        { "name": "A", "indexInLine": 1, "lineNumber": 28, "spaces": 0, "adding": "m", "reason": "חזרה למוקד השאלה על בעל הבירה" },
        { "name": "D", "indexInLine": 1, "lineNumber": 30, "spaces": 1, "adding": "m6", "reason": "סגירת מעגל הרמונית בתוך הפזמון" },
        { "name": "A", "indexInLine": 1, "lineNumber": 32, "spaces": 0, "adding": "m", "reason": "ביסוס הקרקע המוזיקלית" },
        { "name": "D", "indexInLine": 1, "lineNumber": 34, "spaces": 0, "adding": "m7", "reason": "תנועה קדימה לקראת סוף הקטע" },
        { "name": "D", "indexInLine": 2, "lineNumber": 34, "spaces": 12, "adding": "m6", "reason": "הוספת צבע ומתח מוזיקלי" },
        { "name": "E", "indexInLine": 1, "lineNumber": 36, "spaces": 0, "adding": "7", "reason": "דומיננטה לקראת החזרה לשקט או לסיום" },
        { "name": "A", "indexInLine": 2, "lineNumber": 36, "spaces": 13, "adding": "m", "reason": "סיום בטוח ויציב על המילה 'נעימה'" },
        { "name": "G", "indexInLine": 1, "lineNumber": 39, "spaces": 0, "adding": "7", "reason": "חזרה על מוטיב הפתיחה למנגינת הסיום" },
        { "name": "D", "indexInLine": 2, "lineNumber": 39, "spaces": 3, "adding": "m6", "reason": "דעיכה הדרגתית של המתח" },
        { "name": "F", "indexInLine": 3, "lineNumber": 39, "spaces": 3, "adding": "7", "reason": "גיוון אחרון לפני האקורד הסופי" },
        { "name": "E", "indexInLine": 4, "lineNumber": 39, "spaces": 4, "adding": "sus4", "reason": "סיום פתוח שמשאיר מקום למחשבה" }
    ],
    "MusicalRecommendations": "השיר בנוי על סולם מינורי עם תחושה ליטורגית עמוקה. בבתים, מומלץ לנגן בליווי פסנתר או גיטרה בפריטה עדינה (Arpeggio) כדי לתת מקום לטקסט. במעבר לפזמון ('מה לך ומניין לך'), כדאי להגביר את עוצמת הנגינה (Crescendo) ולהשתמש באקורדים רחבים יותר כמו ה-Fmaj7 וה-Cmaj7 שהוספתי, כדי ליצור תחושת התפעלות. בשורה 'מי הוא בעל הבירה', מומלץ לבצע עצירה קטנה (Rubato) לפני הנחיתה על האקורד האחרון כדי להדגיש את חשיבות השאלה."
}

