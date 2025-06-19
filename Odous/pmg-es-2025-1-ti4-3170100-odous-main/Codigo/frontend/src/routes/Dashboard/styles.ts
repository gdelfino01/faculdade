import styled from "styled-components";

export const DashboardContainer = styled.div`
  padding: 20px;
  background-color: var(--pagina-bg);
  min-height: 100vh;
`;

export const CardsGrid = styled.div`
  padding: 20px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

export const CustomDateRange = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const FiltersRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;