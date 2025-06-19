import React from 'react';
import * as Styled from './styles';
import { Github, Linkedin, Instagram} from 'lucide-react';

import gustavoImg from '../../assets/img/gustavo.png'
import joaoImg from '../../assets/img/joao.png'
import juliaImg from '../../assets/img/julia.png'
import matheusImg from '../../assets/img/matheus.png'
import rafaelImg from '../../assets/img/rafael.png'

// Dados dos desenvolvedores
const devs = [
  {
    name: 'Gustavo Delfino',
    role: 'Analista de Requisitos & Desenvolvedor Frontend',
    github: 'https://github.com/gdelfino01',
    linkedin: 'https://www.linkedin.com/in/gustavo-delfino-16a207326',
    instagram: 'https://www.instagram.com/gustavodelfino_',
    avatar: gustavoImg, 
  },
  {
    name: 'João Pedro Santana',
    role: 'Gerente de Projeto & Desenvolvedor Frontend',
    github: 'https://github.com/jpsantanam',
    instagram: 'https://www.instagram.com/jpsantanam/',
    linkedin: 'https://www.linkedin.com/in/jpsantanamarques',
    avatar: joaoImg,
  },
  {
    name: 'Júlia Medeiros',
    role: 'Designer de Interfaces & Desenvolvedora Frontend',
    github: 'https:github.com/JuliaMedeir0s',
    linkedin: 'https://www.linkedin.com/in/júlia-medeiros-234123315',
    instagram: 'https://www.instagram.com/oila_jubs',
    email: 'julia@email.com',
    avatar: juliaImg,
  },
  {
    name: 'Mateus Caetano',
    role: 'Arquiteto & Desenvolvedor Backend',
    github: 'http://github.com/matheusrocha-mus',
    linkedin: 'http://linkedin.com/in/matheus-caetanorocha',
    instagram: 'http://instagram.com/matheusrocha_mus',
    email: 'mateus@email.com',
    avatar: matheusImg,
  },
  {
    name: 'Rafael Caetano',
    role: 'Desenvolvedor Frontend',
    github: 'https://github.com/RafaelHmK',
    linkedin: 'https://www.linkedin.com/in/rafael-caetano-5882051b8',
    instagram: 'https://www.instagram.com/rafaelcaeta',
    email: 'rafael@email.com',
    avatar: rafaelImg,
  },
];

const AboutDevelopers = () => (
  <Styled.Container>
    <Styled.Header>
      <Styled.Title>Sobre os Desenvolvedores</Styled.Title>
      <Styled.Description>
        Conheça a equipe responsável pelo desenvolvimento deste sistema. Entre em contato ou siga nas redes!
      </Styled.Description>
    </Styled.Header>

    <Styled.CardsGrid>
      {devs.map((dev, idx) => (
        <Styled.DevCard key={idx}>
          <Styled.Avatar src={dev.avatar} alt={dev.name} />
          <Styled.Name>{dev.name}</Styled.Name>
          <Styled.Role>{dev.role}</Styled.Role>
          <Styled.Socials>
            <Styled.IconLink href={dev.github} target="_blank" rel="noopener noreferrer">
              <Github size={22} />
            </Styled.IconLink>
            <Styled.IconLink href={dev.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin size={22} />
            </Styled.IconLink>
            <Styled.IconLink href={dev.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram size={22} />
            </Styled.IconLink>
          </Styled.Socials>
        </Styled.DevCard>
      ))}
    </Styled.CardsGrid>
  </Styled.Container>
);

export default AboutDevelopers;