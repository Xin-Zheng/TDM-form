
# TDM-form

## Documentation
### Install
####1 Install nodejs

https://nodejs.org/en/

Test it just type `node -v` and `npm -v` in the terminal 

####2 Install MongoDB

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

Now our database file are located in C:/data

! Don't forget to install MongoDB as Windows Service which allow MongoDB not close or sleep. You can use the following configuration file(In C:/mongod.cfg). The most important is bindIp! We need to set it to 0.0.0.0 to allow access from public IP.

```
systemLog:
    destination: file
    path: c:\data\log\mongod.log
storage:
    dbPath: c:\data\db

net:
   bindIp: 0.0.0.0
   port: 27017
```


! Set Firewall in Windows. Put Mongod.exe in the safe list.

![ScreenShot](/documentation file/firewall.png)

When finish intall MongoDB and run it. And create a user you like using following code:
```
db.createUser(
  {
    user: "tdmuser",
    pwd: "12345678",
    roles: [ { role: "userAdminAnyDatabase", db: "tdm" } ]
  }
)
```
####3 Install nssm to let NodeJS run as Windows Service

https://nssm.cc/
Download and unzip to anywhere. Now it's in C:/inetpub/TDMForm/nssm/win64

Use terminal as Administrator mode and navigate to the nssm folder and type `nssm install tdm`. And input the dictionary like the following screenshot.

![ScreenShot](/documentation file/Screen Shot 2016-08-19 at 11.16.51 AM.png)

### How to run it
Now you can run it at Windows Services


![ScreenShot](/documentation file/windowservice.png)


### File structure


![ScreenShot](/documentation file/Screen Shot 2016-08-19 at 11.28.30 AM.png)

server.js -- the main backend code using Nodejs and Express

index.html -- the main frontend code 

css folder -- including bootstrap and other embeded css files

js folder -- including TIM and calculator.js which is the main javascript code to do the all point calculations and interaction

images folder -- banner, icons

pdf folder -- save the measures pdfs (if measures update, you need to put new pdf here)

### server.js notes 

(You maybe confusing at the first time, especially for defining new "var". Now using const. Haha, because it's javascript in ES2015 style. I am also a new learner of this new trend. )


```javascript
const express = require('express');   //load Express nodeJS backend framework
const fs = require('fs');    //load filesystem package to support PDF distribution
const path = require('path');   //load path package to manipulate url path
const bodyParser= require('body-parser');   //load bodyParser to hold form submit service
const MongoClient = require('mongodb').MongoClient;   //load MongoDB 
const app = express();   //start Express app

//change reference path based on domain name and port
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/css',express.static(path.join(__dirname, 'css')));

//root url to show index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//Connect MongoDB.   mongodb://<username>:<password>@<url>:<port>/<databasename>
MongoClient.connect('mongodb://tdmuser:12345678@54.83.57.240:27017/test', (err, database) => {
  if (err) return console.log(err)
  db = database;
  app.listen(8080, () => {
    console.log('listening on 8080')
  })
})

app.use(bodyParser.urlencoded({extended: true}))
//submit form using POST request and save data to Mongo and redirect to root url
app.post('/submitmeasure', (req, res) => {
  console.log('Hellooooooooooooooooo!')
  db.collection('tdm').save(req.body, (err, result) => {
  if (err) return console.log(err)
  console.log('saved to database')
  res.redirect('/')
  })
})


//send measures PDF to client
app.get('/pdf', function (req, res) {
  var filePath = "/pdf/measure/"+ req.query.name+".pdf";
  console.log(req.query.name);
  console.log(filePath);
  fs.readFile(__dirname + filePath , function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});

//send landusecategory PDF to client
app.get('/landuse', function (req, res) {
  var filePath = "/pdf/landusesheet/LandUseCategory.pdf";
  fs.readFile(__dirname + filePath , function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});


```


