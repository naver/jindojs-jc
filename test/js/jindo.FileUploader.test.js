var oFileUploader = new jindo.FileUploader(jindo.$("file_select"),{
    sUrl  : 'http://jindo.nhncorp.com/docs/jindo-component/sample/response/FileUpload.php',
    sCallback : 'http://jindo.nhncorp.com/docs/jindo-component/archive/FileUploader/trunk/Spec/callback_for_test.html',
    sFiletype : '*.jpg', //*.jpg
    sMsgNotAllowedExt : 'jpg 확장자만 가능합니다',
	bAutoUpload : false,
	htData : {
		test : "test"
	}
});


var oFileUploader2 = new jindo.FileUploader(jindo.$("file_select"),{
    sUrl  : 'http://jindo.nhncorp.com/docs/jindo-component/sample/response/FileUpload.php',
    sCallback : 'http://jindo.nhncorp.com/docs/jindo-component/archive/FileUploader/trunk/Spec/callback_for_test_success.html',
    sFiletype : '*.jpg', //*.jpg
    sMsgNotAllowedExt : 'jpg 확장자만 가능합니다',
	bAutoUpload : false,
	htData : {
		test : "test"
	}
});

			
module("", {
	setup : function() {
	}
});
test("getFileSelect()", function(){
	ok(oFileUploader.getFileSelect() === jindo.$("file_select"), "getFileSelect()는 file select를 리턴한다.");
});

test("getFormElement()", function(){
	ok(oFileUploader.getFormElement() === jindo.$("file_select").form, "getFormElement()는 file input의 form을 리턴한다.");
});

asyncTest("셀렉트의 값이 허용된 파일명으로 변경된경우 (전송 실패시)", function(){
	oFileUploader.attach({
		select : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(true, "select 커스텀이벤트가 발생한다.");
			ok(oCustomEvent.bAllowed, "허용된 파일명이기 때문에 oCustomEvent.bAllow 값은 true이다.");
		},
		
		error : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(true, "error 커스텀이벤트가 발생한다. (성공 케이스 테스트 불가능.");
			start();
		}
	});
	
	oFileUploader._onFileSelectChange({
		element : {
			value : "test.jpg"
		}
	});
	
	oFileUploader.fireEvent("error");
});

asyncTest("셀렉트의 값이 허용된 파일명으로 변경된경우 (전송 성공시)", function(){
	oFileUploader2.attach({
		select : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(true, "select 커스텀이벤트가 발생한다.");
			ok(oCustomEvent.bAllowed, "허용된 파일명이기 때문에 oCustomEvent.bAllow 값은 true이다.");
		},
		
		success : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(true, "success 커스텀이벤트가 발생한다. (성공 케이스로 가정)");
//			this.option("sCallback", 'http://jindo.nhncorp.com/docs/jindo-component/archive/FileUploader/trunk/Spec/callback.html');
			start();
		}
	});
	oFileUploader2._onFileSelectChange({
		element : {
			value : "test2.jpg"
		}
	});
	
	oFileUploader2.fireEvent("success");
});

asyncTest("셀렉트의 값이 허용되지 않은 파일명으로 변경된경우", function(){
	oFileUploader.attach({
		select : function(oCustomEvent) {
			this.detach(oCustomEvent.sType, arguments.callee);
			ok(true, "select 커스텀이벤트가 발생한다.");
			ok(!oCustomEvent.bAllowed, "허용된 파일명이 아니기 때문에 oCustomEvent.bAllow 값은 false이다.");
			oCustomEvent.stop();
			start();
		}
	});
	oFileUploader._onFileSelectChange({
		element : {
			value : "test.gif"
		}
	});
});

test("확장자 검사 로직", function(){
	ok(!oFileUploader._checkExtension("test.gif"), "*.jpg 파일만 허용하므로 test.gif파일은 허용하지 않는다.");
	ok(oFileUploader._checkExtension("test.jpg"), "*.jpg 파일만 허용하므로 test.jpg파일은 허용한다.");
});

test("getBaseElement()", function(){
	ok(oFileUploader.getBaseElement() === jindo.$("file_select"), "getBaseElement()는 deprecated됨.");
});

test("deactivate() / activate()", function() {
	oFileUploader.deactivate();
	ok(!oFileUploader.isActivating(), "deactivate()수행후 isActivating()는 false를 리턴한다.");
	oFileUploader.activate();
	ok(oFileUploader.isActivating(), "activate()수행후 isActivating()는 true를 리턴한다.");
});
