import { compareAsc, toDate } from 'date-fns'
import Project from './Project'
import Task from './Task'

// this class is used in the creation of an object in the storage
// that was called from the ui file
export default class TodoList {
  constructor() {
    this.projects = []
    this.projects.push(new Project('Inbox'))
    this.projects.push(new Project('Today'))
    this.projects.push(new Project('This week'))
  }
  // this method sets all the projects in the instance of object puting
  // all the projects in the the array

  setProjects(projects) {
    this.projects = projects
  }

  // returns an array of projects, what ever was
  // pussed in to the array on constructor

  getProjects() {
    return this.projects
  }
  // used in loadtasks method on UI

  getProject(projectName) {
    return this.projects.find((project) => project.getName() === projectName)
  }

  // this method is called from UI file a few times, seems that there are
  // other forms of this method with another in project file.. this one
  // targets projects while the other targets tasks
  // used in addproject, handle projectbutton, delete project, addtask, handletask,
  // rename task, this method is used for checking if something contains a project name
  // or to check if something contains a task name or to check if something contains a class
  contains(projectName) {
    return this.projects.some((project) => project.getName() === projectName)
  }

  // invoked by the storage.addproject method
  // adds project to the array of projects property with in todolist class

  addProject(newProject) {
    if (this.projects.find((project) => project.name === newProject.name))
      return
    this.projects.push(newProject)
  }

  // called by storage.deleteproject deletes project by the name passed
  // through projectname parameter
  deleteProject(projectName) {
    const projectToDelete = this.projects.find(
      (project) => project.getName() === projectName
    )
    this.projects.splice(this.projects.indexOf(projectToDelete), 1)
  }
  // this method is called from storage file inside method
  // updatetodayproject
  // gets project named today and sets the array or task to empty array
  // goes through all the projects and ends projgram if
  // name of project is today or this week
  // gets today task that passed the test from project.gettasktoday
  // for each task that passed getprjct get the only project
  // named today and it adds a task through the addtask method
  // in project and what that method does it adds the task to the
  // task array object in project class

  updateTodayProject() {
    this.getProject('Today').tasks = []

    this.projects.forEach((project) => {
      if (project.getName() === 'Today' || project.getName() === 'This week')
        return

      const todayTasks = project.getTasksToday()
      todayTasks.forEach((task) => {
        const taskName = `${task.getName()} (${project.getName()})`
        this.getProject('Today').addTask(new Task(taskName, task.getDate()))
      })
    })
  }
  // sets tasks of this week project to an empty array
  // first looks at what tasks fall under the week category
  // by going through each project, then goeing through all the
  // tasks within each project.
  // than after finding all the task that fall under this week they
  // are pushed in to the array of task with in each project
  // last piece of code organized the tasks by date

  updateWeekProject() {
    this.getProject('This week').tasks = []

    this.projects.forEach((project) => {
      if (project.getName() === 'Today' || project.getName() === 'This week')
        return

      const weekTasks = project.getTasksThisWeek()
      weekTasks.forEach((task) => {
        const taskName = `${task.getName()} (${project.getName()})`
        this.getProject('This week').addTask(new Task(taskName, task.getDate()))
      })
    })

    this.getProject('This week').setTasks(
      this.getProject('This week')
        .getTasks()
        .sort((taskA, taskB) =>
          compareAsc(
            toDate(new Date(taskA.getDateFormatted())),
            toDate(new Date(taskB.getDateFormatted()))
          )
        )
    )
  }
}
