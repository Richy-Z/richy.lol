// data: value on 0-10 1d scale and tooltip explanation
// (conceptual placements based on relative market freedom, state control, privatisation, etc.)
const economies = [
    {
        name: "USSR (Stalinist era)",
        flag: "🚩",
        value: 0.2,
        detail:
            "Highly centralised command economy: state ownership of industry & agriculture, central planning, near-total suppression of markets."
    },
    {
        name: "North Korea (2025)",
        flag: "🇰🇵",
        value: 0.3,
        detail:
            "One of the closest modern examples to a command economy. Some informal markets exist, but the state dominates production, trade, and prices."
    },
    {
        name: "China (Mao era)",
        flag: "🇨🇳",
        value: 0.6,
        detail:
            "Fully centralised under Mao Zedong. State-controlled agriculture and industry, collectivisation, and central planning with minimal private activity."
    },
    {
        name: "USSR (Gorbachev)",
        flag: "🚩",
        value: 1.5,
        detail:
            "Perestroika and glasnost introduced limited enterprise & reforms, but core structures of a planned economy still dominated."
    },
    {
        name: "Russia (2025)",
        flag: "🇷🇺",
        value: 2.5,
        detail:
            "Formally a market system, but extensive state control over strategic sectors, renationalisation trends, sanctions, and political capture of key firms ever since the Russian Invasion of Ukraine."
    },
    {
        name: "China (2025)",
        flag: "🇨🇳",
        value: 3.5,
        detail:
            "Hybrid: large private sector & global trade integration, but strong Party control, state-owned giants, industrial policy, and tight constraints on capital."
    },
    {
        name: "Russia (Yeltsin, 1999)",
        flag: "🇷🇺",
        value: 5.5,
        detail:
            "Rapid, chaotic liberalisation & privatisation: high formal market freedom, weak institutions, oligarchic control, limited effective regulation."
    },
    {
        name: "France (2025)",
        flag: "🇫🇷",
        value: 6.5,
        detail:
            "Mixed / social market: strong welfare state & labour protections alongside competitive private markets and EU-embedded capitalism."
    },
    {
        name: "Japan (2025)",
        flag: "🇯🇵",
        value: 7.2,
        detail:
            "Advanced capitalist economy with active industrial policy, high regulation, and coordination between government and private sector — the ‘developmental state’ model."
    },
    {
        name: "United Kingdom (2025)",
        flag: "🇬🇧",
        value: 7.5,
        detail:
            "Largely liberalised: privatisation legacy, flexible labour market, open competition, with regulation and public services tempering pure laissez-faire."
    },
    {
        name: "USA (2025)",
        flag: "🇺🇸",
        value: 8.5,
        detail:
            "Among the most market-oriented major economies: strong private sector dominance, relatively light product & labour regulation, deep capital markets."
    }
];

const scaleLine = document.getElementById("scale-line");
const tooltip = document.getElementById("tooltip");

function createPoint(economy) {
    const point = document.createElement("div");
    point.className = "point";

    // value 0-10 -> 0-100%
    const clamped = Math.max(0, Math.min(10, economy.value));
    const leftPercent = (clamped / 10) * 100;
    point.style.left = leftPercent + "%";

    const dot = document.createElement("div");
    dot.className = "point-dot";

    const label = document.createElement("div");
    label.className = "point-label";
    label.textContent = `${economy.name} · ${economy.value.toFixed(1)}`;

    const flag = document.createElement("div");
    flag.className = "point-flag";
    flag.textContent = economy.flag;

    point.appendChild(dot);
    point.appendChild(label);
    point.appendChild(flag);

    point.addEventListener("mouseenter", (ev) => {
        tooltip.innerHTML =
            `<strong>${economy.name}</strong><br>` +
            `Position: <strong>${economy.value.toFixed(1)}</strong> / 10<br>` +
            `${economy.detail}`;
        const rect = ev.target.getBoundingClientRect();
        const top = rect.top - 70;
        const left = rect.left;
        tooltip.style.top = top + "px";
        tooltip.style.left = left + "px";
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateY(0)";
    });

    point.addEventListener("mousemove", (ev) => {
        const top = ev.clientY - 80;
        const left = ev.clientX + 10;
        tooltip.style.top = top + "px";
        tooltip.style.left = left + "px";
    });

    point.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translateY(4px)";
    });

    scaleLine.appendChild(point);
}

economies.forEach(createPoint);