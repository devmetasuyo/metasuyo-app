"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import styles from "./StatsCard.module.scss";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
  data: number[]; // Datos para el gráfico
}

export const CHART_COLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

const StatsCard = ({ title, value, icon, data }: StatsCardProps) => {
  const DATA_COUNT = 10;
  const labels = [];
  for (let i = 0; i < DATA_COUNT; ++i) {
    labels.push(i.toString());
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div>
        <div
          style={{
            width: "100%",
            height: "100%",
            flex: "1 1 0",
          }}
        >
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.value}>{value}</p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "120px",
        }}
      >
        <ResponsiveContainer>
          <AreaChart
            margin={{
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
            }}
            data={data.map((data) => {
              return { data: data };
            })}
          >
            <Tooltip />
            <Area
              type="monotone"
              dataKey={"data"}
              stroke={CHART_COLORS.red}
              fill={CHART_COLORS.red}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsCard;
