# XR18 Mixer Matrix

A web-based routing matrix and documentation tool for the Behringer XR18 digital mixer. Create, save, and export mixer configurations as native `.scn` scene files.

## Features

- **18 Channel Configuration** - Name, source, phantom power, low cut, gate, compressor, EQ, pan, fader
- **Aux Bus Routing** - 6 aux buses with full send matrix
- **FX Slots** - 4 FX slots with all XR18 effect types
- **Mute Groups** - 6 mute groups with channel assignments
- **History/Snapshots** - Save and recall multiple configurations
- **Export to .scn** - Native X AIR scene file format for direct mixer import
- **Persistent Storage** - Settings auto-save to browser localStorage

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deploy to GitHub Pages

### First Time Setup

1. Create a new repository on GitHub (e.g., `xr18-mixer-matrix`)

2. Update `vite.config.js` base path to match your repo name:
   ```js
   base: '/your-repo-name/',
   ```

3. Initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/xr18-mixer-matrix.git
   git push -u origin main
   ```

4. Deploy to GitHub Pages:
   ```bash
   npm run build
   npm run deploy
   ```

5. Enable GitHub Pages in your repo settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

Your site will be live at: `https://YOUR-USERNAME.github.io/xr18-mixer-matrix/`

### Subsequent Deploys

```bash
npm run build
npm run deploy
```

## Usage

1. Fill in channel names and settings
2. Configure aux routing, FX, and mute groups
3. Save snapshots to history for different venues/bands
4. Export `.scn` file and load into X AIR Edit or copy to mixer SD card

## License

MIT
