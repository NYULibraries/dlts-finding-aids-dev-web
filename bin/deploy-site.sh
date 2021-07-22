#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

source $ROOT/bin/$(basename $0 .sh)_common.sh

function usage() {
    script_name=$(basename $0)

    cat <<EOF

usage: ${script_name} [-h] -u username
    -h:          print this usage message

EOF
}

while getopts h: opt
do
    case $opt in
        h) usage; exit 0 ;;
        *) echo >&2 "Options not set correctly."; usage; exit 1 ;;
    esac
done

shift $((OPTIND-1))

aws s3 sync ./web/ s3://dlts-dev-webs/finding-aids/ --exact-timestamps --delete
