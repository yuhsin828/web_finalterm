const URL = 'https://script.google.com/macros/s/AKfycbykuaNyYYPNr4046LR4d0kkiCnu45k23YVGVjCk27wL_fimBh3GvkwVuiJCG4Hx6Z66/exec';

let cSwitch;
let lastSwitch = 0;

$(document).ready(function () {
    init();
});

function init() {
    $('.hide').hide(); // 一開始隱藏填寫欄位

    $("input[name='in-out']").click(function (e) {
        $(this).addClass('bg-form'); // 切換鈕出現背景
        $('.hide').show(); // 出現填寫欄位

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
        calendar(); // 產生日期選擇器
    });

    // 按完成，上傳資料，並清空
    $('.btn-done').click(function (e) {
        doneCheck();
    });
}

function calendar() {
    $('#datetimepicker').datetimepicker({
        language: 'zh-TW',
        format: 'yyyy-mm-dd',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        keyboardNavigation: 1,
        forceParse: 1
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
let event_ary = ['input[type=text]', 'input[name=date]'];
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
    removeTip($(this));
}); // 沒作用
$('input[name=date]').change(function (e) {
    removeTip($(this));
});


function setTip(dom) {
    let template = $('#tips').html();
    if (dom.closest('.tip-group').find('.tip').length == 0) {
        dom.closest('.tip-group').append(template);
        dom.closest('.tip-group .form-control').addClass('bdr');
    }
}
function removeTip(dom) {
    dom.closest('.tip-group').find('.tip').remove();
    dom.closest('.tip-group .form-control').removeClass('bdr');
}



function doneCheck() {
    if ($('input[type=radio]:checked').val() == undefined) {
        setTip($('input[type=radio]'));
        return false;
    }
    if ($('input[name="price"]').val() == '') {
        setTip($('input[name="price"]'));
        return false;
    }
    // if ($('input[name="memo"]').val() == '') {
    //     setTip($('input[name="memo"]'));
    //     return false;
    // } // memo非必填
    if ($('input[name="date"]').val() == '') {
        setTip($('input[name="date"]'));
        return false;
    }
    postData();
}

function postData() {
    let params = {};
    params.method = 'write1';
    params.come = cSwitch;
    params.price = $('input[name="price"]').val();
    params.memo = $('input[name="memo"]').val();
    params.date = $('input[name="date"]').val();
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
    $('input[type="text"]').val('');
    $('input[name="date"]').val('');
    // $('input[type=radio]:checked').val() == undefined;
}