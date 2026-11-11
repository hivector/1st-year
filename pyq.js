
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


// HTML elements

const subjectList = document.getElementById("subject-list");
const paperList = document.getElementById("paper-list");
const searchInput = document.getElementById("search-input");

const pdfViewer = document.getElementById("pdf-viewer");
const pdfTitle = document.getElementById("pdf-title");
const downloadButton = document.getElementById("download-pdf");


// Currently selected subject

let selectedSubject = "";


// Display subjects

function displaySubjects(search = "") {

    subjectList.innerHTML = "";

    for (let subject in papers) {

        if (subject.toLowerCase().includes(search.toLowerCase())) {

            const button = document.createElement("button");

            button.textContent = subject;

            button.classList.toggle(
                "active",
                subject === selectedSubject
            );

            button.addEventListener("click", function() {

                selectedSubject = subject;

                searchInput.value = "";

                displaySubjects();
                displayPapers(subject);

            });

            subjectList.appendChild(button);

        }

    }

}


// Display question papers

function displayPapers(subject, search = "") {

    paperList.innerHTML = "";

    const subjectPapers = papers[subject];

    const filteredPapers = subjectPapers.filter(function(path) {

        const fileName = path.split("/").pop();

        return fileName.toLowerCase().includes(search.toLowerCase());

    });

    if (filteredPapers.length === 0) {

        paperList.textContent = "No matching papers found.";
        return;

    }

    filteredPapers.forEach(function(path) {

        const button = document.createElement("button");

        const fileName = path.split("/").pop();

        button.textContent = fileName.replace(".pdf", "");

        button.addEventListener("click", function() {

            const pdfPath = encodeURI(path);

            pdfViewer.src = pdfPath;

            pdfTitle.textContent = fileName.replace(".pdf", "");

            downloadButton.href = pdfPath;

            downloadButton.hidden = false;

        });

        paperList.appendChild(button);

    });

}


// Search functionality

searchInput.addEventListener("input", function() {

    const search = searchInput.value.toLowerCase();

    if (selectedSubject) {

        displayPapers(selectedSubject, search);

    } else {

        displaySubjects(search);

    }

});


// Initial display

displaySubjects();

