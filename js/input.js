const URL = 'https://script.google.com/macros/s/AKfycby8gDQsbnVrWubldwQRxXZp6gDaL76p6lISaOG_ii2NHYcjY6-rxUJpK40YsxLo8Un7/exec';

let cSwitch = '支出';
let lastSwitch = 0;
// const rule_num = /\d/; // 判斷是否是數字

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
            $('input[name="price"]').val('');
            $('.tip-group').find('.tip').remove();
            $('.tip-group .form-control').removeClass('bdr');
            $('#TYPE').html('');
            // 取得支出或收入的分類
            getTypes(cSwitch);
        } else {
            alert('error: ' + data.msg);
        }
    });

    // 按下完成，檢查是否有填寫，上傳資料，清空欄位
    $('.btn-done').click(function (e) {
        doneCheck();
    });
}


// -----------------------   取得支出或收入的分類     ----------------------
function getTypes(cSwitch) {
    lastSwitch = cSwitch;
    $('.loading').css('display', 'grid');
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

// $('input[name=price]').focusout(function (e) {
//     if ($(this).val() != '') {
//         ruleNumTip($(this));
//     }
// });


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

// function ruleNumTip(dom) {
//     console.log(rule_num.test(dom.val()));
//     dom.closest('.tip-group').find('.tip').remove();
//     dom.closest('.tip-group .form-control').removeClass('bdr');
//     let t2 = $('#ruleNum').html();
//     if (rule_num.test(dom.val()) == false) {
//         dom.closest('.tip-group').append(t2);
//         dom.closest('.tip-group .form-control').addClass('bdr');
//     }
// }


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
    // if (rule_num.test($('input[name=price]').val()) == false) {
    //     ruleNumTip($('input[name=price]'));
    //     return false;
    // }
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

    $('.loading').css('display', 'grid');
    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            $('.loading').css('display', 'none');
            alert('新增成功');
        } else {
            $('.loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log("fail");
        console.log(data);
    });

    // 清空欄位
    $('input[type=text]').val('');
    $('input[name=date]').val('');
    $('input[name=price]').val('');
    // $('input[type=radio]:checked').val() == undefined;
}
