# 🌍 Interactive Map Chat Application

This interactive Flask-based web application integrates advanced mapping features with conversational AI, allowing users to effortlessly select locations, retrieve location-specific details, and interact through an intuitive chat interface powered by Google's Gemini AI.

## 🚀 Key Features

* **Interactive Map Integration:**

  * Powered by **Leaflet.js**, enabling seamless map interactions.
  * Integrated search functionality via **Leaflet Control Geocoder**.

* **Conversational AI:**

  * Utilizes **Google Gemini AI** to answer user queries about selected locations.
  * Natural, context-aware conversational responses rendered clearly with Markdown support.

* **Shortest Route Calculation:**

  * Provides optimized, road-based routing between multiple selected locations using the **OpenRouteService API**.
  * Visualizes clearly navigable routes directly on the map.

* **Advanced User Interface:**

  * Modern, stylish, and responsive design.
  * Easy-to-use chat interface with smooth toggling visibility.
  * Comprehensive location management allowing users to add, view, and remove locations effortlessly.

## 🎯 How to Use the Application

### 📌 Selecting Locations:

* Simply click on the map to select and store locations.
* Selected locations appear clearly listed in the chat panel.

### 📌 Conversational Interaction:

* Type your queries in the chat input to interact with the Gemini conversational AI.
* Queries can include requests for summaries, location details, or specific queries like "Show shortest path."

### 📌 Shortest Path Calculation:

* Ask "Show shortest path" in the chat.
* Select your preferred starting point clearly from the prompted list of locations.
* A navigable, road-following route will appear directly on the map.

### 📌 Location Management:

* Clearly visible remove buttons enable easy management of mistakenly selected locations.

## 💻 Technology Stack

* **Frontend:**

  * HTML5, CSS3, JavaScript
  * Leaflet.js, Leaflet Control Geocoder
  * Marked.js (Markdown rendering)

* **Backend:**

  * Python, Flask
  * Google Gemini API
  * OpenRouteService API

* **Deployment:**

  * Render (recommended for easy and scalable deployment)

## ⚙️ Installation and Setup

### 📌 Clone Repository

```bash
git clone https://github.com/Dj9162/Map-Chat.git
cd Map-Chat
```

### 📌 Install Dependencies

```bash
pip install -r requirements.txt
```

### 📌 Setup Environment Variables

Create a `.env` file in the root of your project:

```env
GEMINI_API_KEY=<Your_Gemini_API_Key>
ORS_API_KEY=<Your_OpenRouteService_API_Key>
SECRET_KEY=<Random_Secure_Key_for_Session>
```

Generate a Flask `SECRET_KEY` quickly:

```python
import os; print(os.urandom(24))
```

### 📌 Run the Application Locally

```bash
python app.py
```

Access the app at [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 🌐 Deployment Guide

Deploy your Flask application easily on Render:

* Create a new Web Service on [Render](https://render.com).
* Connect your GitHub repository.
* Configure the environment:

  * **Runtime:** Python
  * **Build Command:** `pip install -r requirements.txt`
  * **Start Command:** `gunicorn app:app`
* Set your environment variables clearly (GEMINI\_API\_KEY, ORS\_API\_KEY, SECRET\_KEY).
* Click "Create Web Service" and your application will be deployed publicly.

## 📸 Screenshots

<img width="1916" height="909" alt="image" src="https://github.com/user-attachments/assets/681f3e78-85b5-4f09-b48c-efd157040628" />

<img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/e9b1c02c-a268-4b42-99bf-a157a76f2b5b" />

## 📝 License

MIT License © Dhanraj Kumar. Feel free to use, modify, and distribute this application.

---

✨ **Enjoy interacting with your locations and exploring the power of AI!** 🌐
