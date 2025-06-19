import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DashboardCardGraph from "./DashboardCardGraph";

interface ComparativoItem {
  semifinishedName: string;
  ok: number;
  disponivel: number;
}

interface Props {
  data: ComparativoItem[];
  loading: boolean;
}

const SemiComparativoProduzidoDisponivel: React.FC<Props> = ({
  data,
  loading,
}) => (
  <DashboardCardGraph title="Produzido OK x Disponível por Semiacabado">
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
                      dataKey="semifinishedName"
                      type="category"
                      width={120}
                      tickFormatter={(value) =>
                        value.length > 20 ? value.substring(0, 20) + "..." : value
                      }
                    />
          <Tooltip />
          <Legend />
          <Bar dataKey="ok" name="Produzido OK" fill="#1976d2" />
          <Bar dataKey="disponivel" name="Disponível" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    )}
  </DashboardCardGraph>
);

export default SemiComparativoProduzidoDisponivel;