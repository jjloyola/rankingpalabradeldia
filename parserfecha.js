function validarAñoCompleto ( añoCompletoStr ) {
    return parseInt(añoCompletoStr) > 2020 && parseInt(añoCompletoStr) < 2030;
}

function validarMes ( mesStr ) {
    return parseInt(mesStr) >=1 && parseInt(mesStr) <= 12; 
}

function validarDia ( diaStr ) {
    return parseInt(diaStr) >=1 && parseInt(diaStr) <= 31;
}

function validarFecha ( diaStr, mesStr, añoCompletoStr ) {
    if ( !validarAñoCompleto(añoCompletoStr) || !validarMes(mesStr) || !validarDia(diaStr) ) {
        console.log('Fecha inválida: ', diaStr, mesStr, añoCompletoStr);
    }

    return true;
}

function validarFormatoFechaYYYYMMAA(fechaYYYYMMAA) {
    // Valida que la fecha tenga el formato YYYY-MM-AA
    if (!fechaYYYYMMAA || typeof fechaYYYYMMAA !== 'string') return false;

    const regex = /^(\d{2})-(\d{2})-(\d{2})$/;
    const match = fechaYYYYMMAA.match(regex);

    console.log('match ', match);
    if (!match) return false;

    const [, año, mes, dia] = match;

    return validarFecha(dia, mes, año);
}


function getAñoCompletoStr ( añoCortoStr ) {
    // Asume que si el año es menor a 50, es 20XX, sino es 19XX
    return parseInt(añoCortoStr) < 50 ? `20${añoCortoStr}` : `19${añoCortoStr}`;
} 


function parsearFechaDDMMYY(fechaYYYYMMDD) {
    // Convierte YYYY-MM-DD a DD-MM-AA para visualización
    if (!fechaYYYYMMDD) return '';

    const partes = fechaYYYYMMDD.split('-');
    if (partes.length !== 3) return fechaYYYYMMDD;

    const añoCorto = partes[0].slice(-2); // Toma solo los últimos 2 dígitos del año
    const mes = partes[1];
    const dia = partes[2];

    if ( !validarFecha(dia, mes, getAñoCompletoStr(añoCorto)) ) {
        console.log('Error en parser de fecha desde YYYYMMDD: ', añoCorto, mes, dia);
        return fechaYYYYMMDD;
    }

    return `${dia}-${mes}-${añoCorto}`;
}

function parsearFechaYYYYMMDD(fechaDDMMYY) {
    // Convierte DD-MM-YY a YYYY-MM-DD
    if (!fechaDDMMYY) return '';
  
    const partes = fechaDDMMYY.split('-');
    if (partes.length !== 3) return fechaDDMMYY;

    const dia = partes[0].padStart(2, '0');
    const mes = partes[1].padStart(2, '0');
    const añoCompleto = getAñoCompletoStr(partes[2]);
    
    if ( !validarFecha(dia, mes, añoCompleto) ) {
        console.log('Error en parser de fecha desde DDMMYY: ', añoCompleto, mes, dia);
        return fechaDDMMYY;
    }

    return `${añoCompleto}-${mes}-${dia}`;
}
