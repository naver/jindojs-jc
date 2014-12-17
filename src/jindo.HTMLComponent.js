/**
	@fileOverview HTML 컴포넌트를 구현하기 위한 코어 클래스
	@version #__VERSION__#
**/
/**
	HTML 컴포넌트에 상속되어 사용되는 jindo.UIComponent.js
	
	@class jindo.HTMLComponent
	@extends jindo.UIComponent
	
	@keyword component, base, core, html
**/
jindo.HTMLComponent = jindo.$Class({
	/** @lends jindo.HTMLComponent.prototype */
	sTagName : "",
	
	/**
		jindo.HTMLComponent를 초기화한다.
		@constructor
	**/
	$init : function() {
	},
	
	/**
		컴포넌트를 새로 그려준다.
		상속받는 클래스는 반드시 _onPaint() 메서드가 정의되어야 한다.
		
		@method paint
		@return {this}
	**/
	paint : function() {
		this._onPaint();
		return this;
	},
	
	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {

		(this.constructor._aInstances = this.constructor._aInstances || []).push(this);

	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		
		var aInstances = this.constructor._aInstances || [];
		var nIndex = jindo.$A(aInstances).indexOf(this);
		
		if (nIndex > -1) { aInstances.splice(nIndex, 1); }
		
	}

}).extend(jindo.UIComponent);

/**
	다수의 컴포넌트의 paint 메서드를 일괄 수행하는 Static Method
	
	@method paint
	@static
**/
jindo.HTMLComponent.paint = function() {
	var aInstance = this._aInstances || [];
	for (var i = 0, oInstance; (oInstance = aInstance[i]); i++) {
		oInstance.paint();
	}
};

/**
	컴포넌트의 생성된 인스턴스를 리턴한다.
	
	@method getInstance
	@static
	
	@return {Array} 생성된 인스턴스의 배열
**/
jindo.HTMLComponent.getInstance = function(){
	return this._aInstances || [];
};