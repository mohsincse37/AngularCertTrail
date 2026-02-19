import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from '../components/Dropdown';
import { API_URL } from "../components/API_URL";

const MenuItems = ({ items, depthLevel }) => {
    const [dropdown, setDropdown] = useState(false);
    const ref = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (event) => {
            if (dropdown && ref.current && !ref.current.contains(event.target)) {
                setDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [dropdown]);

    const onMouseEnter = () => {
        setDropdown(true);
    };

    const onMouseLeave = () => {
        setDropdown(false);
    };

    const isActive = window.location.pathname === items.pageName;

    return (
        <li
            className="nav-item relative"
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >

            {items.submenu ? (
                <>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={dropdown ? "true" : "false"}
                        onClick={() => setDropdown((prev) => !prev)}
                        className={`btn flex items-center text-dark font-medium w-full text-left ${isActive ? 'active' : ''}`}
                    >
                        {items.title}{' '}
                        {depthLevel > 0 ? (
                            <span className="ml-1">»</span>
                        ) : (
                            <span className="arrow ml-1 border-t-0 border-r-0 border-b-4 border-l-4 border-transparent border-b-gray-700 inline-block w-0 h-0"></span>
                        )}
                    </button>
                    <Dropdown
                        submenus={items.submenu}
                        dropdown={dropdown}
                        depthLevel={depthLevel}
                    />
                </>
            ) : (
                <a
                    href={items.pageName}
                    className={`text-dark font-medium transition-colors duration-200 ${isActive ? 'active' : ''}`}
                >
                    {items.title}
                </a>

            )}
        </li>
    );
};

export default MenuItems;