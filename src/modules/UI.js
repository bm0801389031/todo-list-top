import { format } from 'date-fns'
import Storage from './Storage'
import Project from './Project'
import Task from './Task'

export default class UI {
  // LOADING CONTENT
  // this method is activated by an event listener in the index.js file
  // START COMMENTING THE HELL OUT OF THE DOCS FOR UNDERSTANDMENT
  // loadhomepage activates three methods which are all in this UI doc, this method basically refreshes the ui
  // 1. first method, loads projects and todolists from local storage
  // 2. second method, initprojectButtons gives eventlisteners to all the projects on the side menue, and
  // it gives the side menue button on phones screens an event listener
  // 3. third method, this opens default project by its name, also does
  // a little extra work like closes popups
  // 4. fourth is an eventlistener that is placed on the document and listens for the keydown
  // of an esc, clossing all the popups
  static loadHomepage() {
    UI.loadProjects()
    UI.initProjectButtons()
    UI.openProject('Inbox', document.getElementById('button-inbox-projects'))
    document.addEventListener('keydown', UI.handleKeyboardInput)
  }

  // loadProjects activated by loadhomepage method on top code, pulls any todolist from
  // storage, and projects and if projects are not nameed inbox today this weeek apply method
  // createProject which gives project list div some innerhtml with the name of the inputed
  // project, last method adds the buttons to the side menue, plus button for add project, green
  // add button, and cancle button, and the input field

  static loadProjects() {
    Storage.getTodoList()
      // this returns an array of projects that were created in todolist.js file
      .getProjects()
      .forEach((project) => {
        if (
          project.name !== 'Inbox' &&
          project.name !== 'Today' &&
          project.name !== 'This week'
        ) {
          // this adds innerHTML to the side menue creating the new projects not the defaults
          UI.createProject(project.name)
        }
      })
    // adds event listeners to the add project on the side menue, also
    // to the popup buttons for example the add button and the cancel button
    // and event listener listening to the keypress on the input field,
    // which listens to an enter signifing to add project, same thing as
    // the add project button on the popup
    UI.initAddProjectButtons()
  }

  // this loads the lists of tasks, triggered by loadprojectcontent, settaskcompleted
  // delet task, rename task, set task date......
  // the way this works is were grabbing todolist from storage creting a new object
  // todolist, new object instance of project from that todolist, new object instance
  // from the tasks array from the project

  static loadTasks(projectName) {
    Storage.getTodoList()
      .getProject(projectName)
      .getTasks()
      .forEach((task) => UI.createTask(task.name, task.dueDate))

    if (projectName !== 'Today' && projectName !== 'This week') {
      UI.initAddTaskButtons()
    }
  }

  // triggered by openproject method.... gives innerHTML to the project-preview div
  // the html consist of a heading and a div task-list that holds created list for
  // today project and this week project and for any other project inbox and non-default
  // will also have the add project button at end of list and popoup functionality
  // as in add/cancel button and input field..... after openproject trigers said method
  // and all this code is run then loadtasks method is run wich creates the list
  // *today and this week project do not need the second half of this code because
  // they do not have the option to directly add task in to those task. the task
  // automaticaly fall in to those categories depandin on dates
  static loadProjectContent(projectName) {
    const projectPreview = document.getElementById('project-preview')
    projectPreview.innerHTML = `
        <h1 id="project-name">${projectName}</h1>
        <div class="tasks-list" id="tasks-list"></div>`

    if (projectName !== 'Today' && projectName !== 'This week') {
      projectPreview.innerHTML += `
        <button class="button-add-task" id="button-add-task">
          <i class="fas fa-plus"></i>
          Add Task
        </button>
        <div class="add-task-popup" id="add-task-popup">
          <input
            class="input-add-task-popup"
            id="input-add-task-popup"
            type="text"
          />
          <div class="add-task-popup-buttons">
            <button class="button-add-task-popup" id="button-add-task-popup">
              Add
            </button>
            <button
              class="button-cancel-task-popup"
              id="button-cancel-task-popup"
            >
              Cancel
            </button>
          </div>
        </div>`
    }

    UI.loadTasks(projectName)
  }

  // CREATING CONTENT
  // this code creates the project under projects heading on the side menue,
  // non-default projects including in this code is the inputed name
  // on the left side of the pannel and an icon... on the right side is a hover x
  // last method is an initialization of project buttons which makes all the
  // project on the side pannels clickable and also adds a button to open
  // the side menue when in mobil version

