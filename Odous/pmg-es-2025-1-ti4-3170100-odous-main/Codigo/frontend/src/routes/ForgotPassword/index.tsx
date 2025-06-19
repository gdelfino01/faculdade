import React, { useState } from 'react';
import * as Styled from './style.ts';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      alert('Informe seu email');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Falha ao enviar código');

      localStorage.setItem('recovery_email', email);
      alert('Código enviado ao seu email.');
      window.location.href = '/verify-code';
    } catch (error) {
      alert('Erro ao enviar o código. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <Styled.Container>
      <Styled.Form>
        <Styled.Title>Mudar Senha</Styled.Title>
        <Input
          type="email"
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSendCode}>Enviar Código</Button>
      </Styled.Form>
    </Styled.Container>
  );
};

export default ForgotPassword;
