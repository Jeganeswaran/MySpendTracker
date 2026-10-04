# MySpendTracker

A simple, offline-first expense tracker and budget planner built with React Native and Expo.

![MySpendTracker Logo](./assets/logo.png)

## 📱 About

MySpendTracker helps users take control of their finances by providing a clean, fast, and private way to track expenses, set budgets, and understand spending habits. The app works offline by default, with optional cloud sync for backup and multi-device access.

## ✨ Features

### Core Features
- **Quick Expense Entry** – Add expenses in seconds with amount, category, date, and note
- **Transaction History** – View all transactions sorted by date, filterable by day/week/month
- **Category Management** – Pre-defined categories plus custom user categories
- **Budget Planner** – Set monthly and per-category budgets with visual progress
- **Dashboard** – At-a-glance view of monthly spending and remaining budget

### Advanced Features
- **Charts & Reports** – Visual breakdowns of spending by category and time
- **Recurring Transactions** – Automate tracking of rent, subscriptions, and bills
- **Cloud Sync** – Optional backup and sync across devices (powered by Turso)
- **Local PC Export** – Export data to CSV via local Wi-Fi connection
- **Bill Reminders** – Push notifications for upcoming recurring bills
- **Multiple Wallets** – Track expenses across Cash, Credit Card, and Bank accounts

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React Native with Expo |
| Navigation | Expo Router (file-based) |
| Database | SQLite (expo-sqlite) |
| Cloud Sync | Turso Offline Sync |
| Ads | Google AdMob (react-native-google-mobile-ads) |
| Local Server | react-native-pocket-server |
| State Management | React Context + Zustand |
| UI Components | Custom + React Native Paper |
| Language | TypeScript |

## 📁 Project Structure
myspendtracker/
├── app/ # Expo Router: file-based routing
│ ├── (tabs)/ # Main tab navigation
│ │ ├── _layout.tsx # Tab bar configuration
│ │ ├── index.tsx # Home/Dashboard Screen
│ │ ├── transactions.tsx # Transaction History Screen
│ │ ├── budget.tsx # Budget Screen
│ │ └── settings.tsx # Settings Screen
│ ├── add-expense.tsx # Modal for adding an expense
│ ├── _layout.tsx # Root layout with providers
│ └── +not-found.tsx
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── ui/ # Generic primitives (Button, Card, Input)
│ │ └── finance/ # Finance-specific components
│ ├── features/ # Feature-based modules
│ │ ├── transactions/
│ │ ├── budgets/
│ │ ├── categories/
│ │ └── backup/
│ ├── lib/
│ │ ├── db/ # SQLite schema and migrations
│ │ ├── sync/ # Cloud sync configuration
│ │ ├── local-server/ # Local PC export server
│ │ ├── ads/ # AdMob components
│ │ └── utils/ # Helper functions
│ ├── hooks/ # Global custom hooks
│ ├── constants/ # App-wide constants
│ ├── types/ # TypeScript definitions
│ └── providers/ # React Context providers
├── assets/ # Images, fonts, icons
├── app.json # Expo configuration
├── package.json
└── tsconfig.json

text

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Android Studio / Xcode for emulators

