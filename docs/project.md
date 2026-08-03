I install bcrypt : to hash passwords
I install validator: to validate mail
i install JWT


After a user logs in, how does the server remember who they are?
The answer is JWT (JSON Web Token).

With JWT

User logs in.
↓
Server creates a token.
↓
Server sends the token.
↓
React stores it.
↓
Every request sends the token.
↓
Server verifies the token.
↓
Access granted.

What is JWT? JWT stands for: JSON Web Token

But Wait...

Where does React store the token?

There are several options:

localStorage
sessionStorage
HTTP-only cookies

For this course, we'll start with HTTP-only cookies because they're generally more secure against JavaScript access. Later, I'll explain the trade-offs between cookies and local storage so you understand when each approach is appropriate.