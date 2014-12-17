if (typeof mock === 'undefined') mock = {};

mock.$Event = function(oInfo) {
	
	if (this === mock) {
		return new mock.$Event(oInfo);
	}
	
	var oProp = this._prop = {
		key : {},
		pos : {},
		mouse : {}
	};
	
	oProp.key.alt = oProp.key.ctrl = oProp.key.down = oProp.key.enter = oProp.key.esc =
	oProp.key.meta = oProp.key.shift = oProp.key.up = oProp.key.left = oProp.key.right = false;
	
	oProp.pos.pageX = oProp.pos.pageY = oProp.pos.clientX = oProp.pos.clientY =
	oProp.pos.offsetX = oProp.pos.offsetY = oProp.pos.layerX = oProp.pos.layerY = 0;
	
	oProp.mouse.left = oProp.mouse.right = oProp.mouse.middle = false;
	oProp.mouse.delta = 0;
	
	for (var k in oInfo) {
		
		var v = oInfo[k];
		
		switch (k) {
		case 'left': case 'right':
			oProp.key[k] = oProp.mouse[k] = v;
			break;
			
		case 'alt': case 'ctrl': case 'down': case 'enter': case 'esc': case 'keyCode': case 'meta': case 'shift': case 'up':
			oProp.key[k] = v;
			break;
			
		case 'delta': case 'middle':
			oProp.mouse[k] = v;
			break;
			
		case 'pageX': case 'pageY':
		case 'clientX': case 'clientY':
		case 'offsetX': case 'offsetY':
		case 'layerX': case 'layerY': // deprecated
			oProp.pos[k] = v;
			break;
			
		case 'element': case 'currentElement': case 'relatedElement': case 'type':
			this[k] = v;
			break;
		}

	}
	
};

mock.$Event.prototype.$value = function() {
	return null;
};

mock.$Event.prototype.key = function() { return this._prop.key || {}; };
mock.$Event.prototype.mouse = function() { return this._prop.mouse || {}; };
mock.$Event.prototype.pos = function() { return this._prop.pos || {}; };

mock.$Event.prototype.stop = mock.$Event.prototype.stopBubble = mock.$Event.prototype.stopDefault = function() { };

(function() {
	
	var oLists = {};
		
	mock.setEventHandler = function(sType, fpFunc) {
		oLists[sType] = fpFunc;
	};
	
	jindo.$Element.prototype.mock_fireEvent = function(sType, oInfo) {
		
		oInfo = oInfo || {};
		
		oInfo.key = oInfo;
		oInfo.mouse = oInfo;
		oInfo.pos = oInfo;
		
		oInfo.type = sType;
		oInfo.element = this.$value();
		
		var mockEvent = mock.$Event(oInfo);
		var fpFunc = oLists[sType];
		
		if (fpFunc) { fpFunc(mockEvent); }
		
	};
	
})();