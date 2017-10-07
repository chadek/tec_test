#! /bin/bash

readonly CODEC="${1}"
readonly FORMAT="${2}"
readonly SUFIXE_NAME=${CODEC}_${FORMAT}

# get SCRIPT dir
readonly DB_PATH="/home/fababy/tec_test/uploads"
# build input and output path
readonly INPUT_PATH=${DB_PATH}/input_${SUFIXE_NAME}     
readonly OUTPUT_PATH=${DB_PATH}/output_${SUFIXE_NAME}     

readonly LOCK_FILENAME_PREFIXE=".ffmpeg_transcodage"
 
readonly LOCKFILE_DIR=${INPUT_PATH}
readonly LOCK_FD=200
# location of ffmpeg bin
readonly  ffmpeg="/home/fababy/.linuxbrew/bin/ffmpeg"
readonly  mongoExec="/home/fababy/tec_test/uploads/dbUpdate.sh"

# lock function (prevent having 2 instance of this script running at the same time for given param) 
lock() {
    
    local prefix=$1
    local fd=${2:-$LOCK_FD}
    local lock_file=$LOCKFILE_DIR/$prefix.lock

    # create lock file
    eval "exec $fd>$lock_file"

    # acquier the lock
    flock -n $fd \
        && return 0 \
        || return 1
}

# exit if lock
eexit() {
    local error_str="$@"

    echo `date` "*****************************"
    echo `date` $error_str
    echo `date` "*****************************"
    exit 1
}



# build instruction to move mp4_1080p files into output folder
do_exec_mv () {
    #getting param
    codec=$1
    format=$2
    params=$3
    param_format=$4

    echo "codec  " ${codec}
    echo "format " ${format}

    # for each file in input path copy to output directory then fill db with filename, path, codec, format and remove file
    for in_file in `ls ${INPUT_PATH}` 
    do
        filename="${in_file%.*}"
        fullInputPath=${INPUT_PATH}/${in_file}
        fullOutputPath=${OUTPUT_PATH}/${filename}_${format}.${codec}

        echo `date` " - - - - - - - - - - - - - - "
        echo   cp     ${fullInputPath}    ${fullOutputPath}   
               cp     ${fullInputPath}    ${fullOutputPath}   
        status=$?

        if [ ${status} -eq 0 ]
        # call dbUpdate script to send file metadata to mongoDB (using mongo cf dbUpdate.sh)
        then 
            echo ${mongoExec} "${filename}"  "${fullOutputPath}"  "${codec}" "${format}"
                 ${mongoExec} "${filename}"  "${fullOutputPath}"  "${codec}" "${format}"
            rm   ${INPUT_PATH}/${in_file}
        else
            echo "Error while copying"
        fi
    done
}


# build instruction to convert input files then store them in output folders
do_exec_ffmpeg () {
    codec=$1
    format=$2
    params=$3
    param_format=$4

    echo "codec " $codec
    echo "format " $format
    echo "params " $params
    echo "params_format" $param_format

    # for each file in input path convert then store in output directory. 
    for in_file in `ls ${INPUT_PATH}`
    do
        extension="${in_file##*.}"
        filename="${in_file%.*}"
        fullInputPath=${INPUT_PATH}/${in_file}
        fullOutputPath=${OUTPUT_PATH}/${filename}_${format}.${codec}

	    echo `date` " - - - - - - - - - - - - - - "
        echo   ${ffmpeg} -y  -loglevel warning -i  ${fullInputPath}  ${params} ${param_format}  ${fullOutputPath}
               ${ffmpeg} -y  -loglevel warning -i  ${fullInputPath}  ${params} ${param_format}  ${fullOutputPath}
    
        status=$?
	echo ${status}
        # if convert operation is successful store metadata to db and rm from input folder
        if [ ${status} -eq 0 ]
        then 
            echo ${mongoExec} "${filename}"  "${fullOutputPath}"  "${codec}" "${format}"
                 ${mongoExec} "${filename}"  "${fullOutputPath}"  "${codec}" "${format}"
            rm   ${INPUT_PATH}/${in_file}
        else
            echo "Transcoding error"
        fi
    done
}


main() {
    # lock script execution
    lock  ${LOCK_FILENAME_PREFIXE}_${CODEC}_${FORMAT}  \
        || eexit "Only one instance of $PROGNAME can run at one time."


    params=""
    param_format=""

    # definining all param to build ffmpeg command (or mv for mp4 1080p case)
    if [ "${CODEC}" == "mp4" ]  
    then 
        params=" -vf "
        if [ "${FORMAT}" == "480p"  ];  then  cmd="ffmpeg"; param_format=" scale=720:480  "; fi
        if [ "${FORMAT}" == "720p"  ];  then  cmd="ffmpeg"; param_format=" scale=1280:720 "; fi
        if [ "${FORMAT}" == "1080p" ];  then  cmd="mv"    ; param_format=" scale=1920:1080"; fi
    fi

    if [ "${CODEC}" == "ogv" ]  
    then 
        params=" -q:v 10 -c:v libtheora -c:a libvorbis "
        if [ "${FORMAT}" == "480p"  ];  then  cmd="ffmpeg"; param_format=" -s 720x480  "; fi
        if [ "${FORMAT}" == "720p"  ];  then  cmd="ffmpeg"; param_format=" -s 1280x720 "; fi
        if [ "${FORMAT}" == "1080p" ];  then  cmd="ffmpeg"; param_format=" -s 1920x1080"; fi
    fi
    if [ "${params}"       == "" ];  then  echo "Err params      "; exit 2      ; fi
    if [ "${param_format}" == "" ];  then  echo "Err param_format"; exit 3      ; fi

echo     do_exec_${cmd}  """${CODEC}"""   """${FORMAT}"""   """${params}"""  """${param_format}"""
         do_exec_${cmd}  """${CODEC}"""   """${FORMAT}"""   """${params}"""  """${param_format}"""
	
}


echo `date` "============================================================================================="
echo `date` "    cron_task.sh   ${CODEC}  ${FORMAT} "
echo "--"

 main   

echo `date` " - - - - - - - - - - - - - - "
echo `date` "    (end)"
echo `date` "--------------------------------------------------------------"
