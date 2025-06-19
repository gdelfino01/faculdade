// styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: 'Roboto', Arial, sans-serif;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  color: var(--filter-text);
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
`;

export const DevCard = styled.div`
  background: var(--card-background);
  border-radius: 1.5rem;
  box-shadow: 0 6px 32px rgba(60, 60, 100, 0.08);
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 18px;
  border: 3px solid #ececec;
`;

export const Name = styled.h2`
  font-size: 1.35rem;
  font-weight: bold;
  margin-bottom: 4px;
`;

export const Role = styled.div`
  font-size: 1rem;
  color: #a2a2b8;
  margin-bottom: 10px;
`;

export const Bio = styled.div`
  font-size: 1rem;
  color: #666;
  margin-bottom: 16px;
  min-height: 40px;
`;

export const Socials = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
`;

export const IconLink = styled.a`
  color: #888;
  transition: color 0.2s, transform 0.2s;
  &:hover {
    color: #4b50e6;
    transform: scale(1.12);
  }
`;
