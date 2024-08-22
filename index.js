const sqlite3 = require('sqlite3').verbose();

class convertCurrency {

    // Connect to the SQLite database
    db = new sqlite3.Database('currencies.db');

    /**
     * Convert currency from one nation to another.
     * @param currencyFrom Currency we want to convert
     * @param currencyTo Currency we want to have
     * @param amount Amount of original currency.
     * @returns Amount after conversion
     */
    async convertCurrency (currencyFrom, currencyTo, amount) {
        let exchangeRate = 0;
        let multiply = false;
        try {
            // if it's USD to !== USD
            if (currencyFrom === 'USD' && currencyTo !== 'USD') {
                exchangeRate = await this.getDatabaseExchangeRate(currencyTo);
                // multiply to get new amount
                multiply = true;
            }
            // else if it's !== USD to USD
            else if (currencyFrom !== 'USD' && currencyTo == 'USD') {
                exchangeRate = await this.getDatabaseExchangeRate(currencyFrom);
                // divide amount by exchange rate to get back to USD
            }
            // else !== USD to !== USD
            else {
                exchangeRate = await this.getDatabaseExchangeRate(currencyTo);
                // multiply to get new amount
                multiply = true;
            }
            // check that the exchange rate was returned/exists
            if(exchangeRate && multiply) {
                // return exchanged value
                return (amount * exchangeRate).toFixed(2);
            } else if (exchangeRate && !multiply) {
                return (amount / exchangeRate).toFixed(2);
            } else {
                // throw error if exchange rate could not be found.
                throw new Error('Could not find exchange rate.');
            }
        } catch (err) {
            // catch and log err, return null value
            console.error(err);
            return null;
        } finally {
            // close db connection
            this.db.close((err) => {
                // catch and log err
                if (err) {
                    console.error('Error closing db connection', err);
                }
            })
        }
    } 
    
    /**
     * Get the exchange rate for the country ID
     * @param countryCode the 3 digit country ID (USD)
     * @returns the exchange rate associated with the country ID
     */
    async getDatabaseExchangeRate(countryCode) {
        let foundItem = {};
        try {
            // wait for db response
            foundItem = await this.queryDatabase(countryCode);
        } catch (err) {
            // catch and log error
            console.error(err);
        } finally {
            // validate foundItem and return exchange rate from obj
            if (foundItem) {
                return foundItem.exchangeRate;
            }
            // else return null
            return null;
        }
    }

    /**
     * Query the database for the country currency info
     * @param countryCode The 3 digit country ID (USD)
     * @returns the row from the db for that country ID
     */
    queryDatabase(countryCode) {
        // return query as a promise
        return new Promise((resolve, reject) => {
            // create query
            const query = `SELECT * FROM Currencies WHERE currencyCode = ?`;
            // request data from db and pass in the country code (USD)
            this.db.get(query, [countryCode], (err, row) => {
                if (err) {
                    // handle err
                    reject(err);
                } else {
                    // resolve found row
                    resolve(row);
                }
            });
        });
    }
}
const myConversion = new convertCurrency();

// This example will fail because 'COL' is not found in the database
// myConversion.convertCurrency("USD", "COL", 10).then((val) => console.log(`New value is: ${val}`));

// This example will pass because 'PHP' is found in the database
myConversion.convertCurrency("USD", "PHP", 10).then((val) => console.log(`New value is: ${val}`));

module.exports = convertCurrency;
