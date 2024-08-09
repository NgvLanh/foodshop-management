import request from "../../config/apiConfig";

const loginApi = async ({ email, password }) => {
    const res = await request({
        method: 'POST',
        path: 'auth/login',
        data: {
            email: email,
            password: password,
        },
        header: ''
    });
    return res;
}


const getMyInfo = async () => {
    const res = await request({
        method: 'GET',
        path: 'users/my-info',
        header: 'Bearer '
    });
    return res;
}

export { loginApi, getMyInfo };