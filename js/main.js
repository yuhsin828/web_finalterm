const URL = 'https://script.google.com/macros/s/AKfycbyPcr2z2uKXWg_fLYuFoScOOJaECpgPOpff1Q_IsTrgtvlcIl8EDsBjdnS7B_2Hx2u0/exec';
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

function oneRow(charge) {
    let html = `
    <a href="./modify.html?${charge.id}" class="row p-2 mb-3 mx-3 rounded bg-field text-decoration-none text-black">
        <div class="col-3 text-center">${moment(charge.date).format('YYYY.MM.DD')}</div>
        <div class="col-2 text-center">${charge.come}</div>
        <div class="col-2 text-center">${charge.categ}</div>
        <div class="col-2 text-center">${charge.price}</div>
        <div class="col-3 text-center">${charge.memo}</div>
    </a>
    `
    
    return html;
}