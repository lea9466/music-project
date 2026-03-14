import axios from "axios"
const baseURL = 'https://localhost:7088/api'

const axiosInstance = axios.create({ baseURL })

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// axiosInstance.interceptors.request.use(request => {
//     // להוסיף נתונים לקריאה
//     // לבצע בדיקות
//     debugger
//     return request
// })

// axiosInstance.interceptors.response.use(response => {
//     debugger
//     if (response.status === 401) {
//         location.href = '/login'
//     }
//     return response
// })

export default axiosInstance