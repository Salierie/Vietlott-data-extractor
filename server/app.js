const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const { combinations } = require('combinatorial-generators');
const path = require('path')


function generateCombinations(numbers) {
    const n = numbers.length;
    const combi = Array.from({ length: 6 }, () => []);
    for (let r = n; r > 0; r--) {
        const combos = combinations(numbers, r);
        if (r <= 6) {
            combi[r - 1].push(...combos);
        }
    }
    return combi;
}


function createDirectories(baseDir, year, month, quarter) {
    const yearDir = path.join(baseDir, year);
    const monthDir = path.join(yearDir, month);
    const quarterDir = path.join(yearDir, quarter);

    [yearDir, monthDir, quarterDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    return { yearDir, monthDir, quarterDir };
}


async function getResults(url){
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const results = [[], []]; // Initialize a multidimensional array: [dateArray, numberArray]

        // Loop through each <tr> element inside <tbody>
        $('tbody tr').each((index, element) => {
            const dateText = $(element).find('td').first().text().trim();
            const datePattern = /^(CN|T\d),\s\d{2}\/\d{2}\/\d{4}$/;

            // If the date matches the pattern, extract the numbers
            if (datePattern.test(dateText)) {
                const numbers = [];
                $(element).find('span.home-mini-whiteball').each((index, span) => {
                    numbers.push($(span).text().trim());
                });

                // Ensure there are exactly 6 numbers
                if (numbers.length === 6) {
                    results[0].push(dateText); // Add date to the dateArray
                    results[1].push(numbers); // Add numbers to the numberArray
                }
            }
        });
        
        return(results)
    } catch (error) {
        console.error('Error fetching the HTML:', error);
        return null;
    }
}

function saveCombinations(baseDir, date, combinations) {
    const [day, month, year] = date.split(', ')[1].split('/');
    const quarter = `Q${Math.ceil(parseInt(month) / 3)}`;
    const { yearDir, monthDir, quarterDir } = createDirectories(baseDir, year, month, quarter);

    combinations.forEach((combos, index) => {
        const fileName = `${index + 1}.xlsx`;
        const filePathYear = path.join(yearDir, fileName);
        const filePathMonth = path.join(monthDir, fileName);
        const filePathQuarter = path.join(quarterDir, fileName);

        const data = combos.map(combo => combo.join(',')).join('\n') +'\n';
        
        fs.writeFileSync(filePathYear, data, { flag: 'a' });
        fs.writeFileSync(filePathMonth, data, { flag: 'a' });
        fs.writeFileSync(filePathQuarter, data, { flag: 'a' });
    });
}

async function Main(url) {
    const results = await getResults(url);
    if (results) {
        const baseDir = './data_xlsx';

        results[0].forEach((date, index) => {
            const numbers = results[1][index];
            const combinations = generateCombinations(numbers);
            saveCombinations(baseDir, date, combinations);
        });

        console.log('Data processed and saved successfully.');
    } else {
        console.log('Failed to fetch or process the HTML.');
    }
}


const url = `https://www.ketquadientoan.com/tat-ca-ky-xo-so-mega-6-45.html?datef=20-07-2016&datet=16-07-2024`
Main(url);


