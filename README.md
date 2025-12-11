# MemoAI - Personal AI Assistant

A modern, full-featured AI assistant application built with React and powered by advanced AI capabilities.

## 🌟 Features

### 💬 Chat Interface
- Real-time AI conversations with context awareness
- Voice-to-text input using browser Speech Recognition API
- Text-to-speech output with ElevenLabs integration
- Markdown support for rich message formatting
- Professional, responsive UI with dark mode

### 📄 Document Management
- Upload and analyze documents (PDF, TXT, DOCX, MD)
- AI-powered semantic search across your documents
- Drag-and-drop file upload
- Document library with grid/list view toggle

### ✅ Task Management
- Create and organize tasks with due dates
- Weekly task summaries powered by AI
- Task status tracking (To Do, In Progress, Done)
- Calendar integration and overdue indicators

### 🧠 Memory System
- Episodic memory (conversation history)
- Semantic memory (knowledge extraction)
- Procedural memory (learned patterns)
- Visual memory timeline

### 🎨 UI/UX
- Professional, enterprise-grade design
- Full dark mode support
- Responsive layout for all devices
- Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with Speech API support

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd MemoAi
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure ElevenLabs (optional, for premium TTS):
\`\`\`bash
cp src/config/elevenlabs.example.js src/config/elevenlabs.js
\`\`\`
Then edit \`src/config/elevenlabs.js\` with your API key from [ElevenLabs](https://elevenlabs.io/app/settings/api-keys)

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔧 Tech Stack

- **Frontend**: React 18, React Router
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Voice**: ElevenLabs SDK, Browser Speech API
- **Date Handling**: date-fns
- **Markdown**: react-markdown
- **File Upload**: react-dropzone
- **Notifications**: react-hot-toast

## 🔐 Configuration

The application uses the following configuration:
- **ElevenLabs API Key**: Stored in \`src/config/elevenlabs.js\` (gitignored)
- **Backend URL**: Configured in \`src/api/client.js\`

## 🎯 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## 📝 License

This project is licensed under the MIT License.
