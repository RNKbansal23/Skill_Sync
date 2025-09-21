**SkillSync - A Collaborative Project & Skill Showcase Platform**

SkillSync is a full-stack web application designed to bridge the gap between talent and opportunity. It provides a dynamic platform for developers, designers, and creators to showcase their skills, collaborate on projects, and build a credible, data-driven professional reputation.


✨ Key Features
Skill-Centric Profiles: Build a dynamic portfolio where your skills are proven through direct links to the projects and roles you've completed.
Collaborative Opportunity Hub: A central marketplace to discover and apply for projects based on required skills, or to find teammates for hackathons.
Project Management: Create and manage your own projects, defining the roles you need to fill and reviewing applications from other users.
Data-Driven Reputation: Build a trusted professional identity through a unique combination of peer-to-peer ratings and an AI-powered scoring system that analyzes your profile.
PDF Resume Analysis: Upload your resume to automatically parse and suggest skills to add to your profile.
🛠️ Tech Stack
Framework: Next.js (App Router)
Language: TypeScript
Styling: Tailwind CSS
Database ORM: Prisma
Database: MySQL
Authentication: JWT (JSON Web Tokens)
Containerization: Docker


🚀 Getting Started: Running the Project Locally
There are two ways to run this project. The recommended method is using Docker, which is the fastest and most reliable way to get started.
Prerequisites
Docker Desktop installed and running on your system.
A local or remote MySQL database instance.
Method 1: Running with Docker (Recommended)
This method uses the pre-built Docker image from Docker Hub, bypassing all local setup and dependency issues.
1. Clone the Repository (Optional, for reference)
If you want to see the code, you can clone it, but it's not required to run the Docker image.
code
Bash
git clone https://github.com/RNKbansal23/Skill_Sync.git
cd Skill_Sync
2. Ensure Your MySQL Database is Running
Make sure your local MySQL server is active and you know the connection details (username, password, database name).
3. Run the Docker Container
Open your terminal (PowerShell, Command Prompt, or VS Code terminal) and run the following command.
Important: You must provide your database connection details and a JWT secret as environment variables directly in the command.
code
Bash
docker run -d -p 3000:3000 \
  --name skillsync-app \
  -e "DATABASE_URL=mysql://USER:PASSWORD@host.docker.internal:3306/DATABASE_NAME" \
  -e "JWT_SECRET=YOUR_SUPER_SECRET_JWT_STRING" \
  aineshsridhar/synergy-platform:latest
Explanation of the command:
-p 3000:3000: Connects port 3000 of your computer to port 3000 inside the container.
--name skillsync-app: Gives the running container a convenient name.
-e "DATABASE_URL=...": Crucially injects the database URL.
Replace USER, PASSWORD, and DATABASE_NAME with your actual MySQL credentials.
host.docker.internal is a special DNS name that lets the container connect to your host machine's database.
-e "JWT_SECRET=...": Injects a secret key for signing authentication tokens.
aineshsridhar/synergy-platform:latest: The name of the Docker image to download and run.
4. Run Database Migrations
The container is running, but the database is empty. You need to create the tables.
code
Bash
# First, find the ID of your running container
docker ps

# Then, execute the migration command inside the container
docker exec <CONTAINER_ID> npx prisma migrate deploy
(Replace <CONTAINER_ID> with the ID you found from docker ps)
5. Access the Application
Your application is now fully running! Open your browser and navigate to:
http://localhost:3000
Method 2: Running from Source (For Development)
Use this method if you want to make changes to the code.
1. Clone the Repository
code
Bash
git clone https://github.com/RNKbansal23/Skill_Sync.git
cd Skill_Sync
2. Install Dependencies
code
Bash
npm install
3. Set Up Environment Variables
Create a file named .env in the root of the project and add the following variables:
code
Env
# Your local database connection string
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"

# A secret key for JWT
JWT_SECRET="YOUR_SUPER_SECRET_JWT_STRING"
4. Run Database Migrations
This will apply the schema to your local database.
code
Bash
npx prisma migrate dev
5. Start the Development Server
code
Bash
npm run dev
6. Access the Application
Open your browser and navigate to:
http://localhost:3000

**
☁️ Deployment**
This application is fully containerized with Docker, making it highly portable and ready for deployment to any modern cloud platform that supports containers.
The Dockerfile in the repository contains all the instructions for building a production-ready image. This image can be deployed to services like:
AWS App Runner or Amazon ECS
Google Cloud Run
Microsoft Azure Container Apps
A Kubernetes cluster
