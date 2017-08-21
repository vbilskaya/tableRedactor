"use strict";
let table = document.getElementById('table_students');
const TABLE_ROWS = document.getElementsByClassName('row');
let editingTd;
let studentExample;
let studentsFromJson;
let container = document.querySelector('.container');

$(document).ready(function () {

    $.getJSON('index.json', function (json) {

        let jsonStudents = json.students;

        //тест, надо будет передать контекст без глобальной переменной
        studentsFromJson = jsonStudents;

        createTableHead(jsonStudents[0]);

        studentExample = jsonStudents[0];

        for (let i = 0; i < jsonStudents.length; i++) {

            // let rowNumber = i + 1;
            //
            // table.appendChild(createRow(jsonStudents[i], rowNumber));
            table.appendChild(renderRowFromJson(jsonStudents[i]));
        }
    });

    table.addEventListener('click', focusOnCell);
    addTableEventsListeners();

});

function addTableEventsListeners() {
    let addButton = document.getElementById('add-row');
    let removeButton = document.getElementById('remove-row');

    for (let i = 0; i < TABLE_ROWS.length; i++) {
        TABLE_ROWS[i].addEventListener('focusout', onRowBlur);
        console.log('event listener blur is added ' + i);
    }

    addButton.addEventListener('click', onAddButtonClick);
    removeButton.addEventListener('click', onRemoveButtonClick);
}

function getRowsCount() {
    return TABLE_ROWS.length;
}

function onRemoveButtonClick() {

    let activeRow = document.querySelector('.active-row');
    let number;
    if (activeRow === null) {
        table.removeChild(table.lastChild);
        // number = +getRowsCount();

    }else{
        number = activeRow.getAttribute('id');
        deleteRow(number);
        changeNumeration(document.getElementById(+number+1),number);
    }

}

function onAddButtonClick() {
    let activeRow = document.querySelector('.active-row');
    //let rowStructure = Object.keys(studentExample);
    if (activeRow === null) {
        //table.appendChild(createEmptyRow(getRowsCount() + 1));
        table.appendChild(createLastEmptyRow());
    } else {
        // let oldRowsCount = TABLE_ROWS.length;
        // table.insertBefore(createEmptyRow(activeRow.getAttribute('id')), activeRow);
        // let newRowsCount = TABLE_ROWS.length;
        // for (let i = activeRow.getAttribute('id'); i < getRowsCount(); i++) {
        //     setIdAndRowNumber(TABLE_ROWS[i], i + 1);
        // }
        let num = activeRow.getAttribute('id');
        table.insertBefore(createEmptyRowBeforeActive(num), activeRow);
        changeNumeration(activeRow, num-1);
    }

}

function setIdAndRowNumber(rowElem, num) {
    rowElem.id = num;
    let rowNum = document.createElement('div');
    rowNum.innerHTML = +num;
    rowNum.classList.add('row-number');
    rowElem.appendChild(rowNum);
    return rowElem;
}

function createEmptyRow(number) {
    let row = document.createElement('div');//change to div
    row.classList.add('row');

    let newRow = setIdAndRowNumber(row, number);

    let studentKeys = Object.keys(studentExample);

    for (let i = 0; i < studentKeys.length; i++) {
        if (studentKeys[i] === 'id') {
            let td = document.createElement('div');
            td.classList.add(studentKeys[i]);
            td.classList.add('table-data');
            td.innerHTML = number;
            newRow.appendChild(td);
        } else {

            let td = document.createElement('div');//change to div
            td.classList.add(studentKeys[i]);
            td.classList.add('table-data');
            newRow.appendChild(td);
        }
    }

    return newRow;
}

function generateRow(dataExample) {
    let row = document.createElement('div');
    row.classList.add('row');

    let rowNum = document.createElement('div');
    rowNum.classList.add('row-number');
    row.appendChild(rowNum);

    let studentKeys = Object.keys(dataExample);

    for (let i = 0; i < studentKeys.length; i++) {
        let td = document.createElement('div');//change to div
        td.classList.add(studentKeys[i]);
        td.classList.add('table-data');
        row.appendChild(td);
    }

    return row;
}

function fillRowNumber(row, num) {

    let rowNumber, dataId;

    //set row id
    row.id = num;

    //set row number
    rowNumber = row.firstChild;
    rowNumber.innerHTML = num;

    //set student id, to make it unique
    dataId = row.firstChild.nextSibling;
    dataId.innerHTML = num;

}

function fillRowContent(row, data) {

    let cells = row.childNodes;
    let dataKeys = Object.keys(data);

    for (let i = 2; i < cells.length; i++) {

        for (let j = 1; j < dataKeys.length; j++) {

            if(dataKeys[j] === cells[i].classList[0]){
                cells[i].innerHTML = data[dataKeys[j]];
            }
        }
    }
}

function renderRowFromJson(student) {
   let row = generateRow(studentExample);
   fillRowNumber(row, student['id']);
   fillRowContent(row, student);

   return row;

}

