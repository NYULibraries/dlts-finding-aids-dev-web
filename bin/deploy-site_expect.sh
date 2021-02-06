#!/usr/bin/env bash

ROOT=$(cd "$(dirname "$0")" ; cd ..; pwd -P )

DEPLOY_SCRIPT=${ROOT}/bin/$(basename $0 _expect.sh).sh

source $ROOT/bin/$(basename $DEPLOY_SCRIPT .sh)_common.sh

if [ ! -x "$(command -v expect)" ]
then
    cat >&2 <<EOF

Expect does not appear to be installed.  You will need to install it or put the
executable in your PATH in order to run this script.

Expect: http://expect.sourceforge.net/

Alternatively, you can run the refresh script without expect support:

    $DEPLOY_SCRIPT -u username environment
EOF

    exit 1
fi

function usage() {
    script_name=$(basename $0)

    cat <<EOF

usage: ${script_name} [-h] [-u username]
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

shift $((OPTIND-1))

if [ -z $username ]; then
    echo -n "Username for ${BASTION_HOST} and web servers: "
    read username
fi

echo -n "Password for ${BASTION_HOST} and web servers: "
read -s password

echo

# Originally had heredoc:
# expect<<EOF
# ...but when added `interact` command it didn't work right.  Nothing was being
# echoed from the spawned process, and everything just seemed to hang.
expect -c "
set timeout -1

spawn ${DEPLOY_SCRIPT} -u ${username}

set num_ssh_remote_commands_to_perform \"2\"

for {set i 1} {\$i <= \$num_ssh_remote_commands_to_perform} {incr i 1} {
    expect \"${username}@${BASTION_HOST}'s password:\"

    send \"$password\r\";

    expect -re \"${username}@.*'s password:\"

    send \"$password\r\";

    expect {
        \"$GIT_PULL_SUCCEEDED\" { puts \"Deployment #\$i completed successfully.\" }

        \"Permission denied, please try again.\" {
             puts \"\nYou will need to run this script again and re-type your password.\"
             exit 1
        }
    }
}

expect \"${SCRIPT_RUN_COMPLETE}\"
"
