#! /bin/bash

readonly SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

while true;do
    date
    ./bin/cron_task.sh ogv  480p  >> ${SCRIPT_PATH}/../cron_log/cron_task_ogv_480p.log   2>&1 &
    ./bin/cron_task.sh ogv  720p  >> ${SCRIPT_PATH}/../cron_log/cron_task_ogv_720p.log    2>&1 &
    ./bin/cron_task.sh ogv 1080p  >> ${SCRIPT_PATH}/../cron_log/cron_task_ogv_1080p.log   2>&1 &
    ./bin/cron_task.sh mp4  480p  >> ${SCRIPT_PATH}/../cron_log/cron_task_mp4_480p.log    2>&1 &
    ./bin/cron_task.sh mp4  720p  >> ${SCRIPT_PATH}/../cron_log/cron_task_mp4_720p.log    2>&1 &
    ./bin/cron_task.sh mp4 1080p  >> ${SCRIPT_PATH}/../cron_log/cron_task_mp4_1080p.log   2>&1 

    sleep 300
done
