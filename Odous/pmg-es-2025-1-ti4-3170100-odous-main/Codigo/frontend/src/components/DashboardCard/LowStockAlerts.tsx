import React from "react";
import { Paper } from "@mui/material";

interface LowStockItem {
  name: string;
  qty: number;
}
interface Props {
  items: LowStockItem[];
}

const LowStockAlerts: React.FC<Props> = ({ items }) =>
  items.length === 0 ? null : (
    <Paper
      style={{
        background: "#ffe6e6",
        padding: 16,
        margin: "16px 0",
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <strong
        style={{
          fontFamily: "Roboto, Arial, sans-serif",
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        Atenção! Estoque baixo para:
      </strong>
      <ul
        style={{
          margin: 0,
          paddingLeft: 10,
          paddingTop: 10,
          fontFamily: "Roboto, Arial, sans-serif",
          fontSize: 15,
        }}
      >
        {items.map((item) => (
          <li
            key={item.name}
            style={{ fontFamily: "Roboto, Arial, sans-serif", fontWeight: 400 }}
          >
            {item.name} — {item.qty} em estoque
          </li>
        ))}
      </ul>
    </Paper>
  );

export default LowStockAlerts;