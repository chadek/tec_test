# ${1:Project Name}
Technical test for Y Generation interview. This project consist in a web app that you can log in with email and password to then upload file or looking for data store in the database.
Database data are provided by seeds store in JSON files. Those data are sent during building process.
When a user upload a video, it is stored in a tmp directory then sent to a working environnement file as input. This mp4 video is then converted to ogv format and rezised using ffmpeg tool in a bash script 
## Installation
Requirement:

    *Install node js
    *Install Node Packaged Module (npm)
    *Dowload dependencies with (npm install)
    *Install MongoDB and start service (sudo service mongod start on ubuntu)
    *Install ffmpeg tool and add it to your path. 

Installing good dependencies and librairies is a bit tricky. The easiest way to do so is to run thoses commands : 

	*bla
	*bla
	*bla

You can find more information on : LIENENNENE
Or check also this one if want to install less useless stuff : LIENENENNE


## Structure 

Template 
Access with
Some route need to be auth

File handling structure
input file
output file



## Usage

This app is listening onto port 3000 and can be accessed by require thi url : http://localhost:3000 
MongoDB is accessible on port 27017. You can lookup for data store in database using mongo command. Some usefull command to query database  :

    *use tec_test
    *db.createCollection("collectionName")
    *db.coaches.insert({ email: "someValue", password: "13566" })
    *db.coaches.find().pretty()

    
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