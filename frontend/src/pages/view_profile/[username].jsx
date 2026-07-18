import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import clientServer, {BASE_URL,UPLOADS_BASE,} from "../../config/clientServer";
import DashBoardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getMyConnectionRequest, sendConnectionRequest } from "@/config/redux/action/authAction";
import { getConnectionRequest } from "@/config/redux/action/authAction";


export default function ViewProfile({ userProfile }) {

    const router = useRouter();
    const dispatch = useDispatch();

    const { username } = router.query;

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.posts);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isConnectionNull, setIsConnectionNull] = useState(true);
    

    const profileData = userProfile?.profile || userProfile;

    const profileOwnerId = profileData?.userId?._id;

    const profileUsername =
        profileData?.userId?.username || username;

    const profileName =
        profileData?.userId?.name || "User";

    const profilePicture =
        profileData?.userId?.ProfilePicture
            ? `${UPLOADS_BASE}/${profileData.userId.ProfilePicture}`
            : `${UPLOADS_BASE}/default.jpg`;

    const bioText =
        profileData?.bio?.trim() ||
        "No bio added yet.";

    const [userPost, setUserPost] = useState([]);

    

    const connection = authState.connections.find((conn) => {
    return (
        conn.connectionId?._id === profileOwnerId ||
        conn.userId?._id === profileOwnerId
    );
});

const isUserConnected = connection?.status_accepted === true;
const isConnectionPending = connection?.status_accepted === null;
        useEffect(() => {
        dispatch(getAllPosts());

        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");

            if (token) {
                dispatch(getConnectionRequest({ token }));
                dispatch(getMyConnectionRequest({ token }));
            }
        }
    }, [dispatch]);

    useEffect(() => {
        const posts = Array.isArray(postReducer.posts)? postReducer.posts: [];

        const filteredPosts = posts.filter((post) => {
            return (
                post?.userId?.username === profileUsername
            );
        });
        setUserPost(filteredPosts);
    }, [postReducer.posts, profileUsername]);

console.log("UPLOADS_BASE:", UPLOADS_BASE);
console.log("Profile Picture:", profileData?.userId?.ProfilePicture);
console.log(
  "Final URL:",
  profileData?.userId?.ProfilePicture
    ? `${UPLOADS_BASE}/${profileData.userId.ProfilePicture}`
    : `${UPLOADS_BASE}/default.jpg`
);  
    
    return (
        <UserLayout>
        <DashBoardLayout>
        <div className={styles.profileContainer}>

            <div className={styles.backDropContainer}>
                <img
                    src={profileData?.userId?.ProfilePicture ? `${UPLOADS_BASE}/${profileData.userId.ProfilePicture}` : `${UPLOADS_BASE}/default.jpg`}
                    alt="profile"
                />
            </div>

            <div className={styles.profileHeader}>
                <div className={styles.profileDetails}>
                    <h6 className={styles.profileName}>{profileData?.userId?.name || "User"}</h6>
                    <p className={styles.userName}>@{profileData?.userId?.username || username || "unknown"}</p>
                </div>

                <div className={styles.actionArea}>
                    <div style={{display:"flex", alignItems:"center" , gap:"1.2em"}}>
                        {isUserConnected ? (
    <button className={styles.connectedButton}>
        Connected
    </button>
) : isConnectionPending ? (
    <button className={styles.connectedButton}>
        Pending
    </button>
) : (
    <button
        onClick={async () => {
            try {
                await dispatch(
                    sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        connectionId: profileData.userId._id,
                    })
                ).unwrap();
            } catch (error) {
                console.log(error);
            }
        }}
        className={styles.connectBtn}
    >
        Connect
    </button>
)}

                        <div onClick={async () => {
                            try {
                                const response = await clientServer.get(
                                    `/download_profile?id=${profileData.userId._id }`
                                );

                                window.open(
                                    `${UPLOADS_BASE}/${response.data.pdf}`,
                                    "_blank"
                                );
                                } catch (error) {
                                console.error(error.response?.data);
                                }
                            }} style={{cursor:"pointer"}}>
                            <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>

                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.bioCard}>
                <p className={styles.bio}>{bioText || "No bio added yet."}</p>
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
        </div>
        </DashBoardLayout>
        </UserLayout>
    );
}

export async function getServerSideProps(context) {
    const request = await clientServer.get(
        "/get_user_profile_and_users_based_on_username",
        {
            params: {
                username: context.query.username,
            },
        }
    );



    return {
        props: {
            userProfile: request.data
        },
    };
}