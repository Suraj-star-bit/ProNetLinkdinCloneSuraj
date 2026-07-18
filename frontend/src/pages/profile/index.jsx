import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashBoardLayout from '@/layout/DashboardLayout'
import { getAboutUser } from '@/config/redux/action/authAction'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css"
import { useState } from 'react'
import clientServer, { BASE_URL, UPLOADS_BASE } from "../../config/clientServer";
import { useRouter } from 'next/router'


export default function ProfilePage() {

    const dispatch = useDispatch();
    const authState = useSelector((state)=> state.auth )
    const router = useRouter();
    const [userProfile , setUserProfile] = useState({})
    const [userPost, setUserPost] = useState([]);

    const profileData = userProfile?.profile || userProfile;
    const { username } = router.query;
    const bioText = profileData?.bio?.trim() || "No bio added yet.";

    const [isModelOpen , setIsModelOpen] = useState(false);
    const [inputData, setInputData] = useState({company: '' , position: '' , years: ''})

    const handelWorkInputChange = (e) => {

        const {name , value} = e.target;
        setInputData({...inputData , [name]: value})
    }
    useEffect(()=> {
        dispatch(getAboutUser({token : localStorage.getItem("token")}))
    } , [])

    useEffect(()=> {
        setUserProfile(authState.user)
    }, [authState.user])

    const updateProfilePicture = async (file) => {

        const formData = new FormData();
        formData.append("profilePicture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }

if (!userProfile || !userProfile.userId) {
    return <div>Loading...</div>;
}

    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        });

        const response = await clientServer.post("/update_profile_data", {
            token:localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        });
        dispatch(getAboutUser({token: localStorage.getItem("token")}));
    }


    console.log(userProfile.pastWork);

    return (
    <UserLayout>
        <DashBoardLayout>
            {authState.user &&
            <div className={styles.profileContainer}>

            <div className={styles.backDropContainer}>
    <div className={styles.profileImageWrapper}>
        <img
            src={
                profileData?.userId?.ProfilePicture
                    ? `${UPLOADS_BASE}/${profileData.userId.ProfilePicture}`
                    : `${UPLOADS_BASE}/default.jpg`
            }
            alt="profile"
        />

        <div className={styles.backDrop__overlay}>
            <label htmlFor="profilePictureUp" className={styles.cameraIcon}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
                </svg>
            </label>
                <input onChange={(e) => {
                    updateProfilePicture(e.target.files[0]);
                }} type="file" id="profilePictureUp" className={styles.fileInput} />
            </div>
                </div>
            </div>

            <div className={styles.profileHeader}>
                <div className={styles.profileDetails}>
                    <input className={styles.nameEdit} type="text" value={userProfile?.userId?.name || ""} onChange={(e) => {
        setUserProfile({
            ...userProfile,
            userId: {
                ...userProfile?.userId,
                name: e.target.value,
            },
        });
    }}/> 
                    <p className={styles.userName}>@{profileData?.userId?.username || username || "unknown"}</p>
                </div>

                
            </div>

            <div className={styles.bioCard}>
                <textarea value={userProfile.bio}
                    onChange={(e) =>{
                        setUserProfile({...userProfile,bio: e.target.value});
                    }}
                    rows={Math.max(Math.ceil(userProfile.bio.length / 80))}
                    style={{width: "100%"}}
                />
            </div>

            
                <div className={styles.workHistory}>
                    <h4 className={styles.sectionTitle}>Work History</h4>

                    {profileData?.pastWork
                        ?.filter(work => work.company.trim() || work.position.trim() || work.years.trim())
                        .map((work, index) => (
                            <div key={index} className={styles.workCard}>
                                <h4>{work.position}</h4>
                                <p>{work.company}</p>
                                {work.years && <span>{work.years} years</span>}
                            </div>
                    ))}

                    <button className={styles.addWorkBtn} onClick={() => {
                        setIsModelOpen(true)
                    }} >
                        + Add Work
                    </button>
                </div>
            

            <div className={styles.recentActivity}>
                <h3>Recently Activity</h3>

                {userPost.length > 0 ? (
                    userPost.map((post) => (
                        <div key={post._id} className={styles.postCard}>
                            {post.media ? (
                                <img src={`${UPLOADS_BASE}/posts/${post.media}`} alt="postMedia" />
                            ) : null}

                            <p>{post.body}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noPosts}>No recent activity yet.</p>
                )}
            </div>


            {userProfile != authState.user && 
                    <div className={styles.actionArea}>
                    <button onClick={()=> {
                        updateProfileData();

                    }} className={styles.connectBtn}>
                        Update Profile
                    </button>
                </div>
            }
        </div>
}
        {  isModelOpen && 
        <div
            onClick={() => {
                setIsModelOpen(false)
                        }}
            className={styles.commentContainer}
        >
        <div
        onClick={(e) => {
            e.stopPropagation()
        }}
        className={styles.allCommentsContainer} >

            <input onChange={handelWorkInputChange} name="company" className={styles.inputField} type="text" placeholder="Enter Company"/>
            <input onChange={handelWorkInputChange}name="position" className={styles.inputField} type="text" placeholder="Enter Position" />
            <input onChange={handelWorkInputChange} name="years" className={styles.inputField} type="number" placeholder="Years" />

            <div onClick={() => {
                setUserProfile({
                    ...userProfile,
                    pastWork: [...(userProfile.pastWork || []), inputData]
                })
                setIsModelOpen(false)
            }} className={styles.addWorkBtn1} >Add Work</div>
        </div>
        </div>
}


        </DashBoardLayout>
    
    </UserLayout>
)
}
