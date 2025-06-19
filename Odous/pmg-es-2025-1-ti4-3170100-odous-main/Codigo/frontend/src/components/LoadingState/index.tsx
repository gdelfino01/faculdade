import React from "react";
import { Skeleton, SkeletonProps as MuiSkeletonProps } from "@mui/material";

export interface SkeletonProps {
	width?: number | string;
	height?: number | string;
	variant?: MuiSkeletonProps["variant"];
	isLoading?: boolean;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

const LoadingState: React.FC<SkeletonProps> = ({
	width = 117,
	height = 17,
	variant = "rounded",
	isLoading,
	style,
	children,
}) => {
	return isLoading ? (
		<Skeleton
			animation="wave"
			width={width}
			height={height}
			variant={variant}
			style={style}
		/>
	) : (
		<>{children}</>
	);
};

export default LoadingState;
