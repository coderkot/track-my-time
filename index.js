import {getTimeFor} from "./timeUtils"

const getTasksFromStore = () => {
    const storage = localStorage.getItem('tasks')
    return !!storage ? new Map(JSON.parse(storage)) : new Map()
}

const putTaskInStore = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(Array.from(tasks)))
}



const getTimeDiff = (start, end) => {
    const diff = new Date(end) - new Date(start)
    const minutes = ((diff / (1000*60)) % 1).toFixed(2).split('.')[1]

    return {
        minutes: minutes,
        hours: Math.floor(diff / (1000*60*60)),
        days: Math.floor(diff / (1000*60*60*24))
    }
}

const addContent = (taskName, task) => {
    return (
        `<div class="task">
            <p>${taskName}</p>
            <p class='status ${task.status === "Done!" ? "done" : ""}'>
                Status: ${task.status ? task.status : '----'}
            </p>
            <span class="start-time" style="margin-right: 10px">
                Start time: ${getTimeFor('start', task.start)}
            </span> | 
            <span class="end-time" style="margin-right: 10px; margin-left: 10px">
                End time: ${task.end ? getTimeFor('end', task.end) : '--:--'}
            </span> | 
            <span class="spend-time" style="margin-right: 10px; margin-left: 10px">
                Spend time: ${task.spend ? task.spend : '--:--'}
            </span> | 
            ${!!task.link ? `<a href="${task.link}">${taskName}</a>` : ''}
            <div class="task-action-bar">
                ${task.status !== 'Done!' ? `<button data-task-id=${taskName} class='btn'>Done!</button>` : ''}
                <button data-del-task-id=${taskName} class='btn'>Delete task</button>
            </div>
        </div>`
    )
}

const initEvents = (taskName) => {
    const finishBtn = document.querySelector(`[data-task-id="${taskName}"]`)
    const deleteBtn = document.querySelector(`[data-del-task-id="${taskName}"]`)

    if (finishBtn) {
        document.querySelector(`[data-task-id="${taskName}"]`).addEventListener('click', (e) => {
            finishTask(taskName)
        })
    }

    if (deleteBtn) {
        document.querySelector(`[data-del-task-id="${taskName}"]`).addEventListener('click', (e) => {
            removeTask(taskName)
        })
    }
}

const renderTasks = () => {
    const tasks = getTasksFromStore()
    const tasksList = document.getElementById('tasks-list')

    tasks.forEach((value, key) => {
        let elem = document.getElementById(key)

        if (!elem) {
            elem = document.createElement('li')

            elem.id = key
            elem.innerHTML = addContent(key, value)
            tasksList.appendChild(elem)

            initEvents(key)
        }
    })
}

renderTasks()

const createTask = () => {
    const tasks = getTasksFromStore()

    const taskNameInput = document.getElementById('task-name-input'),
        taskLinkInput = document.getElementById('task-link-input');

    if (!taskNameInput.value.trim()) {
        alert('You sholud type task name!')
        taskNameInput.focus()
        return
    }

    tasks.set(taskNameInput.value.trim(), {
        start: new Date(),
        status: 'Work on it...',
        end: null,
        spend: null,
        link: taskLinkInput.value.trim()
    })

    putTaskInStore(tasks)

    taskNameInput.value = ''
    taskLinkInput.value = ''
    taskNameInput.focus()

    renderTasks()
}

window.clearStore = () => localStorage.removeItem('tasks')

const startBtn = document.getElementById('start-btn')
startBtn.addEventListener('click', createTask)

const finishTask = (taskId) => {
    const tasks = getTasksFromStore()
    const task = tasks.get(taskId)
    const end = new Date()
    const spend = getTimeDiff(task.start, end)

    task.end = end
    task.spend = `days: ${spend.days}, hours: ${spend.hours}, minutes: ${spend.minutes}`
    task.status = 'Done!'

    document.querySelector(`#${taskId} .end-time`).innerHTML = `End time: ${getTimeFor('end', task.end)}`
    document.querySelector(`#${taskId} .spend-time`).innerHTML = `Spend time: ${task.spend}`

    document.querySelector(`#${taskId} .status`).innerHTML = `Status: ${task.status}`
    document.querySelector(`#${taskId} .status`).classList.add('done')

    document.querySelector(`[data-task-id="${taskId}"`).remove()

    putTaskInStore(tasks)
}

const removeTask = (taskId) => {
    const tasks = getTasksFromStore()
    tasks.delete(taskId)

    document.querySelector(`#${taskId}`).remove()
    localStorage.setItem('tasks', JSON.stringify(Array.from(tasks)))
}