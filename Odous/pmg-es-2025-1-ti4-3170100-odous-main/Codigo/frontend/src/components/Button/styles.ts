import styled from "styled-components";

export const Button = styled.button`
  width: 100%;
  height: 48px;
  gap: 10.15px;
  border-width: 1.22px;
  border-style: solid;
  border-color: var(--button-bg);
  background-color: var(--button-bg);
  color: var(--button-text);
  outline: none;

  &:focus {
    border-style: solid;
    border-color: #000000;
    border-width: 1.22px;
  }

  &:hover {
    background-color: #000000;
  }
`;