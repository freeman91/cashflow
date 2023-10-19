#!/usr/bin/env python3
"""Deploy script cdk"""

import os
import shutil

import inquirer
from dotenv import load_dotenv

load_dotenv(f"{os.getcwd()}/.env")
ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")

def deploy_stack():
    """Verify stack, region and deploy"""

    stack = f"{APP_ID}-{ENV}-root-stack"
    action = inquirer.prompt(
        [
            inquirer.List('action',
                message="what do you want to do?",
                choices=['synth', 'deploy', 'cancel'],
            ),
        ]
    ).get("action")

    if action == "cancel":
        return

    os.system(f"cdk synth {stack} -q")

    if action == "deploy":
        os.system(f"cdk deploy {stack} -y")
        shutil.rmtree("cdk.out")


if __name__ == "__main__":
    deploy_stack()
