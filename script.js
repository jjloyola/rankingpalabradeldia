/** IDEAS
 * OK -- Añadir bootstrap
 * OK -- Setear dropdown de fecha a fecha de hoy
 * Setear solo fechas pasadas y actual con "no enviado", el resto es vacío
 * Marcar filas, y separar columnas para seguir mejor el puntaje
 * Poder revisar otros meses
 * Poder revisar puntaje por semana
 * No guardar json como localStorage, sino en un json usando un servidor
 * Filtrar e importar archivo wsp seleccionando fechas específicas
 */


const jugadores = ["Ina", "Vannia", "Marijo", "Javi", "Viole", "Seba", "Fran"];
const diasJunio = Array.from({length: 30}, (_, i) => `2025-06-${String(i+1).padStart(2, '0')}`);
const tabla = {};
jugadores.forEach(j => tabla[j] = {});

const tablaPuntaje = {
  '1': 0,
  '2': 5,
  '3': 4,
  '4': 3,
  '5': 2,
  '6': 1,
  'No logrado': 0,
  'No enviado': -1
};

/** SECCION FORM */
function calcularPuntaje(intento) {
  return tablaPuntaje[intento] ?? 0;
}

function poblarDropdownIntento() {
	const selectIntento = document.getElementById("intento");
	selectIntento.innerHTML = '<option value="default">Seleccionar</option>';

	Object.keys(tablaPuntaje).forEach(key => {
		const option = document.createElement("option");
		option.value = key;
		option.textContent = key;
		selectIntento.appendChild(option);
	});
}

function setTodayDate() {
  const datePicker = document.getElementById("datePicker");
  const today = new Date().toLocaleDateString('en-CA');
  datePicker.value = today;
}

/** SECCION PERSISTENCIA - LOCALSTORAGE */
function guardarDatosEnLocalStorage() {
  try {
    const tablaStringified = JSON.stringify(tabla);
    localStorage.setItem('rankingPalabraDelDia', tablaStringified);
    console.log('Datos guardados en localStorage');
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
    alert('Error al guardar los datos ❗');
  }
}

function cargarDatosDelLocalStorage() {
  try {
    const datosGuardados = localStorage.getItem('rankingPalabraDelDia');

    if(datosGuardados) {
      const datos = JSON.parse(datosGuardados);

      // Actualizar la tabla local con los datos guardados
      Object.keys(datos).forEach(jugador => {
        if (jugadores.includes(jugador)) {
          // Fusiona datos existentes en memoria (tabla local) con los que vienen de localStorage
          //Los datos de datos[jugador] tienen prioridad sobre tabla[jugador]
          tabla[jugador] = { ...tabla[jugador], ...datos[jugador] };
        }
      });
    }
  } catch (error) {
    console.log('Error al cargar datos del localStorage:', error);
  }
}

function inicializarTablaConValoresPorDefecto() {
  jugadores.forEach(jugador => {
    diasJunio.forEach(fecha => {
      if (!tabla[jugador][fecha]) {
        tabla[jugador][fecha] = { intento: 'No enviado', puntos: -1}
      }
    });
  });
}

function actualizarPuntaje() {
	const fecha = document.getElementById("fecha").value;
	const intento = document.getElementById("intento").value;
	const jugador = document.getElementById("jugador").value;

	if (!fecha || intento === "default" || !jugador) {
		alert("Completa todos los campos ❗");
		return;
	}

	const puntos = calcularPuntaje(intento);

  // Actualizar tabla local
	tabla[jugador][fecha] = { intento, puntos };

  // Guardar en localStorage
  guardarDatosEnLocalStorage();

  // Actualizar tabla HTML
	renderTabla();

  // Limpiar formulario
  document.getElementById("intento").value = "default";

  Swal.fire({
    title: "Datos guardados!",
    text: "Datos guardados exitosamente!",
    icon: "success"
  });

  console.log('Datos guardados exitosamente');
}


/** SECCION TABLA */
function renderTabla() {
  // Tabla HTML se renderea en base al objeto local 'tabla'
  const thead = document.getElementById("thead");
  const tbody = document.getElementById("tbody");
  const tfoot = document.getElementById("tfoot");



  thead.innerHTML = `<tr class="text-center"><th class="px-2"></th>` + jugadores.map(j => `<th colspan="2">${j}</th>`).join("") + "</tr>";
  thead.innerHTML += `<tr class="text-center"><th class="px-2">Fecha</th>` + jugadores.map(() => `<th scope="col" class="px-1">Logrado</th><th scope="col"  class="px-3">Puntos</th>`).join("") + "</tr>";

  tbody.innerHTML = diasJunio.map(fecha => {
    const fechaDDMMYY = parsearFechaDDMMYY(fecha);
    let fila = `<tr><th scope="row" class="text-center px-2">${fechaDDMMYY}</td>`;
    jugadores.forEach(j => {
      const intento = tabla[j][fecha]?.intento ?? "";
      const puntos = tabla[j][fecha]?.puntos ?? "";

      // Asignar clase según el intento
      let intentoClass = "text-center px-1";
      if (intento === "No logrado" || intento === "1") intentoClass += " table-warning"; //yellow
      else if (intento === "No enviado") intentoClass += " table-danger"; //red
      else intentoClass += " table-success"; //green

      let puntosClass = "text-center px-3";

      fila += `<td class="${intentoClass}">${intento}</td><td class="${puntosClass}">${puntos}</td>`;
      //fila += `<td class="${intentoClass}">${intento}</td><td class="${puntosClass}">${puntos}</td>`;
    });
    fila += "</tr>";
    return fila;
  }).join("");

  const filaTotal = ["<td>Total</td>"];
  jugadores.forEach(j => {
    let suma = 0;
    diasJunio.forEach(f => {
      const puntos = tabla[j][f]?.puntos;
      if (typeof puntos === "number") suma += puntos;
    });
    filaTotal.push("<td></td><td class='fw-bold text-center'>" + suma + "</td>");
  });
  tfoot.innerHTML = `<tr>${filaTotal.join("")}</tr>`;
}



// Función adicional para exportar datos como JSON
function exportarDatos() {
  const datos = JSON.stringify(tabla, null, 2);
  const blob = new Blob([datos], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ranking-palabra-del-dia.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Función para importar datos desde un archivo JSON
function importarDatos() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const datos = JSON.parse(e.target.result);

        // Actualizar la tabla local con los datos importados
        Object.keys(datos).forEach(jugador => {
          if (jugadores.includes(jugador)) {
            tabla[jugador] = { ...tabla[jugador], ...datos[jugador] };
          }
        });

        // Guardar en localStorage
        guardarDatosEnLocalStorage();
        
        // Actualizar la tabla HTML
        renderTabla();
        
        console.log('Datos importados exitosamente');
        alert('Datos importados correctamente ✅');

      } catch (error) {
        console.error('Error al parsear JSON:', error);
        alert('Error al leer el archivo JSON ❌');
      }
    };

    reader.readAsText(file);
  };

  input.click();
}


// Función para limpiar todos los datos
function limpiarDatos() {
  if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
    localStorage.removeItem('rankingPalabraDelDia');
    jugadores.forEach(j => tabla[j] = {});

    //Inicializar con 'No enviado'
    inicializarTablaConValoresPorDefecto();
    renderTabla();
    console.log('Datos eliminados');
  }
}


setTodayDate();
poblarDropdownIntento();
cargarDatosDelLocalStorage();
inicializarTablaConValoresPorDefecto();
renderTabla();