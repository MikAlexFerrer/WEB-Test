const mongoose = require('mongoose') // Database
const marked = require('marked')
const slugify = require('slugify') // article title in URL instead of long id
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)


const articleSchema = new mongoose.Schema({
    // Blog post variables
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    cover: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    safeHTML: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next){
    if (this.title){
        this.slug = slugify(this.title, {lower: true, strict: true}) // optimize aticle title for url
    }

    if (this.markdown){
        this.safeHTML = dompurify.sanitize(marked(this.markdown)) // remove malicious code from markdown
    }
    next()
})

module.exports = mongoose.model('Artcile', articleSchema)