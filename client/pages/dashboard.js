import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/dashboardApi'; // Adjust the import based on your file structure
import styles from "../styles/Dashboard.module.css";
import DashboardHeader from "../components/dashboardHeader";
import Button from "@mui/material/Button";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Chart from '../components/chart';

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const apiReqData = useSelector((state) => state.data.apiData);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const loading = useSelector((state) => state.dashboardApi.loading);
  const error = useSelector((state) => state.dashboardApi.error);
  useEffect(() => {
    if (!apiReqData) {
      router.push("/login");
    } else if (apiData === null) { 
      dispatch(loginUser(apiReqData.token1));
    }
  }, [apiReqData, apiData, dispatch, router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }
   if (!apiData) {
    return <div>Loading data...</div>;
  }
  // Main render
  return (
    <div className="main">
      <div className={`section-dashboard ${styles.section}`}>
        <DashboardHeader apiData={apiData} />
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={`flex justify-between ${styles.container}`}>
            {/* Left Sidebar */}
            <div className="flex items-center">
              <div className="left_side_bar flex flex-col gap-5">
                {/* Button Icons */}
                {[BusinessCenterIcon, AccessTimeFilledIcon, HelpCenterIcon, LeaderboardIcon, LocalFireDepartmentIcon, MoreHorizIcon].map((Icon, index) => (
                  <div key={index} className="icon_content">
                    <button
                      type="button"
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      <Icon style={{ color: "#fff" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart in the middle */}
            <Chart />

            {/* Right Sidebar (Buy/Sell Buttons) */}
            <div className="flex items-center">
              <div className="right_side_bar flex flex-col justify-start" style={{ gap: "20px" }}>
                <div></div>
                <div className="text-white flex-column items-center">
                  Profit<br />
                  <span className="text-5xl text-white">50%</span><br />
                  $50
                </div>
                <Button
                  className="py-7 px-6 font-extrabold bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800"
                  variant="contained"
                >
                  <TrendingUpIcon />
                  Higher
                </Button>
                <Button
                  className="py-7 px-6 font-extrabold bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                  variant="contained"
                >
                  <TrendingDownIcon />
                  Lower
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
