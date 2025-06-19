import React from "react";
import { Container, Title } from "./styles";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export interface EmptyStateProps {
	isEmpty?: boolean;
	emptyText?: string;
	children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
	isEmpty,
	emptyText,
	children,
}) => {
	return isEmpty ? (
		<Container>
			<RemoveCircleIcon />
			<Title>{emptyText}</Title>
		</Container>
	) : (
		<>{children}</>
	);
};

export default EmptyState;