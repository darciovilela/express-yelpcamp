const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose
  .connect('mongodb://localhost:27017/yelp-camp', {
    useNewURLParser: true,
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('Mongo connection error');
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random20 = Math.floor(Math.random() * 20);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: '615b823e9f51762a6fb6a329',
      location: `${cities[random20].city}, ${cities[random20].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sit esse laboriosam a delectus aliquid ducimus dignissimos. Dolor, exercitationem, harum fugit cumque accusamus laudantium quisquam quasi, nisi autem mollitia ab?',
      price,
      geometry: {
        type: 'Point',
        coordinates: [cities[random20].longitude, cities[random20].latitude],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dmzylphyc/image/upload/v1634330846/YelpCamp/e49iuf4lymc9qesqtdmb.jpg',
          filename: 'YelpCamp/e49iuf4lymc9qesqtdmb',
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
