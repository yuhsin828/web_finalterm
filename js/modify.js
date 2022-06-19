const URL = 'https://script.google.com/macros/s/AKfycbw7NTwwYYhRJ_aFx7tv-YpHg8t5-8q9kLHH7-0TslYfpTUEBQxckhDE4Nf3aPprP9o/exec';

let pageID = document.location.toString().split('?')[1];
let cSwitch;

$(document).ready(function () {
    getData();
    // 按下完成，檢查是否有填寫，上傳資料，清空欄位
    $('.btn-done').click(function (e) {
        doneCheck();
    });
});


// -----------------------   點進一條帳，出現資料     ----------------------
function getData() {
    $('.loading').css('display', 'grid');
    let params = {};
    params.method = 'readA';
    params.id = pageID;

    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            let charge = data.data[0];
            initPage(charge);
        } else {
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log("fail");
        console.log(data);
    });
}

function initPage(charge) {
    cSwitch = charge.come;
    if (cSwitch == '收入') {
        $('.cSwitch').text('編輯收入');
    } else {
        $('.cSwitch').text('編輯支出');
    }
    getTypes(cSwitch);
    $('input[name=price]').val(charge.price);
    $('input[name=memo]').val(charge.memo);
    $('input[name=date]').val(charge.date.substring(0, 10));
    $('input[name=come-type]:checked').val(charge.type);
    // console.log(charge.type)
}

// -----------------------   取得支出或收入的分類     ----------------------
function getTypes(cSwitch) {
    let params = {};
    switch (cSwitch) {
        case '支出':
            params.method = 'read2';
            break;
        case '收入':
            params.method = 'read3';
            break;
    }
    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            let types = data.data;
            for (let i = 0; i < types.length; i++) {
                let content = showTypes(i + 1, types[i]);
                $('#TYPE').append(content);
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

function showTypes(n, type) {
    let html = `
    <div class="p-2">    
        <input type="radio" class="btn-check form-check-input" name="come-type" id="come-type${n}" autocomplete="off" value="${type}">
        <label class="btn btn-secondary input-group-text" for="come-type${n}">${type}</label>
    </div>
    `;
    return html;
}

// -----------------------   離開文字輸入欄位時，判斷是否有填寫     ----------------------
let event_ary = ['input[name=price]', 'input[name=date]'];
for (let i = 0; i < event_ary.length; i++) {
    $(event_ary[i]).focusout(function (e) {
        if ($(this).val() == '') {
            setTip($(this));
        }
    });
    $(event_ary[i]).keyup(function (e) {
        if ($(this).val() != '') {
            removeTip($(this));
        }
    });
}

$('input[type=radio]').change(function (e) {
    removeTip($(this)); // 沒作用！？
});
$('input[name=date]').change(function (e) {
    removeTip($(this));
});

function setTip(dom) {
    let t1 = $('#tips').html();
    if (dom.closest('.tip-group').find('.tip').length == 0) {
        dom.closest('.tip-group').append(t1);
        dom.closest('.tip-group .form-control').addClass('bdr');
    }
}
function removeTip(dom) {
    dom.closest('.tip-group').find('.tip').remove();
    dom.closest('.tip-group .form-control').removeClass('bdr');
}


// -----------------------   按下完成，檢查     ----------------------
function doneCheck() {
    if ($('input[type=radio]:checked').val() == undefined) {
        setTip($('input[type=radio]'));
        return false;
    }
    if ($('input[name=price]').val() == '') {
        setTip($('input[name=price]'));
        return false;
    }
    // if ($('input[name="memo"]').val() == '') {
    //     setTip($('input[name="memo"]'));
    //     return false;
    // } // memo非必填
    if ($('input[name=date]').val() == '') {
        setTip($('input[name=date]'));
        return false;
    }
    modifyData();
}

// 上傳更新的資料
function modifyData() {
    $('.loading').css('display', 'grid');
    let params = {};
    params.method = 'modify1';
    params.id = pageID;
    params.come = cSwitch;
    params.price = $('input[name=price]').val();
    params.memo = $('input[name=memo]').val();
    params.date = $('input[name=date]').val();
    //radio
    params.type = $('input[name=come-type]:checked').val();

    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            $('.loading').css('display', 'none');
            alert('更新成功');
        } else {
            $('.loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log("fail");
        console.log(data);
    });
}
