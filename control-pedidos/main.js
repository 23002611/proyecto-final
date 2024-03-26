const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const mysql = require('mysql');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('login.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

function createConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password', 
        database: 'control_pedidos' 
    });
}

// Autenticación de empleado
ipcMain.on('login', (event, id_empleado, contraseña) => {
    const connection = createConnection();
    connection.connect();

    const query = `SELECT * FROM empleados WHERE id_empleado = ? AND contraseña = ?`;

    connection.query(query, [id_empleado, contraseña], (error, results) => {
        if (error) {
            event.reply('login-response', { success: false, message: 'Error en la base de datos' });
        } else {
            if (results.length > 0) {
                event.reply('login-response', { success: true, empleado: results[0] });
            } else {
                event.reply('login-response', { success: false, message: 'Credenciales incorrectas' });
            }
        }
    });

    connection.end();
});

// Obtener lista de productos
ipcMain.on('get-products', (event) => {
    const connection = createConnection();
    connection.connect();

    const query = `SELECT * FROM productos`;

    connection.query(query, (error, results) => {
        if (error) {
            event.reply('get-products-response', { success: false, message: 'Error en la base de datos' });
        } else {
            event.reply('get-products-response', { success: true, productos: results });
        }
    });

    connection.end();
});

ipcMain.on('pedido', (event, pedidoInfo) => {
    const connection = createConnection();
    connection.connect();

    const { id_producto, nombre_producto, proveedor, cantidad } = pedidoInfo;

    const query = `INSERT INTO pedidos (id_producto, nombre_producto, proveedor, cantidad) VALUES (?, ?, ?, ?)`;
    
    connection.query(query, [id_producto, nombre_producto, proveedor, cantidad], function (error, results) {
        if (error) {
            console.error('Error al insertar pedido:', error);
            event.reply('pedido-error', error.message);
        } else {
            console.log('Pedido insertado correctamente');
            event.reply('pedido-confirmado');
        }
    });

    connection.end();
});
