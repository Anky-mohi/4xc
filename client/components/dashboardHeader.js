import { useEffect, useState } from "react";
import { showPopup, removeSelectedAsset } from "../store/slices/popupSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Popup from "./Popup";
import Link from "next/link";
import Image from "next/image";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Box,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Menu,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  Person,
  Logout,
  ArrowDropDown,
  CurrencyExchange,
} from "@mui/icons-material";
import KycModal from "../components/kycModal";
import ReplyIcon from "@mui/icons-material/Reply";
import io from "socket.io-client";
const socket = io("http://localhost:5000/");

function DashboardHeader({ socket }) {
  const dispatch = useDispatch();

  const [userMenu, setUserMenu] = useState(false);
  const [balance, setBalance] = useState(false);
  const [balanceHead, setBalanceHead] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const realBalance = useSelector((state) => state.getBalance.realBalance || 0);
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const accountList = apiData?.data?.account_list || [];
  const virtualAccount = accountList.find((acc) => acc.is_virtual);
  const realAccount = accountList.find((acc) => !acc.is_virtual);
  const apiReqData = useSelector((state) => state.data.apiData);
  const userToken = apiData.token

  useEffect(() => {
    if (virtualAccount && virtualAccount.loginid) {
      socket.emit('fetchBalance', { token: userToken, loginid: virtualAccount.loginid });
    }
    socket.on('walletUpdate', (wallet) => setBalanceHead(wallet?.balance?.balance));
    socket.on('purchasedTradeStream', (data) => {
      if (['lost', 'won'].includes(data?.proposal_open_contract?.status)) {
        console.log('purchasedTradeResult', data?.proposal_open_contract?.status);
      }
    });
  }, [socket]);


  const popUpToggle = () => dispatch(showPopup());

  const handleClickTopUp = () => {
    const topUpData = {
      topup_virtual: 1,
      loginid: apiData.data.loginid,
      token: apiReqData.token1,
    };
    socket.emit('topUpWallet', topUpData)
    socket.on('walletUpdate', (wallet) => {
      console.log('WalletUpdateAfterTopUp', wallet);
    })
  };

  const handleRemoveAsset = (asset) => {
    dispatch(removeSelectedAsset(asset));
  };

  const showUser = () => {
    setUserMenu(!userMenu);
  };

  const showBalance = () => {
    setBalance(!balance);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenMod = () => {
    setOpenModal(true); // Set to true to open the modal
  };

  const handleCloseMod = () => {
    setOpenModal(false); // Set to false to close the modal
  };

  return (
    <header className="bg-transparent fixed w-full text-white p-4">
      <nav className="bg-color flex justify-between">
        <div className="text-xl font-boldn flex items-center">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="MySite Logo"
              width={80}
              height={80}
              className="mr-2"
              style={{ width: "auto", height: "auto" }} // Optionally use width/height auto if you plan to resize with CSS
              priority={true} // Use priority if it's above the fold
            />
          </Link>
          <ViewModuleIcon sx={{ fontSize: 50, marginLeft: "20px" }} />
          <div
            className="flex justify-start flex-wrap items-center gap-3"
            style={{ marginLeft: "20px" }}
          >
            {selectedAssets.map((asset, index) => (
              <span key={index} className="text-white">
                <button
                  className="flex justify-center items-center gap-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  aria-current="page"
                >
                  <span className="text-white">
                    {asset ? `${asset}` : "WLDAUD"}
                  </span>
                  <span onClick={() => handleRemoveAsset(asset)}>
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#fff"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="#fff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </span>
                </button>
              </span>
            ))}
          </div>
          <div
            className="plusicon"
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={popUpToggle}
          >
            <AddIcon sx={{ fontSize: 50 }} />
          </div>
        </div>
        <div className="flex items-center gap-5 ">
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenMod} onClose={handleClose}>
                <ListItemIcon>{/* <Person fontSize="small" /> */}</ListItemIcon>
                Add Real account
              </MenuItem>
              <KycModal open={openModal} onClose={handleCloseMod} />
              <Divider />
              <MenuItem onClose={handleClose}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>

          <div
            className="relative balance text-2xl cursor-pointer text-orange-600 font-bold"
            onClick={showBalance}
          >
            ${balanceHead} <ArrowDropDown sx={{ fontSize: 30 }} />
            {balance && (
              <>
                <div className="absolute w-[600px] left-[0%] font-normal flex flex-row items-start gap-1 text-sm text-white top-[50px]">
                  <div className="w-3/6 w-3/6 bg-[#000]">
                    <div className="real-acc-content p-[10px] flex flex-row justify-between">
                      <div className="left">
                        <div className="heading text-[16px] pb-2 font-semibold uppercase">
                          Real Account
                        </div>
                        <div className="price text-[#50d71e] font-bold">
                          ${realBalance}{" "}
                          {/*  I wan to set here real balance if there is exist any real account login id  */}
                        </div>
                      </div>
                      <div className="right-content flex flex-row gap-[2px]">
                        <div className="py-[10px] px-[10px] bg-[#777] deposit_icon">
                          <ReplyIcon />
                        </div>
                        <div className="py-[10px] px-[20px] bg-[#777]">
                          Deposit
                        </div>
                      </div>
                    </div>
                    <div className="practice_content bg-[#555] p-[10px] flex flex-row justify-between">
                      <div className="left">
                        <div className="heading text-[16px] pb-2 font-semibold uppercase">
                          Practice Account
                        </div>
                        <div className="price text-[#e8570c] font-bold">
                          ${balanceHead}
                        </div>
                      </div>
                      <div className="right-content">
                        <div
                          className="py-[10px] px-[20px] bg-[#777]"
                          onClick={handleClickTopUp}
                        >
                          Top Up
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="border-2 border-solid bg-green-500 text-white border-green-500 px-5 py-3 flex items-center">
            <CurrencyExchange />
            <span className="pl-3 text-lg">Deposit</span>
          </button>
        </div>
      </nav>
      <Popup />
    </header>
  );
}

export default DashboardHeader;