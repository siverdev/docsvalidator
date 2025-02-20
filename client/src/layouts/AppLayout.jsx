import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
    return(
    <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-grow">
                <Sidebar />
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AppLayout;