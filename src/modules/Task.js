export default class Task {
  constructor(name, dueDate = 'No date') {
    this.name = name
    this.dueDate = dueDate
  }
  // called from storage file in the renametask method
  // to rename method

  setName(name) {
    this.name = name
  }
  // used in project addtask to check if the task being created
  // already exist
  // also used in a few other methods in project to get the name/task

  getName() {
    return this.name
  }
  // called from the settaskdate from storage file
  // changes the property value of the duedate property
  // for the current object

  setDate(dueDate) {
    this.dueDate = dueDate
  }
  // methhod is called from todolist file
  // to get the date of current task

  getDate() {
    return this.dueDate
  }

  // called in todolist and project file, this method
  // basically organizes the date to be processed

  getDateFormatted() {
    const day = this.dueDate.split('/')[0]
    const month = this.dueDate.split('/')[1]
    const year = this.dueDate.split('/')[2]
    return `${month}/${day}/${year}`
  }
}
