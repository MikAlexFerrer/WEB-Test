// Create server
const express = require('express')
const mongoose = require('mongoose') // Database
const Article = require('./DB_models/article') // Database model
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

//Importar variables de entorno
require('dotenv').config({path: 'variables.env'})
//console.log(process.env.DB_URL);

mongoose.connect(process.env.DB_URL) // Connect to DB, no warnings

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))

app.use(express.static("public"))

// Route for localhost
app.get('/', async (req, res) =>{
    const articles = await Article.find().sort({date: 'desc'})
    res.render('articles/index', {articles: articles})  // View
})
app.use('/articles', articleRouter)

// Port
app.listen(process.env.PORT || 5000)