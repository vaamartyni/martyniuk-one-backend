import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        // const errs = validationResult(req);
        // if (!errs.isEmpty()){
        //     return res.status(400).json(errs.array())
        // }
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });
        const post = await doc.save();

        res.json(post)
    } catch (e) {
        console.log(e);
        res.status(500).json({
        message: "an error occurred while creating post"
        });
    }
}
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.send(posts)
    } catch (e) {
        console.log(e);
        res.status(500).json({
        message: "an error occurred while getting all posts"
        });
    }
}
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
            _id: postId
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: "after",
            },
            (err, doc) => {
                if (err){
                    throw err
                }

                if (!doc){
                    return res.status(404).send({
                        message: "Couldn't find the post"
                    })
                }
                res.send(doc)
            }
            ).populate('user')
    } catch (e) {
        console.log(e);
        res.status(500).json({
        message: "an error occurred while getting all posts"
        });
    }
}
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete(
            {
                _id: postId
                },
            (err, doc) => {
                if (err){
                    return res.status(404).send({
                        message: "Couldn't remove the post"
                    })
                }

                if (!doc){
                    return res.status(404).send({
                        message: "Couldn't find the post"
                    })
                }
                res.send({
                    success: true,
                })
            }
        )
    } catch (e) {
        console.log(e);
        res.status(500).json({
        message: "an error occurred while getting all posts"
        });
    }
}
export const update = async (req, res) => {
    try {
        const postId = req.params.id
        await PostModel.updateOne(
            {
                _id: postId
            },
            {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });
        console.log('Post updated success')
        res.send({
            success: true
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
        message: "an error occurred while updating the post"
        });
    }
}

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map((post) => post.tags).flat().slice(0, 5).filter(function(item, pos, self) {
            return self.indexOf(item) === pos;
        });
        res.send(tags)
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "an error occurred while getting all posts"
        });
    }
}