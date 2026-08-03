import mongoose from "mongoose";

We're importing the library that lets JavaScript communicate with MongoDB.
Connecting to a database takes time.
Maybe:

100 ms
500 ms
2 seconds

JavaScript shouldn't freeze while waiting.

That's why we use async.

await mongoose.connect(...)

await means:

"Pause this function until the database connection finishes."

If we don't wait, the server may start before the database is ready.
/////////////////
process.env is how Node.js reads those values.

process.exit(1);

Question:

Why shut down the server?

Because a backend without a database is useless.

It's better to stop immediately than pretend everything is working.