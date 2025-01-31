# 🚀 UltimateGenius - Gamified Learning Platform

https://github.com/user-attachments/assets/463ce8d3-e908-4eb5-8c66-f5536285f0d5

Transform education into an adventure with this AI-powered gamified learning platform. Engage students through interactive quizzes and empower teachers with smart content creation tools.

## 🎮 Features Overview

### 👨🎓 **Student Experience**
- **Interactive Quiz Journey**
  - Join quizzes with unique codes 🎟️
  - Real-time waiting lobby with player avatars
  - Game-style quiz interface with power-ups ⚡
  - Live score tracking🏅

- **Personal Dashboard**
  - 📊 Performance analytics
  - 📅 Game history timeline
  - 🏆 Achievement showcase
  - Profile customization 🎨

### 👩🏫 **Teacher Arsenal**
- **AI-Powered Question Crafting**
  - Gemini AI integration for instant question generation 🤖
  - Customizable question templates
  - Bulk import/export capabilities

- **Quiz Management Suite**
  - 🧩 Create dynamic question banks
  - ⚙️ Advanced filters (category/difficulty/search)
  - 📈 Real-time participation analytics

### 🔐 Core System Features
- Secure authentication flow (JWT)
  - 🔑 Login/Signup with password strength meter
  - 📧 Password recovery system
  - 🔄 Password change functionality
- Responsive gamified UI 🕹️
- Real-time scoreboards 🏆

## 🛠️ Tech Stack

**Frontend**  
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)  

**Backend**  
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express-000000?logo=express)](https://expressjs.com/)

**Database**  
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)

**AI Integration**  
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?logo=google)](https://ai.google.dev/)


### 🔄 Real-Time Interaction Flow

```diff
+------------------+       +------------------+       +------------------+
|  Teacher Portal  |       |   Game Server    |       | Student Interface|
+------------------+       +------------------+       +------------------+
|                  |       |                  |       |                  |
|  Create Quiz     |------>|  Generate ID     |<------|  Enter Code      |
|      🚀          |       |       🔑         |       |       📥         |
|                  |       |                  |       |                  |
|  Start Session   |------>|  Initiate Lobby  |<----->|  Join Lobby      |
|      ▶️          |       |       👥         |       |       🕹️         |
|                  |       |                  |       |                  |
|  Push Questions  |------>|  Broadcast Q/A   |<----->|  Answer Stream   |
|      📨          |       |       📡         |       |       💡         |
|                  |       |                  |       |                  |
|  End Session     |------>|  Calculate Scores|<----->|  Display Results |
|      🏁          |       |       🧮         |       |       🏅         |
+------------------+       +------------------+       +------------------+

