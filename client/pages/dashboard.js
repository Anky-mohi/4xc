import React, { useEffect, useRef } from "react";
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// icons end

// chart start
import { createChart } from "lightweight-charts";

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

      areaSeries.setData([
        { time: "2018-12-22", value: 32.51 },
        { time: "2018-12-23", value: 31.11 },
        { time: "2018-12-24", value: 27.02 },
        { time: "2018-12-25", value: 27.32 },
        { time: "2018-12-26", value: 25.17 },
        { time: "2018-12-27", value: 28.89 },
        { time: "2018-12-28", value: 25.46 },
        { time: "2018-12-29", value: 23.92 },
        { time: "2018-12-30", value: 22.68 },
        { time: "2018-12-31", value: 22.67 },
      ]);

      chart.timeScale().fitContent();
      chartRef.current = chart;
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
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
            <div className=" flex  items-center">
              <div className="left_side_bar flex flex-col gap-5">
                <div className="icon_content">
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {" "}
                    <BusinessCenterIcon style={{ color: "#fff" }} />
                  </button>

                  {/* <div style={{ color: "#fff" }}>Portfolio</div> */}
                </div>
                <div className="icon_content">
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    <AccessTimeFilledIcon style={{ color: "#fff" }} />
                  </button>

                  {/* <div style={{ color: "#fff" }}>Trading History</div> */}
                </div>
                <div className="icon_content">
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {" "}
                    <HelpCenterIcon style={{ color: "#fff" }} />
                  </button>

                  {/* <div style={{ color: "#fff" }}>Chat & Support</div> */}
                </div>
                <div className="icon_content">
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {" "}
                    <LeaderboardIcon style={{ color: "#fff" }} />
                  </button>

                  {/* <div style={{ color: "#fff" }}>Leader Board</div> */}
                </div>
                <div className="icon_content">
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {" "}
                    <LocalFireDepartmentIcon style={{ color: "#fff" }} />
                  </button>

                  {/* <div style={{ color: "#fff" }}>Promo</div> */}
                </div>
                <div className="icon_content">
                  <button
                    type="button"
                    class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    {" "}
                    <MoreHorizIcon style={{ color: "#fff" }} />
                  </button>

                  {/* <div style={{ color: "#fff" }}>More</div> */}
                </div>
              </div>
            </div>

            {/* Chart in the middle */}
            <div className="w-10/12">
              <div className={styles.block_content}>
                <div
                  id="main_chart_container_1"
                  className={styles.chartContainer}
                ></div>
              </div>
            </div>

            {/* Right Sidebar (Buy/Sell Buttons) */}
            <div className="flex  items-center">
              <div
                className="right_side_bar flex flex-col justify-start"
                style={{ gap: "20px" }}
              >
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
