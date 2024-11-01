import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from "../styles/TransactionLog.module.css";

const TransactionLog = ({ isOpen, onClose, socket, userInfo }) => {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  const fetchTransactions = () => {
    setLoading(true);
    socket.emit("transcationHistoryRequest", {
      profit_table: 1,
      description: 1,
      limit: limit,
      offset: offset,
      sort: "DESC",
      loginid: userInfo.acc1,
      token: userInfo.token1,
    });
  };

  useEffect(() => {
    socket.on("transcationHistory", (data) => {
      console.log("transcationHistory", data);

      if (data.profit_table && Array.isArray(data.profit_table.transactions)) {
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          ...data.profit_table.transactions,
        ]);
      } else {
        console.warn("Received unexpected data format:", data);
      }
      setLoading(false);
    });

    return () => {
      socket.off("transcationHistory");
    };
  }, [socket]);

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, offset, socket, userInfo]);

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
  };

  if (!isOpen) return null;
  return (
    <div className={` ${transactions ? styles.show : ""}`}>
      <div className="relative bg-[#1e2537]">
        <h2 className={`${styles.heading} pt-5 text-gray-400 bg-[#1e2537]`}>Transaction History</h2>
        <TableContainer
          sx={{
            overflowX:"hidden",
            maxHeight: 440,
            backgroundColor: "#1e2537",
            maxWidth: "440px",
          }}
          className={styles.tableContainer}
        >
          <Table sx={{ minWidth: 400 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ backgroundColor: "#1e2537", color: "#f5f5f5",borderBottom:"1px solid #4b5563"  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#1e2537", color: "#f5f5f5", borderBottom:"1px solid #4b5563"  }}
                  align="right"
                >
                  Buy Price
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#1e2537", color: "#f5f5f5" , borderBottom:"1px solid #4b5563" }}
                  align="right"
                >
                  Expected Payout
                </TableCell>
                <TableCell
                  sx={{ backgroundColor: "#1e2537", color: "#f5f5f5", borderBottom:"1px solid #4b5563"  }}
                  align="right"
                >
                  Sell Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    color: "#fff",
                    backgroundColor: "#1e2537",
                    fontSize: "12px",
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ color: "#fff", borderBottom:"1px solid #4b5563" }}>
                    {row.contract_type}
                    <br />
                    {new Date(row.purchase_time * 1000).toLocaleString()}
                    <br />
                    {row.underlying_symbol}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#fff", borderBottom:"1px solid #4b5563"  }}>
                    {row.buy_price}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#fff", borderBottom:"1px solid #4b5563"  }}>
                    {row.payout}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#fff", borderBottom:"1px solid #4b5563"  }}>
                    {row.sell_price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {transactions.length > 0 && (
          <div className="pl-4 pt-[30px]">
            <button
              className={styles.loadMoreButton}
              onClick={handleLoadMore}
              disabled={loading}
            >
              Load More
            </button>
          </div>
        )}
        {loading && (
          <div className="absolute bg-[#1e2537] top-0 left-0 w-full h-full z-[111] flex items-center justify-center">
            <div role="status" className="flex justify-center items-center">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionLog;
