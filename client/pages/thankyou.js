import Link from "next/link";
import styles from "../styles/Login.module.css";
import { useState , useEffect} from "react";

export default function Thankyou() {
  useEffect(() => {
    const { acct1, token1, cur1 } = router.query;
    const sendDataToBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/authorized", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("signToken"),
          },
          body: JSON.stringify({
            acct1,
            token1,
            cur1,
          }),
        });

        const data = await response.json();
        localStorage.setItem("authToken",token1)
        console.log("Response from backend:", data);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    };

    // Ensure all parameters are present before sending the request
    if (acct1 && token1 && cur1) {
      sendDataToBackend();
    }
    localStorage.setItem("authToken", "your-token-here");
  }, [router.query]);
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
