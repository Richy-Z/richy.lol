(async () => {
    const res = await fetch("./timetable_v2.json");
    const data = await res.json();

    const wrapper = document.getElementById("timetable-wrapper");
    const tableTemplate = document.getElementById("timetable-template");
    const specialRowTemplate = document.getElementById("special-row-template");
    const cellTemplate = document.getElementById("period-cell-template");

    const weeks = { a: "Week A", b: "Week B" };
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const periods = ["P1", "P2", "P3", "P4", "P5", "P6"];

    function fillerRow(label) {
        const clone = specialRowTemplate.content.cloneNode(true);
        clone.querySelector("td").textContent = label;
        return clone;
    }

    for (const key of ["a", "b"]) {
        const tableClone = tableTemplate.content.cloneNode(true);
        tableClone.querySelector("h3").textContent = weeks[key];
        const tbody = tableClone.querySelector("tbody");

        periods.forEach((period, i) => {
            if (period === "P3") tbody.appendChild(fillerRow("Break"));
            if (period === "P5") tbody.appendChild(fillerRow("Lunch"));

            const tr = document.createElement("tr");

            // period label cell
            const periodCell = document.createElement("td");
            periodCell.className = "px-3 py-2 font-medium";
            periodCell.textContent = period;
            tr.appendChild(periodCell);

            // weekdays
            for (const d of days) {
                const info = data[key][d][i];
                const cellClone = cellTemplate.content.cloneNode(true);
                const td = cellClone.querySelector("td");
                td.classList.add("relative"); // for friend initials positioning

                if (!info) {
                    td.querySelector(".subject-text").textContent = "—";
                    td.querySelector(".room-text").textContent = "";
                } else {
                    // subject + colours
                    const [bg, fg] = data.colours[info.subject] || [];
                    if (bg) td.classList.add(bg);
                    if (fg) td.querySelector(".subject-text").classList.add(fg);
                    td.querySelector(".subject-text").textContent = info.subject;

                    // room
                    td.querySelector(".room-text").textContent = info.room || "";

                    // teacher, optional because some subjs like econ only have one
                    if (info.teacher) {
                        const teacherEl = td.querySelector(".teacher-text");
                        teacherEl.textContent = info.teacher;
                        teacherEl.classList.remove("hidden");
                    }

                    // friends
                    if (info.friends && info.friends.length > 0) {
                        const friendsList = td.querySelector(".friends-list");

                        // friend initials
                        info.friends.forEach(initial => {
                            const span = document.createElement("span");
                            span.className = "text-[0.65rem] text-neutral-700 leading-tight";
                            span.textContent = initial;
                            friendsList.appendChild(span);
                        });

                        // grid cols based on amount of friends
                        // bc in the case of an abhorrent amount like in YE, we need cols
                        if (info.friends.length > 6) {
                            friendsList.classList.add("grid-cols-3");
                        } else if (info.friends.length > 3) {
                            friendsList.classList.add("grid-cols-2");
                        } else {
                            friendsList.classList.add("grid-cols-1");
                        }
                    }

                }

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });

        wrapper.appendChild(tableClone);
    }
})();
