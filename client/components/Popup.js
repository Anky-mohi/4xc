import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  hidePopup,
  fetchPopupData,
  setSearchTerm,
  setTabValue,
  setSelectedAsset
} from "../store/slices/popupSlice";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function Popup() {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.popup.isVisible);

  const [stars, setStars] = useState({});

  const { data, searchTerm, tabValue } = useSelector((state) => state.popup);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      dispatch(fetchPopupData());
    }
  }, [isVisible, dispatch]);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      dispatch(hidePopup());
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside); // Add event listener on mount
    } else {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up when popup closes
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up on unmount
    };
  }, [isVisible]);


  useEffect(() => {
    const localStars = JSON.parse(localStorage.getItem("stars")) || {};
    setStars(localStars);
  }, []);

  useEffect(() => {
    localStorage.setItem("stars", JSON.stringify(stars));
  }, [stars]);

  const toggleStar = (name) => {
    setStars((prevStars) => ({
      ...prevStars,
      [name]: prevStars[name] === "★" ? "☆" : "★",
    }));
  };

  const filteredData = data.filter(
    (el) =>
      el.market === tabValue &&
      el.display_name.toLowerCase().includes(searchTerm)
  );

  const watchListData = data.filter((el) =>
    Object.keys(stars).includes(el.display_name)
  );

  const topAssets =
    tabValue === "popular"
      ? [...data].sort((a, b) => b.display_order - a.display_order).slice(0, 10)
      : tabValue === "watch_list"
      ? watchListData
      : filteredData;

  if (!isVisible) return null;

  const handleSelectAsset = (displayName) => {
    dispatch(setSelectedAsset(displayName));
    dispatch(hidePopup()); 
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="bg-black p-4 rounded shadow-lg text-center text-black relative overflow-auto"
        ref={popupRef}
        style={{
          maxWidth: "90%",
          maxHeight: "80%",
          padding: "40px 20px",
          margin: "auto",
        }}
      >
        <h1 className="text-white text-3xl">Here You can see Your Assets list</h1>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "50%",
            margin: "30px auto",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Asset"
            inputProps={{ "aria-label": "search asset" }}
            value={searchTerm}
            onChange={(e) =>
              dispatch(setSearchTerm(e.target.value.toLowerCase()))
            }
          />
        </Paper>

        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(event, newValue) => dispatch(setTabValue(newValue))}
              >
                <Tab  className = "text-white" label="Popular" value="popular" />
                <Tab  className = "text-white" label="Commodities" value="commodities" />
                <Tab className = "text-white" label="Crypto Currency" value="cryptocurrency" />
                <Tab className = "text-white" label="Forex" value="forex" />
                <Tab className = "text-white" label="Indices" value="indices" />
                <Tab className = "text-white" label="Synthetic Index" value="synthetic_index" />
                <Tab className = "text-white" label="Watch List" value="watch_list" />
              </TabList>
            </Box>
            <TabPanel value={tabValue}>
              {topAssets.length > 0 ? (
                <div className = "cursor-pointer">
                  <div className="text-white"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    <span className = "text-left w-56">Display Name</span>
                    <span className = "text-left w-40">Price</span>
                    <span className = "text-left w-40">Symbol</span>
                  </div>
                  {topAssets.map((el) => (
                    <div
                      key={el.display_name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                      onClick={() => handleSelectAsset(el.symbol)}
                    >
                      <span className="flex items-center flex-wrap gap-5 text-white text-left w-56">
                        {tabValue === "popular" ? (
                          <Image
                            priority
                            src={`/Images/Popular/${el.symbol}.svg`}
                            width={50}
                            height={50}
                            alt="sym"
                          />
                        ) : (
                          ""
                        )}
                        {el.display_name}
                      </span>
                      <span className="text-white text-left w-40">
                        {el.spot}
                        </span>
                      <span className="text-white text-left w-40">
                        {el.symbol}
                        <span
                          className="text-2xl cursor-pointer ml-2"
                          onClick={() => toggleStar(el.display_name)}
                        >
                          {stars[el.display_name] || "☆"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No results found</div>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
}

export default Popup;
