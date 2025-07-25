# Gerenciador de Contatos com Flask e HBase

Projeto desenvolvido como parte da disciplina **Banco de Dados II**, com o objetivo de demonstrar o uso de **bancos de dados não relacionais**.
A aplicação consiste em um **gerenciador de contatos** criado com o framework **Flask**, onde os dados são armazenados no **Apache HBase**.

## Tecnologias Utilizadas

* **Python 3**
* **Flask** – Framework web para construção da API e interface.
* **Apache HBase** – Banco de dados NoSQL orientado a colunas.
* **HappyBase** – Biblioteca Python para interação com o HBase.

## Funcionalidades

### Contatos

* `GET /api/Contatos` – Retorna todos os contatos cadastrados.
* `POST /api/Contatos` – Adiciona um novo contato com `id`, `nome`, `telefone` e `email`.

### Grupos

* `GET /api/Grupos` – Lista todos os grupos cadastrados.
* `POST /api/Grupos` – Cria um grupo com `idGrupo`, `nomeGrupo` e lista de `contatos`.

## Estrutura do Banco (HBase)

### Tabela: `Contatos`

| Row Key (id) | Column Family: `info`       |
| ------------ | --------------------------- |
| `id`         | `nome`, `telefone`, `email` |

### Tabela: `Grupos`

| Row Key (idGrupo) | Column Family: `detalhes`                             |
| ----------------- | ----------------------------------------------------- |
| `idGrupo`         | `nomeGrupo`, `contatos` (lista separada por vírgulas) |

##  Como Executar

### 1. Requisitos

* Python 3.8+
* Apache HBase em execução (`localhost`)
* HappyBase instalado:

  ```bash
  pip install happybase
  ```

### 2. Rodar o projeto

```bash
python app.py
```

Acesse em: [http://localhost:5000](http://localhost:5000)

## Exemplo de Requisição (POST /api/Contatos)

```json
{
  "id": "001",
  "nome": "Maria Silva",
  "telefone": "88999999999",
  "email": "maria@email.com"
}
```

---
