const jwt = require("jsonwebtoken");
const db = require("../db/db");

const login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(401).json({ message: "Usuario no existe" });
      }

      const user = result[0];

      if (user.password !== password) {
        return res.status(401).json({ message: "Password incorrecto" });
      }

      
      const token = jwt.sign(
        {
          id: user.id,
          rol: user.rol
        },
        "secreto_super_seguro", 
        { expiresIn: "1h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          rol: user.rol
        }
      });
    }
  );
};

module.exports = { login };