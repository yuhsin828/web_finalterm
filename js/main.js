const URL = 'https://script.google.com/macros/s/AKfycbxaRRRfm7e974jqQWvZUriRtS6z4nHTNSve6VvcgEUZGbrPJ7UafWBraWMR8d7YJGE/exec';

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
            for (let i = 0; i < charge.length; i++) {
                let content = oneRow(charge[i]);
                $('#LIST').append(content);
                console.log(charge[i])
            }
            $('.loading').css('display', 'none');
        } else {
            $('.loading').css('display', 'none');
        }
    }).fail(function (data) {

    });
}


function oneRow(data) {
    let html = `
    <div class="row p-2 mb-3 mx-3 rounded bg-field">
        <div class="col-3 text-center">${data.date.substring(0, 10)}</div>
        <div class="col-2 text-center">${data.come}</div>
        <div class="col-2 text-center">${data.type}</div>
        <div class="col-2 text-center">${data.price}</div>
        <div class="col-3 text-center">${data.memo}</div>
    </div>
    `
    return html;
}