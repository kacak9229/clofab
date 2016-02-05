module.exports = {

  database: process.env.DATABASE || 'mongodb://root:abc123@ds051615.mongolab.com:51615/chattertesting',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'ARASHISTHEBEST',

  twitter: {
    consumerKey: process.env.TWITTER_KEY || 'SasbOIW0U2seDnQu0Ngm46MFH',
    consumerSecret: process.env.TWITTER_SECRET || 'uz37sTXn0s7IzsRuJOOW3EVXJM2Xw5PDkDAcpICL9A0nofBVUF',
    callbackURL: 'http://127.0.0.1:3000/login/twitter/return'
  }
}
