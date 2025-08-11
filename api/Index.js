// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

app.use(express.json());

// Base URL helper
const hubspotUrl = (objectType, propertyName = '') =>
  `https://api.hubapi.com/crm/v3/properties/${objectType}${propertyName ? `/${propertyName}` : ''}`;

// 1. CREATE a new property
app.post('/hubspot/:objectType/properties', async (req, res) => {
  const { objectType } = req.params;
  const definition = req.body; // expect full propertyDefinition JSON

  try {
    const resp = await axios.post(
      hubspotUrl(objectType),
      definition,
      { headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` } }
    );
    res.status(201).json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// 2. LIST all properties (with optional archived query)
app.get('/hubspot/:objectType/properties', async (req, res) => {
  const { objectType } = req.params;
  const { archived } = req.query;

  try {
    const resp = await axios.get(
      hubspotUrl(objectType),
      {
        headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` },
        params: archived !== undefined ? { archived } : {}
      }
    );
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// 3. GET a single property
app.get('/hubspot/:objectType/properties/:propertyName', async (req, res) => {
  const { objectType, propertyName } = req.params;

  try {
    const resp = await axios.get(
      hubspotUrl(objectType, propertyName),
      { headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` } }
    );
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// 4. UPDATE an existing property
app.patch('/hubspot/:objectType/properties/:propertyName', async (req, res) => {
  const { objectType, propertyName } = req.params;
  const updates = req.body; // partial fields to update

  try {
    const resp = await axios.patch(
      hubspotUrl(objectType, propertyName),
      updates,
      { headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` } }
    );
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// 5. DELETE a property
app.delete('/hubspot/:objectType/properties/:propertyName', async (req, res) => {
  const { objectType, propertyName } = req.params;

  try {
    await axios.delete(
      hubspotUrl(objectType, propertyName),
      { headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` } }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

module.exports = app;
