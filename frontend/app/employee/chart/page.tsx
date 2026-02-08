"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function AttendanceChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    API.get("/employee/chart").then((res) => {
      const dates = res.data.map((d: any) => d.date);
      const minutes = res.data.map((d: any) => d.total_minutes);

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Working Minutes",
            data: minutes,
            borderColor: "blue",
            backgroundColor: "lightblue",
          },
        ],
      });
    });
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div>
      <h2>Attendance History</h2>
      <Line data={chartData} />
    </div>
  );
}
