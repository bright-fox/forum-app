import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import User from "../models/user"
import Refreshtoken from "../models/refreshtoken"
import Community from "../models/community";
import Post from "../models/post";
import PostVote from "../models/postVote"
import Comment from "../models/comment"
import CommentVote from "../models/commentVote";

let userId;
let idToken;
let postId;
let commentId;

beforeAll(async done => {
    await resetCollections();
    const res = await request(app)
        .post("/register")
        .send({ username: "testperson", password: "password", email: "test@person.com", biography: "", gender: "male" });
    idToken = res.body.idToken;
    userId = res.body.user._id;

    const community = new Community({
        name: "testlovers",
        description: "We love to test REST APIs",
        creator: userId
    });
    const createdCommunity = await community.save();

    const post = new Post({
        title: "testpost",
        content: "test content",
        author: userId,
        community: createdCommunity._id
    });
    const createdPost = await post.save();
    postId = createdPost._id;

    const comment = new Comment({ post: postId, author: userId, content: "Test Comment" });
    const createdComment = await comment.save();
    commentId = createdComment._id;

    done();
});

afterAll(async () => {
    await resetCollections();
    await mongoose.disconnect();
});

describe("Post Vote Routes", () => {
    let pvId;

    test("it should get votes of one user for all queried posts and throw a 404 error", async done => {
        const res = await request(app).get(`/votes/posts?ids=${postId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(404);
        done();
    })

    test("it should get votes of one user for a post and throw a 404 error", async done => {
        const res = await request(app).get(`/votes/posts/${postId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(404);
        done();
    })

    test("it should vote for post and update upvotes field of post and no update for karma", async done => {
        const res = await request(app)
            .post(`/votes/posts/${postId}`)
            .set("Authorization", "bearer " + idToken)
            .send({ vote: 1 });

        pvId = res.body.postVote._id;

        const postRes = await request(app).get(`/posts/${postId}`);
        const userRes = await request(app).get(`/users/${userId}`);

        expect(res.statusCode).toEqual(200);
        expect(postRes.body.post.upvotes).toEqual(1);
        expect(userRes.body.user.karma).toEqual(1);
        done();
    });

    test("it should get the votes for queried posts sucessfully", async done => {
        const res = await request(app).get(`/votes/posts?ids=${postId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("postVotes");
        done();
    })

    test("it should get the votes of one user for a post sucessfully", async done => {
        const res = await request(app).get(`/votes/posts/${postId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("postVote");
        done();
    })

    test("it should vote for post and get error", async done => {
        const res = await request(app)
            .post(`/votes/posts/${postId}`)
            .set("Authorization", "bearer " + idToken)
            .send({ vote: 1 });

        expect(res.statusCode).toEqual(409);
        done();
    });

    test("it should delete vote", async done => {
        const res = await request(app)
            .delete(`/votes/${pvId}/posts`)
            .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("docId");
        done();
    });
});

describe("Comment Vote Routes", () => {
    let cvId;
    test("it should get the votes of one user for all comments and throw a 404 error", async done => {
        const res = await request(app).get(`/votes/comments?ids=${commentId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(404);
        done();
    })

    test("it should get the votes of one user for a comment and throw a 404 error", async done => {
        const res = await request(app).get(`/votes/comments/${commentId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(404);
        done();
    })

    test("it should vote for comment and update upvotes field of comment and no update for karma", async done => {
        const res = await request(app)
            .post(`/votes/posts/${postId}/comments/${commentId}`)
            .set("Authorization", "bearer " + idToken)
            .send({ vote: 1 });

        cvId = res.body.commentVote._id;

        const commentRes = await request(app).get(`/posts/${postId}/comments/${commentId}`);
        const userRes = await request(app).get(`/users/${userId}`);

        expect(res.statusCode).toEqual(200);
        expect(commentRes.body.comment.upvotes).toEqual(1);
        expect(userRes.body.user.karma).toEqual(1);
        done();
    });

    test("it should get the votes for queried sucessfully", async done => {
        const res = await request(app).get(`/votes/comments?ids=${commentId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("commentVotes");
        done();
    })

    test("it should get the votes of one user for a comment sucessfully", async done => {
        const res = await request(app).get(`/votes/posts/${postId}/comments/${commentId}`).set("Authorization", "bearer " + idToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("commentVote");
        done();
    })

    test("it should vote for comment and get an error", async done => {
        const res = await request(app)
            .post(`/votes/posts/${postId}/comments/${commentId}`)
            .set("Authorization", "bearer " + idToken)
            .send({ vote: 1 });

        expect(res.statusCode).toEqual(409);
        done();
    });

    test("it should delete vote", async done => {
        const res = await request(app)
            .delete(`/votes/${cvId}/posts/${postId}/comments`)
            .set("Authorization", "bearer " + idToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("docId");
        done();
    });
});

async function resetCollections() {
    await User.deleteMany({}).exec();
    await Refreshtoken.deleteMany({}).exec();
    await Community.deleteMany({}).exec();
    await Post.deleteMany({}).exec();
    await PostVote.deleteMany({}).exec();
    await Comment.deleteMany({}).exec();
    await CommentVote.deleteMany({}).exec();
}