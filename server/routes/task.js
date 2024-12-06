var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
// telling my router that I have this model
let Task = require('../model/task');
const task = require('../model/task');
let taskController = require('../controllers/task.js');
const authenticateToken = require('../../middleware/auth');
/* Get route for the task list - Read Operation */
/*
GET,
Post,
Put --> Edit/Update
*/

//Buttons for active/completed lists
router.get('/', authenticateToken, (req, res, next) => {
    try {
    res.render('task_choice', {
        title: 'Task'
    })}
    catch(err)
    {
        console.error(err);
        res.render('task_choice',{
            error:'Error on the server'
        })
    }

});

/* Read Operation --> Get route for displaying the active task list */
router.get('/active', authenticateToken, async(req,res,next)=>{
    const items_per_page = 10;
    const page = parseInt(req.query.page) || 1;

try{
    const totalTasks = await Task.countDocuments({ Status: 'Active', createdBy: req.user.id });
    const TaskList = await Task.find({Status: 'Active', createdBy: req.user.id})
        .skip((page-1) * items_per_page)
        .limit(items_per_page);

    res.render('Active_Task/list',{
        title:'Active Tasks',
        TaskList:TaskList,
        user: req.user,
        currentPage: page,
        pageCount: Math.ceil(totalTasks / items_per_page)
    });
    } catch(err){
        console.error(err);
        res.render('Active_Task/list',{
            error:'Error on the server',
        })
    }
    });
/* Create Operation --> Get route for displaying me the task add Page */
router.get('/active/add', authenticateToken, async(req,res,next)=>{
    try{
        res.render('../views/Active_Task/add',{
            title: 'Add Task'
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('Active_Task/list',{
            error:'Error on the server'
        })
    }
});
/* Create Operation --> Post route for processing the task add Page */
router.post('/active/add', authenticateToken, async(req,res,next)=>{
    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    };

    try{
        if (!isValidDate(req.body.Date) || (req.body.DueDate && !isValidDate(req.body.DueDate))) {
            return res.render('../views/Active_Task/add', {
                title: 'Add Active Task',
                error: 'Invalid date format. Please enter a valid date.',
            });
        }

        let newTask = Task({
            "Title": req.body.Title,
            "Description": req.body.Description,
            "Date": req.body.Date,
            "DueDate": req.body.DueDate,
            "Status": req.body.Status || 'Active',
            "createdBy": req.user.id
        });
        await newTask.save();
        res.redirect('/tasks/active');
    }

    catch(err) {
        console.error(err);
        res.render('Active_Task/list',{
            error:'Error on the server'
        })
    }
});
/* Update Operation --> Get route for displaying me the Edit Page */
router.get('/active/edit/:id', authenticateToken, async(req,res,next)=>{
    try{
        const id = req.params.id;
        const taskToEdit= await Task.findById({_id: id, createdBy: req.user.id});
        if (!taskToEdit) {
            return res.render('../views/Active_Task/edit', {
                title: 'Edit an Active Task',
                error: 'You are not authorized to edit this task!',
                Task: {},
            });
        }

        const formattedDate = taskToEdit.Date ? taskToEdit.Date.toISOString().split('T')[0] : '';
        const formattedDueDate = taskToEdit.DueDate ? taskToEdit.DueDate.toISOString().split('T')[0] : '';
        

        res.render('../views/Active_Task/edit',
            {
                title:'Edit an Active Task',
                Task:taskToEdit,
                formattedDate,
                formattedDueDate
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
router.post('/active/edit/:id',async(req,res,next)=>{

    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    };

    try{

        if (!isValidDate(req.body.Date) || (req.body.DueDate && !isValidDate(req.body.DueDate))) {
            return res.render('../views/Active_Task/add', {
                title: 'Add Active Task',
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
            res.redirect('/tasks/active')
        })
    }
    catch(err){
        console.error(err);
        res.render('Active_Task/list',{
            error:'Error on the server'
        })
    }
});
/* Delete Operation --> Get route to perform Delete Operation */
router.get('/active/delete/:id', authenticateToken, async(req,res,next)=>{
    try{
        let id =req.params.id;
        await Task.findOneAndDelete({_id:id, createdBy: req.user.id }).then(()=>{
            res.redirect('/tasks/active')
        })
    }
    catch(error){
        console.error(err);
        res.render('Active_Task/list',{
            error:'Error on the server'
        })
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////

/* completed task routes */

// list the task 
router.get('/completed', authenticateToken, async(req,res,next)=>{
    const items_per_page = 10;
    const page = parseInt(req.query.page) || 1;

    try{
        const totalTasks = await Task.countDocuments({ Status: 'Completed', createdBy: req.user.id });
        const TaskList = await Task.find({Status: 'Completed', createdBy: req.user.id});
        res.render('Completed_Task/list',{
            title:'Completed Tasks',
            TaskList:TaskList,
            user: req.user,
            currentPage: page,
            pageCount: Math.ceil(totalTasks / items_per_page)
        })}
    catch(err){
        console.error(err);
        res.render('Completed_Task/list',{
            error:'Error on the server'
        })
    }
});

// Create operation - get routes

router.get('/completed/add', authenticateToken, async(req,res,next)=>{
    try{
        res.render('../views/Completed_Task/add',{
            title:'Add Task'

        })
    }
    catch(err)
    {
        console.error(err);
        res.render('../views/Completed_Task/list',{
            error:'Error on the server'
        })
    }
});
            
// Create operation - Post routes

router.post('/completed/add', authenticateToken, async(req,res,next)=>{
    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    };
    try{
        if(!isValidDate(req.body.Date)|| (req.body.DueDate && !isValidDate(req.body.DueDate))){
            return res.render('../views/Completed_Task/add',{
                title: 'Add Task',
                error: 'Invalid date format. Please enter a valid date.',
            })
        }

        let newTask = task({
            "Title":req.body.Title,
            "Description":req.body.Description,
            "Date":req.body.Date,
            "DueDate":req.body.DueDate,
            "Status":req.body.Status || 'Active',
            "createdBy":req.user.id
        });
        await newTask.save();
        res.redirect('/tasks/active');
    }
    catch(err)
    {
        console.error(err);
        res.render('Completed_Task/list',{
            error:'Error on the server'
        })
    }
})
//Delete Completed task

router.get('/completed/delete/:id', authenticateToken, async(req,res,next)=>{
    try{
        let id =req.params.id;
        await Task.findAndDeleteOne({_id:id, createdBy: req.user.id}).then(()=>{
            res.redirect('/tasks/completed')
        })
    }
    catch(error){
        console.error(err);
        res.render('Completed_Task/list',{
            error:'Error on the server'
        })
    }
});

module.exports = router;