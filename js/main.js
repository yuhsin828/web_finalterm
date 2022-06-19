const URL = 'https://script.google.com/macros/s/AKfycby8gDQsbnVrWubldwQRxXZp6gDaL76p6lISaOG_ii2NHYcjY6-rxUJpK40YsxLo8Un7/exec';
let pageID = [];

$(document).ready(function () {
    loadData();
});

// -----------------------   出現記帳清單     ----------------------
function loadData() {
    $('.loading').css('display', 'grid');
    let params = {};
    params.method = 'read1';

    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            let charge = data.data;
            for (let i = 1; i < charge.length; i++) {
                let content = oneRow(charge[i]);
                pageID.push(charge[i].id);
                $('#LIST').append(content);
            }
            $('.loading').css('display', 'none');
        } else {
            $('.loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log("fail");
        console.log(data);
    });
}

function oneRow(data) {
    let html = `
    <a href="./modify.html?${data.id}" class="row p-2 mb-3 mx-3 rounded bg-field text-decoration-none text-black">
        <div class="col-3 text-center">${data.date.substring(0, 10)}</div>
        <div class="col-2 text-center">${data.come}</div>
        <div class="col-2 text-center">${data.type}</div>
        <div class="col-2 text-center">${data.price}</div>
        <div class="col-3 text-center">${data.memo}</div>
    </a>
    `
    return html;
}