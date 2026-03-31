CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','propietario','cliente') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alojamientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  propietario_id INT NULL,
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(180),
  ciudad VARCHAR(120),
  pais VARCHAR(120),
  precio_noche DECIMAL(10,2) NOT NULL,
  capacidad INT NOT NULL,
  estado ENUM('disponible','ocupado','mantenimiento') DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS imagenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alojamiento_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alojamiento_id) REFERENCES alojamientos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alojamiento_id INT NOT NULL,
  usuario_id INT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  huespedes INT DEFAULT 1,
  estado ENUM('pendiente','confirmada','pagada','cancelada') DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alojamiento_id) REFERENCES alojamientos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reserva_id INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo ENUM('tarjeta','transferencia','efectivo','paypal') NOT NULL,
  referencia VARCHAR(160),
  estado ENUM('aprobado','pendiente','rechazado') DEFAULT 'aprobado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alojamiento_id INT NOT NULL,
  usuario_id INT NULL,
  rating INT NOT NULL,
  comentario TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (alojamiento_id) REFERENCES alojamientos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
