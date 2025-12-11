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

    //initiere et tomt array
    let eventsArr =[]
    //Kalder call loadEventsFromDB
    loadEventsFromDB();

    async function loadEventsFromDB() {
        try {
            const response = await fetch("http://localhost:6005/events");
            const events = await response.json();

            eventsArr = [];

            events.forEach(ev => {
                const { day, month, year } = ev;
            

            let found = eventsArr.find(e => 
                e.day === day &&
                e.month === month &&
                e.year === year
            );

            if (!found) { found = {day, month, year, events: []};
                eventsArr.push(found);
            }

            found.events.push({
                title: ev.title,
                time: ev.start_time + " - " + ev.end_time,
                id: ev.id
            });
        });
        updateEvents(activeDay);
        inputKalender();
        } catch(error) {
            console.error("Fejl ved hentning af events:", error)
        }
    }

    async function addEventToDB(day, month, year, title, start_time, end_time) {
        try {            
            await fetch("http://localhost:6005/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    title: title,
                    start_time: start_time,
                    end_time: end_time,
                    day: day,
                    month: month,
                    year: year
                })
            });
            loadEventsFromDB(); //hent opdateret liste
        } catch(error) {
            console.error("Kunne ikke gemme event:", error)
        }
    }

    async function deleteEventFromDB(id) {
        try {
            await fetch(`http://localhost:6005/events/${id}`, { method: "delete" });
        } catch(error) {
            console.error("Fejl ved sletning", error);
        }
    }

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
            if (event) {
                dage += `<div class="dag event">${i}</div>`;
            } else {
                dage += `<div class="dag">${i}</div>`
            }
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

//Gå til valgt dato via "Enter"
dateInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        gotoBtn.click();
    }
})
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
    if (addEventFrom.value.length === 2 && !addEventFrom.value.includes(":")) {
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

    async function updateEvents(date) {
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
                        <div class="event" data-id="${event.id}" data-index="${index}">
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

        const deleteBtns = document.querySelectorAll(".delete-btn");
        deleteBtns.forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                if (confirm("Er du sikekr på at slette dette event?")) {
                    await deleteEventFromDB(id);
                    await loadEventsFromDB();
                }
            });
        });
    }

    //Funktion til at tilføje events
    addEventSubmit.addEventListener("click", async () => {
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

        await addEventToDB(activeDay, month + 1, year, eventTitle, eventTimeFrom, eventTimeTo);
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

    //submit event via "Enter" fra title inputfelt
    addEventTitle.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEventSubmit.click();
        }
    });

    //submit event via "Enter" fra tids inputfelterne
    addEventFrom.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEventSubmit.click();
        }
    });
    addEventTo.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addEventSubmit.click();
        }
    });

    //Funktion til at slette event når man klikker på event
    eventsContainer.addEventListener("click", async (e) => {
        //For at finde den nærmeste .event boks
        const eventEl = e.target.closest(".event");
        if (!eventEl) return;
        const id = eventEl.getAttribute("data-id");

        //Bekræfter
        if (confirm("Er du sikker på, at du vil dette event?")) {
            await deleteEventFromDB(id);
            //Opdater visningen
            updateEvents(activeDay);
            showEvents(activeDay, month, year);
        }
    });

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