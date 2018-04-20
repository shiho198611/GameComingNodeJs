const Alexa = require('alexa-sdk');
const comingData = require('./getComingData');
const skillConst = require('./skillConst');

exports.handler = function(event, context, callback){
    const alexa = Alexa.handler(event, context, callback);
    console.log(event);
    alexa.appId = skillConst.skillId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function(){
        console.log('skill launch.');
        this.response
            .speak(skillConst.welcomeTxt)
            .listen(skillConst.welcomeListenTxt);

        this.emit(':responseReady');
    },
    'PlatformSelectIntent': function(){
        console.log('skill platform select:');
        console.log(this.event.request.intent);
        var myHandler = this;

        if(this.event.request.intent.slots.SelPlatformRes == null){
            this.response
                .speak(skillConst.slotUnknowTxt)
                .listen(skillConst.listPlatformTxt);
            this.emit(':responseReady');
        }
        else{
            var platformSelect = this.event.request.intent.slots.SelPlatformRes.value;
            console.log('platform select from alexa: '+platformSelect);
            var mPlatform = getPlatformCode(platformSelect);
            this.attributes.platform = mPlatform;
            
            if(mPlatform != -1){
                comingData.getComingData(mPlatform, function(gameData){
                    var speechTxt = genComingDataSpeech(gameData);
                    myHandler.response.speak(speechTxt);
                    myHandler.emit(':responseReady');
                });
            }
            else{
                this.response
                    .speak(skillConst.listPlatformTxt)
                    .listen(skillConst.listPlatformTxt);
                this.emit(':responseReady');
            }
        }
        
    },
    'ShowComingIntent': function(){
        console.log('skill show game coming');
        var myHandler = this;
        // var mAttr = this.attributes;
        console.log("slot: "+JSON.stringify(this.event.request.intent.slots));
        if(this.event.request.intent.slots.ShowPlatformRes == null){
            this.response
                .speak(skillConst.slotUnknowTxt)
                .listen(skillConst.listPlatformTxt);
            this.emit(':responseReady');
        }
        else{
            var platformSelect = this.event.request.intent.slots.ShowPlatformRes.value;
            console.log('platform select from alexa: '+platformSelect);
            var mPlatform = getPlatformCode(platformSelect);
            this.attributes.platform = mPlatform;
    
            if(mPlatform != -1){
                comingData.getComingData(mPlatform, function(gameData){
                    var speechTxt = genComingDataSpeech(gameData);
                    myHandler.response.speak(speechTxt);
                    myHandler.emit(':responseReady');
                });
            }
            else{
                this.response
                    .speak(skillConst.listPlatformTxt)
                    .listen(skillConst.listPlatformTxt);
                this.emit(':responseReady');
            }
        }
    },
    'AMAZON.CancelIntent': function(){
        console.log('amazon cancel.');
        this.response
            .speak(skillConst.endTxt)
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function(){
        console.log('amazon stop.');
        this.response
            .speak(skillConst.endTxt);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function(){
        console.log('amazon help');
        this.response
            .speak(skillConst.helpTxt)
            .listen(skillConst.helpTxt);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function(){
        console.log('session end.');
    },
    'Unhandled': function(){
        console.log('unhandled');
        this.response
            .speak(skillConst.ERROR_TXT);
        this.emit(':responseReady');
    }
};

var genComingDataSpeech = function(gameData){
    var speechTxt = '';
    if(gameData != null && gameData.length > 0){
        for(i=0;i<gameData.length;i++){
            speechTxt += (gameData[i].name + ' at ' + skillConst.dateFormatCommand1 + gameData[i].date + skillConst.dateFormatCommand2 + skillConst.breakPauseCommand);
        }
        console.log('gen data speech: '+speechTxt);
    }
    else{
        speechTxt = skillConst.dataErrTxt;
    }
    return speechTxt;
};

var getPlatformCode = function(platformSelect){
    console.log('platform from alexa: '+platformSelect);
    var mPlatform = -1;
    if(platformSelect){
        mPlatformSelect = platformSelect.toLowerCase();
        if(mPlatformSelect == skillConst.platformPS4 || mPlatformSelect == skillConst.platformPlayStation4){
            mPlatform = skillConst.platformPS4Code;
        }
        else if(mPlatformSelect == skillConst.platformSwitch){
            mPlatform = skillConst.platformNSCode;
        }
        else if(mPlatformSelect == skillConst.platformXBOne){
            mPlatform = skillConst.platformXBOneCode;
        }
        else if(mPlatformSelect == skillConst.platformPC){
            mPlatform = skillConst.platformPCCode;
        }
    }
    return mPlatform;
};