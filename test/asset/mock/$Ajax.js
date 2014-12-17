// Mock Ajax Start
jindo.$Ajax = function(sUrl, oOptions) {
	if (jindo === this) { return new jindo.$Ajax(sUrl, oOptions); }
	this._sUrl = sUrl; 
	this._oOptions = oOptions;
};

jindo.$Ajax.prototype.request = function() {

	var self = this;

	setTimeout(function() {
		
		var oRes = {
			json : function() {
				return jindo.$Ajax.mockResponse[self._sUrl];
			}
		};
		
		self._oOptions.onload(oRes);

	}, 0);
	
};

jindo.$Ajax.mockResponse = {};
// Mock Ajax End
