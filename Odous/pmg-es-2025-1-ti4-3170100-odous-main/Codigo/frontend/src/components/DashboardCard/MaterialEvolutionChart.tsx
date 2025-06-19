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
  Adquirido: number;
}

interface Props {
  data: EvolutionData[];
  loading: boolean;
}

const MaterialEvolutionChart: React.FC<Props> = ({ data, loading }) => (
  <DashboardCardGraph title="Evolução da aquisição de materiais">
    {loading ? (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Carregando...
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Adquirido" stroke="#1976d2" />
        </LineChart>
      </ResponsiveContainer>
    )}
  </DashboardCardGraph>
);

export default MaterialEvolutionChart;
