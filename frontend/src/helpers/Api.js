// it is deprecated
import axios from "axios";

const api = axios.create({
    baseURL : "http://localhost:8000/",
    withCredentials: true,
})

api.interceptors.response.use(
    res => res,
    async error => {
        if (error.response?.status === 401 && !error.config._retry){
            error.config._retry = true;

            const res = await axios.post("refresh");
            localStorage.setItem("access_token", res.data.access_token)

            error.config.headers.Authorization =`Bearer ${res.data.access_token}`;

        return api(error.config);
        }

        return Promise.reject(error);
    }
)

export default api;
