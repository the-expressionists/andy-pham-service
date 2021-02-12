const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/sdc-06`, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
const cors = require('cors');
const port = process.env.PORT || 8080;
const compression = require('compression');

app.use(compression());
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Connected to Port: ${port}`)
});

app.get('/similarItems/:productID/:filter/:filterValue?/:percent?', (req, res) => {
  let productID = Number(req.params.productID);
  let filter = req.params.filter;
  let methods = ['liked', 'isSale', 'isFresh'];

  let filterValue = req.params.filterValue;

  // Checks to see if the filter request is part of the methods array, if it is, it will check the documents for a value of true
  if (methods.indexOf(req.params.filter) !== -1) {
    filterValue = true;
  };

  // If the filter request is by price, set filter value to find all prices within the percentage of the incoming price value.
  // IE: price = 100; incoming percent = 10%; price range is 90% of 100 to 110% of 100, 90-110.
  if (req.params.filter === 'price') {
    let price = Number(req.params.filterValue);
    let percent = Number(req.params.percent) / 100 || .1;
    let lowerRange = Math.floor(price * (1 - percent));
    let higherRange = Math.ceil(price * (1 + percent));
    filterValue = { $gte: lowerRange, $lte: higherRange};
  };

  let filtering = {};
  filtering[filter] = filterValue;
  filtering.productID = productID;

  db.collection('products').aggregate([{$match: filtering}, {$sample: {size: 16}}]).toArray()
  .then((result) => {
    res.status(200);
    res.json(result);
  })
  .catch((err) => {
    console.error(err);
  })
})