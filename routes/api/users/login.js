const express = require("express");
const Router = require("express").Router;

const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const keys = require("../../config/keys");

// @route POST api/users/login
// @desc Login user / Returning JWT token
// @access Public
module.exports = Router({ mergeParams: true }).post("/users/login", (req, res) => {
  // Ovde ide logika koja iz google tokena vadi email i proverava da li postoji kod nas taj email
  // Ako postoji uzima podatke tog usera i kreira novi token koji koristimo u app
  return res.status(200).json({
    token:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiZjg0MThiMjk2M2YzNjZmNWZlZmRkMTI3YjJjZWUwN2M4ODdlNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTkxMTcwNTMyNTItbnFoZWUwYzJubW92ZHVtbnViNnRlZTYyM2hkZ2tmb28uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxOTExNzA1MzI1Mi1ucWhlZTBjMm5tb3ZkdW1udWI2dGVlNjIzaGRna2Zvby5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMjc0MjY1MDM5MTExNzYyNzI0NiIsImhkIjoiaHRlY2dyb3VwLmNvbSIsImVtYWlsIjoiYWxla3NhbmRhci5wYXZsb3ZpY0BodGVjZ3JvdXAuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJNOW5aZFhielFPQ3VpNV93NWtjc1VBIiwibmFtZSI6IkFsZWtzYW5kYXIgUGF2bG92aWMiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FBdUU3bUMwZXVyV1ROVktqbzFxLTZ1ODFmSHZPQzhCamdPYmhjOUtraVMzPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFsZWtzYW5kYXIiLCJmYW1pbHlfbmFtZSI6IlBhdmxvdmljIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1Njg3MzgzMzYsImV4cCI6MTU2ODc0MTkzNiwianRpIjoiZGNiNTJkOGUwM2E1NmFhODgzMjk0YmZkM2ZmN2UxMDY0ODZhNDg3ZCJ9.ixtjlgj8nAcXTXIukNsZm9IjQtRHW2WZFuYq_TMQ5IywY6oIAcfkjYwqEIAC0VLU5Uy9UJs8dzZYxlEK0BQUyz8R--XAj1VbmADH_eLIQZBy9pTdXfIdRD-JPvbRGtcdgcIeeu0_OwEYe2Xrb2Jia8wOzenqdluRN0clqGJsVp150SQvBZMn7xdLLqGHnuGpuMKMMUXZSPGW9WVQpKrPFkwnYMKvECAw_8L1-i6fAllQBTXpIZoXTtxdigCIMjhEpJy-YtpRXTXMRSfGNHYn9zB4M1WH45H5kwDQnZtOX1Wbs7DKCG5C9jYpBe23GI-wKRBtWwDv6gza_m828ThK_Q"
  });
});
