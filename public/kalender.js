document.addEventListener("DOMContentLoaded", function() {
    const kalender = document.querySelector(".kalender"),
    date = document.querySelector(".date"),
    dageContainer = document.querySelector(".dage"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    idagBtn = document.querySelector(".idag-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDag = document.querySelector(".event-dag"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventSubmit = document.querySelector(".add-event-btn");


    const ugedage = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];


let today = new Date();
let month = today.getMonth();
let activeDay;
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

/*Default events
const eventsArr = [
    {
        day: 16,
        month: 11,
        year: 2025,
        events: [
            {
                title: "Event 1 hey jo",
                time: "10:00AM",
            },
            {
                title: "Event 2",
                time: "11:00 AM",
            },
        ],
    },
    {
        day: 18,
        month: 11,
        year: 2025,
        events: [
            {
                title: "Event 1 Bitchy time",
                time: "10:00AM",
            },
        ],
    },
];
*/

//initiere et tomt array
let eventsArr =[]
//Kalder call getEvents
getEvents();


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

        //check hvis event forgår på nuværende dag
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            )
            {
                event = true;
            }
        });

        //Hvis dag er i dag, så add class today
        if (
            i === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(Number(activeDay));

            //hvis event er fundet, tilføj også event class
            if (event) {
                dage += `<div class="dag today active event">${i}</div>`;
            }
            else {
                dage += `<div class="dag today active">${i}</div>`;
            }
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

    //add listner efter kalder er initialiseret
    addListner();
}

inputKalender();

//Forrige måned
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    inputKalender();
}
//Næste måned
function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++; 
    }
    inputKalender();
}

//tilføjer eventlistener på forrige og næste måneds pointing arrow icon
prev.addEventListener("click", prevMonth)
next.addEventListener("click", nextMonth)

//Tilføjer goto date og goto idag funktionaliteter
idagBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    inputKalender();
})

dateInput.addEventListener("input", (e) => {
    //Tillad kun tal - fjern alt andet
    dateInput.value = dateInput.value.replace(/[^0-9]/g, "");

    if (dateInput.value.length > 2 && dateInput.value[2] !== "/") {  
    //tilføj '/', hvis to tal er indtastet
        dateInput.value = dateInput.value.slice(0,2) +  "/" + dateInput.value.slice(2);
    }

    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7)
    }

})

gotoBtn.addEventListener("click", gotoDate);

//funktion til at få til den indtastede dato
function gotoDate() {
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = parseInt(dateArr[1]);
            inputKalender();
            return;
        }
    }
    //hvis dato er ugyldig
    alert("invalid date");
}

const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventCloseBtn = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");


addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if(e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
});

//For at tilføje kun 50 karakterer i titlen
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});

//For From time
addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    //hvis to tal er indtastet tilføj ':' auto
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    } //max. 5 karakter kan indtastes
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
})

//For To time
addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    //hvis to tal er indtastet tilføj ':' auto
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    } //max. 5 karakter kan indtastes
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
})

function addListner() {
    const dage = document.querySelectorAll(".dag");
    dage.forEach((dag) => {
        dag.addEventListener("click", (e) => {
            //Sætter den globale variabel activeDay som aktiv
            activeDay = Number(e.target.innerHTML);

            //Fjerner aktiv fra dage som har været aktive
            dage.forEach((dag) => dag.classList.remove("active"));

            //Tilføjer aktiv, hvis der trykket goto prev måned
            if (e.target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    //Vælger alle dage i måneden
                    const dage = document.querySelectorAll(".dag");
                    //Efter at have gået til prev måned tilføje aktiv 
                    dage.forEach((dag) => {
                        if(
                            !dag.classList.contains("prev-date") &&
                            Number(dag.innerHTML) === activeDay
                        ) {
                            dag.classList.add("active");
                            //Kalder aktive dag efter klikac
                            getActiveDay(activeDay);
                            updateEvents(activeDay)
                        }
                    });
                }, 100)
            //samme for næste måneds dage
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    //Vælger alle dage i måneden
                    const dage = document.querySelectorAll(".dag");
                    //Efter at have gået til prev måned tilføje aktiv 
                    dage.forEach((dag) => {
                        if(
                            !dag.classList.contains("next-date") &&
                            Number(dag.innerHTML) === activeDay
                        ) {
                            dag.classList.add("active");
                            getActiveDay(activeDay);
                            updateEvents(activeDay)
                        }
                    });
                }, 100)
            } else {
                e.target.classList.add("active");
                getActiveDay(activeDay);
                updateEvents(activeDay)
            }
        });
    });
};

