import {JSX} from "react";
import {NavLink} from "react-router";

interface Props {
    item: {
        name: string;
        icon: JSX.Element;
        path: string;
    };
    sidebarWidth: number;
}

const NavItem = ({item,  sidebarWidth}: Props) => {
    const inactiveColor = 'hover:text-blue-500';
    const activeColor = 'text-white bg-blue-500';
    return (
        <li key={item.path} className={'flex flex-row '}><NavLink
            className={({isActive}) => (isActive ? activeColor : inactiveColor)}
            to={item.path}>
            <div className={'flex flex-row  items-center p-5'}>
                {item.icon}
                <div className={'w-1'}/>
                <p className={' font-semibold text-nowrap '}>{item.name}</p>
            </div>
            <div className={'h-0.5 bg-blue-50'} style={{width: sidebarWidth}}/>
        </NavLink>
        </li>
    );
};

export default NavItem;