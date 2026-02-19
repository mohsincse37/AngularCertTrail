import React from 'react';
import MenuItems from './MenuItems';

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
    const nextDepthLevel = depthLevel + 1;
    const dropdownPosition = depthLevel > 0 ? 'left-full top-0' : 'left-0 top-full';

    return (
        <ul
            className={`dropdown absolute ${dropdownPosition} mt-0 w-48 bg-white shadow-lg rounded-lg z-50 ${dropdown ? 'block' : 'hidden'}`}
            style={{ listStyle: 'none', padding: '0' }}
        >
            {submenus.map((submenu, index) => (
                <li key={index} className="px-4 py-2 hover:bg-gray-100">
                    <MenuItems items={submenu} depthLevel={nextDepthLevel} />
                </li>
            ))}
        </ul>
    );
};

export default Dropdown;