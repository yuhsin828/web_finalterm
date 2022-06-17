//用自己的網址不行，用老師的可以
const URL = 'https://script.google.com/macros/s/AKfycbxN7cc7fJAYCOjlZ5vy1dasDEK-FT2i5o7iAas8Vj6qE_mF991peQRycGYP9tA0oEtb6A/exec';
//老師的網址 https://script.google.com/macros/s/AKfycbyX4iJNJQ9lw4nPVDtgmNUXOUza28KLoBymK-XsvdNjKPVJIB_hraBn1Azpjkht9MmOxg/exec

$(document).ready(function () {
    loadData();
});

function loadData() {
    let params = {};
    params.method = 'read1';

    $.post(URL, params, function (data) {
        if (data.result == 'sus') {
            let userData = data.data;
            for (let i = 0; i < userData.length; i++) {
                let content = oneRow(i + 1, userData[i]);
                $('tbody').append(content);
            }
        } else {

        }
    }).fail(function (data) {

    });
}


function oneRow(n, man) {
    let html = `
		<tr>
			<th scope="row">${n}</th>
			<td>${man.schoolType}</td>
			<td>${man.schollName}</td>
			<td>${man.userName}</td>
			<td>${man.userTitle}</td>
			<td>${man.userEmail}</td>
			<td>${man.userTel}</td>
		</tr>`;
    return html;
}