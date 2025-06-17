"use client";

import { useEffect, useState } from "react";
import { Banner, Degradado, Title } from "@/components";
import styles from "./stats.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

type Stats = {
  clients: {
    total: number;
    newThisMonth: number;
  };
  invoices: {
    total: number;
    totalRevenue: number;
    monthlyRevenue: Array<{
      fecha: string;
      _sum: { total: number };
    }>;
  };
  products: {
    topSellers: Array<{
      producto_id: string;
      _sum: { cantidad: number };
    }>;
  };
};

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        const data = await response.json();
        if (data.status === "success") {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return <div>Cargando...</div>;
  }

  const revenueData = {
    labels: stats.invoices.monthlyRevenue.map((item) =>
      new Date(item.fecha).toLocaleDateString("es-ES", { month: "short" })
    ),
    datasets: [
      {
        label: "Ingresos Mensuales",
        data: stats.invoices.monthlyRevenue.map((item) => item._sum.total),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <>
      <Banner
        title="Estadísticas Generales"
        icon={true}
        imageUrl="/fondo.jpg"
        session={false}
        subtitle=""
        style={{
          height: "450px",
          backgroundPositionY: "center",
          backgroundPositionX: "center",
          background:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/fondo.jpg')",
        }}
      />
      <Degradado />
      <Title title="Dashboard de Estadísticas" />

      <div className={styles.container}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Clientes</h3>
            <div className={styles.statNumbers}>
              <div>
                <span className={styles.statLabel}>Total</span>
                <span className={styles.statValue}>{stats.clients.total}</span>
              </div>
              <div>
                <span className={styles.statLabel}>Nuevos este mes</span>
                <span className={styles.statValue}>
                  {stats.clients.newThisMonth}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <h3>Facturas</h3>
            <div className={styles.statNumbers}>
              <div>
                <span className={styles.statLabel}>Total</span>
                <span className={styles.statValue}>{stats.invoices.total}</span>
              </div>
              <div>
                <span className={styles.statLabel}>Ingresos Totales</span>
                <span className={styles.statValue}>
                  ${stats.invoices.totalRevenue}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.chartSection}>
          <div className={styles.chartCard}>
            <h3>Ingresos Mensuales</h3>
            <div className={styles.chartContainer}>
              <Line
                data={revenueData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top" as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3>Productos Más Vendidos</h3>
            <div className={styles.topProducts}>
              {stats.products.topSellers.map((product, index) => (
                <div key={product.producto_id} className={styles.topProduct}>
                  <span className={styles.productRank}>#{index + 1}</span>
                  <span className={styles.productId}>
                    {product.producto_id}
                  </span>
                  <span className={styles.productSales}>
                    {product._sum.cantidad} unidades
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
