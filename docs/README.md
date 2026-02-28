
---

# 🏦 Gestão de Benefícios (Módulo Integrado)

Este projeto é uma aplicação desenvolvida para o gerenciamento de benefícios e transferências financeiras entre contas. A arquitetura utiliza uma abordagem híbrida moderna, integrando a agilidade do **Spring Boot** com a robustez transacional dos **EJBs (Enterprise Java Beans)**, empacotados em um arquivo **EAR**.

---

## 🏗️ Arquitetura Técnica

A solução é dividida em três camadas principais:

### 1. Frontend (Angular 17+)

* **Standalone Components**: Arquitetura moderna sem a necessidade de NgModules complexos.
* **SCSS Avançado**: Estilização focada na identidade visual.
* **UX/UI**: Máscaras de moeda real (BRL) via `ngx-mask`, validações de formulário em tempo real e modais de feedback dinâmicos.

### 2. Backend API (Spring Boot 3.2.x)

* **Arquitetura de Coexistência**: Atua como um "Bridge" (ponte) expondo serviços REST enquanto consome lógica de negócio de módulos EJB corporativos.
* **Injeção de Dependência**: Integração via `@ComponentScan` para reconhecer serviços no módulo EJB.

### 3. Core Business (EJB 3.x / Jakarta EE)

* **Stateless Session Beans**: Processamento de alta performance e gerenciamento de estado.
* **Transacionalidade JTA**: Garantia de atomicidade (ACID) em operações financeiras.
* **Persistence Layer**: JPA/Hibernate integrado ao PostgreSQL.

---

## 🛠️ Tecnologias e Versões

| Tecnologia | Versão |
| --- | --- |
| **Java** | 21 |
| **Angular** | 17.x |
| **Spring Boot** | 3.2.5 |
| **Jakarta EE / EJB** | 10 |
| **PostgreSQL** | 15+ |
| **Maven** | 3.9+ |

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/XOPAXD/bip-teste-integrado.git
cd bip-teste-integrado

```

### 2. Configuração do Banco de Dados (PostgreSQL)

Antes de iniciar o backend, certifique-se de que a base de dados `desafio_db` existe e execute o script abaixo para criar a estrutura inicial:

```sql
-- Criação da Base
CREATE DATABASE desafio_db;

-- Criação da Tabela de Benefícios
CREATE TABLE BENEFICIO (
  ID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  NOME VARCHAR(100) NOT NULL,
  DESCRICAO VARCHAR(255),
  VALOR DECIMAL(15,2) NOT NULL,
  ATIVO BOOLEAN DEFAULT TRUE,
  VERSION BIGINT DEFAULT 0
);

-- Carga Inicial de Dados
INSERT INTO BENEFICIO (NOME, DESCRICAO, VALOR, ATIVO) VALUES
('Beneficio A', 'Descrição A', 1000.00, TRUE),
('Beneficio B', 'Descrição B', 500.00, TRUE);

```

### 3. Backend & EJB (Multi-module)

Certifique-se de que o banco de dados PostgreSQL está configurado no `application.properties` e rode o comando na raiz do projeto.

```bash
mvn clean install

```

Após o build de sucesso, navegue até o módulo de API (Spring Boot) e execute-o via terminal:

```bash
cd backend-module
mvn spring-boot:run

```

*O artefato `.ear` será gerado em `ear-module/target/` para deploy no WildFly/JBoss.*

### 📖 Documentação da API (Swagger)

Com o backend rodando, você pode acessar a documentação interativa da API para testar os endpoints de CRUD e as transferências via EJB nos seguintes endereços:

* **Interface UI (Swagger):** http://localhost:8080/swagger-ui.html
* **OpenAPI Spec (JSON):** http://localhost:8080/v3/api-docs

> **Dica:** Utilize o endpoint `/api/v1/beneficios/transferir` no Swagger para validar a transacionalidade do EJB entre as contas de benefícios.

### 4. Frontend (Angular)

```bash
cd frontend
npm install
ng serve

```

Caso o Angular CLI não esteja instalado globalmente no seu sistema, execute:

```bash
npx ng serve

```

Acesse: [http://localhost:4200](https://www.google.com/search?q=http://localhost:4200)

---

## 🔒 Regras de Negócio e Segurança

* ✅ **Validação de Saldo**: O sistema impede transferências maiores que o saldo disponível com rollback automático.
* ✅ **Máscara Monetária**: Inputs formatados para o padrão brasileiro `R$ 1.234,56`.
* ✅ **Integridade Transacional**: Uso de `@TransactionAttribute` para garantir consistência de dados.
* ✅ **UI Reativa**: Botão de confirmação inteligente que valida campos vazios e valores negativos.

---

## 📂 Estrutura de Pastas

```text
├── backend-module/   # API REST com Spring Boot (WAR)
├── ejb-module/       # Camada de Persistência e EJBs (JAR)
├── ear-module/       # Pacote de distribuição para Servidor (EAR)
├── frontend/         # Aplicação Angular 17
└── pom.xml           # Parent Maven Configuration

```

---
