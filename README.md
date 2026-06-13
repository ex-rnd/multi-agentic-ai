# 🧠 Multi‑Agentic AI System 

A **local multi‑agent AI chatbot** powered by a **Node.js/Express backend**, a **React/Vite frontend**, and a **locally‑running Ollama LLM**.
User messages are intelligently routed to **specialized AI agents** — each with its own domain expertise and system persona — enabling accurate, domain‑specific responses.

This project demonstrates how to build a **modular**, **extensible**, **production‑ready multi‑agent architecture**, where each agent handles a specific knowledge domain.

---


## ✳️ Visual Overview 

<div align="center">
  <video src="https://github.com/user-attachments/assets/36b129f9-1246-46db-9d47-8ab9a2cefcaa" width="400" />
</div>

<div align="center">
  <video src="https://github.com/user-attachments/assets/f5f810f9-1561-4134-b13f-802675df69c5" width="400" />
</div>

---

## ✨ Features
- 🧠 **Multi‑agent architecture** (health, graphics, butterflies, posters)
- 🤖 **LLM‑based query classification** using Ollama 
- 🔀 **Automatic routing** to the correct specialist agent
- 🩺 **Health agent** with safety disclaimers
- 🎨 **Graphic agent** for design prompts & color palettes
- 🦋 **Butterfly agent** for species, habitats, migration
- 📰 **Poster agent** for headlines, taglines, and layout ideas
- ⚡ **Fast local inference** — using Mistral (or any Ollama model)
- 💬 **Simple React chat UI** (textarea + response display)
- 🛠️ **Fully local, privacy‑preserving**, no cloud APIs required

---

## 🛠️ Tech Stack
### Backend
- Node.js / Express
- Ollama (local LLM server)
- Custom agent router
- Modular agent handlers
- Environment‑based model configuration

### Frontend
- React + Vite
- JSX components
- Minimal chat interface

### LLM Layer 
- Mistral (default)
- Supports: **deepseek‑r1**, **phi3**, **llama3**, **qwen2.5**, etc.

---


## 📂 Project Structure
```
multi-agentic-ai/
├── Backend/
│   ├── agents/
│   │   ├── agent.router.js       # Classifies queries & dispatches to agents
│   │   ├── health.agent.js       # Health info specialist
│   │   ├── graphic.agent.js      # Design/image prompt specialist
│   │   ├── butterflies.agent.js  # Butterfly knowledge specialist
│   │   └── poster.agent.js       # Poster design specialist
│   ├── controllers/
│   │   └── chatController.js     # HTTP request handler
│   ├── routes/
│   │   └── chatRoute.js          # Express route definitions
│   ├── services/
│   │   └── ollama.js             # Ollama LLM API wrapper
│   └── index.js                  # Express server entry point
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ChatPage.jsx      # Main chat UI
    │   ├── App.jsx               # Root component
    │   └── main.jsx              # ReactDOM entry
    └── vite.config.js

```

---

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/ex-rnd/multi-agentic-ai.git
cd multi-agentic-ai

```

2. **Install backend dependencies**
```
cd Backend
npm install

```

3. **Install frontend dependencies**
```
cd ../frontend
npm install

```

4. **Install and run Ollama**
Download Ollama:
https://ollama.com/download

Pull the default model:
```
ollama pull qwen2.5:0.5b

```
Or Mistral:
```
ollama pull mistral

```

5. **Configure environment variables**
Create `Backend/.env`:
```
PORT=5000
OLLAMA_URL=http://localhost:11434
GEN_MODEL=mistral

```

6. **Start the backend**
```
cd Backend
npm start

```

7. **Start the frontend**
```
cd frontend
npm run dev

```

---


## 📊 Usage
- Open the app at: ```http://localhost:5173``` (Vite default)
- Type a message → the system will:
1. Classify your query
2. Route it to the correct agent
3. Return a domain‑specific response
4. Display it in the chat UI


## 🔀 Switch API Routes
<table align="center">
  <tr>
    <th>Agent</th>
    <th>Domain</th>
    <th>Persona</th>
  </tr>
  <tr>
    <td><strong>health.agent.js</strong></td>
    <td>Symptoms, prevention, lifestyle</td>
    <td><em>HealthInfo</em> — safe, general info only</td>
  </tr>
  <tr>
    <td><strong>graphic.agent.js</strong></td>
    <td>Image prompts, palettes, layouts</td>
    <td><em>GraphicPro</em> — production‑ready prompts</td>
  </tr>
  <tr>
    <td><strong>butterflies.agent.js</strong></td>
    <td>Species, habitats, migration</td>
    <td><em>ButterflyInfo</em> — butterfly specialist</td>
  </tr>
  <tr>
    <td><strong>poster.agent.js</strong></td>
    <td>Poster headlines, taglines, styles</td>
    <td><em>PosterPro</em> — structured poster design</td>
  </tr>
</table>

---


## 🧠 How It Works
- The Request Lifecycle:
```
User types message
      ↓
ChatPage.jsx → POST /api/chat { message }
      ↓
chatController.js → validates input, calls handleQuery()
      ↓
agent.router.js → classifyQueryWithLLM()
      ↓
Ollama (Mistral) → returns one-word category
      ↓
Router dispatches to correct agent
      ↓
Agent sends system prompt + user message to ollamaChat()
      ↓
Ollama generates domain-specific response
      ↓
Controller returns { reply, source }
      ↓
Frontend displays the reply

```

---


## 🧩 LLM Layer: Ollama
- The `services/ollama.js` wrapper exposes:
### 1. ollamaGenerate(prompt)
Used by the router to classify queries
→ Expected output: one word  
(e.g., `health`, `graphic`, `butterflies`, `poster`, `unknown`)

### 2. ollamaChat(messages)
Used by agents for full conversational responses
→ Accepts an array of `{role, content}` messages
→ Returns `{answer, source}`


## ⚠️ Important Notes
Ollama must be running before the backend starts

The frontend currently shows "Hello World" because
**ChatPage.jsx is not imported into App.jsx**

To activate the chat UI, update `App.jsx`:
```
import ChatPage from "./components/ChatPage";

export default function App() {
  return <ChatPage />;
}

```

---


## ⚠️ Disclaimer
- This project is for educational and experimental purposes.
- Local LLMs may hallucinate or produce inaccurate information.
- Always validate outputs before using them in production.

---


## 🤝 Contributing
- Contributions are welcome!
 
1. Fork the repo
2. Create a feature branch (feature/new-ui)
3. Commit changes
4. Open a Pull Request

---


## 📜 License
- This project is licensed under the MIT License – feel free to use and modify.





