import React from 'react';
import * as Styled from './styles.ts';

type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
};

export default function Button(props: ButtonProps) {
    const { onClick, children } = props;
    return <Styled.Button onClick={onClick}>{children}</Styled.Button>;
}
