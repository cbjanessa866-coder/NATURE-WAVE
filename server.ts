import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import qiniu from 'qiniu';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database Setup
const db = new Database('submissions.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Configure Multer (Memory Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json()); // Parse JSON bodies

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Qiniu Configuration (Hardcoded as requested for this session)
  const QINIU_ACCESS_KEY = '1yN6DSDxKnT1e_77znNNo4iWSm04EVsojGLS1LPC';
  const QINIU_SECRET_KEY = 'KSDc3jqQT5PKskvqHX4jjePeokgPuAY73L6AY7Yw';
  const QINIU_BUCKET = 'nature-wave';
  const QINIU_DOMAIN = 'http://taws5nht0.hn-bkt.clouddn.com';

  // Submission Endpoint (Upload + DB Insert)
  app.post('/api/submissions', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const { name, email, category, description } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (!name || !email || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);
      const putPolicy = new qiniu.rs.PutPolicy({ scope: QINIU_BUCKET });
      const uploadToken = putPolicy.uploadToken(mac);
      
      const config = new qiniu.conf.Config();
      // config.zone = qiniu.zone.Zone_z0; // Auto-detect zone
      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();

      // Generate a unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const extension = path.extname(file.originalname);
      const key = `submissions/${timestamp}-${randomString}${extension}`;

      // Upload to Qiniu
      await new Promise((resolve, reject) => {
        formUploader.put(uploadToken, key, file.buffer, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr);
            return;
          }
          if (respInfo.statusCode == 200) {
            resolve(respBody);
          } else {
            reject(new Error(`Qiniu upload failed with status code ${respInfo.statusCode}`));
          }
        });
      });
      
      // Construct the public URL
      const cleanDomain = QINIU_DOMAIN.replace(/\/$/, '');
      const url = `${cleanDomain}/${key}`;

      // Save to Database
      const stmt = db.prepare(`
        INSERT INTO submissions (name, email, category, description, file_url, file_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const info = stmt.run(name, email, category, description || '', url, key);

      res.json({ 
        success: true,
        id: info.lastInsertRowid,
        url: url
      });

    } catch (error: any) {
      console.error('Submission Error:', error);
      res.status(500).json({ error: 'Failed to process submission', details: error.message });
    }
  });

  // Admin: List Submissions
  app.get('/api/submissions', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC');
      const submissions = stmt.all();
      res.json(submissions);
    } catch (error: any) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  });

  // Admin: Update Submission Status
  app.put('/api/submissions/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const stmt = db.prepare('UPDATE submissions SET status = ? WHERE id = ?');
      const info = stmt.run(status, id);

      if (info.changes === 0) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Failed to update submission' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving (if we were building for prod)
    app.use(express.static(path.resolve(__dirname, 'dist')));
    
    // Handle SPA routing for production
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
