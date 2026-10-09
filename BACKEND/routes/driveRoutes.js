const express = require('express');
const { getAuthUrl, saveToken, getDriveClient, syncUsersToDrive } = require('../services/googleDriveService');
const router = express.Router();

router.get('/auth', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code provided');
  }
  try {
    await saveToken(code);
    await syncUsersToDrive(); // Initial sync
    res.send('Google Drive Authorization Successful! You can close this window.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Authentication failed');
  }
});

router.get('/status', (req, res) => {
  const driveClient = getDriveClient();
  if (driveClient) {
    res.json({ status: 'connected' });
  } else {
    res.json({ status: 'disconnected', authUrl: getAuthUrl() });
  }
});

module.exports = router;