  static createProject(name) {
    const userProjects = document.getElementById('projects-list')
    userProjects.innerHTML += ` 
      <button class="button-project" data-project-button>
        <div class="left-project-panel">
          <i class="fas fa-tasks"></i>
          <span>${name}</span>
        </div>
        <div class="right-project-panel">
          <i class="fas fa-times"></i>
        </div>
      </button>`

    UI.initProjectButtons()
  }

  // this creates the list of items all wrapped in a button, and each item has two sides
  // left and right left holds the name and right holds the dueDate
  static createTask(name, dueDate) {
    const tasksList = document.getElementById('tasks-list')
    tasksList.innerHTML += `
      <button class="button-task" data-task-button>
        <div class="left-task-panel">
          <i class="far fa-circle"></i>
          <p class="task-content">${name}</p>
          <input type="text" class="input-task-name" data-input-task-name>
        </div>
        <div class="right-task-panel">
          <p class="due-date" id="due-date">${dueDate}</p>
          <input type="date" class="input-due-date" data-input-due-date>
          <i class="fas fa-times"></i>
        </div>
      </button>`

    UI.initTaskButtons()
  }

  // not used by any method on this file
  static clear() {
    UI.clearProjectPreview()
    UI.clearProjects()
    UI.clearTasks()
  }

  // trigered by a deletion of current project or clear method

  static clearProjectPreview() {
    const projectPreview = document.getElementById('project-preview')
    projectPreview.textContent = ''
  }

  // this method removes projects nondefault ones which are buttons
  // trigered by deletproject method and clear method
  static clearProjects() {
    const projectsList = document.getElementById('projects-list')
    projectsList.textContent = ''
  }

  // this method is to clear the task from a project, which it removes
  // the buttons'task'
  // this method is trigered by other methods that require the tasks to
  // reload or to be deleted or marked off

  static clearTasks() {
    const tasksList = document.getElementById('tasks-list')
    tasksList.textContent = ''
  }

  // this method controls all the popups some on task some on projects, some
  // on the add task

  static closeAllPopups() {
    UI.closeAddProjectPopup()
    if (document.getElementById('button-add-task')) {
      UI.closeAddTaskPopup()
    }
    if (
      document.getElementById('tasks-list') &&
      document.getElementById('tasks-list').innerHTML !== ''
    ) {
      UI.closeAllInputs()
    }
  }
  // this method triggered by closeallpopups closes all the input
  // fields in the task which there are two the name of task and
  // the date of the task

  static closeAllInputs() {
    const taskButtons = document.querySelectorAll('[data-task-button]')

    taskButtons.forEach((button) => {
      UI.closeRenameInput(button)
      UI.closeSetDateInput(button)
    })
  }
  // eventlistener that is placed on the document and listens for the keydown
  // of an esc, clossing all the popups which could be a project popup
  // or a task popup

  static handleKeyboardInput(e) {
    if (e.key === 'Escape') UI.closeAllPopups()
  }

  // PROJECT ADD EVENT LISTENERS
  // adds event listeners to the add project on the side menue, also
  // to the popup buttons for example the add button and the cancel button
  // and event listener listening to the keypress on the input field,
  // which listens to an enter signifing to add project, samething as
  // the add project button on the popup

  static initAddProjectButtons() {
    const addProjectButton = document.getElementById('button-add-project')
    const addProjectPopupButton = document.getElementById(
      'button-add-project-popup'
    )
    const cancelProjectPopupButton = document.getElementById(
      'button-cancel-project-popup'
    )
    const addProjectPopupInput = document.getElementById(
      'input-add-project-popup'
    )

    addProjectButton.addEventListener('click', UI.openAddProjectPopup)
    addProjectPopupButton.addEventListener('click', UI.addProject)
    cancelProjectPopupButton.addEventListener('click', UI.closeAddProjectPopup)
    addProjectPopupInput.addEventListener(
      'keypress',
      UI.handleAddProjectPopupInput
    )
  }
  // this method adds the keyword active to the class for
  // the popup generating it on the ui

  static openAddProjectPopup() {
    const addProjectPopup = document.getElementById('add-project-popup')
    const addProjectButton = document.getElementById('button-add-project')

    UI.closeAllPopups()
    addProjectPopup.classList.add('active')
    addProjectButton.classList.add('active')
  }
  // removes active classes from popup, projectbutton, and
  // also clears the input field

  static closeAddProjectPopup() {
    const addProjectPopup = document.getElementById('add-project-popup')
    const addProjectButton = document.getElementById('button-add-project')
    const addProjectPopupInput = document.getElementById(
      'input-add-project-popup'
    )

    addProjectPopup.classList.remove('active')
    addProjectButton.classList.remove('active')
    addProjectPopupInput.value = ''
  }

