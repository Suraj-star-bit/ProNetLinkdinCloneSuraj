import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';


export default function NavBarComponent() {
    const authState = useSelector((state) => state.auth)
    const currentUserName = authState.user?.userId?.name || authState.user?.userId?.username || "";
    const router = useRouter();
    const dispatch = useDispatch();

  return (



    <div className={styles.container} >
      <div className={styles.navBar}> 

        <h2 style={{cursor : "pointer"}} onClick={() => {
          router.push("/")
        }}>ProNet</h2>

        <div className={styles.navBarOptionContainer}>
            
            {authState.profileFetched && <div>
            <div className={styles.userActions}>
              <p className={styles.greeting}>Hey {currentUserName}</p>
              <p onClick={() => {
                router.push("/profile")
              }} style={{fontWeight : "bold" , cursor:"pointer"}}>Profile</p>

              <p onClick={() => {
                
                localStorage.removeItem("token")
                router.push("/login")
                dispatch(reset())
              }} style={{fontWeight : "bold" , cursor:"pointer"}}>logout</p>
            </div>
            
            </div>}

            {!authState.profileFetched && 
            <div onClick={ ()=>{
              router.push("/login")
              
            }} className={styles.buttonJoin}>
              <p>Be a part</p>
            </div>}
        </div>

      </div>
      
    </div>
  )
}
