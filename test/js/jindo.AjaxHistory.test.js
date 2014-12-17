window.onload = function(){
	var sHistoryFrameURL = "asset/history.html";
	var oAjaxHistory = new jindo.AjaxHistory({ sIFrameUrl : sHistoryFrameURL });
	var sComponentId = oAjaxHistory.getComponentId();
	var oAgent = jindo.$Agent().navigator();
	
	if(oAgent.ie && oAgent.version < 8 && location.href.search(/https?:\/\//)){
		alert("IE 7 이하에서 테스트는 웹서버 상에서만 가능합니다.");
		return false;
	}
	
	oAjaxHistory.attach("load", function(){
		window.__ajax_history_callback = "load";
	});

	oAjaxHistory.attach("change", function(oChangeEvent){
		var htResult = {};
		for(var x in oChangeEvent){
			if(x != "sType" || x != "_aExtend"){
				htResult[x] = oChangeEvent[x];
			}
		}
		window.__ajax_history_callback = "change"+encodeURIComponent(jindo.$Json(htResult).toString());
	});

	oAjaxHistory.initialize();

	function getHash(){
		var sHash = decodeURIComponent(location.href.replace(/^[^#]*(?=#|$)/, '').substring(1));
		return new Function("return " + sHash)();
	}

	test("초기값 검증", function(){
		equal(location.hash, "", "테스트 시작 시에, location.hash는 설정되어 있으면 안된다.");
		ok(window.__ajax_history_callback === "load", "hash 정보 없이 페이지에 접근 시, load 이벤트가 발생하여야 한다.");
	});

	test("Hash 인코딩/디코딩 테스트", function(){
		var htTestData = {
			"aList" : [
				1, "2", "a"
			],
			"htTmp" : {
				key1 : "value1",
				"key2" : "value2"
			},
			"sKey" : "vValue"
		};

		var sResult = oAjaxHistory._getEncodedData(htTestData);
		ok(sResult === "%7B%22aList%22%3A%5B1%2C%222%22%2C%22a%22%5D%2C%22htTmp%22%3A%7B%22key1%22%3A%22value1%22%2C%22key2%22%3A%22value2%22%7D%2C%22sKey%22%3A%22vValue%22%7D", "파라미터로 넘긴 객체를 시리얼라이징 후, 인코딩한 문자열이 리턴되어야 한다.");
		var sResult2 = oAjaxHistory._getEncodedData();
		ok(sResult2 === "", "파라미터를 넘기지 않을 경우, 빈 문자열이 리턴되어야 한다.");

		var htResult = oAjaxHistory._getDecodedData(sResult);
		deepEqual(htResult, htTestData, "");
		var htResult2 = oAjaxHistory._getDecodedData();
		deepEqual(htResult2, {}, "파라미터를 넘기지 않을 경우, 빈 객체가 리턴되어야 한다.");
	});

	test("데이터 비교 테스트", function(){
		var bResult = oAjaxHistory._compareData();
		ok(bResult === false, "파라미터를 넘기지 않을 경우, false가 리턴되어야 한다.");

		bReault = oAjaxHistory._compareData({
			"a" : 1
		}, {
			"a" : 1,
			"b" : 1
		});
		ok(bResult === false, "내부 프로퍼티의 개수가 다른 두 데이터를 넘길 경우, false가 리턴되어야 한다.");

		bResult = oAjaxHistory._compareData({
			"a" : 1
		}, {
			"a" : 2
		});
		ok(bResult === false, "값이 다른 두 데이터를 넘길 경우, false가 리턴되어야 한다.");

		bResult = oAjaxHistory._compareData({
			"a" : 1,
			"b" : 2
		}, {
			"a" : "1",
			b : 2
		});
		ok(bResult === true, "값이 같은 두 데이터를 넘길 경우, true가 리턴되어야 한다.");

		bResult = oAjaxHistory._compareData({
			"a" : "a",
			"b" : {
				"c" : "c"
			},
			"d" : [
				"e"
			]
		}, {
			"a" : "a",
			"b" : {
				c : "c"
			},
			"d" : [
				"e"
			]
		});
		ok(bResult === true, "데이터 객체 안에 하위 데이터 객체가 있을 경우, 하위 데이터 객체도 재귀적으로 비교해서 true를 리턴해야 한다.");
	});

	test("addHistory()", function(){
		var bResult = oAjaxHistory.addHistory({
			"a" : 1,
			"b" : 1
		});
		deepEqual(getHash(), {"a":1,"b":1}, "전달한 파라미터를 인코딩하여 hash에 설정되어 있어야 한다.");
		ok(bResult === true, "정상적으로 추가되었을 경우, 결과값은 true여야 한다");

		bResult = oAjaxHistory.addHistory();
		deepEqual(getHash(), {"a":1,"b":1}, "파라미터를 넘기지 않은 경우, hash가 변경되어서는 안된다.");
		ok(bResult === false, "파라미터를 넘기지 않을 경우, 결과값은 false여야 한다.");

		bResult = oAjaxHistory.addHistory({
			"a" : 1,
			"b" : 1
		});
		ok(getHash(), {"a":1,"b":1}, "현재 설정된 데이터와 동일한 데이터를 전달 시, hash가 변경되어서는 안된다.");
		ok(bResult === false, "현재 설정된 데이터와 동일한 데이터를 전달 시, 결과값은 false여야 한다.");

		if(oAgent.ie && oAgent.version < 8){
			ok(oAjaxHistory._welIFrame.$value().src === sHistoryFrameURL + "?hash=%7B%22a%22%3A1%2C%22b%22%3A1%7D", ""); 
		}
	});

	asyncTest("로케이션 이동 테스트", function(){
		var bResult = false;
		setTimeout(function(){
		bResult = oAjaxHistory.addHistory({"a" : 2, "b" : 2});
		ok(bResult === true, "addHistory() 호출 시, 정상적으로 데이터가 들어가고, 결과값은 true여야 한다.");
		}, 500);
		
		setTimeout(function(){
		bResult = oAjaxHistory.addHistory({"a" : 3, "b" : 3});
		ok(bResult === true, "addHistory() 호출 시, 정상적으로 데이터가 들어가고, 결과값은 true여야 한다.");
		}, 1000);
		
		setTimeout(function(){
		bResult = oAjaxHistory.addHistory({"a" : 4, "b" : 4});
		ok(bResult === true, "addHistory() 호출 시, 정상적으로 데이터가 들어가고, 결과값은 true여야 한다.");
		}, 1500);
		
		setTimeout(function(){
		bResult = oAjaxHistory.addHistory({"a" : 5, "b" : 5});
		ok(bResult === true, "addHistory() 호출 시, 정상적으로 데이터가 들어가고, 결과값은 true여야 한다.");
		}, 2000);

		setTimeout(function(){
			history.back();
		}, 2500);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 4, "b" : 4}, "뒤로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.back();
			start();
		}, 3000);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 3, "b" : 3}, "뒤로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.back();
		}, 3500);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 2, "b" : 2}, "뒤로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.back();
		}, 4000);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 1, "b" : 1}, "뒤로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.forward();
		}, 4500);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 2, "b" : 2}, "앞으로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.forward();
		}, 5000);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 3, "b" : 3}, "앞으로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.forward();
		}, 5500);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 4, "b" : 4}, "앞으로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			history.forward();
		}, 6000);

		setTimeout(function(){
			deepEqual(getHash(), {"a" : 5, "b" : 5}, "앞으로 한단계 이동 시, hash는 이전 단계의 데이터를 변환한 값으로 설정되어 있어야 한다.");
			start();
		}, 6500);
		
		return;
		
	});

	test("컴포넌트 소멸자 테스트", function(){

		oAjaxHistory.destroy();
		ok(oAjaxHistory._htEventHandler === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oAjaxHistory._htHistoryData === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oAjaxHistory._oAgent === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oAjaxHistory._welIFrame === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oAjaxHistory._nIntervalId === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oAjaxHistory._sCheckType === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oAjaxHistory._sComponentId === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
	});
};
