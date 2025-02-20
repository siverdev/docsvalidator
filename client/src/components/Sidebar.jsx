import { NavLink } from "react-router-dom";
import { FaBook, FaFileAlt } from "react-icons/fa";

const Sidebar = () => (
<nav className="w-1/3 max-w-xs bg-gray-100 h-full pt-6 pb-6 ">
        <ul className="space-y-2">
            <li>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 p-4 text-lg rounded 
                        hover:bg-gray-200 ${isActive ? "bg-gray-200 font-medium" : ""}`
                    }
                >
                    <FaBook className="text-blue-500" size={20} />
                    <span>Перевірка щоденника</span>
                </NavLink>
            </li>
            <li>
                <NavLink 
                    to="/check-arbitrary" 
                    className={({ isActive }) => 
                        `flex items-center space-x-3 p-4 text-lg rounded 
                        hover:bg-gray-200 ${isActive ? "bg-gray-200 font-medium" : ""}`
                    }
                >
                    <FaFileAlt className="text-blue-500" size={20} />
                    <span>Довільна перевірка</span>
                </NavLink>
            </li>
        </ul>
    </nav>
);

export default Sidebar;