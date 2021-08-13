let data = {};
let page_max = 0;
let page_now = 1;
let now_page_min = 0;
let now_page_max = 0;
let count = 0;
let per_page = 20;

window.onload = function() {
    fetch("../json/2021_syllabus.json")
        .then(
            function(u) {
                return u.json();
            }
        )
        .then(
            function(e) {
                data = e;
            }
        )
    var page_num = 0;
    var table = '<thead class="table-dark"><tr><th>時間割番号</th><th>科目名</th><th>学期</th><th>曜日・時限</th><th>単位数</th><th>教員名</th></tr></thead>';
    for (var i = 0; i < data["subject"].length; i++) {
        var period;
        var teacher;
        for (var j = 0; j < data["subject"][i]["period"].length; j++) {
            if (j == 0) {
                period = data["subject"][i]["period"][j]
            } else {
                period += "，" + data["subject"][i]["period"][j]
            }
        }
        for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
            if (k == 0) {
                teacher = data["subject"][i]["teacher"][k]
            } else {
                teacher += "<br>" + data["subject"][i]["teacher"][k]
            }
        }
        if (i % per_page == 0) {
            page_num += 1
        }
        if (page_num == 1) {
            table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
        } else {
            table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
        }
        count += 1;
    }
    page_max = page_num;
    document.getElementById('result').innerHTML = '検索結果：' + count + '件';
    document.getElementById('data_content').innerHTML = '<table id="syllabus_data" class="table-hover table-striped table text-nowrap" style="table-layout:auto;width:auto">' + table + '</table>';
    if ((page_now) * per_page > count) {
        now_page_max = count
    } else {
        now_page_max = (page_now) * per_page
    }
    var page_text = '全' + count + '件中' + (((page_now - 1) * per_page) + 1) + '～' + now_page_max + '件目を表示中';
    var page_nav = '<ul class="pagination justify-content-center"><li class="page-item disabled"><a class="page-link" href="javascript:page(' + String(page_now - 1) + ');">«</a></li>';
    for (var k = 1; k <= page_max; k++) {
        if (k == page_now) {
            page_nav += '<li class="page-item active"><a class="page-link" href="javascript:page(' + String(k) + ');">' + String(k) + '</a></li>'
        } else {
            page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(k) + ');">' + String(k) + '</a></li>'
        }
    }
    page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now + 1) + ');">»</a></li></ul>';
    document.getElementById('page_text').innerHTML = page_text;
    document.getElementById('page_nav').innerHTML = page_nav;
    $("#page_nav").rPage();
}

function page(page_next) {
    page_now = page_next;
    if ((page_now) * per_page > count) {
        now_page_max = count
    } else {
        now_page_max = (page_now) * per_page
    }
    var page_text = '全' + count + '件中' + (((page_now - 1) * per_page) + 1) + '～' + now_page_max + '件目を表示中';

    if (page_now == 1) {
        var page_nav = '<ul class="pagination justify-content-center"><li class="page-item disabled"><a class="page-link" href="">«</a></li>';
    } else {
        var page_nav = '<ul class="pagination justify-content-center"><li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now - 1) + ')">«</a></li>'
    }
    for (var k = 1; k <= page_max; k++) {
        if (k == page_now) {
            page_nav += '<li class="page-item active"><a class="page-link" href="javascript:page(' + String(k) + ')">' + String(k) + '</a></li>'
        } else {
            page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(k) + ')">' + String(k) + '</a></li>'
        }
    }
    if (page_now == page_max) {
        page_nav += '<li class="page-item disabled"><a class="page-link" href="">»</a></li></ul>';
    } else {
        page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now + 1) + ')">»</a></li></ul>';
    }
    document.getElementById('page_text').innerHTML = page_text;
    document.getElementById('page_nav').innerHTML = page_nav;
    $("#page_nav").rPage();

    var table = document.getElementById('syllabus_data');
    var row = table.rows;
    for (var i = 1; i <= row.length - 1; i++) {
        if (row[i].dataset.pagenum == String(page_now)) {
            row[i].style.display = "";
        } else {
            row[i].style.display = "none";
        }
    }
}

