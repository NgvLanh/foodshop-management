import request from "../../config/apiConfig";

const loginApi = async ({ email, password }) => {
    const res = await request({
        method: 'POST',
        path: '/customer/login',
        data: {
            email: email,
            password: password,
            device: "website",
        }
    });
    return res;
}


const getUser = async () => {
    const res = await request({
        method: 'GET',
        path: '/customer'
    });
    return res;
}

export { loginApi, getUser };