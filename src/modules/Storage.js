import Project from './Project'
import Task from './Task'
import TodoList from './TodoList'

export default class Storage {
  static saveTodoList(data) {
    localStorage.setItem('todoList', JSON.stringify(data))
  }

  // this method basically creates a new todolist object and creates a
  // new instance of project, and a new instance of task all wrapped in
  // the returned value of todoList

  static getTodoList() {
    // object.assign has two parameters the first is the new project holder
    // called todolist, being created the second parameter is calling from
    // storage another todoList constructor and applying the properties from
    // stored todolist to the new todolist object
    // return at the end is a return of basically the whole page including
    // a new todoList object created from the todolist class on todolist file,
    // all the projects created in to new todolist from storage and
    // all the task recreated from task file: for each project
    const todoList = Object.assign(
      new TodoList(),
      JSON.parse(localStorage.getItem('todoList'))
    )

    // this setProjects populates the TodoList constructor array with all the
    // projects that were in Storage, ie today thisweek and non-default projects
    todoList.setProjects(
      todoList
        .getProjects()
        .map((project) => Object.assign(new Project(), project))
    )
    // this sets all the task inside the projects,, setTask method comes
    // from project.js file and it has one parameter that is (tasks an array)
    // gettask also from project.js creating a new instance of task
    todoList
      .getProjects()
      .forEach((project) =>
        project.setTasks(
          project.getTasks().map((task) => Object.assign(new Task(), task))
        )
      )

    return todoList
  }

  // invoked in the UI.addproject
  // adds project in the todolist file
  // through the todolist.addproject method
  // save in storage todolist so basically all the objects of
  // projects and all the objects of tasks

  static addProject(project) {
    const todoList = Storage.getTodoList()
    todoList.addProject(project)
    Storage.saveTodoList(todoList)
  }

  // same exact proces of add project except that
  // todolist.deleteproject is called instead
  static deleteProject(projectName) {
    const todoList = Storage.getTodoList()
    todoList.deleteProject(projectName)
    Storage.saveTodoList(todoList)
  }

  // this method is called through one method on the UI file
  // and that is activated by the ppopup that comes as of
  // clicking on the addtask at bottom of task list
  // what this method does is it creates a new todolist object
  // populated by whatever is in storage then gets project
  // throught the todolist file and then addtask through
  // a nonstatic method on the project file referting back to the project
  // pulled by getproject
  // then simple savetodolist todolist

  static addTask(projectName, task) {
    const todoList = Storage.getTodoList()
    todoList.getProject(projectName).addTask(task)
    Storage.saveTodoList(todoList)
  }

  // this method is called on ui file through a few methods one being
  // delete task , set task completed, handle task button
  static deleteTask(projectName, taskName) {
    const todoList = Storage.getTodoList()
    todoList.getProject(projectName).deleteTask(taskName)
    Storage.saveTodoList(todoList)
  }

  // this method is called from the ui file renamtask method
  // creates new gettodolist object pulled with all the storage stuff
  // grabs the project gets the task calls setName method from project file
  // then a simple call of storage.savetodolist (todolist) object
  static renameTask(projectName, taskName, newTaskName) {
    const todoList = Storage.getTodoList()
    todoList.getProject(projectName).getTask(taskName).setName(newTaskName)
    Storage.saveTodoList(todoList)
  }
  // this method is called from the ui file and through the methods
  // settaskdate and inittaskbuttons method,,,
  // creates a new todolist objec populated with everything current in storage
  // gets current project of task you want to change date gets task
  // setdate called from task file changes the property of date in that file
  // then a simple storage. saveTodoIst(todolist)

  static setTaskDate(projectName, taskName, newDueDate) {
    const todoList = Storage.getTodoList()
    todoList.getProject(projectName).getTask(taskName).setDate(newDueDate)
    Storage.saveTodoList(todoList)
  }

  // gets todolist('page' and all the projects and the tasks within projects)
  // from storage and then from saves todolist to storage, thats updateweekproject

  static updateTodayProject() {
    const todoList = Storage.getTodoList()
    todoList.updateTodayProject()
    Storage.saveTodoList(todoList)
  }

  // this method is called from UI file,from a few methods
  // ie:: openweektask, settaskcompleted, settaskdate
  // this method then calls todolist.updateweekproject
  // to updateweek project in correct file that will actualy do the
  // work

  static updateWeekProject() {
    const todoList = Storage.getTodoList()
    todoList.updateWeekProject()
    Storage.saveTodoList(todoList)
  }
}
