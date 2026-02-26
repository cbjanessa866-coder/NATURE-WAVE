import express from 'express';
import multer from 'multer';
import qiniu from 'qiniu';
import path from 'path';
import axios from 'axios';

const app = express();

// Configure Multer (Memory Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Qiniu Configuration
const QINIU_ACCESS_KEY = process.env.QINIU_ACCESS_KEY || '1yN6DSDxKnT1e_77znNNo4iWSm04EVsojGLS1LPC';
const QINIU_SECRET_KEY = process.env.QINIU_SECRET_KEY || 'KSDc3jqQT5PKskvqHX4jjePeokgPuAY73L6AY7Yw';
const QINIU_BUCKET = process.env.QINIU_BUCKET || 'nature-wave';
const QINIU_DOMAIN = process.env.QINIU_DOMAIN || 'http://taws5nht0.hn-bkt.clouddn.com';
const DB_FILE_KEY = 'database/submissions.json';

// Helper: Get Qiniu Upload Token
function getUploadToken(key: string | null = null) {
  const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);
  const options = {
    scope: key ? `${QINIU_BUCKET}:${key}` : QINIU_BUCKET,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
}

// Helper: Upload Buffer to Qiniu
function uploadBufferToQiniu(buffer: Buffer, key: string) {
  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const uploadToken = getUploadToken(key); // Use key for overwrite scope

    formUploader.put(uploadToken, key, buffer, putExtra, (respErr, respBody, respInfo) => {
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
}

// Helper: Fetch DB (JSON) from Qiniu
async function fetchDatabase() {
  const url = `${QINIU_DOMAIN}/${DB_FILE_KEY}?t=${Date.now()}`;
  try {
    const response = await axios.get(url);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return []; // File doesn't exist yet, return empty array
    }
    console.error('Failed to fetch database:', error.message);
    return []; // Return empty on error to avoid crash, though risky
  }
}

// Helper: Save DB (JSON) to Qiniu
async function saveDatabase(data: any[]) {
  const jsonString = JSON.stringify(data, null, 2);
  const buffer = Buffer.from(jsonString, 'utf-8');
  await uploadBufferToQiniu(buffer, DB_FILE_KEY);
}

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', storage: 'qiniu-json' });
});

// Submission Endpoint (Upload + JSON DB Update)
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

    // 1. Upload File to Qiniu
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(file.originalname);
    const key = `submissions/${timestamp}-${randomString}${extension}`;
    
    await uploadBufferToQiniu(file.buffer, key);
    
    const cleanDomain = QINIU_DOMAIN.replace(/\/$/, '');
    const url = `${cleanDomain}/${key}`;

    // 2. Update JSON Database on Qiniu
    const submissions = await fetchDatabase();
    
    const newSubmission = {
      id: Date.now(), // Simple ID generation
      name,
      email,
      category,
      description: description || '',
      file_url: url,
      file_name: key,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    submissions.unshift(newSubmission); // Add to beginning
    await saveDatabase(submissions);

    res.json({ 
      success: true,
      id: newSubmission.id,
      url: url
    });

  } catch (error: any) {
    console.error('Submission Error:', error);
    res.status(500).json({ error: 'Failed to process submission', details: error.message });
  }
});

// Admin: List Submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await fetchDatabase();
    res.json(submissions);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Admin: Update Submission Status
app.put('/api/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const submissions = await fetchDatabase();
    const index = submissions.findIndex((sub: any) => sub.id == id);

    if (index === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submissions[index].status = status;
    await saveDatabase(submissions);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Export the Express app for Vercel Serverless Function
export default app;
