const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('currencies.db');

// Create the table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Currencies (
            currencyID INTEGER PRIMARY KEY,
            currencyCode TEXT NOT NULL,
            exchangeRate REAL NOT NULL
        )
    `);

    // Default data to be inserted
    const seedData = [
        {
            "currencyID": 1,
            "currencyCode": "USD",
            "exchangeRate": 1.0
        },
        {
            "currencyID": 2,
            "currencyCode": "PHP",
            "exchangeRate": 43.1232
        }
    ];

    // Template insert statement
    const templateStatement = db.prepare(`
        INSERT INTO Currencies (currencyID, currencyCode, exchangeRate)
        VALUES (?, ?, ?)
    `);

    // Insert each entry into the table
    seedData.forEach((entry) => {
        templateStatement.run(entry.currencyID, entry.currencyCode, entry.exchangeRate);
    });

    // Finalize the statement
    templateStatement.finalize();
});

// Close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database and table created, data seeded successfully.');
});