import axios from "axios";
import { Cookies } from "react-cookie";

export const BASE_URL = 'http://localhost:8080/';

const request = async ({
    method = '',
    path = '',
    data = {},
    header = {},
}) => {
    try {
        const cookie = new Cookies();
        const token = cookie.get('token');
        const res = await axios({
            method: method,
            baseURL: BASE_URL,
            url: path,
            data: data,
            headers: {
                ...header,
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        alert(error?.response?.data?.message || 'Error API Config.');
        return null;
    }
}

export default request;