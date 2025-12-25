# XR18 Mixer - Setup Instructions

## ⚠️ IMPORTANT: Missing File

The main App.jsx file is too large to copy automatically. 
You need to download it separately and place it in the correct location.

## Step 1: Download App.jsx

1. Download the file "xr18-mixer-preview.jsx" from Claude
2. Rename it to "App.jsx"
3. Move it to: `/Users/studio_hub/Desktop/xr18-mixer/src/App.jsx`

OR use this command in Terminal:

```bash
# If you downloaded xr18-mixer-preview.jsx to your Downloads folder:
mv ~/Downloads/xr18-mixer-preview.jsx ~/Desktop/xr18-mixer/src/App.jsx
```

## Step 2: Install Dependencies

Open Terminal and run:

```bash
cd ~/Desktop/xr18-mixer
npm install
```

## Step 3: Test Locally

```bash
npm run dev
```

This will open http://localhost:5173 in your browser

## Step 4: Deploy to GitHub

Follow the instructions in README.md for GitHub Pages deployment

---

## Quick Deploy Commands

```bash
cd ~/Desktop/xr18-mixer
npm install
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/xr18-mixer-matrix.git
git push -u origin main
npm run build
npm run deploy
```

Then enable GitHub Pages in your repo settings (Settings → Pages → Branch: gh-pages)

Your site will be at: https://YOUR-USERNAME.github.io/xr18-mixer-matrix/
