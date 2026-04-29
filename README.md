# G-Link Portfolio

A modern, interactive portfolio website showcasing my professional experience, projects, and skills as a frontend Engineer.

## 🚀 Features

- **Interactive UI**: Modern, responsive design with interactive background elements
- **Multiple Views**: Different portfolio layouts (Home, Version2) for varied presentation styles
- **Projects Showcase**: Highlighting key projects and technical achievements
- **Dark Mode**: Theme switching capability for enhanced user experience
- **Mobile Simulator**: Interactive components for demonstrating mobile applications
- **Contact Integration**: Built-in contact form with popup functionality

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Deployment**: Firebase Hosting
- **Icons**: Lucide React

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Development

```bash
npm run dev
```

## CMS (Sanity) Setup

This project reads Sanity config from env vars: `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET`.

1. Create local env file by copying `.env.example` to `.env.local`:

```bash
# macOS/Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

2. Start Sanity Studio:

```bash
npm run sanity:dev
```

3. Deploy Studio updates:

```bash
npm run sanity:deploy
```

See the migration playbook in `docs/sanity-migration-playbook.md` for dataset planning.

## 🔨 Build

```bash
npm run build
```

## 🚢 Deployment

This project is configured for deployment to Firebase Hosting:

```bash
npm run build
firebase deploy
```

## 📁 Project Structure

- `/src/pages/` - Main page components (Home, Projects, Version2)
- `/src/components/` - Reusable UI components
- `/src/data/` - JSON data files for jobs, education, and languages
- `/public/` - Static assets

## 📄 License

Personal portfolio project © Julian Diaz
