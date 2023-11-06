#!/usr/bin/env python3
"""Deploy script cdk"""

import os
import shutil

import inquirer

ENV = os.getenv("ENV")
APP_ID = os.getenv("APP_ID")
AWS_PROFILE = os.getenv("AWS_PROFILE")


def main():
    """Verify stack, region and deploy"""

    cli_options = "-y -q --app 'poetry run python aws/cdk/build.py'"
    stack = f"{APP_ID}-{ENV}-root-stack"

    print(f"Stack: {stack}\n")

    action = inquirer.prompt(
        [
            inquirer.List(
                "action",
                message="Action?",
                choices=["synth", "deploy", "cancel"],
            ),
        ]
    ).get("action")

    if action == "cancel":
        return

    if action == "synth":
        print("Synthesizing stack...\n")
        os.system(f"cdk synth {stack} {cli_options}")

    elif action == "deploy":
        print("Deploying stack...\n")
        os.system(f"cdk deploy {stack} {cli_options}")
        shutil.rmtree("cdk.out")
