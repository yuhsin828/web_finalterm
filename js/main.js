const URL = 'https://script.google.com/macros/s/AKfycbxaRRRfm7e974jqQWvZUriRtS6z4nHTNSve6VvcgEUZGbrPJ7UafWBraWMR8d7YJGE/exec';

let cSwitch = '支出';
let lastSwitch = 0;

$(document).ready(function () {
    init();
});

function init() {
    getTypes(cSwitch);
    $('#outcome').addClass('bg-form');

    $("input[name='in-out']").click(function (e) {
        $(this).addClass('bg-form'); // 切換鈕出現背景
        cSwitch = $(this).attr('cSwitch');
        if (cSwitch != lastSwitch) {
            // 清空
            $('input[type="text"]').val('');
            $('input[name="date"]').val('');
            $('.tip-group').find('.tip').remove();
            $('.tip-group .form-control').removeClass('bdr');
            $('#TYPE').html('');
            // 取得支出或收入的分類
            getTypes(cSwitch);
        } else {

        }
    });

    // 出現記帳清單
    loadData();

    // 按下完成，檢查是否有填寫，上傳資料，清空欄位
    $('.btn-done').click(function (e) {
        doneCheck();
    });
}

function getTypes(cSwitch) {
    lastSwitch = cSwitch;
    $('.switch-loading').css('display', 'grid');
    let params = {};
    switch (cSwitch) {
        case '支出':
            $('#income').removeClass('bg-form');
            params.method = 'read2';
            break;
        case '收入':
            $('#outcome').removeClass('bg-form');
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
            $('.switch-loading').css('display', 'none');
        } else {
            $('.switch-loading').css('display', 'none');
            alert('error');
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



// 離開文字輸入欄位時，判斷是否有填寫
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
$('input[name=price]').blur(function (e) {
    const rule_num = /[0-9]/; // 判斷是否是數字
    let t2 = $('#ruleNum').html();
    if ($(this).val() != '') {
        if (rule_num.test($(this).val())) {
            $(this).closest('.tip-group').find('.tip').remove();
            $(this).closest('.tip-group .form-control').removeClass('bdr');
        } else {
            $(this).closest('.tip-group').append(t2);
            $(this).closest('.tip-group .form-control').addClass('bdr');
        }
    }
})

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



// 按下完成，檢查
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
    postData();
}

// 上傳資料
function postData() {
    let params = {};
    params.method = 'write1';
    params.come = cSwitch;
    params.price = $('input[name=price]').val();
    params.memo = $('input[name=memo]').val();
    params.date = $('input[name=date]').val();
    //radio
    params.type = $('input[name=come-type]:checked').val();

    console.log(params);

    $('.submit-loading').css('display', 'grid');
    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            $('.submit-loading').css('display', 'none');
            alert('新增成功');
        } else {
            $('.submit-loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        alert(data)
    });

    // 清空欄位
    $('input[type=text]').val('');
    $('input[name=date]').val('');
    // $('input[type=radio]:checked').val() == undefined;

}


// -----------------------   出現記帳清單     ----------------------
function loadData() {
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
        } else {

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