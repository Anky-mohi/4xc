import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
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
import { createChart } from "lightweight-charts";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Dashboard() {
  const router = useRouter();
  const chartRef = useRef(null);
  
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const assetToTrack = selectedAssets.length > 0 ? selectedAssets[selectedAssets.length-1] : null; 
  
  const [dataPoints, setDataPoints] = React.useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!assetToTrack) return;

    socket.emit('joinAssetRoom', assetToTrack);
    
    socket.on('assetData', (data) => {
      console.log('Received live data:', data);
      
      const newPoint = {
        time: data.epoch,
        value: data.quote
      };
      
      setDataPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        if (!lastPoint || newPoint.time > lastPoint.time) {
          const updatedPoints = [...prevPoints, newPoint];
          
          updatedPoints.sort((a, b) => a.time - b.time);
          
          return updatedPoints;
        }
        return prevPoints;
      });
    });

    return () => {
      socket.emit('leaveAssetRoom', assetToTrack);
      socket.off('assetData');
    };
  }, [assetToTrack]); 

  useEffect(() => {
    const chartContainer = document.getElementById("main_chart_container_1");
    if (chartContainer && !chartRef.current) {
      const chartOptions = {
        layout: {
          textColor: "white",
          background: { type: "solid", color: "transparent" },
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
      };

      const chart = createChart(chartContainer, chartOptions);
      const areaSeries = chart.addAreaSeries({
        lineColor: "#fff",
        topColor: "#b6b6b6",
        bottomColor: "#b6b6b621",
      });

      // Initialize the chart with the first set of data points
      areaSeries.setData(dataPoints);
      chartRef.current = chart;

      // Update chart data whenever dataPoints changes
      areaSeries.setData(dataPoints);

      // Fit chart to content
      chart.timeScale().fitContent();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [dataPoints]); // Re-run effect when dataPoints changes

  return (
    <div className="main">
      <div className={`section-dashboard ${styles.section}`}>
        <DashboardHeader />
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={`flex justify-between ${styles.container}`}>
            {/* Left Sidebar */}
            <div className="flex items-center">
              <div className="left_side_bar flex flex-col gap-5">
                <div className="icon_content">
                  <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <BusinessCenterIcon style={{ color: "#fff" }} />
                  </button>
                </div>
                <div className="icon_content">
                  <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <AccessTimeFilledIcon style={{ color: "#fff" }} />
                  </button>
                </div>
                <div className="icon_content">
                  <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <HelpCenterIcon style={{ color: "#fff" }} />
                  </button>
                </div>
                <div className="icon_content">
                  <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <LeaderboardIcon style={{ color: "#fff" }} />
                  </button>
                </div>
                <div className="icon_content">
                  <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <LocalFireDepartmentIcon style={{ color: "#fff" }} />
                  </button>
                </div>
                <div className="icon_content">
                  <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    <MoreHorizIcon style={{ color: "#fff" }} />
                  </button>
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
            <div className="flex items-center">
              <div className="right_side_bar flex flex-col justify-start" style={{ gap: "20px" }}>
                <Button className="py-7 px-6 font-extrabold bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800" variant="contained">
                  <TrendingUpIcon />
                  Higher
                </Button>
                <Button className="py-7 px-6 font-extrabold bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800" variant="contained">
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
