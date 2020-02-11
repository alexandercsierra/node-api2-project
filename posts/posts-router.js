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

router.put('/:id', (req, res)=>{
    const {id} = req.params;
    const newPost = req.body;
    //find a post by that id
    // Posts.findById(id)
    //     .then(found=>{
    //         //post with that id found
    //         if(found.length>0){
    //             //does the req contain title and contents?
    //             if(newPost.title && newPost.contents){
    //                 //ok then update it
    //                 Posts.update(id, newPost)
    //                     .then(success=>{
    //                         res.status(200).json(newPost)
    //                     })
    //                     //update failed for some reason
    //                     .catch(failed=>res.status(500).json({errorMessage: 'The post information could not be modified.'}))
    //             //req missing title or contents
    //             } else{
    //                 res.status(400).json({errorMessage:'Please provide title and contents for the post.'})
    //             }
    //         //there was no post found at that id
    //         } else {
    //             res.status(404).json({errorMessage: 'The post with the specified ID does not exist.'})
    //         }
    //     //server error
    //     })
    //     .catch(notFound=>res.status(500).json({errorMessage: 'The post information could not be modified.'}))

    Posts.update(id, newPost)
        .then(post=>{
            if (post){
                if(newPost.title && newPost.contents){
                    res.status(200).json(newPost)
                } else {
                    res.status(400).json({errorMessage:'Please provide title and contents for the post.'})
                }
            } else {
                res.status(404).json({errorMessage: 'The post with the specified ID does not exist.'})
            }
        })
        //update failed for some reason
        .catch(failed=>res.status(500).json({errorMessage: 'The post information could not be modified.'}))


    
})

router.delete('/:id', (req, res)=>{
    const {id} = req.params;
    Posts.remove(id)
        .then(post => {
            post ? res.status(200).json(post) : res.status(404).json({errorMessage: 'user not found'})
        })
        .catch(post=>{
            console.log(error);
            res.status(500).json({erorrMessage:'The post could not be removed'})
        })
  
})

module.exports = router;