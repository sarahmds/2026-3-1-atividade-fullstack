# 2026.3.1 - POS - Frondend web e Backend api restfull

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)
- **Objetivo**:
  1. Atividade avaliativa para construção de aplicativo com frontend web e backend api restfull

[A descrição da atividade](atividade.md)

---
## Relato da atividade
### Aluna
Sarah Medeiros dos Santos
#### Github: https://github.com/sarahmds

### Componentes e tecnologias

O projeto será desenvolvido utilizando uma arquitetura **fullstack**, com frontend web e backend disponibilizados no mesmo repositório.

#### Frontend

* **React** — biblioteca utilizada para construção da interface gráfica da aplicação.
* **TypeScript** — linguagem utilizada no desenvolvimento do frontend, proporcionando tipagem estática ao código.
* **HTML e CSS** — utilizados na estruturação e estilização das páginas.
* **Vite** — ferramenta utilizada para configuração e execução do projeto frontend.
* **Frontend localizado em `/web`**.

#### Backend

* **Node.js** — ambiente de execução utilizado para o desenvolvimento da API.
* **TypeScript** — utilizado na implementação do backend.
* **API RESTful** — arquitetura utilizada para disponibilizar os recursos da aplicação.
* **Backend localizado em `/api`**.

#### Banco de dados

* **PostgreSQL** — sistema gerenciador de banco de dados utilizado para armazenar os dados da aplicação, como usuários, publicações, comentários e avaliações.

#### Outros componentes

* **Git e GitHub** — utilizados para versionamento e hospedagem do código-fonte.
* **Design responsivo e abordagem Mobile First** — utilizados na construção da interface, conforme especificado na atividade.
* **Paleta de cores da DIATINF** — utilizada como referência para a identidade visual da aplicação.

A aplicação será uma réplica simplificada do **X**, denominada **DIATINF X**, permitindo publicações exclusivamente textuais, comentários, avaliações de 1 a 3 estrelas, pesquisa de publicações e acesso aos perfis públicos dos usuários.


### Agente de IA

Durante o desenvolvimento do projeto, foram utilizadas ferramentas de Inteligência Artificial como apoio à implementação, configuração, análise e resolução de problemas.

Foi utilizado o **ChatGPT** para:
- auxiliar na organização e atualização do README.md;
- orientar a configuração e execução do frontend e backend;
- auxiliar na configuração do banco de dados PostgreSQL utilizando Docker;
- orientar os testes das rotas da API utilizando `curl`;
- investigar o erro `Failed to fetch` apresentado pelo frontend;
- analisar a comunicação entre o frontend React/Vite e o backend Express;
- orientar a configuração do proxy do Vite para encaminhar as requisições `/api` para o backend;
- auxiliar na identificação e correção de erros durante a execução do projeto.

Também foi utilizado o **GitHub Copilot**, integrado ao GitHub Codespaces, para analisar o código do projeto e investigar o fluxo de autenticação. O Copilot analisou os arquivos do frontend e backend, verificou as rotas de login e a configuração do proxy e realizou alterações relacionadas ao tratamento de requisições e à configuração do Vite.

As ferramentas de IA foram utilizadas como **apoio ao desenvolvimento**, sendo as alterações e comandos executados e testados no ambiente do projeto.


### Execução do projeto

como executar o projeto?
vídeo do projeto em execução

---
