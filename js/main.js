const URL = 'https://script.google.com/macros/s/AKfycbxzPDLF5IphC-EZ-jcyvtdrwOFMdESEGaO5Jt1dWji4YmayciU-rLyB150A81bqgnB4/exec';

let modal1, sysModal, errorAry;

$(document).ready(function () {
    init();
});


function init() {
    modal1 = new bootstrap.Modal('#modal1');
    sysModal = new bootstrap.Modal('#sysModal');
    $('.btn-launch').click(function (e) {
        let mType = ($(this).attr('mType')) ? $(this).attr('mType') : 0;
        let mTitle = ($(this).attr('mTitle')) ? $(this).attr('mTitle') : 'none';
        if ($(this).attr('static') == '') {
            modal1 = new bootstrap.Modal('#modal1', { backdrop: 'static' });
        } else {
            modal1 = new bootstrap.Modal('#modal1');
        }
        getTypes(mType); //取得支出或收入的分類
        launchModal1(mType, mTitle); //出現填寫資料的modal
    });
}


function launchModal1(mType, mTitle) {
    $('#modal1 .btn-close').hide();

    //按完成，判斷是否填寫完整
    $('#modal1 .btn-option').click(function (event) {
        errorAry = [];
        let tmpObj;
        if ($('#modal1 input[name="come-type"]').val() == '') {
            tmpObj = {};
            tmpObj.msg = '請選擇分類';
            errorAry.push(tmpObj);
        }
        if ($('#modal1 input[name="price"]').val() == '') {
            tmpObj = {};
            tmpObj.msg = '請填寫金額';
            errorAry.push(tmpObj);
        }
        if ($('#modal1 input[name="date"]').val() == '') {
            tmpObj = {};
            tmpObj.msg = '請選擇日期';
            errorAry.push(tmpObj);
        }

        modal1.hide();
    });

    //按取消，清除輸入
    $('#modal1 .btn-close2').click(function (event) {
        $('#modal1 input[name="come-type:checked"]').val() == 0;
        $('#modal1 input[name="price"]').val() == '';
        $('#modal1 input[name="memo"]').val() == '';
        $('#modal1 input[name="date"]').val() == '';
    });

    //如果沒填好，出現錯誤提示；填好的話，上傳資料
    $('#modal1').on('hidden.bs.modal', function (e) {
        if (errorAry.length > 0) {
            showAlert(errorAry.shift().msg);
        } else {
            $(this).unbind('hidden.bs.modal');
            $('#sysModal').unbind('hidden.bs.modal');
            $('#modal1 .btn-option').unbind('click')
            postData();
        }
    });

    $('#sysModal').on('hidden.bs.modal', function (e) {
        modal1.show();
    });

    $('#modal1 .modal-header .text').html(mTitle);

    modal1.show();

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

    });
}

function showTypes(n, type) {
    let html = `
        <input type="radio" class="btn-check form-check-input" name="come-type" id="come-type${n}" autocomplete="off" value="${type}">
        <label class="btn btn-secondary input-group-text" for="come-type${n}">${type}</label>
    `;

    return html;
}


function showAlert(content) {
    $('#sysModal .modal-body').html(content);
    $('#sysModal .btn-option').click(function (event) {
        $(this).unbind('click');
        sysModal.hide();
    });
    sysModal.show();
}









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