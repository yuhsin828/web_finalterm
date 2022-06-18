const URL = 'https://script.google.com/macros/s/AKfycbxjX2Ar4Empiz7NQxXiXtCpCp9B34CUA2H-YS3wtwZO_gL1LBMDeYsfh5FRGArhN-hI/exec';

$(document).ready(function () {
    init();
});

function init() {
    $('.hide').hide();
    $("input[name='in-out']").click(function (e) {
        let mType = $(this).attr('mType');
        getTypes(mType); // 取得支出或收入的分類
        $('.hide').show();
    });
    calendar();

    // 判斷是否填寫
    let event_ary = ['input[type=text]'];
    for (let i = 0; i < event_ary.length; i++) {
        $(event_ary[i]).focusout(function (e) {
            if ($(this).val() == '') {
                let template = $('#tips').html();
                if ($(this).closest('.tip-group').find('.tip').length == 0) {
                    $(this).closest('.tip-group').append(template);
                    $(this).closest('.tip-group').addClass('bdr');
                    // console.log('tip');
                }
            }
        });
        $(event_ary[i]).keyup(function (e) {
            if ($(this).val() != '') {
                $(this).closest('.tip-group').find('.tip').remove();
                $(this).closest('.tip-group').removeClass('bdr');
            }
        });
    }

    $('.btn-done').click(function (e) {
        postData();
    });
}

function calendar() {
    $('.form_date').datetimepicker({
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
        case '1':
            params.method = 'read2';
            break;
        case '2':
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



// //如果沒填好，出現錯誤提示；填好的話，上傳資料
// $('#modal1').on('hidden.bs.modal', function (e) {
//     if (errorAry.length > 0) {
//         showAlert(errorAry.shift().msg);
//     } else {
//         $(this).unbind('hidden.bs.modal');
//         $('#sysModal').unbind('hidden.bs.modal');
//         $('#modal1 .btn-option').unbind('click')
//         postData();
//     }
// });

// function showAlert(content) {
//     $('#sysModal .modal-body').html(content);
//     $('#sysModal .btn-option').click(function (event) {
//         $(this).unbind('click');
//         sysModal.hide();
//     });
//     sysModal.show();
// }









function postData() {
    let params = {};
    params.method = 'write1';
    params.price = $('input[name="price"]').val();
    params.memo = $('input[name="memo"]').val();
    params.date = $('input[name="date"]').val();
    //radio
    paramstype = $('input[name=come-type]:checked').val();

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