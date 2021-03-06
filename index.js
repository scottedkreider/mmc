const MONTHS = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
}

const DAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
}

// calendar data entry display
const cde = document.getElementById("calendar-entry");
// date calculations and reset button
const dc = document.getElementById("date-calculations");
// multimonth calendar display
const mmc = document.getElementById("multi-month-calendar");



window.addEventListener('DOMContentLoaded', (event) => {
    if(localStorage.getItem("mmc-3")){
        refresh();
    } else {
        cde.innerHTML += `<form>
            <div class = "form-group">
                <label for = "semesterStartDate">Enter the Semester Start Date</label>
                <input type = "date" value = "2022-02-23" name = "semesterStartDate" id = "semesterStartDate" onchange="laterStartDateHandler();">
            </div>
            <div class = "form-group">
                <label for = "semesterStartDate">Enter the Semester End Date</label>
                <input type = "date" value = "2022-03-12" name = "semesterEndDate" id = "semesterEndDate">
            </div>
            <button id = "semesterDatesSubmit" type = "button">Submit</button>
        </form>
        `;
        const semesterDatesListener = document.getElementById("semesterDatesSubmit");
        const refreshListener = document.getElementById("semesterDatesSubmit");

        semesterDatesListener.addEventListener("click", (event) => {
            event.preventDefault();
            if (confirm("Are you sure these are the correct dates?")) {
                getDates(semesterDatesListener);
            } else{
                location.reload();
            }
        });

        refreshListener.addEventListener("click", refresh);
        preventImproperDatesListener();
    }
});

function laterStartDateHandler(){
    const startDate = document.getElementById("semesterStartDate");
    const endDate = document.getElementById("semesterEndDate");
    if(startDate.value > endDate.value){
        endDate.value = `${startDate.value}`;
    }
}



// Calendar date entry

let semesterStartDate;
let semesterEndDate;
getDates = function (listener) {
    const startDateForm = document.getElementById("semesterStartDate");
    const endDateForm = document.getElementById("semesterEndDate");
    semesterStartDate = startDateForm.value;
    semesterEndDate = endDateForm.value;
    listener.disabled = true;
    startDateForm.disabled = true;
    endDateForm.disabled = true;

    // dateArray(semesterStartDate, semesterEndDate)
    let objectToStore = generateDayDescriptors(semesterStartDate, semesterEndDate);
    localStorage.setItem("mmc-3",JSON.stringify(objectToStore));
    refresh();
}




function generateDayDescriptors(startDate, endDate) {
    let dayDescriptors = [];
    let arrayOfDates = [];
    for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
        arrayOfDates.push(new Date(date));
    }
    totalNumberOfDays = Math.abs((new Date(semesterEndDate) - new Date(semesterStartDate)) / (1000 * 60 * 60 * 24));
    arrayOfDates.forEach((element, index) => {
        dayDescriptors[index] = {
            date: new Date(element),
            day: element.getUTCDate(),
            dayOfTheWeek: element.getDay() === 6 ? 0 : element.getDay() + 1,
            isChecked: false,
            month: element.getUTCMonth(),
            monthText: MONTHS[element.getUTCMonth()],
        }
    })
    return dayDescriptors;
}




refresh = function () {
    let myMMCInfo = JSON.parse(localStorage.getItem("mmc-3"));
    cde.innerHTML = '';

    // dc.innerHTML = `
    //     <div><h1>Total number of days = ${myMMCInfo.length}</h1></div>
    //     <div><button id = "clearSemesterButton">Clear Semester</button></div>
    // `;

    dc.innerHTML = `
    <div><button id = "clearSemesterButton">Clear Semester</button></div>
    `;

    mmc.innerHTML = `
    <div class = "container-fluid">
        <table class = "table table-bordered">
            <thead style = "position: sticky; top: 0;">
                <tr class = "header" height = "75px">
                    <th style="width: 9%" scope = "col" class = "header">WEEK</th>
                    <th style="width: 13%" scope = "col" class = "header">Sunday</th>
                    <th style="width: 13%" scope = "col" class = "header">Monday</th>
                    <th style="width: 13%" scope = "col" class = "header">Tuesday</th>
                    <th style="width: 13%" scope = "col" class = "header">Wednesday</th>
                    <th style="width: 13%" scope = "col" class = "header">Thursday</th>
                    <th style="width: 13%" scope = "col" class = "header">Friday</th>
                    <th style="width: 13%" scope = "col" class = "header">Saturday</th>
                </tr>
            </thead>
            <tbody>
                ${generateNumbers(myMMCInfo)}
            </tbody>    
        </table>
    </div>
`;

    checkBoxListener(myMMCInfo);
    resetListener();
}

resetListener = function(){
    const resetListenerButton = document.getElementById("clearSemesterButton");
    
    resetListenerButton.addEventListener('click',(event) => {
        event.preventDefault();
        if(confirm("Are you sure you want to delete this semester?")){
            localStorage.removeItem("mmc-3");
        }
        location.reload();
    })
}

preventImproperDatesListener = function(){
    const startDateForm = document.getElementById("semesterStartDate");
    const endDateForm = document.getElementById("semesterEndDate");
    const semesterDatesListener = document.getElementById("semesterDatesSubmit");

    semesterDatesListener.addEventListener('mouseover',(event) => {
        if(startDateForm.value > endDateForm.value){
            semesterDatesListener.disabled = !semesterDatesListener.disabled;
        }
    })
}



dayIsInThePast = function (date) {
    return new Date(new Date(date).toDateString()) < new Date(new Date().toDateString());
}

checkBoxListener = function (info) {
    // Checkbox listener
    const checkboxListener = document.querySelectorAll("input[type=checkbox]");
    checkboxListener.forEach(checkbox => {
        checkbox.addEventListener("click", () => {
            let id = parseInt(checkbox.id.substring(4,checkbox.id.length));
            if (dayIsInThePast(info[id].date) && !checkbox.isChecked) {
                info[id].isChecked = true;
                localStorage.setItem("mmc-3",JSON.stringify(info));
                checkbox.parentElement.parentElement.classList += "bg-success";
                checkbox.parentElement.innerHTML = "";
            } else{
                checkbox.checked = !checkbox.checked;
            }
        })
    })
}


generateNumbers = function (infoArray) {
    let dayText = "";
    let week = 1;
    let day = 0;
    let placeholders = [];
    for(var i = 0; i < infoArray[0].dayOfTheWeek; i++){
        placeholders.push({
            date: "",
            day: "",
            dayOfTheWeek: "",
            isChecked: true,
            month: "",
            monthText: "",
        });
    }
    placeholders.forEach((ph) => {
        infoArray.unshift(ph);
    })

    do {
        dayText += `<tr height = "150px" class = "font-weight-bold"><th scope = "row">${week}</th>`
        for (let i = 0; i < 7; i++) {
                if(day < infoArray.length){
                    if(infoArray[day].isChecked === true){
                        dayText += `<td class = "bg-success">${infoArray[day].monthText} ${infoArray[day].day}`;
                    } else{
                        dayText += `<td>${infoArray[day].monthText}  ${infoArray[day].day}
                            <div><input type = 'checkbox' id = 'test${String(day).padStart(5,'0')}' class = 'big-checkbox'>`;
                    }
                }
                day++;
            }
            dayText +="</div></td>";
        dayText += "</tr>";
        week++;
    } while (day < infoArray.length);

    return dayText;
}


