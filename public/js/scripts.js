'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const target_url = document.querySelector('input');
    target_url.select();

    const copyButton = document.querySelector('#copyButton');

    copyButton.addEventListener('click', () => {
        document.execCommand("copy");
        alert('copied!');
    });
});