var oStarRating = new jindo.StarRating(jindo.$("star_rating"), {
	nStep : 1,
	nMaxValue : 10,
	nDefaultValue : 4,
	bSnap : true
}).attach({
	move : function(oCustomEvent) {
	},
	set : function(oCustomEvent) {
	},
	out : function() {
	}
});

module("", {
	setup : function() {
	}
});
test("getBaseElement()", function(){
	ok(oStarRating.getBaseElement() === jindo.$("star_rating"), "getBaseElement()는 기준 엘리먼트를 리턴한다.");
});
test("getRatingElement()", function(){
	ok(oStarRating.getRatingElement() === jindo.$$.getSingle("span", jindo.$("star_rating")), "getRatingElement()는 기준 엘리먼트아래 span 엘리먼트를 리턴한다.");
});
test("getValueByWidth()", function(){
	oStarRating._welRatingElement.css("width", "50px");
	ok(oStarRating.getValueByWidth() === 50 / parseInt(oStarRating._wel.css("width"), 10) * oStarRating.option("nMaxValue"), "getValueByWidth()는 기준 엘리먼트 가로폭 대비 RatingElement 가로폭 비율에 nMaxValue 값을 곱한 값을 리턴한다.");
});
test("getValueToBeSet()", function(){
	ok(oStarRating.getValueToBeSet(5.1) === 5, "getValueToBeSet()은 nStep 옵션에 의해 변환된 실제로 설정될 값을 리턴한다.");
});
test("getValue() / setValue() / reset()", function(){
	oStarRating.setValue(0);
	ok(oStarRating.getValue() === 0, "getValue()는 현재 설정된 값을 리턴한다.");
	oStarRating.setValue(9.9);
	ok(oStarRating.getValue() === 10, "setValue(9.9); 이후 getValue()는 10을 리턴한다.");
	oStarRating.reset();
	ok(oStarRating.getValue() === oStarRating.option("nDefaultValue"), "reset(); 이후 getValue()는 nDefaultValue 값을 리턴한다.");
});
test("mouseover, move, click, out", function() {
	oStarRating._wel.fireEvent("mousemove", {
		clientX:15,
		clientY:15
	});
	oStarRating._wel.fireEvent("mousemove", {
		clientX:55,
		clientY:15
	});
	oStarRating._wel.fireEvent("click");
	oStarRating._onMouseLeave(); // fireEvent("mouseleave") on IE
	ok(true);
});
test("activate() / deactivate()", function() {
	oStarRating.deactivate();
	ok(!oStarRating.isActivating(), "deactivate() 메소드 수행후 isActivate()는 false를 리턴한다.");
	oStarRating.activate();
	ok(oStarRating.isActivating(), "activate() 메소드 수행후 isActivate()는 true를 리턴한다.");
});
