import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Chart.module.css";
import { createChart } from "lightweight-charts";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
import { useDispatch, useSelector } from "react-redux";

function Chart() {
  const chartRef = useRef(null);
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const assetToTrack = selectedAssets.length > 0 ? selectedAssets[selectedAssets.length - 1] : selectedAssets[0];
  const [dataPoints, setDataPoints] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [isCandlestickChart, setIsCandlestickChart] = useState(false);

  const [isLoading, setIsLoading] = useState(true); // To control loading state

  useEffect(() => {
    if (!assetToTrack) return;
    socket.emit('joinAssetRoom', assetToTrack);

    socket.on('assetData', (data) => {
      console.log('Received live data:', data);

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

      setDataPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        if (!lastPoint || newPoint.time > lastPoint.time) {
          const updatedPoints = [...prevPoints, newPoint].slice(-40); 
          updatedPoints.sort((a, b) => a.time - b.time);
          return updatedPoints;
        }
        return prevPoints;
      });

      setCandleData((prevCandles) => {
        const lastCandle = prevCandles[prevCandles.length - 1];
        const isGreen = !lastCandle || newCandle.close >= lastCandle.close; 
        const coloredCandle = {
          ...newCandle,
          color: isGreen ? '#4caf50' : '#f44336',
          borderColor: isGreen ? '#4caf50' : '#f44336',
          wickColor: isGreen ? '#4caf50' : '#f44336',
        };
        const updatedCandles = [...prevCandles, coloredCandle].slice(-40);
        updatedCandles.sort((a, b) => a.time - b.time);
        return updatedCandles;
      });
    });

    return () => {
      socket.emit('leaveAssetRoom', assetToTrack);
      socket.off('assetData');
    };
  }, [assetToTrack]);

  useEffect(() => {
    const chartContainer = document.getElementById("main_chart_container_1");
    
    // Wait until we have at least 30 data points before rendering the chart
    if (chartContainer && !chartRef.current) {
      if ((isCandlestickChart && candleData.length >= 30) || (!isCandlestickChart && dataPoints.length >= 30)) {
        const chartOptions = {
          layout: {
            textColor: "white",
            background: { type: "solid", color: "transparent" },
          },
          grid: {
            vertLines: { color: "#444" },
            horzLines: { color: "#444" },
          },
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

        chartRef.current = chart;
        chart.timeScale().fitContent();

        setIsLoading(false);
      }
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

  return (
    <div className="w-10/12 relative">
      <div className={styles.block_content}>
        <button onClick={toggleChartType} className={styles.chartSwitchButton}>
          {isCandlestickChart ? 'Switch to Area Chart' : 'Switch to Candlestick Chart'}
        </button>

        {/* Loading Overlay */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingCircle}></div>
          </div>
        )}

        <div
          id="main_chart_container_1"
          className={styles.chartContainer}
        ></div>
      </div>
    </div>
  );
}

export default Chart;
