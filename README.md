# GroceryStore
First, install the recommended version of NodeJS from their website.

Then, install/open Visual Studio Code and make a new project.

Go to the source control menu on the left, then initialize the repo in your project folder.

Press the three dots next to the check mark and go to Remote -> Add Remote

Paste in https://github.com/CMPE131Group4Sp23/GroceryStore.git and press enter, then name it GroceryStore and press enter again.

Click the dots again, and click Checkout To, then select this branch

All of the files should be in your project folder now.

Open up a terminal window within VSCode, and paste in "npm install express, bcrypt, passport, express-flash, express-session, dotenv, mysql, cookie-parser, email-validator, uuid"

Type "npm run devStart" to start the local server

In your browser, type localhost:3000 to see the website, and CTRL+C in your terminal to stop the local server

##################################

How to access the database:

Install MySQL Workbench from this link: https://dev.mysql.com/downloads/workbench/

Once its open, click the "Database" tab at the very top, and click "Connect to Database"

Type cmpe131-group4-baymart.ceuvuwmxdxqi.us-west-1.rds.amazonaws.com in the Hostname box.

Type "admin" in the Username box, and then click "Store in Vault" and type "password" in the Password box

Click "Ok" and you should be connected to the remote database.

The program is pretty annoying to use, but I think it's a little better than raw command line. Let me know if you have any issues
