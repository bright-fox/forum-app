- unique keys with custom messages for express handling to be more compact

# GREAT NEW THINGS TO DO TO GUARANTEE SECURITY

- ENABLE HTTPS FOR COMMUNICATION!!
- REMOVE PASSWORDS FROM THE ROUTE RESPONSES

# GREAT CHANGES TO INCREASE PERFORMANCE

- the function "checkDocOwnership already makes a DB CALL, so maybe pass it to the req object and do operation on that to avoid multiple unessacery DB CALLS

# DEFINITE CHANGES TO MAKE

- user changes password or username --> remove old refresh tokens and give him a new one
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
