const URL = 'https://script.google.com/macros/s/AKfycbxN7cc7fJAYCOjlZ5vy1dasDEK-FT2i5o7iAas8Vj6qE_mF991peQRycGYP9tA0oEtb6A/exec';

$(document).ready(function () {
    init();
});

function init() {
    $('.btn-send').click(function (e) {
        postData();
    });
}

function postData() {
    let params = {};
    params.method = 'write1';
    params.userName = $('input[name=userName]').val();
    params.schoolName = $('input[name=schoolName]').val();
    params.userTitle = $('input[name=userTitle]').val();
    params.userTel = $('input[name=userTel]').val();
    params.userEmail = $('input[name=userEmail]').val();
    //radio
    params.schoolType = $('input[name=schoolType]:checked').val();
    //select
    params.userID = $('select[name=userID]').val();
    //checkbox
    let ary = [];
    $('input[name=userNeed1]:checked').each(function (index, el, arys) {
        // console.log($(this).val());
        if ($(this).val() == '其他') {
            ary.push($(this).val() + ': ' + $('input[name=userNeed1-5-text]').val());
        } else {
            ary.push($(this).val());
        }
    })
    params.userNeed1 = JSON.stringify(ary);

    //checkbox
    let ary2 = $('input[name=userNeed2]:checked').map(function (index, el) {
        // console.log($(this).val());
        return $(this).val();
    }).get();
    params.userNeed2 = JSON.stringify(ary2);

    //textarea
    params.userNeed3 = $('textarea[name=userNeed3]').val();
    params.userNeed4 = $('textarea[name=userNeed4]').val();

    // console.log(params);
    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            alert('sus')
        } else {
            alert(data)
        }
    }).fail(function (data) {
        alert(data)
    });
}