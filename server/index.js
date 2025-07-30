const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Apify API base URL
const APIFY_API_BASE = 'https://api.apify.com/v2';

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-apify-token'];
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Missing API key', 
      message: 'Please provide your Apify API key in the X-Apify-Token header' 
    });
  }
  req.apiKey = apiKey;
  next();
};

// Get user's actors
app.get('/api/actors', validateApiKey, async (req, res) => {
  try {
    const response = await axios.get(`${APIFY_API_BASE}/acts`, {
      headers: {
        'Authorization': `Bearer ${req.apiKey}`
      },
      params: {
        limit: 100,
        offset: 0
      }
    });

    const actors = response.data.data.items.map(actor => ({
      id: actor.id,
      name: actor.name,
      title: actor.title || actor.name,
      description: actor.description,
      username: actor.username,
      isPublic: actor.isPublic,
      stats: actor.stats
    }));

    res.json({ actors });
  } catch (error) {
    console.error('Error fetching actors:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key', 
        message: 'The provided API key is invalid or expired' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch actors', 
      message: 'Unable to retrieve your actors from Apify' 
    });
  }
});

// Get actor input schema
app.get('/api/actors/:actorId/schema', validateApiKey, async (req, res) => {
  try {
    const { actorId } = req.params;
    
    const response = await axios.get(`${APIFY_API_BASE}/acts/${actorId}`, {
      headers: {
        'Authorization': `Bearer ${req.apiKey}`
      }
    });

    const actor = response.data.data;
    const inputSchema = actor.defaultRunOptions?.build?.inputSchema || {};
    
    res.json({ 
      schema: inputSchema,
      actorInfo: {
        id: actor.id,
        name: actor.name,
        title: actor.title || actor.name,
        description: actor.description
      }
    });
  } catch (error) {
    console.error('Error fetching actor schema:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Actor not found', 
        message: 'The specified actor does not exist or you do not have access to it' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key', 
        message: 'The provided API key is invalid or expired' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch actor schema', 
      message: 'Unable to retrieve the actor schema from Apify' 
    });
  }
});

// Execute actor run
app.post('/api/actors/:actorId/run', validateApiKey, async (req, res) => {
  try {
    const { actorId } = req.params;
    const { input } = req.body;
    
    // Start the actor run
    const runResponse = await axios.post(
      `${APIFY_API_BASE}/acts/${actorId}/runs`,
      input,
      {
        headers: {
          'Authorization': `Bearer ${req.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          waitForFinish: 120 // Wait up to 2 minutes for completion
        }
      }
    );

    const run = runResponse.data.data;
    
    // If the run completed, get the results
    if (run.status === 'SUCCEEDED') {
      try {
        const datasetResponse = await axios.get(
          `${APIFY_API_BASE}/datasets/${run.defaultDatasetId}/items`,
          {
            headers: {
              'Authorization': `Bearer ${req.apiKey}`
            },
            params: {
              format: 'json',
              limit: 100
            }
          }
        );
        
        res.json({
          success: true,
          run: {
            id: run.id,
            status: run.status,
            startedAt: run.startedAt,
            finishedAt: run.finishedAt,
            stats: run.stats
          },
          results: datasetResponse.data
        });
      } catch (dataError) {
        // If we can't get results, still return run info
        res.json({
          success: true,
          run: {
            id: run.id,
            status: run.status,
            startedAt: run.startedAt,
            finishedAt: run.finishedAt,
            stats: run.stats
          },
          results: [],
          message: 'Run completed but results could not be retrieved'
        });
      }
    } else if (run.status === 'FAILED') {
      res.status(400).json({
        success: false,
        error: 'Actor run failed',
        message: 'The actor execution failed. Please check your input parameters.',
        run: {
          id: run.id,
          status: run.status,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt
        }
      });
    } else {
      // Run is still in progress
      res.json({
        success: true,
        run: {
          id: run.id,
          status: run.status,
          startedAt: run.startedAt
        },
        message: 'Actor run started successfully. Check the Apify console for progress.'
      });
    }
    
  } catch (error) {
    console.error('Error executing actor run:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'The provided input does not match the actor schema requirements' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key', 
        message: 'The provided API key is invalid or expired' 
      });
    }
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Actor not found', 
        message: 'The specified actor does not exist or you do not have access to it' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to execute actor', 
      message: 'Unable to start the actor run. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
