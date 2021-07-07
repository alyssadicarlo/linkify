'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copyButton');
    const customLinks = document.querySelectorAll('.customLink');

    for (let i = 0; i < copyButtons.length; i++) {
        copyButtons[i].addEventListener('click', () => {
            console.log(customLinks[i].innerHTML);
            copyToClipboard(customLinks[i].innerHTML);
            copyButtons[i].classList = "btn btn-success";
            copyButtons[i].innerHTML = "Copied";
            copyButtons.forEach(button => {
                if (button.id !== copyButtons[i].id) {
                    button.classList = "btn btn-outline-primary";
                button.innerHTML = "Copy";
                }
            });
        });
    }
});

function copyToClipboard(text) {
    console.log("COPIED", text);
}