import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="cashflow2",
    version="0.0.0",
    author="Addison Freeman",
    author_email="addisonfreeman91@gmail.com",
    description="cashflow2 API service",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/freeman91/cashflow2",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
