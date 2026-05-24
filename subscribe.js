const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, timestamp } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const entry = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      timestamp: timestamp || new Date().toISOString(),
      source: 'nri-401k-planner'
    };

    console.log('New subscriber:', JSON.stringify(entry));

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your report request has been received.',
      entry: { name: entry.name, email: entry.email }
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
