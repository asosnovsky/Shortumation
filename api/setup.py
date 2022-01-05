# -*- coding: utf-8 -*-
import setuptools  # type: ignore

setuptools.setup(
    python_requires=">=3.9",
    install_requires=[
        "ruamel.yaml==0.17.17",
        "fastapi==0.70.0",
        "pydantic==1.8.2",
        "uvicorn[standard]==0.15.0",
        "python-decouple==3.5",
        "orjson==3.6.4",
    ],
    extras_require={
        "dev": [
            "mypy==0.910",
            "mypy-extensions==0.4.3",
            "black==21.7b0",
            "bandit==1.7.0",
            "isort==5.9.3",
            "coverage==5.5",
            "pre-commit==2.13.0",
            "vulture==2.3",
            "types-requests==2.25.6",
            "requests==2.27.0",
        ],
    },
)
