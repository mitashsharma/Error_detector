# 🛡️ CodeGuard – Interactive Code Error Detector

CodeGuard is a web-based application that helps developers detect syntax errors in their code in real-time. It supports multiple programming languages and provides an intuitive interface for quick debugging.

---

## 🚀 Features

* 🔍 Detect syntax errors in:

  * Python
  * C
  * C++
  * Java
* ⚡ Real-time error analysis
* 🎨 Clean and modern UI with dark/light mode
* 📩 Built-in support system (store user queries)
* 🗂️ View recent queries (stored in database)

---

## 🏗️ Tech Stack

**Frontend:**

* HTML
* CSS
* JavaScript

**Backend:**

* Flask (Python)
* Flask-CORS
* Flask-SQLAlchemy

**Database:**

* SQLite

---

## 📁 Project Structure

```
codeguard/
│
├── app.py
├── detector.py
├── requirements.txt
│
├── instance/
│   └── support.db
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/codeguard.git
cd codeguard
```

### 2. Create virtual environment

```
python -m venv venv
```

### 3. Activate virtual environment

**Windows:**

```
venv\Scripts\activate
```

**Linux/Mac:**

```
source venv/bin/activate
```

### 4. Install dependencies

```
pip install -r requirements.txt
```

---

## ▶️ Run the Application

```
python app.py
```

Then open your browser and go to:

```
http://localhost:5000
```

---

## 🧠 How It Works

* User enters code in the editor
* Frontend sends request to `/api/detect`
* Backend processes code using `detector.py`
* Returns:

  * ✅ Success (no errors)
  * ❌ Error (with details like line number, message)

---

## 📬 API Endpoints

### Detect Errors

```
POST /api/detect
```

**Request Body:**

```json
{
  "code": "print('Hello')",
  "language": "python"
}
```

---

### Submit Support Ticket

```
POST /api/support
```

---

### Get All Tickets

```
GET /api/tickets
```

---

## 📌 Future Improvements

* 🔐 User authentication system
* 🌐 Deploy online (Render / Railway)
* 🧠 AI-based code suggestions
* 📊 Error analytics dashboard
* 🧩 Support for more languages

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 💡 Author

**Mitash Sharma**

---

## ⭐ Support

If you like this project, give it a star ⭐ on GitHub!
