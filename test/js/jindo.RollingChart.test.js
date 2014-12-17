module("", {
	setup : function() {

		this.oldHTML = jindo.$('rolling_chart').innerHTML;
		this.oInst = new jindo.RollingChart(jindo.$('rolling_chart'), {
			nDuration : 50, //롤링될 시간
			nRollingInterval : 10, //각 롤링간의 시간간격
			sUrl : "URL1", //요청 url
			sRequestType : "jsonp", //요청타입
			sRequestMethod : "get", //요청방식
			htRequestParameter : { p : 3 }, //요청 파라메터
			nRequestInterval : 1000 //새로운 목록을 가져올 시간 간격 (ms)
		});
	
	},

	teardown : function() {

		this.oInst.deactivate();
		jindo.$('rolling_chart').innerHTML = this.oldHTML;

	}
});

test("롤링되어 변화하는지", function(){

	var self = this;

	jindo.$Ajax.mockResponse['URL1'] = {
		items:[
			'첫번째',
			'두번째',
			'세번째'
		]
    }; 
		
	equal(
		jindo.$Element('rolling_chart').text().replace(/[\n\s]/g, ''),
		'1.서든어택2.던전앤파이터3.아이온:영원의탑'
	);

	stop();
	setTimeout(function() {
		equal(
			jindo.$Element('rolling_chart').text().replace(/[\n\s]/g, ''),
			'1.첫번째2.두번째3.세번째'
		);

		self.oInst.deactivate();
		self.oInst.activate();

		jindo.$Ajax.mockResponse['URL1'] = {
			items:[
				'하나',
				'둘',
				'셋'
			]
	    }; 
				
		setTimeout(function() {
			equal(
				jindo.$Element('rolling_chart').text().replace(/[\n\s]/g, ''),
				'1.하나2.둘3.셋'
			);
			start();
		}, 1500);

	}, 1500);
	
});

test("this.oInst.getItems ", function(){

	var aLists = this.oInst.getItems();
	equal(aLists.length, 3, '갯수 확인');

	equal(aLists[0].tagName.toLowerCase(), 'li');
	equal(aLists[1].tagName.toLowerCase(), 'li');
	equal(aLists[2].tagName.toLowerCase(), 'li');

	equal(this.oInst.getListOfItem(aLists[0]).tagName.toLowerCase(), 'ul');
	equal(this.oInst.getListOfItem(aLists[1]).tagName.toLowerCase(), 'ul');
	equal(this.oInst.getListOfItem(aLists[2]).tagName.toLowerCase(), 'ul');

});
