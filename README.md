# RESTful Inventory Management System

A robust backend system for managing inventory products and categories, secured with Role-Based Access Control (RBAC).

## 🚀 Features
* **REST API:** Full CRUD operations for Products and Categories.
* **Security:** Secured endpoints using **Spring Security** (JDBC Authentication).
* **RBAC:** * `EMPLOYEE`: Read-only access.
    * `MANAGER`: Add/Update products.
    * `ADMIN`: Delete products.
* **Error Handling:** Global Exception Handling for user-friendly JSON error responses.
* **Database:** MySQL with relational mapping (One-to-Many).

## 🛠️ Tech Stack
* **Core:** Java 21, Spring Boot 3
* **Data:** Spring Data JPA, Hibernate, MySQL
* **Security:** Spring Security (JDBC Auth)
* **Build Tool:** Maven

## 🔒 Security Roles (Credentials)
| Role | Username | Password | Access |
| :--- | :--- | :--- | :--- |
| Employee | `employee1` | `test` | View Products |
| Manager | `manager1` | `test` | Add/Update Products |
| Admin | `admin1` | `test` | Delete Products |

## 🧪 API Endpoints
| Method | Url | Access |
| :--- | :--- | :--- |
| GET | `/api/products` | All Roles |
| POST | `/api/products` | Manager/Admin |
| DELETE | `/api/products/{id}` | Admin Only |
