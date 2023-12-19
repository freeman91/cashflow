# pylint:disable=unused-import, wildcard-import, unused-wildcard-import, import-outside-toplevel, redefined-outer-name

"""
$ poetry run python -i aws/main.py [command]
"""

import os
import argparse
import importlib
from dotenv import load_dotenv


def load_env_vars():
    load_dotenv()
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

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "command",
        help="",
        choices=["run_api", "deploy", "workbench"],
    )

    return parser.parse_args()


if __name__ == "__main__":
    load_env_vars()

    args = parse_arguments()

    importlib.import_module(args.command).main()

    if args.command == "workbench":
        from aws.workbench import *
