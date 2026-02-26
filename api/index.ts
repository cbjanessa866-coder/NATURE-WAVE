import express from 'express';
import multer from 'multer';
import qiniu from 'qiniu';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Create Supabase Client
// Note: If env vars are missing, this will throw an error on first use, which is expected.
const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

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

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  if (!supabase) {
    return res.status(500).json({ status: 'error', message: 'Supabase credentials missing' });
  }
  res.json({ status: 'ok', storage: 'supabase' });
});

// Submission Endpoint (Save Metadata to Supabase)
app.post('/api/submissions', upload.none(), async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { name, email, category, description, file_url, file_name } = req.body;

    if (!name || !email || !category || !file_url || !file_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        { 
          name, 
          email, 
          category, 
          description: description || '', 
          file_url, 
          file_name,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ 
      success: true,
      id: data.id,
      url: file_url
    });

  } catch (error: any) {
    console.error('Submission Error:', error);
    res.status(500).json({ error: 'Failed to save submission', details: error.message });
  }
});

// Get Qiniu Upload Token
app.get('/api/upload-token', (req, res) => {
  try {
    const token = getUploadToken();
    res.json({ token });
  } catch (error: any) {
    console.error('Token Error:', error);
    res.status(500).json({ error: 'Failed to generate upload token' });
  }
});

// Admin: List Submissions
app.get('/api/submissions', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Admin: Update Submission Status
app.put('/api/submissions/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

// Export the Express app for Vercel Serverless Function
export default app;
