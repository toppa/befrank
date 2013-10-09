## Super simple (almost) static server.

The only reason this app needs to exist is the fact that sometimes you need a static site setup fast - 
but it's not a totally static site, you need to submit a form or do something and you don't want setup
CORS on another server or you don't know what CORS is or whatever.

Itch, consider yourself scratched.

### Setup
1. Clone this repo
1. Change into this directory `cd befrank`
1. Run `bundle`
1. Run `bundle exec rackup -p 1234`
1. Point your browser to [http://localhost:1234](http://localhost:1234)

