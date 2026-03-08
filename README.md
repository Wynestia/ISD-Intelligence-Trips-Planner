ตัวอย่างเนื้อหา **README.md** ที่จัดโครงสร้างให้ใช้งานจริงในโปรเจกต์

---

# ISD Project Setup Guide

คู่มือนี้อธิบายวิธีติดตั้งและรันระบบทั้งหมด ซึ่งประกอบด้วย

* LLM service (Python)
* Backend API
* Frontend Web Application

---

## 1. Prerequisites

ต้องติดตั้งซอฟต์แวร์ต่อไปนี้ก่อน

* Python 3.11+
* Node.js 18+
* npm
* Git
* bash shell เช่น Git Bash (สำหรับรัน `setup.sh`)
* PowerShell

ตรวจสอบเวอร์ชัน

```
python --version
node --version
npm --version
```

---

# Installation

Clone repository

```
git clone <repository-url>
cd <project-folder>
```

---

# 1. Setup LLM Environment

เข้าไปที่โฟลเดอร์ LLM

```
cd llm
```

รันสคริปต์เพื่อติดตั้ง environment

```
bash setup.sh
```

สคริปต์จะทำ

* สร้าง `.venv`
* activate virtual environment
* install dependencies จาก `requirements.txt`

---

# 2. Setup Backend

```
cd isd-backend
npm install
```

---

# 3. Setup Frontend

```
cd isd-frontend
npm install
```

---

# Running the System

กลับไปที่ root directory ของโปรเจกต์

```
cd ..
```

รันระบบทั้งหมด

```
.\start.ps1
```

สคริปต์นี้จะทำการ

* start LLM service
* start backend API
* start frontend server

---

# Project Structure

```
project-root
│
├── llm
│   ├── setup.sh
│   ├── requirements.txt
│   └── src
│
├── isd-backend
│   ├── package.json
│   └── src
│
├── isd-frontend
│   ├── package.json
│   └── src
│
└── start.ps1
```

---

# Troubleshooting

## Python not found

ถ้าเกิด error

```
python is not recognized
```

ให้ติดตั้ง Python และเพิ่มใน PATH

---

## Port already in use

ถ้าเจอ error

```
EADDRINUSE
```

แสดงว่ามีโปรแกรมใช้ port นั้นอยู่

ตรวจสอบ

```
netstat -ano | findstr :3001
```

kill process

```
taskkill /PID <pid> /F
```

---

## npm install error

ลองลบ node_modules แล้วติดตั้งใหม่

```
rm -rf node_modules
npm install
```

---

หากยังพบปัญหา ให้เปิด issue ใน repository

---

ถ้าต้องการ ผมสามารถ **ปรับ README นี้ให้ดู professional มากขึ้นสำหรับ GitHub (มี badges, architecture diagram, run flow ของ LLM-Backend-Frontend)** ซึ่งจะทำให้โปรเจกต์ดูเป็น **production-level repo มากขึ้น**.
