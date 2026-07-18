import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./style.module.css"
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

export default function LoginComponent() {

  const authState = useSelector((state) => state.auth) 
  
  const router = useRouter();

  const dispatch = useDispatch();

  const [UserLoginMethod, setUserLoginMethod] = useState(false);

  const [email , setEmailAddress] = useState("");
  const [password , setPassword] = useState("");
  const [username , setUsername] = useState("");
  const [name , setName] = useState(""); 

  const authMessage = typeof authState.message === "string"
    ? authState.message
    : authState.message?.message;
  
    useEffect(() => {
        if(authState.token){
          localStorage.setItem("token", authState.token);
          router.push("/dashboard");
      }
    }, [authState.token]);

    useEffect(() => {
      if(localStorage.getItem("token")){
        router.push("/dashboard")
      }
    }, [])

    useEffect(() => {
      dispatch(emptyMessage());
    }, [UserLoginMethod])

  const handleRegister = async () => {
  if(!username || !name || !email || !password){
    alert("Please fill all fields");
    return;
  }

  await dispatch(
    registerUser({
      username,
      name,
      email,
      password,
    })
  );
};
    const handleLogin = () => {
      if(!email || !password){
        alert("Please fill all fields");
        return;
      }

      dispatch(loginUser({
        email,
        password
      }));
    }

    useEffect(() => {
  if (authState.isSuccess) {
    setUsername("");
    setName("");
    setEmailAddress("");
    setPassword("");

    setUserLoginMethod(true);
  }
}, [authState.isSuccess]);

  return (
    <UserLayout>
      <div className={styles.container} >
        <div className= {styles.cardContainer}>

          <div className={styles.cardContainer__left}>

            <p className={styles.cardleft_heading }>{UserLoginMethod ? "Sign in" : "Sign Up"}</p>
            <p style={{color : authState.isError ? "red" : "green"}}>
              {authMessage}
            </p>
            
            <div className={styles.inputContainers}>

            {!UserLoginMethod  &&  <div className={styles.inputRow}>
                  <input value={username} onChange={(e) => {setUsername(e.target.value)}} className={styles.inputField} type="text" placeholder="username" />
                  <input value={name} onChange={(e) => {setName(e.target.value)}}  className={styles.inputField} type="text" placeholder="name" />
                </div> }
                
                <input value={email} onChange={(e) => {setEmailAddress(e.target.value)}} className={styles.inputField} type="text" placeholder="Email"/>
                
                <input value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="password" />
                    
                <div onClick={() => {
                  if(UserLoginMethod){
                    handleLogin(); 
                  }else {
                    handleRegister();
                  }
                }}className={styles.buttonWithOutLine}>
                  <p>{UserLoginMethod ? "Sign in" : "Sign Up"}</p>

                </div>

            </div>
            
          </div>

          <div className={styles.cardContainer__right}>
            
        
            {UserLoginMethod ? <p>Don't Have an Account</p> : <p>Already Have an Account</p>}
            <div onClick={() => {
                  setUserLoginMethod(!UserLoginMethod)
                }} style={{color : "white"} } className={styles.buttonWithOutLine}>
                  <p>{UserLoginMethod ? "Sign Up" : "Sign In "}</p>

                  </div>

                
          </div>


        </div>
      </div>

    </UserLayout>
  )
}
