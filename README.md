# শিখন৩৬০ - Interactive Educational Platform

A modern, interactive educational platform featuring Physics, Mathematics, and Chemistry simulations with AI chatbot assistance, designed to make learning engaging and accessible.

## 🌟 Features

### 🧠 Interactive Subject Simulations
- **Physics**: Interactive simulations on weight-mass relationships and Ohm's law
- **Chemistry**: Litmus test and molarity calculation simulations
- **Mathematics**: Shape identification and number line quizzes

### 🤖 AI Chatbot Tutor
- Subject-specific AI tutors for Physics, Chemistry, and Mathematics
- Natural language processing to answer student questions
- Context-aware responses tailored to educational content

### 🔊 Text-to-Speech Integration
The chatbot includes a "Hear the answer" button that allows users to listen to the AI's response. This feature uses Microsoft Azure's Text-to-Speech API to convert text responses into natural-sounding speech.

#### How It Works:
1. When the chatbot provides a text response, a "Hear the answer" button appears at the bottom of the message
2. Clicking this button sends the response text to the backend
3. The backend uses Azure's TTS API to generate an audio file
4. The audio is streamed back to the frontend and played automatically
5. Once loaded, users can play, pause, and reset the audio as needed

#### Controls:
- **Hear the answer**: Initial button to convert text to speech
- **Play/Pause**: Toggle button to control audio playback
- **Reset**: Button to clear the current audio and free up resources

### 🔬 Research Desk
- **Collaborative Projects**: Platform for students to work on scientific research projects
- **Research Challenges**: Weekly and monthly challenges tied to curriculum topics
- **Volunteer Opportunities**: Hands-on learning through scientific outreach programs
- **Resource Sharing**: Access to scientific papers, educational materials, and experiments
- **Community Forums**: Interactive spaces for discussion and idea exchange
- **Mentor Connections**: Connect with researchers from S.N. Bose National Centre

## 🛠️ Technology Stack

### Frontend
- React.js with React Router for navigation
- Modern CSS with responsive design principles
- Interactive animations and visualizations
- Responsive UI components for seamless experience across devices

### Backend
- Node.js with Express framework
- MongoDB for data storage
- JWT for authentication
- RESTful API architecture for client-server communication

### AI & Speech
- Google's Generative AI for the chatbot functionality
- Microsoft Azure's Text-to-Speech API for audio responses
- Cloudinary for media management

## 📊 Educational Approach

Our platform focuses on:
- **Visual Learning**: Through interactive simulations
- **AI-Assisted Tutoring**: Personalized help when needed
- **Multilingual Support**: Content in multiple languages, including Bengali
- **Accessibility**: Text-to-speech features for different learning needs
- **Research-Based Learning**: Encouraging scientific inquiry through the Research Desk
- **Collaborative Learning**: Building teamwork through group projects and forums

## 💻 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

### Environment Variables
Create a `.env` file in the backend directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AZURE_TTS_KEY=your_azure_tts_api_key
AZURE_TTS_REGION=your_azure_region
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

## 🚀 Deployment
The application is configured for deployment on Vercel:
- Frontend: Static site deployment
- Backend: Serverless functions

## 👩‍💻 Contributing
We welcome contributions to enhance the educational experience!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License.

## 🙏 Acknowledgements
- S.N. Bose National Centre for Basic Sciences for inspiration
- All contributors and educators who provided feedback