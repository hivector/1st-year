// Question paper collection

const papers = {

    "Applied Chemistry": [
        "pyq/applied chem/applied chem dec_2022.pdf",
        "pyq/applied chem/applied chem may_2024.pdf",
        "pyq/applied chem/applied chem dec_ 2023.pdf",
        "pyq/applied chem/applied chem june_2023.pdf"
    ],

    "Applied Physics": [
        "pyq/applied physics/applied physics dec_2022.pdf",
        "pyq/applied physics/applied physics may_2024.pdf",
        "pyq/applied physics/applied physics jine_2023.pdf",
        "pyq/applied physics/applied physics may_2025.pdf",
        "pyq/applied physics/applied physics dec_2023.pdf"
    ],

    "Basic Electronics": [
        "pyq/basic electronics/2024 Dec Exam Basic Electronics QP.pdf",
        "pyq/basic electronics/2026 May Exam Basic Electronics QP.pdf",
        "pyq/basic electronics/2023 Dec Basic Electronics QP .pdf",
        "pyq/basic electronics/2025 Dec Exam Basic Electronics.pdf",
        "pyq/basic electronics/2023 Dec Basic Electronics QP -Dec.2023.pdf",
        "pyq/basic electronics/2022 Dec Basic Electronics QP.pdf",
        "pyq/basic electronics/2024 May Basic Electronics QP -May 2024.pdf.pdf",
        "pyq/basic electronics/2023 June Basic Electronics.pdf"
    ],

    "Communication and Report Writing": [
        "pyq/communication and report writing/communication and report writing dec_2022.pdf",
        "pyq/communication and report writing/communication and report writing may_2024.pdf",
        "pyq/communication and report writing/communication and report writing dec_2023.pdf",
        "pyq/communication and report writing/communication skill nov_2022.pdf",
        "pyq/communication and report writing/communication skill june_2022.pdf"
    ],

    "Linear Algebra and Calculus": [
        "pyq/linear algebra and calculus/linear algebra and calculus dec_2025.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus may_2025.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus nov_2024.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus may_2024.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus june_2023.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus dec_2023.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus dec_2022b.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus june_2026.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus dec_2022.pdf",
        "pyq/linear algebra and calculus/linear algebra and calculus may_2024b.pdf"
    ],

    "Introduction to CSE": [
        "pyq/intro cse/intro to cse june_2023.pdf",
        "pyq/intro cse/intro to cse assignment.pdf",
        "pyq/intro cse/intro to cse dec_2023.pdf",
        "pyq/intro cse/intro to cse jan_2025.pdf",
        "pyq/intro cse/intro to cse dec_2022.pdf",
        "pyq/intro cse/intro to cse may_2024.pdf"
    ],

    "Python Programming": [
        "pyq/[ITC 101] Python Programming.pdf"
    ],

    "Problem Solving Using Data Structures": [
        "pyq/[CSA 103] problem solving using dasa.pdf"
    ]

};


// ---------------------------------------------------------------
// Helpers: read month / year / type from each file name.
// Paths in `papers` are never changed; everything below is derived.
// ---------------------------------------------------------------

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// First three letters -> month index ("jine" is a typo in one file name)
const MONTH_INDEX = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jin: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

const MONTH_REGEX = /(?:^|[^a-z])(january|jan|february|feb|march|mar|april|apr|may|june|jine|jun|july|jul|august|aug|september|sept|sep|october|oct|november|nov|december|dec)(?![a-z])/;
const YEAR_REGEX = /20\d{2}/;

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parsePaper(path) {

    const fileName = path.split("/").pop();
    const lower = fileName.toLowerCase();

    const monthMatch = lower.match(MONTH_REGEX);
    const yearMatch = lower.match(YEAR_REGEX);

    const month = monthMatch ? MONTH_INDEX[monthMatch[1].slice(0, 3)] : -1;
    const year = yearMatch ? Number(yearMatch[0]) : 0;

    const type = lower.includes("assignment") ? "Assignment" : "Question Paper";

    let label;

    if (year && month >= 0) {
        label = MONTH_NAMES[month] + " " + year;
    } else if (year) {
        label = String(year);
    } else {
        label = fileName.replace(/\.pdf(\.pdf)?$/i, "");
    }

    return { path, fileName, month, year, type, label };

}

// Build the parsed library once: { subject: [entries] }
const library = {};

for (let subject in papers) {

    const entries = papers[subject].map(parsePaper);

    // Two papers in the same month and year get "Set A", "Set B"...
    const groups = {};

    entries.forEach(function(entry) {
        const key = entry.year + "-" + entry.month;
        (groups[key] = groups[key] || []).push(entry);
    });

    for (let key in groups) {

        const group = groups[key];

        if (group.length > 1) {

            group.sort(function(a, b) {
                return a.fileName.localeCompare(b.fileName);
            });

            group.forEach(function(entry, i) {
                entry.label += " · Set " + String.fromCharCode(65 + i);
            });

        }

    }

    // Newest first: year, then month. Undated papers go last.
    entries.sort(function(a, b) {
        if (a.year !== b.year) return b.year - a.year;
        if (a.month !== b.month) return b.month - a.month;
        return a.label.localeCompare(b.label);
    });

    // Text that search matches against
    entries.forEach(function(entry) {
        const full = entry.month >= 0 ? MONTH_NAMES[entry.month].toLowerCase() : "";
        entry.searchText = (full + " " + full.slice(0, 3) + " " + entry.year + " " + entry.type).toLowerCase();
    });

    library[subject] = entries;

}


// HTML elements

const subjectList = document.getElementById("subject-list");
const paperList = document.getElementById("paper-list");
const searchInput = document.getElementById("search-input");
const totalPapers = document.getElementById("total-papers");

