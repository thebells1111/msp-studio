This is my attempt at creating a container for this project. I don't know much about containers, so I'm fumbling my way through it.

To build it, you need to run `npm run docker:build`.

To run it, you run `npm run docker:start`

If you run `npm run docker:dev`, it does the same thing as `docker:start` but will remove the image when you close out.

If you're developing the front end, you can type `npm run dev` and it will start the server backend for you, and the vite server for handling all of the SvelteKit stuff.

If you'd like to test the server, you can populate the public folder by typing `npm run build`

You'll need a .env file with a `CREDENTIALS_PATH` variable in it that is an absolute path to the credentials file.

To create the credentials file for development, run `dockerStart.js` or run `npm run credentials`. It will prompt you for a user name and password and create the credentials file for you.

When you start the docker container, ` dockerStart.sh`` is ran, which will run  `dockerStart.js`to create the credentials file, and then start the server using`pm2`.

I'm sure there's room for improvement for security and dockerizing, so I'm open to any help available.

The main things to note is we need some way for the user to log in so they can edit their feeds but keep others out, but we also need the `/public/album` folder in the server to be open to the public so the mp3, images, and xml files are available to all of the apps.
