import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, buyProposal } from "../store/slices/dashboardApi"; // Adjust the import based on your file structure
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
import { Add, Remove, HelpOutline, AccessTime } from "@mui/icons-material";

import Chart from "../components/chart";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const apiReqData = useSelector((state) => state.data.apiData);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const loading = useSelector((state) => state.dashboardApi.loading);
  const error = useSelector((state) => state.dashboardApi.error);
  const [amount, setAmount] = useState(55);
  const [seconds, setSeconds] = useState(21);
  const [minutes, setMinutes] = useState(19);
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const assetToTrack =
    selectedAssets.length > 0
      ? selectedAssets[selectedAssets.length - 1]
      : selectedAssets[0];

  useEffect(() => {
    if (!apiReqData) {
      router.push(
        `https://oauth.deriv.com/oauth2/authorize?app_id=${process.env.NEXT_PUBLIC_APP_ID}`
      );
    } else if (apiData === null) {
      dispatch(loginUser(apiReqData.token1));
    }
  }, [apiReqData, apiData, dispatch, router]);

  const handleClickHigher = () => {
    const proposalData = {
      proposal: 1,
      amount: amount,
      barrier: "+0.1",
      basis: "stake",
      contract_type: "CALL",
      currency: "USD",
      duration: 60,
      duration_unit: "s",
      symbol: assetToTrack,
      loginid: apiData.data.loginid,
    };
    dispatch(buyProposal(proposalData));
  };
  const handleClickLower = () => {
    const proposalData = {
      proposal: 1,
      amount: amount,
      barrier: "+0.1",
      basis: "stake",
      contract_type: "PUT",
      currency: "USD",
      duration: 60,
      duration_unit: "s",
      symbol: assetToTrack,
      loginid: apiData.data.loginid,
    };
    dispatch(buyProposal(proposalData));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!apiData) {
    return <div>Loading data...</div>;
  }
  const handleIncrease = () => {
    setAmount((prevAmount) => prevAmount + 1); // Increase amount by 1
  };

  const handleDecrease = () => {
    if (amount > 0) {
      setAmount((prevAmount) => prevAmount - 1); // Decrease amount by 1, but don't allow negative values
    }
  };

  const handleIncreaseTime = () => {
    if (seconds === 59) {
      setSeconds(0);
      setMinutes((prevMinutes) => (prevMinutes + 1) % 24);
    } else {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }
  };

  const handleDecreaseTime = () => {
    if (seconds === 0) {
      setSeconds(59);
      setMinutes((prevMinutes) => (prevMinutes === 0 ? 23 : prevMinutes - 1));
    } else {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }
  };

  const formatTime = (num) => (num < 10 ? `0${num}` : num); // To ensure 2-digit format

  // Main render
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
                {/* Button Icons */}
                {[
                  BusinessCenterIcon,
                  AccessTimeFilledIcon,
                  HelpCenterIcon,
                  LeaderboardIcon,
                  LocalFireDepartmentIcon,
                  MoreHorizIcon,
                ].map((Icon, index) => (
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
              <div
                className="right_side_bar flex flex-col justify-start"
                style={{ gap: "20px" }}
              >
                <div className="right_side_bar flex flex-col justify-start bg-gray-800 rounded-md border border-gray-600 p-2">
                  {/* Amount Section */}
                  <div className="flex items-center justify-between">
                    {/* Currency Symbol */}
                    <span className="text-sm text-gray-400 px-2">Amount</span>

                    {/* Help Icon */}
                    <HelpOutline
                      className="text-gray-400 mx-2"
                      fontSize="small"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl text-gray-400 px-2">₹</span>

                    {/* Input Field */}
                    <input
                      type="text"
                      value={amount}
                      className="bg-transparent w-16 text-white text-xl focus:outline-none"
                    />

                    {/* Buttons */}
                    <div className="flex flex-col justify-center">
                      <button className="p-1" onClick={handleIncrease}>
                        <Add className="text-gray-400" />
                      </button>
                      <button className="p-1" onClick={handleDecrease}>
                        <Remove className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Amount Section */}
                {/* Start Time  Expiration */}
                <div className="right_side_bar flex flex-col justify-start bg-gray-800 rounded-md border border-gray-600 p-2">
                  <div className="flex items-center justify-between">
                    {/* Label */}
                    <span className="text-sm text-gray-400 px-2">
                      Expiration
                    </span>
                    {/* Help Icon */}
                    <HelpOutline
                      className="text-gray-400 mx-2"
                      fontSize="small"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Clock Icon */}
                      <AccessTime
                        className="text-gray-400 mr-2"
                        fontSize="small"
                      />

                      {/* Time Display */}
                      <span className="text-xl text-white">{`${formatTime(
                        minutes
                      )}:${formatTime(seconds)}`}</span>
                    </div>

                    {/* Plus and Minus Buttons */}
                    <div className="flex flex-col justify-center space-y-1">
                      <button onClick={handleIncreaseTime} className="p-1">
                        <Add className="text-gray-400" />
                      </button>
                      <button onClick={handleDecreaseTime} className="p-1">
                        <Remove className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Time  Expiration */}

                <div className="text-white flex-col items-center flex gap-[10px]">
                  <div className="flex items-center">
                    <span> Profit</span>{" "}
                    <HelpOutline
                      className="text-gray-400 mx-2"
                      fontSize="small"
                    />
                  </div>
                  <span className="text-5xl text-[#69ffa1]">50%</span>
                  <span className="text-xl text-[#69ffa1]">$50</span>
                </div>
                <Button
                  className=" font-extrabold bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 py-6 px-6 flex-col"
                  variant="contained"
                  onClick={handleClickHigher}
                >
                  <TrendingUpIcon />
                  <span>Higher</span>
                </Button>
                <Button
                  className="py-6 px-6 font-extrabold bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 flex-col"
                  variant="contained"
                  onClick={handleClickLower}
                >
                  <TrendingDownIcon />
                  <span>Lower</span>
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
