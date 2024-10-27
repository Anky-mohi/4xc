import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from "@mui/material/Button";
import { Add, Remove, HelpOutline } from "@mui/icons-material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useSelector } from "react-redux";

const RightSidebar = ({ socket }) => {
  const [amount, setAmount] = useState(100);
  const [time, setTime] = useState({ minutes: 1, seconds: 0 });
  const [proposals, setProposals] = useState({ call: null, put: null });

  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const virtualAccount = apiData?.data?.account_list?.find(
    (acc) => acc.is_virtual
  );
  const userToken = apiData.token;

  const lastAmountRef = useRef(amount);
  const lastTimeRef = useRef(time);

  // Generate proposal data
  const generateProposalData = useCallback(
    (contractType) => {
      if (!virtualAccount) return null;
      return {
        proposal: 1,
        amount,
        barrier: "+0.1",
        basis: "stake",
        contract_type: contractType,
        duration: time.minutes * 60 + time.seconds,
        duration_unit: "s",
        currency: virtualAccount.currency,
        symbol: selectedAssets[0],
        loginid: virtualAccount.loginid,
        token: userToken,
      };
    },
    [amount, time, selectedAssets, virtualAccount, userToken]
  );

  // Send proposal request
  const sendProposalRequest = useCallback(() => {
    ["CALL", "PUT"].forEach((type) => {
      const proposalData = generateProposalData(type);
      if (proposalData) {
        socket.emit("proposalRequest", proposalData);
      }
    });
  }, [generateProposalData, socket]);

  // Update proposals when the response is received
  useEffect(() => {
    const handleProposalResponse = (data) => {
      setProposals((prev) => ({
        ...prev,
        [data.type.toLowerCase()]: data.data,
      }));
    };

    // Listen for proposal responses
    socket.on("proposalResponse", handleProposalResponse);

    // Clean up listeners on unmount
    return () => {
      socket.off("proposalResponse", handleProposalResponse);
    };
  }, [socket]);

  // Fetch initial proposal data on mount
  useEffect(() => {
    sendProposalRequest(); // Initial fetch on mount
    lastAmountRef.current = amount;
    lastTimeRef.current = time;

    // Automatic re-fetch every 10 seconds if no changes
    const interval = setInterval(() => {
      // Check if the amount or time has changed
      if (
        lastAmountRef.current === amount &&
        lastTimeRef.current.minutes === time.minutes &&
        lastTimeRef.current.seconds === time.seconds
      ) {
        sendProposalRequest();
      }
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [sendProposalRequest, amount, time]);

  // Handle changes in amount or time
  const handleAmountChange = (delta) => {
    const newAmount = Math.max(0, amount + delta);
    setAmount(newAmount);
    lastAmountRef.current = newAmount; // Update the ref with the new amount
    sendProposalRequest(); // Fetch new proposal on amount change
  };

  const handleTimeChange = (field, delta) => {
    setTime((prev) => {
      let { minutes, seconds } = prev;

      if (field === "seconds") {
        seconds += delta;

        // Wrap seconds and adjust minutes
        if (seconds >= 60) {
          seconds = 0;
          minutes += 1;
        } else if (seconds < 0) {
          seconds = 59;
          minutes = Math.max(0, minutes - 1);
        }
      }

      // Ensure minutes stay within bounds if modified directly
      minutes = Math.min(59, Math.max(0, minutes));

      return { minutes, seconds };
    });
  };

  // Handle purchase trade on button click
  const handlePurchaseTrade = (type) => {
    const proposalData = generateProposalData(type);
    socket.emit("purchaseTrade", proposalData);
  };

  // Format time for display
  const formatTime = (num) => (num < 10 ? `0${num}` : num);

  return (
    <div className="right_sidebar flex flex-col gap-5 pt-5">
      <ControlSection
        label="Amount"
        value={`$${amount}`}
        onDecrease={() => handleAmountChange(-1)}
        onIncrease={() => handleAmountChange(1)}
        inputValue={amount}
        onInputChange={(e) => setAmount(Number(e.target.value))}
      />
      <ControlSection
        label="Time"
        value={`${formatTime(time.minutes)}:${formatTime(time.seconds)}`}
        onDecrease={() => handleTimeChange("seconds", -1)}
        onIncrease={() => handleTimeChange("seconds", 1)}
        inputValue={formatTime(time.minutes)}
        onInputChange={(e) =>
          setTime((prev) => ({
            ...prev,
            minutes: Math.max(0, Number(e.target.value)),
          }))
        }
        secondInputValue={formatTime(time.seconds)}
        onSecondInputChange={(e) => {
          const newSeconds = Math.max(0, Number(e.target.value));
          setTime((prev) => ({
            ...prev,
            minutes: prev.minutes + Math.floor(newSeconds / 60),
            seconds: newSeconds % 60,
          }));
        }}
      />
      ;
      <ProposalButton
        payout={proposals?.call?.payout}
        label="CALL"
        color="from-green-400 via-green-500 to-green-600"
        icon={<TrendingUpIcon />}
        profitPercentage={
          proposals.call
            ? (((proposals.call.payout - amount) / amount) * 100).toFixed(2)
            : "Loading..."
        }
        onClick={() => handlePurchaseTrade("CALL")}
      />
      <ProposalButton
        payout={proposals?.put?.payout}
        label="PUT"
        color="from-red-400 via-red-500 to-red-600"
        icon={<TrendingDownIcon />}
        profitPercentage={
          proposals.put
            ? (((proposals.put.payout - amount) / amount) * 100).toFixed(2)
            : "Loading..."
        }
        onClick={() => handlePurchaseTrade("PUT")}
      />
    </div>
  );
};

const ControlSection = ({
  label,
  value,
  onDecrease,
  onIncrease,
  inputValue,
  onInputChange,
  secondInputValue,
  onSecondInputChange,
}) => (
  <div className="bg-gray-800 rounded-md border border-gray-600 p-2">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400 px-2">{label}</span>
      <HelpOutline className="text-gray-400 mx-2" fontSize="small" />
    </div>
    <div className="flex items-center justify-between gap-2">
      {label === "Time" ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            className="focus:outline-none bg-[#31425a] text-white px-2 rounded"
            style={{ maxWidth: "60px", padding: "5px 10px" }}
          />
          <span className="text-white">:</span>
          <input
            type="text"
            value={secondInputValue}
            onChange={onSecondInputChange}
            className="focus:outline-none bg-[#31425a] text-white px-2 rounded"
            style={{ maxWidth: "60px", padding: "5px 10px" }}
          />
        </div>
      ) : (
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          className="focus:outline-none bg-[#31425a] text-white px-2 rounded"
          style={{ minWidth: "60px", maxWidth: "100px", padding: "5px 10px" }}
        />
      )}
      <div className="flex gap-2">
        <Button
          onClick={onDecrease}
          sx={{ maxWidth: "30px", background: "#31425a" }}
        >
          <Remove style={{ color: "#fff" }} />
        </Button>
        <Button
          onClick={onIncrease}
          sx={{ maxWidth: "30px", background: "#31425a" }}
        >
          <Add style={{ color: "#fff" }} />
        </Button>
      </div>
    </div>
  </div>
);
const ProposalButton = ({
  label,
  payout,
  color,
  icon,
  profitPercentage,
  onClick,
}) => (
  <div className="bg-gray-800 rounded-md border border-gray-600 p-2">
    <div className="flex items-center justify-between">
      <span className="text-xl text-gray-400 px-2">Profit Percentage</span>
      <HelpOutline className="text-gray-400 mx-2" fontSize="small" />
    </div>
    <div className="text-xl text-[#fff] px-2 font-bold py-6">
      {profitPercentage} %
    </div>
    <Button
      className={`sell font-extrabold bg-gradient-to-r ${color} hover:bg-gradient-to-br focus:ring-4 focus:outline-none w-full py-6 px-6`}
      style={{ color: "#fff" }}
      onClick={onClick}
    >
      {icon} {label} {payout}
    </Button>
  </div>
);

export default RightSidebar;
