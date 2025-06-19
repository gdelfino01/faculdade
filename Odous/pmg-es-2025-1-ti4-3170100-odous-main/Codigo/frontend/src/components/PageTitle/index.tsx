import React from 'react';
import * as Styled from './styles';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type ButtonProps = {
    text: string;
    onClick: () => void;
};

type PageTitleProps = {
    title: string;
    buttons?: ButtonProps[];
};

const PageTitle = (props: PageTitleProps) => {
    const { title, buttons } = props;
    return (
        <Styled.Container>
            <Styled.Title>{title}</Styled.Title>
            <Styled.ButtonsContainer>
                {buttons?.map((button, index) => (
                    <Button key={index} variant='contained' onClick={button.onClick} startIcon={<AddIcon />}>
                        {button.text}
                    </Button>
                ))}
            </Styled.ButtonsContainer>
        </Styled.Container>
    );
};

export default PageTitle;
