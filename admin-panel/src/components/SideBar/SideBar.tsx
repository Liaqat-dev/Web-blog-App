import {AiOutlineMenuFold, AiOutlineMenuUnfold} from "react-icons/ai";

import {navbarItems} from "../../constants";
import {useState} from "react";
import NavItem from "./NavItem.tsx";

interface Props {
    className?: string;
}

function SideBar(props: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    const sidebarWidth = isSidebarOpen ? 190 : 40;
    const menuIcon = isSidebarOpen ?
        <AiOutlineMenuFold size={35} className={'align-center text-blue-500'}/> :
        <AiOutlineMenuUnfold size={35} className={'align-center text-blue-500'}/>;
    return (
        <div
            className={`flex flex-col h-full fixed top-16 left-0 bg-red-200 overflow-hidden ease-in-out duration-150  ${props.className}`}
            style={{width: sidebarWidth}}>
            <section>
                <button className={'flex justify-center'}
                        onClick={toggleSidebar}>
                    <span key={'icon'}>{menuIcon}</span>
                        <p key={'title'} className={'text-blue-500'}
                           style={{fontSize: 30, fontWeight: 'bold', lineHeight: 1.1, paddingLeft: 10,}}>
                            MENU
                        </p></button>

            </section>
            <div className={'w-full bg-blue-50 h-0.5'}/>
            <nav className={'flex-1 flex-col overflow-hidden'}>
                <ul>
                    {
                        navbarItems.map((item, index) => (
                            <NavItem item={item} key={index} sidebarWidth={sidebarWidth}/>
                        ))
                    }
                </ul>

            </nav>
        </div>
    );
}

export default SideBar;