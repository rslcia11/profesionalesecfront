const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'Admin123*';

bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(hash);
});
