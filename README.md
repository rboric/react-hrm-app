# react-hrm-app

## Abstract

The react-hrm-app is a web application developed using the React framework and Firebase as the underlying database. The objective of this application is to streamline task management within an organization while incorporating essential human resource management (HRM) functionalities. This README provides an overview of the application's features, installation instructions, and usage guidelines.

## Introduction

Effective task management and HRM processes are crucial for the smooth functioning of any organization. The react-hrm-app is designed to provide a comprehensive solution that combines task management with HRM features. This application offers features such as task creation, worker management, payroll information, time off requests, and profile management.

## Features

### Tasks

The react-hrm-app provides a robust task management system that empowers administrators to create, assign, and track tasks within the organization. Administrators have full control over task management, including the ability to create, update, archive, and delete tasks. Basic users, referred to as workers, can actively participate by leaving comments on the tasks assigned to them.

### Task creation
Administrators have the privilege to create tasks by providing a task name and description. They can assign tasks to specific users within the organization and set the importance level of each task. By assigning users to tasks, administrators ensure clear responsibility and accountability.

### Task Update and Archiving
Administrators can update task details such as importance level, description, and name as the project progresses or requirements change. This flexibility allows for effective task management and adaptation to evolving needs. Furthermore, administrators have the ability to archive completed or inactive tasks, maintaining a clean and organized task list.

### Task Deletion
Administrators possess the authority to delete tasks if they determine that a task is no longer relevant or necessary. Deleting a task ensures that it is permanently removed from the system and no longer visible to users.

### Worker Participation
Workers, as basic users of the app, can actively engage in task management by leaving comments on assigned tasks. This functionality fosters collaboration, encourages feedback, and facilitates effective communication within the organization. 

By offering these comprehensive task management features, the react-hrm-app empowers administrators to efficiently handle task assignment and tracking, while promoting worker engagement and communication.

### Worker Management

The worker management feature provides a centralized view of all workers associated with the organization. Users can access and update worker profiles, including personal information and contact details. This information is reflected in other app sections, such as the worker list and payroll information.

### Payroll Information

Admin users can submit payroll information for each worker, which is then displayed on their respective profiles. The payroll details include salary, payment frequency, and any additional compensation. This feature provides transparency and accessibility to payroll-related information for both workers and admin users.

### Archived Tasks

The app includes a dedicated section to view archived tasks. Users can access and review completed or inactive tasks, ensuring a historical record of task management activities. 

### Time Off Requests

Workers can submit time off requests through the app, specifying the desired duration and reason for the absence. Admin users can review and manage these requests, grant them or deny them. The time off tab provides an organized overview of current and past requests.

### Profile Management

Users have access to their personal profiles, enabling them to update their information as needed. Changes made to profiles are automatically reflected in the worker list and other relevant sections. This feature empowers users to maintain accurate and up-to-date information for better collaboration and communication.

## Installation

To set up the HRM Task Management App locally, follow these steps:

1. Clone the repository: `git clone <repository_url>`
2. Navigate to the project directory: `cd react-hrm-app`
3. Install the required dependencies: `npm install`
4. Configure Firebase credentials:
   - Create a Firebase project and obtain the necessary credentials (API key, database URL, etc.).
   - Add the Firebase credentials to the app's configuration file (e.g., `src/firebase/config.js`).

## Usage

To start the development server and run the HRM Task Management App, execute the following command:

`npm start`

This will launch the app in your default web browser, allowing you to interact with its features.

## Conclusion

The react-hrm-app provides an integrated solution for task management and HRM processes. By leveraging the capabilities of React and Firebase, the application provides a user-friendly interface and a comprehensive set of essential features.

