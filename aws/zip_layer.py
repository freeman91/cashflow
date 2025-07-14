"""helper functions for stack resources"""

import os
import shutil
import subprocess
import sys
from zipfile import ZipFile

from cdk.stacks.__util__ import get_top_level_path

ENV: str = os.environ.get("REACT_APP_ENV")


def generate_requirements_file(directory: str):
    """Generate requirements.txt file for the lambda functions"""

    subprocess.run(
        [
            "poetry",
            "export",
            "--without-hashes",
            "--only",
            "lambda",
            "-o",
            "requirements.txt",
        ],
        cwd=directory,
        check=True,
    )


def install_requirements(directory: str):
    """Install the requirements.txt file into the python folder"""

    python_directory = os.path.join(
        directory,
        "python",
    )
    result = subprocess.run(
        ["pip", "install", "-r", "requirements.txt", "-t", python_directory],
        cwd=directory,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    ).stdout.strip()
    print(result)

    return python_directory


def zip_python_directory(python_directory: str):
    """zip directory contents into a zip file"""

    version = sys.version[:4]

    top_level = get_top_level_path()
    path = os.path.join(
        top_level,
        "aws/layers/layer.zip",
    )

    with ZipFile(
        path,
        "w",
    ) as zip_obj:
        for dirpath, _, filenames in os.walk(python_directory):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                zip_obj.write(
                    filepath,
                    f"python/lib/python{version}/site-packages"
                    + filepath.replace(python_directory, ""),
                )


def main():
    """Do the layer zipping here."""

    print("Generating Lambda Layer")
    layers_path = os.path.join(get_top_level_path(), "aws/layers")
    generate_requirements_file(layers_path)
    python_directory = install_requirements(layers_path)
    zip_python_directory(python_directory)

    shutil.rmtree(python_directory)
    remove_path = os.path.join(layers_path, "requirements.txt")
    os.remove(remove_path)

    print("Lambda Layer generated successfully")
