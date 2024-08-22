# Running this program

## Step 1
Install node modules by running `npm i`

## Step 2
Setup the SQLite database by running `npm run setup`

## Step 3
Run the application with `npm start`

### 3.1
Adjust the code on rows `111` or `114` and run the app again.
For example you could change line `114` to 
```
myConversion.convertCurrency("PHP", "USD", 431).then((val) => console.log(`New value is: ${val}`));
```

## Step 4
Run the unit test with `npm run test`


## Step 5
Create a new record by uncommenting line `208` in the `index.js` file and running `npm start`, update values passed as needed.

## Step 6
Read a record by uncommenting line `211` and running `npm start`, update value as needed.

## Step 7
Update a record by uncommenting line `214` and running `npm start`, update values as needed.

## Step 8
Delete a record by uncommenting line `217` and running `npm start`, update value as needed.

Running step 6 again and passing the value of the deleted record should check if the record was found or not.