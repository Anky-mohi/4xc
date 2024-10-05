import Link from "next/link";
import styles from "../styles/Login.module.css";
import { useState , useEffect} from "react";

export default function Thankyou() {
  useEffect(() => {
    localStorage.setItem("authToken", "your-token-here");
  }, []);
  return (
    <div className="main">
      <div className={`section-verify`}>
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={styles.container}>
            <div className={styles.row}>
                <h1 className = "text-black text-center">Thank You so much for chosing use</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
