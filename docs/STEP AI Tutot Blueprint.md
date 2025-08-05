# **AI Tutor for STEP: Project Blueprint**

## **1\. Project Vision**

To create a scalable, adaptive AI-powered tutor, codenamed **"STEP-Guide,"** designed to support the 12-month "STEP" software training program. The primary goal is to bridge the gap between theoretical (book-based) knowledge and practical, industry-standard application for 18-20 year old diploma graduates in India. The tutor will act as a personal mentor, providing real-time feedback and learning support that evolves with the intern's skills.

## **2\. Core Concept: The "STEP-Guide"**

The STEP-Guide is an adaptive AI mentor integrated into a centralized web dashboard. Its core feature is its ability to change its teaching style and personality to match the intern's progress through the 12-month curriculum. This ensures that the support provided is always relevant, appropriately challenging, and targeted toward fostering independent, real-world problem-solving skills.

## **3\. The Three Phases of Adaptation**

The Guide's personality and feedback mechanism will evolve through three distinct phases, aligning with the curriculum's progression from fundamentals to advanced concepts.

### **Phase 1: The Instructor (Months 1-4)**

* **Focus:** Core fundamentals (JavaScript basics, Deno runtime, Unix commands).  
* **Goal:** Build a strong, correct foundation.  
* **Personality:** Direct, factual, and precise.  
* **Feedback Style:** Provides the correct answer directly and explains the underlying rule or concept. It focuses on syntax, structure, and "what" is correct.

### **Phase 2: The Collaborator (Months 5-9)**

* **Focus:** Building applications (Hono.js, Web Development, CI/CD).  
* **Goal:** Encourage critical thinking and the connection of concepts.  
* **Personality:** A guiding, collaborative partner.  
* **Feedback Style:** Hints at the problem area and asks leading questions to help the intern find the solution themselves. It focuses on best practices and "how" to improve.

### **Phase 3: The Catalyst (Months 10-12)**

* **Focus:** Advanced topics and professional practices (Advanced Java, Agile).  
* **Goal:** Foster independent problem-solving and deep understanding.  
* **Personality:** An inquisitive, Socratic mentor.  
* **Feedback Style:** Asks broad, open-ended questions about the intern's code or approach, forcing them to explain their reasoning and discover flaws independently. It focuses on the "why" behind architectural and strategic decisions.

## **4\. Platform: The "STEP Central" Dashboard**

The primary user interface will be a web-based dashboard that serves as the intern's central learning hub.

* **Guide Chat:** The main interactive component where interns communicate with the STEP-Guide.  
* **Learning Path:** A visual timeline of the 12-month curriculum, showing progress, current focus, and upcoming topics.  
* **Today's Focus:** A daily card that syncs with the in-person training schedule, presenting the day's topic and a relevant "Daily Challenge" from the Guide.  
* **Optional Daily Digest:** Proactive notifications (via Slack, email, etc.) to prompt interns to engage with the dashboard and their daily challenge.

## **5\. Key Feature: The "Guide Chat" Interface**

The chat will be designed for effective learning and code submission.

* **Smart Starters:** Contextual buttons to initiate conversations (e.g., "Explain today's topic," "I'm stuck on the challenge").  
* **Code Block Submitter:** A dedicated \</\> modal for submitting code with syntax highlighting, ensuring clarity.  
* **Interactive Feedback Cards:** The Guide's responses will be structured cards featuring:  
  * Praise and context-setting.  
  * A visual "Diff View" comparing the intern's code with the suggested improvement.  
  * A concise explanation of *why* the change is recommended.  
  * Action buttons for follow-up questions.

## **6\. Key Feature: Progress & Insights Module**

This data-driven module provides value to both interns and instructors by analyzing interaction data.

### **For the Intern: Personalized Skill Profile**

* A private dashboard page visualizing their proficiency across different skills (e.g., via a radar chart).  
* Highlights personal strengths and areas needing review, allowing the Guide to suggest targeted exercises.

### **For the Instructor: Cohort Dashboard**

* A private, aggregated view of the cohort's performance.  
* Identifies common sticking points across the entire group, enabling instructors to tailor in-person sessions to address real-time needs.  
* Provides insights into student engagement and overall curriculum pacing.

