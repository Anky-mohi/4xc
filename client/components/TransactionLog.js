import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styles from "../styles/TransactionLog.module.css";

const TransactionLog = ({ isOpen, onClose, socket, userInfo }) => {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  const fetchTransactions = () => {
    setLoading(true);
    socket.emit('transcationHistoryRequest', {
      profit_table: 1,
      description: 1,
      limit: limit,
      offset: offset,
      sort: "DESC",
      loginid: userInfo.acc1,
      token: userInfo.token1
    });
  };

  useEffect(() => {
    socket.on('transcationHistory', (data) => {
      console.log('transcationHistory', data);

      if (data.profit_table && Array.isArray(data.profit_table.transactions)) {
        setTransactions(prevTransactions => [...prevTransactions, ...data.profit_table.transactions]);
      } else {
        console.warn("Received unexpected data format:", data);
      }
      setLoading(false);
    });

    return () => {
      socket.off('transcationHistory');
    };
  }, [socket]);

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, offset, socket, userInfo]);

  const handleLoadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  if (!isOpen) return null;
  return (
    <div className={`${styles.popup} ${transactions ? styles.show : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>X</button>
      <h2 className={styles.heading}>Transaction History</h2>
      <TableContainer sx={{ maxHeight: 440, backgroundColor: "#fff" }} className={styles.tableContainer}>
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }}>Type</TableCell>
              <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Buy Price</TableCell>
              <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Expected Payout</TableCell>
              <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Purchase Time</TableCell>
              <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Sell Price</TableCell>
              <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Underlying Symbol</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: "#fff", backgroundColor: "#000" }}
              >
                <TableCell component="th" scope="row" sx={{ color: "#fff" }}>
                  {row.contract_type}
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>{row.buy_price}</TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>{row.payout}</TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>{new Date(row.purchase_time * 1000).toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>{row.sell_price}</TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>{row.underlying_symbol}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {transactions.length > 0 && (
        <button className={styles.loadMoreButton} onClick={handleLoadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
};

export default TransactionLog;
