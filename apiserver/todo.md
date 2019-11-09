- ADD UPVOTE SAVE PRE MIDDLEWARE TO CHECK IF UPVOTE IS OVER 0
- unique keys with custom messages for express handling to be more compact
- add mongoose pre and post hooks
  --> WAS SOLL BEI ERROR PASSIEREN?

- limit the response size to a certain amount
- allow paging with the limit of size and skipping

- ADD AUTHENTICATION AND AUTHORIZATION
  --> edit user validation to also check password

Questions:

- do you need to validate the req.params.id? Because I think mongoose cast it automatically to ObjectID
- FOR PICTURES: do you use any of those:
- app.use(express.static('uploads'));
- app.use(express.static('files'));
  --> for uploaded images to the server?

# GREAT NEW THINGS TO DO TO GUARANTEE SECURITY

- after a user changes the password, remove all the refresh tokens
- after a user change the username, remove all the refresh tokens
- ENABLE HTTPS FOR COMMUNICATION!!
- REMOVE PASSWORDS FROM THE ROUTE RESPONSES