function change() {
    var page_num = 0;
    page_now = 1;
    const tt_num = "G" + document.getElementById('tt_num').value;
    const name = document.getElementById('name').value;
    const teacher_search = document.getElementById('teacher').value;
    let semester_elements = document.getElementsByName('semester');
    let len = semester_elements.length;
    let semester = '';
    for (let l = 0; l < len; l++) {
        if (semester_elements.item(l).checked) {
            semester = semester_elements.item(l).value;
        }
    }
    if (semester == "すべて") {
        semester = ""
    }
    const period_arr = [];
    const period_element = document.getElementsByName('period');

    for (let i = 0; i < period_element.length; i++) {
        if (period_element[i].checked && period_element[i].value != '集中') {
            period_element[i].parentElement.style.backgroundColor = '#27cc7f';
            period_arr.push(period_element[i].value);
        }
        if (period_element[i].checked && period_element[i].value == '集中') {
            period_arr.push(period_element[i].value);
        } else if (period_element[i].checked == false && period_element[i].value != '集中') {
            period_element[i].parentElement.style.backgroundColor = 'transparent';
        }
    }

    count = 0;
    var table = '<thead class="table-dark"><tr><th>時間割番号</th><th>科目名</th><th>学期</th><th>曜日・時限</th><th>単位数</th><th>教員名</th></tr></thead>';
    for (var i = 0; i < data["subject"].length; i++) {
        if (data["subject"][i]["tt_num"].indexOf(tt_num) != -1) {
            if (data["subject"][i]["name"].indexOf(name) != -1) {
                if (data["subject"][i]["semester"].indexOf(semester) != -1) {
                    if (period_arr.length == 0) {
                        if (teacher_search == "") {
                            var period;
                            var teacher;
                            for (var j = 0; j < data["subject"][i]["period"].length; j++) {
                                if (j == 0) {
                                    period = data["subject"][i]["period"][j]
                                } else {
                                    period += "，" + data["subject"][i]["period"][j]
                                }
                            }
                            for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
                                if (k == 0) {
                                    teacher = data["subject"][i]["teacher"][k]
                                } else {
                                    teacher += "<br>" + data["subject"][i]["teacher"][k]
                                }
                            }
                            if (count % per_page == 0) {
                                page_num += 1
                            }
                            if (page_num == 1) {
                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                            } else {
                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                            }
                            count += 1;
                        } else {
                            for (var p = 0; p < data["subject"][i]["teacher"].length; p++) {
                                if (data["subject"][i]["teacher"][p].indexOf(teacher_search) != -1) {
                                    for (var j = 0; j < data["subject"][i]["period"].length; j++) {
                                        if (j == 0) {
                                            period = data["subject"][i]["period"][j]
                                        } else {
                                            period += "，" + data["subject"][i]["period"][j]
                                        }
                                    }
                                    for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
                                        if (k == 0) {
                                            teacher = data["subject"][i]["teacher"][k]
                                        } else {
                                            teacher += "<br>" + data["subject"][i]["teacher"][k]
                                        }
                                    }
                                    if (count % per_page == 0) {
                                        page_num += 1
                                    }
                                    if (page_num == 1) {
                                        table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                    } else {
                                        table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                    }
                                    count += 1;
                                    break
                                }
                            }
                        }

                    } else {
                        period_loop: for (var m = 0; m < period_arr.length; m++) {
                            for (var n = 0; n < data["subject"][i]["period"].length; n++) {
                                if (period_arr[m] == data["subject"][i]["period"][n]) {
                                    var period;
                                    var teacher;
                                    for (var p = 0; p < data["subject"][i]["teacher"].length; p++) {
                                        if (data["subject"][i]["teacher"][p].indexOf(teacher_search) != -1) {
                                            for (var j = 0; j < data["subject"][i]["period"].length; j++) {
                                                if (j == 0) {
                                                    period = data["subject"][i]["period"][j]
                                                } else {
                                                    period += "，" + data["subject"][i]["period"][j]
                                                }
                                            }
                                            for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
                                                if (k == 0) {
                                                    teacher = data["subject"][i]["teacher"][k]
                                                } else {
                                                    teacher += "<br>" + data["subject"][i]["teacher"][k]
                                                }
                                            }
                                            if (count % per_page == 0) {
                                                page_num += 1
                                            }
                                            if (page_num == 1) {
                                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                            } else {
                                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                            }
                                            count += 1;
                                            break period_loop
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    page_max = page_num;
    if ((page_now) * per_page > count) {
        now_page_max = count
    } else {
        now_page_max = (page_now) * per_page
    }
    var page_text = '全' + count + '件中' + (((page_now - 1) * per_page) + 1) + '～' + now_page_max + '件目を表示中';
    if (page_now == 1) {
        var page_nav = '<ul class="pagination justify-content-center"><li class="page-item disabled"><a class="page-link" href="">«</a></li>';
    } else {
        var page_nav = '<ul class="pagination justify-content-center"><li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now - 1) + ')">«</a></li>'
    }
    for (var k = 1; k <= page_max; k++) {
        if (k == page_now) {
            page_nav += '<li class="page-item active"><a class="page-link" href="javascript:page(' + String(k) + ')">' + String(k) + '</a></li>'
        } else {
            page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(k) + ')">' + String(k) + '</a></li>'
        }
    }
    if (page_now == page_max) {
        page_nav += '<li class="page-item disabled"><a class="page-link" href="">»</a></li></ul>';
    } else {
        page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now + 1) + ')">»</a></li></ul>';
    }
    document.getElementById('page_text').innerHTML = page_text;
    document.getElementById('page_nav').innerHTML = page_nav;
    $("#page_nav").rPage();
    if (table == '<thead class="table-dark"><tr><th>時間割番号</th><th>科目名</th><th>学期</th><th>曜日・時限</th><th>単位数</th><th>教員名</th></tr></thead>') {
        document.getElementById('result').innerHTML = '';
        document.getElementById('data_content').innerHTML = '検索結果はありません';
        document.getElementById('page_text').innerHTML = '';
        document.getElementById('page_nav').innerHTML = '';
    } else {
        document.getElementById('result').innerHTML = '検索結果：' + count + '件';
        document.getElementById('data_content').innerHTML = '<table id="syllabus_data" class="table-hover table-striped table text-nowrap" style="table-layout:auto;width:auto">' + table + '</table>';
    }
}

function per_page_change() {
    per_page = Number(document.getElementById('per_page').value);
    var page_num = 0;
    page_now = 1;
    const tt_num = "G" + document.getElementById('tt_num').value;
    const name = document.getElementById('name').value;
    const teacher_search = document.getElementById('teacher').value;
    let semester_elements = document.getElementsByName('semester');
    let len = semester_elements.length;
    let semester = '';
    for (let l = 0; l < len; l++) {
        if (semester_elements.item(l).checked) {
            semester = semester_elements.item(l).value;
        }
    }
    if (semester == "すべて") {
        semester = ""
    }
    const period_arr = [];
    const period_element = document.getElementsByName('period');

    for (let i = 0; i < period_element.length; i++) {
        if (period_element[i].checked && period_element[i].value != '集中') {
            period_element[i].parentElement.style.backgroundColor = '#27cc7f';
            period_arr.push(period_element[i].value);
        }
        if (period_element[i].checked && period_element[i].value == '集中') {
            period_arr.push(period_element[i].value);
        } else if (period_element[i].checked == false && period_element[i].value != '集中') {
            period_element[i].parentElement.style.backgroundColor = 'transparent';
        }
    }

    count = 0;
    var table = '<thead class="table-dark"><tr><th>時間割番号</th><th>科目名</th><th>学期</th><th>曜日・時限</th><th>単位数</th><th>教員名</th></tr></thead>';
    for (var i = 0; i < data["subject"].length; i++) {
        if (data["subject"][i]["tt_num"].indexOf(tt_num) != -1) {
            if (data["subject"][i]["name"].indexOf(name) != -1) {
                if (data["subject"][i]["semester"].indexOf(semester) != -1) {
                    if (period_arr.length == 0) {
                        if (teacher_search == "") {
                            var period;
                            var teacher;
                            for (var j = 0; j < data["subject"][i]["period"].length; j++) {
                                if (j == 0) {
                                    period = data["subject"][i]["period"][j]
                                } else {
                                    period += "，" + data["subject"][i]["period"][j]
                                }
                            }
                            for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
                                if (k == 0) {
                                    teacher = data["subject"][i]["teacher"][k]
                                } else {
                                    teacher += "<br>" + data["subject"][i]["teacher"][k]
                                }
                            }
                            if (count % per_page == 0) {
                                page_num += 1
                            }
                            if (page_num == 1) {
                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                            } else {
                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                            }
                            count += 1;
                        } else {
                            for (var p = 0; p < data["subject"][i]["teacher"].length; p++) {
                                if (data["subject"][i]["teacher"][p].indexOf(teacher_search) != -1) {
                                    for (var j = 0; j < data["subject"][i]["period"].length; j++) {
                                        if (j == 0) {
                                            period = data["subject"][i]["period"][j]
                                        } else {
                                            period += "，" + data["subject"][i]["period"][j]
                                        }
                                    }
                                    for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
                                        if (k == 0) {
                                            teacher = data["subject"][i]["teacher"][k]
                                        } else {
                                            teacher += "<br>" + data["subject"][i]["teacher"][k]
                                        }
                                    }
                                    if (count % per_page == 0) {
                                        page_num += 1
                                    }
                                    if (page_num == 1) {
                                        table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                    } else {
                                        table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                    }
                                    count += 1;
                                    break
                                }
                            }
                        }

                    } else {
                        period_loop: for (var m = 0; m < period_arr.length; m++) {
                            for (var n = 0; n < data["subject"][i]["period"].length; n++) {
                                if (period_arr[m] == data["subject"][i]["period"][n]) {
                                    var period;
                                    var teacher;
                                    for (var p = 0; p < data["subject"][i]["teacher"].length; p++) {
                                        if (data["subject"][i]["teacher"][p].indexOf(teacher_search) != -1) {
                                            for (var j = 0; j < data["subject"][i]["period"].length; j++) {
                                                if (j == 0) {
                                                    period = data["subject"][i]["period"][j]
                                                } else {
                                                    period += "，" + data["subject"][i]["period"][j]
                                                }
                                            }
                                            for (var k = 0; k < data["subject"][i]["teacher"].length; k++) {
                                                if (k == 0) {
                                                    teacher = data["subject"][i]["teacher"][k]
                                                } else {
                                                    teacher += "<br>" + data["subject"][i]["teacher"][k]
                                                }
                                            }
                                            if (count % per_page == 0) {
                                                page_num += 1
                                            }
                                            if (page_num == 1) {
                                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:table-row;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                            } else {
                                                table += '<tr data-pagenum=' + String(page_num) + ' style="display:none;"><td style="text-align:center;">' + data["subject"][i]["tt_num"] + "</td><td>" + data["subject"][i]["name"] + '<br><a href="' + data["subject"][i]["page"] + '"class="btn btn-sm btn-primary" target="_blank">シラバス参照</a></td><td style="text-align:center;">' + data["subject"][i]["semester"] + '</td><td>' + period + '</td><td style="text-align:center;">' + data["subject"][i]["credits"] + "</td><td>" + teacher + "</td></tr>"
                                            }
                                            count += 1;
                                            break period_loop
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    page_max = page_num;
    if ((page_now) * per_page > count) {
        now_page_max = count
    } else {
        now_page_max = (page_now) * per_page
    }
    var page_text = '全' + count + '件中' + (((page_now - 1) * per_page) + 1) + '～' + now_page_max + '件目を表示中';
    if (page_now == 1) {
        var page_nav = '<ul class="pagination justify-content-center"><li class="page-item disabled"><a class="page-link" href="">«</a></li>';
    } else {
        var page_nav = '<ul class="pagination justify-content-center"><li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now - 1) + ')">«</a></li>'
    }
    for (var k = 1; k <= page_max; k++) {
        if (k == page_now) {
            page_nav += '<li class="page-item active"><a class="page-link" href="javascript:page(' + String(k) + ')">' + String(k) + '</a></li>'
        } else {
            page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(k) + ')">' + String(k) + '</a></li>'
        }
    }
    if (page_now == page_max) {
        page_nav += '<li class="page-item disabled"><a class="page-link" href="">»</a></li></ul>';
    } else {
        page_nav += '<li class="page-item"><a class="page-link" href="javascript:page(' + String(page_now + 1) + ')">»</a></li></ul>';
    }
    document.getElementById('page_text').innerHTML = page_text;
    document.getElementById('page_nav').innerHTML = page_nav;
    $("#page_nav").rPage();
    if (table == '<thead class="table-dark"><tr><th>時間割番号</th><th>科目名</th><th>学期</th><th>曜日・時限</th><th>単位数</th><th>教員名</th></tr></thead>') {
        document.getElementById('result').innerHTML = '';
        document.getElementById('data_content').innerHTML = '検索結果はありません';
        document.getElementById('page_text').innerHTML = '';
        document.getElementById('page_nav').innerHTML = '';
    } else {
        document.getElementById('result').innerHTML = '検索結果：' + count + '件';
        document.getElementById('data_content').innerHTML = '<table id="syllabus_data" class="table-hover table-striped table text-nowrap" style="table-layout:auto;width:auto">' + table + '</table>';
    }
}

function check_clear() {
    const period_element = document.getElementsByName('period');
    for (let i = 0; i < period_element.length; i++) {
        if (period_element[i].checked) {
            period_element[i].checked = false;
        }
    }
    document.querySelector("input[name='period']").onchange();
}

function check_checked() {
    const period_element = document.getElementsByName('period');
    for (let i = 0; i < period_element.length; i++) {
        if (period_element[i].checked == false) {
            period_element[i].checked = true;
        }
    }
    document.querySelector("input[name='period']").onchange();
}

function all_reset() {
    document.getElementById('tt_num').value = "";
    document.getElementById('name').value = "";
    var semeseter_elements = document.getElementsByName('semester');
    semeseter_elements[0].checked = true;
    const period_element = document.getElementsByName('period');
    for (let i = 0; i < period_element.length; i++) {
        if (period_element[i].checked) {
            period_element[i].checked = false;
        }
    }
    document.getElementById('teacher').value = "";

    document.getElementById('tt_num').oninput();
    document.getElementById('name').oninput();
    document.getElementById('teacher').oninput();
    document.querySelector("input[name='semester']").onchange();
    document.querySelector("input[name='period']").onchange();
}