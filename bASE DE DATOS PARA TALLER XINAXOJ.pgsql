-- 🏍️ BASE DE DATOS PARA TALLER XINAXOJ

-- 1. Crear tipos enumerados
CREATE TYPE rol_usuario AS ENUM ('admin', 'mecanico');
CREATE TYPE estado_orden AS ENUM ('ingresada', 'en_proceso', 'completada', 'cancelada');
CREATE TYPE tipo_producto AS ENUM ('repuesto', 'herramienta');

-- 2. Crear tablas
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol rol_usuario NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    direccion TEXT,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

CREATE TABLE motocicletas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    año INTEGER,
    placa VARCHAR(20) UNIQUE,
    vin VARCHAR(100),
    kilometraje INTEGER DEFAULT 0,
    color VARCHAR(30)
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo tipo_producto NOT NULL,
    precio_compra DECIMAL(10, 2),
    precio_venta DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 3,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE ordenes_trabajo (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
    motocicleta_id INTEGER REFERENCES motocicletas(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada DATE,
    estado estado_orden DEFAULT 'ingresada',
    problema TEXT NOT NULL,
    diagnostico TEXT,
    observaciones TEXT,
    total DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    duracion_minutos INTEGER,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE servicios_aplicados (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
    servicio_id INTEGER REFERENCES servicios(id),
    cantidad INTEGER DEFAULT 1,
    precio DECIMAL(10, 2),
    observaciones TEXT
);

CREATE TABLE productos_utilizados (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2),
    observaciones TEXT
);

-- 3. Insertar datos iniciales
INSERT INTO usuarios (username, password, rol, nombre) VALUES
('admin', '$2b$10$EjemploHash1234567890ABCDEF', 'admin', 'Dueño Xinaxoj'),
('mecanico', '$2b$10$EjemploHash0987654321ABCD', 'mecanico', 'Mecánico Principal');

INSERT INTO servicios (nombre, descripcion, precio, duracion_minutos) VALUES
('Cambio de aceite', 'Incluye filtro de aceite', 25.00, 30),
('Afinamiento motor', 'Ajuste de carburador y bujías', 40.00, 60),
('Cambio de frenos', 'Pastillas delanteras y traseras', 35.00, 45);

INSERT INTO productos (nombre, descripcion, tipo, precio_compra, precio_venta, stock) VALUES
('Aceite 10W-40', 'Aceite sintético 1L', 'repuesto', 8.50, 15.00, 20),
('Filtro aceite', 'Filtro estándar', 'repuesto', 5.00, 12.00, 15),
('Pastillas freno', 'Juego delantero', 'repuesto', 12.00, 25.00, 10);

-- 4. Crear índices
CREATE INDEX idx_ordenes_estado ON ordenes_trabajo(estado);
CREATE INDEX idx_ordenes_cliente ON ordenes_trabajo(cliente_id);
CREATE INDEX idx_productos_tipo ON productos(tipo);