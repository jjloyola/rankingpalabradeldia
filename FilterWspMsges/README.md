# Filtrador de Mensajes de WhatsApp - La Palabra del Día

Este script de Python te ayuda a filtrar mensajes de WhatsApp que contengan menciones a "lapalabradeldía.com" o "palabra del día" desde un archivo de exportación de WhatsApp.

## Características

- 🔍 Busca múltiples patrones relacionados con "la palabra del día"
- 📊 Muestra estadísticas del filtrado
- 💾 Guarda los resultados en un archivo o los muestra en consola
- 🎯 Búsqueda case-insensitive (no distingue mayúsculas/minúsculas)
- 📝 Incluye metadatos en el archivo de salida

## Patrones de búsqueda

El script busca los siguientes patrones:
- `lapalabradeldia.com`
- `palabra del día`
- `palabra del dia`
- `palabradeldia`

## Uso

### Sintaxis básica
```bash
python3 filter_wsp_msges.py <archivo_whatsapp> [archivo_salida]
```

### Ejemplos

1. **Mostrar resultados en consola:**
   ```bash
   python3 filter_wsp_msges.py WspExport.txt
   ```

2. **Guardar resultados en un archivo:**
   ```bash
   python3 filter_wsp_msges.py WspExport.txt mensajes_filtrados.txt
   ```

3. **Usar con archivo de ejemplo:**
   ```bash
   python3 filter_wsp_msges.py WspExport.txt palabra_del_dia_mensajes.txt
   ```

## Salida

### En consola
El script muestra:
- 📊 Estadísticas del filtrado (total de mensajes, coincidencias, porcentaje)
- 📝 Lista numerada de mensajes que coinciden

### En archivo
El archivo de salida incluye:
- Encabezado con fecha y hora del filtrado
- Lista de patrones buscados
- Estadísticas del procesamiento
- Todos los mensajes que coinciden

## Requisitos

- Python 3.x
- No requiere dependencias externas (usa solo módulos estándar)

## Archivos generados

- `mensajes_palabra_del_dia.txt`: Archivo con los mensajes filtrados del ejemplo
- `filter_wsp_msges.py`: Script principal

## Ejemplo de salida

```
🔍 Filtrando mensajes de WhatsApp...
📁 Archivo de entrada: WspExport.txt
💾 Archivo de salida: mensajes_palabra_del_dia.txt

📊 Estadísticas del filtrado:
   Total de mensajes procesados: 4337
   Mensajes que coinciden: 612
   Porcentaje de coincidencias: 14.11%

✅ Mensajes filtrados guardados en: mensajes_palabra_del_dia.txt
```

## Notas

- El script procesa archivos de exportación de WhatsApp en formato estándar
- Los patrones de búsqueda son flexibles y capturan variaciones comunes
- El archivo de entrada debe estar codificado en UTF-8
- Si no se especifica archivo de salida, los resultados se muestran en consola 