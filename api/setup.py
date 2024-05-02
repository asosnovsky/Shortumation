# -*- coding: utf-8 -*-
import setuptools  # type: ignore

setuptools.setup(
    python_requires=">=3.10",
    install_requires=[
        "PyYAML==6.0",
        "fastapi==0.109.1",
        "pydantic==1.10.13",
        "hypercorn==0.13.2",
        "python-decouple==3.6",
        "websockets==10.3",
    ],
    extras_require={
        "dev": [
            "mypy==0.971",
            "mypy-extensions==0.4.4",
            "black==22.6.0",
            "bandit==1.7.4",
            "isort==5.10.1",
            "coverage==6.4.2",
            "pre-commit==2.20.0",
            "vulture==2.5",
            "types-requests==2.28.4",
            "types-PyYAML==6.0.11",
            "requests==2.28.1",
        ],
    },
)
