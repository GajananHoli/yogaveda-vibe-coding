# YogaVeda 🧘‍♂️

A modern, premium, and fully responsive platform for authentic Yogasanas, meditation, personalized health programs, and scientific research.

YogaVeda blends traditional Vedic yoga wisdom with clinical neuromuscular science. It includes interactive breathing visualizations, custom recommendation engines, dynamic charts, and an AI-powered yoga coach.

---

## Key Features

- **Asana Directory**: Browse and master authentic physical postures with deep anatomical instructions.
- **AI Yoga & Yogasan Recommendation Engine**: Generate science-based personalized wellness programs tailormade to your body metrics and clinical health goals.
- **Acharya YogaVeda Chat Coach**: Speak directly with a simulated/live digital guru who guides your practice safely.
- **Breathing Sadhana & Interactive Box Timer**: Deep respiratory training with linear pacing, audio synthesizers, and live statistics.
- **Sadhana Consistency Visualizer**: Dynamic calendar graphs powered by **Recharts** to analyze practice minutes and streak consistencies.
- **Multilingual Support**: Switch seamlessly between English, Hindi, Marathi, and Gujarati in the user interface.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, **Vite**, **Tailwind CSS v4** (using `@tailwindcss/vite`), **motion/react** (formerly Framer Motion)
- **Backend API**: Express, TypeScript (run with `tsx`)
- **Intelligence**: Google Gen AI SDK (`@google/genai`), falling back gracefully to robust local simulated expert intelligence if API keys are absent
- **Data Visuals**: Recharts, Lucide React

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)

---

## Local Development Setup

To run YogaVeda on your local machine, follow these steps:

### 1. Install Dependencies
Navigate to the project root and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template `.env.example` file to create a local `.env` configuration file:
```bash
cp .env.example .env
```
Open the `.env` file and configure the values:
```env
# Your Google Gemini API Key from Google AI Studio
GEMINI_API_KEY="YOUR_ACTUAL_API_KEY"

# Your self-referential app URL (defaults to localhost)
APP_URL="http://localhost:3000"
```
*Note: If `GEMINI_API_KEY` is left blank, YogaVeda will automatically run in **simulated expert engine mode**, which generates realistic, hyper-tailored yoga programs offline without crashing.*

### 3. Run the Development Server
Power up the combined Vite and Express server:
```bash
npm run dev
```

### 4. Application Ingress
Open your web browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## Production Build & Start

To build and run YogaVeda in a production-ready containerized environment:

### 1. Compile and Bundle
This bundles the frontend static files into the `dist/` folder and compiles the custom Express TypeScript server into a streamlined CommonJS bundle (`dist/server.cjs`) using `esbuild`:
```bash
npm run build
```

### 2. Start the Server
Start the production server:
```bash
npm run start
```
The server will boot up and serve static assets on **port 3000**.

### 3. Utility Scripts
- **Lint**: Run static TypeScript analysis to check for type-safety issues:
  ```bash
  npm run lint
  ```
- **Clean**: Remove the compiled `dist/` bundle:
  ```bash
  npm run clean
  ```
