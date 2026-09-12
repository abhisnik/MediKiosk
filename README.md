<div align="center">

# 🏥 MediKiosk
### AI-Powered Multilingual Clinical History Intake Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://medikiosksih-1.onrender.com)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

*Designed for high-volume outpatient clinics and kiosks to bridge language and digital literacy gaps before consultation.*

[Live Patient Portal](https://medikiosksih-1.onrender.com) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Spec](#-api-specification)

</div>

---

## 📌 Problem & Impact

In crowded clinical settings, doctors spend considerable consultation time taking basic medical history and transcribing physical records. For patients facing barriers with literacy, regional languages, or accessibility, traditional intake workflows lead to bottlenecks and incomplete records.

**MediKiosk** acts as a pre-consultation digital assistant:
* **Accessible Intake:** Multimodal intake via voice or touch in **English, Hindi, and Bengali**.
* **Clinical Intelligence:** Extracts structured findings, medications, and lab trends from uploaded paper prescriptions and reports using Gemini multimodal parsing.
* **Human-in-the-Loop:** Produces a structured summary for the attending physician rather than replacing clinical decision-making.

---

## 🔄 Intake Flow

```text
Welcome ──► Language Select ──► Identification & Consent ──► Guided Voice/Touch Intake ──► Document Scan ──► Physician Summary


## 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │    React 19 + Vite      │
                    │  (Render Static Site)   │
                    └────────────┬────────────┘
                                 │
                                 │ VITE_API_URL
                                 ▼
                    ┌─────────────────────────┐
                    │   Node.js + Express     │
                    │  (Render Web Service)   │
                    └──────┬───────────┬──────┘
                           │           │
           ┌───────────────▼┐         ┌▼────────────────┐
           │ Google Gemini  │         │ Firebase /      │
           │ Multimodal API │         │ Firestore DB    │
           └────────────────┘         └─────────────────┘

## 👥 Team & Contributors

Developed for Smart India Hackathon (PS 26047) by:

* **Abhishek Pramanik** - Full-Stack & System Lead (Owner) — [@abhisnik](https://github.com/abhisnik)
* **Shweta** - Frontend & UI/UX — [@Shweta](https://github.com/prajapatishweta354-jpg)
* **Aditya Sharma** - Clinical Workflow & QA — [@Aditya]()
* **Subham Das** - Voice Interface & Accessibility Engineer — [@Subham](subhamdas23may-create)
* **Darshika Sharma** - AI & Clinical Document Intelligence — [@Darshika]()
* **Abhijeet Yadav** - Backend, Cloud & Data Persistence — [@Abhijeet]()
