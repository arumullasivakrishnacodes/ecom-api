const port = process.env.PORT || 4000;

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());

app.use(cors());

// DataBase Connection with Mongodb
mongoose.connect('mongodb+srv://arumullasivakrishna6:Siva123@cluster0.ywbyysd.mongodb.net/ecommerce');


//API Creation

app.get('/', (req,res) => {
    res.send('Expree App is Running');
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './Upload/Images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.use('/images',express.static('Upload/Images'));

// Creating Upload Endpoint for Images
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

app.listen(port,(error) => {
    if (!error) {
        console.log('Server Running on Port' + port);
    } else {
        console.log('Error : ' + error);
    }
});

// Schema for creating products
const Product = mongoose.model('Product', {
    id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    list_price: {
        type: Number,
        required: true
    },
    sale_price: {
        type: Number,
        required: true
    },
    availability: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
});

//Endpoint for AddProduct
app.post('/addproduct', async (req,res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products.slice(-1)[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        sale_price: req.body.sale_price,
        list_price: req.body.list_price,
        availability: req.body.availability
    });
    await product.save();
    res.json({
        success: true,
        product: req.body.name
    })
});

//Creating API for getting allProducts
app.get('/allproducts', async (req,res) => {
    let products = await Product.find({});
    res.send(products);
});