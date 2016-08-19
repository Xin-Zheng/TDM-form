# TDM-form

## Documentation
# TDM-form

## Documentation
### Install
####1 Install nodejs

https://nodejs.org/en/

Test it just type `node -v` and `npm -v` in the terminal 

####2 Install MongoDB

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

Now our database file are located in C:/data

! Don't forget to install MongoDB as Windows Service which allow MongoDB not close or sleep

! Set Firewall in Windows. Put Mongod.exe in the safe list.

####3 Install nssm to let NodeJS run as Windows Service

https://nssm.cc/
Download and unzip to anywhere. Now it's in C:/inetpub/TDMForm/nssm/win64

Use terminal as Administrator mode and navigate to the nssm folder and type `nssm install tdm`. And input the dictionary like the following screenshot.

![ScreenShot](/documentation file/Screen Shot 2016-08-19 at 11.16.51 AM.png)
