/**
 * @fileoverview
 * jindo.Timer를 사용하여서 Timeline을 보여주는 샘플입니다. 
 */
var TimerPlayer = jindo.$Class({
	/**
	 * @property {Number} 플레이가 될 시간을 보여줍니다.
	 */
	PLAY_TIME: 320, 
	
	/**
	 * @constructor
	 */
	$init: function() {
		/**
		 * @property {Boolean} TimerPlay가 play 되고 있는 지 여부를 리턴합니다.
		 */
		this._isPlaying = false;
		
		/**
		 * @property {Number} 현재까지 진행된 시간을 저장합니다.
		 */
		this._nCurrentTime = 0;
		
		/**
		 * @property {jindo.Timer} Timer 객체를 저장합니다.
		 */
		this._oTimer = null;
		
		/**
		 * @property {jindo.$Element} play/stop 을 보여주는 버튼입니다.
		 */
		this._welButton = jindo.$Element(jindo.$$.getSingle(".buttons"));
		
		/**
		 * @property {jindo.$Element} progressbar를 보여주는 엘리먼트입니다.
		 */
		this._welForeground = jindo.$Element(jindo.$$.getSingle(".foreground"));
		
		jindo.$Fn(this.onclick, this).attach(this._welButton.$value(), "click");
	}, 

	/**
	 * Button이 눌렸을 때 호출되며 현재 play 중 인지를 체크하여 paly 또는
	 * stop을 호출합니다. 
	 */
	onclick: function() {
		if( this._isPlaying ) {
			this.stop();
		} else {
			this.play();
		}
	},

	/**
	 * progress bar를 진행시킵니다. 
	 * 1. Timer가 없는 경우에는 Timer를 생성한 다음 start()를 호출하여 play 
	 * 시간까지 반복적으로 실행하도록 하며 play 시간을 넘은 경우에는 종료
	 * 시킵니다.
	 * 2. Timer가 생성되어 있는 경우에는 resume()을 호출하여서 멈춘 Timer를
	 * 다시 실행시킵니다.
	 * 3. play 버튼을 pause 형태로 변경시킵니다.
	 */
	play: function() {
		this._isPlaying = true;
		
		if( this._oTimer === null ) {
			this._oTimer = new jindo.Timer().attach({
				run: jindo.$Fn(this.run, this).bind(),
				end: jindo.$Fn(this.finish, this).bind()
			});

			var self = this; 
			this._oTimer.start(function() {
				if( self._nCurrentTime < self.PLAY_TIME ) {
					return true;
				} else {
					return false;
				}
			}, 20);
		} else {
			this._oTimer.resume();
		}
		this._welButton.css("backgroundPosition", "-12px 0px");
	},

	/**
	 * Player를 중지시킵니다. 
	 */
	stop: function() {
		this._isPlaying = false;

		this._oTimer.pause();
		this._welButton.css("backgroundPosition", "0px 0px");
	}, 

	/**
	 * Player가 진행 중일 때 (100ms마다 호출될 때) 초록색 바가 진행되도록
	 * 변경해줍니다. 
	 */
	run: function() {
		this._nCurrentTime = this._welForeground.width() + 1;
		this._welForeground.css("width",  this._nCurrentTime + "px");
	},

	finish: function() {
		this._nCurrentTime = 0;
		this._isPlaying = false;
		this._oTimer = null;
		
		this._welForeground.css("width", "0px");
		this._welButton.css("backgroundPosition", "0px 0px");
	}
});