const pdfViewer = document.getElementById("pdf-viewer");
const pdfTitle = document.getElementById("pdf-title");
const downloadButton = document.getElementById("download-pdf");


// State

let selectedSubject = "";
let selectedPath = "";


// Papers of a subject that match the search.
// A subject-name match keeps all of that subject's papers.

function matchingPapers(subject, query) {

    if (!query || subject.toLowerCase().includes(query)) {
        return library[subject];
    }

    return library[subject].filter(function(entry) {
        return entry.searchText.includes(query);
    });

}

function currentQuery() {
    return searchInput.value.trim().toLowerCase();
}

function plural(n) {
    return n + (n === 1 ? " paper" : " papers");
}


// Total paper count (top right of the page)

let total = 0;
for (let subject in library) total += library[subject].length;
totalPapers.textContent = total;


// Subject cards

function displaySubjects() {

    const query = currentQuery();

    subjectList.innerHTML = "";

    for (let subject in library) {

        const matches = matchingPapers(subject, query);

        if (query && matches.length === 0) continue;

        const button = document.createElement("button");

        const name = document.createElement("span");
        name.textContent = subject;

        const count = document.createElement("span");
        count.className = "pyq-count";
        count.textContent = plural(matches.length) + " →";

        button.appendChild(name);
        button.appendChild(count);

        button.classList.toggle("active", subject === selectedSubject);

        button.addEventListener("click", function() {
            selectSubject(subject);
        });

        subjectList.appendChild(button);

    }

    if (!subjectList.children.length) {

        const empty = document.createElement("p");
        empty.className = "pyq-empty";
        empty.textContent = "No subjects or papers match your search.";
        subjectList.appendChild(empty);

    }

}


// Paper panel for the selected subject

function displayPapers() {

    paperList.innerHTML = "";

    if (!selectedSubject) {
        const hint = document.createElement("p");
        hint.textContent = "Select a subject to view available papers.";
        paperList.appendChild(hint);
        return;
    }

    const matches = matchingPapers(selectedSubject, currentQuery());

    const panel = document.createElement("div");
    panel.className = "pyq-panel";

    const head = document.createElement("div");
    head.className = "pyq-panel-head";

    const title = document.createElement("h3");
    title.textContent = selectedSubject;

    const count = document.createElement("span");
    count.textContent = plural(matches.length);

    head.appendChild(title);
    head.appendChild(count);
    panel.appendChild(head);

    if (matches.length === 0) {
        const empty = document.createElement("p");
        empty.className = "pyq-empty";
        empty.textContent = "No matching papers found.";
        panel.appendChild(empty);
        paperList.appendChild(panel);
        return;
    }

    // Group by year (matches is already newest first)
    const years = [];
    const byYear = {};

    matches.forEach(function(entry) {
        const key = entry.year || "Other";
        if (!byYear[key]) {
            byYear[key] = [];
            years.push(key);
        }
        byYear[key].push(entry);
    });

    years.forEach(function(year) {

        const details = document.createElement("details");
        details.className = "pyq-year";
        details.open = true;

        const summary = document.createElement("summary");

        const yearLabel = document.createElement("span");
        yearLabel.textContent = year;

        const yearCount = document.createElement("span");
        yearCount.className = "pyq-year-count";
        yearCount.textContent = plural(byYear[year].length);

        summary.appendChild(yearLabel);
        summary.appendChild(yearCount);
        details.appendChild(summary);

        const rows = document.createElement("div");
        rows.className = "pyq-rows";

        byYear[year].forEach(function(entry) {

            const row = document.createElement("button");
            row.className = "pyq-row";
            row.classList.toggle("active", entry.path === selectedPath);

            const when = document.createElement("span");
            when.className = "pyq-when";
            when.textContent = entry.label;

            const meta = document.createElement("span");
            meta.className = "pyq-meta";

            const type = document.createElement("span");
            type.className = "pyq-type";
            type.textContent = entry.type;

            const pdf = document.createElement("span");
            pdf.className = "pyq-pdf";
            pdf.textContent = "PDF";

            meta.appendChild(type);
            meta.appendChild(pdf);
            row.appendChild(when);
            row.appendChild(meta);

            // Same PDF behaviour as before
            row.addEventListener("click", function() {

                const pdfPath = encodeURI(entry.path);

                pdfViewer.src = pdfPath;
                pdfTitle.textContent = entry.fileName.replace(".pdf", "");
                downloadButton.href = pdfPath;
                downloadButton.hidden = false;

                    // Jump to the PDF viewer
                document.querySelector(".pdf-section").scrollIntoView({ behavior: "smooth", block: "start" });

                selectedPath = entry.path;

                paperList.querySelectorAll(".pyq-row").forEach(function(r) {
                    r.classList.toggle("active", r === row);
                });

            });

            rows.appendChild(row);

        });

        details.appendChild(rows);
        panel.appendChild(details);

    });

    paperList.appendChild(panel);

}



function selectSubject(subject) {

    selectedSubject = subject;

    try {
        history.replaceState(null, "", "#" + slugify(subject));
    } catch (error) {
        // Some browsers block this when the page is opened as a local file
    }

    displaySubjects();
    displayPapers();

    // Jump to this subject's papers
    paperList.scrollIntoView({ behavior: "smooth", block: "start" });

}


// Search functionality

searchInput.addEventListener("input", function() {
    displaySubjects();
    displayPapers();
});


// Initial display (opens a subject if the link has #subject-name)

const hashSlug = location.hash.slice(1);

for (let subject in library) {
    if (slugify(subject) === hashSlug) selectedSubject = subject;
}

displaySubjects();
displayPapers();
