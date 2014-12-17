/**
    @fileOverview Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환하는 컴포넌트
    @author hooriza, modified by senxation
    @version #__VERSION__#
**/
/**
    Text Input에 입력중인 값을 세자리마다 콤마(,)가 찍힌 숫자형식으로 변환하는 컴포넌트
    
    @class jindo.NumberFormatter
    @extends jindo.Formatter
    @requires jindo.TextRange
    @requires jindo.Timer
    @keyword numberformatter, formatter, comma, number, 넘버포맷터, 포맷터, 콤마
**/
jindo.NumberFormatter = jindo.$Class({
    /** @lends jindo.NumberFormatter.prototype */
    /**
        NumberFormatter 컴포넌트를 생성한다.
        
        @constructor
        @param {HTMLElement} el 숫자만 입력하게 만들 입력폼 엘리먼트
        @param {Object} [htOption] 옵션 객체
            @param {Number} [htOption.nDecimalPoint=2] 표시할 소수점 자리
            @param {Boolean} [htOption.bPaintOnload=true] 로드시에 paint() 수행여부
            @param {Boolean} [htOption.bActivateOnload=true] 로드시에 activate() 수행여부
        @example 
            var oNumberFormatter = new jindo.NumberFormatter(jindo.$('foo'), { 
                nDecimalPoint : 2, //(Number) 소수점 몇째자리까지 표시할 것인지
            }).attach({
                beforeChange : function(oCustomEvent) { 
                    //전달되는 이벤트 객체 e = {
                    //  elInput : (HTMLElement) Text Input 엘리먼트
                    //  sText : (String) Text Input 의 값
                    //  sStartMark : (String)
                    //  sEndMark : (String)
                    //} 
                },
                change : function(oCustomEvent) {
                    //전달되는 이벤트 객체 e = {
                    //  elInput : (HTMLElement) Text Input 엘리먼트
                    //}
                }
            });

        @remark
            Firefox 에서는 한글을 입력했을때 입력폼 내용이 모두 사라지는 버그가 있으므로
            입력폼 엘리먼트의 ime-mode 스타일을 disabled 로 하는 것을 권장한다.
    **/ 
    $init : function(el, htOption) {
        this.option({
            nDecimalPoint : 0 //(Number) 소수점 몇째자리까지 표시할 것인지
        });
        this.option(htOption || {});
    
        this.attach('beforeChange', function(oCustomEvent) {
            var sText = oCustomEvent.sText;
            var sOutput = '';
            var nDecimalPoint = this.option("nDecimalPoint");
            var sStartMark = oCustomEvent.sStartMark;
            var sEndMark = oCustomEvent.sEndMark;
            
            if (nDecimalPoint === 0) {
                // 숫자랑 마크빼고 전부 삭제
                sText = sText.replace(new RegExp('[^0-9' + sStartMark + sEndMark + ']', 'g'), '');
                // 맨 앞에 있는 숫자 0 없애기         
                sText = sText.replace(/^0+/, '');
                sText = sText.replace(new RegExp('^0*' + sStartMark + '0*' + sEndMark + '0*'), sStartMark + sEndMark);  
            } else {
                
                var count = 0;
                var aMatch = [];
                sText.replace(new RegExp('((?:[0-9]|'+sStartMark+sEndMark+')\\.|[0-9]|' + sStartMark + '|' +sEndMark + ')', 'g'),function(m){
                    if(/\.$/.test(m)){
                        if(count==0){
                            count++;
                            aMatch.push(m);
                        }else{
                            aMatch.push(m.replace(".",""));
                        }
                    }else{
                        aMatch.push(m);
                    }
                });
                sText = aMatch?aMatch.join(""):"";
                
                // 맨 앞에 있는 숫자 0 없애기         
                
                if(!(new RegExp('^(?:0|[0-9]\\.(?:[0-9]*?))' + sStartMark + sEndMark+"$").test(sText))){
                    sText = sText.replace(/^0+/, '');
                }
                // // 숫자랑 . 마크빼고 전부 삭제
                // sText = sText.replace(new RegExp('[^0-9\.' + oCustomEvent.sStartMark + oCustomEvent.sEndMark + ']', 'g'), '');
                // sText = sText.replace(/\.{2,}/g, ".");
                // // 맨 앞에 있는 . 없애기         
                // sText = sText.replace(/^\.+/, '');
                // // 소수점 2개가 없도록
                // sText = sText.replace(/(\.[^.]*?)(\.)/g, function(){
                    // return arguments[1];
                // });
                // // 맨 앞에 있는 숫자 0 없애기          
                // sText = sText.replace(/^0+/, '');
                // sText = sText.replace(new RegExp('^0*' + oCustomEvent.sStartMark + '0*' + oCustomEvent.sEndMark + '0*'), oCustomEvent.startMark + oCustomEvent.endMark);
                // sText = sText.replace(new RegExp("^0([^\."+ oCustomEvent.sStartMark + oCustomEvent.sEndMark +"]+?)", "g"), function(){
                    // return arguments[1];
                // });
            }

            sOutput = this._convertCurrency(sText);
            if (nDecimalPoint > 0) {
                sOutput = this._limitDecimalPoint(sOutput, nDecimalPoint);
            }
            
            oCustomEvent.sText = sOutput;
        });

    },
    
    /**
        Text Input의 설정된 값을 가져온다.
        
        @method getValue
        @return {String}
        @example
            "12,345,678.12"
            oNumberFormatter.getValue(); -> "12345678.12"
    **/
    getValue : function() {
        return this._el.value.replace(new RegExp("[,"+ this._aMarks[0] + this._aMarks[1] + "]+?", "g"), "");
    },

    _convertCurrency : function(sText) {
        var nDot = 0,
            sReturn = "",
            nDotPosition = sText.indexOf("."),
            nLastPosition = sText.length;
            
        if (nDotPosition > -1) {
            nLastPosition = nDotPosition - 1;
        }
        
        //세자리마다 ,찍어 통화형식으로 만들기
        for (var i = sText.length; i >= 0; i--) {
            var sChar = sText.charAt(i);
            if (i > nLastPosition) {
                sReturn = sChar + sReturn;
                continue;
            }
            if (/[0-9]/.test(sChar)) {
                if (nDot >= 3) {
                    sReturn = ',' + sReturn;
                    nDot = 0;
                }
                nDot++;
                sReturn = sChar + sReturn;
            } else if (sChar == this._aMarks[0] || sChar == this._aMarks[1]) {
                sReturn = sChar + sReturn;
            }
        }
        
        return sReturn;
    },
    
    _limitDecimalPoint : function(sText, nDecimalPoint) {
        var sReturn = "",
            nDotPosition = sText.indexOf("."),
            nLastPosition = sText.length;
            
        if (nDotPosition > -1) {
            nLastPosition = nDotPosition - 1;
        }
        
        //소수점 이하 자리수 제한
        nDotPosition = sText.indexOf(".");
        if (nDotPosition > -1 && nDecimalPoint > 0) {
            var nDecimalCount = 0;
            for (var i = 0; i < sText.length; i++) {
                var sChar = sText.charAt(i),
                    bIsNumber = /[0-9]/.test(sChar);
                
                if (bIsNumber) {
                    if (nDecimalCount == nDecimalPoint) {
                        continue;
                    }
                    if (i > nDotPosition) {
                        nDecimalCount++;
                    }
                }
                sReturn += sChar;
            }   
        } else {
            sReturn = sText;
        }
        
        return sReturn;
    }
}).extend(jindo.Formatter);