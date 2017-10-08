# Tec_Test project

Technical test for Y Generation interview. This project consists in a web app that you can log in with email and password to then upload file or look for data stored in the database.

Database data are provided by seeds stored in JSON files. These data are sent during building process.

When a user uploads a mp4 video, the video is stored in a tmp directory then sent to a mailbox directory as input. This mp4 video is then converted to ogv format and is resized in different scale formats using ffmpeg tool. Converting is done in a standalone process using bash scripts.

## Installation

### Requirement:

1. nodejs
2. npm
3. mongoDB

Optional : ffmpeg

### Procedure:

Note that all following commands are for ubuntu distribution.

**Install nodejs 6.X** :

	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs 

**Install Node Packaged Module (npm)** then update it (may need to call npm install -g npm twice): 

	sudo apt-get install -y npm
	sudo npm install -g npm

**Install MongoDB** referring to: https://docs.mongodb.com/manual/administration/install-community/

In this case I followed these instructions: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
	
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
	echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

After mongodb installation, **do not forget to start mongod service.** You may need to configure it adding some stuff in /etc/systemd/system/mongodb.service file acording to this post : https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04

Then start service using: 

	sudo service mongodb start

After mongoDB installation and service started, check that service is running by running **"mongo"** command and you should see **"connecting to: mongodb://127.0.0.1:27017"** if it's working properly. 

    Clone this git repository and download dependencies by running "npm install" in the project folder.

### Optionnal:

Video treatments are done with ffmpeg tool. Installing it with right codecs is a bit tricky. So I added a static build of it into this project (locate in /bin).

To get the original version: wget http://ffmpeg.gusari.org/static/64bit/ffmpeg.static.64bit.latest.tar.gz

To know more about how I proceed, refer to this link : https://buzut.fr/installer-ffmpeg-et-encoder-pour-html5/
You can also build ffmpeg from source but it's a pain or use brew to install it but brew comes with a lot of (useless) librairies and tools.

If you want to use your own ffmpeg bin, edit **/bin/cron_task.sh** and set the path to your ffmpeg bin in ffmpeg variable (line 21).

ffmpeg install build sources: http://wiki.razuna.com/display/ecp/FFmpeg+Installation+for+Ubuntu



## App description

### App content 

**Templates** are defined in **views** folder and rendered with the ejs engine.

**Init** folder contains a js script and json files to seed db with data. It also contains a bash script that create a tmp folder and mailbox folders for video treatment processes (including a cron_log folder used to save log from cron_task.sh). JS and Bash script are both called by **"npm run build"**.

**Model** folder contains mongoose model data structures used by the app.

**bin** contains bash scripts and ffmpeg bin. **cron_like.sh** is triggered by **"npm run cron"** and act as a cron task (call video treatment process every 5 minutes).

**root** contains package.json, the main program (index.js) and some data/functions used by index.js.  


### Authentication

User must be logged to access restricted routes (example of user in db : email : test@chance.co pwd : password).

Authentication is handled by **passport** module. Auth strategy is defined in **auth.js**. If user is successfully authenticated, passport sends a **cookie** to user. Accessing restricted part of this app is done by checking user's cookie in routes.

### Main

The main app runs in **index.js** using **express** framework. It sets all settings, handles routes and return rendered templates.

It queries database before renderring /candidates and /files.

On /upload/file post request, it saves the incoming file in a **tmp** directory before moving it to **uploads/input_mp4_1080p**. Then **links** are created to other input folders.

### Video treatment and bash stuff

Video treatment is handled by a bash script. How does it work ?

Uploads folder contains a set of mailboxes. Each mailbox is used for one type of video conversion (codec and scale).
**cron_like.sh** will call a process to check these mailboxes. If mailboxes are not empty, it will **start converting the video** and store results in output mailboxes. When converting is done, the **input file is removed** and the **database is updated with metadata**. There is physically one incoming video into the **input_mp4_1080p mailbox** which is **linked** to the others mailboxes. A file in folder is the trigger for processing on next mailbox check.

**bin/cron_task.sh** performs a video conversion to output directory for given format and scale. Then it removes input file.

**bin/dbUpdate.sh** is called in **cron_task.sh** to update database with metadata after conversion using mongo command.

**bin/cron_like.sh** acts as a cron task: it is an infinite loop calling **cron_task.sh** for all videos formats and scales every 5 minutes.

After running video treatment, all videos should be in **output_CODEC_SCALE** folders. No one should be found in **input_CODEC_SCALE**.



## Usage

Prepare context (to be done only once):

	npm install
	npm run build

To **start app** use the following commands:

	npm start

You should be able to access the app with this url: http://localhost:3000

To **run the cron like video treatment** process use:

	npm run cron

MongoDB is accessible on port 27017. You can view the database's data using mongo command. Some useful commands to query database:

    use tec_test
    db.createCollection("collectionName")
    db.coaches.insert({ email: "someValue", password: "13566" })
    db.coaches.find().pretty()


## Test

Tests made to ensure the app responds well:

### Request testing

	Handle unknown routes
	No data in post request
	Wrong user input or missing fields
	only MP4 file allow in form
	file upload post from an unlogged user
	upload sample video 
	uploading big file (1G) => work but system got considerably slow while uploading 

Limitation : 

Uploading big files slows considerably the system (maybe need to stream the file to not run out of ram)

Working over http, cookies could be intercepted. Can be easily fixed by using https connection. 

File is not checked at server side (user could send other file than mp4 by forging post request or send a random file with mp4 extension). Can be fixed buy checking file signature (magic number).

### Video treatment

As video treatment process is standalone, test were made separatly before integration to web app.

	handle several files in the same input mailbox directory
	lock mecanism to prevent several instances running at same time
	parallele execution (converting to all formats and scales at the same time)
	small file (10M)
	big file (1G) => working but takes a lot of time

Limitation :

No link between metadata stored in database and files actually in fs. Consequences: 
	
	If an output file is removed, metadata are still in database. 
    If a video treatment runs while database is not accessible, generated metadata won't be stored in db

This can be fixed buy writing a bilateral consistency check (check which files are in fs and compare with db) 

### Deployment

	Following the installation procedure described before (make sure it's doable, easy and to change context)

Limitation :

Video treatments depend on bash script which won't work on window's system and maybe not on every Unix system.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credit

I dedicate this credit to JsonWebToken which made me lose almost an entire day trying to understand how it is working and particularly how to handle them client side (thing that I steel didn't figure out).	