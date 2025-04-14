import Task from '../models/taskModel.js';
import publish from '../services/publish.js';

export const getActiveTasks = async (req, res, next) => {
   /*
  #swagger.tags = ["Tasks"]
  #swagger.summary = "List all tasks"
  #swagger.responses[200]
  #swagger.security = [{ "BearerAuth": [] }]
  */

  try {

    const tasks = await Task.find({done: false}, "_id description");

    res.ok(tasks);
  } catch (err) {
    next(err);
  }
}

export const createTasks = async (req, res, next) => {
   /*
  #swagger.tags = ["Tasks"]
  #swagger.summary = "Create new task"
  #swagger.security = [{ "BearerAuth": [] }]
  #swagger.responses[201]
  */

  try{
    const task = await new Task({
        description: req.body.description,
        done: false,
    }
    ).save();
     await publish("task", {
      id: task._id,
      description: task.description,
      callback: {
        href: `${process.env.SERVER}${req.baseUrl}/${task._id}/done`,
        method: "PATCH",
        token: task.token,
      }
    });

    res.created();
  }catch (err) {
    next(err);
  }
}

export const doneTasks = async (req, res, next) => {
    /*
  #swagger.tags = ["Tasks"]
  #swagger.summary = "Done task"
  #swagger.responses[200]
  #swagger.security = [{ "BearerAuth": [] }]
  */
    try {
        const token = req.header("x-api-key");
        const task = await Task.findOne({
            _id: req.params._id,
            done: false,
            token: token,
        });

        if (!task){
          return res.unauthorized();
        }

        await Task.findByIdAndUpdate(req.params._id, { $set : {done: true }});

        res.ok();
    } catch (error) {
        next(error);
    }
}