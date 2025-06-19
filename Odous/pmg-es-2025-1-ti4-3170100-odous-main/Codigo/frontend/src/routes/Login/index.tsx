import React, { useMemo, useState } from 'react';
import * as Styled from './styles.ts';
import Button from '../../components/Button/index.tsx';
import Input from '../../components/Input/index.tsx';

import OdousApi from '../../services/apis/odous-api/odous-api';

const Login: React.FC = () => {
    const odousApi = useMemo(() => new OdousApi(), []);

    const { mutate: login } = odousApi.users.login();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoginError, setShowLoginError] = useState(false);

    const handleLogin = () => {
        login(
            { email, password },
            {
                onSuccess: (response) => {
                    setShowLoginError(false);
                    localStorage.setItem('user', JSON.stringify(response));
                    window.location.href = '/painel';
                },
                onError: () => {
                    setShowLoginError(true);
                },
            }
        );
    };

    return (
        <Styled.Container>
            <Styled.Form>
                <Styled.Title>Bem-vindo</Styled.Title>
                <Input type='email' placeholder='Email' label='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type='password' placeholder='Senha' label='Senha' value={password} onChange={(e) => setPassword(e.target.value)} />
                {showLoginError && <Styled.Text>Email ou senha inválidos!</Styled.Text>}
                <Button onClick={handleLogin}>Entrar</Button>
                <Styled.ForgotPasswordText onClick={() => (window.location.href = '/esqueci-senha')}>Esqueci minha senha</Styled.ForgotPasswordText>
            </Styled.Form>
        </Styled.Container>
    );
};

export default Login;
