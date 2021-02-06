#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )
FAM_SRC=$ROOT/src/fam
FAM_WEB=$ROOT/web/fam

function usage() {
    script_name=$(basename $0)

    cat <<EOF

usage: ${script_name} [-h]
    -h:          print this usage message

EOF
}

function update_fam_mockup_build {
    local mockup_number=$1
    local mockup="mockup-${mockup_number}"

    local curdir=$(pwd)

    cd $FAM_SRC/${mockup}/
    yarn build
    cd $curdir

    rm -fr $FAM_WEB/${mockup}/*
    cp -pr $FAM_SRC/${mockup}/dist/* $FAM_WEB/${mockup}/
}

while getopts h: opt
do
    case $opt in
        h) usage; exit 0 ;;
        *) echo >&2 "Options not set correctly."; usage; exit 1 ;;
    esac
done

shift $((OPTIND-1))

update_fam_mockup_build 01
update_fam_mockup_build 02

