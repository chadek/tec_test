#!/usr/bin/env bash


while true;do
    date
    ./bin/cron_task.sh ogv  480p  >> /home/fababy/tec_test/cron/cron_task_ogv_480p.log    2>&1 &
    ./bin/cron_task.sh ogv  720p  >> /home/fababy/tec_test/cron/cron_task_ogv_720p.log    2>&1 &
    ./bin/cron_task.sh ogv 1080p  >> /home/fababy/tec_test/cron/cron_task_ogv_1080p.log   2>&1 &
    ./bin/cron_task.sh mp4  480p  >> /home/fababy/tec_test/cron/cron_task_mp4_480p.log    2>&1 &
    ./bin/cron_task.sh mp4  720p  >> /home/fababy/tec_test/cron/cron_task_mp4_720p.log    2>&1 &
    ./bin/cron_task.sh mp4 1080p  >> /home/fababy/tec_test/cron/cron_task_mp4_1080p.log   2>&1 

    sleep 300
done

