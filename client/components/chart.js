import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Chart.module.css";
import { createChart } from "lightweight-charts";
import io from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_DB_BASE_URL);
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";

import { useDispatch, useSelector } from "react-redux";
import { fetchHistoricalData } from "../store/slices/chartApi";

function Chart() {
    const dispatch = useDispatch();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    const selectedAssets = useSelector((state) => state.popup.selectedAssets);
    const assetToTrack =
        selectedAssets && selectedAssets.length > 0
            ? selectedAssets[selectedAssets.length - 1]
            : null;

    const dataPoints = useSelector((state) => state.chart.dataPoints || []);
    const candleData = useSelector((state) => state.chart.candleData || []);
    const isLoading = useSelector((state) => state.chart.loading);

    const [isCandlestickChart, setIsCandlestickChart] = useState(false);
    const [isTimePopUp, setIsTimePopUp] = useState(false);
    const [hasFetchedHistoricalData, setHasFetchedHistoricalData] = useState(false);
    const [lastClosePrice, setLastClosePrice] = useState(null);
 
    // Helper function to sort and filter duplicate data points
    const sortAndFilterData = (data) => {
        const uniqueTimes = new Set();
        return data
            .filter(point => {
                if (uniqueTimes.has(point.time)) {
                    return false; // Ignore duplicate time
                }
                uniqueTimes.add(point.time);
                return true; // Keep unique time
            })
            .sort((a, b) => a.time - b.time); // Sort by time
    };
    const limitData = (data, limit = 60) => {
        if (data.length > limit) {
            return data.slice(data.length - limit);
        }
        return data;
    };
    // Update chart data
    const updateChartData = () => {
        if (seriesRef.current) {
            const sortedDataPoints = sortAndFilterData([...dataPoints]); // Sort and filter duplicates
            const sortedCandleData = sortAndFilterData([...candleData]); // Sort and filter duplicates

            const dataToUpdate = isCandlestickChart ? limitData(sortedCandleData,60) : limitData(sortedDataPoints,60);
            seriesRef.current.setData(dataToUpdate); // Update with the new data points
        }
    };

    useEffect(() => {
        if (!assetToTrack) return;

        // Fetch historical data only if not fetched before
        if (!hasFetchedHistoricalData) {
            dispatch(fetchHistoricalData(assetToTrack));
            setHasFetchedHistoricalData(true);
        }
        
        socket.emit("joinAssetRoom", assetToTrack);
        socket.on("assetData", (data) => {
            // Ensure data is valid
            if (!data || typeof data.epoch !== 'number' || typeof data.quote !== 'number') return;

            const newPoint = {
                time: data.epoch,
                value: data.quote,
            };
            const priceFluctuation = data.quote;
            const openPrice = data.quote * (1 - Math.random());
            const closePrice = data.quote * (1 + Math.random());

            const newCandle = {
                time: data.epoch,
                open: openPrice,
                high: Math.max(openPrice, closePrice) + Math.random() * priceFluctuation,
                low: Math.min(openPrice, closePrice) - Math.random() * priceFluctuation,
                close: closePrice,
            };
            if (lastClosePrice !== null) {
              const currentCandleColor = closePrice < lastClosePrice ? "#f44336" : "#4caf50"; // Red or Green
              newCandle.color = currentCandleColor;
              newCandle.borderColor  = currentCandleColor;
              newCandle.wickColor = currentCandleColor;
              newCandle.barSpacing =  8;
              newCandle.thinBars =  false;
          }
      
          // Save the current candle as the last candle for the next iteration
          setLastClosePrice(closePrice);
      
            // Dispatch data for area chart
            if (!isCandlestickChart) {
                dispatch({ type: 'chart/addDataPoint', payload: newPoint });
            } else {
                // Append new candle data
                dispatch({ type: 'chart/addCandleData', payload: newCandle });
            }

            // Update chart data
            if (seriesRef.current) {
                const updatedCandleData = sortAndFilterData(candleData);
                seriesRef.current.setData(updatedCandleData); // Set updated candle data
            }
        });
          
        return () => {
            socket.off('proposal');
            socket.emit("leaveAssetRoom", assetToTrack);
            socket.off("assetData");
        };
    }, [assetToTrack, dispatch, candleData, hasFetchedHistoricalData, isCandlestickChart]);

    // Setup chart configuration when data updates or chart type changes
    useEffect(() => {
        const chartContainer = document.getElementById("main_chart_container_1");

        if (chartContainer && !chartRef.current) {
            const chartOptions = {
                layout: {
                    textColor: "#d9d9d9",
                    background: { type: "solid", color: "transparent" },
                },
                grid: {
                    vertLines: { color: "#3a3a3a" },
                    horzLines: { color: "#3a3a3a" },
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: true,
                    tickMarkFormatter: (time) => {
                        const date = new Date(time * 1000);
                        return `${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
                    },
                    tickMarkSpacing: 2000,
                },
                priceScale: {
                    mode: 1, // Ensure price scale is not scaled automatically
                    scaleMargins: {
                        top: 0.3,  // 30% margin at the top
                        bottom: 0.3, // 30% margin at the bottom
                    },
                    borderVisible: false, // Hide the border to reduce clutter
                },
                handleScroll: true,
                handleScale: true,
            };

            const chart = createChart(chartContainer, chartOptions);
            let series;

            if (isCandlestickChart) {
                series = chart.addCandlestickSeries({
                    upColor: "#4caf50", // Green for bullish candles
                    downColor: "#f44336", // Red for bearish candles
                    borderDownColor: "#f44336",
                    borderUpColor: "#4caf50",
                    wickDownColor: "#f44336",
                    wickUpColor: "#4caf50",
                    // Smoothing effect by adjusting candle width
                    barSpacing: 6,
                    priceLineVisible: true,
                    priceLineWidth: 1,
                    priceLineColor: "#fff",
                    priceLineStyle: 2,
                });
                seriesRef.current = series;
                series.setData(limitData(sortAndFilterData(candleData), 60)); 
            } else {
                series = chart.addAreaSeries({
                    lineColor: "#fff",
                    topColor: "#b6b6b6",
                    bottomColor: "#b6b6b621",
                });
                seriesRef.current = series;
                series.setData(limitData(sortAndFilterData(dataPoints), 60)); 
            }

            chartRef.current = chart;
            chart.timeScale().fitContent();
        } else if (seriesRef.current) {
            updateChartData(); // Ensure chart is updated with new data
        }

        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [dataPoints, candleData, isCandlestickChart]);

    const toggleChartType = () => {
        setIsCandlestickChart((prev) => !prev);
        setHasFetchedHistoricalData(false); // Reset the historical data fetch state
    };

    const togglePopupTimeHandle = () => {
        setIsTimePopUp((prev) => !prev);
    };

    return (
        <div className="w-10/12 relative">
            <div className={styles.block_content}>
                {isLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loadingCircle}></div>
                    </div>
                )}

                <div id="main_chart_container_1" className={styles.chartContainer}>
                    <div className={styles.iconsgroup}>
                        <div onClick={toggleChartType} className={styles.icon}>
                            {isCandlestickChart ? (
                                <ShowChartIcon sx={{ color: "#fff" }} />
                            ) : (
                                <CandlestickChartIcon sx={{ color: "#fff" }} />
                            )}
                        </div>
                        <div className={styles.icon} style={{ color: "#fff" }}>
                            <span onClick={togglePopupTimeHandle}> 2Min </span>
                            {isTimePopUp && (
                                <div className={styles.time_scale_pop}>
                                    <div className={styles.row_time}>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">2Min</div>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">5Min</div>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">15Min</div>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">30Min</div>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">3Hour</div>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">1Day</div>
                                        <div className="w-[48%] hover:bg-[#222] px-[5px]">30Day</div>
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
