'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copyButton');
    const customLinks = document.querySelectorAll('.customLink');
    const filterForm = document.querySelector('#filterForm');

    for (let i = 0; i < copyButtons.length; i++) {
        copyButtons[i].addEventListener('click', () => {
            copyToClipboard(customLinks[i].innerHTML);
            copyButtons[i].classList = "btn btn-success btn-sm mt-2";
            copyButtons[i].innerHTML = "Copied";
            copyButtons.forEach(button => {
                if (button.id !== copyButtons[i].id) {
                    button.classList = "btn btn-outline-primary btn-sm mt-2";
                    button.innerHTML = "Copy";
                }
            });
        });
    }

    if (window.innerWidth <= 991) {
        filterForm.classList = "";
    } else {
        filterForm.classList = "d-flex";
    }

    window.addEventListener('resize', (event) => {
        console.log(event.target.innerWidth);
        if (event.target.innerWidth <= 991) {
            filterForm.classList = "";
        } else {
            filterForm.classList = "d-flex";
        }
    });
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log("SUCCESS");
    }, function() {
        console.log("FAIL");
    });
}