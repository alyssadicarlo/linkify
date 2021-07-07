'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const target_url = document.querySelector('input');

    const copyButton = document.querySelector('#copyButton');

    copyButton.addEventListener('click', () => {
        target_url.select();
        document.execCommand("copy");
        copyButton.classList = "btn btn-outline-success";
        copyButton.innerHTML = "Copied";
    });
});