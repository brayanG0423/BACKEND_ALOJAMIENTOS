import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

export const requireRole = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: "Sin permisos" });
    }
    next();
  };
};
