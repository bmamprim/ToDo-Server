const express = require('express')
const router = express.Router()
const controller = require('./services/controller')
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb')
const login = require('./services/login')


function userAuth(req, res, next){
    jwt.verify(req.headers ? req.headers['x-access-token'] : null, process.env.SECRET, function(err, decoded) {
        if (err){
            return res.status(401).json({ auth: false, message: 'No token provided.' });
        }
        req.user = decoded;
        next();
    });
}

router.get('/:email', userAuth, async (req, res, next) => {
    const email = req.params.email;
    try {
        const docs = await controller.retriveTasks(email);
        res.send(docs);
    } catch (e) {
        next(e); 
    }
});

router.post('/create', async (req, res, next) => {
    const email = req.body.email;
    const newTask = {
        _id: new ObjectId(),
        description: req.body.description,
        endDate: req.body.endDate,
        createdAt: new Date()    
    }
    try {
        let result = await controller.createTask(email, newTask);
        res.status(200).json({data: result});
    } catch (e) {
        next(e);
    }
});

router.post('/auth/register', async (req, res, next) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password
    }

    const isValidUser = login.validUser(newUser.email);

    if(!isValidUser) {
        res.send('Email invalido!');
    }

    // registra usuario
    try {
        let result = await login.regiterUser(newUser);
        res.status(200).json({data: result});
    } catch (e) {
        next(e);
    }

})

router.post('/auth/login', async (req, res, next) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        const result = await login.login(user.email, user.password);
        res.send(result);
    } catch (e) {
        next(e)
    }
})

router.post('/auth/logout', function(req, res) {
    res.json({ auth: false, token: null });
})

// ainda incompleto
router.put('/edit/:email/:id', async (req, res, next) => {
    const email = req.params.email;
    const id = req.params.id;
    const newTask = {
            description: req.body.description,
            endDate: req.body.endDate, 
            updatedAt: new Date()
        }

    try {
        let result = await controller.updateTask(email, id, newTask);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
});

router.put('/complete/:id', async (req, res, next) => {
    const id = req.params.id;
    const status = true;

    try {
        let result = await controller.completeTask(id, status);
        res.status(200).json({ data: result });
    } catch (e) {
        next(e);
    }
});

router.delete('/delete/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        let result = await controller.deleteTask(id);
        res.status.json({ data: result });
    } catch (e) {
        next(e);
    }
});

module.exports = router
