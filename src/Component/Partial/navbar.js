import React,{useState} from 'react';
import {Prompt, Redirect,useHistory,Link} from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import routes from '../../route';
import './navbar.css';
import { IconContext } from 'react-icons/lib';
function Navbar(props) {
    const [sidebar, SetSidebar] = useState(false);
    const ShowSideBar=()=>
        SetSidebar(!sidebar);
    const Logout=()=>{props.Logout();}
        
    
        return(
            <>
            <IconContext.Provider value={{color:'ffff'}}/>
            <div className="navbar">
                <Link to="#" className="menu-bars">
                <FaIcons.FaBars onClick={ShowSideBar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active':'nav-menu' }>
                <ul className="nav-menu-items" onClick={ShowSideBar}>
                    <li className="navbar-toggle">
                    <button className="btn-all" type="submit" onClick={Logout}>Đăng Xuất</button>
                    </li>
                    {routes.map((item,index)=>{
                        if(item.cName){
                        return(
                                <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.tittle}</span>
                            </Link>

                            </li>                          
                        )
                        }
                    })}
                </ul>
            </nav>
            </>
        )
    
}
export default Navbar;