var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// telling my router that I have this model
let Task = require('../model/task');
const task = require('../model/task');
let taskController = require('../controllers/task.js')
/* Get route for the task list - Read Operation */
/*
GET,
Post,
Put --> Edit/Update
*/
/* Read Operation --> Get route for displaying the task list */
router.get('/',async(req,res,next)=>{
try{
    const TaskList = await Task.find();
    res.render('Task/list',{
        title:'Tasks',
        TaskList:TaskList
    })}
    catch(err){
        console.error(err);
        res.render('Task/list',{
            error:'Error on the server'
        })
    }
    });
/* Create Operation --> Get route for displaying me the Add Page */
router.get('/add',async(req,res,next)=>{
    try{
        res.render('Task/add',{
            title: 'Add Task'
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Task/list',{
            error:'Error on the server'
        })
    }
});
/* Create Operation --> Post route for processing the Add Page */
router.post('/add',async(req,res,next)=>{

    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    };

    try{

        if (!isValidDate(req.body.Date) || (req.body.DueDate && !isValidDate(req.body.DueDate))) {
            return res.render('Task/add', {
                title: 'Add Task',
                error: 'Invalid date format. Please enter a valid date.',
            });
        }

        let newTask = Task({
            "Title":req.body.Title,
            "Description":req.body.Description,
            "Date":req.body.Date,
            "DueDate":req.body.DueDate,
            "Status":req.body.Status
        });
        Task.create(newTask).then(()=>{
            res.redirect('/taskslist');
        })
    }

    catch(err)
    {
        console.error(err);
        res.render('Task/list',{
            error:'Error on the server'
        })
    }
});
/* Update Operation --> Get route for displaying me the Edit Page */
router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id = req.params.id;
        const taskToEdit= await Task.findById(id);
        res.render('Task/edit',
            {
                title:'Edit Task',
                Task:taskToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); // passing the error
    }
});
/* Update Operation --> Post route for processing the Edit Page */ 
router.post('/edit/:id',async(req,res,next)=>{

    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    };

    try{

        if (!isValidDate(req.body.Date) || (req.body.DueDate && !isValidDate(req.body.DueDate))) {
            return res.render('Task/add', {
                title: 'Add Task',
                error: 'Invalid date format. Please enter a valid date.',
            });
        }

        let id=req.params.id;
        let updatedTask = Task({
            "_id":id,
            "Title":req.body.Title,
            "Description":req.body.Description,
            "Date":req.body.Date,
            "DueDate":req.body.DueDate,
            "Status":req.body.Status
        });
        Task.findByIdAndUpdate(id,updatedTask).then(()=>{
            res.redirect('/taskslist')
        })
    }
    catch(err){
        console.error(err);
        res.render('Task/list',{
            error:'Error on the server'
        })
    }
});
/* Delete Operation --> Get route to perform Delete Operation */
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        Task.deleteOne({_id:id}).then(()=>{
            res.redirect('/taskslist')
        })
    }
    catch(error){
        console.error(err);
        res.render('Task/list',{
            error:'Error on the server'
        })
    }
});
module.exports = router;