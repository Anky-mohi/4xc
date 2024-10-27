import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function TradeSummary({ socket }) {
  const [trades, setTrades] = useState([]);
  const apiData = useSelector((state) => state.dashboardApi.apiData);
  const accountList = apiData?.data?.account_list || [];
  const virtualAccount = accountList.find((acc) => acc.is_virtual);
  const [showAllSammery, setShowAllSammery] = useState(false);

  // Function to format expiration time in mm:ss
  const formatExpirationTime = (epochTime) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = epochTime - currentTime;
    if (remainingTime <= 0) return "Expired";

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    const handleTradeStream = (data) => {
      if (data?.proposal_open_contract) {
        const {
          purchase_time,
          profit,
          is_valid_to_sell,
          underlying,
          buy_price,
          expiry_time,
          transaction_ids,
          payout,
          status,
          contract_id,
        } = data.proposal_open_contract;

        const tradeStream = {
          purchaseTime: purchase_time,
          profitAfterSale: profit,
          isValidToSell: is_valid_to_sell,
          assetName: underlying,
          totalInvestment: buy_price,
          expirationTime: expiry_time,
          transactionId: transaction_ids.buy,
          expectedPayout: payout,
          tradeStatus: status,
          contractId: contract_id,
        };

        setTrades((prevTrades) => {
          const filteredTrades = prevTrades.filter(
            (trade) => trade.tradeStatus === "open"
          );
          const tradeIndex = filteredTrades.findIndex(
            (trade) => trade.transactionId === tradeStream.transactionId
          );

          if (tradeStream.tradeStatus !== "open") {
            return tradeIndex !== -1
              ? filteredTrades.filter(
                  (trade) => trade.transactionId !== tradeStream.transactionId
                )
              : filteredTrades;
          }

          if (tradeIndex !== -1) {
            filteredTrades[tradeIndex] = tradeStream;
            return [...filteredTrades];
          } else {
            return [...filteredTrades, tradeStream];
          }
        });
      }
    };

    socket.on("purchasedTradeStream", handleTradeStream);

    return () => socket.off("purchasedTradeStream", handleTradeStream);
  }, [socket]);

  const sellTrade = (trade) => () =>
    socket.emit("sellTrade", {
      token: apiData.token,
      loginid: virtualAccount.loginid,
      price: 0,
      sell: trade.contractId,
    });

  return (
    <>
      {trades?.length > 0 ? (
        <>
          {showAllSammery ? (
            <div className="trade-summary">
              <h2 className="trade-summary-title">
                Sell Options ({trades.length})
              </h2>
              <div className="trade-summary-content">
                {trades.map((trade, index) => (
                  <div key={index} className="trade-item">
                    <div className="trade-detail amount">
                      $ {trade.totalInvestment}
                    </div>
                    <div className="trade-detail expected-profit">
                      -$ {trade.expectedPayout}
                    </div>
                    <div
                      className={`trade-detail profit-after-sale ${
                        trade.profitAfterSale > 0 ? "green" : "red"
                      }`}
                    >
                      -$ {trade.profitAfterSale}
                    </div>
                    <div className="trade-detail expiration-time">
                      Exp: {formatExpirationTime(trade.expirationTime)}
                    </div>
                    <button className="sell-button" onClick={sellTrade(trade)}>
                      Sell
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="trade-summary-first">
            <div class="summary-table-first">
              <div className="trade-summary-content-first">
                <div className="trade-item-first">
                  <div className="trade-detail-first amount">
                    💲{trades[0].totalInvestment}
                  </div>
                  <div className="trade-detail-first expected-profit">
                    -💲{trades[0].expectedPayout}
                  </div>
                  <div
                    className={`trade-detail-first profit-after-sale ${
                      trades[0].profitAfterSale > 0 ? "green" : "red"
                    }`}
                  >
                    -💲{trades[0].profitAfterSale}
                  </div>
                  <div className="trade-detail-first expiration-time">
                    Exp: {formatExpirationTime(trades[0].expirationTime)}
                  </div>
                  <button className="sell-button-first">Sell</button>
                  <button
                    className="sell-all-button-first"
                    onClick={() => setShowAllSammery(true)}
                  >
                    Sell All {trades.length}
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default TradeSummary;
