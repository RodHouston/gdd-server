# GDD-Server

This is the backend of a fullstack app that allows game developers to create, edit, and collaborate on Game Design Documents (GDD). 

These documents outline the main elements of a game (mechanics, story, characters, locations, etc.) and are used to guide development. This [article] on Wikipedia has further explanation and links to examples of GDDs.

The site can be visited [here].

### Core Dependencies

- [express] - minimalist NodeJS server framework
- [express-session] - server-side session management using cookies
- [argon2] - encryption library
- [mongoose] - database driver for MongoDB
- [redis] - high-speed database for session store
- [s3] - AWS service for hosting images and other files
- [multer] - simplified file upload management


### Launching the app

The app is currently working and hosted via Heroku.


[here]: https://www.gamedocs.app
[article]: https://en.wikipedia.org/wiki/Game_design_document
[express]: https://expressjs.com/
[express-session]: https://www.npmjs.com/package/express-session
[argon2]: https://github.com/P-H-C/phc-winner-argon2
[mongoose]: https://mongoosejs.com/
[redis]: https://www.npmjs.com/package/ioredis
[s3]: https://aws.amazon.com/pm/serv-s3
[multer]: https://www.npmjs.com/package/multer
