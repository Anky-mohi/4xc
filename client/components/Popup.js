import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  hidePopup,
  fetchPopupData,
  setSearchTerm,
  setTabValue,
} from "../store/slices/popupSlice";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";

// Tab Components
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function Popup() {
  const dispatch = useDispatch();
  const isVisible = useSelector((state) => state.popup.isVisible);
  const { data, loading, error, searchTerm, tabValue } = useSelector(
    (state) => state.popup
  );
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

  if (!isVisible) return null;

  const filteredData = data.filter(
    (el) =>
      el.market === tabValue && el.display_name.toLowerCase().includes(searchTerm) 
  );

  const topAssets = tabValue === "pupular"
  ? [...data]
      .sort((a, b) => b.display_order - a.display_order)
      .slice(0, 10)
  : filteredData;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="bg-white p-4 rounded shadow-lg text-center text-black relative overflow-auto"
        ref={popupRef}
        style={{
          maxWidth: "90%",
          maxHeight: "80%",
          padding: "40px 20px",
          margin: "auto",
        }}
      >
        <h1>Here You can see Your Assets list</h1>
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
            value={searchTerm} // Bind input value to searchTerm state
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
                aria-label="lab API tabs example"
              >
                <Tab label="Popular" value="pupular" />
                <Tab label="Commodities" value="commodities" />
                <Tab label="Crypto Currency" value="cryptocurrency" />
                <Tab label="Forex" value="forex" />
                <Tab label="Indices" value="indices" />
                <Tab label="Synthetic Index" value="synthetic_index" />
                <Tab label="Watch List" value="watch_list" />
              </TabList>
            </Box>
            <TabPanel value={tabValue}>
              {topAssets.length > 0 ? (
                <div>
                  {/* Header for Display Name and Symbol */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    <span>Display Name</span>
                    <span>Symbol</span>
                  </div>

                  {/* Display filtered data */}
                  {topAssets.map((el) => (
                    <div
                      key={el.display_name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0", // Add padding for spacing between items
                        borderBottom: "1px solid #e0e0e0", // Optional: Add a border between rows
                      }}
                    >
                      <span>{el.display_name}</span>
                      <span>{el.symbol}</span>
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
