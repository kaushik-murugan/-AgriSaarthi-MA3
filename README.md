# -AgriSaarthi-MA3

## Project Overview
“AgriSaarthi MA3 is an Android application embedding the Multimodal Agricultural Agent Architecture (MA3) to deliver explainable, multimodal AI-driven farm advisory and automation for Indian farmers—online, offline, in multiple languages, via text, voice, image, and sensor data.”

## Creation Work: Core Components and Initial Development

This section outlines the foundational work and initial setup of the -AgriSaarthi-MA3 project.

### 1. React Native Expo Frontend (`android-app` folder)
-   **Initial Project Setup:** Established a cross-platform mobile application using React Native and the Expo framework, including the basic project structure, `package.json`, `App.tsx`, and `index.ts`.
-   **Navigation Implementation:** Developed the application's navigation flow using `react-navigation`, defining routes and managing transitions between key screens such as `HomeScreen`, `ChatScreen`, `MarketPricesScreen`, `FarmToolsScreen`, `SettingsScreen`, `WeatherScreen`, and `CropCalendarScreen`.
-   **Reusable UI Components:** Designed and implemented a library of reusable React Native UI components to ensure consistency and efficiency across the application. Examples include `AnswerCard`, `Card`, `ChatInput`, `DataStatus`, `ImageCapture`, `MarketPriceItem`, `PrimaryButton`, `ScreenWrapper`, and `ThemedInput`.
-   **Global State Management:** Created custom React Contexts (`LanguageContext` and `ThemeContext`) to manage application-wide state, such as language preferences and dark mode settings.
-   **Frontend API Integration:** Set up dedicated API service files (`agriApi.ts`, `apiConfig.ts`, `cropCalendarApi.ts`, `loanApi.ts`, `marketApi.ts`, `schemesApi.ts`, `weatherApi.ts`) to facilitate seamless communication with various backend services.
-   **Custom React Hooks:** Developed specialized hooks (`useAskAgri.ts`, `useOfflineData.ts`) to encapsulate complex logic related to AI agent interaction and efficient handling of offline data.
-   **Static Asset Management:** Integrated essential static assets like application icons (`adaptive-icon.png`, `favicon.png`, `icon.png`, `splash-icon.png`).
-   **Initial Localization Data:** Established the foundational structure for multilingual support by setting up initial translation files for English (`en.json`), Hindi (`hi.json`), and Tamil (`ta.json`).

### 2. Backend Services (`backend` folder)
-   **API Endpoint Development:** Built robust backend services using Python (leveraging the FastAPI framework) and potentially Node.js (with Express.js) to process requests from the frontend application.
-   **AI Model Integration Layer:** Developed the necessary infrastructure for integrating and managing AI model inference and response generation, including core logic in `main.py` and prompt templating (`prompt_template.py`).
-   **Python Virtual Environment:** Configured a dedicated Python virtual environment (`venv`) to manage project dependencies, ensuring a clean and isolated development environment (e.g., `fastapi`, `google-generativeai`, `uvicorn`, `python-dotenv`).
-   **File Upload Handling:** Implemented mechanisms for secure and efficient handling of file uploads, such as loan documents (`uploads/loan_docs`).

### 3. AI Models (`ai-models` folder)
-   **Model Conversion Pipeline:** Established processes for converting AI models, specifically for TensorFlow Lite (TFLite), to enable optimized on-device machine learning capabilities.
-   **MA3Router Logic:** Developed the core routing and orchestration logic for the Multimodal Agricultural Agent Architecture (MA3).

### 4. Voice Interface (`voice-interface` folder)
-   **ASR Integration Components:** Created components and configurations necessary for integrating Automatic Speech Recognition (ASR) functionalities, enabling voice input within the application.

### 5. QA Resources (`qa-resources` folder)
-   **Testing Framework Setup:** Configured the project's testing environment.
-   **CI/CD Pipeline Definition:** Established configurations for Continuous Integration and Continuous Deployment pipelines to automate build, test, and deployment processes.
-   **Localization Resource Management:** Set up a system for managing and organizing localization-related files.
