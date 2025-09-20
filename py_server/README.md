# 🌱 Plant Health Prediction API

This project contains a **FastAPI wrapper** for a machine learning model trained to predict regional plant health (**Average NDVI**) based on monthly weather data.

---

## ⚙️ Setup

### 1. Place Files
Ensure the following files are in the same directory:
- `main.py` (the API code)
- `requirements.txt` (the dependencies)
- `plant_health_monthly_model-1000.pkl` (your trained model file)

### 2. Install Dependencies
Open your terminal in the project directory and run:

```bash
pip install -r requirements.txt
````

---

## 🚀 Running the API Server

Start the server with:

```bash
uvicorn main:app --reload
```

* `main` → refers to the `main.py` file
* `app` → refers to the `app = FastAPI()` object inside `main.py`
* `--reload` → enables auto-reloading when code changes

---

## 🌐 Accessing the API

Once the server is running, you can access it at:

👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 📘 Using the Interactive API Docs

FastAPI provides built-in Swagger docs for easy testing.

1. Open your browser and go to:
   👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

2. Expand the `/predict` endpoint.

3. Click **"Try it out"**.

4. Edit the example JSON in the **Request body** with the weather data you want to test.

5. Click **"Execute"**.

6. The API will return the prediction in the **Server response** section.

---

✅ Your API is now ready to use!

```

Do you also want me to include an **example JSON request body** for `/predict` (with sample weather data) so users can test it right away?
```
