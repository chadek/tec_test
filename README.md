# Tec_Test project
Technical test for Y Generation interview. This project consist in a web app that you can log in with email and password to then upload file or looking for data store in the database.

Database data are provided by seeds store in JSON files. Those data are sent during building process.

When a user upload a video, it is stored in a tmp directory then sent to a working environnement file as input. This mp4 video is then converted to ogv format and rezised using ffmpeg tool in a bash script 

## Installation

Requirement:

Note that all following commands are for on ubuntu distribution

    *Install nodejs 6.X :

    	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	
		sudo apt-get install -y nodejs 
    
    *Install Node Packaged Module (npm) then update it (may need to call npm install twice) : 

    	sudo apt-get install -y npm

    	sudo npm install -g npm

    *Install MongoDB referring to : https://docs.mongodb.com/manual/administration/install-community/

		In this case I followed those instructions : https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

		After mongodb installation, do not forget to start mongod service : sudo service mongodb start

		By running this command you may have a "Failed to start mongodb.service" issue. To deal with it, add a /etc/systemd/system/mongodb.service file and fill it with content acording to this post : https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04

		After mongoDB installation and service start, run "mongo" command and you should see "connecting to: mongodb://127.0.0.1:27017" if it's working properly

    *Clone this git and dowload dependencies by running "npm install" in the project folder 


Video treatment depend on ffmpeg tool. Installing it with right codecs is a bit tricky so I added a static build of it into this project (locate in /bin).

To know more about how I proceed, refer to this link : https://buzut.fr/installer-ffmpeg-et-encoder-pour-html5/
You can also build from source but it's pain or used brew to do install but it come with a lot of (useless) librairies and tools 

If you want to use your own ffmpeg bin edit /bin/cron_task.sh and set the path to your ffmpeg bin in ffmpeg variable (line 21) 

ffmpeg install with brew procedure : LIEENENNEN

ffmpeg install building sources : LIENENENE



## Structure and app description

### App content 

Templates are define in views folder and rendered with the ejs engine.

Init contain a js script and json files to seed db with data. It also contain a bash script that create a tmp folder and folders for video treatment process (including a cron_log folder use to save log from cron_task.sh). JS and Bash script are both called by "npm run build"

Model folder contain mongoose model structure use by the app

bin contain bash scripts and ffmpeg. cron_like.sh is triggered by "npm run cron" and act as a cron task (call video treatment process every 10 minutes)

root contains package.json the main program (index.js) and some data/functions used by index.js  


### Authenication

User must be logged to access restricted routes (user example : email : test@chane.co pwd : password).

Authentication is handle by passport module. Auth strategy is define in auth.js. If user is succesfully authenticate passport send a cookie to user. Accessing restricted part of this app is done by checking user cookie in routes

### Main

The main app run in index.js using express framework. It set all settings and handle routes return renderred templates.

It query database for /candidates and /files route

On /upload/file post route, it save the incoming file in a tmp directory before moving to uploads/input_mp4_1080p and creating link to other input folders

### Video treatment and bash stuff

Video treatment is handle by a bash script.

bin/cron_task.sh perform a video convertion for a given format and scale to output file path then remove input file

bin/dbUpdate.sh is call in cron_task to update database with metadata after conversion using mongo cmd

bin/cron_like.sh act as a cron task : it is an infinite loop calling cron_task for all video format and scale every 5 minutes

After running video treatment all videos should be in output_CODEC_SCALE folders none should be found in input_CODEC_SCALE



## Usage

After installing nodejs npm and mongodb to start the app use the following commands :

	*npm install
	*npm run build
	*npm start

You should be able to access the app with this url : http://localhost:3000

To run the cron like video treatment process use :

	*npm run cron

MongoDB is accessible on port 27017. You can lookup for data store in database using mongo command. Some usefull command to query database  :

    *use tec_test
    *db.createCollection("collectionName")
    *db.coaches.insert({ email: "someValue", password: "13566" })
    *db.coaches.find().pretty()


## Test

I ran several test to ensure the app respond well :

	*route testing

	** Unknown routes
	** no data in post request
	** wrong user entry or missing fields
	** file upload post from an unlogged user 

	*video test

	 


## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
## History
TODO: Write history
## Credits
TODO: Write credits