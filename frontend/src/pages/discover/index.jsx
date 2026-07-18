import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashBoardLayout from '@/layout/DashboardLayout'
import { useDispatch } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import { useSelector } from 'react-redux'
import styles from './index.module.css'
import {useRouter} from 'next/router'

export default function DiscoverPage() {

    const authState = useSelector((state)=> state.auth)
    const dispatch = useDispatch();
    useEffect(() => {
        if(!authState.all_profiles_fetched){
            dispatch(getAllUsers())
        }
    }, [])
    const router = useRouter();
    const IMAGE_BASE_URL = "https://pronetlinkdinclonesuraj-0d8f.onrender.com/uploads";
    return (
    <UserLayout>

        <DashBoardLayout>

            <h1>Discover</h1>

            <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
                authState.all_users
                    .filter(user => user?.userId)
                    .map((user) => (
                    <div onClick={() => {
                        router.push("/view_profile/" + user.userId.username)

                    }
                    } key={user._id} className={styles.userCard}>
                        <img
                            className={styles.userCard_image}
                            src={
                                user.userId.ProfilePicture
                                    ? `${IMAGE_BASE_URL}/${user.userId.ProfilePicture}`
                                    : `${IMAGE_BASE_URL}/default.jpg`
                            }
                            alt={user.userId.username}
                        />
                        <div className={styles.usernameClk}>
                        <h3>{user.userId.name}</h3>
                        <p>{user.userId.username}</p>
                        </div>
                    </div>
                ))
            }
        </div>
        </DashBoardLayout>
    
    
        </UserLayout>
)
}
