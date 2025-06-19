
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
    background-color: #ffffff;
    overflow: auto;
`;

export const Form = styled.div`
    width: 400px;
    border-width: 1px;
    border-style: solid;
    border-color: #DDE1E6;
    padding: 50px;
    gap: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: 75%;
    }
`;

export const Title = styled.h1`
    font-family: "Roboto";
    font-size: 36px;
    font-weight: 700;
    color: #000000;
`;

export const Text = styled.p`
    font-family: Inter;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
`;

export const ForgotPasswordText = styled.p`
  margin-top: 12px;
  color: #007bff;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
  }
`;