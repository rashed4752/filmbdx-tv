import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Anti-sleep mechanism for Render free tier
  // Pings the app every 14 minutes to prevent it from sleeping
  const APP_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  
  // Only start the self-ping if we are on Render (RENDER_EXTERNAL_URL is available)
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`Starting anti-sleep ping for ${APP_URL}`);
    setInterval(() => {
      https.get(APP_URL, (res) => {
        console.log(`Anti-sleep ping successful. Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('Anti-sleep ping error:', err.message);
      });
    }, 14 * 60 * 1000); // 14 minutes
  }
});
