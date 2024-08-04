import request from "../../config/apiConfig";

const loginApi = async ({ email, password }) => {
    const res = await request({
        method: 'POST',
        path: '/customers/login',
        data: {
            email: email,
            password: password,
        }
    });
    return res;
}


const getUser = async () => {
    const res = await request({
        method: 'GET',
        path: '/customers'
    });
    return res;
}

export { loginApi, getUser };