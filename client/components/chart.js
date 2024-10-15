import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Chart.module.css";
import { createChart } from "lightweight-charts";
import io from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_DB_BASE_URL);
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';

import { useDispatch, useSelector } from "react-redux";

function Chart() {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const assetToTrack = selectedAssets.length > 0 ? selectedAssets[selectedAssets.length - 1] : selectedAssets[0];
  const [dataPoints, setDataPoints] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [isCandlestickChart, setIsCandlestickChart] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [purchasePrice, setPurchasePrice] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);
  const [isTimePopUp, setIsTimePopUp] = useState(false);

  useEffect(() => {
    if (!assetToTrack) return;
    socket.emit('joinAssetRoom', assetToTrack);

    socket.on('assetData', (data) => {

      const newPoint = {
        time: data.epoch,
        value: data.quote
      };
      const priceFluctuation = data.quote * 0.02;

      const openPrice = data.quote * (1 - Math.random() * 0.01);
      const closePrice = data.quote * (1 + Math.random() * 0.01);

      const newCandle = {
        time: data.epoch,
        open: openPrice,
        high: Math.max(openPrice, closePrice) + Math.random() * priceFluctuation, 
        low: Math.min(openPrice, closePrice) - Math.random() * priceFluctuation,  
        close: closePrice,
      };

      // Smooth update for the area chart
      if (!isCandlestickChart) {
        setDataPoints((prevPoints) => {
          const lastPoint = prevPoints[prevPoints.length - 1];
          if (!lastPoint || newPoint.time > lastPoint.time) {
            seriesRef.current.update(newPoint); // Use update instead of setData
            return [...prevPoints, newPoint].slice(-100);
          }
          return prevPoints;
        });
      }

      // Smooth update for candlestick chart
      setCandleData((prevCandles) => {
        const lastCandle = prevCandles[prevCandles.length - 1];
        const isGreen = !lastCandle || newCandle.close >= lastCandle.close;
        const coloredCandle = {
          ...newCandle,
          color: isGreen ? '#4caf50' : '#f44336',
          borderColor: isGreen ? '#4caf50' : '#f44336',
          wickColor: isGreen ? '#4caf50' : '#f44336',
        };
        if (isCandlestickChart && (!lastCandle || newCandle.time > lastCandle.time)) {
          seriesRef.current.update(coloredCandle); // Use update instead of setData
        }
        return [...prevCandles, coloredCandle].slice(-100);
      });

    });

    return () => {
      socket.emit('leaveAssetRoom', assetToTrack);
      socket.off('assetData');
    };
  }, [assetToTrack, isCandlestickChart]);

  useEffect(() => {
    const chartContainer = document.getElementById("main_chart_container_1");

    if (chartContainer && !chartRef.current) {
      const chartOptions = {
        layout: {
          textColor: "white",
          background: { type: "solid", color: "transparent" },
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
        timeScale: {
          timeVisible: true, 
          secondsVisible: true, 
          tickMarkFormatter: (time, tickMarkType, locale) => {
            const date = new Date(time * 1000); 
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${minutes}:${seconds}`; 
          },
          tickMarkSpacing: 2 * 1000
        },
        handleScroll: true,
        handleScale: true,
      };

      const chart = createChart(chartContainer, chartOptions);
      let series;

      if (isCandlestickChart) {
        series = chart.addCandlestickSeries({
          upColor: '#4caf50',
          downColor: '#f44336',
          borderDownColor: '#f44336',
          borderUpColor: '#4caf50',
          wickDownColor: '#f44336',
          wickUpColor: '#4caf50',
        });
        series.setData(candleData);
      } else {
        series = chart.addAreaSeries({
          lineColor: "#fff",
          topColor: "#b6b6b6",
          bottomColor: "#b6b6b621",
        });
        series.setData(dataPoints);
      }

      seriesRef.current = series;

      if (purchasePrice !== null) {
        const purchaseLine = chart.addLineSeries({
          color: '#ff9800',
          lineWidth: 2,
          priceLineVisible: true,
        });
        purchaseLine.setData([{ time: dataPoints[dataPoints.length - 1]?.time, value: purchasePrice }]);
      }

      if (expirationTime !== null) {
        const expirationLine = chart.addLineSeries({
          color: '#2196f3',
          lineWidth: 2,
          priceLineVisible: true,
        });
        expirationLine.setData([{ time: expirationTime, value: 0 }]);
      }

      chartRef.current = chart;
      chart.timeScale().fitContent();
      setIsLoading(false);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [dataPoints, candleData, isCandlestickChart]);

  const toggleChartType = () => {
    setIsCandlestickChart(!isCandlestickChart);
  };
  const togglePopupTimeHandle = () => {
    setIsTimePopUp(!isTimePopUp);
  };

  return (
    <div className="w-10/12 relative">
      <div className={styles.block_content}>
       
        {/* Inputs for purchase and expiration */}
        <div>
          <input 
            type="number" 
            placeholder="Purchase Price" 
            onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
          />
          <input 
            type="number" 
            placeholder="Expiration Time (Epoch)" 
            onChange={(e) => setExpirationTime(parseInt(e.target.value, 10))}
          />
        </div>
  
        {/* Loading Overlay */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingCircle}></div>
          </div>
        )}
  
        <div
          id="main_chart_container_1"
          className={styles.chartContainer}
        >
          <div className={styles.iconsgroup}>
            <div onClick={toggleChartType} className={styles.icon}>
              {isCandlestickChart ?  <ShowChartIcon sx={{color:"#fff"}} /> : <CandlestickChartIcon sx={{color:"#fff"}}/>}
            </div>
            <div className={styles.icon} style={{color:"#fff"}}>
              <span onClick={togglePopupTimeHandle}> 2Min </span>
              {isTimePopUp && (
                <div className={styles.time_scale_pop}>
                  <div className={styles.row_time}>
                    <div className="w-6/12">2Min</div>
                    <div className="w-6/12">5Min</div>
                    <div className="w-6/12">15Min</div>
                    <div className="w-6/12">30Min</div>
                    <div className="w-6/12">3Hour</div>
                    <div className="w-6/12">1Day</div>
                    <div className="w-6/12">30Day</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Chart;
