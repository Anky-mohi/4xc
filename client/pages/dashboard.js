import React, { useEffect , useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../styles/Dashboard.module.css";
import "@/styles/Dashboard.module.css";

import DashboardHeader from "../components/dashboardHeader";
import Button from "@mui/material/Button";

// icons start
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// icons end

// chart start 
import { createChart } from 'lightweight-charts';

function Dashboard() {
  const router = useRouter();
  const chartRef = useRef(null); // Reference for chart

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const chartContainer = document.getElementById('main_chart_container_1');
    if (chartContainer && !chartRef.current) { // Ensure only one chart is created
      const chartOptions = {
        layout: { textColor: 'white', background: { type: 'solid', color: 'transparent' } },
      };
      const chart = createChart(chartContainer, chartOptions);

      const areaSeries = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
      });

      areaSeries.setData([
        { time: '2018-12-22', value: 32.51 },
        { time: '2018-12-23', value: 31.11 },
        { time: '2018-12-24', value: 27.02 },
        { time: '2018-12-25', value: 27.32 },
        { time: '2018-12-26', value: 25.17 },
        { time: '2018-12-27', value: 28.89 },
        { time: '2018-12-28', value: 25.46 },
        { time: '2018-12-29', value: 23.92 },
        { time: '2018-12-30', value: 22.68 },
        { time: '2018-12-31', value: 22.67 },
      ]);

      chart.timeScale().fitContent();
      chartRef.current = chart; // Store chart instance
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove(); // Clean up chart when component unmounts
        chartRef.current = null;
      }
    };
  }, []);
  return (
    <div className="main">
      <div className={`section-dashboard ${styles.section}`}>
        <DashboardHeader />
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={`flex justify-between ${styles.container}`}>
            {/* Left Sidebar */}
            <div className="w-1/12 flex  items-center">
              <div className="left_side_bar">
                <div className="icon_content">
                  <BusinessCenterIcon style={{ color: "#fff" }} />
                  <div style={{ color: "#fff" }}>Portfolio</div>
                </div>
                <div className="icon_content">
                  <AccessTimeFilledIcon style={{ color: "#fff" }} />
                  <div style={{ color: "#fff" }}>Trading History</div>
                </div>
                <div className="icon_content">
                  <HelpCenterIcon style={{ color: "#fff" }} />
                  <div style={{ color: "#fff" }}>Chat & Support</div>
                </div>
                <div className="icon_content">
                  <LeaderboardIcon style={{ color: "#fff" }} />
                  <div style={{ color: "#fff" }}>Leader Board</div>
                </div>
                <div className="icon_content">
                  <LocalFireDepartmentIcon style={{ color: "#fff" }} />
                  <div style={{ color: "#fff" }}>Promo</div>
                </div>
                <div className="icon_content">
                  <MoreHorizIcon style={{ color: "#fff" }} />
                  <div style={{ color: "#fff" }}>More</div>
                </div>
              </div>
            </div>

            {/* Chart in the middle */}
            <div className="w-10/12">
              <div className={styles.block_content}>
                <div id="main_chart_container_1" className={styles.chartContainer}></div>
              </div>
            </div>

            {/* Right Sidebar (Buy/Sell Buttons) */}
            <div className="w-1/12 flex  items-center">
              <div className="right_side_bar flex flex-col justify-start" style={{gap:"20px"}}>
                <Button variant="contained" color="success">Buy</Button>
                <Button variant="contained" color="error">Sell</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
