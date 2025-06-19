import React, { useState } from 'react';
import * as Styled from './styles.ts';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { MdOutlineVisibility } from 'react-icons/md';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Input(props: InputProps) {
    const { label } = props;
    const [type, setType] = useState(props.type);

    const handleIcon = () => {
        if (type === 'password') {
            setType('text');
        } else {
            setType('password');
        }
    };

    return (
        <Styled.Container>
            <Styled.Label>{label}</Styled.Label>
            <Styled.InputContainer>
                <Styled.Input {...props} type={type}></Styled.Input>
                {props.type === 'password' && (
                    <Styled.Button onClick={handleIcon}>
                        {type === 'text' ? <MdOutlineVisibilityOff size={24} color='#C1C7CD' /> : <MdOutlineVisibility size={24} color='#C1C7CD' />}
                    </Styled.Button>
                )}
            </Styled.InputContainer>
        </Styled.Container>
    );
}
