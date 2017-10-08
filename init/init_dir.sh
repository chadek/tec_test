#! /bin/bash

readonly SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


mkdir "${SCRIPT_PATH}/../tmp"
mkdir -p "${SCRIPT_PATH}/../uploads/input_mp4_480p"
mkdir -p "${SCRIPT_PATH}/../uploads/input_mp4_780p"
mkdir -p "${SCRIPT_PATH}/../uploads/input_mp4_1080p"
mkdir -p "${SCRIPT_PATH}/../uploads/input_ogv_480p"
mkdir -p "${SCRIPT_PATH}/../uploads/input_ogv_720p"
mkdir -p "${SCRIPT_PATH}/../uploads/input_ogv_1080p"

mkdir -p "${SCRIPT_PATH}/../uploads/output_mp4_480p"
mkdir -p "${SCRIPT_PATH}/../uploads/output_mp4_780p"
mkdir -p "${SCRIPT_PATH}/../uploads/output_mp4_1080p"
mkdir -p "${SCRIPT_PATH}/../uploads/output_ogv_480p"
mkdir -p "${SCRIPT_PATH}/../uploads/output_ogv_720p"
mkdir -p "${SCRIPT_PATH}/../uploads/output_ogv_1080p"