  // initaddprojectbutton/handleaddprojectpopupinput are the trigers to this
  // method grabs the value of the input box id adds a new project to storage
  // then the createProject method is run to populat the ui
  // and then the closeaddprojectpopup method is run to remove the active class
  static addProject() {
    const addProjectPopupInput = document.getElementById(
      'input-add-project-popup'
    )
    const projectName = addProjectPopupInput.value

    if (projectName === '') {
      alert("Project name can't be empty")
      return
    }

    if (Storage.getTodoList().contains(projectName)) {
      addProjectPopupInput.value = ''
      alert('Project names must be different')
      return
    }

    Storage.addProject(new Project(projectName))
    UI.createProject(projectName)
    UI.closeAddProjectPopup()
  }
  // this method is triggered by initaddproject buttons and what
  // this does is listens to the enter key when the diolog box is
  // opened

  static handleAddProjectPopupInput(e) {
    if (e.key === 'Enter') UI.addProject()
  }

  // PROJECT EVENT LISTENERS
  // this method adds event listeners to all the projects buttons main index, today, thisweek and created
  // projects, including the open nav button for phone screens

  static initProjectButtons() {
    const inboxProjectsButton = document.getElementById('button-inbox-projects')
    const todayProjectsButton = document.getElementById('button-today-projects')
    const weekProjectsButton = document.getElementById('button-week-projects')
    const projectButtons = document.querySelectorAll('[data-project-button]')
    const openNavButton = document.getElementById('button-open-nav')

    inboxProjectsButton.addEventListener('click', UI.openInboxTasks)
    todayProjectsButton.addEventListener('click', UI.openTodayTasks)
    weekProjectsButton.addEventListener('click', UI.openWeekTasks)
    projectButtons.forEach((projectButton) =>
      projectButton.addEventListener('click', UI.handleProjectButton)
    )
    openNavButton.addEventListener('click', UI.openNav)
  }

  // this method is triggered by initprojectbuttons and it
  // opens the inbox projects
  // whats the reason to why this method does not need it's
  // storage updated, because it does not relly on a date parameter,
  // which could change from momennt to moment, where as this method
  // just holds any created task no matter the date on the task

  static openInboxTasks() {
    UI.openProject('Inbox', this)
  }

  // this method is triggered by initprojectbuttons and it
  // opens the today projects
  // gets todolist('page' and all the projects and the tasks within projects)
  // from storage and then from saves todolist to storage, thats updateweekproject

  static openTodayTasks() {
    Storage.updateTodayProject()
    UI.openProject('Today', this)
  }

  // this method is triggered by initproject buttons and it
  // opens the this week projects
  // gets todolist('page' and all the projects and the tasks within projects)
  // from storage and then from saves todolist to storage, thats updateweekproject

  static openWeekTasks() {
    Storage.updateWeekProject()
    UI.openProject('This week', this)
  }

  // this method is ment for the not default projects
  // triggered by initprojectbuttons, this method checks if the targeted
  // click contains a class of fatimes if it does that means that the x
  // was clicked on and that calls the deleteproject method
  // else open project

  static handleProjectButton(e) {
    const projectName = this.children[0].children[1].textContent

    if (e.target.classList.contains('fa-times')) {
      UI.deleteProject(projectName, this)
      return
    }

    UI.openProject(projectName, this)
  }

  // this opens a project by its name and by the clicked on button, also does
  // a little extra work like closes popups and loads the clicked on
  // projects content
  static openProject(projectName, projectButton) {
    const defaultProjectButtons = document.querySelectorAll(
      '.button-default-project'
    )
    const projectButtons = document.querySelectorAll('.button-project')
    const buttons = [...defaultProjectButtons, ...projectButtons]

    buttons.forEach((button) => button.classList.remove('active'))
    projectButton.classList.add('active')
    UI.closeAddProjectPopup()
    UI.loadProjectContent(projectName)
  }

  // method removes project preview from ui and delets project from
  // storage and reloads the ui projects

  static deleteProject(projectName, button) {
    if (button.classList.contains('active')) UI.clearProjectPreview()
    Storage.deleteProject(projectName)
    UI.clearProjects()
    UI.loadProjects()
  }

  // this method opens the nav menue when on mobile version

  static openNav() {
    const nav = document.getElementById('nav')

    UI.closeAllPopups()
    nav.classList.toggle('active')
  }

  // ADD TASK EVENT LISTENERS
  // adds event listener to the add task button at the end of the list, including
  // the add button on the popup and the cancel button on the popup and handles
  // the input field

