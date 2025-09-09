document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("./timetable.json");
    const data = await res.json();

    const wrapper = document.getElementById("timetable-wrapper");
    const template = document.getElementById("timetable-template");

    const weeks = { a: "Week A", b: "Week B" };
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const periods = ["P1", "P2", "P3", "P4", "P5", "P6"];

    for (const key of ["a", "b"]) {
        const clone = template.content.cloneNode(true);
        clone.querySelector("h3").textContent = weeks[key];

        const tbody = clone.querySelector("tbody");

        periods.forEach((period, i) => {
            const tr = document.createElement("tr");
            if (period === "P3") {
                tbody.appendChild(makeSpecialRow("Break"));
            } else if (period === "P5") {
                tbody.appendChild(makeSpecialRow("Lunch"));
            }

            const periodLabel = document.createElement("td");
            periodLabel.className = "px-3 py-2 font-medium";
            periodLabel.textContent = period;
            tr.appendChild(periodLabel);

            for (const d of days) {
                const [subject, room] = data[key][d][i] || ["—", ""];

                const [bg, fg] = data.colours[subject] || [];

                const td = document.createElement("td");
                td.className = `px-3 py-2 text-center align-middle border border-neutral-700 ${bg}`;

                const subjectDiv = document.createElement("div");
                subjectDiv.className = `font-bold ${fg}`;
                subjectDiv.textContent = subject;

                if (room) {
                    const divRoom = document.createElement("div");
                    divRoom.className = "text-xs text-neutral-700";
                    divRoom.textContent = room;
                    td.appendChild(subjectDiv);
                    td.appendChild(divRoom);
                } else {
                    td.appendChild(subjectDiv);
                }

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });

        wrapper.appendChild(clone);
    }
});

function makeSpecialRow(label) {
    const tr = document.createElement("tr");
    tr.className = "bg-neutral-800";
    const td = document.createElement("td");
    td.className = "px-3 py-2 font-medium";
    td.textContent = label;
    tr.appendChild(td);

    const td2 = document.createElement("td");
    td2.className = "px-3 py-2";
    td2.setAttribute("colspan", "5");
    tr.appendChild(td2);

    return tr;
}
