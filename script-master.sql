CREATE DATABASE control_pedidos;

CREATE TABLE empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    numero_identificacion VARCHAR(50),
    contraseña VARCHAR(100)
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    categoria VARCHAR(50),
    existencia INT
);

CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    nombre_producto VARCHAR(100),
    proveedor VARCHAR(100),
    cantidad INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);