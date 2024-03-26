const { ipcRenderer } = require('electron');

const formularioPedido = document.getElementById('formulario-pedido');
formularioPedido.addEventListener('submit', (event) => {
    event.preventDefault();

    const id_producto = document.getElementById('id-producto').value;
    const nombre_producto = document.getElementById('nombre-producto').value;
    const proveedor = document.getElementById('proveedor').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    ipcRenderer.send('pedido', { id_producto, nombre_producto, proveedor, cantidad });
});

ipcRenderer.on('pedido-confirmado', () => {
    alert('Pedido confirmado y guardado en la base de datos');
});

ipcRenderer.on('pedido-error', (event, errorMessage) => {
    alert('Error al guardar el pedido: ' + errorMessage);
});