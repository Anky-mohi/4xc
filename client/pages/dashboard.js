import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from "../styles/Dashboard.module.css";
import DashboardHeader from '../components/dashboardHeader'; 

function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        router.push('/login'); 
      }
  }, [router]);

  return (
    <div className="main">
      <div className={`section-dashboard ${styles.section}`}>
        <DashboardHeader />
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className="w-full m-auto">
                <div className={styles.block_content}>
                  <h1>Dashboard</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
