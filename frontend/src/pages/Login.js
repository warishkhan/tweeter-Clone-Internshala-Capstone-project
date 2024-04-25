import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faMessage } from '@fortawesome/free-solid-svg-icons'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const Login = () => {
  
  const [username , setUsername] = useState("")
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = (event) => {
      event.preventDefault();
      setLoading(true);
      const requestData = { username, password }
      axios.post("http://localhost:4000/api/v1/login", requestData)
          .then((result) => {
              if (result.status === 200) {
                  setLoading(false);
                  localStorage.setItem("token", result.data.token);
                  localStorage.setItem('user', JSON.stringify(result.data.user));
                  dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.user });
                  setLoading(false);
                  navigate('/');
              }
          })
          .catch((error) => {
              console.log(error);
              setLoading(false);
              toast.error({
                  icon: 'error',
                  title: error.response.data.error
              })
          })
  }
  
  return (
    <>
      <div className="fluid-container w-100 d-flex justify-content-center align-items-center" style={{ height: "100vh"}}>
      <div className="card mb-3 shadow border-0" style={{ width: "740px",backgroundColor:"#fff"}}>
  <div className="row g-0">
    <div className="col-md-4 d-flex justify-content-center align-items-center flex-column bg-primary">
      <p className="fs-3 text-white">Welcome Back</p>
      <p><FontAwesomeIcon className="text-white fs-1" icon={faMessage}/></p>
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h5 className="card-title mt-3 fw-bold">Log in</h5>
        <form onSubmit={login}>
        <input type="text" className="form-control my-3" id="FormControlInput5" placeholder="Username" required
         value={username} onChange={(ev) => setUsername(ev.target.value)}></input>
        <input type="password" className="form-control my-3" id="FormControlInput6" placeholder="Password" required
         value={password} onChange={(ev) => setPassword(ev.target.value)}></input>
        <input type='submit' className='btn btn-dark mb-3' value={loading?"loading":"Login"} ></input>
        </form>
        <p>Don't have an account?<span> <Link className='fw-bold' to={'/register'}>Register here</Link></span> </p>
      </div>
    </div>
  </div>
</div>
</div>
    </>
  )
}

export default Login