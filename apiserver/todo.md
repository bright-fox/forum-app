- unique keys with custom messages for express handling to be more compact

# GREAT NEW THINGS TO DO TO GUARANTEE SECURITY

- ENABLE HTTPS FOR COMMUNICATION!!

# GREAT CHANGES TO INCREASE PERFORMANCE

- check for uneccessary DB CALLS and remove them

# DEFINITE CHANGES TO MAKE

- add hash value on posts and comments to identify spam?
- add Object.assign() function for cleaner code for PUT routes

# POSSIBLE CHANGES

- make response docs consistent and call it "docs"?
- clean up error handling and status codes
- remove hooks with Promise.all? So it resolves or fail together?

# Questions:

- do you need to validate the req.params.id? Because I think mongoose cast it automatically to ObjectID
- FOR PICTURES: do you use any of those:
- app.use(express.static('uploads'));
- app.use(express.static('files'));
  --> for uploaded images to the server?

  # BUGS

  - When a post has 1 postvote and you try to downvote it again, it will delete the upvote and result in an error