//For at vise den aktive dags events og dato i toppen:
function getActiveDay(dag) {
    const dayNum = Number(dag);
    const selectedDate = new Date(year, month, dayNum);
    const dagNavn = ugedage[selectedDate.getDay()];
    eventDag.innerHTML = dagNavn;
    eventDate.innerHTML = `${dayNum} ${months[month]} ${year}`;
}

function updateEvents(date) {
    //rydder containeren, så gamle events forsvinder
    eventsContainer.innerHTML = "";
    let eventsHTML = "";

    // Alle dage i eventsArr løbes igennem
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            //Alle events for den dag tilføjes
            event.events.forEach((event, index) => {
                eventsHTML += `
                    <div class="event" data-index="${index}">
                        <div class="title">
                            <i class="fas fa-circle"></i>
                            <h3 class="event-title">${event.title}</h3>
                        </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>          
                </div>`;
            });
        }
    })
    //hvis der ikke er fundet nogen events, vises besked med "No Events"
    if (eventsHTML === "") {
        eventsHTML = `
            <div class="no-event">
                <h3>Din eventliste er tom <br> Tilføj dine events!</h3>
            </div>
        `;
    }
    eventsContainer.innerHTML = eventsHTML;
    //For at gemme events når update event bliver kaldt
    saveEvents();
}

//Funktion til at tilføje events
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    //Validationer
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all the fields");
        return;
    }

    //Tjekker om det er korrekt klokkeslætsformat 24 timer
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] >  59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert ("Invalid Klokkeslæt");
        return;
    }
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    //Tjekker om event allerede er tilføjet
    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((ev) => {
                if (ev.title === eventTitle) {
                    eventExist = true;
                }
            });
        }
    });
    if (eventExist) {
        alert("Event allerede tilføjet");
        return;
    }
    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };
    console.log(newEvent);
    console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent]
        });
    }
    console.log(eventsArr);
    addEventContainer.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);

    //For at vælge aktiv dag og tilføj event class, hvis den ikke er tilføjet
    const activeDayEl = document.querySelector(".dag.active");
    if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
    }
});

    //Funktion til at slette event når man klikker på event
    eventsContainer.addEventListener("click", (e) => {
        //For at finde den nærmeste .event boks
        const eventEl = e.target.closest(".event");
        if (!eventEl) return;

        //Bekræfter
        if (confirm("Er du sikker på, at du vil dette event?")) {
            //finder event-titel
            const eventTitleEl = eventEl.querySelector(".event-title");
            if (!eventTitleEl) {
                console.warn("Kan ikke finde event-title inde i boksen");
                return;
            }
            //henter titlen
            const eventTitle = eventTitleEl.innerText.trim();

            //finder dag-objektet i eventsArr
            const dagObj = eventsArr.find(dayObj =>
                dayObj.day === activeDay &&
                dayObj.month === month + 1 &&
                dayObj.year === year                    
            );

            //finder dagen i eventsArr som matcher activeDay/month/year
            if (dagObj) {
            //Event fjernes fra dags-listen
            dagObj.events = dagObj.events.filter(item => item.title !== eventTitle);
            //Fjern hele dag-objektet, hvis der ikke er flere events tilbage på dagen
            if (dagObj.events.length === 0) {
                const index = eventsArr.indexOf(dagObj);
                if (index > -1) eventsArr.splice(index, 1);

                            //Sletter event class fra dag
                const activeDayEl = document.querySelector(".dag.active");
                if (activeDayEl) activeDayEl.classList.remove("event");
                }
            }
        //Opdater visningen
        updateEvents(activeDay);
        }
    });

    //Funktion der gemmer event i localstorage
    function saveEvents() {
        localStorage.setItem("events", JSON.stringify(eventsArr));
    }

    //Funktion der henter events from localstorage
    function getEvents() {
        //Tjekker om eventet allerede er gemt i localstorage, så return event, ellers ingenting
        if (localStorage.getItem("events") === null) {
            return;
        }
        eventsArr.push(...JSON.parse(localStorage.getItem("events")));
    }

    function convertTime(time) {
        let timeArr = time.split(":");
        let timeHour = timeArr[0];
        let timeMin = timeArr[1];
        let timeFormat = timeHour >= 12 ? "PM" : "AM";
        timeHour = timeHour % 12 || 12;
        time = timeHour + ":" + timeMin + " " + timeFormat;
        return time;
    }

});


console.log("JS virker!");