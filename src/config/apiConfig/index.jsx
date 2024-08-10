import axios from "axios";
import { Cookies } from "react-cookie";

export const BASE_URL = 'http://localhost:8080/';

const request = async ({
    method = 'GET',
    path = '',
    data = {},
    header = {},
}) => {
    const cookie = new Cookies();
    const token = cookie.get('token');

    const res = await axios({
        method: method,
        baseURL: BASE_URL,
        url: path,
        data: data,
        headers: {
            Authorization: `${header}${token}`
        }
    });
    return res.data;
}

export default request;