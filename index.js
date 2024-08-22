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

    /**
     * Add a new country exchange info
     * @param countryCode Country 3 digit code to be inserted
     * @param exchangeRate Country Exchange rate
     */
    createNewRecord (countryCode, exchangeRate) {
        const query = `INSERT INTO Currencies (currencyCode, exchangeRate) VALUES (?, ?)`;
        this.db.run(query, [countryCode, exchangeRate], function(err) {
            if (err) {
                console.error('Error inserting currency:', err.message);
                return;
            }
            console.log('New currency inserted with ID:', this.lastID);
        });
        // close db connection
        this.db.close((err) => {
            // catch and log err
            if (err) {
                console.error('Error closing db connection', err);
            }
        });
    }

    /**
     * Read the record for a given country code
     * @param countryCode country 3 digit code
     */
    readRecord (countryCode) {
        const query = `SELECT * FROM Currencies WHERE currencyCode = ?`;
        this.db.get(query, [countryCode], (err, row) => {
            if (err) {
                console.error(err);
            } else {
                if (row) {
                    console.log(`Row ${row.currencyID} data is: ${row.currencyCode} has an exchange rate of ${row.exchangeRate}`);
                }
            }
        });
        // close db connection
        this.db.close((err) => {
            // catch and log err
            if (err) {
                console.error('Error closing db connection', err);
            }
        });
    }

    /**
     * Update the record for the given country code
     * @param countryCode country 3 digit code
     * @param newExchangeRate the new exchange rate for the given country code
     */
    updateRecord (countryCode, newExchangeRate) {
        const query = `UPDATE Currencies SET exchangeRate = ? WHERE currencyCode = ?`;
        this.db.run(query, [newExchangeRate, countryCode], function(err) {
            if (err) {
                console.error(err);
            }
            console.log(`Row(s) updated: ${this.changes}`);
        });
        // close db connection
        this.db.close((err) => {
            // catch and log err
            if (err) {
                console.error('Error closing db connection', err);
            }
        });
    }
}
const myConversion = new convertCurrency();

// This example will fail because 'COL' is not found in the database
// myConversion.convertCurrency("USD", "COL", 10).then((val) => console.log(`New value is: ${val}`));

// This example will pass because 'PHP' is found in the database
// myConversion.convertCurrency("USD", "PHP", 10).then((val) => console.log(`New value is: ${val}`));

// create new row
// myConversion.createNewRecord("COL", 0.756);

// read record
// myConversion.readRecord('COL');

// update record
myConversion.updateRecord('COL', 12.33);

module.exports = convertCurrency;
