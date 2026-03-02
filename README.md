# 🌌 Aura3D

> Plataforma Full Stack para geração de modelos 3D com Inteligência Artificial a partir de imagens — com arquitetura escalável, processamento assíncrono e experiência em tempo real.

---

## 🚀 Sobre o Projeto

**Aura3D** é uma aplicação full-stack que transforma imagens em modelos 3D utilizando serviços de Inteligência Artificial.

Mais do que apenas gerar modelos, o Aura3D funciona como uma **plataforma social**, permitindo que usuários:

- 📸 Enviem imagens para geração de modelos 3D
- ⏳ Acompanhem o progresso da geração em tempo real
- 🔍 Interajam com os modelos (zoom, rotação, navegação 3D)
- 🌎 Explorem modelos criados por outros usuários
- 🔐 Autentiquem-se via login social (Google)

O projeto foi desenvolvido com foco em **arquitetura moderna, escalabilidade, resiliência e experiência do usuário**.

---

# 🏗️ Arquitetura

O Aura3D é dividido em duas principais camadas:

## 📱 Mobile (Client)

- **React Native + Expo**
- Tema moderno inspirado em **LiquidGlass**
- Visualizador 3D com gestos:
  - Pinch (zoom)
  - Rotate (rotação)
  - Pan (movimentação)
- Feed social de modelos
- Login com Google (OAuth)
- Comunicação em tempo real via SSE

## 🧠 Backend (API)

- **Node.js**
- Arquitetura modular e orientada a domínio
- Comunicação com serviços de IA via HTTP
- Webhooks para processamento assíncrono
- SSE (Server-Sent Events) para progresso em tempo real
- MongoDB para persistência
- Redis + BullMQ para filas e processamento distribuído

---

# 🔄 Pipeline de Geração de Modelos

A geração de modelos 3D segue um fluxo resiliente e escalável:

1. Usuário envia imagem
2. API cria um job na fila (BullMQ)
3. Job chama serviço de IA externo
4. Serviço processa modelo
5. Webhook notifica conclusão
6. Backend atualiza status no banco
7. Cliente recebe progresso via SSE
8. Modelo final é disponibilizado no feed

### 🧩 Componentes envolvidos

- **BullMQ + Redis**
  - Orquestração de jobs
  - Retry automático
  - Backoff exponencial
  - Escalabilidade horizontal

- **Webhooks**
  - Recebimento assíncrono da conclusão do processamento
  - Processamento incremental de resultados

- **SSE (Server-Sent Events)**
  - Atualização em tempo real do progresso
  - Experiência fluida de loading

---

# 🗄️ Persistência e Storage

- **MongoDB**
  - Metadados dos modelos
  - Status de processamento
  - Usuários
  - Feed social
  - Versionamento

- **Redis**
  - Fila de jobs
  - Cache estratégico
  - Controle de estado temporário

- **CDN / Object Storage**
  - Arquivos 3D
  - Texturas
  - Assets derivados

---

# 🔐 Autenticação

- Login social com Google (OAuth 2.0)
- Sessões seguras via JWT
- Proteção de rotas no backend
- Controle de permissões por usuário

---

# ⚙️ Resiliência & Observabilidade

O sistema foi projetado para operar com alta tolerância a falhas:

- 🔁 Retries automáticos com backoff exponencial
- 🛑 Circuit breaker para serviços externos
- 📊 Logs estruturados
- 📈 Métricas de jobs e processamento
- 🧪 Tratamento centralizado de erros
- 🧵 Processamento assíncrono desacoplado

---

# 🎨 Experiência do Usuário

- UI moderna com estética **LiquidGlass**
- Feedback visual de progresso em tempo real
- Experiência semelhante a uma rede social
- Interação 3D fluida e responsiva
- Foco em performance e percepção de velocidade

---

# 🛠️ Stack Tecnológica

## Backend
- Node.js
- Express / Fastify
- MongoDB
- Redis
- BullMQ
- SSE
- Webhooks

## Mobile
- React Native
- Expo
- Three.js / Visualizador 3D
- OAuth Google

---

# 📦 Funcionalidades Principais

- ✅ Geração de modelo 3D via IA
- ✅ Acompanhamento em tempo real
- ✅ Feed social de modelos
- ✅ Interação 3D (zoom, rotação)
- ✅ Login social
- ✅ Arquitetura escalável
- ✅ Processamento assíncrono robusto

---

# 📈 Diferenciais Técnicos

- Arquitetura orientada a eventos
- Separação clara entre processamento síncrono e assíncrono
- Integração inteligente com múltiplos serviços de IA
- Comunicação em tempo real com baixo overhead
- Sistema preparado para escalar horizontalmente
- Foco em experiência e engenharia de produto

---

# 🎯 Objetivo do Projeto

Demonstrar como integrar serviços de Inteligência Artificial em um sistema completo, escalável e preparado para produção — cobrindo:

- Modelagem de domínio
- Engenharia de backend
- Experiência mobile
- Orquestração assíncrona
- Integração entre sistemas
- Observabilidade e resiliência

---

# 📩 Apresentação do Projeto

Se você tiver interesse, posso fazer uma apresentação técnica detalhada mostrando:

- Arquitetura completa
- Fluxo de geração
- Decisões técnicas
- Estratégias de escalabilidade
- Demonstração prática do app

Fique à vontade para entrar em contato 🚀

---

**Aura3D**  
Transformando imagens em experiências tridimensionais.