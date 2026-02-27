import Task from "../models/task.model.js";

export const createTaskDAO = async (userId, taskData) => {
    const newTask = await Task.create({
        ...taskData,
        user: userId,
    });
    return newTask;
};

export const getMyTasksDAO = async (userId) => {
    const tasks = await Task.find({ user: userId });
    return tasks;
};

export const getSingleTaskDAO = async (userId, taskId) => {
    const task = await Task.findOne({ _id: taskId, user: userId });
    return task;
};

export const updateTaskDAO = async (userId, taskId, updateData) => {
    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        updateData,
        { new: true, runValidators: true }
    );
    return updatedTask;
};

export const deleteTaskDAO = async (userId, taskId) => {
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });
    return deletedTask;
};