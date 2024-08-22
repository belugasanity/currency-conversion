const convertCurrency = require('./index');

test('converts 10 USD to Equal 431.23 PHP', async () => {
    const conversion = new convertCurrency();
    let output = await conversion.convertCurrency('USD', 'PHP', 10);
    expect(Number(output)).toBe(431.23)
});