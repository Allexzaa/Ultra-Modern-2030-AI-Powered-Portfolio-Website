<p align="center">
  <img src="images/ai_human_future_4.png" alt="Portfolio Logo" width="220" />
</p>

<h1 align="center">Horizontal Sliding Portfolio — Hover Detail Template</h1>

<p align="center">
  A single-page portfolio component for cloud engineers. Hover a project card to reveal a full-detail panel with a recruiter brief and a technical deep dive.
</p>

---

## Overview

Seven AWS cloud engineering projects presented in a horizontally scrolling gallery. Each card opens a split-view panel:

- **Recruiter Brief** — summary, impact metrics, what I did, role & stack, and an animated floating skills sidebar
- **Technical Deep Dive** — problem setup, interactive architecture flow diagram with clickable service nodes, key decisions accordion with tradeoff analysis, and outcome stats

No frameworks. No build step. Plain HTML, CSS, and vanilla JS.

## Projects

| Project | Stack |
|---|---|
| Automated Data Migration | AWS DMS · Aurora MySQL · CloudWatch · Secrets Manager |
| Secure Microservices | API Gateway · Lambda · Cognito · DynamoDB |
| Scheduling App | S3 Events · Lambda · DynamoDB · Telegram API |
| AI Moderation Agent | Rekognition · Comprehend · Lambda · DynamoDB |
| Order Pipeline | Step Functions · Lambda · SNS · DynamoDB |
| Incident Response | CloudWatch Events · Step Functions · Lambda · SNS |
| AI Customer Support | Bedrock · Lambda · DynamoDB · API Gateway |

## Features

- Horizontal scroll gallery with a custom cursor indicator
- Hover or click a card to open the detail panel
- Toggle between Recruiter Brief and Technical Deep Dive views
- Architecture flow diagram — click any service node for specs and role detail
- Key Decisions accordion with tradeoff explanations
- Floating, collision-resolved skill tag animation
- Outcome stats mirrored in the Technical view

## Usage

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

No dependencies to install.

## Customisation

All project data lives in the `projects` object at the top of `script.js`. Each entry controls every field rendered in both views — title, summary, impact metrics, architecture nodes, decisions, and outcome notes. Swap the image paths in `images/` and update the data to make it your own.

## Stack

- HTML5 · CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES2020)
- Google Fonts: Space Grotesk · JetBrains Mono · Syne
- Material Icons
