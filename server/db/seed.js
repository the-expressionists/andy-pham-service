const mongoose = require('mongoose');
const db = require('./database.js');

let seedDatabase = async () => {
  let batch = 1;
  console.time('total');
  for (var i = 0; i < 143; i++) {
    // var emptyArray = new Array(50000);
    // emptyArray.fill(new db.Product());
    console.log(`seeding batch #${batch}`);
    console.time('seeding');
    await db.Product.insertMany(Array.apply(null, Array(70000)))
    .then(() => {
      batch++;
      console.timeEnd('seeding');
    })
    .catch((error) => {
      console.log(error);
    })
    // .then(() => {
    //   buckets()
    // })
    // .catch((error) => {
    //   console.error(error);
    // })
  }
console.timeEnd('total');
}


// Sets up an array with numbers from 0 to 100
var boundaries = [...Array(101).keys()];

// Bucketing still needs work
var buckets = () => {
  console.time('bucket');
  db.SimilarProduct.aggregate([
    {
      $bucket: {
        groupBy: '$productID',
        boundaries: boundaries, // Groups the documents based on their productID property for a value inside of the boundaries array
        default: "Other", // If any document's groupBy property's value isn't in the boundaries, group those outliers together
        output: {
          "count": { $sum: 1}, // count propery increases by one for every document grouped into this bucket
          "products" : { // Creates a products array within the bucket
            $push: { // Pushes an object containing the grouped document's info
              "category": "$category",
              "color": "$color",
              "price": "$price",
              "reviews": "$reviews",
              "averageRating": "$averageRating",
              "carouselImages": "$carouselImages",
              "variants": "$variants",
              "liked": "$liked",
              "isSale": "$isSale",
              "isFresh": "$isFresh",
              "name": "$name",
              "productID": "$productID",
              "itemID": "$itemID"
            }
          }
        }
      }
    },
    {
      $out: "products" // saves the bucket in the specified collection, if it exists, overwrite the collection.
    }
  ]).option({"allowDiskUse": true})
  .then(() => {
    console.timeEnd('bucket');
  })
  .catch((error) => {
    console.error(error);
  })
};

seedDatabase();