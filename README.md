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
