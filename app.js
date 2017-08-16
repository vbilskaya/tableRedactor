let table = document.getElementById('table_students');

let editingTd;

// let tableHadEdited = false;

let container = document.querySelector('.container');

$(document).ready(function () {

    $.getJSON('index.json', function (json) {

        let jsonStudents = json.students;
        let table = document.getElementById('table_students');

        createTableHead(jsonStudents[0]);

        for (let i = 0; i < jsonStudents.length; i++) {

            table.appendChild(createRow(jsonStudents[i]), i);

        }
    });

    table.addEventListener('click', focusOnCell);

});


function createTableHead(student) {

    let columnNames = ['Имя', 'Фамилия', 'Физика балл', ' Математика балл', 'Русский балл'];
    let tr = document.createElement('tr');
    let td;
    let colClasses = Object.keys(student);

    table.appendChild(tr);

    for (let i = 0; i < columnNames.length; i++) {
        td = document.createElement('td');
        td.classList.add('table-header');
        td.classList.add(colClasses[i]);
        td.innerHTML = columnNames[i];
        tr.appendChild(td);
    }

}

function onTableHeadClick(event) {

    let target = event,
        dataClass = target.getAttribute('class'),
        sortClass = dataClass.split(' ')[1];
    //sortColumn = document.getElementsByClassName(sortClass);

    // let sortArrValue = [];
    //
    // for(let i = 1; i<sortColumn.length; i++){
    //     let dataValue = sortColumn[i].innerHTML;
    //     sortArrValue.push(dataValue);
    // }
    //
    // if(isNaN(sortArrValue[0])){
    //     sortArrValue.sort();
    //     // console.log("Сортировка нечисел");
    // } else {
    //     sortArrValue.sort(compareNumeric);
    //     // console.log("Сортировка чисел");
    //     // console.log(+sortArrValue[0]);
    // }
    //
    // changeRows(sortArrValue);
    //
    //
    // //console.log('массив для сортировки: '+sortArrValue);
    // console.log('сортированный массив: '+ sortArrValue);
    changeRows(sortClass);
}

function changeRows(sortClass) {
    let students = createStudentsObjectsFromTable().students;
    let column = [];
    for (let i = 0; i < students.length; i++) {
        let dataValue = students[i][sortClass];
        let studentId = students[i][studentId];
        
        for(let j=0; j<2; j++){

        }
        column.push(dataValue);
    }
    console.log(column);
    deleteOldTable();
    let sortedArray = sortData(column);
    for(let j = 0; j<sortedArray.length; j++){
        for(let k=0; k<students.length; k++) {
            if (students[k][sortClass] === sortedArray[j]) {
                table.appendChild(createRow(students[k]));
            }
        }
    }

}

function deleteOldTable(){
    let rows = document.getElementsByClassName('row');
    while(rows.length>0){
        table.removeChild(rows[0]);
    }
}

function sortData(arr) {
    if (isNaN(arr[0])) {
        arr.sort();
    } else {
        arr.sort(compareNumeric);
    }
    return arr;
}

function compareNumeric(a, b) {
    return a - b;
}

function createRow(student, i) {

    let row = document.createElement('tr');
    row.setAttribute('class', 'row');
    row.setAttribute('id', i);

    for (key in student) {

        let td = document.createElement('td');
        td.setAttribute('class', key);
        td.innerHTML = student[key];
        row.appendChild(td);
    }

    return row;
}

function focusOnCell(event) {

    let target = event.target;

    while (target != table) {

        if (target.classList.contains('table-header')) {
            onTableHeadClick(target);
        }

        if (target.parentNode.classList.contains('row')) {
            if (editingTd) return; // already editing

            makeTdEditable(target);
            return;
        }

        target = target.parentNode;
    }

}

function makeTdEditable(td) {
    editingTd = {
        elem: td,
        data: td.innerHTML
    };

    td.classList.add('edit-td');

    let input = document.createElement('input');
    input.style.width = td.clientWidth + 'px';
    input.style.height = td.clientHeight + 'px';
    input.className = 'edit-area';

    input.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', onInputBlur);

    // td.insertAdjacentHTML("beforeEnd",
    //     '<div class="edit-controls"><button class="delete">DEL</button><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
    // );
}

function onInputBlur(event) {
    let target = event.target;
    let td = target.parentNode;
    let newValue = target.value;

    td.innerHTML += newValue;
    td.classList.remove('edit-td'); // remove edit class
    td.removeChild(td.firstChild);
    editingTd = null;

    let saveChangesButton = document.querySelector('#saveChangesButton');

    if (!saveChangesButton) {
        createSaveTableChangesButton();
    }
}

function createSaveTableChangesButton() {
    let saveButton = document.createElement('button');
    saveButton.setAttribute('id', 'saveChangesButton');
    saveButton.innerHTML = "Сохранить изменения";
    container.appendChild(saveButton);
    saveButton.addEventListener('click', onSaveTableChangesButtonClick);
}

function onSaveTableChangesButtonClick() {

    let newJsonData = JSON.stringify(createStudentsObjectsFromTable());
    console.log(newJsonData);
}

function createStudentsObjectsFromTable() {
    let newTable = {};

    let rows = document.getElementsByClassName('row');
    let arrayOfStudents = newTable.students = [];

    for (let i = 0; i < rows.length; i++) {
        let newStudent = {};
        let cells = rows[i].childNodes;
        let key, cellValue;
        let studentId = rows[i].getAttribute('id');
        newStudent[id] = studentId;

        for (let j = 0; j < cells.length; j++) {

            key = cells[j].getAttribute('class');
            cellValue = cells[j].innerHTML;
            newStudent[key] = cellValue;

        }
        arrayOfStudents[i] = newStudent;

    }

    return newTable;
}