import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function Home() {

  const router = useRouter();

  return (
    <UserLayout>
     <div className={styles.container}>

        <div className={styles.mainContainer}>

          <div className={styles.mainContainerLeft}>
            <p>Connect with Friends without Fear</p>
            <p>A True Social media platform with no blufs.. </p>
          </div>

          <div onClick={() => {
            router.push("/login"); 
          }} className={styles.buttonJoin}>
            <p>join me</p>
          </div>

          <div className={styles.mainContainerRight}>
            <img src="images/Homeimg copy.jpeg" /> 
          </div>

        </div>
      </div>
      
    </UserLayout>
  );
}
