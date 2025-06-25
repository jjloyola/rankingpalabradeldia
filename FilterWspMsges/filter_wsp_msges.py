#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para filtrar mensajes de WhatsApp que mencionen 'lapalabradeldía.com' o 'palabra del día'
"""

import re
import sys
from datetime import datetime

def filter_whatsapp_messages(input_file, output_file=None):
    """
    Filtra mensajes de WhatsApp que contengan menciones a 'lapalabradeldía.com' o 'palabra del día'
    
    Args:
        input_file (str): Ruta al archivo de exportación de WhatsApp
        output_file (str, optional): Ruta del archivo de salida. Si no se especifica, 
                                   se imprime en consola
    """
    
    # Patrones para buscar menciones
    patterns = [
        r'lapalabradeldia\.com',
        r'palabradeldia'
    ]
    
    # Compilar patrones para búsqueda case-insensitive
    compiled_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in patterns]
    
    filtered_messages = []
    total_messages = 0
    matched_messages = 0
    
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            for line_num, line in enumerate(file, 1):
                line = line.strip()
                if not line:
                    continue
                
                total_messages += 1
                
                # Verificar si la línea coincide con algún patrón
                for pattern in compiled_patterns:
                    if pattern.search(line):
                        filtered_messages.append(line)
                        matched_messages += 1
                        break  # Solo contar una vez por línea
        
        # Mostrar estadísticas
        print(f"📊 Estadísticas del filtrado:")
        print(f"   Total de mensajes procesados: {total_messages}")
        print(f"   Mensajes que coinciden: {matched_messages}")
        print(f"   Porcentaje de coincidencias: {(matched_messages/total_messages)*100:.2f}%")
        print()
        
        # Guardar o mostrar resultados
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as out_file:
                out_file.write(f"# Mensajes filtrados - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                out_file.write(f"# Patrones buscados: {', '.join(patterns)}\n")
                out_file.write(f"# Total procesados: {total_messages}, Coincidencias: {matched_messages}\n\n")
                
                for message in filtered_messages:
                    out_file.write(f"{message}\n")
            
            print(f"✅ Mensajes filtrados guardados en: {output_file}")
        else:
            print("📝 Mensajes que coinciden:")
            print("=" * 50)
            for i, message in enumerate(filtered_messages, 1):
                print(f"{i:3d}. {message}")
            
            if not filtered_messages:
                print("❌ No se encontraron mensajes que coincidan con los patrones.")
    
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo '{input_file}'")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error al procesar el archivo: {e}")
        sys.exit(1)

def main():
    """Función principal"""
    if len(sys.argv) < 2:
        print("Uso: python filter_wsp_msges.py <archivo_whatsapp> [archivo_salida]")
        print()
        print("Ejemplos:")
        print("  python filter_wsp_msges.py WspExport.txt")
        print("  python filter_wsp_msges.py WspExport.txt mensajes_filtrados.txt")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    print("🔍 Filtrando mensajes de WhatsApp...")
    print(f"📁 Archivo de entrada: {input_file}")
    if output_file:
        print(f"💾 Archivo de salida: {output_file}")
    print()
    
    filter_whatsapp_messages(input_file, output_file)

if __name__ == "__main__":
    main()
