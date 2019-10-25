const fs = require('fs');
const csv = require('csvtojson');

const res = [];
csv({
  delimiter: ';',
  toArrayString: true
})
  .fromFile('../data/rewards.csv')
  .on('json', data => {
    const line = {};
    for (cell in data) {
      if (cell === 'completion_date') {
        const date = new Date(data[cell]);
        line[cell] = new Date(Date.UTC(date.getMonth() > 10 ? 2016 : 2017, date.getMonth(), date.getDate())).toISOString();
      } else {
        console.log(data[cell].replace('€', '').replace(',', ''));
        line[cell] = +(data[cell].replace(/€/g, '').replace(/,/g, ''));
      }
    }
    res.push(line);
  })
  .on('done', (error) => {
    fs.writeFile('../data/rewards.json', JSON.stringify(res, null, 2), {}, (err) => {
      console.log(err || 'done writing');
    });
  });