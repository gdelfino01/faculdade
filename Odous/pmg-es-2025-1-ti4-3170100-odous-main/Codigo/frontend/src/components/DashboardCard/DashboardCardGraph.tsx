import React from "react";
import { CardContainer, CardTitle, IconWrapper } from "./styles";

interface DashboardCardGraphProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardCardGraph: React.FC<DashboardCardGraphProps> = ({
  title,
  icon,
  children,
}) => (
  <CardContainer
    style={{ minHeight: 320, display: "flex", flexDirection: "column" }}
  >
    {icon && <IconWrapper>{icon}</IconWrapper>}
    <CardTitle style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
      {title}
    </CardTitle>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 200,
      }}
    >
      {children}
    </div>
  </CardContainer>
);

export default DashboardCardGraph;