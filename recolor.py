import re
import json
import xml.etree.ElementTree as ET

def load_js_data(file_path):
    with open(file_path, "r") as file:
        data = file.read()
        stations_data = re.search(r'var stations = (\[.*?\]);', data, re.DOTALL).group(1)
        stations_data = re.sub(r'(?<!:)//.*', '', stations_data)  # remove comments
        stations_data = re.sub(r',\s*}', '}', stations_data)  # remove trailing commas
        stations_data = stations_data.replace("'", '"')  # replace single quotes with double quotes
        print(f"Parsed to {stations_data}");
        return json.loads(stations_data)

def update_svg_color(stations):
    for station in stations:
        icon = "/home/alec/projects/SilentDisco/SilentDisco/public/images/" + station["icon"]
        tree = ET.parse(icon)
        root = tree.getroot()
        for element in root.iter('{http://www.w3.org/2000/svg}path'):
            style = element.get('style')
            if style and 'fill' in style:
                style = style.replace(style[style.find('fill'): style.find(';')+1 if style.find(';') != -1 else None], f'fill: {station["icon-color"]}')
                element.set('style', style)
            else:
                element.set('style', f'fill: {station["icon-color"]}')
        tree.write(icon)
        print(f"Updated {icon}")

file_path = '/home/alec/projects/SilentDisco/SilentDisco/public/script.js'
stations = load_js_data(file_path)
update_svg_color(stations)
