
# Backend APIs

Prefix  | Date    | Changes
--------|---------|----------------
/api/v1 |         | Initial deploy

 - [Data Types](#data-types)
 - [Responses](#responses)
 - [Endpoints](#endpoints)
     - [Monitor](#monitor)
        - **GET** [monitor_service](#monitor-service)
        - **GET** [monitor_database](#monitor-database)
     - [Auth](#auth)
        - **POST** [register_user](#register-user)
        - **POST** [confirm_user_email](#confirm-user-email)
        - **POST** [resent_verify_email](#resend-verify-email)
        - **POST** [user_login](#user-login)
        - **POST** [forgot_password](#forgot-password)
        - **POST** [reset_password](#reset-password)
     - [Profile](#profile)
        - **GET** [create_profile](#create-profile)
        - **GET** [read_profile](#read-profile)
        - **GET** [update-profile](#update-profile)
        - **GET** [delete-profile](#delete-profile)


# Data Types
Only *string* and *object* may be null.

API Type        | JSON Type  | Note
----------------|------------|-------
string           | string     | Nullable
object           | object     | Nullable
array            | array      |
integer          | number     | 
float            | number     | 
bignum           | string     | Hex format *"0xNNN..."*, use BigNumber for Javascript
boolean          | boolean    |
eth_date         | integer    | Seconds since Unix epoch
datetime         | string     | ISO 8601 UTC datetime: *YYYY-MM-DDThh:mm:ss*
url              | string     | Resource link
user             | object     | [Public user profile](#public-user-profile-data)

### Common Objects
#### Public user profile data
```
{
    "id": <integer>,
    "email": <string>,
    "emailConfirmed": <boolean>,
    "emailConfirmationToken": <string>,
    "resetPasswordToken": <string>,
    "resetPasswordTokenExpiration": <datetime>,
    "createdAt": <datetime>,
    "updatedAt": <datetime>
}
```

# Responses
## Success

`http status 200`: Ok\
`http status 201`: Resource created\
`http status 202`: Accepted/operation pending\
`http status 204`: Ok, no content

Successful responses optionally include data.

## Error
Responses take the form:
```
{
    "message": <string>,
    "data": <any>
}
```

where `"message"` is a short human readable description of the error, and `"data"` is any extra information relevant to the error. All fields are optional.

API calls marked *Authorized* may return `http status 403` with no data if a valid token is not provided.

The server may return `http status 400` if the request is malformed, contains invalid parameters, or fails for an unknown reason. The client should interpret this as a bug or version mismatch.

### Common errors

#### Error invalid fields

`http status 400`

On invalid field:
```
{
    "message": "Unable to update user information, try again later"
}
```
On invalid field values:
```
{
    "message": "Please enter valid information for all fields",
    "data": { "fields": [<string>, ...] }
}
```

#### Missing user information

In order to access authenticated endpoints, a user must:
- Confirm their email
- Provide an email address (in the case of social authentication)
- Provide a display name

If any of the above have not occurred, all login and authenticated endpoints return an array with one or more of the following:
- `"missing_user_email"`
- `"missing_user_name"`
- `"email_not_confirmed"`

# Endpoints

# Monitor

## Monitor Service
`GET /monitor/`\

Get backend service status.
### Response
Success: `http status 200`
```
{ "status": "ok", "message": "Server is working now !" }
```

## Monitor Database
`GET /monitor/db/`\

Get backend database status.
### Response
Success: `http status 200`
```
{ "status": "ok", "message": "Db is working now !" }
```

# Auth

## Register User
`POST /auth/register/`\

Register user, send verification mail.
### Body Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
email    | string  | Yes      | user email
password | string  | Yes      | user password

### Response
Success: `http status 200`
```
{
    "status": "ok",
    "data": {
        "user": <user>,
        "token": <string>
    }
}
```
Error: `http status 400`
```
{ "status": "error", "message": <string> }
```

## Confirm User Email
`POST /auth/confirmemail/`\

Confirm user, create password, send welcome mail.
### Body Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
token    | string  | Yes      | confirmation token

### Response
Success: `http status 200`
```
{ "status": "ok" }
```
Error: `http status 400`
```
{ "status": "error", "message": "Email already confirmed" }
{ "status": "error", "message": "Invalid token" }
{ "status": "error", "message": <string> }
```

## Resend Verify Email
`POST /auth/resendconfirmation/`\

Resend verification mail to the user.
### Body Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
email    | string  | Yes      | user email

### Response
Success: `http status 200`
```
{ "status": "ok" }
```
Error: `http status 400`
```
{ "status": "error", "message": "User not found" }
{ "status": "error", "message": <string> }
```

## User Login
`POST /auth/login/`\

Resend verification mail to the user.
### Body Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
email    | string  | Yes      | user email
password | string  | Yes      | user password

### Response
Success: `http status 200`
```
{
    "status": "ok",
    "data": {
        "user": <user>,
        "token": <string>
    }
}
```
Error: `http status 400`
```
{ "status": "error", "message": "User not found" }
{ "status": "error", "message": "Email does not exist" }
{ "status": "error", "message": "Email is not verified" }
{ "status": "error", "message": "Incorrect password" }
{ "status": "error", "message": "Something went wrong" }
{ "status": "error", "message": <string> }
```

## Forgot Password
`POST /auth/forgot-password/`\

Send forgot password mail to user.
### Body Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
email    | string  | Yes      | user email

### Response
Success: `http status 200`
```
{ "status": "ok" }
```
Error: `http status 400`
```
{ "status": "error", "message": "User not found" }
{ "status": "error", "message": <string> }
```

## Reset Password
`GET /auth/reset-password/`\

Reset password and send mail to user.
### Query Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
password | string  | Yes      | new password
resetPasswordToken | string  | Yes      | reset password token

### Response
Success: `http status 200`
```
{ "status": "ok" }
```
Error: `http status 400`
```
{ "status": "error", "message": <string> }
```

# Profile

## Create Profile
`GET /profile/create/`\

Create Profile.
### Body Parameters
Name       |  Type   | Required | Note
--------   | ------- | -------- | ------------
user_id    | string  | Yes      | user_id
first_name | string  | Yes      | first name
last_name  | string  | Yes      | last name

### Response
Success: `http status 200`
```
{
    "status": "ok",
    "data": {
        "user": <user>,
        "token": <string>
    }
}
```
Error: `http status 400`
```
{ "status": "error", "message": <string> }
```

## Read Profile
`GET /profile/read/`\

Create Profile.
### Body Parameters
Name       |  Type   | Required | Note
--------   | ------- | -------- | ------------
user_id    | string  | Yes      | user_id

### Response
Success: `http status 200`
```
{
    "status": "ok",
    "data": {
        "user": <user>,
        "token": <string>
    }
}
```
Error: `http status 400`
```
{ "status": "error", "message": <string> }
```

## Update Profile
`GET /profile/update/`\

update profile.
### Body Parameters
Name      | Type    | Required | Note
--------  | ------- | -------- | ------------
user_id   | string  |   Yes    | user_id
first_name| string  |   Yes    | first_name
last_name | string  |   Yes    | last_name

### Response
Success: `http status 200`
```
{ "status": "ok" }
```
Error: `http status 400`
```
{ "status": "error", "message": "User not found" }
{ "status": "error", "message": <string> }
```

## Delete Profile
`GET /profile/delete/`\

Delete profile.
### Body Parameters
Name     | Type    | Required | Note
-------- | ------- | -------- | ------------
user_id  | string  | Yes      | 

### Response
Success: `http status 200`
```
{ "status": "ok" }
```
Error: `http status 400`
```

```