  static initAddTaskButtons() {
    const addTaskButton = document.getElementById('button-add-task')
    const addTaskPopupButton = document.getElementById('button-add-task-popup')
    const cancelTaskPopupButton = document.getElementById(
      'button-cancel-task-popup'
    )
    const addTaskPopupInput = document.getElementById('input-add-task-popup')

    addTaskButton.addEventListener('click', UI.openAddTaskPopup)
    addTaskPopupButton.addEventListener('click', UI.addTask)
    cancelTaskPopupButton.addEventListener('click', UI.closeAddTaskPopup)
    addTaskPopupInput.addEventListener('keypress', UI.handleAddTaskPopupInput)
  }

  // this method opens the popup when you want to add a task on a
  // project

  static openAddTaskPopup() {
    const addTaskPopup = document.getElementById('add-task-popup')
    const addTaskButton = document.getElementById('button-add-task')

    UI.closeAllPopups()
    addTaskPopup.classList.add('active')
    addTaskButton.classList.add('active')
  }
  // triggered by initAddTaskButtons a method that adds event listeners to the buttons
  // asosiated with add task like the main button that opens opopup and the two buttons'
  // inside the button the green add and the red cancel and also an envent listener on the
  // enter key that calls addtask mehtod.
  // also triggered by addtask method

  static closeAddTaskPopup() {
    const addTaskPopup = document.getElementById('add-task-popup')
    const addTaskButton = document.getElementById('button-add-task')
    const addTaskInput = document.getElementById('input-add-task-popup')

    addTaskPopup.classList.remove('active')
    addTaskButton.classList.remove('active')
    addTaskInput.value = ''
  }

  // triggered by method handleaddtaskpopupinput which just listens
  // to an ender on the input field,, and also triggered by initaddtaskbutton
  // which is triggerd by the greeen button on the popup that comes up
  // from hitting the addtask button

  static addTask() {
    const projectName = document.getElementById('project-name').textContent
    const addTaskPopupInput = document.getElementById('input-add-task-popup')
    const taskName = addTaskPopupInput.value

    if (taskName === '') {
      alert("Task name can't be empty")
      return
    }
    if (Storage.getTodoList().getProject(projectName).contains(taskName)) {
      alert('Task names must be different')
      addTaskPopupInput.value = ''
      return
    }

    Storage.addTask(projectName, new Task(taskName))
    UI.createTask(taskName, 'No date')
    UI.closeAddTaskPopup()
  }

  static handleAddTaskPopupInput(e) {
    if (e.key === 'Enter') UI.addTask()
  }

  // TASK EVENT LISTENERS
  // eventlistener to buttons on my list items which are three buttons the checked off one,
  // the change name one gets enter command, and the change date one gets calender date.

  static initTaskButtons() {
    const taskButtons = document.querySelectorAll('[data-task-button]')
    const taskNameInputs = document.querySelectorAll('[data-input-task-name')
    const dueDateInputs = document.querySelectorAll('[data-input-due-date')

    taskButtons.forEach((taskButton) =>
      taskButton.addEventListener('click', UI.handleTaskButton)
    )
    taskNameInputs.forEach((taskNameInput) =>
      taskNameInput.addEventListener('keypress', UI.renameTask)
    )
    dueDateInputs.forEach((dueDateInput) =>
      dueDateInput.addEventListener('change', UI.setTaskDate)
    )
  }
  // is trigered by the initTaskButton and when either the circle or the x, or content,
  // and due date are clicked on, 4 things that could be clicked on.
  // this gives those buttons each a fonctionality and handles them, for
  // example the circle sets the task completed which delets the task
  // the x delets the task
  // clicking on the task content opens an input box and adds or changes innertext
  // clicking on due date opens a diolog box and excepts an input

  static handleTaskButton(e) {
    if (e.target.classList.contains('fa-circle')) {
      UI.setTaskCompleted(this)
      return
    }
    if (e.target.classList.contains('fa-times')) {
      UI.deleteTask(this)
      return
    }
    if (e.target.classList.contains('task-content')) {
      UI.openRenameInput(this)
      return
    }
    if (e.target.classList.contains('due-date')) {
      UI.openSetDateInput(this)
    }
  }

  // this method is trigered by the handle task button, and does the same thing
  // as deletetask method but instead is called by the click of the circle

