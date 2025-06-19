import React from "react";
import { Container, Title } from "./styles";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export interface ErrorStateProps {
    isError?: boolean;
    errorText?: string;
    children?: React.ReactNode;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    isError,
    errorText,
    children,
}) => {
    return isError ? (
        <Container>
            <ErrorOutlineIcon />
            <Title>{errorText}</Title>
        </Container>
    ) : (
        <>{children}</>
    );
};

export default ErrorState;