// server/index.js
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const mongoose = require('mongoose');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://0.0.0.0:27017/customerdb');

// const customerSchema = new mongoose.Schema({
//     imageSrcUrl: String,
//     customerName: String,
//     headline: String,
//     headlineUrl: String,
//     description_summary: String,
//     pageUrl: String,
//     location: String,
//     industry: String
// });

// const Customer = mongoose.model('Customer', customerSchema);

// // Fetch data from external API and store in MongoDB
// app.get('/fetch-data', async (req, res) => {
//     try {
//         let page = 1;
//         let totalItems = 280;
//         let itemsFetched = 0;

//         while (itemsFetched < totalItems) {
//             const response = await axios.get(`https://aws.amazon.com/api/dirs/items/search?item.directoryId=customer-references&sort_by=item.additionalFields.sortDate&sort_order=desc&size=9&item.locale=en_US&tags.id=GLOBAL%23industry%23financial-services%7Ccustomer-references%23industry%23financial-services&page=${page}`);
//             const items = response.data.items;

//             items.forEach(async item => {
//                 const newCustomer = new Customer({
//                     imageSrcUrl: item.imageSrcUrl,
//                     customerName: item.customerName,
//                     headline: item.headline,
//                     headlineUrl: item.headlineUrl,
//                     description_summary: item.description_summary,
//                     pageUrl: item.pageUrl,
//                     location: item.location,
//                     industry: item.industry
//                 });
//                 await newCustomer.save();
//             });

//             itemsFetched += items.length;
//             page++;
//         }

//         res.send('Data fetched and stored in MongoDB');
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// // Endpoint to get paginated data with filters
// app.get('/customers', async (req, res) => {
//     const { page = 1, limit = 15, location, industry, search } = req.query;
//     const filter = {};

//     if (location) {
//         filter.location = location;
//     }

//     if (industry) {
//         filter.industry = industry;
//     }

//     if (search) {
//         filter.$or = [
//             { customerName: { $regex: search, $options: 'i' } },
//             { description_summary: { $regex: search, $options: 'i' } }
//         ];
//     }

//     try {
//         const customers = await Customer.find(filter)
//             .limit(limit * 1)
//             .skip((page - 1) * limit)
//             .exec();

//         const count = await Customer.countDocuments(filter);

//         res.json({
//             customers,
//             totalPages: Math.ceil(count / limit),
//             currentPage: page
//         });
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });






































// server.js
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();
const cors=require('cors');
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;



app.use(cors({
  origin:"http://localhost:4200"
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// MongoDB connection
// mongoose.connect('mongodb://0.0.0.0:27017/awsdata')
mongoose.connect('mongodb://0.0.0.0:27017/awsdata');


// Define a schema and model
const itemSchema = new mongoose.Schema({
  customerLogo: String,
  customerName: String,
  headline: String,
  url: String,
  descriptionSummary: String,
  pageUrl: String,
  location: String,
  industry: String
});

const Item = mongoose.model('Item', itemSchema);

// Fetch data from AWS API
const fetchDataFromAWS = async (page = 0) => {
  const apiUrl = `https://aws.amazon.com/api/dirs/items/search?item.directoryId=customer-references&sort_by=item.additionalFields.sortDate&sort_order=desc&size=9&item.locale=en_US&tags.id=GLOBAL%23industry%23financial-services%7Ccustomer-references%23industry%23financial-services&page=${page}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data.items.map(item => ({
      customerLogo: item.imageSrcUrl,
      customerName: item.item.name,
      headline: item.headline,
      url: item.headlineUrl,
      descriptionSummary: item.description_summary,
      pageUrl: item.item.pageUrl,
      location: item.item.additionalFields.location,
      industry: item.item.additionalFields.industry
    }));
  } catch (error) {
    console.error('Error fetching data from AWS:', error);
    return [];
  }
};

// Endpoint to fetch and store data
app.get('/fetch-data', async (req, res) => {
  const items = await fetchDataFromAWS();
  await Item.insertMany(items);
  res.send('Data fetched and stored');
});

// Custom Pagination API
app.get('/items', async (req, res) => {
  const { page = 1, limit = 15, location, industry, search } = req.query;
  const filter = {};
  if (location) filter.location = location;
  if (industry) filter.industry = industry;
  if (search) filter.$or = [{ customerName: new RegExp(search, 'i') }, { descriptionSummary: new RegExp(search, 'i') }];

  const items = await Item.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  const total = await Item.countDocuments(filter);
  res.json({ total, items });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});











