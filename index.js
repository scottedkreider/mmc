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
    12: "scott",
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

// cde mmc

// Calendar date entry
const cde = document.getElementById("calendar-entry");

cde.innerHTML = `
<form>
    <div class = "form-group">
        <label for = "semesterStartDate">Enter the Semester Start Date</label>
        <input type = "date" value = "2022-01-16" name = "semesterStartDate" id = "semesterStartDate">
    </div>
    <div class = "form-group">
        <label for = "semesterStartDate">Enter the Semester End Date</label>
        <input type = "date" value = "2022-05-07" name = "semesterEndDate" id = "semesterEndDate">
    </div>
    <button id = "semesterDatesSubmit" type = "button">Submit</button>
</form>
`


let semesterStartDate;
let semesterEndDate;

const semesterDatesListener = document.getElementById("semesterDatesSubmit");


getDates = function(){
        const startDateForm = document.getElementById("semesterStartDate");
        const endDateForm = document.getElementById("semesterEndDate");
        semesterStartDate = startDateForm.value;
        semesterEndDate = endDateForm.value;
        semesterDatesListener.disabled = true;
        startDateForm.disabled = true;
        endDateForm.disabled = true;
    
        dateArray(semesterStartDate, semesterEndDate)

        localStorage.setItem("id-500-items",`${semesterStartDate}`);
    }

semesterDatesListener.addEventListener("click",
                                        function(event) {
                                            event.preventDefault();
                                            if(confirm("Are you sure these are the correct dates?")){
                                                getDates();
                                            }
                                        });



// date calculations
const dc = document.getElementById("date-calculations");


// let semesterStartDate;
// let semesterEndDate;
let arrayOfDates = [];
let dayDescriptors = [];
let totalNumberOfDays;

function dateArray(startDate, endDate){
    for(let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)){
        arrayOfDates.push(new Date(date));
    }
    totalNumberOfDays = Math.abs((new Date(semesterEndDate) - new Date(semesterStartDate)) / (1000 * 60 * 60 * 24));
    arrayOfDates.forEach((element, index) => {
        dayDescriptors[index] = {
            date: element,
            day: element.getDate(),
            dayOfTheWeek: element.getDay(),
            showStatus: "visible",
            month: element.toLocaleString('default', {month: 'long'}),
        }
    })
}




refresh = function(){
    dc.innerHTML = `
        <h1>Total number of days = ${totalNumberOfDays}</h1>
    `

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
                ${generateNumbers()}
            </tbody>    
        </table>
    </div>
`
checkBoxListener();
}

dayIsInThePast = function(){
    return true;
}

checkBoxListener = function(){
    // Checkbox listener
    const checkboxListener = document.querySelectorAll("input[type=checkbox]");
    checkboxListener.forEach(checkbox => {
        checkbox.addEventListener("click",() => {
            if(dayIsInThePast() && checkbox.checked){
                checkbox.disabled = true;
                checkbox.parentElement.parentElement.classList += "bg-info";
                checkbox.parentElement.innerHTML = "";
            }
        })
    })
}

const mmc = document.getElementById("multi-month-calendar");
generateNumbers = function(){
    let dayText = "";
    let week = 1;
    let day = 1;
    do{
        dayText += `<tr height = "150px"><th scope = "row">${week}</th>`
        for(let i = 0; i < 7; i++){
            if(week === 1 && i < dayDescriptors[0].dayOfTheWeek){
                dayText += `
                <td></td>
                `;
            } else{
                dayText += `
                <td>${dayDescriptors[day] ? `${dayDescriptors[day].month} - ` + `${dayDescriptors[day].day}` : ""}
                    <div>
                        <input type = "checkbox" id = "cb_${day}" class = "big-checkbox">
                    </div>
                </td>
                `;
                day++;
            }
        }
        dayText += "</tr>"
        week++;
    } while(day < arrayOfDates.length);

    return dayText;
}

const refreshListener = document.getElementById("semesterDatesSubmit");
refreshListener.addEventListener("click",refresh);


console.log(localStorage.getItem("id-500-items"));