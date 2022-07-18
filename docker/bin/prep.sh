#!/bin/bash
set -e

function prep_yarn() {
  curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
  ln -s /usr/bin/nodejs /usr/bin/node
  bash n lts
  npm i -g yarn
}

function prep_py() {
  pip install -U wheel setuptools pip Cython
}

prep_py
# prep_yarn

echo "DONE PREP"
