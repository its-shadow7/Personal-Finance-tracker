# **Master Project Specification: Advanced Expense Analytics & Financial Dashboard**

## **1\. Project Overview**

**The Product:** A comprehensive, data-driven personal finance dashboard designed for deep financial analytics. It allows users to rigorously track income/expenses across multiple currencies, manage complex custom budgets, generate custom visual reports, and leverage AI for receipt parsing and personalized financial overviews. **Design Direction:** Professional, data-dense, and highly functional. Clean lines, crisp borders, high-contrast typography for readability, and distinct data-visualization color palettes. Inspired by professional SaaS dashboards and data tools. **Target Audience:** Power users, freelancers, and data-driven individuals who want absolute granular control and deep visibility into their financial habits.

## **2\. Tech Stack & Architecture**

* **Framework:** React (Vite recommended) with a scalable component architecture.  
* **Routing:** react-router-dom  
* **Styling:** Tailwind CSS (configured for a crisp, professional SaaS look)  
* **State Management & Persistence:** React Context API synced automatically with `localStorage` (or `localforage` for larger datasets) so all user data, custom categories, and transactions are permanently saved in the browser.  
* **Forms & Validation:** react-hook-form \+ yup  
* **Data Visualization (Charts):** recharts (capable of rendering heavy datasets smoothly)  
* **File Uploads & AI:** react-dropzone (for AI receipt scanning)  
* **Utilities:** axios, date-fns, uuid

  ## **3\. Design System & Tailwind Configuration**

The UI prioritizes information density and clear data visualization. Elements use standard border radii, distinct structural borders, and a professional color scheme.

**Typography:**

* Headings & UI Elements: Inter or Roboto (Standard, highly legible sans-serif)  
* Monospace (for exact financial figures): JetBrains Mono or Fira Code

**Color Tokens (Inject these into tailwind.config.js):**

* primary: \#4F46E5 (Deep Indigo \- for main actions)  
* background: \#F8FAFC (Slate 50 \- for page backgrounds)  
* surface: \#FFFFFF (Pure White \- for data cards)  
* border: \#E2E8F0 (Slate 200 \- for crisp component separation)  
* text-main: \#0F172A (Slate 900\)  
* text-muted: \#64748B (Slate 500\)  
* success: \#10B981 (Emerald \- for Income/Under Budget)  
* danger: \#EF4444 (Red \- for Expense/Over Budget)  
* chart-palette: Array of highly distinct colors (e.g., \#3B82F6, \#F59E0B, \#8B5CF6, \#EC4899) for graph readability.

  ## **4\. Data Models & Global State**

**Transaction Object:**

* id: string  
* title: string  
* amount: number  
* currency: string (e.g., "USD", "INR")  
* category: string  
* type: "income" | "expense"  
* date: Date  
* notes: string

**Custom Budget Object:**

* id: string  
* name: string (e.g., "Weekend Survival", "Total Fixed Costs")  
* includedCategories: string\[\] (Array of categories this budget tracks)  
* targetAmount: number

**Global State Requirements (Context API \+ LocalStorage):**

* **Data Persistence:** Every change in the Context state MUST immediately fire a `useEffect` that stringifies and saves the data to `localStorage`. On initial load, the app must rehydrate state from `localStorage`.  
* **FinanceContext:** Manages transactions, dynamic categories, custom grouped budgets.  
* **CurrencyContext:** Fetches real-time exchange rates (API Key: `106f4157ca056187d5799651`). Base currency selection affects all dashboard charts.

  ## **5\. Core Screens & Routes**

  ### **Route 1: /dashboard (Command Center)**

* **Layout:** High-density grid.  
* **Top Row (Key Metrics):** Total Income, Total Expenses, Net Cash Flow, and AI Financial Overview (a text box where an AI summarizes the month's performance based on the data).  
* **Middle Row (Quick Charts):** Monthly Bar Chart (Income vs Expense side-by-side) and a quick Pie Chart of the top 5 expense categories.  
* **Bottom Row:** Paginated or scrollable data table of the most recent transactions with inline edit/delete buttons.

  ### **Route 2: /transactions (Full Ledger)**

* **Layout:** A powerful data table (similar to a spreadsheet).  
* **Features:** Sortable columns, advanced multi-filter (e.g., "Show me transactions between $50 and $100 in the Food category from last week").  
* **Actions:** Full inline editing and deletion.

  ### **Route 3: /analytics (Advanced Charting & AI)**

This is a dedicated, heavy-duty data visualization page.

* **AI Overview Module:** A generated paragraph analyzing spending anomalies, trend warnings, and budget adherence.  
* **Standard Graph Suite:**  
  * **Monthly Trend (Bar Chart):** Income vs. Expense grouped by month.  
  * **Category Breakdown (Pie Chart):** Distribution of expenses.  
  * **Spending Velocity (Line Graph):** Cumulative spending over the current month compared to the previous month.  
* **Custom Graph Builder:**  
  * UI allowing the user to select the Chart Type (Line, Bar, Pie).  
  * Select X-Axis (e.g., Date, Category).  
  * Select Y-Axis (e.g., Amount, Transaction Count).  
  * Apply Filters (e.g., only show specific categories).

  ### **Route 4: /budgets (Custom Grouped Budgets)**

* Users can create custom budgets that group multiple categories together (e.g., a "Discretionary" budget that tracks the combined total of "Entertainment", "Dining Out", and "Shopping").  
* Visualized with strict progress bars displaying absolute numbers and percentages.

  ## **6\. Feature Focus: Smart Add Expense Modal**

* **AI File Dropzone:** Upload a receipt or file. AI auto-extracts and fills the form.  
* **Form Fields:** Exact Amount, Currency Selector, Custom Date Picker, Category Dropdown, Notes.  
* Must seamlessly convert currencies using the live API and save the exact historical timestamp.

  ## **7\. Implementation Phasing**

*Cursor/AI Prompt: Please execute this project step-by-step. Focus heavily on data persistence and scalable charting. Ask for confirmation before moving to the next phase.*

* **Phase 1: Foundation & Persistence.** Initialize Vite React app. Set up Tailwind CSS for a dense SaaS UI. Build the Context APIs and strictly implement the `localStorage` hydration/saving logic so no data is ever lost. Integrate the Currency API.  
* **Phase 2: Core Ledger & Modals.** Build the Transactions data table with full CRUD capabilities. Build the Add Expense Modal with the custom date picker, multi-currency support, and the AI receipt dropzone stub.  
* **Phase 3: Dashboard & Quick Insights.** Build the main dashboard layout, integrating the key metrics cards and wiring up the AI Overview generation stub.  
* **Phase 4: Advanced Analytics.** Integrate `recharts`. Build the standard suite of graphs (Pie, Line, Monthly Bar).  
* **Phase 5: The Custom Graph Builder.** Implement the logic and UI for users to generate their own custom charts dynamically based on state data.  
* **Phase 6: Custom Budgets & Settings.** Build the system allowing users to group multiple custom categories into specific target budgets.

