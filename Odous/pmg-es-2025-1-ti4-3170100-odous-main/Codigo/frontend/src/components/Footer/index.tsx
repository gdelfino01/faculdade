import React from 'react'

import engSoftLogo from '../../assets/img/engsoft-logo.png'
import pucLogo from '../../assets/img/puc-logo.png'

import { Container, Logo, Text } from './styles'

const Footer = () => {
    return (
        <Container>
            <Logo src={engSoftLogo} alt="Engenharia de Software" />
            <Text> Desenvolvido por alunos de Engenharia de Software da PUC Minas </Text>
            <Logo src={pucLogo} alt="PUC Minas" />
        </Container>
    )
}

export default Footer;