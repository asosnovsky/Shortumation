#!/bin/bash
set -e

function prep_yarn() {
  npm i -g yarn
}

function prep_py() {
  pip install -U wheel setuptools pip Cython
}

declare -i err=0 werr=0
prep_py &
prep_yarn &
while wait -fn || werr=$?; ((werr != 127)); do
  err=$werr
done

echo "DONE PREP"
exit $err