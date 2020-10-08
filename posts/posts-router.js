const express = require("express");
//const { remove } = require("../data/db");
const posts = require("../data/db");

const router = express.Router();

router.get("/posts", (req, res)=> {
    posts
    .find()
    .then((posts) => {
        res.status(200).json(posts);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "The posts information could not be retrieved."
        });
    });
})

router.get("/posts/:id", (req,res)=> {
    posts
    .findById(req.params.id)
    .then((post)=> {
        if(post) {
            return res.status(200).json(post)
        } else {
            return res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            message: "The posts information could not be retrieved."
        });
    })

})

router.get("/posts/:id/comments", (req, res) => {
    posts
    .findPostComments(req.params.id)
    .then((comments)=> {
        if(comments) {
            return res.status(200).json(comments)
        } else {
            return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: "The comments information could not be retrieved."
        });
    })
})

router.post("/posts", (req,res) => {
    if(!req.body.title || !req.body.contents)
    {   
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
    posts
    .insert(req.body)
    .then((post) => {
        res.status(201).json(post);
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: "There was an error while saving the post to the database",
        });
      });
})

router.post("/posts/:id/comments", (req, res) => {
    if(!req.body.text){
        return res.status(400).json({
            errorMessage: "Please provide text for the comment",
        })
    }
    posts
    .insertComment(req.body, req.params.id)
    .then((comment) => {
        if (comment){
            return res.status(201).json(comment);
        } else {
            return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: "There was an error while saving the comment to the database",
        });
      });
})


router.put("/posts/:id", (req,res) => {
    if(!req.body.title || !req.body.contents)
    {   
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
    posts
    .update(req.params.id, req.body)
    .then((post) => {
        if (post){
            return res.status(201).json(post);
        } else {
            return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: "The post information could not be modified.",
        });
      });
})

router.delete("/posts/:id", (req,res) => {
    posts
    .remove(req.params.id)
    .then((post)=>{
        if (post) {
            return res.status(200).json({
                message: "Post has been deleted"
            })
        } else {
            return res.status(404).json({
                message: "Post to delete not found"
            })
        }
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: "There was an error trying to delete the post"
        });
    });
})
    module.exports = router;