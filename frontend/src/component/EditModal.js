import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditModal = ({getSingleUserDetails}) => {
 const {id} = useParams()

 const [name, setName] = useState("");
  const [location , setLocation] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }
  const getEditUserDetails = async (event,userId) => {
    event.preventDefault();
    setLoading(true);
    const requestData = {  name,location,dateOfBirth }
    try {
    const response = await axios.put(`http://localhost:4000/api/v1/user/${userId}/`,requestData, CONFIG_OBJ);
   if(response.status === 201){
    setLoading(false);
    toast.success("Edit Successful");
   }
   setName("");
   setLocation("");
   setDateOfBirth("")
   getSingleUserDetails(userId)
    } catch (error) {
      toast.error(error)
    }

  }

  return (
    <>
         <button type="button" className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#userInformationModal">
    Edit
  </button>

  <div className="modal fade" id="userInformationModal" aria-labelledby="userInformationModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="userInformationModalLabel">Edit Profile</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form onSubmit={(e)=>getEditUserDetails(e,id)}>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" placeholder="FullName"  name="name"
            required value={name} onChange={(ev) => setName(ev.target.value)}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" className="form-control" id="location" placeholder="location"  name="location"
            required value={location} onChange={(ev) => setLocation(ev.target.value)}></input>
          </div>
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">Date of Birth</label>
            <input type="date" className="form-control" id="dateOfBirth" placeholder="DOB"  name="dateOfBirth"
            required value={dateOfBirth} onChange={(ev) => setDateOfBirth(ev.target.value)}></input>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <input type="submit" value={loading ?"loading":"save"} className="btn btn-primary"/>
        </div>
        </form>
      </div>
    </div>
  </div>
    </>
  )
}

export default EditModal