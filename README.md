# stikki
localised self-hosted bulletin-board-alike system for managing notes as an individual or group.

Uses node.js express with mySQL as a database, running either locally or across the internet if port forwarding is set up.
currently it is only a dynamic webpage, however I intend to add much more functionality - including
a CLI and possibly even a mobile webapp. The final (or at least somewhat fleshed-out) serverside version will be avaliable as a docker package for more convenient
operation.

You can see a live demo of stikki at http://stikki.mightyspaceman.com/

For installation instructions, see the [wiki](https://github.com/MightySpaceman/stikki/wiki/Installation-guide)

## Todo
- [x] Prevent kicking user back to login page after posting note, possibly by setting up sessions once a user is logged in or cookies in browser.
- [x] Sanitize SQL
- [x] Improve main page visual flair (done-kinda still needs more improvement)
- [ ] Allow note editing
- [x] Begin CLI