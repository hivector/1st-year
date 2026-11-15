// Shared top navigation.
// To add or rename a page, edit this list. Every page picks it up.

const pages = [
    { label: "Home", href: "index.html" },
    { label: "Syllabus", href: "syllabus.html" },
    { label: "PYQs", href: "pyq.html" },
    { label: "Essentials", href: "exams.html" },
    { label: "Timetable", href: "timetable.html" },
    { label: "About", href: "about.html" }
];

const topbar = document.getElementById("topbar");

// Current file name, e.g. "pyq.html" ("index.html" for the bare folder URL)
const currentPage = location.pathname.split("/").pop() || "index.html";

pages.forEach(function(page) {

    const link = document.createElement("a");
    link.href = page.href;
    link.textContent = page.label;

    if (page.href === currentPage) {
        link.classList.add("active");
    }

    topbar.appendChild(link);

});
