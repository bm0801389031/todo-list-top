import { toDate, isToday, isThisWeek, subDays } from 'date-fns'

export default class Project {
  constructor(name) {
    this.name = name
    this.tasks = []
  }
  // dont know what this method does, seems to be an extra...
  // this is an extra is not needed.....

  // setName(name) {
  //   this.name = name
  // }

  // this method is called from todolist in a few methods to get the
  // name of the exact project

  getName() {
    return this.name
  }

  // this method is invoked from the storage file when creating
  // new todolist, projects, tasks

  setTasks(tasks) {
    this.tasks = tasks
  }

  // method called from storage file renametask
  // returns the this tasks array object
  getTasks() {
    return this.tasks
  }

  // called in renametask, and settaskdate in storage

  getTask(taskName) {
    return this.tasks.find((task) => task.getName() === taskName)
  }

  // this method is called from UI file a few times, seems that there are
  // other forms of this method with another in project file.. this one
  // targets task while the other targets projects
  // used in addproject, handle projectbutton, delete project, addtask, handletask,
  // rename task, this method is used for checking if something contains a project name
  // or to check if something contains a task name or to check if something contains a class

  contains(taskName) {
    return this.tasks.some((task) => task.getName() === taskName)
  }
  // this method in project file adds a task to the project class
  // first checks if the task name already exist if not pushes the
  // task name on the the array in this.task

  // this method is called from todolist file
  //

  addTask(newTask) {
    if (this.tasks.find((task) => task.getName() === newTask.name)) return
    this.tasks.push(newTask)
  }

  // this method is used on the storage file
  // returns an array with everything except the
  // taskname

  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.name !== taskName)
  }
  // this method is called from todolist updatetodayproject method
  // this checks all the projects other than the ones named today
  // or this week,, checks to see if the have the same date as today

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isToday(toDate(taskDate))
    })
  }
  // this method is called from todolist updateweekproject method
  // this checks all the projects other than the ones named thisweek/today
  // returnes true or false which in turn passes them through the filter
  // so the task that falls in this week get returned

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isThisWeek(subDays(toDate(taskDate), 1))
    })
  }
}
