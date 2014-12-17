window.onload = function(){
	var oCache = new jindo.Cache();
	
	test("_makeKey() 함수 테스트", function(){
		var sResult = oCache._makeKey();
		ok(sResult === "", "파라미터를 넘기지 않을 경우, 빈 문자열이 리턴되어야 한다.");
		
		sResult = oCache._makeKey("key");
		ok(sResult === "key", "문자열 키를 넘긴 경우, 문자열 키는 그대로 리턴되어야 한다.");
		
		sResult = oCache._makeKey({"type" : "hashtable"});
		ok(sResult === "type=hashtable", "HashTable 형태의 객체 키를 넘긴 경우, 쿼리스트링 형태의 문자열 키가 리턴되어야 한다.");

		/*
		sResult = oCache._makeKey([1, 2]);
		ok(sResult === "0=1&1=2", "배열 형태의 객체 키를 넘긴 경우, 쿼리스트링 형태의 문자열 키가 리턴되어야 한다.");
		*/
		
		sResult = oCache._makeKey(1);
		ok(sResult === "", "숫자형 키를 넘긴 경우, 빈 문자열이 리턴되어야 한다.");
		
		sResult = oCache._makeKey(true);
		ok(sResult === "", "불린 형태의 키를 넘긴 경우, 빈 문자열이 리턴되어야 한다.");
	});
	
	test("_getExpireTime() 함수 테스트", function(){
		var nResult = oCache._getExpireTime();
		ok(nResult === 0, "파라미터를 넘기지 않은 경우, 0이 리턴되어야 한다.");
		
		nResult = oCache._getExpireTime(20);
		ok(nResult === (new Date()).getTime()+20000, "");
		
		oCache.option("nExpireTime", 10);
		nResult = oCache._getExpireTime();
		ok(nResult === (new Date()).getTime()+10000, "옵션에 nExpireTime이 지정된 경우, 파라미터를 넘기지 않더라도, nExpireTime이 적용된 시간이 리턴되어야 한다.");
	});

	test("add() 함수 테스트 ", function(){
		var bResult = oCache.add();
		ok(bResult === false, "파라미터를 넘기지 않을 경우, false가 리턴되어야 한다.");
		
		bResult = oCache.add("key");
		ok(bResult === false, "키만 넘길 경우, false가 리턴되어야 한다.");
		
		bResult = oCache.add("key", "value");
		ok(bResult === true, "키와 값을 넘긴 경우, true가 리턴되어야 한다.");
		ok(oCache._waKeyList.length() === 1, "데이터를 추가한 경우, 내부의 waKeyList 배열의 크기는 1이 증가해야 한다.");
	
		bResult = oCache.add({"action" : "test", "page" : 1}, [0, 1, 2]);
		ok(bResult === true, "객체 형태의 키를 넘긴 경우, true가 리턴되어야 한다.");
		ok(oCache._waKeyList.length() === 2, "데이터를 추가한 경우, 내부의 waKeyList 배열의 크기는 1이 증가해야 한다.");
	});

	test("clear() 함수 테스트 ", function(){
		oCache.clear();
		deepEqual(oCache._waKeyList, jindo.$A(), "캐쉬에 관련된 내부 값은 모두 삭제되어 있어야 한다.");
		deepEqual(oCache._htCacheData, {}, "캐쉬에 관련된 내부 값은 모두 삭제되어 있어야 한다.");
		deepEqual(oCache._htExpireTime, {}, "캐쉬에 관련된 내부 값은 모두 삭제되어 있어야 한다.");
		ok(oCache._waKeyList.length() === 0, "clear() 함수 호출 후, 모든 데이터가 삭제되어 있어야 한다.");
	});
	
	test("check() 함수 테스트", function(){
		oCache.clear();
		oCache.add("key", "value");
		
		var bResult = oCache.check();
		ok(bResult === false, "파라미터를 넘기지 않은 경우, false가 리턴되어야 한다.");
		
		bResult = oCache.check("WrongKey");
		ok(bResult === false, "잘못된 키를 파라미터로 넘긴 경우, false가 리턴되어야 한다.");
		
		bResult = oCache.check("key");
		ok(bResult === true, "올바른 키를 파라미터로 넘긴 경우, true가 리턴되어야 한다.");
		
		bResult = oCache.add({"action" : "test", "page" : 1}, [0, 1, 2]);
		bResult = oCache.check({"action" : "test", "page" : 1});
		ok(bResult === true, "객체 형태의 키를 이용하여 데이터의 캐쉬 체크 시, true가 리턴되어야 한다.");
		bResult = oCache.check({"action" : "test", "page" : 2});
		ok(bResult === false, "객체 형태의 키의 내부 값이 다른 경우에는 데이터의 캐쉬 체크 시, false가 리턴되어야 한다.");
	});
	
	test("get() 함수 테스트 ", function(){
		oCache.clear();
		oCache.add("key", "value");
	
		var vResult = oCache.get();
		ok(vResult === null, "파라미터를 넘기지 않은 경우, null이 리턴되어야 한다.");
		
		vResult = oCache.get("WrongKey");
		ok(vResult === null, "잘못된 키를 파라미터로 넘긴 경우, null이 리턴되어야 한다.");
		
		vResult = oCache.get("key");
		ok(vResult === "value", "올바른 키를 파라미터로 넘긴 경우, 저장된 데이터가 리턴되어야 한다.");
		
		bResult = oCache.add({"action" : "test", "page" : 1}, [0, 1, 2]);
		vResult = oCache.get({"action" : "test", "page" : 1});
		deepEqual(vResult, [0, 1, 2], "객체 형태의 키를 파라미터로 전달하여, 저장된 데이터를 가져와야 한다.");
	});
	
	test("remove() 함수 테스트 ", function(){
		oCache.clear();
	
		oCache.add("test", "value");
		ok(oCache._waKeyList.length() === 1, "저장된 데이터의 개수는 1개여야 한다.");
		
		var bResult = oCache.remove();
		ok(bResult === false, "파라미터를 넘기지 않은 경우, false가 리턴되어야 한다.");
		ok(oCache._waKeyList.length() === 1, "파라미터를 넘기지 않은 경우, 저장된 데이터의 개수는 변화되어서는 안된다.");
		
		bResult = oCache.remove("WrongKey");
		ok(bResult === false, "잘못된 키를 파라미터를 넘긴 경우, false가 리턴되어야 한다.");
		ok(oCache._waKeyList.length() === 1, "잘못된 키를 파라미터로 넘긴 경우, 저장된 데이터의 개수는 변화되어서는 안된다.");
		
		bResult = oCache.remove("test");
		ok(bResult === true, "올바른 키를 파라미터로 넘긴 경우, true가 리턴되어야 한다.");
		ok(oCache._waKeyList.length() === 0, "올바른 키를 파라미터로 넘긴 경우, 저장된 데이터의 개수는 0으로 변해야 한다.");
		deepEqual(oCache._htCacheData, {}, "올바른 키를 파라미터로 넘긴 경우, 저장된 데이터는 삭제되어야 한다.");
	});
	
	test("_checkCacheLimit() 함수 테스트", function(){
		oCache.clear();
		oCache.option("nCacheLimit", 3);
		
		oCache.add("key1", "value1");
		oCache.add("key2", "value2");
		oCache.add("key3", "value3");

		deepEqual(oCache._htCacheData, {
			"key1" : "value1",
			"key2" : "value2",
			"key3" : "value3"
		}, "최대 캐쉬 수까지는 정상적으로 데이터가 추가되어야 한다.");

		oCache.add("key4", "value4");
		deepEqual(oCache._htCacheData, {
			"key2" : "value2",
			"key3" : "value3",
			"key4" : "value4"
		}, "최대 캐쉬 수를 넘어서서 데이터가 추가될 경우에는, 처음에 추가된 데이터가 삭제되어야 한다.");
		
		var vResult = oCache.get("key1");
		ok(vResult === null, "최대 캐쉬 수를 넘어서서, 삭제된 데이터는 리턴할 데이터가 없다.");
		oCache.option("nCacheLimit", 50);
	});
	
	test("_checkCacheExpire() 함수 테스트", function(){

		oCache.clear();
		oCache.add("key1", "value1", 1);
		var vResult;
		setTimeout(function(){
			vResult = oCache.get("key1");
			ok(vResult === "value1", "데이터의 유효 시간이 지나기 전에는, 저장된 데이터가 리턴되어야 한다.");
		}, 500);
		
		setTimeout(function(){
			vResult = oCache.get("key1");
			ok(vResult === null, "데이터의 유효 시간이 지난 경우에는 null이 리턴되어야 한다.");
			start();
		}, 1500);
		
		stop();
		
	});
	
	test("컴포넌트 소멸자 테스트", function(){
		oCache.destroy();
		ok(oCache._waKeyList === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oCache._htCacheData === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
		ok(oCache._htExpireTime === null, "내부 프로퍼티는 초기화 되어 있어야 한다.");
	});
};
