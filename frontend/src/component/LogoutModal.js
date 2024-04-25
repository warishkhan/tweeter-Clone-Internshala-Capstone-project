import React, { useState } from 'react';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './LogoutModal.css'

const LogoutModal = () => {
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        toast.success("Logout successful");
        navigate("/login");
    };

    return (
        <div>
            <div className='m-0 p-0 d-flex curser-pointer'>
            <FontAwesomeIcon className="me-0 me-sm-0 me-md-0 me-lg-2" icon={faDoorOpen} onClick={() => setShowModal(true)} />
            <span className='d-none d-sm-none d-md-none d-lg-block' onClick={() => setShowModal(true)}>Logout</span>
            </div>

            {/* Bootstrap Modal */}
            {showModal && (
                <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content" style={{zIndex: 1050}}>
                            <div className="modal-header">
                                <p>Are you sure you want to logout?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"  onClick={()=>setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary"  onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LogoutModal;
