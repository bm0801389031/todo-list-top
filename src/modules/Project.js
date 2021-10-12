import { toDate, isToday, isThisWeek, subDays } from 'date-fns'

export default class Project {
  constructor(name) {
    this.name = name
    this.task = []
  }

  setName(name) {
    this.name = name
  }

  getName() {
    return this.name
  }

  setTasks(tasks) {
    this.tasks = tasks
  }

  getTasks() {
    return this.tasks
  }

  getTask(taskName) {
    return this.tasks.find((task) => task.getName() === taskName)
  }

  contains(taskName) {
    return this.task.some((task) => task.getName() === taskName)
  }

  addTask(newTask) {
    if (this.tasks.find((task) => task.getName() === newTask.name)) return
    this.tasks.push(newTask)
  }

  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.name !== taskName)
  }

  getTasksToday() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormated())
      return isToday(toDate(taskDate))
    })
  }

  getTasksThisWeek() {
    return this.tasks.filter((task) => {
      const taskDate = new Date(task.getDateFormatted())
      return isThisWeek(subDays(toDate(taskDate), 1))
    })
  }
}
