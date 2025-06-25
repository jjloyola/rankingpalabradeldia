import re
import json
import string
from datetime import datetime

# Define the scoring system
tablaPuntaje = {
    '1': 0,
    '2': 5,
    '3': 4,
    '4': 3,
    '5': 2,
    '6': 1,
    'No logrado': 0,
    'No enviado': -1
}

# Define the players
jugadores = ["Ina", "Vannia", "Marijo", "Javi", "Viole", "Seba", "Fran"]

# Name mapping from WhatsApp names to our player names
name_mapping = {
    "Sebita": "Seba",
    "Francisco": "Fran",
    "Mami": "Vannia"
}

def calcularPuntaje(intento:str):
    puntaje = tablaPuntaje.get(intento, 1)
    return puntaje

def convertir_fecha(fecha_dd_mm_yy):
    """Convert date from DD-MM-YY format to YYYY-MM-DD format"""
    try:
        # Parse the date from DD-MM-YY format
        fecha_obj = datetime.strptime(fecha_dd_mm_yy, '%d-%m-%y')
        # Convert to YYYY-MM-DD format
        return fecha_obj.strftime('%Y-%m-%d')
    except ValueError:
        # If parsing fails, return the original date
        return fecha_dd_mm_yy

def parse_wordle_results(file_path):
    # Initialize the result structure
    results = {jugador: {} for jugador in jugadores}
    
    # Read the WhatsApp export file
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Find all word game results
    # Pattern: [DD-MM-YY, HH:MM:SS] Player: La palabra del dia #XXXX X/6
    pattern = r'\[(\d{2}-\d{2}-\d{2}), \d{2}:\d{2}:\d{2}\] ([^:]+): La palabra del dia #\d+ ([0-9X])/6'
    
    matches = re.findall(pattern, content)
    
    for match in matches:
        date, player, attempt = match
        
        # Convert date format from DD-MM-YY to YYYY-MM-DD
        date = convertir_fecha(date)
        
        # Clean player name (remove extra spaces)
        player = player.strip()
        
        # Map WhatsApp names to our player names
        if player in name_mapping:
            player = name_mapping[player]
        
        # Skip if player is not in our list
        if player not in jugadores:
            continue
        
        # Determine intento value
        if attempt == 'X':
            intento = 'No logrado'
        else:
            intento = attempt
        
        # Calculate points
        puntos = calcularPuntaje(intento)
        
        # Store the result
        results[player][date] = {
            "intento": intento,
            "puntos": puntos
        }
    
    return results

def main():
    # Parse the WhatsApp export file
    results = parse_wordle_results('WspExport.txt')
    
    # Create the final JSON structure
    final_json = {
        "Ina": {},
        "Vannia": {},
        "Marijo": {},
        "Javi": {},
        "Viole": {},
        "Seba": {},
        "Fran": {}
    }
    
    # Fill in the results
    for player in jugadores:
        if player in results:
            final_json[player] = results[player]
    
    # Write to JSON file
    with open('wordle_results.json', 'w', encoding='utf-8') as f:
        json.dump(final_json, f, indent=2, ensure_ascii=False)
    
    print("JSON file 'wordle_results.json' has been created successfully!")
    
    # Print some statistics
    print("\nStatistics:")
    for player in jugadores:
        if player in results:
            total_games = len(results[player])
            total_points = sum(game['puntos'] for game in results[player].values())
            print(f"{player}: {total_games} games, {total_points} total points")

if __name__ == "__main__":
    main()