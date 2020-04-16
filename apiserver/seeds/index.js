import mongoose from "mongoose";
import config from "config";

import User from "../models/user";
import Community from "../models/community"
import Post from "../models/post";
import Comment from "../models/comment";

const numberOfCommunities = 3;
const numberOfPosts = 33;
const numberOfComments = 5;

// connect to database
console.log("Connecting from database..");
mongoose.connect(config.DBHost, { useNewUrlParser: true, useCreateIndex: true, poolSize: 10 });

mongoose.connection.on("open", async () => {
    // reset database
    console.log("Resetting the database..");
    mongoose.connection.db.dropDatabase();

    // create seeds
    console.log("Inserting the seeds..");
    const data = ["first", "second", "third"];
    const gender = ["male", "female", "others"];

    for (let i = 0; i < numberOfCommunities; i++) {
        // users
        const user = new User({
            username: `${data[i]}user`,
            email: `${data[i]}@mail.com`,
            password: "password",
            biography: "Nothing to be seen here.",
            gender: gender[i]
        })
        const savedUser = await user.save();

        // communities
        const community = new Community({
            name: `${data[i]}community`,
            creator: savedUser._id,
            description: "The only community that you need to join!"
        });
        const savedCommunity = await community.save();

        // posts
        for (let j = 0; j < numberOfPosts; j++) {
            const post = new Post({
                title: `Post ${j + 1}`,
                content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                community: savedCommunity._id,
                author: savedUser._id
            })
            const savedPost = await post.save();

            // comments
            for (let k = 0; k < numberOfComments; k++) {
                const comment = new Comment({
                    content: `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam.`,
                    author: savedUser._id,
                    post: savedPost._id
                })

                await comment.save();
            }
        }
    }

    // report
    const users = await User.find({}).exec();
    console.log(`\t${users.length} users added`);
    const communities = await Community.find({}).exec();
    console.log(`\t${communities.length} communities added`);
    const posts = await Post.find({}).exec();
    console.log(`\t${posts.length} posts added`);
    const comments = await Comment.find({}).exec();
    console.log(`\t${comments.length} comments added`);

    // disconnect from database
    console.log("Disconnecting from database..");
    mongoose.connection.close();
})

