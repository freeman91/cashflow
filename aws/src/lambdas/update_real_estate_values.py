"""Lambda handler for updating real estate property values using RentCast API"""

import os
from datetime import datetime, timezone
from typing import Optional
from pydash import filter_
import requests

from services.dynamo import Account
from .__util__ import log_action


def get_rentcast_api_key() -> str:
    """Get RentCast API key from environment variables"""
    api_key = os.getenv("RENTCAST_API_KEY")
    if not api_key:
        raise ValueError("RENTCAST_API_KEY environment variable not set")
    return api_key


def get_property_value_from_rentcast(property_address: str) -> Optional[float]:
    """
    Get property value estimate from RentCast API
    Returns the estimated value in USD, or None if not found
    """
    try:
        api_key = get_rentcast_api_key()

        # RentCast API endpoint for value estimates
        property_address_url_encoded = property_address.replace(" ", "%20").replace(
            ",", "%2C"
        )

        url = f"https://api.rentcast.io/v1/avm/value?address={property_address_url_encoded}&propertyType=Single%20Family&compCount=25"
        headers = {"accept": "application/json", "X-Api-Key": api_key}

        print(f"Requesting value estimate for: {property_address}")
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()

        data = response.json()
        # Extract the price estimate from the response
        if "price" in data and data["price"] is not None:
            price = float(data["price"])
            print(f"RentCast estimate: ${price:,.2f}")
            return round(price, 2)
        else:
            print(f"No price estimate found for {property_address}")
            return None

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"Property not found in RentCast database: {property_address}")
        elif e.response.status_code == 401:
            print("RentCast API authentication failed - check API key")
        elif e.response.status_code == 429:
            print("RentCast API rate limit exceeded")
        else:
            print(f"RentCast API error {e.response.status_code}: {str(e)}")
        return None

    except Exception as e:
        print(f"Error getting value from RentCast API: {str(e)}")
        return None


def handler(event, context):
    """
    Lambda handler for updating real estate property values using RentCast API
    Runs weekly to get property value estimates from RentCast API
    """
    try:
        now = datetime.now(timezone.utc)
        updated_count = 0
        error_count = 0

        # Find all accounts with asset_type = 'Real Estate' and a name (property address)
        real_estate_accounts = list(
            filter_(
                Account.scan(),
                lambda account: (
                    account.asset_type == "Real Estate"
                    and account.name
                    and account.active == True
                ),
            )
        )

        if not real_estate_accounts:
            print("No real estate accounts found to update")
            return {"statusCode": 200, "body": "No real estate accounts to update"}

        print(f"Found {len(real_estate_accounts)} real estate accounts to update")

        for account in real_estate_accounts:
            try:
                print(f"Processing account: {account.name}")

                # Get property value estimate from RentCast API using account name as address
                new_value = get_property_value_from_rentcast(account.name)

                if new_value:
                    # Update the account value
                    old_value = account.value
                    account.value = new_value
                    account.last_update = now
                    account.save()

                    print(f"Updated {account.name}: ${old_value} -> ${new_value}")
                    updated_count += 1
                else:
                    print(f"Could not get value estimate for {account.name}")
                    error_count += 1

            except Exception as e:
                print(f"Error processing account {account.name}: {str(e)}")
                error_count += 1
                continue

        message = f"Real estate values updated: {updated_count} successful, {error_count} errors"
        print(message)
        log_action("Update Real Estate Values", message)

        return {
            "statusCode": 200,
            "body": {
                "message": message,
                "updated_count": updated_count,
                "error_count": error_count,
            },
        }

    except Exception as e:
        print(f"Error updating real estate values: {str(e)}")
        log_action("Update Real Estate Values", f"Error: {str(e)}", status="error")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
