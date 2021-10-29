//This is the article router
const express = require('express')
const Article = require('./../DB_models/article') // Import DB
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) res.redirect('/') // if article not found, redirect to homepage
    res.render('articles/show', { article: article })
})

// Create new article (async function)
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveAndRedirect('new'))

// Edit article
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))

// Delete an article (async function)
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        // Default image
        if (req.body.cover == ""){
            article.cover = "imgs/default_img.png"
        } else {
            article.cover = req.body.cover //img
        }

        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`/articles/${path}`, { article: article })
        }
    }
}

module.exports = router