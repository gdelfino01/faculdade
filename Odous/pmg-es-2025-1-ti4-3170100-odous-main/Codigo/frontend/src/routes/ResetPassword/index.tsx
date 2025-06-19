import React, { useState } from 'react';
import * as Styled from './style.ts';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async () => {
    if (password !== confirm) {
      alert('As senhas não coincidem.');
      return;
    }

    const email = localStorage.getItem('recovery_email');
    const code = localStorage.getItem('recovery_code');

    if (!email || !code) {
      alert('Dados de recuperação não encontrados.');
      window.location.href = '/forgot-password';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: password }),
      });

      if (!response.ok) throw new Error('Erro ao redefinir senha');

      alert('Senha redefinida com sucesso!');
      localStorage.removeItem('recovery_email');
      localStorage.removeItem('recovery_code');
      window.location.href = '/';
    } catch (error) {
      alert('Erro ao redefinir a senha.');
      console.error(error);
    }
  };

  return (
    <Styled.Container>
      <Styled.Form>
        <Styled.Title>Escolha Sua Nova Senha</Styled.Title>
        <Input
          type="password"
          label="Nova Senha"
          placeholder="Digite a nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          label="Confirmar Senha"
          placeholder="Repita a nova senha"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button onClick={handleReset}>Mudar Senha</Button>
      </Styled.Form>
    </Styled.Container>
  );
};

export default ResetPassword;
