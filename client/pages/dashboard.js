import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, buyProposal } from "../store/slices/dashboardApi";
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
import io from "socket.io-client";
import Chart from "../components/chart";
import TransactionLog from "../components/transactionlog";

const socket = io(process.env.NEXT_PUBLIC_DB_BASE_URL);

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  // State for transaction log and popup visibility
  const [transactionLog, setTransactionLog] = useState(null);
  const [showTransactionLog, setShowTransactionLog] = useState(false);

  const apiReqData = useSelector((state) => state.data.apiData);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const loading = useSelector((state) => state.dashboardApi.loading);
  const error = useSelector((state) => state.dashboardApi.error);
  const [amount, setAmount] = useState(55);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(1);

  const accountList = apiData?.data?.account_list || [];
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
      duration: seconds + 60 * minutes,
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

  const handleIncrease = () => {
    setAmount((prevAmount) => prevAmount + 1);
  };

  const handleDecrease = () => {
    if (amount > 0) {
      setAmount((prevAmount) => prevAmount - 1);
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

  const formatTime = (num) => (num < 10 ? `0${num}` : num);

  const handleBusinessCenterClick = () => {
    console.log("Business Center Icon clicked");
  };

  const handleAccessTimeClick = () => {
    if (!showTransactionLog) {
      // Emit the transaction history request when opening the popup
      socket.emit('transcationHistoryRequest', {
        profit_table: 1,
        description: 1,
        limit: 25, // Adjust the limit or add pagination later
        offset: 0,
        sort: "ASC",
        loginid: apiReqData.acct1,
        token: apiReqData.token1,
      });
  
      // Listen for the transaction history response
      socket.once('transcationHistory', (data) => {
        console.log('Transaction history details:', data);
        setTransactionLog(data); // Update transaction log state with received data
        setShowTransactionLog(true); // Open the transaction log popup
      });
    } else {
      // Toggle the popup visibility off
      setShowTransactionLog(false);
    }
  
    // Clean up the socket listener when the component unmounts or re-renders
    return () => {
      socket.off('transcationHistory');
    };
  };
  
  

  const handleHelpCenterClick = () => {
    console.log("Help Center Icon clicked");
  };

  const handleLeaderboardClick = () => {
    console.log("Leaderboard Icon clicked");
  };

  const handleFireClick = () => {
    console.log("Fire Icon clicked");
  };

  const handleMoreClick = () => {
    console.log("More Icon clicked");
  };

  const iconsWithHandlers = [
    { Icon: BusinessCenterIcon, handler: handleBusinessCenterClick },
    { Icon: AccessTimeFilledIcon, handler: handleAccessTimeClick },
    { Icon: HelpCenterIcon, handler: handleHelpCenterClick },
    { Icon: LeaderboardIcon, handler: handleLeaderboardClick },
    { Icon: LocalFireDepartmentIcon, handler: handleFireClick },
    { Icon: MoreHorizIcon, handler: handleMoreClick },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!apiData) return <div>Loading data...</div>;

  return (
    <div className="main">
      <div className={`section-dashboard ${styles.section}`}>
        <DashboardHeader />
        <div className="overlay"></div>
        <div className={styles.sizer}>
          <div className={`flex justify-between ${styles.container}`}>
            <div className="left_side_bar flex flex-col gap-5">
              {iconsWithHandlers.map(({ Icon, handler }, index) => (
                <div key={index} className="icon_content">
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={handler}
                  >
                    <Icon style={{ color: "#fff" }} />
                  </button>
                </div>
              ))}
            </div>

            <Chart />

            <div className="right_side_bar flex flex-col justify-start gap-5">
              <div className="bg-gray-800 rounded-md border border-gray-600 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 px-2">Amount</span>
                  <HelpOutline className="text-gray-400 mx-2" fontSize="small" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold px-2">${amount}</span>
                  <div className="flex gap-2">
                    <Button onClick={handleDecrease}>
                      <Remove style={{ color: "#fff" }} />
                    </Button>
                    <Button onClick={handleIncrease}>
                      <Add style={{ color: "#fff" }} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-md border border-gray-600 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 px-2">Time</span>
                  <HelpOutline className="text-gray-400 mx-2" fontSize="small" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold px-2">
                    {formatTime(minutes)}:{formatTime(seconds)}
                  </span>
                  <div className="flex gap-2">
                    <Button onClick={handleDecreaseTime}>
                      <Remove style={{ color: "#fff" }} />
                    </Button>
                    <Button onClick={handleIncreaseTime}>
                      <Add style={{ color: "#fff" }} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-md border border-gray-600 p-2">
                <div className="flex gap-2 justify-center">
                  <Button
                    className="font-extrabold bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 py-6 px-6 flex-col"
                    style={{ color: "#fff" }}
                    onClick={handleClickHigher}
                  >
                    <TrendingUpIcon /> Buy (Higher)
                  </Button>
                  <Button
                    className="py-6 px-6 font-extrabold bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 flex-col"
                    style={{ color: "#fff" }}
                    onClick={handleClickLower}
                  >
                    <TrendingDownIcon /> Buy (Lower)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTransactionLog && (
        <TransactionLog
          transactions={transactionLog}
          closePopup={() => setShowTransactionLog(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
