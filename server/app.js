const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const { combinations } = require('combinatorial-generators');
const readline = require('readline');
const path = require('path')


function csvAppend(p, fileName, dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    var filePath = path.join(dirPath, fileName);

    const csvContent = p.map(row => row.join(',')).join('\n') + '\n';

    fs.appendFile(filePath, csvContent, 'utf8', (err) => {
        if (err) {
            console.error('Error appending to file:', err);
        } 
    });
}


function generateCombinations(numbers) {
    const n = numbers.length;
    const combi = new Array();
    combi[0] = new Array();    combi[1] = new Array(); combi[2] = new Array();    combi[3] = new Array();    combi[4] = new Array();    combi[5] = new Array();  
    for (let r = n; r > 0; r--) {
        const combos = combinations(numbers, r); 
        if(r==6){
            for (const combo of combos) {
                combi[5].push(combo);
            }
        }
        else if (r==5){
            for (const combo of combos) {
                combi[4].push(combo);
            }
        }
        else if (r==4){
            for (const combo of combos) {
                combi[3].push(combo);
            }
        }
        else if (r==3){
            for (const combo of combos) {
                combi[2].push(combo);
            }
        }
        else if (r==2){
            for (const combo of combos) {
                combi[1].push(combo);
            }
        }
        else if (r==1){}
        for (const combo of combos) {
            combi[0].push(combo);
        }
    }
    return(combi);
}


function pickSets(numbers, n) {
    const sets = [];
    const setSize = 6;


    for (let i = 0; i < n; i++) {
        const startIndex = i * setSize;
        const endIndex = startIndex + setSize;
        if (endIndex <= numbers.length) {
            sets.push(numbers.slice(startIndex, endIndex));
        } else {
            console.log(`Not enough numbers to create set ${i + 1}`);
            break;
        }
    }

    return sets;
}

async function getResults(url, n, year){
    let results = []
    let pairSplits = []

    try{
        const response = await axios.get(url);
        const $=cheerio.load(response.data);
        
        const table = $('tbody');

        table.each(
            function(){         
                num = $(this).find("span.home-mini-whiteball").text();
            
                results.push(num);             
        });

        console.log(date)
        let resultString = results.toString();

        for (let i = 0; i < resultString.length; i+=2){
            let ball = resultString.split(' ').join("").substring(i, i+2);
            pairSplits.push(ball);
        }
        let p = pairSplits
        let sets = pickSets(p, 4)
    
        console.log(sets)

        const dirPath = path.join(`${year}`, `${month}`);

        
        if (fs.existsSync('1.csv') || fs.existsSync('2.csv') || fs.existsSync('3.csv') || fs.existsSync('4.csv') || fs.existsSync('5.csv') || fs.existsSync('6.csv')) {
            fs.unlinkSync('1.csv');
            fs.unlinkSync('2.csv');
            fs.unlinkSync('3.csv');
            fs.unlinkSync('4.csv');
            fs.unlinkSync('5.csv');
            fs.unlinkSync('6.csv');
        }

        for(let i = 0; i < sets.length; i++){
            let p = generateCombinations(sets[i])
            for(let j = 0; j < 6; j++){
                csvAppend(p[j],`${j+1}.csv`,dirPath)
            }
        }

        console.log("all done");

        }catch(error){
            console.error(error);
    }    
}

function GetYear(){
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    return year
}

const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  

const daysOfWeek = [0, 3, 5]; // 0: Sunday, 3: Wednesday, 5: Friday
  
function getDaysInYear(year) {
  const days = [];
  for (let month = 0; month < 12; month++) {
    let date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      if (daysOfWeek.includes(date.getDay())) {
        days.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
  }
  return days;
}

function formatNumber(number) {
  return number < 10 ? '0' + number : number;
}

function formatDays(days) {
  const result = [];
  let currentMonth = -1;
  days.forEach(date => {
    if (date.getMonth() !== currentMonth) {
      currentMonth = date.getMonth();
    }
    const day = formatNumber(date.getDate());
    const month = formatNumber(date.getMonth() + 1);
    result.push(`${day}-${month}-${date.getFullYear()}`);
  });
  return result;
}

function countDaysPerMonth(days) {
  const counts = Array(12).fill(0);
  days.forEach(date => {
    counts[date.getMonth()]++;
  });
  return counts.map((count, index) => `${monthNames[index]}: ${count}`);
}

  
const year = 2017;
const days = getDaysInYear(year);
const formattedDays = formatDays(days).join('\n');
const dayCounts = countDaysPerMonth(days);

console.log(dayCounts);
  
var url = `https://www.ketquadientoan.com/tat-ca-ky-xo-so-mega-6-45.html?datef=${date}&datet=31-12-${year}`

if(year > 2016){
    getResults(url, dayCounts, year)
}else if (year == GetYear()){
    
}



