"""
$ poetry run python -i aws/main.py --script [name]
"""

import os
import argparse
from collections import namedtuple
import importlib
import subprocess
from dotenv import load_dotenv

load_dotenv()


def print_env_vars():
    variable_names = [
        "REACT_APP_API_URL",
        "HOST",
        "PORT",
        "AWS_PROFILE",
        "APP_ID",
        "ENV",
        "REGION",
    ]

    for name in variable_names:
        print(f"{name}: {os.environ[name]}")


def parse_arguments():
    """Parse command line arguments"""

    Args = namedtuple("Args", ["script"])

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--script",
        help="",
        type=str,
        default=None,
    )

    args = parser.parse_args()
    return Args(args.script)


def main():
    print_env_vars()

    args = parse_arguments()

    if args.script in ("run_api", "deploy"):
        importlib.import_module(args.script).main()

    if args.script == "workbench":
        subprocess.call(["python", "-i", "aws/workbench.py"])


if __name__ == "__main__":
    main()
