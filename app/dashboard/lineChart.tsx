"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 5,
      bottom: 5,
    },
  },

  responsive: true,
  maintainAspectRatio: false,
};
const AccuracyLineChart = ({ accuracyChartData, labels }: any) => {
  const data = {
    labels,
    datasets: [accuracyChartData],
  };
  // console.log(data);
  return <Line className="relative sm:h-56" options={options} data={data} />;
};
const WpmLineChart = ({ wpmChartData, labels }: any) => {
  const data = {
    labels,
    datasets: [wpmChartData],
  };
  // console.log(data);
  return <Line className="relative sm:h-56" options={options} data={data} />;
};

export { AccuracyLineChart, WpmLineChart };
