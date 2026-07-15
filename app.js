// 1. Definimos los artículos indispensables para el bolso de emergencia
const articulosIniciales = [
    { id: "agua", nombre: "Agua embotellada", desc: "Mínimo 2 litros por persona al día." },
    { id: "comida", nombre: "Comida enlatada", desc: "Atún, granos, etc. Que no requieran cocinarse." },
    { id: "linterna", nombre: "Linterna y pilas", desc: "Fundamental para cortes de luz nocturnos." },
    { id: "radio", nombre: "Radio portátil AM/FM", desc: "Para escuchar noticias oficiales sin internet." },
    { id: "botiquin", nombre: "Botiquín de Primeros Auxilios", desc: "Alcohol, gasas, vendas y medicinas básicas." },
    { id: "silbato", nombre: "Silbato de emergencia", desc: "Para pedir ayuda en caso de quedar atrapado." },
    { id: "documentos", nombre: "Copia de documentos", desc: "Cédula, actas de nacimiento en bolsa impermeable." }
];

// 2. Elemento del HTML donde meteremos los artículos
const container = document.getElementById("items-container");

// 3. Función para dibujar los artículos en la pantalla
function renderizarLista() {
    container.innerHTML = ""; // Limpiamos la pantalla

    articulosIniciales.forEach(articulo => {
        // Buscamos si este artículo ya estaba marcado y guardado en el teléfono
        const estaMarcado = localStorage.getItem(articulo.id) === "true";

        // Creamos la tarjeta del artículo
        const card = document.createElement("div");
        card.className = `item-card ${estaMarcado ? 'checked' : ''}`;

        card.innerHTML = `
            <div class="item-info">
                <span class="item-name">${articulo.nombre}</span>
                <span class="item-desc">${articulo.desc}</span>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" id="${articulo.id}" ${estaMarcado ? 'checked' : ''} onchange="guardarEstado('${articulo.id}')">
            </div>
        `;
        container.appendChild(card);
    });
}

// 4. Función para guardar la casilla marcada en el almacenamiento local del teléfono
function guardarEstado(id) {
    const checkbox = document.getElementById(id);
    
    // Guardamos "true" o "false" en el almacenamiento local (LocalStorage)
    localStorage.setItem(id, checkbox.checked);
    
    // Volvemos a renderizar para actualizar el borde verde visual
    renderizarLista();
}

// 5. Iniciamos la app cargando la lista al abrir la página
renderizarLista();

// 6. Mostramos el estado de conexión para saber si estamos offline
const statusLabel = document.querySelector('.subtitle');
function actualizarEstadoConexion() {
    const offline = !navigator.onLine;
    statusLabel.textContent = offline
        ? 'Sin conexión — tus cambios se guardan localmente'
        : 'Conexión disponible — sigue marcando tu mochila';
    statusLabel.style.color = offline ? 'var(--accent-color)' : 'var(--success-color)';
}
window.addEventListener('online', actualizarEstadoConexion);
window.addEventListener('offline', actualizarEstadoConexion);
actualizarEstadoConexion();

// Registrar el Service Worker si el navegador lo permite
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('¡Service Worker registrado con éxito!', reg))
            .catch(err => console.error('Error al registrar el Service Worker', err));
    });
}