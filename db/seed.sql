USE alojamientos;

INSERT INTO usuarios (nombre, correo, password_hash, rol)
VALUES ('Admin', 'admin@stayconect.com', '$2a$10$kH5gG9QnXvVwT5nB1GqS2uAqJ7Ck6pLh5xqC6sHfRk8nV2XlF9q4K', 'admin');
SET @admin_id = LAST_INSERT_ID();

INSERT INTO usuarios (nombre, correo, password_hash, rol)
VALUES ('Ana', 'ana@stayconect.com', '$2a$10$kH5gG9QnXvVwT5nB1GqS2uAqJ7Ck6pLh5xqC6sHfRk8nV2XlF9q4K', 'propietario');
SET @prop_id = LAST_INSERT_ID();

INSERT INTO usuarios (nombre, correo, password_hash, rol)
VALUES ('Luis', 'luis@stayconect.com', '$2a$10$kH5gG9QnXvVwT5nB1GqS2uAqJ7Ck6pLh5xqC6sHfRk8nV2XlF9q4K', 'cliente');
SET @cliente_id = LAST_INSERT_ID();

INSERT INTO alojamientos
  (propietario_id, titulo, descripcion, direccion, ciudad, pais, precio_noche, capacidad, estado)
VALUES
  (@prop_id, 'Cuarto doble centro', 'Habitacion para dos personas con cama doble.', 'Calle 10 #5-20', 'Bogota', 'Colombia', 120000, 2, 'disponible'),
  (@prop_id, 'Cuarto triple', 'Ideal para grupos pequenos, tres camas.', 'Carrera 7 #20-15', 'Bogota', 'Colombia', 200000, 3, 'disponible'),
  (@prop_id, 'Habitacion familiar', 'Espacio amplio para familias, 5 personas.', 'Avenida 30 #12-90', 'Bogota', 'Colombia', 280000, 5, 'disponible'),
  (@prop_id, 'Suite matrimonial', 'Suite con cama queen y vista exterior.', 'Calle 90 #18-40', 'Bogota', 'Colombia', 220000, 2, 'disponible'),
  (@prop_id, 'Habitacion ejecutiva', 'Ideal para viajes de trabajo, 1 o 2 personas.', 'Calle 72 #15-33', 'Bogota', 'Colombia', 180000, 2, 'disponible'),
  (@prop_id, 'Cuarto economico', 'Opcion accesible para 2 personas.', 'Calle 13 #4-55', 'Bogota', 'Colombia', 100000, 2, 'disponible'),
  (@prop_id, 'Suite familiar', 'Para 6 personas con sala.', 'Carrera 15 #85-22', 'Bogota', 'Colombia', 360000, 6, 'disponible'),
  (@prop_id, 'Habitacion twin', 'Dos camas sencillas, capacidad 2.', 'Calle 26 #68-12', 'Bogota', 'Colombia', 140000, 2, 'disponible'),
  (@prop_id, 'Loft urbano', 'Alojamiento moderno para 3 personas.', 'Carrera 11 #93-10', 'Bogota', 'Colombia', 210000, 3, 'disponible'),
  (@prop_id, 'Suite premium', 'Habitacion premium con amenities completos.', 'Calle 100 #9-45', 'Bogota', 'Colombia', 450000, 2, 'disponible');

SET @alo_1 = (SELECT id FROM alojamientos WHERE titulo = 'Cuarto doble centro' LIMIT 1);
SET @alo_3 = (SELECT id FROM alojamientos WHERE titulo = 'Habitacion familiar' LIMIT 1);

INSERT INTO reservas
  (alojamiento_id, usuario_id, fecha_inicio, fecha_fin, huespedes, estado, total)
VALUES
  (@alo_1, @cliente_id, '2026-04-02', '2026-04-05', 2, 'confirmada', 360000),
  (@alo_3, @cliente_id, '2026-04-10', '2026-04-13', 5, 'pendiente', 840000);

SET @res_1 = (SELECT id FROM reservas WHERE alojamiento_id = @alo_1 ORDER BY id DESC LIMIT 1);

INSERT INTO pagos (reserva_id, monto, metodo, referencia, estado)
VALUES
  (@res_1, 360000, 'tarjeta', 'PAY-0001', 'aprobado');

INSERT INTO resenas (alojamiento_id, usuario_id, rating, comentario)
VALUES
  (@alo_1, @cliente_id, 5, 'Excelente ubicacion y servicio.'),
  (@alo_3, @cliente_id, 4, 'Muy comodo, buena limpieza.');
