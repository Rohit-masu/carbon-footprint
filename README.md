# HariPath 🌱
## Eco-Conscious Carbon Footprint Calculator

> **Empowering individuals to measure, understand, and reduce their carbon footprint through interactive tracking and actionable climate solutions.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-HariPath-blue?logo=github)](https://github.com/Rohit-masu/HariPath)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org)

---

## 📖 Overview

**HariPath** (हरि-पथ) is a web application designed to help individuals calculate and track their carbon emissions while building sustainable habits. Built in response to rising environmental concerns in Delhi NCR—from escalating AQI levels to lifestyle-driven emissions—HariPath empowers users with data-driven insights and practical climate action plans.

Whether you're concerned about your carbon footprint or looking to make a tangible environmental impact, HariPath makes it simple, engaging, and locally relevant.

---

## ✨ Key Features

### 🧮 **Interactive Carbon Calculator**
- Input lifestyle details (energy use, transportation, diet, waste)
- Get instant, personalized carbon footprint calculations
- Category-wise emissions breakdown with visual charts

### 🌍 **Delhi-Centric Insights**
- Compare your emissions against average Indian citizens
- Understand local environmental context (AQI, regional emissions)
- Localized recommendations for Delhi NCR residents

### 🎯 **Personal Pledge System**
- Select from curated eco-friendly pledges
- Track commitment progress
- Examples: reduce electricity usage, use metro, recycle waste, plant trees

### 📊 **Visual Analytics Dashboard**
- Track carbon footprint history
- View emissions by category (Energy, Transport, Food, Waste)
- Interactive charts powered by Chart.js

### 🔐 **Secure User Management**
- JWT-based authentication
- Encrypted password storage with bcrypt
- Persistent user dashboard

### 📱 **Responsive Design**
- Works seamlessly on desktop, tablet, and mobile
- Built with modern UI frameworks (Tailwind CSS, MUI)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React** | UI framework with hooks |
| **React Router** | Client-side routing |
| **Chart.js** | Data visualization |
| **Tailwind CSS** | Utility-first styling |
| **Material UI (MUI)** | Component library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **GraphQL + Apollo Server** | API layer |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |

### Additional Tools
- REST APIs for data exchange
- Excel export functionality
- Environment configuration with dotenv

---

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ and npm/yarn
- MongoDB (local or Atlas cluster)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rohit-masu/HariPath.git
   cd HariPath
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=3001
   AQI_API_KEY='<Your_OpenWeather_API_KEY>'
   ```

4. **Run the application**
   ```bash
   npm run develop
   ```

   This launches:
   - **React Frontend** → http://localhost:3000
   - **GraphQL Server** → http://localhost:3001/graphql

---

## 💻 Usage

### User Journey

1. **Sign Up / Login** - Create account or login with existing credentials
2. **Complete Calculator** - Enter lifestyle details across categories
3. **View Results** - See personalized carbon footprint and breakdown
4. **Make Pledges** - Commit to eco-friendly actions
5. **Track Progress** - Monitor previous results and pledge completion

### Example Calculations

| Lifestyle | Annual Emissions |
|-----------|-----------------|
| Average Delhi Resident | ~4.5 tons CO₂e |
| High-consumption User | ~8-10 tons CO₂e |
| Conscious Eco-User | ~2-3 tons CO₂e |

---

## 📂 Project Structure

```
HariPath/
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # Context API setup
│   │   ├── styles/           # CSS/Tailwind styles
│   │   └── utils/            # Helper functions
│   └── public/
├── backend/
│   ├── models/               # Mongoose schemas
│   ├── resolvers/            # GraphQL resolvers
│   ├── middleware/           # Express middleware
│   ├── routes/               # REST endpoints
│   └── config/               # Configuration files
├── .env.example
├── package.json
└── README.md
```

---

## 🔑 Key Learnings & Implementation Highlights

### Full-Stack Development
- Designed and implemented end-to-end carbon tracking system
- Built RESTful APIs and GraphQL endpoints
- Implemented JWT-based authentication flow

### Database Optimization
- Structured MongoDB schemas for efficient emissions tracking
- Implemented user authentication with bcrypt hashing
- Built dashboard queries for quick data retrieval

### Frontend Development
- Created responsive React components with hooks
- Integrated Chart.js for real-time data visualization
- Implemented client-side routing with React Router
- Applied Tailwind CSS for modern, accessible UI

### Environmental Impact
- Provided actionable climate insights for Delhi NCR region
- Helped users understand personal carbon footprint
- Created pledge system to encourage sustainable behavior change

---

## 👥 Team

| Member | Role |
|--------|------|
| **Rohit Gupta** | Full-Stack Development, Project Lead |
| **Ansh Thakur** | Frontend Development, UI/UX |
| **Tushar Anand** | Backend Development, Database Design |

Made with ❤️ in Delhi

---

## 📚 References & Inspiration

- [CoolClimate Calculator](https://coolclimate.berkeley.edu) - Carbon accounting methodology
- [Sustainable Web Design Guidelines](https://www.mightybytes.com/blog/sustainable-web-design/)
- [Carbon Trust Emissions Data](https://www.carbontrust.com/)
- [WHO Air Quality Standards](https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health)
- [India's Climate Pledges & INDC](https://unfccc.int/process-and-meetings/the-paris-agreement)

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, feature additions, or improvements to make HariPath more relevant for Delhi NCR:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Ideas
- Add new carbon calculation categories
- Improve pledge recommendations
- Enhance data visualization
- Add multilingual support (Hindi, other Indian languages)
- Optimize performance

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Questions

Have questions or feedback? Here's how to reach out:

- **Open an Issue** - For bugs or feature requests
- **Email** - Contact any team member
- **Discussions** - Use GitHub Discussions for ideas and feedback

---

## 🌟 Show Your Support

If you find HariPath helpful, please consider:
- ⭐ Starring this repository
- 🔄 Sharing with friends who care about sustainability
- 🤝 Contributing to the project
- 💬 Providing feedback and suggestions

---

## 📈 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Community leaderboard for top pledgers
- [ ] Integration with real-time AQI data
- [ ] Gamification features (badges, achievements)
- [ ] Social sharing of pledges
- [ ] API for third-party integrations
- [ ] Carbon offset marketplace integration

---

**Made with passion for a sustainable future 🌍**
