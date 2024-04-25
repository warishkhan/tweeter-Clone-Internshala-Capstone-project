import React from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {   faHome, faMale, faMessage,} from "@fortawesome/free-solid-svg-icons";
import './Sidebar.css'
import { useSelector} from "react-redux";
import LogoutModal from './LogoutModal';
import userImg from '../images/Users.png'
const Sidebar = ({setZindex}) => {

  const {user} = useSelector(state => state.userReducer);

  return (
    <>
        <div className="position-sticky d-flex justify-content-center align-items-center flex-column"
            style={{height: "99.9vh", position: "sticky", top: "0",}}>
            <p><FontAwesomeIcon className="text-info m-3 fs-1" icon={faMessage} /></p>
            <div className="d-flex justify-content-between flex-column" style={{ height: "85%" }}>
              <ul className="list-group">
                <li className="mb-3 list-group-item sideBarBtn border-0 outline-0" style={{ borderRadius: "20px"}}>
                  <Link className="text-decoration-none d-flex text-dark" to={"/"}><FontAwesomeIcon className="me-0 me-sm-0 me-md-0 me-lg-2" icon={faHome}/>
                    <span className='d-none d-sm-none d-md-none d-lg-block'>Home</span>
                  </Link>
                </li>
                <li className="mb-3 list-group-item sideBarBtn border-0 outline-0"  style={{ borderRadius: "20px" }}>
                  <Link className="text-decoration-none d-flex text-dark" to={`/user/${user._id}`}><FontAwesomeIcon className="me-0 me-sm-0 me-md-0 me-lg-2" icon={faMale}/>
                  <span className='d-none d-sm-none d-md-none d-lg-block'>Profile</span>
                  </Link>
                </li>
                <li className="mb-3 list-group-item sideBarBtn border-0 outline-0 d-flex" onClick={()=>setZindex(-1)} style={{ borderRadius: "20px",cursor:"pointer" }}>
                <LogoutModal/>
                </li>
              </ul>
              <div>
                <div className="d-flex justify-content-start align-items-center p-0 cursorCss">
                <img src={!user.profilePicture ? userImg : String(`http://localhost:4000/${user.profilePicture}`)} alt="img" className="img-fluid m-0" style={{borderRadius:"50%", width:"50px",height:"50px"}}/>
                  <div className='d-none d-sm-none d-md-none d-lg-block'>
                    <p className="fs-5 fw-bold m-0">{user.name}</p>
                    <p className="m-0">@{user.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  )
}

export default Sidebar