import styled from "styled-components";

export const Card = styled.div`
  background: var(--card-background);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 16px;
  min-width: 200px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
`;

export const CardContainer = styled.div`
  background: var(--background-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const IconWrapper = styled.div`
  color: #6c63ff;
`;

export const CardTitle = styled.h4`
  font-family: Roboto;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
`;

export const CardValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;
