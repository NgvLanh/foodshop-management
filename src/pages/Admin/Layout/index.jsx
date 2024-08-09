import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { getMyInfo } from "../../../services/Auth";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../../components/Admin/Header";
import Sidebar from "../../../components/Admin/SideBar";

const Admin = () => {
    const [cookie, setCookie, removeCookie] = useCookies(['token', 'role']);

    useEffect(() => {
        // getUserInfo();
    }, [cookie]);


    const getUserInfo = async () => {
        const res = await getMyInfo();
        if (res?.role !== cookie?.role) {
            setCookie(res?.role);
        }
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex">
                <Sidebar />
                <div className="d-flex flex-column w-100">
                    <Header />
                    <Outlet />
                </div>
            </div>
            {/* <h1 className="text-danger pt-3 pb-3">Footer</h1> */}
        </div>
    )
}

export default Admin;