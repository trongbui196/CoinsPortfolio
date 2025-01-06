# Crypto Portfolio & Trading Mimic App

This project consists of a **backend** (ASP.NET Core) and **frontend** (React with Vite and TailwindCSS). The app provides functionality to display cryptocurrency information fetched from the **Coingecko API**, mimic trading transactions, and manage a portfolio of coins. There are two main user roles: **Customer** and **Admin**.

While the frontend is built using **React**, **Vite**, and **TailwindCSS**.

## Features

- **Customer Features:**
  - View real-time cryptocurrency information (prices, market data, etc.) from the **Coingecko API**. ( can be auto with cron job )
  - Mimic trading transactions (buy/sell virtual coins).
  - Manage a personal portfolio (track coin holdings, transactions, balance, etc.).

- **Admin Features:**
  - Manage customer data and transactions.
  - View and analyze the performance of customer portfolios.

## Technologies Used

- **Backend (API):**
  - **ASP.NET Core** for building the REST API.
  - Docker for containerization and deployment.
  
- **Frontend:**
  - **React** with **Vite** for fast build and development.
  - **TailwindCSS** for styling and responsive design.
  
- **API Integration:**
  - **Coingecko API** for fetching cryptocurrency data (prices, market data, etc.).

- **Deployment:**
  - Backend deployed on **Render** using **Docker**.
  - Frontend deployed using **React**.
      - https://coins-portfolio-cyan.vercel.app/
      - https://adminfecoinport.vercel.app/

## Getting Started

### Prerequisites

To get this project up and running locally, you need the following:

- .NET 6 or later (for the backend)
- Node.js (for the frontend)
- Docker (optional, for running both frontend and backend in containers)

### Backend Setup

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/trongbui196/CoinsPortfolio.git
   
