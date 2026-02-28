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
| :--- | :--- |
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
git clone [https://github.com/XOPAXD/bip-teste-integrado.git](https://github.com/XOPAXD/bip-teste-integrado.git)
cd bip-teste-integrado

```

### 2. Backend & EJB (Multi-module)

Certifique-se de que o banco de dados PostgreSQL está configurado no `application.properties` e rode o comando na raiz do projeto.

```bash
mvn clean install

```

*O artefato `.ear` será gerado em `ear-module/target/` para deploy no WildFly/JBoss.*

### 3. Frontend (Angular)

```bash
cd frontend
npm install
ng serve

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
