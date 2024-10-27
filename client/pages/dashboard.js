import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, buyProposal } from "../store/slices/dashboardApi";
import styles from "../styles/Dashboard.module.css";
import DashboardHeader from "../components/dashboardHeader";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import io from "socket.io-client";
import Chart from "../components/chart";
import TransactionLog from "@/components/TransactionLog";
import RightSidebar from "@/components/RightSidebar";
const socket = io('http://localhost:5000/');

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const apiReqData = useSelector((state) => state.data.apiData);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const loading = useSelector((state) => state.dashboardApi.loading);
  const error = useSelector((state) => state.dashboardApi.error);

  const [isTransactionHistoryVisible, setTransactionHistoryVisible] = useState(false); // State for modal visibility

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
    }
    if (apiData === null) {
      dispatch(loginUser(apiReqData.token1));
    }
  }, [apiReqData, apiData, dispatch, router]);


  const handleBusinessCenterClick = () => {
    console.log("Business Center Icon clicked");
  };

  const handleAccessTimeClick = () => setTransactionHistoryVisible(!isTransactionHistoryVisible);

  // Clean up the socket listener when the component unmounts or re-renders

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
        <DashboardHeader socket={socket} />
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

            <Chart socket={socket}/>
            <RightSidebar socket={socket} userInfo={apiReqData} />
          </div>
        </div>
      </div>
      {isTransactionHistoryVisible &&
        <TransactionLog
          isOpen={isTransactionHistoryVisible}
          onClose={handleAccessTimeClick}
          socket={socket}
          userInfo={apiReqData}
        />}
    </div>
  );
}

export default Dashboard;
