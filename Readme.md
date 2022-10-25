# Famous programmers

## Installing

1. clone the repo
2. run `npm install`
3. run `npm run dev` to start the server in development mode (with nodemon)

## Improvements

- Opsplitsen: scraper, seeding, question utils
- Rewrite functions to be reusable
- Split up answer enpoints: `POST /questions/programmers/answer` & `POST /questions/projects/answer`
- Simplify answer logic: find the right programmer once, then check the answer, count the votes and respond

## Changes for deployment

- Localhost in the url is not allowed!
- Solution: Express hosts html files and images (express.static)

## Final feature

- When request programmers from GET /programmers, order (sort) them by votes
- On the results page - fetch the programmers from GET /programmers, display (5?) them on the page
