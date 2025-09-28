```markdown
# 🧥 Snitch - E-Commerce Clothing Website

Snitch is a modern, responsive, and scalable e-commerce website for men's fashion built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This project mimics the functionality of a real-world fashion brand like **Snitch**, offering product browsing, filtering, cart, wishlist, and secure checkout features.

---

## 📅 Task Assigned

- **Assigned On**: Thursday, **25/09/2025**
- **Tech Stack**: MERN (MongoDB, Express, React, Node)

---

## 🚀 Features

- 🔍 Browse and search 200+ clothing products
- 📦 View product details with images, colors, and sizes
- 🛒 Add to cart and wishlist
- 🧾 Checkout and order summary
- 🔐 JWT-based user authentication
- 🧑 Admin panel to manage products (CRUD)
- 🔄 Trending, Featured & Discount filters
- 📱 Responsive design

---

## 📚 Technologies Used

### 🔧 Backend

- **Node.js** with **Express**
- **MongoDB** with Mongoose ODM
- **REST API**
- **JWT** for auth
- **Cloudinary** for image hosting

### 🖥️ Frontend

- **React.js** with **Vite**
- **Tailwind CSS**
- **React Router**
- **React Query** / Axios for API handling

---

## 📁 Folder Structure
```

📦snitch-clothing-mern/
┣ 📂client/ # React Frontend (Vite)
┣ 📂server/ # Express + MongoDB Backend
┣ 📜.env # Environment variables
┣ 📜README.md
┣ 📜.gitignore
┗ 📜package.json

````

---

## 🛠️ Setup Instructions

### 📦 Backend (Server)

```bash
cd server
npm install
````

1. Set up your `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. Start the server:

```bash
npm run dev
```

---

### 💻 Frontend (Client)

```bash
cd client
npm install
```

1. Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

2. Start the client:

```bash
npm run dev
```

---

## 📸 Dummy Data

- 200+ products are pre-seeded into MongoDB.
- Dummy image source used: [`https://cloudinary.com/`](https://dummyimage.com/)
- Colors, sizes, and reviews are mock-generated.

---

## ✅ To Do

- [+] Product details page
- [+] Add to Cart & Wishlist
- [+] Backend filtering & pagination
- [x] Payment gateway integration
- [x] Admin dashboard

---

## 🧑‍💻 Developer

> **Name**: _Suryamani Gupta_ > **Role**: Full Stack Developer
> **Date Started**: Thursday, 25th Sept 2025
> **Contacts**: manigupta28201@gmail.com.