# **STEP AI Tutor: Data Models Blueprint**

This document outlines the MongoDB data structures for the STEP AI Tutor platform, designed for a JavaScript Full-Stack implementation (Node.js, Express, MongoDB).

---

## **1\. User Models**

These models represent the human actors in the system.

### **1.1. `Intern`**

- **Collection Name:** `interns`  
- **Purpose:** The primary user of the tutor. Tracks individual progress and current phase.  
- **Schema:**

```json
{
  "fullName": "String",
  "email": "String", // Unique
  "passwordHash": "String",
  "currentPhase": "String", // Enum: 'Instructor', 'Collaborator', 'Catalyst'
  "currentMonth": "Number", // Range: 1-12
  "cohortId": "ObjectId", // Reference to 'cohorts' collection
  "createdAt": "Date"
}
```

### **1.2. `Instructor`**

- **Collection Name:** `instructors`  
- **Purpose:** A teacher or manager who oversees one or more cohorts.  
- **Schema:**

```json
{
  "fullName": "String",
  "email": "String", // Unique
  "passwordHash": "String",
  "createdAt": "Date"
}
```

### **1.3. `Cohort`**

- **Collection Name:** `cohorts`  
- **Purpose:** A group of interns, managed by an instructor, following the same schedule.  
- **Schema:**

```json
{
  "name": "String", // e.g., "STEP Program - 2025 Batch"
  "startDate": "Date",
  "instructorId": "ObjectId", // Reference to 'instructors' collection
  "interns": ["ObjectId"] // Array of references to 'interns' collection
}
```

---

## **2\. Curriculum Models**

These models define the 12-month learning path, allowing for a structured and dynamic curriculum.

### **2.1. `Topic`**

- **Collection Name:** `topics`  
- **Purpose:** The highest-level subject area (e.g., JavaScript, DevOps). Links a set of modules to a specific skill in the `SkillProfile`.  
- **Schema:**

```json
{
  "name": "String", // e.g., "JavaScript"
  "description": "String",
  "skillProfileKey": "String" // e.g., "javaScriptBasics"
}
```

### **2.2. `Module`**

- **Collection Name:** `modules`  
- **Purpose:** A specific unit of study within a Topic, typically lasting a month.  
- **Schema:**

```json
{
  "name": "String", // e.g., "JavaScript Introduction"
  "description": "String",
  "topicId": "ObjectId", // Reference to 'topics' collection
  "targetMonth": "Number" // The month (1-12) this module is taught in
}
```

### **2.3. `Lesson`**

- **Collection Name:** `lessons`  
- **Purpose:** A single day's learning objective and the associated "Daily Challenge".  
- **Schema:**

```json
{
  "name": "String", // e.g., "Variables and Data Types"
  "objective": "String",
  "moduleId": "ObjectId", // Reference to 'modules' collection
  "dayOfMonth": "Number", // The day within the module's month this is taught
  "learningContentUrl": "String", // Path to Markdown file or external resource
  "dailyChallenge": "String",
  "solutionCode": "String" // The ideal solution for the challenge
}
```

---

## **3\. Interaction & Progress Models**

These models store the data generated by intern activity, which is vital for feedback and analytics.

### **3.1. `ChatMessage`**

- **Collection Name:** `chat_messages`  
- **Purpose:** Logs every interaction between an intern and the STEP-Guide for history and analysis.  
- **Schema:**

```json
{
  "internId": "ObjectId", // Reference to 'interns' collection
  "sender": "String", // Enum: 'Intern', 'STEP-Guide'
  "content": "String",
  "codeSubmission": "String", // Optional
  "guidePhaseAtTime": "String", // Records the guide's personality for this message
  "timestamp": "Date"
}
```

### **3.2. `SkillProfile`**

- **Collection Name:** `skill_profiles`  
- **Purpose:** Powers the personalized skills radar chart for each intern. Updated as they complete lessons.  
- **Schema:**

