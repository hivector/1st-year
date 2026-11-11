const cards = document.querySelectorAll('.semester-card');
const sections = document.querySelectorAll('.subject-section');

function openSemester(id) {
    sections.forEach(section => {
        section.classList.toggle('open', section.id === id);
    });

    cards.forEach(card => {
        card.classList.toggle('active', card.getAttribute('href') === '#' + id);
    });
}

cards.forEach(card => {
    card.addEventListener('click', event => {
        event.preventDefault();
        const id = card.getAttribute('href').slice(1);
        openSemester(id);
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Semester One is open by default
openSemester('semester-one');
