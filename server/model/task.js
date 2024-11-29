//const { Collection, default: mongoose } = require("mongoose");

const mongoose = require("mongoose");

let taskModel = mongoose.Schema({
    Title: {type: String, required: true},              //Title of the task
    Description: {type: String},                        //Description of the task i.e what to do, etc
    Date: {type: Date, required: true},                 //Date of creation, or the date scheduled for this task to happen
    DueDate: {type: Date},                              //Optional to add; a due date of when the task should be completed by
    Status: {                                           //Task status, by default it will be active
        type: String, enum:
            ['Active', 'Completed'],
        default: 'Active'
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},
{
    collection:"home_log"
});
module.exports = mongoose.model('Task',taskModel);
