import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import axios from "axios"

const Register = () => {

  const [name, setName] = useState("");
  const [username , setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const signup = (event) => {
      event.preventDefault();

      setLoading(true);
      const requestData = {  name, email,username, password }
      axios.post("http://localhost:4000/api/v1/register", requestData)
          .then((result) => {
              if (result.status === 201) {
                  setLoading(false);
                  toast.success("Registered Successful")
                }
              navigate("/login")
              setName('');
              setEmail('');
              setPassword('');
          })
          .catch((error) => {
              console.log(error);
              setLoading(false);
              toast.error("User Registration failed")
          })
  }

 
  return (
    <>
      <div className="fluid-container w-100 d-flex justify-content-center align-items-center" style={{ height: "100vh"}}>
      <div className="card mb-3 shadow border-0" style={{ width: "740px",backgroundColor:"#fff"}}>
  <div className="row g-0">
    <div className="col-md-4 d-flex justify-content-center align-items-center flex-column bg-primary">
      <p className="fs-3 text-white">Join Us</p>
      <p><FontAwesomeIcon className="text-white fs-1" icon={faMessage}/></p>
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h5 className="card-title mt-3 fw-bold">Register</h5>
        <form onSubmit={signup}>
        <input type="text" className="form-control my-3" id="FormControlInput1" placeholder="FullName"  name="name"
        required value={name} onChange={(ev) => setName(ev.target.value)}></input>
        <input type="email" className="form-control my-3" id="FormControlInput2" placeholder="Email"  name="email"
        required value={email} onChange={(ev) => setEmail(ev.target.value)}></input>
        <input type="text" className="form-control my-3" id="FormControlInput3" placeholder="Username"  name="username"
        required value={username} onChange={(ev) => setUsername(ev.target.value)}></input>
        <input type="password" className="form-control my-3" id="FormControlInput4" placeholder="Password"  name="password"
        required value={password} onChange={(ev) => setPassword(ev.target.value)}></input>
        <input type='submit' className='btn btn-dark mb-3' value={loading ?"loading":"Register"}></input>
        </form>
        <p>Already Registered?<span> <Link className='fw-bold' to={"/login"}>Login here</Link></span> </p>
      </div>
    </div>
  </div>
</div>
      </div>
    </>
  )
}

export default Register