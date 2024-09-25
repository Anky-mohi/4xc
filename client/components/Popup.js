import { useDispatch, useSelector } from "react-redux";
import { hidePopup,fetchPopupData } from "../store/slices/popupSlice";
import Image from "next/image";
import { useEffect } from "react";

function Popup() {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.popup.isVisible);
  const {data,loading,error} = useSelector((state)=>state.popup);

  useEffect(()=>{
    if (isVisible) {
        dispatch(fetchPopupData());
      }
  },[isVisible, dispatch])
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg text-center w-4/5 text-black" style = {{overflow: "hidden"}}>
        <h1>Stock List!</h1>
        <ul style = {{height:"80vh",overflowY:"scroll",overflowX:"hidden", display:"flex",gap:"40px",width:"100%",flexWrap:"wrap"}}>
        {data.map((item, index) => (
            <li key={index} className="flex items-center mb-4">
              <div>
                <h5 className="font-bold">{item.symbol}</h5>
                <p>{item.display_name}</p>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => dispatch(hidePopup())}
        >
          Close
        </button>
      </div>
    </div>
  );
}
export default Popup;
