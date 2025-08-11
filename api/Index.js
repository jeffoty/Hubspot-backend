// api/index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

app.use(express.json());

// helper
const hubspotUrl = (objectType, propertyName = '') =>
  `https://api.hubapi.com/crm/v3/properties/${objectType}${propertyName ? `/${propertyName}` : ''}`;

// CREATE
app.post('/hubspot/:objectType/properties', async (req, res) => {
  const { objectType } = req.params;
  try {
    const resp = await axios.post(hubspotUrl(objectType), req.body, {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` }
    });
    res.status(201).json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// LIST
app.get('/hubspot/:objectType/properties', async (req, res) => {
  const { objectType } = req.params;
  const { archived } = req.query;
  try {
    const resp = await axios.get(hubspotUrl(objectType), {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` },
      params: archived !== undefined ? { archived } : {}
    });
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// GET ONE
app.get('/hubspot/:objectType/properties/:propertyName', async (req, res) => {
  const { objectType, propertyName } = req.params;
  try {
    const resp = await axios.get(hubspotUrl(objectType, propertyName), {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` }
    });
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// UPDATE
app.patch('/hubspot/:objectType/properties/:propertyName', async (req, res) => {
  const { objectType, propertyName } = req.params;
  try {
    const resp = await axios.patch(hubspotUrl(objectType, propertyName), req.body, {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` }
    });
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// DELETE
app.delete('/hubspot/:objectType/properties/:propertyName', async (req, res) => {
  const { objectType, propertyName } = req.params;
  try {
    await axios.delete(hubspotUrl(objectType, propertyName), {
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}` }
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || 'Unknown error' });
  }
});

// IMPORTANT: Export the app. Do NOT app.listen() on Vercel.
module.exports = app;
