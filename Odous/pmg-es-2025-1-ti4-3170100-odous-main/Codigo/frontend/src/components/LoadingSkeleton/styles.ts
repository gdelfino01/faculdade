import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const SkeletonBox = styled.div`
  width: 100%;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--skeleton-light) 25%,
    var(--skeleton-dark) 37%,
    var(--skeleton-light) 63%
  );
  background-size: 800px 104px;
  animation: ${shimmer} 1.2s infinite;
`;