  static setTaskCompleted(taskButton) {
    const projectName = document.getElementById('project-name').textContent
    const taskName = taskButton.children[0].children[1].textContent

    if (projectName === 'Today' || projectName === 'This week') {
      const parentProjectName = taskName.split('(')[1].split(')')[0]
      Storage.deleteTask(parentProjectName, taskName.split(' ')[0])
      if (projectName === 'Today') {
        Storage.updateTodayProject()
      } else {
        Storage.updateWeekProject()
      }
    } else {
      Storage.deleteTask(projectName, taskName)
    }
    UI.clearTasks()
    UI.loadTasks(projectName)
  }

  // this method is triggered by the handltaskbutton which handles all buttons
  // on the task itself.. delets the task when the x is clicked on

  static deleteTask(taskButton) {
    const projectName = document.getElementById('project-name').textContent
    const taskName = taskButton.children[0].children[1].textContent

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0]
      Storage.deleteTask(mainProjectName, taskName)
    }
    Storage.deleteTask(projectName, taskName)
    UI.clearTasks()
    UI.loadTasks(projectName)
  }

  // this method is trigered by the handletaskbutton method which
  // handles buttons on each task which there are four of them

  static openRenameInput(taskButton) {
    const taskNamePara = taskButton.children[0].children[1]
    let taskName = taskNamePara.textContent
    const taskNameInput = taskButton.children[0].children[2]
    const projectName = taskButton.parentNode.parentNode.children[0].textContent

    if (projectName === 'Today' || projectName === 'This week') {
      ;[taskName] = taskName.split(' (')
    }

    UI.closeAllPopups()
    taskNamePara.classList.add('active')
    taskNameInput.classList.add('active')
    taskNameInput.value = taskName
  }
  // trigered by renametask and just closes the input box by
  // removing active

  static closeRenameInput(taskButton) {
    const taskName = taskButton.children[0].children[1]
    const taskNameInput = taskButton.children[0].children[2]

    taskName.classList.remove('active')
    taskNameInput.classList.remove('active')
    taskNameInput.value = ''
  }

  // triggered by handle task button, which renames the task
  // by making sure that there is an actual input and by making sure
  // that the renamed item is not an item already in the project
  // this method also clears the task then reloads the task and
  // closes the input for rename
  static renameTask(e) {
    if (e.key !== 'Enter') return

    const projectName = document.getElementById('project-name').textContent
    const taskName = this.previousElementSibling.textContent
    const newTaskName = this.value

    if (newTaskName === '') {
      alert("Task name can't be empty")
      return
    }

    if (Storage.getTodoList().getProject(projectName).contains(newTaskName)) {
      this.value = ''
      alert('Task names must be different')
      return
    }

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0]
      const mainTaskName = taskName.split(' ')[0]
      Storage.renameTask(
        projectName,
        taskName,
        `${newTaskName} (${mainProjectName})`
      )
      Storage.renameTask(mainProjectName, mainTaskName, newTaskName)
    } else {
      Storage.renameTask(projectName, taskName, newTaskName)
    }
    UI.clearTasks()
    UI.loadTasks(projectName)
    UI.closeRenameInput(this.parentNode.parentNode)
  }

  // opens the date field to change, trigerd by handle task button, which
  // handles all the actions for the buttons on each task
  static openSetDateInput(taskButton) {
    const dueDate = taskButton.children[1].children[0]
    const dueDateInput = taskButton.children[1].children[1]

    UI.closeAllPopups()
    dueDate.classList.add('active')
    dueDateInput.classList.add('active')
  }

  // closes the date input on the todo by removing active class

  static closeSetDateInput(taskButton) {
    const dueDate = taskButton.children[1].children[0]
    const dueDateInput = taskButton.children[1].children[1]

    dueDate.classList.remove('active')
    dueDateInput.classList.remove('active')
  }

  // this method sets the date on storage or updates the date on storage
  static setTaskDate() {
    const taskButton = this.parentNode.parentNode
    const projectName = document.getElementById('project-name').textContent
    const taskName = taskButton.children[0].children[1].textContent
    const newDueDate = format(new Date(this.value), 'dd/MM/yyyy')

    if (projectName === 'Today' || projectName === 'This week') {
      const mainProjectName = taskName.split('(')[1].split(')')[0]
      const mainTaskName = taskName.split(' (')[0]
      Storage.setTaskDate(projectName, taskName, newDueDate)
      Storage.setTaskDate(mainProjectName, mainTaskName, newDueDate)
      if (projectName === 'Today') {
        Storage.updateTodayProject()
      } else {
        Storage.updateWeekProject()
      }
    } else {
      Storage.setTaskDate(projectName, taskName, newDueDate)
    }
    UI.clearTasks()
    UI.loadTasks(projectName)
    UI.closeSetDateInput(taskButton)
  }
}
