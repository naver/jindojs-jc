/**
    @fileOverview Calendar 컴포넌트를 사용하여 Text Input Control에 특정 형식의 날짜입력을 클릭만으로 입력할 수 있게 하는 컴포넌트
    @version #__VERSION__#
**/

/**
    Calendar 컴포넌트를 통해 출력된 달력의 날짜 선택으로 Input의 값을 입력한다.
    
    @class jindo.DatePicker
    @extends jindo.UIComponent
    @uses jindo.Calendar
    @uses jindo.LayerManager
    @uses jindo.LayerPosition
    
    @keyword input, date, picker, 달력, 날짜, 선택 
**/

jindo.DatePicker = jindo.$Class({
    /** @lends jindo.DatePicker.prototype */
    
    _aDatePickerSet : null,
    _htSelectedDatePickerSet : null, //클릭된 엘리먼트에 대한 DatePickerSet
    
    /**
        DatePicker 컴포넌트를 초기화한다.
        
        @constructor
        @param {HTMLElement} elCalendarLayer 달력을 출력할 레이어 엘리먼트 혹은 id 
        @param {Object} [htOption] 초기화 옵션 설정을 위한 객체.
            @param {Boolean} [htOption.bUseLayerPosition=true] LayerPosition을 사용해서 포지셔닝을 할지 여부
            @param {Object} [htOption.Calendar] jindo.Calendar 를 위한 옵션
            @param {Object} [htOption.LayerManager] jindo.LayerManager 를 위한 옵션
            @param {Object} [htOption.LayerPosition] jindo.LayerPosition 을 위한 옵션
    **/ 
    $init : function(elCalendarLayer, htOption) {
        var oDate = new Date();
        this.option({
            bUseLayerPosition : true, //LayerPosition을 사용해서 포지셔닝을 할지의 여부
            
            Calendar : { //Calendar를 위한 옵션
                sClassPrefix : "calendar-", //Default Class Prefix
                nYear : oDate.getFullYear(),
                nMonth : oDate.getMonth() + 1,
                nDate : oDate.getDate(),            
                sTitleFormat : "yyyy-mm", //달력의 제목부분에 표시될 형식
                aMonthTitle : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] //월 이름
            },
            
            LayerManager : { //LayerManager를 위한 옵션
                sCheckEvent : "click",
                nShowDelay : 0, 
                nHideDelay : 0
            },
            
            LayerPosition : { //LayerPosition을 위한 옵션
                sPosition: "outside-bottom",
                sAlign: "left",
                nTop: 0,
                nLeft: 0,
                bAuto: false
            }
        });
        this.option(htOption);
        
        this._aDatePickerSet = [];
        this._elCalendarLayer = jindo.$(elCalendarLayer);
        this._initCalendar();
        this._initLayerManager();
        this._initLayerPosition();  
        
        this._wfFocusInput = jindo.$Fn(this._onFocusInput, this);
        this._wfClickLinkedElement = jindo.$Fn(this._onClickLinkedElement, this);
        this._wfMouseOverDate = jindo.$Fn(this._onMouseOverDate, this);
        this._wfMouseOutDate = jindo.$Fn(this._onMouseOutDate, this);
        this._wfClickDate = jindo.$Fn(this._onClickDate, this);

        var welCalendarLayer = jindo.$Element(this._elCalendarLayer);
        if (isNaN(welCalendarLayer.css('zIndex')*1)) {
            welCalendarLayer.css('zIndex', 1);
        }
        
        this.activate(); //컴포넌트를 활성화한다.
    },
    
    /**
        DatePicker 세트를 추가한다.
        
        @method addDatePickerSet
        @param {Object} ht DatePicker 세트 옵션
        @param {HTMLElement} ht.elInput 날짜가 입력될 input 엘리먼트
        @param {HTMLElement} ht.elButton input외에도 달력을 보이게 할 엘리먼트
        @param {HTMLElement} ht.elLayerPosition LayerPosition 컴포넌트로 자동으로 위치 조절시 기준이 되는 엘리먼트 (생략시 elInput이 디폴트)
        @param {Object} [ht.htOption] 추가옵션
            @param {Number} [ht.htOption.nYear=현재년] 기본으로 설정될 연도
            @param {Number} [ht.htOption.nMonth=현재월] 기본으로 설정될 월
            @param {Number} [ht.htOption.nDate=현재일] 기본으로 설정될 일
            @param {Boolean} [ht.htOption.bDefaultSet=true] true이면 기본 Input 값을 설정한다. false이면 설정하지 않는다.
            @param {Boolean} [ht.htOption.bReadOnly=true] true이면 input에 직접 값을 입력하지 못한다.
            @param {String} [ht.htOption.sDateFormat="yyyy-mm-dd"] input에 입력될 날짜의 형식
            @param {Object} [ht.htOption.htSelectableDateFrom] 선택가능한 첫 날짜
                @param {Number} [ht.htOption.htSelectableDateFrom.nYear=1900] 년도
                @param {Number} [ht.htOption.htSelectableDateFrom.nMonth=1] 월
                @param {Number} [ht.htOption.htSelectableDateFrom.nDate=1] 일
            @param {Object} [ht.htOption.htSelectableDateTo] 선택가능한 마지막 날짜
                @param {Number} [ht.htOption.htSelectableDateTo.nYear=2100] 년도
                @param {Number} [ht.htOption.htSelectableDateTo.nMonth=12] 월
                @param {Number} [ht.htOption.htSelectableDateTo.nDate=31] 일
        @return {this} 지정한 DatePicker 세트를 추가한 인스턴스 자신
        @example
            oDatePicker.addDatePickerSet({
                elInput : jindo.$("input"), //날짜가 입력될 input 엘리먼트
                elButton : jindo.$("button"), //input외에도 달력을 보이게 할 엘리먼트
                elLayerPosition : jindo.$("input"), //LayerPosition 컴포넌트로 자동으로 위치 조절시 기준이 되는 엘리먼트 (생략시 elInput이 디폴트)
                htOption : {
                    nYear : 1983, //기본으로 설정될 연도
                    nMonth : 5, //기본으로 설정될 월
                    nDate : 12, //기본으로 설정될 일
                    
                    bDefaultSet : true, //true이면 기본 Input 값을 설정한다. false이면 설정하지 않는다.
                    bReadOnly : true, //true이면 input에 직접 값을 입력하지 못한다.
                    sDateFormat : "yyyy-mm-dd", //input에 입력될 날짜의 형식
                    htSelectableDateFrom : { //선택가능한 첫 날짜
                        nYear : 1900,
                        nMonth : 1,
                        nDate : 1               
                    },
                    htSelectableDateTo : { //선택가능한 마지막 날짜
                        nYear : 2100,
                        nMonth : 12,
                        nDate : 31
                    }
                }
            });
    **/
    addDatePickerSet : function(ht) {
        var htOption = this.option(),
            htCalendarOption = this.getCalendar().option(),
            htDefaultOption = {
                nYear : htCalendarOption.nYear,
                nMonth : htCalendarOption.nMonth,
                nDate : htCalendarOption.nDate,
                bDefaultSet : true,
                bReadOnly : true, //true이면 input에 직접 값을 입력하지 못한다.
                sDateFormat : "yyyy-mm-dd", //input에 입력될 날짜의 형식
                htSelectableDateFrom : { //선택가능한 첫 날짜
                    nYear : 1900,
                    nMonth : 1,
                    nDate : 1               
                },
                htSelectableDateTo : { //선택가능한 마지막 날짜
                    nYear : 2100,
                    nMonth : 12,
                    nDate : 31
                }
            };
            
        if (typeof ht.htOption != "undefined") {
            //빈 값은 기본 값으로 셋팅해줌.
            for (var value in ht.htOption) {
                if (typeof htDefaultOption[value] != "undefined") {
                    htDefaultOption[value] = ht.htOption[value]; 
                }
            }
        }   
        ht.htOption = htDefaultOption;
        
        this._aDatePickerSet.push(ht);
        
        var oLayerManager = this.getLayerManager();
        if (typeof ht.elInput != "undefined") {
            oLayerManager.link(ht.elInput);
            if (ht.htOption.bReadOnly) {
                ht.elInput.readOnly = true;
            }
            this._wfFocusInput.attach(ht.elInput, "focus");
            this._wfClickLinkedElement.attach(ht.elInput, "click");
        }
        
        if (typeof ht.elButton != "undefined") {
            oLayerManager.link(ht.elButton);
            this._wfClickLinkedElement.attach(ht.elButton, "click");
        }
        
        if (ht.htOption.bDefaultSet) {
            this._setDate(ht, ht.htOption);
        }
        return this;    
    },
    
    /**
        DatePicker 세트를 제거한다.
        
        @method removeDatePickerSet
        @param {Object} ht 삭제할 DatePicker 세트
            @param {HTMLElement} ht.elInput 해당 DatePicker 세트의 input 엘리먼트
            @param {HTMLElement} [ht.elButton] 해당 DatePicker 세트의 달력을 보이게 하는 엘리먼트
        @return {this} 지정한 DatePicker 세트를 제거한 인스턴스 자신 
        @example
            oDatePicker.removeDatePickerSet({
                elInput : jindo.$("input"), // 삭제할 DatePicker 세트의 input 엘리먼트
                elButton : jindo.$("button") // 삭제할 DatePicker 세트의 달력을 보이게 하는 엘리먼트
            })
    **/
    removeDatePickerSet : function(ht) {
        var nIndex = -1;
        for (var i = 0, len = this._aDatePickerSet.length ; i < len; i++) {
            if (this._aDatePickerSet[i].elInput == ht.elInput || this._aDatePickerSet[i].elButton == ht.elButton) {
                nIndex = i;
                break;              
            }
        }
        
        var htDatePickerSet = this._aDatePickerSet[nIndex];
        var oLayerManager = this.getLayerManager();
        if (typeof htDatePickerSet.elButton != "undefined") {
            oLayerManager.unlink(htDatePickerSet.elButton);
            this._wfClickLinkedElement.detach(htDatePickerSet.elButton, "click");
        }
        
        if (typeof htDatePickerSet.elInput != "undefined") {
            this._wfFocusInput.detach(htDatePickerSet.elInput, "focus");
            this._wfClickLinkedElement.detach(htDatePickerSet.elInput, "click");
            htDatePickerSet.elInput.readOnly = false;
        }
        if (htDatePickerSet == this._htSelectedDatePickerSet) {
            this._htSelectedDatePickerSet = null;
        }       
        this._aDatePickerSet.splice(i, 1);
        
        return this;
    },
    
    /**
        DatePicker 세트를 가져온다.
        
        @method getDatePickerSet
        @param {HTMLElement} [el] 가져올 DatePicker 세트의 Input 엘리먼트
        @return {Object | Array} 파라미터로 엘리먼트가 전달될 경우 해당 Input 엘리먼트가 속하는 DatePicker 세트 객체를, 파라미터가 없는 경우 DatePicker 세트 배열을 리턴
    **/
    getDatePickerSet : function(el) {
        if(typeof el == "undefined") {
            return this._aDatePickerSet;
        }
        
        for (var i = 0, len = this._aDatePickerSet.length; i < len; i++) {
            if (this._aDatePickerSet[i].elInput == el || this._aDatePickerSet[i].elButton == el) {
                return this._aDatePickerSet[i];             
            }
        }
        return false;
    },
    
    /**
        달력레이어를 가져온다.
        
        @method getCalendarLayer
        @return {HTMLElement} 달력레이어 엘리먼트
    **/
    getCalendarLayer : function() {
        return this._elCalendarLayer;
    },
    
    _initCalendar : function() {
        /**
            달력 오브젝트
            @type Object jindo.Calendar 컴포넌트 
            @see jindo.Calendar
        **/
        var self = this;
        this._oCalendar = new jindo.Calendar(this.getCalendarLayer(), this.option("Calendar")).attach({
            beforeDraw : function(oCustomEvent) {
                /**
                    달력을 그리기 전에 발생
                    
                    @event beforeDraw
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nYear 그려질 달력의 년
                    @param {Number} nMonth 그려질 달력의 월
                    @param {Function} stop 달력이 새로 그려지지 않도록 중단시키는 메서드
                    @example
                        // beforeDraw 커스텀 이벤트 핸들링
                        oDatePicker.attach("beforeDraw", function(oCustomEvent) {
                            // 변경될 달력이 2000년 이전이면 변경시키지 않음
                            if(oCustomEvent.nYear < 2000){
                                oCustomEvent.stop();
                                alert("2000년 이전은 선택할 수 없습니다.");
                            }
                        });
                **/
                if(!self.fireEvent("beforeDraw", oCustomEvent)) {
                    oCustomEvent.stop();
                }
            },
            draw : function(oCustomEvent) {
                //선택한 날짜 class명 부여
                var sClassPrefix = this.option("sClassPrefix");
                var oShowDatePickerSet = self._htSelectedDatePickerSet;
                
                if (self.isSelectable(oShowDatePickerSet, oCustomEvent)) {
                    oCustomEvent.bSelectable = true;
                    if (jindo.Calendar.isSameDate(oCustomEvent, oShowDatePickerSet)) {
                        jindo.$Element(oCustomEvent.elDateContainer).addClass(sClassPrefix + "selected");
                    }
                } else {
                    oCustomEvent.bSelectable = false;
                    jindo.$Element(oCustomEvent.elDateContainer).addClass(this.option("sClassPrefix") + "unselectable");
                }
                /**
                    달력을 그리면서 일이 표시될 때마다 발생
                    
                    @event draw
                    @param {String} sType 커스텀 이벤트명
                    @param {Boolean} bPrevMonth 그려질 날이 이전달의 날인지 여부
                    @param {Boolean} bNextMonth 그려질 날이 다음달의 날인지 여부
                    @param {HTMLElement} elDate 날이 쓰여질 대상 엘리먼트
                    @param {HTMLElement} elDateContainer className이 [prefix]week로 설정된 엘리먼트의 자식 엘리먼트, elDate와 같을 수 있음
                    @param {Number} nYear 그려진 날의 연
                    @param {Number} nMonth 그려진 날의 월
                    @param {Number} nDate 그려진 날의 일
                    @param {String} sHTML 대상 엘리먼트에 쓰여질 HTML
                    @example
                        // draw 커스텀 이벤트 핸들링
                        var oHoliday = { ... }; // 공휴일 정보 설정
                         
                        oDatePicker.attach("draw", function(oCustomEvent) {
                            // 그려지는 날짜가 공휴일인지 검사한 후 설정하는 예제
                            if (typeof oHoliday == "object" && oHoliday[oCustomEvent.nYear]
                                && oHoliday[oCustomEvent.nYear][parseInt(oCustomEvent.nMonth * 1)]
                                && oHoliday[oCustomEvent.nYear][parseInt(oCustomEvent.nMonth * 1)][oCustomEvent.nDate]) {
                                    jindo.$Element(oCustomEvent.elDateContainer).addClass("calendar-holiday"); 
                            }
                        });
                **/
                if(!self.fireEvent("draw", oCustomEvent)) {
                    oCustomEvent.stop();
                }
            },
            afterDraw : function(oCustomEvent) {
                /**
                    달력을 모두 그린 후에 발생
                    
                    @event afterDraw
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nYear 그려진 달력의 연도
                    @param {Number} nMonth 그려진 달력의 월
                    @example
                        // afterDraw 커스텀 이벤트 핸들링
                        oDatePicker.attach("afterDraw", function(oCustomEvent) { ... });
                **/
                self.fireEvent("afterDraw", oCustomEvent);
            }
        });
    },
    
    /**
        Calendar 객체를 가져온다.
        
        @method getCalendar
        @return {jindo.Calendar} Calendar 객체
        @see jindo.Calendar
    **/
    getCalendar : function() {
        return this._oCalendar;
    },
    
    _initLayerManager : function() {
        var self = this;
        var elCalendarLayer = this.getCalendarLayer();
        this._oLayerManager = new jindo.LayerManager(elCalendarLayer, this.option("LayerManager")).attach({
            show : function() {
                if (self._oTimerDatePickerSet) {
                    clearTimeout(self._oTimerDatePickerSet);
                    self._oTimerDatePickerSet = null;
                }
                /**
                    달력 레이어가 펼쳐진 후 상태에서 발생하는 이벤트
                    
                    @event showCalendar
                    @example
                        // select 커스텀 이벤트 핸들링
                        oDatePicker.attach("showCalendar", function() { ... });
                **/
                self.fireEvent("showCalendar");
            },
            hide : function(oCustomEvent) {
                self._oTimerDatePickerSet = setTimeout(function() {
                    self._htSelectedDatePickerSet = null;
                    self._oTimerDatePickerSet = null;
                }, 0);
                /**
                    달력 레이어가 닫혀진 후 상태에서 발생하는 이벤트
                    
                    @event hideCalendar
                    @example
                        // select 커스텀 이벤트 핸들링
                        oDatePicker.attach("hideCalendar", function() { ... });
                **/
                self.fireEvent("hideCalendar");
            }
        }).link(elCalendarLayer);
    },

    /**
        LayerManager 객체를 가져온다.
        
        @method getLayerManager
        @return {jindo.LayerManager} LayerManager 객체
    **/ 
    getLayerManager : function() {
        return this._oLayerManager;
    },
    
    _initLayerPosition : function() {
        if (this.option("bUseLayerPosition")) {
            this._oLayerPosition = new jindo.LayerPosition(null, this.getCalendarLayer(), this.option("LayerPosition"));
        }
    },
    
    /**
        LayerPosition 객체를 가져온다.
        
        @method getLayerPosition
        @return {jindo.LayerPosition} LayerPosition 객체
    **/
    getLayerPosition : function() {
        return this._oLayerPosition;
    },
    
    /**
        DatePicker 세트에 해당하는 Input 엘리먼트를 가져온다.
        
        @method getInput
        @param {Object} [htDatePickerSet] Input 엘리먼트를 가져올 DatePicker 세트
        @return {HTMLElement} 해당 Input 엘리먼트, 파라미터가 없는 경우에는 현재포커스된 Input을 리턴하고, 포커스된 Input이 없는 경우 null을 리턴
    **/
    getInput : function(htDatePickerSet) {
        if (typeof htDatePickerSet != "undefined") {
            return htDatePickerSet.elInput || null;
        }
        if (this._htSelectedDatePickerSet) {
            return this._htSelectedDatePickerSet.elInput || null;
        }
        return null;
    },
    
    /**
        선택된 날짜를 가져온다.
        
        @method getDate
        @param {Object} htDatePickerSet 선택된 날짜를 가져올 DatePicker 세트
        @return {Object} 해당 DatePicker 세트에 선택된 날짜
    **/
    getDate : function(htDatePickerSet) {
        return {
            nYear : htDatePickerSet.nYear,
            nMonth : htDatePickerSet.nMonth,
            nDate : htDatePickerSet.nDate 
        };
    },
    
    _setDate : function(htDatePickerSet, htDate) {
        htDatePickerSet.nYear = htDate.nYear * 1;
        htDatePickerSet.nMonth = htDate.nMonth * 1;
        htDatePickerSet.nDate = htDate.nDate * 1;
        if (typeof htDatePickerSet.elInput != "undefined") {
            htDatePickerSet.elInput.value = this._getDateFormat(htDatePickerSet, htDate);
        }
    },
    
    /**
        지정한 날짜가 DatePicker 세트에서 선택가능한 날짜인지 확인한다.
        
        @method isSelectable
        @param {Object} htDatePickerSet 선택가능 여부를 확인할 DatePicker 세트
        @param {Object} htDate 선택 가능 여부를 확인할 날짜
            @param {Number} htDate.nYear 년도
            @param {Number} htDate.nMonth 월
            @param {Number} htDate.nDate 일
    **/
    isSelectable : function(htDatePickerSet, htDate) {
        return jindo.Calendar.isBetween(htDate, htDatePickerSet.htOption["htSelectableDateFrom"], htDatePickerSet.htOption["htSelectableDateTo"]);
    },
    
    /**
        선택한 날짜에 대해 DatePicker 세트의 Input에 형식에 맞는 날짜 값을 설정한다.
        
        @method setDate
        @param {Object} htDatePickerSet TODO : 파라미터 설명달기
        @param {Object} htDate 선택할 날짜
            @param {Number} htDate.nYear 년도
            @param {Number} htDate.nMonth 월
            @param {Number} htDate.nDate 일
        @return {Boolean} DatePicker 세트에 선택한 날짜 설정이 성공했는지 여부
    **/
    setDate : function(htDatePickerSet, htDate) {
        if (this.isSelectable(htDatePickerSet, htDate)) {
            var sDateFormat = this._getDateFormat(htDatePickerSet, htDate);
            var htParam = {
                "sText": sDateFormat,
                "nYear": htDate.nYear,
                "nMonth": htDate.nMonth,
                "nDate": htDate.nDate
            };
            /**
                달력 레이어에서 날짜를 선택하고 Text Input에 값이 설정되기 직전에 실행
                
                @event beforeSelect
                @param {String} sType 커스텀 이벤트명
                @param {String} sText Text Input에 설정될 값
                @param {Number} nYear 선택된 달력의 연도
                @param {Number} nMonth 선택된 달력의 월
                @param {Number} nDate 선택된 달력의 일
                @param {Function} stop Text Input에 선택된 값 입력을 중단시키는 메서드
                @example
                    // beforeSelect 커스텀 이벤트 핸들링
                    oDatePicker.attach("beforeSelect", function(oCustomEvent) {
                        // Text Input에 값을 입력하지 않는다.
                        // select 이벤트가 발생되기전에 수행을 중단한다.
                        oCustomEvent.stop();
                    });
            **/
            if (this.fireEvent("beforeSelect", htParam)) {
                this._setDate(htDatePickerSet, htDate);
                this.getLayerManager().hide();
                /**
                    달력 레이어에서 날짜를 선택하고 Text Input에 값이 설정된 이후 실행
                    
                    @event select
                    @param {String} sType 커스텀 이벤트명
                    @param {Number} nYear 선택된 달력의 연도
                    @param {Number} nMonth 선택된 달력의 월
                    @param {Number} nDate 선택된 달력의 일
                    @example
                        // select 커스텀 이벤트 핸들링
                        oDatePicker.attach("select", function(oCustomEvent) { ... });
                **/
                this.fireEvent("select", htParam);
            }
            return true;
        }
        return false;
    },
    
    /**
        DatePicker 세트의 Input에 입력되는 날짜의 형식을 가져온다. 
        
        @method _getDateFormat
        @param {Object} htDatePickerSet 날짜의 형식을 가져올 DatePicker 세트
        @param {Object} htDate 날짜의 형식을 확인하기 위한 날짜
            @param {Number} htDate.nYear 년도
            @param {Number} htDate.nMonth 월
            @param {Number} htDate.nDate 일
        @return {String} sDateFormat
        @ignore
    **/
    _getDateFormat : function(htDatePickerSet, htDate) {
        var nYear = htDate.nYear;
        var nMonth = htDate.nMonth;
        var nDate = htDate.nDate;
        
        if (nMonth < 10) {
            nMonth = ("0" + (nMonth * 1)).toString();
        }
        if (nDate < 10) {
            nDate = ("0" + (nDate * 1)).toString();
        } 
        
        var sDateFormat = htDatePickerSet.htOption.sDateFormat;
        sDateFormat = sDateFormat.replace(/yyyy/g, nYear).replace(/y/g, (nYear).toString().substr(2,2)).replace(/mm/g, nMonth).replace(/m/g, (nMonth * 1)).replace(/M/g, this.getCalendar().option("aMonthTitle")[nMonth-1] ).replace(/dd/g, nDate).replace(/d/g, (nDate * 1)); 
        return sDateFormat;
    },
    
    _linkOnly : function (htDatePickerSet) {
        var oLayerManager = this.getLayerManager();
        oLayerManager.setLinks([this.getCalendarLayer()]);
        if (typeof htDatePickerSet.elInput != "undefined") {
            oLayerManager.link(htDatePickerSet.elInput);
        }
        if (typeof htDatePickerSet.elButton != "undefined") {
            oLayerManager.link(htDatePickerSet.elButton);   
        }
    },
    
    /**
        컴포넌트를 활성화한다.
    **/
    _onActivate : function() {
        var elCalendarLayer = this.getCalendarLayer();
        jindo.$Element.prototype.preventTapHighlight && jindo.$Element(elCalendarLayer).preventTapHighlight(true);
        this._wfMouseOverDate.attach(elCalendarLayer, "mouseover");
        this._wfMouseOutDate.attach(elCalendarLayer, "mouseout");
        this._wfClickDate.attach(elCalendarLayer, "click");
        this.getLayerManager().activate();
        this.getCalendar().activate();
    },
    
    /**
        컴포넌트를 비활성화한다.
    **/
    _onDeactivate : function() {
        var elCalendarLayer = this.getCalendarLayer();
        jindo.$Element.prototype.preventTapHighlight && jindo.$Element(elCalendarLayer).preventTapHighlight(false);
        this._wfMouseOverDate.detach(elCalendarLayer, "mouseover");
        this._wfMouseOutDate.detach(elCalendarLayer, "mouseout");
        this._wfClickDate.detach(elCalendarLayer, "click").detach(elCalendarLayer, "mouseover").detach(elCalendarLayer, "mouseout");
        this.getLayerManager().deactivate();
        this.getCalendar().deactivate();
    },
    
    _onFocusInput : function(we) {
        /**
            Input 엘리먼트에 포커스 되었을 때 발생
            
            @event focus
            @param {String} sType 커스텀 이벤트명
            @param {HTMLElement} element 포커스된 Input 엘리먼트
            @example
                // focus 커스텀 이벤트 핸들링
                oDatePicker.attach("focus", function() { ... });
        **/
        this.fireEvent("focus", {
            element : we.element
        });
    },
    
    _onClickLinkedElement : function(we){
        we.stop(jindo.$Event.CANCEL_DEFAULT);
        /**
            Input 엘리먼트에 마우스 클릭 하였을 때 발생
            
            @event click
            @param {String} sType 커스텀 이벤트명
            @param {HTMLElement} element 클릭된 Input 엘리먼트
            @example
                // click 커스텀 이벤트 핸들링
                oDatePicker.attach("click", function(oCustomEvent) { ... });
        **/
        if (this.fireEvent("click", {
            element: we.element
        })) {
            var htDatePickerSet = this.getDatePickerSet(we.currentElement);
            if (htDatePickerSet) {
                this._htSelectedDatePickerSet = htDatePickerSet;
                this._linkOnly(htDatePickerSet);
                if (!htDatePickerSet.nYear) {
                    htDatePickerSet.nYear = htDatePickerSet.htOption.nYear;
                }
                if (!htDatePickerSet.nMonth) {
                    htDatePickerSet.nMonth = htDatePickerSet.htOption.nMonth;
                }
                if (!htDatePickerSet.nDate) {
                    htDatePickerSet.nDate = htDatePickerSet.htOption.nDate;
                }
                var nYear = htDatePickerSet.nYear;
                var nMonth = htDatePickerSet.nMonth;
                this.getLayerManager().show();
                this.getCalendar().draw(nYear, nMonth);
                if (this.option("bUseLayerPosition")) {
                    if (typeof htDatePickerSet.elLayerPosition != "undefined") {
                        this.getLayerPosition().setElement(htDatePickerSet.elLayerPosition).setPosition();
                    } else {
                        this.getLayerPosition().setElement(htDatePickerSet.elInput).setPosition();
                    }
                }
            }
        }
    },
    
    _getTargetDateElement : function(el) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elDate = (jindo.$Element(el).hasClass(sClassPrefix + "date")) ? el : jindo.$$.getSingle("."+ sClassPrefix + "date", el);
        if (elDate && (elDate == el || elDate.length == 1)) {
            return elDate;
        }
        return null;
    },
    
    _getTargetDateContainerElement : function(el) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elWeek = jindo.$$.getSingle("! ." + sClassPrefix + "week", el);
        if (elWeek) {
            var elReturn = el;
            while(!jindo.$Element(elReturn.parentNode).hasClass(sClassPrefix + "week")) {
                elReturn = elReturn.parentNode;
            }
            if (jindo.$Element(elReturn).hasClass(sClassPrefix + "unselectable")) {
                return null;
            }
            return elReturn;
        } else {
            return null;
        }
    },
    
    _setSelectedAgain : function() {
        if (this._elSelected) {
            var sClassPrefix = this.getCalendar().option("sClassPrefix");
            jindo.$Element(this._elSelected).addClass(sClassPrefix + "selected");
            this._elSelected = null;
        }
    },
    
    _setAsideSelected : function() {
        if (!this._elSelected) {
            var sClassPrefix = this.getCalendar().option("sClassPrefix");
            this._elSelected = jindo.$$.getSingle("." + sClassPrefix + "selected", this.elWeekAppendTarget);
            if (this._elSelected) {
                jindo.$Element(this._elSelected).removeClass(sClassPrefix + "selected");
            }
        }
    },
    
    _onMouseOverDate : function(we) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elDateContainer = this._getTargetDateContainerElement(we.element);
        if (elDateContainer) {
            var htDate = this.getCalendar().getDateOfElement(elDateContainer);
            var htParam = {
                element : we.element,
                nYear : htDate.nYear,
                nMonth : htDate.nMonth,
                nDate : htDate.nDate,
                bSelectable : false
            };
            if (this._htSelectedDatePickerSet && this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
                this._setAsideSelected();
                jindo.$Element(elDateContainer).addClass(sClassPrefix + "over");
                htParam.bSelectable = true;
            }
            /**
                달력레이어의 날짜에 마우스오버 하였을 때 발생
                
                @event mouseover
                @param {String} sType 커스텀 이벤트명
                @param {HTMLElement} element 마우스오버된 Input 엘리먼트
                @param {Number} nYear 선택된 달력의 연도
                @param {Number} nMonth 선택된 달력의 월
                @param {Number} nDate 선택된 달력의 일
                @example
                    // mouseover 커스텀 이벤트 핸들링
                    oDatePicker.attach("mouseover", function(oCustomEvent) { ... });
            **/
            this.fireEvent("mouseover", htParam);
        } 
    },
    
    _onMouseOutDate : function(we) {
        var sClassPrefix = this.getCalendar().option("sClassPrefix");
        var elDateContainer = this._getTargetDateContainerElement(we.element);
        if (elDateContainer) {
            var htDate = this.getCalendar().getDateOfElement(elDateContainer);
            var htParam = {
                element : we.element,
                nYear : htDate.nYear,
                nMonth : htDate.nMonth,
                nDate : htDate.nDate,
                bSelectable : false
            };
            if (this._htSelectedDatePickerSet && this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
                jindo.$Element(elDateContainer).removeClass(sClassPrefix + "over");
                htParam.bSelectable = true;
                this._setSelectedAgain();
            }
            /**
                달력레이어의 날짜에 마우스아웃 하였을 때 발생
                
                @event mouseout
                @param {String} sType 커스텀 이벤트명
                @param {HTMLElement} element 마우스아웃된 Input 엘리먼트
                @param {Number} nYear 선택된 달력의 연도
                @param {Number} nMonth 선택된 달력의 월
                @param {Number} nDate 선택된 달력의 일
                @example
                    // mouseout 커스텀 이벤트 핸들링
                    oDatePicker.attach("mouseout", function(oCustomEvent) { ... });
            **/
            this.fireEvent("mouseout", htParam);
        } else {
            this._setSelectedAgain();
        }
    },
    
    _onClickDate : function(we){
        we.stop(jindo.$Event.CANCEL_DEFAULT);
        var el = we.element;
        
        var elDate = this._getTargetDateElement(el);
        if (elDate) {
            var elDateContainer = this._getTargetDateContainerElement(elDate);
            if (elDateContainer) {
                var htDate = this.getCalendar().getDateOfElement(elDateContainer);
                if (this.isSelectable(this._htSelectedDatePickerSet, htDate)) {
                    this.setDate(this._htSelectedDatePickerSet, htDate);
                }
            }
        } 
    }
}).extend(jindo.UIComponent);
