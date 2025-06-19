# Documentação do Projeto

## Regras do Negócio

---

O fluxo de trabalho da empresa passa por três grandes grupos de etapas: **Material**, **Semiacabado** e **Acabado**.  
Resumindo o fluxo: a empresa compra materiais, usa-os para montar peças semiacabadas, e cada uma dessas peças pode ser usada para montar vários equipamentos acabados.

---

### 1. Materiais

Os **materiais** são as peças básicas compradas pela empresa e utilizadas para a produção de semiacabados.

- Os materiais são obtidos por **ordens de compra**, emitidas quando o estoque de um certo material começa a esgotar.
- Essas ordens passam pelas etapas de **pedido**, **orçamento**, **pagamento** e **finalização**, mas **essas etapas são gerenciadas por outro sistema** já utilizado pela empresa: [Conquest](https://conquest.com.br).
- Portanto, **nosso sistema não armazenará as ordens de compra diretamente**, mas sim os **lotes de materiais**, que conterão as informações relevantes.

#### Lotes de Materiais

- Uma ordem de compra pode conter **vários tipos de materiais**, cada um com sua respectiva quantidade.
- Cada lote de material tem:
  - Código da nota fiscal da ordem de compra
  - Identificador do material de referência
  - Quantidade de materiais do mesmo tipo

#### Estrutura dos Materiais

Cada material possui:
- Código de identificação
- Nome
- Unidade de medida (**necessária para entradas e baixas no estoque**)
- Matéria-prima

Cada **matéria-prima** tem:
- Nome
- (Opcionalmente) uma especificação  
  > Exemplo: "Titânio" e "Titânio - G5" compartilham o nome, mas **são tratadas como matérias-primas distintas**.

#### Estoque de Materiais

- Um lote de material é adicionado ao estoque do tipo correspondente.
- O estoque de material registra:
  - Lotes do material (ex: 12 lotes)
  - Quantidade total (ex: 34.562.233,97 MM)

---

### 2. Semiacabados

Cada **semiacabado** possui:
- Código de identificação
- Nome (ex: Tesoura)
- Acrônimo do nome (ex: TESO)
- Lista de materiais necessários e suas respectivas quantidades

#### Ordens de Produção de Semiacabado

Fabricados a partir dos materiais em estoque. A ordem de produção contém:
- Código de identificação
- Tipo de semiacabado e quantidade a ser produzida
- Data de emissão
- Estado: `emitida` ou `lote iniciado`
- Finalidade:
  - Repor estoque
  - Atender pedido de cliente (com código de identificação do pedido)

#### Lote de Semiacabado

Cada ordem resulta em um **lote de semiacabado**, contendo:
- Código de identificação do lote
- Código do semiacabado de referência
- Código da ordem de produção
- (Possivelmente vazio) Data de início e término da produção
- Quantidade produzida com e sem defeito  
  > A quantidade final **pode variar** em relação à planejada
- (Possivelmente vazio) Códigos das **notas fiscais dos lotes de materiais utilizados** e as respectivas quantidades

> **OBS**: A quantidade de material consumida pode ser diferente da planejada. Deve ser possível **editar os lotes e/ou quantidades de material utilizados**.

#### Estoque de Semiacabados

- Um lote de semiacabado é adicionado ao estoque correspondente.
- O estoque de semiacabados registra:
  - Lotes (ex: 49 lotes do semiacabado "SA-TUN001")
  - Quantidade total em unidades (ex: 482 unidades)

---

### 3. Acabados

Cada **acabado** possui:
- Código de identificação
- Nome
- Preço
- Lista de:
  - Semiacabados e quantidades necessárias
  - E/ou materiais e quantidades necessárias

#### Registro ANVISA

Cada acabado tem também um **registro ANVISA**, feito manualmente pelos operadores no sistema da ANVISA.  
Um registro ANVISA contém:
- Número de identificação
- Família
- Matéria-prima  
  > A matéria-prima aqui **não tem especificação**.

**Exemplos**:
- Código de registro: `80961760027 - NC A, TITÂNIO`
- Família: `Não Cortante Articulado - NC A`
- Matéria-prima: `TITÂNIO`

#### Ordens de Produção de Acabado

Montagem feita a partir de materiais e/ou semiacabados. A ordem contém:
- Código de identificação
- Tipo de acabado e quantidade a ser produzida
- Data de emissão
- Estado: `emitida` ou `lote iniciado`
- Finalidade:
  - Repor estoque
  - Atender pedido de cliente (com código de identificação do pedido)

#### Lote de Acabado

Cada ordem resulta em um **lote de acabado**, contendo:
- Código de identificação do lote
- Código do acabado de referência
- Código da ordem de produção
- (Possivelmente vazio) Data de início e término
- Quantidade produzida com e sem defeito  
  > A quantidade final **pode variar**
- (Possivelmente vazio) Códigos das **notas fiscais dos lotes de materiais utilizados** e respectivas quantidades
- (Possivelmente vazio) Códigos dos **lotes de semiacabados utilizados** e respectivas quantidades

> **OBS**: A quantidade de material/semiacabado consumido pode ser diferente da planejada. Deve ser possível **editar os lotes e/ou quantidades utilizados**.

#### Estoque de Acabados

- Um lote de acabado é adicionado ao estoque correspondente.
- O estoque registra:
  - Lotes (ex: 12 lotes do acabado "PINÇA ECKARDT POWER 23G - MICRO FORCEPS")
  - Quantidade total em unidades (ex: 165 unidades)

---

### 4. Usuários

Os usuários do sistema possuem:
- Nome de usuário (username)
- Senha
- Papel: `administrador` ou `operador`
