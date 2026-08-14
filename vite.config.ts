import { defineConfig } from 'vite';
import type { ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingMessage, ServerResponse } from 'http';

interface DailyTraffic {
  date: string;
  visits: number;
}

interface HourlyTraffic {
  hour: string;
  count: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialVisitorStats = {
  totalVisits: 312,
  uniqueVisitors: 184,
  pageViews: {
    home: 240,
    projects: 145,
    details: 64
  },
  referrers: {
    direct: 110,
    github: 95,
    linkedin: 72,
    vercel: 24,
    other: 11
  },
  devices: {
    desktop: 218,
    mobile: 82,
    tablet: 12
  },
  browsers: {
    chrome: 194,
    safari: 62,
    firefox: 32,
    edge: 18,
    other: 6
  },
  dailyTraffic: [
    { date: "2026-08-07", visits: 28 },
    { date: "2026-08-08", visits: 34 },
    { date: "2026-08-09", visits: 41 },
    { date: "2026-08-10", visits: 38 },
    { date: "2026-08-11", visits: 48 },
    { date: "2026-08-12", visits: 62 },
    { date: "2026-08-13", visits: 61 }
  ],
  hourlyTraffic: [
    { hour: "00:00", count: 4 },
    { hour: "02:00", count: 2 },
    { hour: "04:00", count: 1 },
    { hour: "06:00", count: 8 },
    { hour: "08:00", count: 25 },
    { hour: "10:00", count: 48 },
    { hour: "12:00", count: 64 },
    { hour: "14:00", count: 58 },
    { hour: "16:00", count: 42 },
    { hour: "18:00", count: 35 },
    { hour: "20:00", count: 18 },
    { hour: "22:00", count: 7 }
  ]
};

const initialCalendarEvents = [
  {
    id: "1",
    title: "Portfolio Launch 🎉",
    date: "2026-08-01",
    type: "milestone",
    description: "Successfully deployed the new React + Vite portfolio website on Vercel."
  },
  {
    id: "2",
    title: "Vite Server Config",
    date: "2026-08-13",
    type: "task",
    description: "Configure Vite dev server middleware to support REST data APIs locally."
  },
  {
    id: "3",
    title: "Dashboard Complete",
    date: "2026-08-14",
    type: "milestone",
    description: "Launch the full custom administration panel with projects, calendar, and analytics."
  }
];

const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      // 1. Projects API
      if (req.url === '/api/projects') {
        const filePath = path.resolve(__dirname, 'public/data/projects.json');
        if (req.method === 'GET') {
          try {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read projects' }));
          }
          return;
        }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              fs.writeFileSync(filePath, body, 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to write projects' }));
            }
          });
          return;
        }
      }

      // 2. Visitor Stats API
      if (req.url === '/api/visitor-stats') {
        const filePath = path.resolve(__dirname, 'public/data/visitor_stats.json');
        if (req.method === 'GET') {
          try {
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
              fs.writeFileSync(filePath, JSON.stringify(initialVisitorStats, null, 2), 'utf-8');
            }
            const data = fs.readFileSync(filePath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read visitor stats' }));
          }
          return;
        }
      }

      // 3. Track Visit API
      if (req.url === '/api/track-visit' && req.method === 'POST') {
        const filePath = path.resolve(__dirname, 'public/data/visitor_stats.json');
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
              fs.writeFileSync(filePath, JSON.stringify(initialVisitorStats, null, 2), 'utf-8');
            }
            
            const stats = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const payload = JSON.parse(body || '{}');

            stats.totalVisits = (stats.totalVisits || 0) + 1;
            if (payload.isNewUnique) {
              stats.uniqueVisitors = (stats.uniqueVisitors || 0) + 1;
            }

            // Increment page views
            const pathKey = payload.path === '/' ? 'home' : (payload.path?.replace('/', '') || 'home');
            stats.pageViews = stats.pageViews || {};
            stats.pageViews[pathKey] = (stats.pageViews[pathKey] || 0) + 1;

            // Referrer increment
            if (payload.referrer) {
              const referrer = payload.referrer.toLowerCase();
              stats.referrers = stats.referrers || {};
              let refKey = 'other';
              if (referrer.includes('github')) refKey = 'github';
              else if (referrer.includes('linkedin')) refKey = 'linkedin';
              else if (referrer.includes('vercel')) refKey = 'vercel';
              else if (referrer === 'direct') refKey = 'direct';
              
              stats.referrers[refKey] = (stats.referrers[refKey] || 0) + 1;
            }

            // Device & Browser increment
            if (payload.device) {
              stats.devices = stats.devices || {};
              stats.devices[payload.device] = (stats.devices[payload.device] || 0) + 1;
            }
            if (payload.browser) {
              const browser = payload.browser.toLowerCase();
              stats.browsers = stats.browsers || {};
              let browserKey = 'other';
              if (browser.includes('chrome')) browserKey = 'chrome';
              else if (browser.includes('safari')) browserKey = 'safari';
              else if (browser.includes('firefox')) browserKey = 'firefox';
              else if (browser.includes('edge')) browserKey = 'edge';
              
              stats.browsers[browserKey] = (stats.browsers[browserKey] || 0) + 1;
            }

            // Traffic timestamp updates
            const todayStr = new Date().toISOString().slice(0, 10);
            stats.dailyTraffic = stats.dailyTraffic || [];
            const dayObj = stats.dailyTraffic.find((d: DailyTraffic) => d.date === todayStr);
            if (dayObj) {
              dayObj.visits += 1;
            } else {
              stats.dailyTraffic.push({ date: todayStr, visits: 1 });
              if (stats.dailyTraffic.length > 7) stats.dailyTraffic.shift();
            }

            const currentHourStr = new Date().toTimeString().slice(0, 2) + ':00';
            stats.hourlyTraffic = stats.hourlyTraffic || [];
            const hourObj = stats.hourlyTraffic.find((h: HourlyTraffic) => h.hour === currentHourStr);
            if (hourObj) {
              hourObj.count += 1;
            } else {
              stats.hourlyTraffic.push({ hour: currentHourStr, count: 1 });
              if (stats.hourlyTraffic.length > 12) stats.hourlyTraffic.shift();
            }

            fs.writeFileSync(filePath, JSON.stringify(stats, null, 2), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to record visit' }));
          }
        });
        return;
      }

      // 4. Calendar Events API
      if (req.url === '/api/calendar-events') {
        const filePath = path.resolve(__dirname, 'public/data/calendar_events.json');
        if (req.method === 'GET') {
          try {
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(path.dirname(filePath), { recursive: true });
              fs.writeFileSync(filePath, JSON.stringify(initialCalendarEvents, null, 2), 'utf-8');
            }
            const data = fs.readFileSync(filePath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to read calendar events' }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', () => {
            try {
              fs.writeFileSync(filePath, body, 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to write calendar events' }));
            }
          });
          return;
        }
      }

      // 5. Binary File Upload API
      if (req.url?.startsWith('/api/upload') && req.method === 'POST') {
        const urlObj = new URL(req.url, 'http://localhost');
        const filename = urlObj.searchParams.get('name') || `upload-${Date.now()}.png`;
        const chunks: Buffer[] = [];
        
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const buffer = Buffer.concat(chunks);
            const targetPath = path.resolve(__dirname, 'public/images', filename);
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            fs.writeFileSync(targetPath, buffer);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ url: `/images/${filename}` }));
          } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Upload failed' }));
          }
        });
        return;
      }

      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), apiPlugin()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split large dependencies into cacheable chunks
        manualChunks(id: string) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/@mui')) return 'mui';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react-vendor';
          if (id.includes('node_modules/styled-components')) return 'styled';
        },
      },
    },
  },
});
