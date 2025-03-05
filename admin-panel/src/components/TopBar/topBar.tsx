import {IoIosNotifications} from "react-icons/io";

import './topbar.css'
import logo from '/logo.png'
import profile from '/profile.png'
import {NavLink} from "react-router";
import SearchForm from "./searchForm.tsx";


function TopBar() {
    return (
        <div className={'navbar sticky w-full '}>

            <NavLink to={'/'}><img src={logo} alt={'logo'} width={105}/></NavLink>

            <h3 className={'heading'}>Dashboard</h3>

            <SearchForm/>

            <IoIosNotifications size={35} color={'#dfcbcb'}/>

            <div className={'flex flex-row items-center'}>
                <img src={profile} alt={'profile'} width={45}/>
                <div>
                    <h3 style={{fontWeight: "400", lineHeight: 1, color: 'white', fontSize: 15}}>Liaqat Ali</h3>
                    <p style={{color: '#c3c6d2', lineHeight: 1, fontSize: 12}}>Admin</p>
                </div>

            </div>


        </div>
    );
}

export default TopBar;