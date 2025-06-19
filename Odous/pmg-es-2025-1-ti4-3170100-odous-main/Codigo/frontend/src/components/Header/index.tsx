import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from './styles'

const Header = () => {
    return (
        <Container>
            <Link to="/users-management">Gerenciamento de Usuários</Link>
        </Container>
    )
}

export default Header