function createLastEmptyRow() {
    let num = +getRowsCount()+1;
    let row = generateRow(studentExample);
    fillRowNumber(row, num);

    return row;
}

function createEmptyRowBeforeActive(num) {
    let row = generateRow(studentExample);
    fillRowNumber(row, num);

    return row;

}

function changeNumeration(row, num) {
    let newNum = +num+1;
    //fillRowNumber(row, newNum);
    for(let i=newNum; i<getRowsCount()+1; i++){
        fillRowNumber(row, newNum);
        row = row.nextSibling;
        newNum+=1;
    }
}

function deleteRow(number) {
    let rowToDel = document.getElementById( number );
    table.removeChild(rowToDel);
}

function createRow(student, rowNumber) {

    let row = document.createElement('div');//change to div
    row.classList.add('row');

    setIdAndRowNumber(row, rowNumber);

    let studentKeys = Object.keys(student);

    for (let i = 0; i < studentKeys.length; i++) {

        let td = document.createElement('div');//change to div
        td.classList.add(studentKeys[i]);
        td.classList.add('table-data');
        td.innerHTML = student[studentKeys[i]];
        row.appendChild(td);
    }

    return row;
}

function createTableHead(student) {

    let columnNames = ['ID студента', 'Имя', 'Фамилия', 'Физика балл', ' Математика балл', 'Русский балл'];
    let tr = document.createElement('div');
    tr.classList.add('head-row');
    let td;
    let colClasses = Object.keys(student);

    table.appendChild(tr);
    //add first col header
    let numHeader = document.createElement('div');
    numHeader.classList.add('table-header');
    numHeader.classList.add('num');
    numHeader.innerHTML = "№";
    tr.appendChild(numHeader);

    for (let i = 0; i < columnNames.length; i++) {
        td = document.createElement('div');
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

    changeRows(sortClass);
}

function changeRows(sortClass) {

    let students = createStudentsObjectsFromTable().students;
    let column = [];
    for (let i = 0; i < students.length; i++) {
        let dataValue = students[i][sortClass];
        let id = students[i]['id'];
        let student = [id, dataValue];
        column.push(student);
    }
//change rows not delete all and render whole table
    //use insertBefore method
    deleteOldTable();

    let sortedArray = sortData(column);

    for (let i = 0; i < sortedArray.length; i++) {
        for (let j = 0; j < students.length; j++) {
            if (sortedArray[i][0] === students[j]['id']) {
                table.appendChild(createRow(students[j]), students[j]['id']);//think about getting row number
            }
        }
    }

}

function deleteOldTable() {
    let rows = document.getElementsByClassName('row');
    while (rows.length > 0) {
        table.removeChild(rows[0]);
    }
}

function sortData(arr) {

    if (isNaN(arr[0][1])) {
        arr.sort(compareString);//change to localeCompare
    } else {
        arr.sort(compareNumeric);
    }

    return arr;
}

function compareString(a, b) {
    if (a[1] > b[1]) return 1;
    else if (a[1] < b[1]) return -1;
    else return 0;
}

function compareNumeric(a, b) {
    return a[1] - b[1];
}

function focusOnCell(event) {

    let target = event.target;

    while (target != table) {

        if (target.classList.contains('table-header')) {
            onTableHeadClick(target);
        }

        if (target.classList.contains('table-data')) {
            if (editingTd) return;

            makeTdEditable(target);
            return;
        }
        if (target.classList.contains('row-number')) {

            selectRow(target);
            return;
            // let row = target.parentNode;
            // row.addEventListener('focusout', onRowBlur);
        }

        target = target.parentNode;
    }

}

function selectRow(target) {
    let row = target.parentNode;
    for (let i = 0; i < TABLE_ROWS.length; i++) {
        if (TABLE_ROWS[i].classList.contains('active-row')) {
            TABLE_ROWS[i].classList.remove('active-row');
        }
    }

    row.classList.add('active-row');

}

function onRowBlur(event) {
    let row = event.target;
    row.classList.remove('active-row');
}

function makeTdEditable(td) {
//use contentEditable attr

    td.setAttribute('contenteditable', 'true');
    td.addEventListener('blur', onCellBlur);
    selectRow(td.parentNode.firstChild);

}

function onCellBlur(event) {
    //remove contentEditable attr

    let td = event.target;
    td.removeAttribute('contenteditable');

    let saveChangesButton = document.querySelector('#saveChangesButton');

    if (!saveChangesButton) {
        createSaveTableChangesButton();
    }
}

function createSaveTableChangesButton() {
    let saveButton = document.createElement('button');
    saveButton.setAttribute('id', 'saveChangesButton');
    saveButton.innerHTML = "Save";
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

        for (let j = 1; j < cells.length; j++) {

            key = cells[j].getAttribute('class').split(' ')[0];
            cellValue = cells[j].innerHTML;
            newStudent[key] = cellValue;

        }

        arrayOfStudents[i] = newStudent;

    }

    return newTable;
}