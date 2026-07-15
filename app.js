const articulosIniciales = [
    { id: "agua", nombre: "Agua embotellada", desc: "Mínimo 2 litros por persona al día." },
    { id: "comida", nombre: "Comida enlatada", desc: "Atún, granos, etc. Que no requieran cocinarse." },
    { id: "linterna", nombre: "Linterna y pilas", desc: "Fundamental para cortes de luz nocturnos." },
    { id: "radio", nombre: "Radio portátil AM/FM", desc: "Para escuchar noticias oficiales sin internet." },
    { id: "botiquin", nombre: "Botiquín de Primeros Auxilios", desc: "Alcohol, gasas, bandages y medicinas básicas." },
    { id: "silbato", nombre: "Silbato de emergencia", desc: "Para pedir ayuda en caso de quedar atrapado." },
    { id: "documentos", nombre: "Copia de documentos", desc: "Cédula, actas de nacimiento en bolsa impermeable." }
];

const container = document.getElementById("items-container");

// Cambiar de pestaña (Mochila / Compartir)
function cambiarPestaña(pestaña) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    if (pestaña === 'mochila') {
        document.getElementById('sec-mochila').classList.add('active');
        event.currentTarget.classList.add('active');
    } else {
        document.getElementById('sec-compartir').classList.add('active');
        event.currentTarget.classList.add('active');
        generarCodigoQR();
        iniciarEscaner();
    }
}

// Dibujar lista
function renderizarLista() {
    container.innerHTML = "";
    articulosIniciales.forEach(articulo => {
        const estaMarcado = localStorage.getItem(articulo.id) === "true";
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

function guardarEstado(id) {
    const checkbox = document.getElementById(id);
    localStorage.setItem(id, checkbox.checked);
    renderizarLista();
}

// GENERAR EL CÓDIGO QR CON LOS DATOS DE TU MOCHILA
function generarCodigoQR() {
    document.getElementById("qrcode-container").innerHTML = ""; // Limpiar QR anterior
    
    // Creamos una cadena de texto con lo que tenemos marcado
    let datosMochila = "MochilaVO:";
    articulosIniciales.forEach(art => {
        const estado = localStorage.getItem(art.id) === "true" ? "1" : "0";
        datosMochila += `${art.id}=${estado};`;
    });

    // Dibujamos el código QR en la pantalla
    new QRCode(document.getElementById("qrcode-container"), {
        text: datosMochila,
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff"
    });
}

// INICIAR CÁMARA PARA ESCANEAR EL QR DEL FAMILIAR
let html5QrcodeScanner;
function iniciarEscaner() {
    if (html5QrcodeScanner) return; // Evitar iniciar dos veces

    html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render((decodedText) => {
        // Al detectar un código QR...
        if (decodedText.startsWith("MochilaVO:")) {
            html5QrcodeScanner.clear(); // Apagar la cámara
            
            // Procesamos los datos recibidos
            const datos = decodedText.replace("MochilaVO:", "").split(";");
            let resumen = "Mochila de tu familiar:<br><br>";
            
            datos.forEach(par => {
                if(!par) return;
                const [id, estado] = par.split("=");
                const articulo = articulosIniciales.find(a => a.id === id);
                if (articulo) {
                    const tieneArticulo = estado === "1" ? "✅ Sí tiene" : "❌ No tiene";
                    resumen += `• ${articulo.nombre}: <b>${tieneArticulo}</b><br>`;
                }
            });

            document.getElementById("resultado-escaneo").innerHTML = resumen;
        } else {
            document.getElementById("resultado-escaneo").innerText = "Código QR no válido para Venezuela Offline";
        }
    });
}

// Iniciar aplicación
renderizarLista();

// Service Worker (Para que funcione offline)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado.', reg))
            .catch(err => console.error('Error en Service Worker', err));
    });
}
