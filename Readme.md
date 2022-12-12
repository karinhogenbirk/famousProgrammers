# Famous programmers

The programmers´ quiz is developed to determine which programmers are easily recognized and therefore can be seen as most ´famous´. 
The quiz takes random programmers and projects from a list of 345 programmers. It generates 10 random questions and saves answers in a database. 
The calculated votes give us a top 5 of most famous programmers. Besides this, it´s a fun game to play! 

## What I have learned

The tools I have learned to build this project include: 
* JavaScript basics
* HTML basics 
* CSS basics and responsive design
* Data scraping using JSDOM
* Express
* Prisma 
* Postman 
* Debugging
* bcrypt
* Hashing passwords
* JWT authorization
* Middleware
* Routers
* Automated testing with supertest
* Github actions
* Cypress

## How it works

- scraper.js contains the code for the scraped data using JSDOM
- The folder ´public´ contains the public HTML and CSS documents 
- The utilities to create random questions are written in 'utils'
- The code in programmers.js gets the random questions, checks the answers and counts the votes to make a list of high scores
- The scores are connected to a prisma database

## Installing

1. clone the repo
2. run `npm install`
3. run `npm run dev` to start the server in development mode (with nodemon)
4. run `npm run prisma:seed` to create a prisma client database 
5. run `npx prisma studio` to access the database - you can check the votecount of the programmers here

