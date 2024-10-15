import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { showPopup, removeSelectedAsset} from "../store/slices/popupSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Popup from "./Popup";
import Link from "next/link";
import Image from "next/image";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { ArrowDropDown, CurrencyExchange, Person, PersonPinCircleOutlined } from "@mui/icons-material";
import ReplyIcon from '@mui/icons-material/Reply';
import { fetchRealBalance, fetchVRTBalance } from "../store/slices/walletSlice";

function DashboardHeader() {
  const dispatch = useDispatch();

  const [userMenu, setUserMenu]=useState(false);
  const [balance, setBalance]=useState(false);
  const virtualBalance = useSelector((state) => state.getBalance.virtualBalance || 0);
  const realBalance = useSelector((state) => state.getBalance.realBalance || 0);
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const accountList = apiData?.data?.account_list || [];
  const realAccount = accountList.find(acc => !acc.is_virtual);
  const virtualAccount = accountList.find(acc => acc.is_virtual);
  useEffect(() => {
    if (realAccount && realAccount.loginid) {
      dispatch(fetchRealBalance(realAccount.loginid));
    }
    if (virtualAccount && virtualAccount.loginid) {
      dispatch(fetchVRTBalance(virtualAccount.loginid));
    }
  }, [dispatch]);

  const popUpToggle = () => {
    dispatch(showPopup());
  };
  
  const handleRemoveAsset = (asset) => {
    dispatch(removeSelectedAsset(asset));
  };

  const showUser=()=>{
    setUserMenu(!userMenu)
  }

  const showBalance=()=>{
    setBalance(!balance)
  }

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
            />
          </Link>
          <ViewModuleIcon sx={{ fontSize: 50, marginLeft: "20px" }} />
          <div className = "flex justify-start flex-wrap items-center gap-3" style={{ marginLeft: "20px" }}>
            {selectedAssets.map((asset, index) => (
            <span key={index} className="text-white">
              <button
                className="flex justify-center items-center gap-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                aria-current="page"
              >
                <span class="text-white">{asset ? `${asset}` : "WLDAUD"}</span>
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </span>
              </button>
            </span>
            )) }
          </div>
          <div
            className="plusicon"
            style={{ cursor: "pointer", marginLeft: "10px" }}
            onClick={popUpToggle}
          >
            <AddIcon sx={{ fontSize: 50 }} />
          </div>
        </div>
        <div className="flex items-center gap-5">
            <div className="relative user cursor-pointer" onClick={showUser}>
              <Person sx={{ fontSize: 50, marginLeft: "20px", background:"gray", borderRadius:"50%" }}/>
              <ArrowDropDown sx={{ fontSize: 30 }} />
              {userMenu && 
              <>
                <div className="absolute w-[200px] font-normal bg-[#363c4f] text-sm text-white top-89 p-5">
                  <h2>This is user menu</h2>
                </div>
              </> 
            }
            </div>
            
          <div className="relative balance text-2xl cursor-pointer text-orange-600 font-bold" onClick={showBalance}>
            ${apiData.data.balance} <ArrowDropDown sx={{ fontSize: 30 }}/>
            {balance && 
              <>
              <div className="absolute w-[600px] right-[-100%] font-normal flex flex-row items-start gap-1 text-sm text-white top-[50px]">
              <div className = "w-3/6 bg-[#555555] flex flex-col items-start p-5">
                <div className="pb-3">
                    <p>Investment....... $0</p>
                    <p>Available....... ${apiData.data.balance}</p>
                  </div>
                  <div className="flex-column pt-3">
                    <div className="p-4 bg-blue-400">
                      How are you
                    </div>
                  </div>
              </div>
              <div className="w-3/6 w-3/6 bg-[#000]">
                  <div className="real-acc-content p-[10px] flex flex-row justify-between">
                  <div className = "left">
                    <div className="heading text-[16px] pb-2 font-semibold uppercase">
                      Real Account
                    </div>
                    <div className="price text-[#50d71e] font-bold">
                       ${realBalance} {/*  I wan to set here real balance if there is exist any real account login id  */}
                    </div>
                  </div>
                  <div className="right-content flex flex-row gap-[2px]">
                    <div className="py-[10px] px-[10px] bg-[#777] deposit_icon">
                      <ReplyIcon/>
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
                      ${virtualBalance}  {/*  I wan to set here Vertual balance if there is exist any Vertual account login id  */}
                    </div>
                  </div>
                  <div className="right-content">
                  <div className="py-[10px] px-[20px] bg-[#777]">
                      Top Up
                    </div>
                  </div>
                    
                  </div>
              </div>
                  
              </div>
              </>
              }
          </div>
          
          <Button className="border-2 border-solid hover:bg-green-500 hover:text-white border-green-500 text-green-500 px-5 py-3"><CurrencyExchange/> <span className="pl-3 text-lg">Deposit</span></Button>
        </div>
      </nav>
      <Popup />
    </header>
  );
}

export default DashboardHeader;
