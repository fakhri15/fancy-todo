//const { noExtendLeft } = require('sequelize/types/lib/operators')
//const { message } = require('statuses')
const {Todo} = require('../models/index') 

class TodosController { 
    static showTodos (req,res,next) { 
        Todo.findAll({ 
            where : { 
                UserId : req.decoded.id
            }
        }) 
        .then((data) => { 
            res.status(200).json(data)
        })
        .catch ((err) => { 
            next(err)
        })
    } 

    static addTodo (req,res,next) { 
        const todo = { 
            title : req.body.title, 
            description : req.body.description, 
            status : req.body.status, 
            due_date : req.body.due_date, 
            UserId : req.decoded.id
        }
        Todo.create(todo) 
        .then((data) => { 
            res.status(201).json(data)
        }) 
        .catch ((err) => { 
            next(err)
        })
    } 
 
    static findOneById(req,res,next) { 
        Todo.findOne({ 
            where : { 
                id : +req.params.id
            }
        }) 
        .then((data) => {
            if (data === null) { 
                throw { 
                    name : 'ErrorNotFound', 
                    status : 404,
                    msg : 'Todo not found'
                }
            } else { 
                res.status(200).json(data)
            }
        }) 
        .catch ((err) => { 
            next(err)
        })
    } 

    static update(req,res,next) { 
        const {title,description,status,due_date} = req.body 
        const updatedTodo = {title,description,status,due_date} 
        Todo.update(updatedTodo, { 
            where : { 
                id : +req.params.id 
            }, 
            returning : true
        }) 
        .then((data) => { 
            if (data[1].length === 0) { 
                throw { 
                    name : 'ErrorNotFound', 
                    status : 404,
                    msg : 'Todo not found'
                }
            } else { 
                res.status(200).json(data[1][0])
            }
        }) 
        .catch((err) => { 
            next(err)
        })
    } 

    static changeStatus (req,res,next) { 
        const {status} = req.body 
        const updatedStatus = {status} 
        Todo.update(updatedStatus, { 
            where : { 
                id : +req.params.id 
            }, 
            returning : true
        }) 
        .then((data) => { 
            if (data[1].length === 0) { 
                throw { 
                    name : 'ErrorNotFound', 
                    status : 404,
                    msg : 'Todo not found'
                }
            } else { 
                res.status(200).json(data[1][0])
            }
        }) 
        .catch((err) => { 
            next(err)
        })
    } 

    static delete (req,res,next) { 
        Todo.destroy({ 
            where :  { 
                id : +req.params.id
        }}) 
        .then((data) => { 
            if (data === 0) { 
                throw { 
                    name : 'ErrorNotFound', 
                    status : 404,
                    msg : 'Todo not found'
                }
            } else { 
                res.status(200).json({message : 'todo success to delete'})
            }
        }) 
        .catch((err) => { 
            next(err)
        })
    }
} 

module.exports = TodosController