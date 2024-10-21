import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from "../styles/TransactionLog.module.css"; 

const TransactionLog = ({ transactions, closePopup }) => {
  const [visibleTransactions, setVisibleTransactions] = useState(25);

  const loadMoreTransactions = () => {
    setVisibleTransactions(prev => prev + 25);
  };

  const rows = transactions.profit_table.transactions.slice(0, visibleTransactions);

  return (
    <div className={`${styles.popup} ${transactions ? styles.show : ''}`}>
      <button className={styles.closeButton} onClick={closePopup}>X</button>
      <h2 className={styles.heading}>Transaction History</h2>
      <TableContainer sx={{ maxHeight: 440, backgroundColor: "#fff" }} className={styles.tableContainer}>
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
            <TableRow>
                <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }}>Type</TableCell>
                <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Buy Price</TableCell>
                <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Payout</TableCell>
                <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Purchase Time</TableCell>
                <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Sell Price</TableCell>
                <TableCell sx={{ backgroundColor: "#000", color: "#f5f5f5" }} align="right">Underlying Symbol</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                key={row.contract_type}
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

      {transactions?.profit_table?.transactions?.length > visibleTransactions && (
        <button className={styles.loadMoreButton} onClick={loadMoreTransactions}>
          Load More
        </button>
      )}
    </div>
  );
};

export default TransactionLog;
