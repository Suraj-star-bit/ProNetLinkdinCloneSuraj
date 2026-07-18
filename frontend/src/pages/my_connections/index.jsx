import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashBoardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnection, getMyConnectionRequest , getConnectionRequest} from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config/clientServer';
import styles from "./index.module.css"
import { useRouter } from "next/router";




export default function MyConnectionsPage() {
    
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth)
    

    useEffect(() => {
    const token = localStorage.getItem("token");

    dispatch(getMyConnectionRequest({ token }));
    dispatch(getConnectionRequest({ token }));
}, [dispatch]);

const router = useRouter();


    useEffect(() => {
        if (authState.connectionRequest.length !== 0) {
        console.log(authState.connectionRequest);
    }
    } , [authState.connectionRequest])

    const UPLOADS_BASE = BASE_URL.replace("/api", "") + "/uploads";
    console.log(authState.connectionRequest);

    return (
    <UserLayout>

        <DashBoardLayout>
            <div>
                <h1>My connections</h1>

                {authState.connectionRequest.length === 0 && <p>-------</p>}
                {authState.connectionRequest.length != 0  && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user , index) => {
                console.log(`${BASE_URL}/uploads/${user.connectionId.ProfilePicture}`);
                return (
                    <div onClick={() => {
                        router.push(`/view_profile/${user.connectionId.username}`)
                    }} className={styles.userCard} key={index}>
                        <div style={{display:"flex" , alignItems:"center"}}>
                            <div className={styles.profilePic}>
                                <img
                                src={`${UPLOADS_BASE}/${user.connectionId.ProfilePicture}`}
                                alt="Profile"
                                />
                            </div>
                            <div className={styles.userInfo}>
                                <h3>{user.connectionId.name}</h3>
                                <p>{user.connectionId.username}</p>
                            </div>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                dispatch(AcceptConnection({
                                    connectionId: user._id,
                                    token: localStorage.getItem("token"),
                                    action: "accept"
                                }))
                            }} className={styles.connectBtn}>
                                Accept
                            </button>
                        </div>

                    </div>
                );
                }) }
                
                
                <p>My Network</p>

        {authState.connections.length === 0 && (
            <h3>No Connections</h3>
        )}

        {authState.connections.map((user, index) => {
            return (
                <div
                    key={index}
                    onClick={() => {
                        router.push(`/view_profile/${user.connectionId.username}`);
                    }}
                    className={styles.userCard}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div className={styles.profilePic}>
                            <img
                                src={`${UPLOADS_BASE}/${user.connectionId.ProfilePicture}`}
                                alt="Profile"
                            />
                        </div>

                        <div className={styles.userInfo}>
                            <h3>{user.connectionId.name}</h3>
                            <p>{user.connectionId.username}</p>
                        </div>
                    </div>
                </div>
            );
        })}



            </div>
        </DashBoardLayout>
    
    
        </UserLayout>
)
}
