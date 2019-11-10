- unique keys with custom messages for express handling to be more compact

# GREAT NEW THINGS TO DO TO GUARANTEE SECURITY

- ENABLE HTTPS FOR COMMUNICATION!!

# GREAT CHANGES TO INCREASE PERFORMANCE

- check for uneccessary DB CALLS and remove them

# DEFINITE CHANGES TO MAKE

- unescape fields after they were found --> GET community

- limit the response size to a certain amount
- allow paging with the limit of size and skipping

- ADD UPVOTE SAVE PRE MIDDLEWARE TO CHECK IF UPVOTE IS OVER 0

# POSSIBLE CHANGES

- add success property to each response for integrity of the responses

# Questions:

- do you need to validate the req.params.id? Because I think mongoose cast it automatically to ObjectID
- FOR PICTURES: do you use any of those:
- app.use(express.static('uploads'));
- app.use(express.static('files'));
  --> for uploaded images to the server?
