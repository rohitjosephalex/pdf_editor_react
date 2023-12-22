// eslint-disable-next-line no-unused-vars
import React, { useRef, useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';


function NavBar() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();



    const darkMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'dark');
      };
    
      const lightMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'light');
      };
    
      const toggleTheme = (e) => {
        if (e.target.checked) darkMode();
        else lightMode();
      };

    const handleOtpSend=()=>{
        setIsLogin(true)
      }
      const handleMyfiles=()=>{
    
       if(isLogin)
       {
        console.log("hello")
        navigate('/userfiles')
    
       }
       else{
        alert("Login to acess my files")
       }
      }

  return (
    <div>
   <header className='header-top'>
          <p className='header-item name'>pdfEditor</p>
          <div className='header-top page-btn'>
            <p className='header-item components '>Explore</p>
            {/* <button className='btn btn-primary proceed' id="confirm pickup" onClick={handleMyfiles}  > My Files </button> */}
            <p className='header-item components'>Login</p>
            {/* <Popup trigger=
              {<button className='btn btn-primary proceed' id="confirm pickup"   > Login </button>}
              modal nested>
              {
                close => (
                  <div className='popup-container login' >
                    <div className='popup-container content'  >
                      <h3>Login to your account</h3>

                      <input
                        className='input'
                        type='text'
                        id='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input
                        className='input'
                        type='text'
                        id='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />

                      <button className='btn btn-primary' id="confirm pickup" onClick={() => {handleOtpSend(); if(isLogin==true){close();}}} > Login </button>
                      <div>
                        <button className="popup-close" onClick=
                          {() => { close(); }}>

                        </button>
                      </div>
                    </div>


                  </div>
                )
              }
            </Popup> */}
          </div>
          <div className='header-top dark-btn'>
            <p className='header-item'>Dark Mode</p>
            <label className="switch">
              <input type="checkbox" onChange={toggleTheme} />
              <span className="slider round"></span>
            </label>
          </div>
        </header>
    </div>
  );
}

export default NavBar;
