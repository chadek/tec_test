#! /bin/sh

param_filename=${1}
param_path=${2}
param_encoding=${3}
param_scale=${4}

mongo_cmd="var document = {filename: \""${param_filename}"\", path: \""${param_path}"\", encoding: \""${param_encoding}"\", scale: \""${param_scale}"\"  };db.files.insert(document);"

echo "${mongo_cmd}"

mongo 127.0.0.1/tec_test --eval "${mongo_cmd}"
