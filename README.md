# 📦 Inventory Management System API

A professional, secure backend REST API designed for managing product inventories. This system features **stateless authentication** using **JWT (JSON Web Tokens)** and enforces **Role-Based Access Control (RBAC)** to differentiate between Employees, Managers, and Admins.

Refactored from a monolithic structure to a clean, layered architecture using **Project Lombok** and **Spring Boot 3**.

## 🚀 Key Features

* **🔐 JWT Authentication:** Secure, stateless login system (No session cookies).
* **🛡️ Role-Based Access Control (RBAC):**
    * `ROLE_EMPLOYEE`: View products only.
    * `ROLE_MANAGER`: Add, Update, and View products.
    * `ROLE_ADMIN`: Full access (including Delete).
* **⚡ CRUD Operations:** Complete Create, Read, Update, Delete functionality.
* **💾 Database:** MySQL with normalized schema and One-to-Many relationships.
* **🧹 Clean Code:** Uses **Lombok** to eliminate boilerplate (Getters/Setters) and follows industry-standard package structure.

## 🛠️ Tech Stack

* **Language:** Java 21
* **Framework:** Spring Boot 3
* **Security:** Spring Security 6, JWT (JJWT)
* **Database:** MySQL, Hibernate/JPA
* **Tools:** Maven, Postman, IntelliJ IDEA

## 🔑 Credentials (For Testing)

Use these credentials to generate a **Bearer Token** at the `/api/auth/login` endpoint.

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Employee** | `employee1` | `test` | Read Only |
| **Manager** | `manager1` | `test` | Read, Create, Update |
| **Admin** | `admin1` | `test` | Full Access (Delete) |

## 🔌 API Endpoints

**Base URL:** `http://localhost:8080/api`

### 1️⃣ Authentication
* **POST** `/auth/login`
    * **Body:** `{"username": "admin1", "password": "test"}`
    * **Response:** Returns a `Bearer Token`.
    * *Copy this token! You need it for all other requests.*

### 2️⃣ Products (Protected)
* **Auth Required:** Select **Bearer Token** in Postman and paste your key.

| Method | Endpoint | Description | Required Role |
| :--- | :--- | :--- | :--- |
| **GET** | `/products` | List all products | Any Role |
| **GET** | `/products/{id}` | Get details of one product | Any Role |
| **POST** | `/products` | Add a new product | Manager, Admin |
| **PUT** | `/products` | Update a product | Manager, Admin |
| **DELETE** | `/products/{id}` | Delete a product | **Admin Only** |

## ⚙️ Setup & Installation

1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/pragyan-tech/inventory-management-system.git]
    ```
2.  **Configure MySQL:**
    * Update `src/main/resources/application.properties` with your MySQL username/password.
3.  **Run the App:**
    * Run `InventoryApplication.java` in IntelliJ.

---
*Developed by Pragyan Oza*
