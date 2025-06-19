import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DashboardCardGraph from "./DashboardCardGraph";

interface EvolutionData {
  date: string;
  ok: number;
  ng: number;
}

interface Props {
  data: EvolutionData[];
  loading: boolean;
}

const SemiEvolutionChart: React.FC<Props> = ({ data, loading }) => (
  <DashboardCardGraph title="Evolução da produção de semiacabados (OK x NG)">
    {loading ? (
      <div
        style={{
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Carregando...
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ok"
            name="Produzido OK"
            stroke="#1976d2"
          />
          <Line
            type="monotone"
            dataKey="ng"
            name="Produzido NG"
            stroke="#FF0000"
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </DashboardCardGraph>
);

export default SemiEvolutionChart;
