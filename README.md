# 🎬 Filmolo

**Filmolo** is a minimalist full-stack web application for discovering, rating, and reviewing movies and TV shows. The project aims to simplify user experience by reducing decision fatigue, offering a clean interface and essential features — without the clutter found on major platforms.

## 🔍 Features

- ✅ Browse the latest films and series
- ✅ Submit and view reviews and ratings
- ✅ Search functionality by title
- ✅ Light-weight interface for fast navigation
- ✅ Admin moderation panel (optional future upgrade)

## 🛠️ Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose)
- **Hosting**: VPS (Contabo) + Apache + PM2
- **Domain**: [filmolo.net](https://filmolo.net)
- **SSL**: Let's Encrypt + Certbot

## 📦 Deployment

The app is deployed on a VPS with Apache configured as a reverse proxy. PM2 is used to keep the Node server alive in production, and Certbot ensures HTTPS encryption with automatic renewal.

## 🚀 Live Website

👉 [https://filmolo.net](https://filmolo.net)

## 📁 Project Structure

films-website/ │ 
  ├── frontend/ # React application 
    ├── backend/ # Express API and MongoDB models 
      └── .vscode/ # VSCode workspace settings (optional) 
## 🤔 Future Enhancements

- 🔐 User profile with features to change it 
- ⭐ Personalised recommendations  
- 🌐 Multilingual support  
- ♿ Enhanced accessibility features

## 👨‍💻 Author

**Jakhongir Salomov**  
_Uzbekistan / UK-based Computer Science student_  
GitHub: [@Johansol98](https://github.com/Johansol98)  
📫 Email: l39149307@student.ua92.ac.uk

---

> This project was built as part of a university coursework and represents a fully working MVP.
