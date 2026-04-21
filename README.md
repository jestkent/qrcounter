# QR Counter

A simple web app that generates QR codes for events and counts scans.

- **In-app scanner**: Scans the QR code and increments the event counter
- **Any other scanner**: Opens the destination URL directly

## Features

- Create events with a name and destination URL
- Generate downloadable QR codes for each event
- Scan QR codes with the built-in camera scanner
- Track scan counts per event
- Manual +1 counter as a fallback
- Data persists in localStorage

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 18 + Vite
- [qrcode](https://www.npmjs.com/package/qrcode) for QR generation
- [html5-qrcode](https://www.npmjs.com/package/html5-qrcode) for camera scanning
- localStorage for persistence

## Deployment

Build and deploy the `dist/` folder to any static hosting:

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: drag and drop `dist/` folder
- **GitHub Pages**: use `vite-plugin-gh-pages` or manually push `dist/`

## Project Structure

```
qr-counter/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── App.css
    ├── components/
    │   ├── Header.jsx
    │   ├── EventList.jsx
    │   ├── CreateEvent.jsx
    │   ├── EventDetail.jsx
    │   ├── Scanner.jsx
    │   ├── ManualEntry.jsx
    │   └── Toast.jsx
    └── utils/
        └── storage.js
```

## License

MIT
