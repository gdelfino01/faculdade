import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    gap: 22px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    color: var(text-color);

    font-family: Inter;
`;

export const InputContainer = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: var(--input-background);
  position: relative;
  border-bottom: 1px solid var(--input-border);
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: var(--text-color);
  padding: 0 12px;

  &:focus {
    border-style: solid;
    border-color: var(--input-focus-border);
    border-width: 1px;
  }
`;

export const Label = styled.label`
  font-size: 12.18px;
  line-height: 0px;
  letter-spacing: 0%;
  color: var(--input-label);
`;

export const Button = styled.span`
    border: none;
    background-color: transparent;
    color: var(--text-color);
    position: absolute;
    right: 12px;
`;