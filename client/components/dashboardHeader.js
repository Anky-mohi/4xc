import { useRouter } from "next/router";
import { showPopup, removeSelectedAsset} from "../store/slices/popupSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Popup from "./Popup";
import Link from "next/link";
import Image from "next/image";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";

function DashboardHeader() {
  const dispatch = useDispatch();
  const popUpToggle = () => {
    dispatch(showPopup());
  };
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const handleRemoveAsset = (asset) => {
    dispatch(removeSelectedAsset(asset));
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
            />
          </Link>
          <ViewModuleIcon sx={{ fontSize: 50, marginLeft: "20px" }} />
          <div className = "flex justify-center items-center gap-3" style={{ marginLeft: "20px" }}>
            {selectedAssets.map((asset, index) => (
            <span key={index} className="text-white">
              <a
                href="#"
                class="flex justify-center items-center gap-2 px-4 py-3 dark:bg-indigo-900 dark:text-indigo-300 rounded-lg active"
                aria-current="page"
              >
                <span class="text-white">{asset ? `${asset}` : "WLDAUD"}</span>
                <span onClick={() => handleRemoveAsset(asset)}>
                  <svg
                    class="w-3 h-3"
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
              </a>
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
        <div className="flex items-center"></div>
      </nav>
      <Popup />
    </header>
  );
}

export default DashboardHeader;
