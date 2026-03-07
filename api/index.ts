import 'dotenv/config'; // Load environment variables
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

console.log('[API] Qiniu Config:', {
  bucket: QINIU_BUCKET,
  domain: QINIU_DOMAIN,
  accessKeySet: !!process.env.QINIU_ACCESS_KEY
});

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

console.log('[API] Supabase Config:', {
  url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 15)}...` : 'MISSING',
  key: SUPABASE_KEY ? 'PRESENT' : 'MISSING'
});

// Create Supabase Client
// Note: If env vars are missing, this will throw an error on first use, which is expected.
const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
    db: { schema: 'public' }
  }) 
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
  console.log('[API] Health check');
  if (!supabase) {
    return res.status(500).json({ status: 'error', message: 'Supabase credentials missing' });
  }
  res.json({ status: 'ok', storage: 'supabase' });
});

// ... existing imports

// Generic Upload Endpoint (Proxy to Qiniu)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log('[API] POST /api/upload');
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    // Sanitize filename to avoid encoding issues
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeFilename}`;
    
    // Upload to Qiniu using Node.js SDK
    const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);
    const putPolicy = new qiniu.rs.PutPolicy({ scope: QINIU_BUCKET });
    const uploadToken = putPolicy.uploadToken(mac);
    
    const config = new qiniu.conf.Config();
    // @ts-ignore
    config.zone = qiniu.zone.Zone_z0;
    
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    
    await new Promise((resolve, reject) => {
      formUploader.put(uploadToken, key, file.buffer, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        } else if (respInfo.statusCode == 200) {
          resolve(respBody);
        } else {
          reject(new Error(`Qiniu upload failed: ${respInfo.statusCode}`));
        }
      });
    });

    const url = QINIU_DOMAIN.endsWith('/') 
      ? `${QINIU_DOMAIN}${key}` 
      : `${QINIU_DOMAIN}/${key}`;

    res.json({ url });

  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Submission Endpoint (Save Metadata to Supabase)
app.post('/api/submissions', async (req, res) => {
  console.log('[API] POST /api/submissions');
  try {
    if (!supabase) {
      const missing = [];
      if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
      if (!process.env.SUPABASE_KEY) missing.push('SUPABASE_KEY');
      console.error('[API] Supabase not configured. Missing:', missing);
      return res.status(500).json({ 
        error: 'Database not configured', 
        details: `Missing environment variables: ${missing.join(', ')}`
      });
    }
    // ...


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

// ... existing imports
import { Buffer } from 'buffer';

// ... existing setup

// Helper: Upload JSON to Qiniu (for signed photographers list)
async function uploadJsonToQiniu(key: string, jsonData: any) {
  const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);
  const options = {
    scope: `${QINIU_BUCKET}:${key}`,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);
  
  const config = new qiniu.conf.Config();
  // @ts-ignore
  config.zone = qiniu.zone.Zone_z0; // Default zone, might need adjustment based on bucket region
  
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  
  const buffer = Buffer.from(JSON.stringify(jsonData));
  
  return new Promise((resolve, reject) => {
    formUploader.put(uploadToken, key, buffer, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        reject(respErr);
      } else if (respInfo.statusCode == 200) {
        resolve(respBody);
      } else {
        reject(new Error(`Qiniu upload failed: ${respInfo.statusCode}`));
      }
    });
  });
}

// Application Endpoint (Save Application to Supabase)
app.post('/api/applications', async (req, res) => {
  console.log('[API] POST /api/applications');
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { name, contact, description, portfolio_urls } = req.body;

    if (!name || !contact || !portfolio_urls || !Array.isArray(portfolio_urls)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for duplicates (already approved)
    const { data: existing } = await supabase
      .from('photographer_applications')
      .select('id')
      .eq('contact', contact)
      .eq('status', 'approved')
      .single();

    if (existing) {
      return res.status(400).json({ error: '该联系方式已是签约摄影师，请勿重复申请。' });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('photographer_applications')
      .insert([
        { 
          name, 
          contact, 
          description: description || '', 
          portfolio_urls,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, id: data.id });

  } catch (error: any) {
    console.error('Application Error:', error);
    res.status(500).json({ error: 'Failed to save application', details: error.message });
  }
});

// Admin: List Applications
app.get('/api/applications', async (req, res) => {
  console.log('[API] GET /api/applications');
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });

    const { data, error } = await supabase
      .from('photographer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Admin: Update Application Status
app.put('/api/applications/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Database not configured' });

    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update status
    const { error } = await supabase
      .from('photographer_applications')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    // If approved, update the signed photographers list on Qiniu
    if (status === 'approved') {
      // Fetch all approved photographers
      const { data: approvedList } = await supabase
        .from('photographer_applications')
        .select('name, contact')
        .eq('status', 'approved');
      
      if (approvedList) {
        try {
          await uploadJsonToQiniu('static/signed_photographers.json', approvedList);
          console.log('[API] Updated signed_photographers.json on Qiniu');
        } catch (uploadErr) {
          console.error('[API] Failed to upload JSON to Qiniu:', uploadErr);
          // Don't fail the request, just log it
        }
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Get Qiniu Upload Token
app.get('/api/upload-token', (req, res) => {
  try {
    const token = getUploadToken();
    res.json({ 
      token,
      domain: QINIU_DOMAIN.endsWith('/') ? QINIU_DOMAIN.slice(0, -1) : QINIU_DOMAIN
    });
  } catch (error: any) {
    console.error('Token Error:', error);
    res.status(500).json({ error: 'Failed to generate upload token' });
  }
});

// Admin: List Submissions
app.get('/api/submissions', async (req, res) => {
  console.log('[API] GET /api/submissions');
  try {
    if (!supabase) {
      const missing = [];
      if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
      if (!process.env.SUPABASE_KEY) missing.push('SUPABASE_KEY');
      console.error('[API] Supabase not configured. Missing:', missing);
      return res.status(500).json({ 
        error: 'Database not configured', 
        details: `Missing environment variables: ${missing.join(', ')}`
      });
    }

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] Supabase error:', error);
      throw error;
    }

    console.log(`[API] Fetched ${data?.length || 0} submissions`);
    res.json(data);
  } catch (error: any) {
    console.error('Database Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch submissions', 
      details: error.message || JSON.stringify(error),
      hint: error.hint || 'Check if the table exists and RLS policies are configured.'
    });
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
