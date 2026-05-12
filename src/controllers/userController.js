const db = require("../db/db");

const register = (req, res) => {
  const { nombre, email, password, rol, codigoProfesor } = req.body;

  if (!rol) {
    return res.status(400).json({ message: "El rol es obligatorio" });
  }

  if (rol === "admin") {
    return res.status(403).json({ message: "No permitido crear admin" });
  }

  if (rol !== "alumno" && rol !== "profesor") {
    return res.status(400).json({ message: "Rol inválido" });
  }

  if (rol === "profesor") {
    if (codigoProfesor !== "PROF2026") {
      return res.status(403).json({ message: "Código inválido" });
    }
  }

  
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    
    const query =
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";

    db.query(query, [nombre, email, password, rol], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Usuario creado" });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    res.json(results[0]);
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM usuarios WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results[0]);
  });
};

module.exports = {
  register,
  login,
  getUserById
};