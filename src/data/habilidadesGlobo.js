import { FaJava } from 'react-icons/fa'
import { TbBrandCSharp } from 'react-icons/tb'
import { VscVscode } from 'react-icons/vsc'
import {
  SiJavascript, SiNodedotjs, SiC, SiPython, SiPhp, SiArduino, SiHtml5, SiCss, SiMysql,
  SiLaravel, SiSpringboot, SiReact, SiMantine, SiVite, SiEslint, SiGit, SiGithub,
  SiDocker, SiNotion,
} from 'react-icons/si'

// Habilidades do globo. "link" é a página aberta ao clicar no ícone.
export const HABILIDADES = [
  { nome: 'Java', Icone: FaJava, cor: '#ED8B00', link: 'https://dev.java' },
  { nome: 'JavaScript', Icone: SiJavascript, cor: '#F7DF1E', link: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript' },
  { nome: 'Node.js', Icone: SiNodedotjs, cor: '#5FA04E', link: 'https://nodejs.org/pt' },
  { nome: 'C', Icone: SiC, cor: '#A8B9CC', link: 'https://pt.wikipedia.org/wiki/C_(linguagem_de_programa%C3%A7%C3%A3o)' },
  { nome: 'C#', Icone: TbBrandCSharp, cor: '#A179DC', link: 'https://learn.microsoft.com/pt-br/dotnet/csharp/' },
  { nome: 'Python', Icone: SiPython, cor: '#3776AB', link: 'https://www.python.org' },
  { nome: 'PHP', Icone: SiPhp, cor: '#777BB4', link: 'https://www.php.net' },
  { nome: 'Arduino', Icone: SiArduino, cor: '#00979D', link: 'https://www.arduino.cc' },
  { nome: 'HTML5', Icone: SiHtml5, cor: '#E34F26', link: 'https://developer.mozilla.org/pt-BR/docs/Web/HTML' },
  { nome: 'CSS3', Icone: SiCss, cor: '#1572B6', link: 'https://developer.mozilla.org/pt-BR/docs/Web/CSS' },
  { nome: 'MySQL', Icone: SiMysql, cor: '#4479A1', link: 'https://www.mysql.com' },
  { nome: 'Laravel', Icone: SiLaravel, cor: '#FF2D20', link: 'https://laravel.com' },
  { nome: 'Spring Boot', Icone: SiSpringboot, cor: '#6DB33F', link: 'https://spring.io/projects/spring-boot' },
  { nome: 'React', Icone: SiReact, cor: '#61DAFB', link: 'https://react.dev' },
  { nome: 'Mantine', Icone: SiMantine, cor: '#339AF0', link: 'https://mantine.dev' },
  { nome: 'Vite', Icone: SiVite, cor: '#9D7BFF', link: 'https://vite.dev' },
  { nome: 'ESLint', Icone: SiEslint, cor: '#8080F2', link: 'https://eslint.org' },
  { nome: 'Git', Icone: SiGit, cor: '#F05032', link: 'https://git-scm.com' },
  { nome: 'GitHub', Icone: SiGithub, cor: '#FFFFFF', link: 'https://github.com' },
  { nome: 'Docker', Icone: SiDocker, cor: '#2496ED', link: 'https://www.docker.com' },
  { nome: 'VS Code', Icone: VscVscode, cor: '#2F9BE8', link: 'https://code.visualstudio.com' },
  { nome: 'Notion', Icone: SiNotion, cor: '#FFFFFF', link: 'https://www.notion.com' },
]