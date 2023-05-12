// let moment = require('moment');
const { connect } = require('../database/db');
const ObjectID = require('mongodb').ObjectId;


async function retriveTasks(userEmail) {
    const db = await connect();
    const user = await db.collection('users').find({ email: userEmail }).toArray();
    let uncompletedTasks = [];

    for(const task of user) {
        if(!task.tasks.complete) {
            uncompletedTasks.push(task.tasks);
        }
    };

    return uncompletedTasks;
}

async function createTask(email, task) {
    const db = await connect();
    const newTask = db.collection('users').updateOne({ email: email }, { $push: { tasks: task } });
    return newTask;
}


// ainda incompleto
async function updateTask(email, id, newTask) {
    const db = await connect();
    const updatedTask = db.collection('users').updateOne(
        {   
            email: email, 
            tasks: new ObjectID(id)
        },
        { 
            $set: { 'tasks.$' : newTask }
    }
     )
        

    return updatedTask;
}

async function deleteTask(id) {
    const db = await connect();
    const deletedTask = db.collection('users').deleteOne({ _id: new ObjectID(id) });

    return deletedTask;
}

async function completeTask(id, status) {
    const db = await connect();
    const completedTask = db.collection('users').updateOne(
    {
        _id: new ObjectID(id)
    }, 
    {
        $set: { 
            complete: status,
            completedAt: new Date()
        }
    },
    {
        upsert: true
    });
    return completedTask;
}

// async function itsLate(task) {
//     const endDate = new moment(task.endDate, 'L');

//     if(endDate < Date.now()) {
//         console.log(`A tarefa ${task.description} está atrasada!`)
//     }
// }

module.exports = {
    createTask,
    retriveTasks,
    updateTask,
    deleteTask,
    completeTask,
    // itsLate
}