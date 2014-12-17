/**
	@fileOverview 목록을 순환이동하는 롤링 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/
/**
	jindo.CircularRolling 컴포넌트는 리스트의 아이템을 무한대로 순환하여 이동시키는 롤링 컴포넌트이다.
	
	@class jindo.CircularRolling
	@extends jindo.Rolling
	@keyword rolling, circular, 롤링, 순환, 회전
**/
jindo.CircularRolling = jindo.$Class({
	/**
		@constructor
		@param {String | HTMLElement} el 리스트를 감싸고 있는 엘리먼트의 id 혹은 엘리먼트 자체  
		@param {Object} [htOption] 옵션객체
			@param {Number} [htOption.nFPS=50] 초당 롤링 이동을 표현할 프레임수
			@param {Number} [htOption.nDuration=800] transition이 진행 될 시간, 단위 ms
			@param {String} [htOption.sDirection="horizontal"] 롤링의 방향 설정.
			<ul>
				<li>"horizontal" : 가로</li>
				<li>"vertical" : 세로</li>
			</ul>
			@param {Function} [htOption.fEffect=jindo.Effect.linear] jindo.Effect 이펙트 함수
			@param {String} [htOption.sClassPrefix="rolling-"] 초기 HTML/CSS구조에서 필요한 className 앞에 붙는 prefix를 정의
		@example
			var oCircularRolling = new jindo.CircularRolling(jindo.$("rolling"), {
				sDirection : "vertical"
			});
	**/
	$init : function() {
		this.refresh();
	},
	
	/**
		롤링 컴포넌트를 다시 로드한다. 리스트가 갱신되었을때 호출하여야한다.
		
		@method refresh
		@return {this} 리스트를 갱신한 인스턴스 자신
	**/
	refresh : function() {
		this.getTransition().abort();
		this._el[this._oKeys.scrollLeft] = 0;
		this._nDuplicateCount = 0;
		this._nItemCount = this.getItems().length;
		this._nDisplayedCount = this.getDisplayedItemCount();
		if (this.isOverflowed()) {
			this._nDuplicateCount = (this._nDisplayedCount <= (this._nItemCount / 2)) ? 1 : 2;
			this._duplicate(this._nDuplicateCount);
		}
		return this;
	},
	
	_duplicate : function(n) {
		var elList = this._elList,
			elDuplicatedList = jindo.$('<' + elList.tagName + '>'),
			sListInnerHTML = elList.innerHTML,
			aItem;

		var sItemClassQuery = '>' + (this._bUsedClassPrefix ? '.' + this.option('sClassPrefix') + 'item' : 'li');
		
		for (var i = 0; i < n; i++) {
			elDuplicatedList.innerHTML = sListInnerHTML;
			aItem = jindo.$$(sItemClassQuery, elDuplicatedList);
			for (var j = 0; j < aItem.length; j++) {
				elList.appendChild(aItem[j]);
			}
		}
	},
	
	_setStartPosition : function(n, nTo) {
		var oKeys = this._oKeys;
		var nNewPosition = n % (this._nItemCount) || 0;
		if (n + nTo < 0) {
			var nTimes = this._nDuplicateCount;
			if (nNewPosition + this._nDisplayedCount > this._nItemCount) {
				nTimes -= 1;
			} 
			nNewPosition += this._nItemCount * nTimes;
		}
		this._el[oKeys.scrollLeft] = this._getPosition(nNewPosition);
	},
	
	/**
		현재 위치와 n만큼 떨어진 아이템으로 이동한다. 
		롤링이 진행중일때에는 이동되지 않고 false를 리턴한다.
		
		@method moveBy
		@param {Number} n 얼마나 떨어진 아이템으로 이동할지 (음수와 양수 모두 사용 할 수 있음)
		@return {Boolean} 이동 성공 여부
	**/
	moveBy : function(n) {
		if (this.isMoving()) {
			return false;
		}
		
		/*
		if (Math.abs(n) > this._nDisplayedCount) {
			if (n > 0) {
				n = this._nDisplayedCount;
			} else {
				n = -this._nDisplayedCount;
			}
		}
		*/
		
		var bBig = (n >= this._nItemCount);
		
		n = n % this._nItemCount;
		if (bBig) { n += this._nItemCount; }
		
		this._setStartPosition(this.getIndex(), n);
		
		var nTarget = this.getIndex() + n;
		if (!this._move(nTarget)) {
			return false;
		}
		return true;
	}

}).extend(jindo.Rolling);
