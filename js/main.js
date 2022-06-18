const URL = 'https://script.google.com/macros/s/AKfycbzlL-jANGgvx_3ka1gdQ4miWDHDlVa883ZhMyMqL-H1rDCqGycuYsG6dznJEjSK5JXA/exec';

let mType;

$(document).ready(function () {
    init();
});

function init() {
    $('.hide').hide(); // 一開始隱藏填寫欄位
    $("input[name='in-out']").click(function (e) {
        // 清空
        $('input[type="text"]').val('');
        $('#TYPE').html('');
        // 取得支出或收入的分類
        mType = $(this).attr('mType');
        getTypes(mType);

        $('.hide').show(); // 出現填寫欄位
    });

    calendar(); // 產生日期選擇

    // 按完成，上傳資料，並清空
    $('.btn-done').click(function (e) {
        doneCheck();
    });
}

function calendar() {
    $('#datetimepicker').datetimepicker({
        language: 'zh-TW',
        format: 'yyyy-mm-dd', // 日期格式
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

function getTypes(mType) {
    let params = {};
    switch (mType) {
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
        } else {

        }
    }).fail(function (data) {
        console.log("fail");
        console.log(data);
    });
}

function showTypes(n, type) {
    let html = `
        <input type="radio" class="btn-check form-check-input" name="come-type" id="come-type${n}" autocomplete="off" value="${type}">
        <label class="btn btn-secondary input-group-text" for="come-type${n}">${type}</label>
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
});
$('input[name=date]').change(function (e) {
    removeTip($(this));
});



function setTip(dom) {
    let template = $('#tips').html();
    if (dom.closest('.tip-group').find('.tip').length == 0) {
        dom.closest('.tip-group').append(template);
        dom.closest('.tip-group').addClass('bdr');
    }
}
function removeTip(dom) {
    dom.closest('.tip-group').find('.tip').remove();
    dom.closest('.tip-group').removeClass('bdr');
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
    params.come = mType;
    params.price = $('input[name="price"]').val();
    params.memo = $('input[name="memo"]').val();
    params.date = $('input[name="date"]').val();
    //radio
    params.type = $('input[name=come-type]:checked').val();

    console.log(params);
    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            alert('新增成功')
        } else {
            alert(data)
        }
    }).fail(function (data) {
        alert(data)
    });
    $('input[type="text"]').val('');
    $('input[name="date"]').val('');
    $('#TYPE').html('');
}