```json
{
  "internId": "ObjectId", // Reference to 'interns' collection
  "skills": {
    "javaScriptBasics": "Number",
    "denoRuntime": "Number",
    "unixCommands": "Number",
    "honoJs": "Number",
    "webDevelopment": "Number",
    "ciCd": "Number",
    "advancedJava": "Number",
    "agileMethodology": "Number"
  },
  "lastUpdated": "Date"
}
```

---

## **4\. AI Configuration Model**

This model makes the AI's personality dynamic and configurable without requiring code changes.

### **4.1. `PromptTemplate`**

- **Collection Name:** `prompt_templates`  
- **Purpose:** Stores LLM prompt templates, allowing for non-technical users to update, version, and manage the AI's responses.  
- **Schema:**

```json
{
  "name": "String", // Unique, e.g., "CodeReview_Phase2_Collaborator"
  "interactionType": "String", // Enum: 'ExplainTopic', 'CodeReview', 'Hint', 'GeneralQuestion'
  "phase": "String", // Enum: 'Instructor', 'Collaborator', 'Catalyst'
  "template": "String", // The full text of the prompt with {placeholders}
  "version": "Number",
  "isActive": "Boolean",
  "notes": "String", // For versioning and change tracking
  "lastUpdated": "Date"
}
```

# **STEP-Guide Project Roadmap**

This roadmap follows an agile, iterative approach, building the app in stages to allow for flexibility and continuous improvement. The main goal is to get a functional version of the app to the interns as soon as possible and then build upon it.

### **Phase 1: Laying the Foundation & Building the Core (The MVP)**

**Goal:** To launch a Minimum Viable Product (MVP) with the essential features for the "Instructor" phase of the AI tutor. This will allow a pilot group of interns to start using the app and provide valuable feedback.

**Key Features to Build:**

* **User Authentication:** Secure login for interns and instructors.  
* **STEP Central Dashboard:** The basic structure of the web dashboard.  
* **Visual Learning Path:** A simple, non-interactive timeline of the 12-month curriculum.  
* **"Today's Focus" Card:** Displaying the daily topic and challenge.  
* **Guide Chat (Instructor Mode):** The core chat interface where interns can interact with the "Instructor" AI. This includes:  
  * Smart Starters to initiate conversations.  
  * The code block submitter.  
  * Basic feedback from the AI (providing the correct answer and explanation).  
* **Backend Setup:** The necessary databases and APIs to support these features.

### **Phase 2: Enhancing Collaboration & Engagement**

**Goal:** To introduce the "Collaborator" AI persona and enrich the learning experience with more interactive features.

**Key Features to Build:**

* **"Collaborator" AI Personality:** Develop the AI's ability to provide hints and ask leading questions.  
* **Interactive Feedback Cards:** Implement the "Diff View" to visually compare code and provide more detailed explanations.  
* **Interactive Learning Path:** Allow users to click on topics in the learning path to see more details.  
* **Optional Daily Digest:** Set up email or Slack notifications for the "Daily Challenge."

### **Phase 3: Fostering Independence & Gaining Insights**

**Goal:** To roll out the "Catalyst" AI persona and the powerful "Progress & Insights Module."

**Key Features to Build:**

* **"Catalyst" AI Personality:** Train the AI to ask open-ended, Socratic questions.  
* **Personalized Skill Profile:** The intern-facing dashboard with the skills radar chart.  
* **Cohort Dashboard:** The instructor-facing view with aggregated performance data.  
* **AI-Powered Exercise Suggestions:** The guide will start suggesting targeted exercises based on the intern's skill profile.

### **Phase 4: Full Launch, Scaling, and Future Growth**

**Goal:** To launch the complete "STEP-Guide" to all interns, ensure the platform is stable and scalable, and plan for future enhancements.

**Key Activities:**

* **Final Testing and Deployment:** Rigorous testing of all features and a smooth rollout to all users.  
* **Scalability and Performance Optimization:** Ensuring the app can handle all users without performance issues.  
* **Gathering User Feedback:** Actively collecting feedback from both interns and instructors to identify areas for improvement.  
* **Roadmap for V2:** Begin planning the next set of features, which could include:  
  * More advanced analytics for instructors.  
  * Integration with other learning tools.  
  * Gamification elements to boost engagement.  
  * A mobile-friendly version of the dashboard.

