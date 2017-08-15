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

            table.appendChild(createRow(jsonStudents[i]));

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
        column.push(dataValue);
    }
    console.log(column);
    let sortedArray = sortData(column);
    for(let j = 0; j<sortedArray.length; j++){
        for(let k=0; k<students.length; k++) {
            if (students[k][sortClass] === sortedArray[j]) {
                table.appendChild(createRow(students[k]));
            }
        }
    }

}

function sortData(arr) {
    if (isNaN(arr[0])) {
        arr.sort();
        // console.log("Сортировка нечисел");
    } else {
        arr.sort(compareNumeric);
        // console.log("Сортировка чисел");
        // console.log(+sortArrValue[0]);
    }
    return arr;
}

function compareNumeric(a, b) {
    return a - b;
}

function createRow(student) {

    let row = document.createElement('tr');
    row.setAttribute('class', 'row');

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
        // if (target.className == 'edit-cancel') {
        //     finishTdEdit(editingTd.elem, false);
        //     return;
        // }
        //
        // if (target.className == 'delete') {
        //     deleteCellValue(target);
        //     return;
        // }
        //
        // if (target.className == 'edit-ok') {
        //     finishTdEdit(editingTd.elem, true);
        //     tableHadEdited = true;
        //
        //     let saveChangesButton = document.querySelector('#saveChangesButton');
        //
        //     if (!saveChangesButton) {
        //         createSaveTableChangesButton();
        //     }
        //
        //     return;
        // }

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

// function deleteCellValue(target) {
//     let textArea = target.parentNode.previousSibling;
//     textArea.value = '';
// }

// function finishTdEdit(td, isOk) {
//     if (isOk) {
//         td.innerHTML = td.firstChild.value;
//     } else {
//         td.innerHTML = editingTd.data;
//     }
//     td.classList.remove('edit-td'); // remove edit class
//     editingTd = null;
// }

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

        for (let j = 0; j < cells.length; j++) {

            key = cells[j].getAttribute('class');
            cellValue = cells[j].innerHTML;
            newStudent[key] = cellValue;

        }
        arrayOfStudents[i] = newStudent;

    }

    return newTable;
}