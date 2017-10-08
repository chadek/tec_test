# Tec_Test project

Technical test for Y Generation interview. This project consist in a web app that you can log in with email and password to then upload file or looking for data store in the database.

Database data are provided by seeds store in JSON files. Those data are sent during building process.

When a user upload a video, it is stored in a tmp directory then sent to a working environnement file as input. This mp4 video is then converted to ogv format and rezised using ffmpeg tool in a bash script 

## Installation

### Requirement:

Note that all following commands are for on ubuntu distribution

**Install nodejs 6.X** :

	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs 

**Install Node Packaged Module (npm)** then update it (may need to call npm install -g npm twice) : 

	sudo apt-get install -y npm
	sudo npm install -g npm

**Install MongoDB** referring to : https://docs.mongodb.com/manual/administration/install-community/

In this case I followed those instructions : https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
	
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
	echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

After mongodb installation, **do not forget to start mongod service.** You may need to configure it adding some stuff in /etc/systemd/system/mongodb.service file acording to this post : https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04

Then start service using: 

	sudo service mongodb start

After mongoDB installation and service start, run **"mongo"** command and you should see **"connecting to: mongodb://127.0.0.1:27017"** if it's working properly

    Clone this git repository and dowload dependencies by running "npm install" in the project folder 


Video treatment depends on ffmpeg tool. Installing it with right codecs is a bit tricky so I added a static build of it into this project (locate in /bin).

To get the original version : wget http://ffmpeg.gusari.org/static/64bit/ffmpeg.static.64bit.latest.tar.gz

To know more about how I proceed, refer to this link : https://buzut.fr/installer-ffmpeg-et-encoder-pour-html5/
You can also build from source but it's pain or use brew to install it but brew comes with a lot of (useless) librairies and tools 

If you want to use your own ffmpeg bin edit /bin/cron_task.sh and set the path to your ffmpeg bin in ffmpeg variable (line 21) 

ffmpeg install build sources : http://wiki.razuna.com/display/ecp/FFmpeg+Installation+for+Ubuntu



## Structure and app description

### App content 

**Templates** are define in **views** folder and rendered with the ejs engine.

**Init** folder contains a js script and json files to seed db with data. It also contain a bash script that create a tmp folder and mailbox folders for video treatment process (including a cron_log folder used to save log from cron_task.sh). JS and Bash script are both called by **"npm run build"**

**Model** folder contains mongoose model data structure use by the app

**bin** contains bash scripts and ffmpeg bin. **cron_like.sh** is triggered by **"npm run cron"** and act as a cron task (call video treatment process every 5 minutes)

**root** contains package.json the main program (index.js) and some data/functions used by index.js  


### Authenication

User must be logged to access restricted routes (example of user in db : email : test@chance.co pwd : password).

Authentication is handle by **passport** module. Auth strategy is define in **auth.js**. If user is succesfully authenticate passport send a **cookie** to user. Accessing restricted part of this app is done by checking user cookie in routes

### Main

The main app runs in **index.js** using **express** framework. It sets all settings and handle routes return renderred templates.

It query database for /candidates and /files route

On /upload/file post request, it saves the incoming file in a **tmp** directory before moving it to **uploads/input_mp4_1080p**. Then a **link** is created to other input folders.

### Video treatment and bash stuff

Video treatment is handled by a bash script. How does it working ?

Uploads folder contains a set of mailbox linked to a specifique codec and scale.
**cron_like.sh** will call a process to check those mailboxes. If mailboxes aren't empty, it will **start converting the video** and store results in output mailboxes. When converting is done, the **input file is removed** and the **database is updated with metadata**. There is physially one incoming video into the **input_mp4_1080p mailbox** wich is **linked** to the others mailboxes to trigger treatment on next mailbox check.

**bin/cron_task.sh** perform a video convertion to output directory for given format and scale. Then it remove input file

**bin/dbUpdate.sh** is call in cron_task to update database with metadata after conversion using mongo comand

**bin/cron_like.sh** act as a cron task : it is an infinite loop calling cron_task for all video format and scale every 5 minutes

After running video treatment all videos should be in **output_CODEC_SCALE** folders none should be found in **input_CODEC_SCALE**



## Usage

After installing nodejs npm and mongodb to **start the app** use the following commands :

	npm install
	npm run build
	npm start

You should be able to access the app with this url : http://localhost:3000

To **run the cron like video treatment** process use (doesn't work if it's run before building) :

	npm run cron

MongoDB is accessible on port 27017. You can lookup for data store in database using mongo command. Some usefull command to query database  :

    use tec_test
    db.createCollection("collectionName")
    db.coaches.insert({ email: "someValue", password: "13566" })
    db.coaches.find().pretty()


## Test

Test made to ensure the app respond well :

### route testing

	Handle unknown routes
	No data in post request
	Wrong user input or missing fields
	only MP4 file allow in form
	file upload post from an unlogged user
	upload sample video 
	uploading big file (1G) => work but system got really slow while uploading 

Limitation : 

Uploading big files slow considerably the system (maybe need to stream the file to not run out of ram)

Working over http, cookie could be intercept. Can be easily fixed by using https connection 

File isn't checked at serverside (user could send other file than mp4 by forging post request or send a random file with mp4 extension). Can be fixed buy checking file signature (magic number)

### video treatment

As video treatment process is standalone, test were made separeatly before integration to web app

	handle several file in the same input mailbox directory
	lock mecanism to prevent several instance running at same time
	parallele execution (converting to all format and scale at the same time)
	small file (10M)
	big file (1G) => working but take a lot of time

Limitation :

No link between metadata stored in database and files actually in fs. Consequences : 
	
	If an output file is removed, metadata are still in database. 
    If video treatment run while database isn't accessible, generated metadata won't be store in db

This can be fixed buy writing a bilateral consistancy check (check wich file are in fs and compare with db) 

### Deployement

	Following the install procedure described before (do make sure it's doable, easy and to change context)

Limitation :

Video treatment depend on bash script wich won't work on window's system and maybe not on every Unix system 


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credit

I dedicate this credit to JsonWebToken wich made me loose almost an entire day trying to understand how it is working and particurlarly how to handle them clienside (thing that I steal didn't figured out).	