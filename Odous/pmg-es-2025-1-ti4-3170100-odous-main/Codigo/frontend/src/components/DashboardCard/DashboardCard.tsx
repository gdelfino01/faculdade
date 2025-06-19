import React from "react";
import { CardContainer, CardTitle, CardValue, IconWrapper } from "./styles";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  loading = false,
}) => {
  return (
    <CardContainer>
      <IconWrapper>{icon}</IconWrapper>
      <CardTitle>{title}</CardTitle>
      <CardValue>{loading ? <LoadingSkeleton /> : value}</CardValue>
    </CardContainer>
  );
};

export default DashboardCard;
