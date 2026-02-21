#!/usr/bin/env python3
"""Script to run the Cashflow test suite with various options."""

import subprocess
import sys
import argparse


def run_command(cmd):
    """Run a command and return the exit code."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    return result.returncode


def main():
    parser = argparse.ArgumentParser(description="Run Cashflow tests")
    parser.add_argument("--unit", action="store_true", help="Run only unit tests")
    parser.add_argument(
        "--integration", action="store_true", help="Run only integration tests"
    )
    parser.add_argument("--models", action="store_true", help="Run only model tests")
    parser.add_argument(
        "--controllers", action="store_true", help="Run only controller tests"
    )
    parser.add_argument(
        "--coverage", action="store_true", help="Run tests with coverage report"
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Run tests with verbose output"
    )
    parser.add_argument("--file", type=str, help="Run tests for a specific file")
    parser.add_argument(
        "--install-deps", action="store_true", help="Install test dependencies first"
    )

    args = parser.parse_args()

    # Install dependencies if requested
    if args.install_deps:
        print("Installing test dependencies...")
        cmd = ["poetry", "install", "--with", "dev"]
        if run_command(cmd) != 0:
            print("Failed to install dependencies")
            return 1

    # Build pytest command
    cmd = ["pytest"]

    if args.unit:
        cmd.append("tests/unit/")
    elif args.integration:
        cmd.append("tests/integration/")
    elif args.models:
        cmd.append("tests/unit/models/")
    elif args.controllers:
        cmd.append("tests/unit/controllers/")
    elif args.file:
        cmd.append(args.file)
    else:
        cmd.append("tests/")

    if args.coverage:
        cmd.extend(
            ["--cov=aws/src/services", "--cov-report=term-missing", "--cov-report=html"]
        )

    if args.verbose:
        cmd.append("-v")

    # Run the tests
    return run_command(cmd)


if __name__ == "__main__":
    sys.exit(main())
