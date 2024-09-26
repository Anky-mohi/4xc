import { useRouter } from "next/router";
import { showPopup } from '../store/slices/popupSlice';
import { useDispatch } from 'react-redux';
import Popup from './Popup'; 
import Link from "next/link";
import Image from "next/image";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import AddIcon from '@mui/icons-material/Add';

function DashboardHeader() {
  const dispatch = useDispatch();
  const popUpToggle = ()=>{
    dispatch(showPopup())
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
          <ViewModuleIcon sx={{ fontSize: 50, marginLeft:"20px" }} /> 
          <div style={{ marginLeft:"20px"}} >
            <h1>WLDAUD</h1>
          </div>
          <div className = "plusicon" style={{cursor:"pointer", marginLeft:"20px"}} onClick = {popUpToggle}>
            <AddIcon sx={{ fontSize: 50 }}/>
          </div>

        </div>
        <div className="flex items-center">
        </div>
      </nav>
      <Popup />
    </header>
   
  );
}

export default DashboardHeader;
