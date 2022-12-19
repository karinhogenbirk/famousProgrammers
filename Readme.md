# Famous programmers

The programmers' quiz is developed to determine which programmers are easily recognized and therefore can be seen as most ´famous´. 
The quiz takes random programmers and projects from a list of 345 programmers. It generates 10 random questions and saves answers in a database. 
The calculated votes give us a top 5 of most famous programmers. Besides this, it's a fun game to play! 

The app also contains an admin page. The admin page is for authorized users who can, after logging into their account, access the database. 
It is very likely that data about famous programmers changes: new programmers will join the table or known programmers work on new projects. 
On the admin page it is therefore possible to delete, update and create programmers in the database. 

## What I have learned

The tools I have learned to build this project include: 
* JavaScript basics
* HTML basics 
* CSS basics and responsive design
* Data scraping using JSDOM
* Express
* Prisma database
* Postman 
* Debugging
* bcrypt
* Hashing passwords
* JWT authorization
* Middleware
* Routers
* Automated backend testing with supertest
* Automated frontend testing with Cypress
* GitHub actions

## How it works

- scraper.js contains the code for the scraped data using JSDOM
- The folder ´public´ contains the public HTML and CSS documents 
- The utilities to create random questions are written in 'utils'
- The code in programmers.js gets the random questions, checks the answers and counts the votes to make a list of high scores
- The scores are connected to a prisma database
- For development and testing there are two seperate databases, to be found in env.test and env.development

## Installing

1. clone the repo
2. run `npm install` to install the package
3. run `npm run dev` to start the server in development mode (with nodemon)
4. run `npm run prisma:seed` to create a prisma client database 
5. run `npx prisma studio` to access the database - you can check the votecount of the programmers here (this is de dev database!)
6. run `npm run test` to run the backend tests
7. run `npm run test:cypress` to run the frontend tests
