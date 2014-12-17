var oTimer = new jindo.Timer();

module("Public Method", {
	setup : function() {
	},
	teardown : function() {
	}
});
test("isRunning() 메소드", function() {
	ok(oTimer.isRunning() == false, "타이머는 실행중이지 않다.");
});

test("start() 메소드 (타이머 1회 수행)", function() {
	ok(oTimer.start(function(){}, 1000), "start() 메소드를 수행하면 true를 리턴한다.");
	ok(oTimer.isRunning(), "타이머가 실행중이다.");
	stop();
	setTimeout(function(){
		ok(oTimer.isRunning() == false, "start(function(){}, 1000)를 수행하고 1초후에는 타이머가 실행중이지 않다.");
		start();	
	}, 1000);
});

test("abort() 메소드", function() {
	ok(oTimer.start(function(){}, 1000), "start() 메소드를 수행하면 true를 리턴한다.");
	ok(oTimer.isRunning(), "타이머가 실행중이다.");
	stop();
	setTimeout(function(){
		ok(oTimer.isRunning(), "start(function(){}, 1000)를 수행하고 100ms후에는 타이머가 실행중이다.");
		ok(oTimer.abort(), "start(function(){}, 1000)를 수행하고 100ms후에는 abort() 수행하면 true를 리턴한다.");
		ok(oTimer.isRunning() == false, "abort()가 true를 리턴했으므로 타이머는 종료된다.");
		ok(oTimer.abort() == false, "타이머가 수행중이 아닐 때 abort() 수행하면 false를 리턴한다.");
		start();	
	}, 100);
});

test("start() 메소드 (타이머 반복 수행)", function() {
	var nCount = 0;
	ok(oTimer.start(function(){
		nCount++;
		return true; 
	}, 200), "start() 메소드를 수행하면 true를 리턴한다.");
	ok(oTimer.isRunning(), "타이머가 실행중이다.");
	stop();
	setTimeout(function(){
		ok(oTimer.isRunning(), "start(function(){ return true; }, 200)를 수행하고 1100ms후에도 여전히 타이머가 실행중이다.");
		ok(nCount == 5, "타이머는 총 5번 반복 수행되었다.");
		oTimer.abort();
		start();	
	}, 1100);
});

test("pause()", function() {
	var nCount = 0;
	ok(oTimer.start(function(){
		nCount++;
		return true; 
	}, 200), "start() 메소드를 수행하면 true를 리턴한다.");
	ok(oTimer.isRunning(), "타이머가 실행중이다.");
	stop();
	setTimeout(function(){
		ok(oTimer.isRunning(), "start(function(){ return true; }, 200)를 수행하고 1100ms후에도 여전히 타이머가 실행중이다.");
		ok(nCount == 5, "타이머는 총 5번 반복 수행되었다.");
		ok(oTimer.pause(), "pause()가 성공적으로 이뤄지면 true를 리턴한다.");
		ok(oTimer.isRunning() == false, "pause()를 수행해 타이머를 일시정지했으므로 타이머는 실행중이 아니다.");
		ok(oTimer.pause() == false, "이미 일시정지된 상태이므로 pause()는 false를 리턴한다.");
		start();	
	}, 1100);
});

test("resume()", function() {
	var nCount = 0;
	ok(oTimer.start(function(){
		nCount++;
		return true; 
	}, 200), "start() 메소드를 수행하면 true를 리턴한다.");
	ok(oTimer.isRunning(), "타이머가 실행중이다.");
	ok(oTimer.pause() && !oTimer.isRunning(), "pause()를 수행하면 타이머가 일시중지된다.");
	stop();
	setTimeout(function(){
		ok(!oTimer.isRunning(), "1100ms 후에도 여전히 타이머는 일시중지된 상태이다.");
		ok(oTimer.resume(), "resume()이 성공하면 true를 리턴한다.");
		ok(oTimer.isRunning(), "resume()이 성공하면 타이머는 수행중이다.");
		
		setTimeout(function(){
			ok(oTimer.isRunning(), "1000ms 후에도 여전히 타이머는 수행중 상태이다.");
			ok(nCount == 5, "타이머는 총 5번 반복 수행되었다.");
			ok(oTimer.resume() == false, "이미 반복 수행 중이므로 resume()는 false를 리턴한다.");
			start();	
		}, 1100);
	}, 1100);
});

test("start 에서 nDelay 을 0 으로 준 경우", function() {
	
	var check = false;
	oTimer.start(function() {
		check = true;
	}, 0);
	
	equal(check, false, "아직 바뀌지 않아야 함");
	
	stop();
	
	setTimeout(function() {
		equal(check, true, "이때는 바뀌어야 함");	
		start();	
	}, 100);
	
});

test("start 에서 nDelay 을 -1 으로 준 경우", function() {
	
	var oTimer = new jindo.Timer();
	
	var check = 0;
	oTimer.start(function() {
		check++;
		return check < 3;
	}, -1);
	
	equal(check, 3, "이때는 바뀌어야 함");	
	
});

test("JINDOSUS-728", function() {
	
	var oTimer = new jindo.Timer();
	
	var check = 0;
	oTimer.start(function() {
		check++;
		return true;
	}, 10);
	
	oTimer.pause();
	oTimer.abort();
	oTimer.resume();
	
	setTimeout(function() {
		equal(check, 0, "바뀌지 않아야함");
		start();
	}, 100);
	
	stop();
	
});

test("JINDOSUS-882 - Timer 안에서 Exception 발생시 타이머 중단 되어야 함", function() {
	
	var oTimer = new jindo.Timer();
	var count = 0;

	window.onerror = function() { return true; };
	
	oTimer.start(function() {
		count++;
		throw new Error("테스트를 위해서 정상적으로 나는 에러");
	}, 0);

	stop();
	setTimeout(function() {
		equal(count, 1, "타이머 반복되지 않아야 함");
		start();		
	}, 100);
	
});
