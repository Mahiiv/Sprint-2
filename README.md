# 💰 Cash-Flow — Salary & Expense Tracker

Cash-Flow is a vanilla JavaScript dashboard for tracking salary and expenses in real time — log what you earn, log what you spend, and instantly see what's left, with a live chart and exportable PDF report on top.

Built as part of Sprint 02, this project was a hands-on exercise in DOM manipulation, state management, localStorage persistence, and integrating third-party APIs and libraries (Chart.js, jsPDF, and a live currency exchange API).

---

## Live Demo

sprint-2-eta.vercel.app

## Video Walkthrough
(https://drive.google.com/file/d/18a07zEVObIS4I_ESH6aBGT6Id3pPHqj8/view?usp=sharing)

---

## 📌 Overview

Manually tracking salary and expenses makes it hard to know what's actually left to spend. Cash-Flow solves this with a single-page dashboard where users can:

- Save their total salary
- Add expenses with a name and amount
- See Total Salary, Total Expenses, and Remaining Balance update live
- View a pie chart comparing expenses vs. remaining balance
- Get a low-balance warning when funds run low
- Convert all displayed values between INR, USD, and EUR
- Download a full financial summary as a PDF
- Have all data persist across page reloads via localStorage

---

## ✨ Features

### 💵 Salary Management
- Enter and save a total salary
- Input validation rejects zero/negative values
- Salary persists in `localStorage`

### 🧾 Expense Management
- Add expenses with a name and amount
- Expenses render in a table with a delete action per row
- Delete asks for confirmation before removing an entry
- Totals and balance recalculate automatically on add/delete

### ⚠️ Low Balance Warning
- A warning banner appears automatically when the remaining balance drops to 10% or less of the total salary
- The balance figure is highlighted in red while the warning is active

### 📊 Visual Analytics
- A live pie chart (Chart.js) visualizes Total Expenses vs. Remaining Balance
- Chart updates in real time as expenses are added or removed

### 🌍 Currency Conversion
- Switch between INR, USD, and EUR
- Live exchange rates fetched from the Frankfurter API
- All figures (salary, expenses, balance) re-render in the selected currency
- Falls back gracefully with an alert if the API request fails

### 📄 PDF Reporting
- One-click "Download Report" generates a PDF via jsPDF
- Includes salary, total expenses, remaining balance, and the full itemized expense list

### 💾 Data Persistence
- Salary and expenses are stored in `localStorage`
- Data survives page refreshes and browser restarts

---

## 🛠️ Tech Stack

- **HTML5 / CSS3** — structure and styling, fully responsive layout
- **Vanilla JavaScript** — all app logic, no framework
- **Chart.js** (via CDN) — pie chart rendering
- **jsPDF** (via CDN) — PDF report generation
- **Frankfurter API** — free, live currency exchange rates

---

## 📂 Project Structure

```
Sprint-2/
├── index.html   # App structure/markup
├── style.css    # Styling and responsive layout
├── script.js    # App logic — state, rendering, chart, PDF, currency
└── README.md
```

---

## 🔮 Possible Future Improvements

- Expense categories/tags for more detailed breakdowns
- Editable salary without needing to overwrite the field manually
- Date-based tracking (e.g., monthly views)
- Sanitizing user-entered expense names before rendering to the DOM
