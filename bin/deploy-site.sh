#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

DEV_SERVER=devweb1.dlib.nyu.edu
STAGE_SERVER=stageweb1.dlib.nyu.edu

source $ROOT/bin/$(basename $0 .sh)_common.sh

function usage() {
    script_name=$(basename $0)

    cat <<EOF

usage: ${script_name} [-h] -u username
    -h:          print this usage message
    -u username: username on bastion host and web servers

EOF
}

while getopts hu: opt
do
    case $opt in
        h) usage; exit 0 ;;
        u) username=$OPTARG ;;
        *) echo >&2 "Options not set correctly."; usage; exit 1 ;;
    esac
done

if [ -z $username ]; then
    echo >&2 'You must provide a username.'
    usage
    exit 1
fi

shift $((OPTIND-1))

ssh -J $username@$BASTION_HOST $username@$DEV_SERVER "cd /www/sites/finding-aids-dev-web/ && git pull && echo '$GIT_PULL_SUCCEEDED'"
ssh -J $username@$BASTION_HOST $username@$STAGE_SERVER "cd /www/sites/finding-aids-dev-web/ && git pull && echo '$GIT_PULL_SUCCEEDED'"

# This string tells the expect script wrapper that refresh run has completed.
echo $SCRIPT_RUN_COMPLETE
