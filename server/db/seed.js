const mongoose = require('mongoose');
const db = require('./database.js');
const fs = require('fs').promises;
const child_process = require('child_process');

const resetCrg = () => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}
const writeProgress = (prog, limit) => {
  resetCrg();
  let tenth = (prog / limit * 10);
  let progBar = ('[' + '='.repeat(tenth * 2) + '>'.repeat(tenth < 10)).padEnd(21) + ']';
  process.stdout.write(`Progress: ${(tenth * 10).toFixed(0)}%`.padEnd(20) + progBar);
}

const endProgress = () => {
  resetCrg();
  process.stdout.write(`Progress: 100%`.padEnd(20) + `[${'='.repeat(20)}]\n`);
}

let createDocument = () => {
  let documents = [];
  for (var i = 0; i < 500000; i++) {
    documents.push({
      productID: db.random.productID(),
      itemID: db.random.itemID(),
      price: db.random.price(),
      reviews: db.random.reviews(),
      averageRating: db.random.averageRating(),
      category: faker.commerce.department(),
      color: faker.commerce.color(),
      carouselImages: {
        main: db.random.image(),
        hover: db.random.image()
      },
      variants: faker.random.boolean(),
      liked: faker.random.boolean(),
      isSale: faker.random.boolean(),
      name: faker.commerce.productName()
    })
  }
  return documents;
}

let seedDatabase = async () => {
  console.time('total');
  console.log('Initalizing seeding mode');

  let path = './db/documentBatch.json'

  for (let batch = 0; batch < 20; batch++) {
    writeProgress(batch, 20);
    let newDocuments = JSON.stringify(createDocument());
    await fs.writeFile(path, newDocuments);
    await child_process.execSync('mongoimport --db=expressionists --collection=products --file=db/documentBatch.json --jsonArray');
    await fs.unlink(path)
    .then(() => {
      console.log('Delted JSON');
    })
    .catch((err) => {
      console.error(err)
    })
  };


  endProgress();
  console.log('Seeding resolved');
  console.timeEnd('total');

};

seedDatabase();