# MV Online Version 0.2.0 Release Notes:

## Summary
There are 2 main points that are different from 0.1.0

- package.json has been updated with new versions of all the project's dependencies.  To update all dependencies simply run the install command again after updating the server:
```bash
npm install
```

- With these newer packages the default method for registration and login have been changed.  Registration and login by default now use sha256 encryption.  This will not allow you to use the database already there unless you decide not to update your package.json and stick with previous versions.

## IMPORTANT!!!! YOU MUST CLEAR YOUR DATABASE AND START OVER OR FOLLOW THE INSTRUCTIONS BELOW:

- Keep the original package.json in your project or change the `passport-local-mongoose` entry to `^1.0.0"` as this will keep the original sha1 encryption.

- You'll also need to change line 103 to:

```js
crypto.pbkdf2(req.body.password, account.salt, 25000, 512, 'sha1', function(err, hashRaw){
```
