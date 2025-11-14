# 🏥 PRESCRIPTO — Full Stack Doctor Appointment Booking System (MERN Stack)

![PRESCRIPTO Screenshot](./frontend/public/prescripto.png)

PRESCRIPTO is a **full-stack MERN application** for booking doctor appointments.  
It provides **three-level authentication**: Patient, Doctor, and Admin.  
Patients can book and manage appointments, pay online, doctors can manage appointments and earnings, and admins can manage users and doctors.  

This project is ideal for **resume, portfolio, or college projects**.

---

## 🧠 Features

- 🔐 **User Authentication**: Patients, Doctors, Admins login with role-based access  
- 📝 **Book Appointments**: Patients can book, view, and cancel appointments  
- 💳 **Online Payments**: Integrated payment gateway for appointment fees  
- 👨‍⚕️ **Doctor Dashboard**: Manage appointments, earnings, and profile  
- 🛠️ **Admin Dashboard**: Manage doctors, patients, and appointments  
- 💻 **Responsive UI**: Built using React and Tailwind CSS  
- 📦 **MongoDB Database**: Store users, doctors, appointments, and payments  
- ⚡ **Express.js Backend**: REST APIs with secure routes  

---

## 💻 Tech Stack

| Technology                                                                 | Description                                           |
| -------------------------------------------------------------------------- | ----------------------------------------------------- |
| ![React.js](https://img.shields.io/badge/React.js-61DAFB?style=flat&logo=react&logoColor=black) | Frontend library for dynamic UI                        |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white) | Responsive UI design                                   |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Backend runtime                                       |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) | Backend web framework                                 |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | NoSQL database                                        |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) | ODM for MongoDB                                      |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | HTTP client for frontend-backend communication       |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | Token-based authentication                            |
| ![Dotenv](https://img.shields.io/badge/Dotenv-000000?style=flat)           | Environment variables management                      |

---

## 🗂️ Folder Structure

```

prescripto-full-stack/
│
├── admin/ # Admin frontend (HTML, JS, Tailwind)
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
├── backend/ # Node.js + Express backend
│ ├── config/ # DB config
│ ├── controllers/ # API controllers
│ ├── middleware/ # Auth & other middleware
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ └── server.js # Main server file
│
├── frontend/ # Patient & Doctor frontend (React + Tailwind)
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── vite.config.js
│
├── How_To_Run_Project.pdf
└── README.md

```

## 🏁 Getting Started

Follow these steps to run the project locally:

1. **Clone the repository:**

```

git clone https://github.com/singhayush007/PRESCRIPTO.git
```

2. **Navigate to the project folder:**

```
cd PRESCRIPTO
```

3. **Install dependencies:**

```
npm install
```

4. **Create a .env.local file in the root and add your environment variables:**

```
CURRENCY = ""
JWT_SECRET=""

# Admin Panel Credentials
ADMIN_EMAIL = ""
ADMIN_PASSWORD = ""

# MongoDB URI
MONGODB_URI=your_mongodb_connection_uri

# Cloudinary Setup ( required )
CLOUDINARY_NAME = "your_cloud_name"
CLOUDINARY_API_KEY = "your_cloudinary_api_key"
CLOUDINARY_SECRET_KEY = "your_cloudinary_secret_key"

# Razorpay Payment Integration
RAZORPAY_KEY_ID = "------ Razorpay Key Id here ------"
RAZORPAY_KEY_SECRET = "------ Razorpay Key Secret here ------"

# Stripe Payment Integration
STRIPE_SECRET_KEY="------ Stripe Secret Key here ------"
```

5. **Run the development server and client:**

```
cd frontend : npm run dev
cd backend : npm run server
```

6. **Open the app in your browser:**

```
http://localhost:5173
```

## 💻 Deployment

You can deploy this app using Vercel, Docker, or any Node.js hosting platform.

## 📄 License

This project is licensed under the MIT License — feel free to use and modify it as per your needs.