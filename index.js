/**
 * Testing the rent calculator page of Sparkasse Bank using WebDriverIO
 * @author: John Rodriguez
 */
const { remote } = require('webdriverio');

(async () => {
    const browser = await remote({
        logLevel: 'trace',
        capabilities: {
            browserName: 'chrome'
        }
    });

    //Assuming a rent of 500 Euros and a increase rate of 5% for testing pruposes
    const rent = 500;
    const increase = 5;
    const interest = increase / 100;

    await browser.url('https://www.sparkasse.de/service/rechner/mietrechner.html'); 
    
    // Finding the input fields for monthly rent and yearly increasing and assigning predefined values
    const inputRent = await browser.$('#mr-mtl-miete');
    const inputIncrease = await browser.$('#mr-mietsteigerung');
    await inputRent.setValue(rent);
    await inputIncrease.setValue(increase);

    //Finding and clicking the calculate button
    const calculate = await browser.$('//*[@id="calculator_mietrechner_root"]/div/fieldset/div/div[3]/div/a');
    await calculate.waitForClickable(1000);
    await calculate.click();
    
    //Timeout to get the resulting values
    await browser.setTimeout({'script': 2000});
    await browser.executeAsync((wait) => {
        setTimeout(wait, 1900);
    });

    //Formating and comparing the results of the calculator with the expected values
    //Using the compound interest formula to find the expected values
    const rentIn10Years = (rent*Math.pow((1+interest), 9)).toFixed(2);
    const rentIn20Years = (rent*Math.pow((1+interest), 19)).toFixed(2);
    const rentIn30Years = (rent*Math.pow((1+interest), 29)).toFixed(2);
    const rentIn40Years = (rent*Math.pow((1+interest), 39)).toFixed(2);

    //Using the capitalization factor to find the future value or the total ammount
    const totalIn10Years = (rent*(Math.pow((interest+1),9)/interest)*12).toFixed(2);
    const totalIn20Years = (rent*(Math.pow((interest+1),19)/interest)*12).toFixed(2);
    const totalIn30Years = (rent*(Math.pow((interest+1),29)/interest)*12).toFixed(2);
    const totalIn40Years = (rent*(Math.pow((interest+1),39)/interest)*12).toFixed(2);

    //Formating the values to string
    let expectedRentIn10Years = String(rentIn10Years);
    let expectedRentIn20Years = String(rentIn20Years);
    let expectedRentIn30Years = String(rentIn30Years);
    let expectedRentIn40Years = String(rentIn40Years);
    let expectedAmmountIn10Years = String(totalIn10Years);
    let expectedAmmountIn20Years = String(totalIn20Years);
    let expectedAmmountIn30Years = String(totalIn30Years);
    let expectedAmmountIn40Years = String(totalIn40Years);

    console.log('expected rent per month in 10 years: ', expectedRentIn10Years);
    console.log('expected rent per month in 20 years: ', expectedRentIn20Years);
    console.log('expected rent per month in 30 years: ', expectedRentIn30Years);
    console.log('expected rent per month in 40 years: ', expectedRentIn40Years);
    console.log('expected ammount in 10 years: ', expectedAmmountIn10Years);
    console.log('expected ammount in 20 years: ', expectedAmmountIn20Years);
    console.log('expected ammount in 30 years: ', expectedAmmountIn30Years);
    console.log('expected ammount in 40 years: ', expectedAmmountIn40Years);

    const rentPerMonthIn10Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[1]/td[2]')).getText();
    const rentPerMonthIn20Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[2]/td[2]')).getText();
    const rentPerMonthIn30Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[3]/td[2]')).getText();
    const rentPerMonthIn40Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[4]/td[2]')).getText();
    const totalAmmountIn10Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[1]/td[3]')).getText();
    const totalAmmountIn20Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[2]/td[3]')).getText();
    const totalAmmountIn30Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[3]/td[3]')).getText();
    const totalAmmountIn40Years = await (await browser.$('//*[@id="mr-miettabelle"]/table/tbody/tr[4]/td[3]')).getText();

    let calculatedRent10Years = rentPerMonthIn10Years.replace(',','.');
    if(calculatedRent10Years[1] === '.') {
        calculatedRent10Years = calculatedRent10Years.replace('.','');
    }
    let calculatedRent20Years = rentPerMonthIn20Years.replace(',','.');
    if(calculatedRent20Years[1] === '.') {
        calculatedRent20Years = calculatedRent20Years.replace('.','');
    }
    let calculatedRent30Years = rentPerMonthIn30Years.replace(',','.');
    if(calculatedRent30Years[1] === '.') {
        calculatedRent30Years = calculatedRent30Years.replace('.','');
    }
    let calculatedRent40Years = rentPerMonthIn40Years.replace(',','.');
    if(calculatedRent40Years[1] === '.') {
        calculatedRent40Years = calculatedRent40Years.replace('.','');
    }
    let calculatedAmmount10Years = totalAmmountIn10Years.replace(',','.');
    if(calculatedAmmount10Years[2] === '.' || calculatedAmmount10Years[3] === '.') {
        calculatedAmmount10Years = calculatedAmmount10Years.replace('.','');
    }
    let calculatedAmmount20Years = totalAmmountIn20Years.replace(',','.');
    if(calculatedAmmount20Years[2] === '.' || calculatedAmmount20Years[3] === '.') {
        calculatedAmmount20Years = calculatedAmmount20Years.replace('.','');
    }
    let calculatedAmmount30Years = totalAmmountIn30Years.replace(',','.');
    if(calculatedAmmount30Years[2] === '.' || calculatedAmmount30Years[3] === '.') {
        calculatedAmmount30Years = calculatedAmmount30Years.replace('.','');
    }
    let calculatedAmmount40Years = totalAmmountIn40Years.replace(',','.');
    if(calculatedAmmount40Years[2] === '.' || calculatedAmmount40Years[3] === '.') {
        calculatedAmmount40Years = calculatedAmmount40Years.replace('.','');
    }

    console.log('calculated rent per month in 10 years: ', calculatedRent10Years);
    console.log('calculated rent per month in 20 years: ', calculatedRent20Years);
    console.log('calculated rent per month in 30 years: ', calculatedRent30Years);
    console.log('calculated rent per month in 40 years: ', calculatedRent40Years);
    console.log('calculated ammount in 10 years: ', calculatedAmmount10Years);
    console.log('calculated ammount in 20 years: ', calculatedAmmount20Years);
    console.log('calculated ammount in 30 years: ', calculatedAmmount30Years);
    console.log('calculated ammount in 40 years: ', calculatedAmmount40Years);

    //Comparing the expected and calculated rent per month in the future
    if (calculatedRent10Years.includes(expectedRentIn10Years)
        && calculatedRent20Years.includes(expectedRentIn20Years)
        && calculatedRent30Years.includes(expectedRentIn30Years)
        && calculatedRent40Years.includes(expectedRentIn40Years)) {
            console.log('The rent calculator works well!');
    } else {
        console.log('Rent: The calculated values do not match with the expected ones!');
    }

    //Comparing the expected and calculated ammount
    if (calculatedAmmount10Years.includes(expectedAmmountIn10Years)
        && calculatedAmmount20Years.includes(expectedAmmountIn20Years)
        && calculatedAmmount30Years.includes(expectedAmmountIn30Years)
        && calculatedAmmount40Years.includes(calculatedAmmount40Years)) {
            console.log('The ammount calculator works well!');
    } else {
        console.log('Ammount: The calculated values do not match with the expected ones!');
    }

    //Finishing the testing session
    await browser.deleteSession();
})().catch((e) => console.error(e));
