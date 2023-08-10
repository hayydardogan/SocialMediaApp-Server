const postModel = require('../Model/postModel');
const followerRelationModel = require('../Model/followerRelationModel');


const addNewPost = async (req, res) => {
    try {
        req.body.newPost.postDate = new Date().getTime();
        const posts = await postModel.create(req.body.newPost);
        res.status(200).json({
            message: "Gönderi başarıyla paylaşıldı.",
            post: posts
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {
    let { postID } = req.params;

    try {
        await postModel.findByIdAndDelete(postID);
        res.status(200).send("Deleted");
    } catch (error) {
        console.log("There is an error : " + error.message);
    }
}

const getPosts = async (req, res) => {
    let { userID } = req.params;
    const posts = await postModel.find();
    let myPosts = [];
    let index = 0;

    posts.forEach(p => {
        let count = followerRelationModel.find({ followingUser: userID, followerUser: p.postOwner }).count();
        if (count > 0) {
            myPosts.push(p);
        }
    });

    res.status(200).send({
        myPosts
    })
}

const getMyPosts = async (req, res) => {
    let { po } = req.params;
    try {
        const posts = await postModel.find().populate({ path: "postOwner" }).sort({ postDate: -1 });
        const myPosts = []
        posts.forEach(p => {
            if (p.postOwner._id == po) {
                myPosts.push(p);
            };
        });

        res.status(200).send({
            myPosts
        })
    } catch (error) {
        console.log("There is an error : " + error.message);
    }

}

const getPostInfo = async (req, res) => {
    let { postID } = req.params;

    const post = await postModel.find({ _id: postID }).populate({ path: "postOwner", select: ["userName", "userSurname", "userImage", "_id", "userNick"] });

    if (!post) return res.status(404).json(
        {
            message: "Girilen ID değerine ait gönderi bulunamadı"
        }
    )


    return res.status(200).json({
        post
    })
}

module.exports = {
    addNewPost,
    deletePost,
    getPosts,
    getMyPosts,
    getPostInfo
}