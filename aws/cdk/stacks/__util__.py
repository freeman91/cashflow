"""helper functions for stack resources"""

import os
import pathlib
import subprocess
import sys


def get_top_level_path():
    """get path to top-level of git repo"""

    if sys.platform in ("darwin"):
        return subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip()

    path = pathlib.Path(__file__).parent.parent.parent.absolute()
    return path


def get_layer_path(layer_name: str = "layer"):
    """get path to zipped layer file"""

    return os.path.join(get_top_level_path(), f"aws/layers/{layer_name}.zip")
