#!/usr/bin/env python3
"""
Script to create Expense instances from the processed ally-transactions CSV.
This script creates Expense objects but doesn't save them to DynamoDB yet.
"""

import csv
import os
from datetime import datetime
from pathlib import Path
from typing import List

from src.services.dynamo.expense import Expense


def parse_csv_date(date_str: str) -> datetime:
    """Parse date string from CSV format 'YYYY-MM-DD HH:MM:SS' to datetime object"""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
    except ValueError as e:
        print(f"Warning: Invalid date format: {date_str} - {e}")
        # Return a default date if parsing fails
        return datetime.now()


def create_expenses_from_csv(csv_file: str, user_id: str) -> List[Expense]:
    """
    Create Expense instances from the processed CSV file

    Args:
        csv_file: Path to the processed CSV file
        user_id: User ID for the expenses

    Returns:
        List of Expense instances (not saved to DB)
    """

    expenses = []

    if not Path(csv_file).exists():
        print(f"Error: CSV file '{csv_file}' not found!")
        return expenses

    with open(csv_file, "r", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)

        for row_num, row in enumerate(reader, 1):
            try:
                # Parse the date
                date_obj = parse_csv_date(row["Date"])

                # Parse the amount
                amount = float(row["Amount"])

                # Get merchant name
                merchant = row["Merchant"].strip()

                # Get category and subcategory
                category = row["Category"].strip() if row["Category"] else ""
                subcategory = row["Subcategory"].strip() if row["Subcategory"] else ""

                # Get description (location/city)
                description = row["Description"].strip() if row["Description"] else None

                # Parse pending status - true if 't' is in the Pending field
                pending = (
                    "t" in row.get("Pending", "").lower()
                    if row.get("Pending")
                    else False
                )

                # Create the expense instance
                expense = Expense(
                    user_id=user_id,
                    expense_id=f"expense:{os.urandom(16).hex()}",  # Generate unique ID
                    date=date_obj,
                    amount=amount,
                    merchant=merchant,
                    category=category,
                    subcategory=subcategory,
                    description=description,
                    pending=pending,
                    payment_from_id="account:543bdb31-a00d-44c2-b255-b9d8bddfa951",
                    recurring_id=None,  # No recurring expenses for now
                )

                # Save the expense to DynamoDB
                try:
                    expense.save()
                    print(f"✓ Saved: {expense.merchant} - ${expense.amount:.2f}")
                except Exception as e:
                    print(f"✗ Failed to save {expense.merchant}: {e}")
                    continue

                expenses.append(expense)

            except (ValueError, KeyError) as e:
                print(f"Warning: Error processing row {row_num}: {e}")
                print(f"Row data: {row}")
                continue

    return expenses


def print_expense_summary(expenses: List[Expense]):
    """Print a summary of the created expenses"""
    if not expenses:
        print("No expenses were created.")
        return

    print(f"\n=== EXPENSE SUMMARY ===")
    print(f"Total expenses: {len(expenses)}")

    # Calculate total amount
    total_amount = sum(expense.amount for expense in expenses)
    print(f"Total amount: ${total_amount:,.2f}")

    # Count pending vs non-pending
    pending_count = sum(1 for expense in expenses if expense.pending)
    non_pending_count = len(expenses) - pending_count
    print(f"Pending: {pending_count}")
    print(f"Non-pending: {non_pending_count}")

    # Group by category
    category_totals = {}
    for expense in expenses:
        cat = expense.category if expense.category else "Uncategorized"
        if cat not in category_totals:
            category_totals[cat] = 0
        category_totals[cat] += expense.amount

    print(f"\n=== BY CATEGORY ===")
    for category, amount in sorted(category_totals.items()):
        print(f"{category}: ${amount:,.2f}")

    # Show first few expenses as examples
    print(f"\n=== SAMPLE EXPENSES ===")
    for i, expense in enumerate(expenses[:5]):
        print(
            f"{i+1}. {expense.date.strftime('%Y-%m-%d')} - {expense.merchant}: ${expense.amount:.2f}"
        )
        if expense.category:
            print(f"   Category: {expense.category}")
        if expense.subcategory:
            print(f"   Subcategory: {expense.subcategory}")
        if expense.description:
            print(f"   Description: {expense.description}")
        print(f"   Pending: {expense.pending}")
        print()


def main():
    """Main function to run the script"""

    # Configuration
    csv_file = "../ally-transactions-processed-v1.csv"  # Relative to aws/ directory
    user_id = "user:3b72aad0-e9b9-4c06-86d8-0fb5ca8f6d47"

    print(f"Creating expenses from: {csv_file}")
    print(f"User ID: {user_id}")

    # Create the expenses
    expenses = create_expenses_from_csv(csv_file, user_id)

    if expenses:
        print(f"Successfully created {len(expenses)} expense instances")
        print_expense_summary(expenses)

        # Show how to access the data
        print("=== ACCESSING EXPENSE DATA ===")
        print("Example - First expense attributes:")
        first_expense = expenses[0]
        print(f"  user_id: {first_expense.user_id}")
        print(f"  date: {first_expense.date}")
        print(f"  amount: {first_expense.amount}")
        print(f"  merchant: {first_expense.merchant}")
        print(f"  category: {first_expense.category}")
        print(f"  subcategory: {first_expense.subcategory}")
        print(f"  description: {first_expense.description}")
        print(f"  pending: {first_expense.pending}")
        print(f"  payment_from_id: {first_expense.payment_from_id}")
        print(f"  recurring_id: {first_expense.recurring_id}")

        print(f"\nSuccessfully saved {len(expenses)} expenses to DynamoDB!")
        print("All expenses have been persisted to the database.")

    else:
        print("No expenses were created. Check the CSV file and try again.")


if __name__ == "__main__":
    main()
