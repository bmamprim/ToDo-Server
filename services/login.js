const jwt = require('jsonwebtoken');
const { connect } = require('../database/db');

async function validUser(email) {
    const db = await connect();
    return await db.collection('users').findOne({ email: email });
}

async function regiterUser(user) {
    const db = await connect();
    return db.collection('users').insertOne(user);
}

async function login(email, password) {
    const db = await connect();
    const user = await db.collection('users').findOne({ email: email });

    if(user.email == email && user.password == password){
        const id = 1;
        const token = jwt.sign({ id }, process.env.SECRET, {
          expiresIn: 300
        });
        console.log(token);
        return { auth: true, token: token };
    } else {
        return { auth: false, token: null };
    }
}

module.exports = {
    regiterUser,
    login,
    validUser
}