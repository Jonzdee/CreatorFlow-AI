What is Middleware?

Middleware is a function that sits between the incoming request and the final response. It has access to req, res, and a next() function to pass control to the next middleware in the chain.

js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass control forward — without this, the request hangs
});

Common uses:

Authentication — verify a JWT before letting the request reach the controller
Validation — check req.body shape before processing
Logging — track requests
Error handling — catch errors centrally
////////
How a Full Request Flows (tying it all together)

Client Request
   ↓
Route (routes/userRoutes.js) — "which URL, which handler"
   ↓
Middleware (auth, validation, etc.) — "is this allowed to proceed?"
   ↓
Controller (controllers/userController.js) — "extract req data, call service"
   ↓
Service (services/userService.js) — "business logic"
   ↓
Model (models/User.js) — "talk to the database"
   ↓
MongoDB (Collection/Documents)
   ↓
Response sent back up the chain to the Client