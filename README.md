SwasthyaDrishti — Digital Health Twin

SwasthyaDrishti is an academic Digital Health Twin project designed to explore personalized health monitoring using participant demographics, health measurements, and machine learning. It uses selected data from the NHANES dataset to develop a foundation for health-data analysis and risk assessment.

Live Demo

Frontend: https://frontend-dbgkntxs7-git-happens1.vercel.app

Backend API: https://swasthyadhristi-api.onrender.com

API Health Check: https://swasthyadhristi-api.onrender.com/api/health

Note: The frontend URL above is the known Vercel preview URL. Replace it with your production deployment URL if you have a separate production deployment.

Features

Participant data retrieval from the processed NHANES dataset.

FastAPI backend for serving health-related data.

React and Vite frontend.

Data preprocessing and missing-value analysis.

Foundation for personalized health analytics and future machine learning-based risk assessment.

Only features implemented in the current version should be considered available; planned functionality may require further development.

Technology Stack

Frontend: React, Vite, JavaScript

Backend: Python, FastAPI

Dataset: NHANES

Deployment: Vercel (frontend), Render (backend)

Version Control: Git and GitHub

Prerequisites

Install the following before running the project locally:

Git

Python 3.10 or a compatible version for the backend dependencies

Node.js and npm

Local Setup

1. Clone the repository

git clone https://github.com/Aishwarya-112006/Digital-health-twin-for-personalized-health-monitoring.git
cd Digital-health-twin-for-personalized-health-monitoring

2. Start the backend

Open a terminal in the repository root.

Create and activate a virtual environment:

Windows PowerShell

python -m venv .venv
.\.venv\Scripts\Activate.ps1

Install the backend dependencies using the repository's dependency file. If requirements.txt is in the root directory:

pip install -r requirements.txt

Start the API:

uvicorn backend.app.main:app --reload

The backend should be available at:

API: http://127.0.0.1:8000

Interactive API documentation: http://127.0.0.1:8000/docs

If the dependency file is stored in another directory, use its actual path.

3. Start the frontend

Open a second terminal:

cd frontend
npm install

Create a .env file inside the frontend directory with:

VITE_API_BASE_URL=http://127.0.0.1:8000

Start the development server:

npm run dev

Open the local URL printed by Vite, usually http://localhost:5173.

Dataset

The project uses processed NHANES data for participant-level analysis. The dataset contains demographic and health-related measurements, with missing values documented during preprocessing.

NHANES is a public health survey conducted by the US National Center for Health Statistics. Refer to the official website for dataset information:

https://www.cdc.gov/nchs/nhanes/

Follow the repository's data-handling instructions when obtaining or processing source data.

Deployment

The React/Vite frontend is deployed on Vercel.

The FastAPI backend is deployed on Render.

The frontend connects to the backend through the VITE_API_BASE_URL environment variable.

The deployed backend must allow requests from the frontend origin through its CORS configuration.

Project Status

This project is an academic prototype. Its capabilities depend on the features implemented in the current codebase. Outputs should not be treated as medical diagnoses or a substitute for professional medical advice.

Author

Aishwarya Singh

GitHub: https://github.com/Aishwarya-112006