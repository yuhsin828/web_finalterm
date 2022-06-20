const URL = 'https://script.google.com/macros/s/AKfycbwNcJeNVjvsrZNQH8JLvUqFd29AEsoB4lfMQTVhpXyITvR4Jwlq94NDQbGwHlS_z3eh/exec';

let pageID = document.location.toString().split('?')[1];
let cSwitch;

$(document).ready(function () {
    getData();

    // 按下刪除，確認是否要刪除
    $('.btn-del').click(function (e) {
        deleteConfirm();
    });

    // 按下完成，檢查是否有填寫，上傳資料
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
        console.log('fail');
        console.log(data);
    });
}

function initPage(charge) {
    cSwitch = charge.come;
    getCateg(cSwitch, charge.categ);
    if (cSwitch == '收入') {
        $('.cSwitch').text('編輯收入記錄');
    } else {
        $('.cSwitch').text('編輯支出記錄');
    }

    $('input[name=price]').val(charge.price);
    $('input[name=memo]').val(charge.memo);
    $('input[name=date]').val(moment(charge.date).format('YYYY-MM-DD'));
    // $('input[name=come-categ]:checked').val(charge.categ);
    // console.log(charge.categ)
}


// -----------------------   取得支出或收入的類別     ----------------------
function getCateg(cSwitch, checkedCateg) {
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
            let categ = data.data;
            for (let i = 0; i < categ.length; i++) {
                let content = showCateg(i + 1, categ[i]);
                $('#CATEG').append(content);
                if (categ[i].text == checkedCateg) {

                }
            }
            $('.loading').css('display', 'none');
        } else {
            $('.loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log('fail');
        console.log(data);
    });
}

function showCateg(n, categ) {
    let html = `
    <div class="p-2">    
        <input type="radio" class="btn-check form-check-input" name="come-categ" id="come-categ${n}" autocomplete="off" value="${categ}">
        <label class="btn btn-secondary input-group-text" for="come-categ${n}">${categ}</label>
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
$('input[name=price]').change(function (e) {
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
    // if ($('input[name=memo]').val() == '') {
    //     setTip($('input[name=memo]'));
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
    params.method = 'modifyA';
    params.id = pageID;
    params.come = cSwitch;
    params.price = $('input[name=price]').val();
    params.memo = $('input[name=memo]').val();
    params.date = $('input[name=date]').val();
    params.categ = $('input[name=come-categ]:checked').val(); // radio

    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            $('.loading').css('display', 'none');
            alert('更新成功');
        } else {
            $('.loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log('fail');
        console.log(data);
    });
}


// -----------------------   按下刪除，確認     ----------------------
function deleteConfirm() {
    if (confirm('確定要刪除這筆記錄？')) {
        deleteData();
    } else {
        alert('未刪除');
    }

}

// 刪除資料
function deleteData() {
    $('.loading').css('display', 'grid');
    let params = {};
    params.method = 'deleteA';
    params.id = pageID;

    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            $('.loading').css('display', 'none');
            alert('刪除成功');
            history.back();
        } else {
            $('.loading').css('display', 'none');
            alert('error: ' + data.msg);
        }
    }).fail(function (data) {
        console.log('fail');
        console.log(data);
    });
}