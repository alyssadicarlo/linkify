'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const target_url = document.querySelector('input');

    const copyButton = document.querySelector('#copyButton');

    copyButton.addEventListener('click', () => {
        const copyText = target_url.value;
        copyToClipboard(copyText);
        copyButton.classList = "btn btn-success";
        copyButton.innerHTML = "Copied";
    });


    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log("SUCCESS");
    }, function() {
            console.log("FAIL");
    });
}
});