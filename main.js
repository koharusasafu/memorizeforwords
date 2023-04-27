
//
let mode = 0;
let userArray = [];
let importedFile ;
let turnNum = 0;
let Judge0;
let Judge1;
let Judge2;



//
function failDropScreen(){
    var mainblock = document.getElementById('mainblock');
    $("#mainblock").append(
        '<input type="file" id="input" onchange="showFile(this)">'
    )
}

function csvToArray(){
    let lines = importedFile.split(/\r\n|\n|\r/);
    let table = lines.map(function(line){
        return line.split(',');
    });
    userArray = table;
}

function makeBlockAB(){
    $("#mainblock").append(
        '<div class="blockA">'+
            '<div class="Qarea" id="Qarea"></div>'+
        '</div>'+
        '<div class="blockB">'+
            '<button id="button00"></button>'+
        '</div>'
    )
}

function inputRemove(){
    const input_element = document.getElementById('input');
    input_element.remove();
}

function Qscreen(){

    button00.innerHTML = "ANS";
    Qarea.innerHTML = "Q" + userArray[turnNum][0] + "." + userArray[turnNum][1];
    button00.addEventListener("click",clicked);
}

function Ascreen(){
    button00.innerHTML = "Judge";
    Qarea.innerHTML = "A" + userArray[turnNum][0] + "." + userArray[turnNum][2];
    button00.addEventListener("click",clicked);
}

function Judgescreen(){
    button00.innerHTML = "NEXT(BACK)";

    var css = document.createElement("link");
    css.setAttribute("rel","stylesheet");
    css.setAttribute("type","text/css");
    css.setAttribute("href","judgebutton.css");


    document.getElementsByTagName("head")[0].appendChild(css);

    $(".Qarea").css('text-align','left');
    $(".Qarea").css('line-height','40px');
    Qarea.innerHTML = '判定';

    $('.Qarea').append(
        '<div id="div1">'+
            '<label class="like">'+
                '<input type="checkbox" id="cb0"/>'+
                    '<div class="hearth"/>'+
            '</label>'+
            '<p>よくわかる</p>'+
        '</div>'+
        '<div id="div2">'+
        '<label class="like1">'
            +'<input type="checkbox" id="cb1"/>'
            +'<div class="hearth1"/>'
            +'</label>'
            +'<p>うろ覚え</p>'+
        '</div>'+
        '<div id="div3">'+
            '<label class="like2">'+
                '<input type="checkbox" id="cb2"/>'+
                    '<div class="hearth2"/>'+
            '</label>'+
            '<p>わかんない</p>'+
        '</div>'
    );

}

function resultscreen(){
    button00.innerHTML = "EXPORT";
    Qarea.innerHTML = "ボタンを押してCSV出力";
    button00.addEventListener("click",clicked);
}

function judge(){
    if(Judge0 && !(Judge1) && !(Judge2)){
        userArray[turnNum][3] = 3;
        turnNum++;
    }
    if(Judge1 && !(Judge0) && !(Judge2)){
        userArray[turnNum][3] = 2;
        turnNum++;
    }
    if(Judge2 && !(Judge0) && !(Judge1)){
        userArray[turnNum][3] = 1;
        turnNum++;
    }
    Judge0=0;
    Judge1=0;
    Judge2=0;
}

function checkTurnNum(){
    if(turnNum +1>=userArray.length){
        return false;
    }
    return true;
}

function clearDiv123(){
    const div1Element = document.querySelector('#div1');
    const div2Element = document.querySelector('#div2');
    const div3Element = document.querySelector('#div3');
    div1Element.remove();
    div2Element.remove();
    div3Element.remove();
    $(".Qarea").css('textAlign','center');
    $(".Qarea").css('lineHeight','330px');
}

let csv_string = ""

function arrayToCsv(){
    for(let d of userArray){
        csv_string += d.join(",");
        csv_string += '\r\n';
    }
}

function exportCSV(str){
    var blob = new Blob([str],{type:"text/csv"});
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "tempdate.csv";
    link.click();
}


function clicked (){
    mode++;

}

//非同期処理
function showFile(input){
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function(){
        importedFile = reader.result;
    };
    reader.onerror = function(){
        console.log(reader.onerror);
    };
}

function checkBOX(){
    const cb0 = document.querySelector('#cb0');
    cb0.addEventListener('change',(event) => {
        const value = event.target.checked;
        if(value){
            Judge0 = true;
        }else{       
            Judge0 = false;
        }
        button00.addEventListener('click',clicked);
    });
    const cb1 = document.querySelector('#cb1');
    cb1.addEventListener('change',(event) => {
        const value = event.target.checked;
        if(value){
            Judge1 = true;
        }else{
            Judge1 = false;
        }
        button00.addEventListener('click',clicked);
    });
    const cb2 = document.querySelector('#cb2');
    cb2.addEventListener('change',(event) => {
        const value = event.target.checked;
        if(value){
            Judge2 = true;
        }else{
            Judge2 = false;
        }
        button00.addEventListener('click',clicked);
    });
}

const mainloop = () => {
    switch(mode){
        case 0:
            mode++;
            break;
        case 1:
            //一番最初の画面
            failDropScreen();
            mode++;
            break;
        case 2:
            if(importedFile != null){
                mode++;
            }
            break;
        case 3:
            //ファイルの読み取りクリック
            csvToArray();
            console.log(userArray);
            mode++;
            break;
        case 4:
            //QAJ土台
            inputRemove();
            makeBlockAB();
            mode++;
            break;
        case 5:
            //Q-
            Qscreen();
            break;
        case 6:
            //A-
            Ascreen();
            break;
        case 7:
            //J-
            Judgescreen();
            checkBOX();
            mode++;
            break;
        case 8:
            break;
        case 9:
            judge();
            mode++;
            break;
        case 10:
            //問題番号チェック
            if(!checkTurnNum()){
                mode++;
            }else{
                clearDiv123();
                mode = 5;
            }
            break;
        case 11:
            //結果画面井の描写
            resultscreen();
            mode++;
            break;
        case 13:
            //csv化
            arrayToCsv();
            mode++;
            break;
        case 14:
            exportCSV(csv_string);
            mode++;
            break;
        case 15:
            break;
            //こっから

    }
    window.requestAnimationFrame(mainloop);
} 

window.requestAnimationFrame(mainloop);
