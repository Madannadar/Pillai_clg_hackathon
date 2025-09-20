import pandas as pd
import json

def find_image_by_coordinates(file_path, lat, lon, year):
    """
    Finds the first image in a metadata CSV that contains the given coordinates
    and matches the year.
    """
    try:
        # Load the metadata file into a pandas DataFrame
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return

    found_match = False
    
    # Iterate through each row of the DataFrame
    for index, row in df.iterrows():
        try:
            # Check if the year matches
            if int(row['year']) == year:
                # The 'bounds' column is a string representation of a list.
                # Use json.loads to convert it to a Python list.
                bounds = json.loads(row['bounds'])
                
                # The bounds format is [[[min_lon, min_lat], [max_lon, min_lat], ...]]
                # We need to extract the min/max coordinates
                min_lon, min_lat = bounds[0][0]
                max_lon, max_lat = bounds[0][2]
                
                # Check if the provided coordinates fall within the bounds
                if min_lon <= lon <= max_lon and min_lat <= lat <= max_lat:
                    print("--- Match Found! ---")
                    print(f"File Name: NDVI/{row['file_name']}")
                    print(f"NDVI File Name: {row['ndvi_file_name']}")
                    print(f"Location: {row['location']}")
                    print(f"Year: {row['year']}")
                    print(f"Row: {row['row']}")
                    print(f"Column: {row['col']}")
                    print(f"Bounds: {row['bounds']}")
                    print("--------------------")
                    found_match = True
                    # Stop after the first match is found
                    break
        except (ValueError, KeyError, IndexError, json.JSONDecodeError) as e:
            # Skip rows with invalid or missing data
            print(f"Warning: Skipping row {index} due to invalid data. Error: {e}")
            continue

    if not found_match:
        print(f"No image found for coordinates ({lat}, {lon}) in year {year}.")


if __name__ == "__main__":
    locations = {
        "Panvel": (18 + 56/60 + 34/3600, 73 + 8/60 + 25/3600),
        "Kalyan": (19 + 12/60 + 54/3600, 73 + 10/60 + 57/3600),
        "Thane": (19 + 13/60 + 9/3600, 72 + 54/60 + 47/3600),
        "Tirunveli": (8 + 42/60 + 52/3600, 77 + 45/60 + 55/3600),
        "Vilupuram": (11 + 56/60 + 22/3600, 79 + 29/60 + 12/3600),
        "Thiruvannamalai": (12 + 13/60 + 30/3600, 79 + 4/60 + 32/3600),
        "Mandangad": (18 + 1/60 + 24/3600, 73 + 11/60 + 36/3600)
    }

    # Use the coordinates for Kalyan
    lat_input, lon_input = locations["Kalyan"]
    year_input = 2018 # You can change this to a different year if needed

    find_image_by_coordinates('metadata.csv', lat_input, lon_input, year_input)
