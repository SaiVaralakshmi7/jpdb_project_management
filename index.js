$("#proId").focus();


function saveno2ls(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getproidasjsonobj(){
    var proId = $('#proId').val();
    var jsonStr = {
        id: proId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveno2ls(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#proName').val(record.proName);
    $('#asto').val(record.asto);
    $('#asdt').val(record.asdt);
    $('#deadline').val(record.deadline);

}



function validateAndGetFormData() {
var proIdVar = $("#proId").val();
if (proIdVar === "") {
alert("Project ID Required ");
$("#proId").focus();
return "";
}
var proNameVar = $("#proName").val();
if (proNameVar === "") {
alert("Project Name is Required ");
$("#proName").focus();
return "";
}
var asto_Var = $("#asto").val();
if (asto_Var === "") {
alert("Assigned To is Required ");
$("#asto").focus();
return "";
}
var asdt_Var = $("#asdt").val();
if (asdt_Var === "") {
alert("Assigned Date is Required ");
$("#asdt").focus();
return "";
}
var deadline_Var = $("#deadline").val();
if (deadline_Var === "") {
alert("Deadline is Required ");
$("#deadline").focus();
return "";
}
var jsonStrObj = {
proId: proIdVar,
proName: proNameVar,
asto: asto_Var,
asdt: asdt_Var,
deadline: deadline_Var
};
return JSON.stringify(jsonStrObj);
}

// This method is used to create PUT Json request.
function createPUTRequest(connToken, jsonObj, dbName, relName) {
var putRequest = "{\n"
+ "\"token\" : \""
+ connToken
+ "\","
+ "\"dbName\": \""
+ dbName
+ "\",\n" + "\"cmd\" : \"PUT\",\n"
+ "\"rel\" : \""
+ relName + "\","
+ "\"jsonStr\": \n"
+ jsonObj
+ "\n"
+ "}";
return putRequest;
}

function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
var url = dbBaseUrl + apiEndPointUrl;
var jsonObj;
$.post(url, reqString, function (result) {
jsonObj = JSON.parse(result);
}).fail(function (result) {
var dataJsonObj = result.responseText;
jsonObj = JSON.parse(dataJsonObj);
});
return jsonObj;
}

function getpro(){
    var proIdjo = getproidasjsonobj();
    var getrequest = createGet_BY_KEYRequest("90931475|-31949303325543518|90960602","projects", "pro-rel",proIdjo);
    jQuery.ajaxSetup({async: false});
    var resjo = executeCommand(getrequest,"http://api.login2explore.com:5577", "/api/irl" );
    jQuery.ajaxSetup({async: true});
    if(resjo.status === 400){
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#proName').focus();


    }else if(resjo.status === 200){
        $('#proId').prop("disabled", true);
        fillData(resjo);

        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $('#proName').focus();

    }

}



function resetForm() {
$("#proId").val("")
$("#proName").val("");
$("#asto").val("");
$("#asdt").val("");
$("#deadline").val("");
$("#proId").prop("disabled",false);
$("#save").prop("disabled",true);
$("#change").prop("disabled",true);
$("#reset").prop("disabled",true);

$("#empId").focus();
}

function savedata() {
    $("#save").prop("disabled",true);
var jsonStr = validateAndGetFormData();
if (jsonStr === "") {
return;
}

var putReqStr = createPUTRequest("90931475|-31949303325543518|90960602",
jsonStr, "projects", "pro-rel");
alert(putReqStr);
jQuery.ajaxSetup({async: false});
var resultObj = executeCommand(putReqStr,"http://api.login2explore.com:5577", "/api/iml");
alert(JSON.stringify(resultObj));
jQuery.ajaxSetup({async: true});
resetForm();
$("#proId").focus();
}

function changeData(){
    $('#change').prop("disabled", true);
    jsonchg = validateAndGetFormData();
    var updaterequest = createUPDATERecordRequest("90931475|-31949303325543518|90960602",
    jsonchg, "projects", "pro-rel", localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resjo = executeCommand(updaterequest,"http://api.login2explore.com:5577", "/api/iml");
    alert(resjo);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#proId").focus();

}


