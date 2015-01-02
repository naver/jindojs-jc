module("", {
	setup : function() {
		this.oldHTML = jindo.$('layer').innerHTML;
		this.oInst = new jindo.Calendar('layer');
	},
	teardown : function() {
		this.oInst.deactivate();
		jindo.$('layer').innerHTML = this.oldHTML;
	}
});

test("오늘날짜", function(){

	var wdToday = jindo.$Date(new Date());

	equal(jindo.$$.getSingle('.calendar-title').innerHTML, wdToday.format('Y-m'));
	equal(jindo.$$.getSingle('.calendar-today').innerHTML, String(wdToday.date()), '오늘 날짜 제대로 선택되어 있는지');

	equal(this.oInst.getToday().nYear, wdToday.year());
	equal(this.oInst.getToday().nMonth, wdToday.month() + 1);
	equal(this.oInst.getToday().nDate, wdToday.date());

	this.oInst.setToday(1980, 9, 29);

	equal(this.oInst.getToday().nYear, 1980);
	equal(this.oInst.getToday().nMonth, 9);
	equal(this.oInst.getToday().nDate, 29);

	this.oInst.draw(1980, 9);

	equal(jindo.$$.getSingle('.calendar-title').innerHTML, '1980-09');
	equal(jindo.$$.getSingle('.calendar-today').innerHTML, '29', '오늘 날짜 제대로 선택되어 있는지');

});

test("jindo.Calendar.getDateHashTable", function() {

	var oDate = new Date();
	oDate.setTime(Date.parse('2012/12/30'));

	deepEqual(jindo.Calendar.getDateHashTable(oDate), {
		nYear : 2012,
		nMonth : 12,
		nDate : 30
	});

});

// don't test due to various envirments.
// test("jindo.Calendar.getTime", function(){
// 	equal(jindo.Calendar.getTime({
// 		nYear : 2001,
// 		nMonth : 3,
// 		nDate : 2
// 	}), 983458800000);
// });

test("jindo.Calendar.getFirstDay / getLastDay / getLastDate", function(){
	equal(jindo.Calendar.getFirstDay(2011, 1), 6);
	equal(jindo.Calendar.getLastDay(2011, 2), 1);
	equal(jindo.Calendar.getLastDate(2011, 3), 31);
});

test("jindo.Calendar.getWeeks", function(){
	equal(jindo.Calendar.getWeeks(2011, 1), 6);
	equal(jindo.Calendar.getWeeks(2011, 2), 5);
	equal(jindo.Calendar.getWeeks(2011, 3), 5);
});

test("jindo.Calendar.getRelativeDate", function(){
	deepEqual(jindo.Calendar.getRelativeDate(1, 0, 0, {nYear:2000, nMonth:1, nDate:1}), {nYear:2001, nMonth:1, nDate:1});
	deepEqual(jindo.Calendar.getRelativeDate(0, 0, -1, {nYear:2010, nMonth:1, nDate:1}), {nYear:2009, nMonth:12, nDate:31});
});

test("jindo.Calendar.isValidDate", function(){
	equal(jindo.Calendar.isValidDate(1980, 9, 31), false);
	equal(jindo.Calendar.isValidDate(1980, 2, 29), true);
	equal(jindo.Calendar.isValidDate(1980, 2, 30), false);
	equal(jindo.Calendar.isValidDate(1981, 2, 28), true);
	equal(jindo.Calendar.isValidDate(1981, 2, 29), false);
	equal(jindo.Calendar.isValidDate(1981, 2, 30), false);
});

test("jindo.Calendar.isPast / isFuture / isSameDate / isBetween", function(){

	equal(jindo.Calendar.isPast({
		nYear : 2000,
		nMonth : 1,
		nDate : 1
	}, {
		nYear : 2001,
		nMonth : 3,
		nDate : 2
	}), true);

	equal(jindo.Calendar.isFuture({
		nYear : 2000,
		nMonth : 1,
		nDate : 1
	}, {
		nYear : 2001,
		nMonth : 3,
		nDate : 2
	}), false);

	equal(jindo.Calendar.isPast({
		nYear : 2010,
		nMonth : 5,
		nDate : 1
	}, {
		nYear : 2001,
		nMonth : 3,
		nDate : 2
	}), false);

	equal(jindo.Calendar.isFuture({
		nYear : 2010,
		nMonth : 5,
		nDate : 1
	}, {
		nYear : 2001,
		nMonth : 3,
		nDate : 2
	}), true);

	equal(jindo.Calendar.isSameDate({
		nYear : 2010,
		nMonth : 5,
		nDate : 1
	}, {
		nYear : 2010,
		nMonth : 5,
		nDate : 1
	}), true);

	equal(jindo.Calendar.isSameDate({
		nYear : 2010,
		nMonth : 5,
		nDate : 1
	}, {
		nYear : 2010,
		nMonth : 4,
		nDate : 31
	}), true);

	equal(jindo.Calendar.isBetween({
		nYear : 2010,
		nMonth : 5,
		nDate : 10
	}, {
		nYear : 2010,
		nMonth : 4,
		nDate : 30
	}, {
		nYear : 2010,
		nMonth : 5,
		nDate : 31
	}), true);

	equal(jindo.Calendar.isBetween({
		nYear : 2010,
		nMonth : 6,
		nDate : 1
	}, {
		nYear : 2010,
		nMonth : 4,
		nDate : 30
	}, {
		nYear : 2010,
		nMonth : 5,
		nDate : 31
	}), false);

});
