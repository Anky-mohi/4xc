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
  const [isCandlestickChart, setIsCandlestickChart] = useState(false); // Switch between charts

  useEffect(() => {
    if (!assetToTrack) return;

    socket.emit('joinAssetRoom', assetToTrack);

    socket.on('assetData', (data) => {
      console.log('Received live data:', data);

      // For area chart data points
      const newPoint = {
        time: data.epoch,
        value: data.quote
      };

      // For candle chart data points (mocking a simple example using random generation for open, high, low, close)
      const newCandle = {
        time: data.epoch,
        open: data.quote * (1 - Math.random() * 0.02), // Mock open price
        high: data.quote * (1 + Math.random() * 0.02), // Mock high price
        low: data.quote * (1 - Math.random() * 0.02), // Mock low price
        close: data.quote, // Close price is the live quote
      };

      // Update area chart data (keep only the last 10 points)
      setDataPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        if (!lastPoint || newPoint.time > lastPoint.time) {
          const updatedPoints = [...prevPoints, newPoint].slice(-10); // Keep last 10
          updatedPoints.sort((a, b) => a.time - b.time);
          return updatedPoints;
        }
        return prevPoints;
      });

      // Update candlestick chart data (keep only the last 10 candles)
      setCandleData((prevCandles) => {
        const lastCandle = prevCandles[prevCandles.length - 1];
        if (!lastCandle || newCandle.time > lastCandle.time) {
          const updatedCandles = [...prevCandles, newCandle].slice(-10); // Keep last 10
          updatedCandles.sort((a, b) => a.time - b.time);
          return updatedCandles;
        }
        return prevCandles;
      });
    });

    return () => {
      socket.emit('leaveAssetRoom', assetToTrack);
      socket.off('assetData');
    };
  }, [assetToTrack]);

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
      };

      const chart = createChart(chartContainer, chartOptions);

      let series;

      if (isCandlestickChart) {
        // Candlestick chart
        series = chart.addCandlestickSeries({
          upColor: '#4caf50',
          downColor: '#f44336',
          borderDownColor: '#f44336',
          borderUpColor: '#4caf50',
          wickDownColor: '#f44336',
          wickUpColor: '#4caf50',
        });
        series.setData(candleData); // Set candlestick data
      } else {
        // Area chart
        series = chart.addAreaSeries({
          lineColor: "#fff",
          topColor: "#b6b6b6",
          bottomColor: "#b6b6b621",
        });
        series.setData(dataPoints); // Set area chart data
      }

      chartRef.current = chart;

      // Fit chart to content
      chart.timeScale().fitContent();
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
    <div className="w-10/12">
      <div className={styles.block_content}>
        <button onClick={toggleChartType} className={styles.chartSwitchButton}>
          {isCandlestickChart ? 'Switch to Area Chart' : 'Switch to Candlestick Chart'}
        </button>
        <div
          id="main_chart_container_1"
          className={styles.chartContainer}
        ></div>
      </div>
    </div>
  );
}

export default Chart;
