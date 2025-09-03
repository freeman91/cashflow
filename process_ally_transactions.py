#!/usr/bin/env python3
"""
Script to process ally-transactions.csv and create a modified version
with proper formatting for cashflow expenses.
"""

import csv
import re
from datetime import datetime
from pathlib import Path


def to_pascal_case(text):
    """Convert text to Pascal case (first letter of each word capitalized)"""
    if not text:
        return ""

    # Split by common separators and capitalize each word
    words = re.split(r"[\s\-_]+", text.strip())
    return " ".join(word.capitalize() for word in words if word)


def extract_location_and_city(merchant):
    """Extract location and city from merchant name if it contains ' - LOCATION GR' pattern"""
    if " - " in merchant and merchant.endswith(" GR"):
        parts = merchant.split(" - ")
        if len(parts) == 2:
            merchant_name = parts[0]
            location_city = parts[1]  # Keep 'GR' in the location_city
            return merchant_name, location_city
    return merchant, ""


def get_category_subcategory(
    merchant_category, existing_category, existing_subcategory
):
    """Determine category and subcategory based on merchant category"""
    if existing_category and existing_subcategory:
        return existing_category, existing_subcategory

    if merchant_category == "Supermarkets":
        return "food", "grocery"
    elif merchant_category == "Restaurants":
        return "food", ""

    return existing_category, existing_subcategory


def process_ally_transactions(input_file, output_file):
    """Process the ally transactions CSV file"""

    processed_rows = []

    with open(input_file, "r", encoding="utf-8") as infile:
        reader = csv.reader(infile)

        for row_num, row in enumerate(reader, 1):
            if len(row) < 4:
                print(f"Warning: Row {row_num} has insufficient columns: {row}")
                continue

            # Parse the row
            date_str = row[0].strip()
            merchant = row[1].strip()
            amount = row[2].strip()
            merchant_category = row[3].strip()
            existing_category = row[4].strip() if len(row) > 4 else ""
            existing_subcategory = row[5].strip() if len(row) > 5 else ""

            # Process date - convert to datetime object (12:00 noon)
            try:
                date_obj = datetime.strptime(date_str, "%m/%d/%Y")
                date_obj = date_obj.replace(hour=12, minute=0, second=0, microsecond=0)
                formatted_date = date_obj.strftime("%Y-%m-%d %H:%M:%S")
            except ValueError as e:
                print(
                    f"Warning: Invalid date format in row {row_num}: {date_str} - {e}"
                )
                formatted_date = date_str

            # Extract location and city if present first
            merchant_name, location_city = extract_location_and_city(merchant)

            # Process merchant name - convert to Pascal case if all caps, but preserve 'GR' in location
            if merchant_name.isupper():
                merchant_name = to_pascal_case(merchant_name)

            # If there's a location, format it properly (convert to Pascal case but keep 'GR')
            if location_city:
                # Split location_city to separate the city from 'GR'
                if location_city.endswith(" GR"):
                    city_part = location_city[:-3]  # Remove ' GR'
                    if city_part.isupper():
                        city_part = to_pascal_case(city_part)
                    location_city = f"{city_part} GR"
                else:
                    if location_city.isupper():
                        location_city = to_pascal_case(location_city)

                # Combine merchant name with location for the final merchant name
                final_merchant_name = f"{merchant_name} - {location_city}"
                description = location_city
            else:
                final_merchant_name = merchant_name
                description = ""

            # Determine category and subcategory
            category, subcategory = get_category_subcategory(
                merchant_category, existing_category, existing_subcategory
            )

            # Create new row with all columns
            new_row = [
                formatted_date,  # Column 1: Date (formatted)
                merchant_name,  # Column 2: Merchant name only (Pascal case)
                amount,  # Column 3: Amount (no change)
                merchant_category,  # Column 4: Merchant category (no change)
                category,  # Column 5: Category
                subcategory,  # Column 6: Subcategory
                description,  # Column 7: Description (location/city)
            ]

            processed_rows.append(new_row)

    # Write processed data to new file
    with open(output_file, "w", newline="", encoding="utf-8") as outfile:
        writer = csv.writer(outfile)

        # Write header
        header = [
            "Date",
            "Merchant",
            "Amount",
            "MerchantCategory",
            "Category",
            "Subcategory",
            "Description",
        ]
        writer.writerow(header)

        # Write data rows
        writer.writerows(processed_rows)

    print(f"Processed {len(processed_rows)} transactions")
    print(f"Output saved to: {output_file}")


def main():
    """Main function to run the script"""
    input_file = "ally-transactions.csv"

    # Check if input file exists
    if not Path(input_file).exists():
        print(f"Error: Input file '{input_file}' not found!")
        return

    # Find next version number
    base_name = "ally-transactions-processed"
    version = 1

    while True:
        output_file = f"{base_name}-v{version}.csv"
        if not Path(output_file).exists():
            break
        version += 1

    print(f"Processing {input_file}...")
    print(f"Output will be saved to: {output_file}")

    try:
        process_ally_transactions(input_file, output_file)
        print("Processing completed successfully!")
    except Exception as e:
        print(f"Error processing file: {e}")


if __name__ == "__main__":
    main()
