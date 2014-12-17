module("static methods", {
	setup : function() {
	}
});
test("jindo.Canvas.create()", function(){
	var elCanvas = jindo.Canvas.create();
	ok(elCanvas.tagName.toLowerCase() === "canvas", "jindo.Canvas.create()는 캔버스엘리먼트를 생성한다.");
	ok(elCanvas.width === 300, "디폴트 width 값은 300이다.");
	ok(elCanvas.height === 150, "디폴트 height 값은 150이다.");
});
test("jindo.Canvas.create(200, 200, jindo.$(\"ui\"))", function(){
	var elCanvas = jindo.Canvas.create(200, 200, jindo.$("ui"));
	ok(elCanvas.tagName.toLowerCase() === "canvas", "jindo.Canvas.create(200, 200, jindo.$(\"ui\"))는 캔버스엘리먼트를 생성한다.");
	ok(elCanvas.parentNode === jindo.$("ui"), "캔버스 엘리먼트의 부모노드는 jindo.$(\"ui\")다.");
	ok(elCanvas.width === 200, "width 값은 200이다.");
	ok(elCanvas.height === 200, "height 값은 200이다.");
	jindo.$Element(elCanvas).leave();
});
test("jindo.Canvas.getContext()", function(){
	var elCanvas = jindo.Canvas.create();
	ok(elCanvas.tagName.toLowerCase() === "canvas", "jindo.Canvas.create()는 캔버스엘리먼트를 생성한다.");
	ok(typeof elCanvas.getContext === "function", "캔버스엘리먼트는 getContext() 메서드를 가진다.");
	ok(typeof jindo.Canvas.getContext(elCanvas) === "object", "jindo.Canvas.getContext() 메서드는 컨텍스트 객체를 리턴한다.");
});

module("init", {
	setup : function() {
		this.elCanvas = jindo.Canvas.create(200, 200, jindo.$("ui"));
	},
	teardown : function() {
		jindo.$Element(this.elCanvas).leave();
	}
});
test("new jindo.Canvas()", function(){
	var oCanvas = new jindo.Canvas();
	ok(oCanvas instanceof (jindo.Canvas), "new jindo.Canvas()는 jindo.Canvas 인스턴스를 생성한다."); 
});

test("new jindo.Canvas(elCanvas)", function(){
	var oCanvas = new jindo.Canvas(this.elCanvas);
	ok(oCanvas instanceof (jindo.Canvas), "new jindo.Canvas()는 jindo.Canvas 인스턴스를 생성한다."); 
});

module("instance methods", {
	setup : function() {
		this.elCanvas = jindo.Canvas.create(200, 200, jindo.$("ui"));
		this.oCanvas = new jindo.Canvas(this.elCanvas);
	},
	teardown : function() {
		jindo.$Element(this.elCanvas).leave();
	}
});
test("getElement()", function(){
	ok(this.oCanvas.getElement() === this.elCanvas, "getElement()는 캔버스 엘리먼트를 리턴한다.");
});
test("getContainer()", function(){
	ok(this.oCanvas.getContainer() === this.elCanvas.parentNode, "getContainer()는 캔버스 엘리먼트의 부모노드를 리턴한다.");
});
test("width()", function(){
	ok(this.oCanvas.width() === 200, "width()는 캔버스 엘리먼트의 너비를 구한다.");
	ok(this.oCanvas.width(400) === this.oCanvas, "width(400)은 캔버스 엘리먼트의 너비를 변경하고 this를 리턴한다.");
	ok(this.oCanvas.width() === 400, "width()는 캔버스 엘리먼트의 너비를 구한다.");
});
test("height()", function(){
	ok(this.oCanvas.height() === 200, "height()는 캔버스 엘리먼트의 높이를 구한다.");
	ok(this.oCanvas.height(400) === this.oCanvas, "height(400)은 캔버스 엘리먼트의 높이를 변경하고 this를 리턴한다.");
	ok(this.oCanvas.height() === 400, "height()는 캔버스 엘리먼트의 높이를 구한다.");
});
test("getContext()", function(){
	ok(typeof this.oCanvas.getContext() === "object", "getContext() 메서드는 컨텍스트 객체를 리턴한다.");
});

module("draw methods", {
	setup : function() {
		this.elCanvas = jindo.Canvas.create(200, 200, jindo.$("ui"));
		this.oCanvas = new jindo.Canvas(this.elCanvas);
	}
});
test("drawLine()", function(){
	this.oCanvas.drawLine([[10, 10], [110, 10]], { lineWidth : 1, strokeStyle : "rgb(255, 0, 0)" }, true);
	this.oCanvas.drawLine([[10, 30], [110, 30]], { lineWidth : 1, strokeStyle : "rgb(0, 0, 0)" }, false);
	this.oCanvas.drawLine([[10, 50], [110, 50], [160, 100]], { lineWidth : 1, strokeStyle : "rgb(255, 0, 0)" });
	this.oCanvas.drawLine([[10, 70], [110, 70], [160, 120]], { lineWidth : 1, strokeStyle : "rgb(0, 0, 0)" }, false);
	this.oCanvas.drawLine([[10, 90], [10, 130]], { lineWidth : 1, strokeStyle : "rgb(0, 0, 0)" }, true);
	this.oCanvas.drawLine([[30, 90], [30, 130]], { lineWidth : 1, strokeStyle : "rgb(0, 0, 0)" }, false);
	ok(true);
});
test("drawFace()", function(){
	this.oCanvas.drawFace([[10, 10], [110, 10], [110, 30], [10, 30], [10, 10]], { fillStyle : "rgb(255, 0, 0)" });
	ok(true);
});
test("drawRect()", function(){
	this.oCanvas.drawRect(10, 10, 50, 50, { fillStyle : "rgb(150, 150, 150)" });
	this.oCanvas.drawRect(10, 70, 50, 50, { fillStyle : "rgb(150, 150, 150)", lineWidth : 1, strokeStyle : "rgb(0, 0, 0)"});
	this.oCanvas.drawRect(70, 70, 50, 50, { fillStyle : "rgb(150, 150, 150)", lineWidth : 1, strokeStyle : "rgb(0, 0, 0)"}, false);
	ok(true);
});
test("clear()", function(){
	this.oCanvas.drawRect(10, 10, 50, 50, { fillStyle : "rgb(150, 150, 150)" });
	this.oCanvas.clear();
	ok(true);
});
