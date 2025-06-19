# Frontend

Desenvolvido com Node, React, Vite e TypeScript

## 1. Dev Notes

### 1.1. Para inicializar o frontend em ambiente dev:

- `cd ../Codigo/frontend`

- Se o repositório acabou de ser clonado:
  - `npm i`

- Se a sua [`working tree`](https://git-scm.com/docs/git-worktree) estiver desatualizada:
  - Tentar um `git pull` (só vai funcionar se a sua [`working tree`](https://git-scm.com/docs/git-worktree) estiver limpa)
  - `npm  i`

- `npm run dev`

- `CTRL+click` no link exibido no terminal (`http://localhost:5173`)

### 1.2. Para inicializar o backend em ambiente dev:

- `cd ../Codigo/backend`

- Se o repositório acabou de ser clonado:
  - `npm i`

- Se a sua [`working tree`](https://git-scm.com/docs/git-worktree) estiver desatualizada:
  - Tentar um `git pull` (só vai funcionar se a sua [`working tree`](https://git-scm.com/docs/git-worktree) estiver limpa)
  - `npm  i`

- `npm start`

O backend estará hospedado em `http://localhost:3000`

### 1.3. Antes de fazer qualquer commit para a `main`:

- `npm run build`

Este comando irá compilar o código em React/TypeScript para JavaScript (que pode ser interpretado pelo browser) e irá apontar quaisquer possíveis erros de tipagem - assim, podemos corrigi-los e garantir que não haja código quebrado/fracamente tipado sendo publicado na `main` do repositório.

### 1.4. Estrutura de pastas e principais arquivos

A estrutura do frontend foi organizada para manter o código modular, reutilizável e de fácil manutenção. Abaixo está a explicação das principais pastas e arquivos da  `src`:

#### 1.4.1. `assets`
Contém arquivos estáticos utilizados no projeto, como imagens e ícones (que não tenham na biblioteca do MUI).

#### 1.4.2. `components`
Armazena componentes React reutilizáveis da interface do usuário (UI). A maioria são só de exemplo, mas alguns que vale ressaltar são:

- Footer/ e Header/: Componentes que representam o rodapé e o cabeçalho da aplicação.
- EmptyState/, LoadingState/ e ErrorState/: Componentes que representam dados indisponíveis ou em carregamento. Usados com requisições de API.

A maioria dos componentes vão ser divididos em dois arquivos principais:
- `index.tsx`: Estrutura e lógica do componente.
- `styles.ts`: Estilos associados ao componente, utilizando uma abordagem modular para manter a organização do código.

#### 1.4.3. `consts`
Contém constantes que podem ser usadas em diferentes partes do projeto. Por hora coloquei como exemplo só um arquivo com os principais dados da Odous.

#### 1.4.4. `hooks`
Contém funções reutilizáveis para lidar com lógica de estado e efeitos no React. Hooks ajudam a abstrair lógica e reutilizá-la em diferentes componentes.

#### 1.4.5. `routes`
Contém as rotas (páginas) da aplicação. Por enquanto coloquei:

- Home/: Página inicial. Por enquanto contém os desenvolvedores (futura página de "Créditos")
- UserManagement/: Uma possível página para gerenciar os usuários do sistema.

Cada rota possui:
- `index.tsx`: Código principal da página.
- `styles.ts`: Estilos específicos da página.

#### 1.4.6. `services`
Gerencia a comunicação com a API da Odous e possíveis APIs externas que venham a ser mapeadas no futuro. *Explicarei melhor na seção `1.5`*.

#### 1.4.7. `utils`
Contém funções auxiliares para manipulação de dados, formatação, etc.

#### 1.4.8. Arquivos principais na raiz da `src`

- `App.tsx`: O ponto de entrada principal do frontend. Define a estrutura básica da aplicação (Header, Footer, Menu Lateral, etc).

- `main.tsx`: Arquivo que inicializa o React, renderiza a aplicação no navegador e *define o caminho das rotas da aplicação*.

### 1.5. APIs

#### 1.5.1. Utilização da API da Odous

As páginas e componentes que forem fazer requisições à API da Odous devem seguir o exemplo mostrado em `src/routes/UsersManagement/index.tsx`:

![image](https://github.com/user-attachments/assets/9269134d-d26b-4362-a56a-35341333316e)

Para fazer requisições à API da Odous no frontend, utilizamos a biblioteca `react-query`, importada na camada de `services` e aplicada automaticamente a todas as requisições feitas pelo frontend. Essa biblioteca facilita o gerenciamento de requisições assíncronas ao armazenar os dados da resposta, gerenciar estados de carregamento (como loading e error) e evitar chamadas desnecessárias à API ao reutilizar respostas já armazenadas em cache. O caso do exemplo é uma requisição GET para obter todos os usuários, e para isso se utiliza o hook `useQuery()` - quando for uma requisição POST, PUT ou DELETE, utiliza-se o hook `useMutation()` (ver exemplo de POST mais abaixo).

- `import OdousApi from "../../services/apis/odous-api/odous-api"`:

  A classe OdousApi encapsula todas as chamadas à API da Odous, garantindo que todas as requisições sejam feitas de forma centralizada e padronizada. Isso melhora a manutenção do código e evita repetição desnecessária ao definir endpoints manualmente dentro de cada componente.

- `const odousApi = useMemo(() => new OdousApi(), [])`:

  Criamos uma instância de OdousApi dentro de `useMemo()`.
    - O `useMemo()` serve para evitar que a API seja recriada em cada renderização do componente, garantindo melhor desempenho.
    - O array vazio [] significa que a instância será criada apenas uma vez, quando o componente for montado.
 
- Exemplo GET `const { data, isLoading, isError, error, refetch } = odousApi.users.get({}))`:

  Explicação:
    - `const { ... }`: é uma deestruturação dos atributos retornados nativamente pelo hook `useQuery()`. Neste exemplo, estamos utilizando:
      - `data: allUsers`: armazena os dados retornados pela requisição.
      - `isLoading: isUsersLoading`: booleano que indica se a requisição ainda está em andamento.
      - `isError: isUsersError`: booleano que indica se houve um erro na requisição.
      - `error: usersError`: armazena a mensagem de erro retornada pelo backend, caso ocorra um erro durante a requisição.
      - `refetch: refetchUsers`: permite refazer a requisição manualmente, para quando há necessidade de garantir que os dados exibidos estão atualizados após, por exemplo, criar um novo usuário.

    - `odousApi.users.get({}))`: faz uma requisição GET à API, buscando a lista de usuários. Podemos navegar por toda a API enquanto escrevemos a função:
      - ![image](https://github.com/user-attachments/assets/eb168042-3797-4849-b142-997854b73606)
      - ![image](https://github.com/user-attachments/assets/63d0714d-663d-4929-ad93-3a0eb568eb22)
      - Ao passar o objeto para a função, pressionar `CTRL+SPACE` dentro dele podemos ver do que o endpoint DEVE ou PODE receber:
      - ![image](https://github.com/user-attachments/assets/8e43c7ac-578e-461f-a864-8343dabd4de7)
      - Esse endpoint, por exemplo, PODE receber como parâmetro um objeto `params` - e mais uma vez, pressionar `CTRL+SPACE` dentro desse objeto podemos ver o que ele DEVE ou PODE receber:
      - ![image](https://github.com/user-attachments/assets/05e0408d-40a7-4471-9bf0-3059e4b7cad6)
      - Caso haja a necessidade de visualizar mais claramente os `params`, o `body` e/ou a `response` do endpoint, pressionar `CTRL+CLICK` na chamda da função do endpoint nos levará diretamente ao seu código, e com isso, podemos visualizar os DTOS:
      - ![image](https://github.com/user-attachments/assets/ce5d6e38-bf35-4b9d-a4b0-7fe58c87dbb2)
      - ![image](https://github.com/user-attachments/assets/38d2abd0-8bc8-4f61-aa7f-beae0e12d6bc)
      - ![image](https://github.com/user-attachments/assets/c3e77d10-9747-49b9-9933-07f4479bbda1)
      - Neste caso, já que estamos passando um objeto vazio (`{}`) para a função `.get()`, estaremos retornando todos os usuários do banco, sem nenhuma forma de filtragem
 
- Exemplo POST `const { data, mutate, isLoading, isError, error, isSuccess, reset } = odousApi.users.post())`:

  Explicação das principais diferenças em relação ao exemplo GET:
    - `mutate: postUser`: é uma função que será chamada para realizar efetivamente a requisição POST. Diferentemente da requisição GET, o body (os dados a serem enviados para a API) não é passado diretamente no momento da criação do hook (no caso, em odousApi.users.post()), e sim posteriormente ao chamar a função mutate() (postUser() neste caso). Isso acontece porque o hook de mutação é projetado para ser reutilizável várias vezes, cada vez com dados diferentes, enquanto o hook de consulta (GET) normalmente precisa de seus parâmetros de busca definidos no momento da criação.
    - `isSuccess: isCreateSuccess`: indica se a requisição foi concluída com sucesso. Muito útil para executar ações após a criação do recurso, como fechar um modal ou exibir uma mensagem de sucesso.

  - Resumo das diferenças no uso de GET(`useQuery`) e POST/PUT/DELETE(`useMutation`):

| GET (`useQuery()`) | POST/PUT/DELETE (`useMutation()`) |
| - | - |
| Dados passados diretamente na criação do hook (`odousApi.users.get(params)`) | Dados passados posteriormente ao chamar a função retornada (`mutate`) |
| Usado principalmente para buscar dados | Usado para modificar dados no servidor |
| Retorna propriedade `refetch` para atualizar dados     | Não possui `refetch`; atualizar dados requer callbacks como `onSuccess` |
| Propriedades principais: `data`, `isLoading`, `isError`... | Propriedades principais: `mutate`, `isLoading`, `isError`...    |

#### 1.5.2. Mapeamento de APIs externas

Caso APIs externas venham a ser utilizadas na aplicação, o ideal é que elas sejam mapeadas na pasta `src/services/apis`, seguindo o exemplo do mapeamento atual da API da Odous:

- `odous-api.ts`: Cria uma instância da AxiosApi e uma instância para cada um dos serviços mapeados.
- `users/`: Mapea o serviço de usuários. Contém dois arquivos:
    - `users-api.ts`: Mapea os endponints do serviço de usuários.
    - `dtos.ts`: Define os `DTOS` do serviço de usuários.