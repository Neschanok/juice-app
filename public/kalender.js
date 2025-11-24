document.addEventListener("DOMContentLoaded", function() {
    const kalender = document.querySelector(".kalender"),
    date = document.querySelector(".date"),
    dageContainer = document.querySelector(".dage"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next");


let today = new Date();
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
];

//Funktion til at tilføje dage
function inputKalender() {
    //For at få forrige måneders dage, nuværende måneds dage og kommende måneds dage
    const firstDayDate = new Date(year , month, 1); //ugedag for første dag
    const lastDayDate = new Date(year, month + 1, 0); //Sidste dato i måneden
    const lastDay = new Date(year , month + 1, 0); //sidste ugedag for måneden

    const firstWeekdayR = firstDayDate.getDay();
    const prevLastDay = new Date(year , month, 0); //Sidste dag fra forrige måned
    const lastDate = lastDayDate.getDate();
    const prevDays = prevLastDay.getDate(); //dato fra forrige måned
    const lastWeekdayR = lastDayDate.getDay();

    
    const firstWeekday = (firstWeekdayR + 6) % 7; 
    const lastWeekday = (lastWeekdayR + 6) % 7; 

    const nextDays = 6 - lastWeekday; //antal dage fra næste måned

    //updater dato i toppen af kalenderen
    date.innerHTML = months[month] + " " + year;

    //tilføjer dage 
    let dage = "";
    
    //Forrige måneds dage
    for (let x = firstWeekday; x > 0; x--) {
        dage += `<div class="dag prev-date">${prevDays - x +1}</div>`;
    }

    //Nuværende måneds dage
    for (let i = 1; i <= lastDate; i++) {
        //Hvis dag er i dag, så add class today
        if (
            i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
        ) {
            dage += `<div class="dag today">${i}</div>`;
        }
        //Tilføje det resterende til kalenderen
        else {
            dage += `<div class="dag">${i}</div>`;
        }
        }

        //næste måneds dage
        for (let j = 1; j <= nextDays; j++) {
            dage += `<div class="dag next-date">${j}</div>`;
        }
    dageContainer.innerHTML = dage;
}

inputKalender();
});

console.log("JS virker!");