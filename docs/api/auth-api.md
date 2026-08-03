# Authentication API

## Register

POST /api/auth/register

### Body

{
  "name": "Johnson",
  "email": "johnson@gmail.com",
  "password": "********",
  "niche": "Technology"
}

Response

201 Created

---

## Login

POST /api/auth/login

Returns

- JWT Token
- User Information

---

## Get Current User

GET /api/auth/me

Headers

Authorization: Bearer <JWT_TOKEN>

Returns

Authenticated user details (password excluded).