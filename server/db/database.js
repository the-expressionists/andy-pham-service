const mongoose = require('mongoose');
const faker = require('faker');
mongoose.connect(`mongodb://localhost/sdc-06`, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

faker.locale = "en";

var random = {
  itemID: function() {
    return faker.random.alphaNumeric(25)
  },
  price: function() {
    return faker.random.number(1000)
  },
  reviews: function() {
    return faker.random.number(999)
  },
  averageRating: function() {
    return faker.random.number(5)
  },
  productID: function() {
    return faker.random.number({'min': 1, 'max': 100})
  }
  image: function() {
    return `https://loremflickr.com/320/240?${faker.random.word()}`
  }
}


const similarProductSchema = new mongoose.Schema({
  productID: {type: Number, default: random.productID},
  itemID: {type: String, default: random.itemID},
  price: {type: Number, default: random.price},
  reviews: {type: Number, default: random.reviews},
  averageRating: {type: Number, default: random.averageRating},
  category: {type: String, default: faker.commerce.department},
  color: {type: String, default: faker.commerce.color},
  carouselImages: {
    main: {
      type: String,
      default: random.image
    },
    hover: {
      type: String,
      default: random.image
    }
  },
  variants: {type: Boolean, default: faker.random.boolean},
  liked: {type: Boolean, default: faker.random.boolean},
  isSale: {type: Boolean, default: faker.random.boolean},
  isFresh: {type: Boolean, default: faker.random.boolean},
  name: {type: String, default: faker.commerce.productName}
});

const SimilarProduct = mongoose.model('product', productSchema);

module.exports.SimilarProduct = SimilarProduct;