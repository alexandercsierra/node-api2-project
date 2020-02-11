const express = require("express");
const Posts = require("../data/db")
const router = express.Router();

router.get('/', (req, res)=>{
    Posts.find()
        .then(posts=>{
            res.status(200).json(posts)
        })
        .catch(err => res.send(500).json({errorMessage: 'The posts information could not be retrieved.'}))
})

router.get('/:id', (req, res)=>{
    const {id} = req.params;
    Posts.findById(id)
        .then(post=>{
            post.length > 0 ? res.status(200).json(post) : res.status(404).json({errorMessage: 'The post with the specified ID does not exist.'})
        })
        .catch(err=>res.status(500).json({errorMessage: 'The post information could not be retrieved'}))
})

router.get('/:id/comments', (req, res)=>{
    const {id} = req.params;
    Posts.findPostComments(id)
        .then(comments=>{
            comments.length > 0 ? res.status(200).json(comments) : res.status(404).json({errorMessage: 'The post with the specified ID does not exist.'})
        })
        .catch(err=>res.status(500).json({errorMessage: 'The comments information could not be retrieved.'}))
})

router.post('/', (req, res)=>{
    const newPost = req.body;
    if(newPost.title && newPost.contents){
        Posts.insert(newPost)
            .then(success=>res.status(201).json(newPost))
            .catch(failure=>res.status(500).json({errorMessage:'There was an error while saving the post to the database'}))       
    } else {
        res.status(400).json({errorMessage:'Please provide title and contents for the post'})
    }
})

router.post('/:id/comments', (req, res)=>{
    const comment = req.body;
    const {id} = req.params;
    comment.post_id = id;
    Posts.findById(id)
        .then(post=>{
            if(post.length > 0){
                if(comment.text){
                    Posts.insertComment(comment)
                        .then(newComment=>{
                            res.status(201).json(newComment)
                        })
                        .catch(err=>res.status(500).json({errorMessage: 'There was an error while saving the post to the database'}))
                }else {
                    res.status(400).json({errorMessage: "Please provide text for the comment."})
                }
            } else {
                res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
            }
        })
        .catch(err=>res.status(500).json({errorMessage: 'There was an error while saving the comment to the database'}))
    



})


module.exports = router;