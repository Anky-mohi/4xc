import React, { useEffect, useRef } from "react";
import styles from "../styles/Chart.module.css"
import { createChart } from "lightweight-charts";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
import { useDispatch, useSelector } from "react-redux";


function Chart() {
    const chartRef = useRef(null);
  const selectedAssets = useSelector((state) => state.popup.selectedAssets);
  const assetToTrack = selectedAssets.length > 0 ? selectedAssets[selectedAssets.length-1] : null; 
  const [dataPoints, setDataPoints] = React.useState([]);

  useEffect(() => {
    if (!assetToTrack) return;

    socket.emit('joinAssetRoom', assetToTrack);
    
    socket.on('assetData', (data) => {
      console.log('Received live data:', data);
      
      const newPoint = {
        time: data.epoch,
        value: data.quote
      };
      
      setDataPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        if (!lastPoint || newPoint.time > lastPoint.time) {
          const updatedPoints = [...prevPoints, newPoint];
          
          updatedPoints.sort((a, b) => a.time - b.time);
          
          return updatedPoints;
        }
        return prevPoints;
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
      const areaSeries = chart.addAreaSeries({
        lineColor: "#fff",
        topColor: "#b6b6b6",
        bottomColor: "#b6b6b621",
      });

      // Initialize the chart with the first set of data points
      areaSeries.setData(dataPoints);
      chartRef.current = chart;

      // Update chart data whenever dataPoints changes
      areaSeries.setData(dataPoints);

      // Fit chart to content
      chart.timeScale().fitContent();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [dataPoints]);

  
  return (
    <div className="w-10/12">
      <div className={styles.block_content}>
        <div
          id="main_chart_container_1"
          className={styles.chartContainer}
        ></div>
      </div>
    </div>
  );
}

export default Chart;
