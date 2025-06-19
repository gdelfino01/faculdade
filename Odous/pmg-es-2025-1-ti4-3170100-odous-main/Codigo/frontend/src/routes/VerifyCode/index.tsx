import React, { useState } from 'react';
import * as Styled from './style.ts';
import Input from '../../components/Input';
import Button from '../../components/Button';

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    const email = localStorage.getItem('recovery_email');
    if (!email) {
      alert('Email não encontrado. Reinicie o processo.');
      window.location.href = '/forgot-password';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) throw new Error('Código inválido');

      localStorage.setItem('recovery_code', code);
      alert('Código verificado com sucesso.');
      window.location.href = '/reset-password';
    } catch (error) {
      alert('Código inválido ou expirado.');
      console.error(error);
    }
  };

  return (
    <Styled.Container>
      <Styled.Form>
        <Styled.Title>Digite o código enviado ao seu email</Styled.Title>
        <Input
          type="text"
          label="Código de Verificação"
          placeholder="Digite o código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleVerify}>Verificar</Button>
      </Styled.Form>
    </Styled.Container>
  );
};

export default VerifyCode;
