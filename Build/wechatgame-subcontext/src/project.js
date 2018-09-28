window.__require=function e(n,o,t){function r(c,s){if(!o[c]){if(!n[c]){var i=c.split("/");if(i=i[i.length-1],!n[i]){var l="function"==typeof __require&&__require;if(!s&&l)return l(i,!0);if(a)return a(i,!0);throw new Error("Cannot find module '"+c+"'")}}var u=o[c]={exports:{}};n[c][0].call(u.exports,function(e){return r(n[c][1][e]||e)},u,u.exports,e,n,o,t)}return o[c].exports}for(var a="function"==typeof __require&&__require,c=0;c<t.length;c++)r(t[c]);return r}({OpenCommon:[function(e,n,o){"use strict";cc._RF.push(n,"7ab32OHYWpBS7cbtmam5P1W","OpenCommon"),Object.defineProperty(o,"__esModule",{value:!0});var t=function(){function e(){}return e.localStorageMap=new Map,e}();o.OpenCommon=t,cc._RF.pop()},{}],launch:[function(e,n,o){"use strict";cc._RF.push(n,"ca4b9VB3alCN6vjaIjw3pSB","launch");var t=e("./OpenCommon");cc.Class({extends:cc.Component,properties:{content:cc.Node,prefab:cc.Prefab},start:function(){var e=this;this.rank=0,wx.onMessage(function(n){n&&n.message&&e.resolveMessage(n.message)})},createUserBlock:function(e){var n=this.createPrefab(),o=void 0,t=void 0,r=void 0;e&&(o=e.nickName?e.nickName:e.nickname,t=e.avatarUrl,r=this.resolveCloudStorage(e.KVDataList,"OneEatMaxScore"));var a=n.getChildByName("rank").getComponent(cc.Label),c=n.getChildByName("userName").getComponent(cc.Label),s=n.getChildByName("mask").children[0].getComponent(cc.Sprite),i=n.getChildByName("userScore").getComponent(cc.Label);if(s.enabled=!1,o){if(r)switch(this.rank+=1,a.string=this.rank,this.rank){case 1:a.node.color=new cc.Color(255,0,0);break;case 2:a.node.color=new cc.Color(0,255,0);break;case 3:a.node.color=new cc.Color(0,0,255);break;default:a.fontSize=a.fontSize/2}else r="null",a.string="null";c.string=o,i.string=r,console.log("[\u83b7\u53d6\u597d\u53cb\u4fe1\u606f]"+o),t&&cc.loader.load({url:t,type:"png"},function(e,n){e&&console.error(e),s.enabled=!0,s.spriteFrame=new cc.SpriteFrame(n)}),n.on(cc.Node.EventType.TOUCH_START,function(){},this)}else c.string="",i.string="",s.spriteFrame="",a.string=""},createPrefab:function(){var e=cc.instantiate(this.prefab);return e.parent=this.content,e},resolveMessage:function(e){switch(e.type){case"command":this.resolveCommand(e.function,e.arguments,e.data)}},resolveCommand:function(e,n,o){var r=this;switch(e){case"start":new Promise(function(e){r.clearContext(),r.getUserInfo(function(n){e(n)}),o&&o.width&&o.height&&(r.getComponent(cc.Canvas).designResolution=new cc.size(o.width,o.height))}).then(function(e){r.getFriendInfo(["OneEatMaxScore"])});break;case"switch":switch(this.clearContext(),n){case"friend":this.getFriendInfo(["OneEatMaxScore"]);break;case"group":o&&this.getGroupInfo(o,["OneEatMaxScore"])}break;case"save":switch(n){case"gameDiamond":case"gameCurrency":break;case"score":o>t.OpenCommon.maxScore&&this.saveMaxScoreData(o)}}},clearContext:function(){this.rank=0,this.content.removeAllChildren()},getUserInfo:function(e){var n=this;t.OpenCommon.userInfo?e(!0):wx.getUserInfo({openIdList:["selfOpenId"],lang:"zh_CN",success:function(o){var r=o.data[0];t.OpenCommon.userInfo=r,n.getUserMaxScoreData(function(o){var t=r.nickName,a=r.avatarUrl,c=o;if(n.userBlock){var s=n.userBlock.getChildByName("Mask").getComponentInChildren(cc.Sprite),i=n.userBlock.getChildByName("Name").getComponent(cc.Label),l=n.userBlock.getChildByName("Score").getComponent(cc.Label);i.string=t,cc.loader.load({url:a,type:"png"},function(e,n){e&&console.error(e),s.spriteFrame=new cc.SpriteFrame(n)}),l.string=c?o:"null"}e(!0)})},fail:function(n){e(!1)}})},getFriendInfo:function(e){var n=this,o=void 0;if(t.OpenCommon.localStorageMap.has("Friend")){var r=t.OpenCommon.localStorageMap.get("Friend");o=[];for(var a=0;a<e.length;a++)if(r.has(e[a])){var c=r.get(e[a]);n.createInfoBlock(c,10)}else o.push(e[a])}else o=e;o.length>0&&wx.getFriendCloudStorage({keyList:e,success:function(e){var o=n.resolveInfo("Friend","OneEatMaxScore",e.data);n.createInfoBlock(o,10)},fail:function(e){console.error(e)}})},resolveInfo:function(e,n,o){this.sortList(o,n,!1);var r=void 0;return t.OpenCommon.localStorageMap.has(e)?r=t.OpenCommon.localStorageMap.get(e):(r=new Map,t.OpenCommon.localStorageMap.set(e,r)),r.set(n,o),o},createInfoBlock:function(e,n){for(var o=0;o<n;o++){var t=e[o];t?this.createUserBlock(t):this.createUserBlock()}},getGroupInfo:function(e,n){var o=this,r=void 0;if(t.OpenCommon.localStorageMap.has("Group")){var a=t.OpenCommon.localStorageMap.get("Group");r=[];for(var c=0;c<n.length;c++)if(a.has(n[c])){var s=a.get(n[c]);o.createInfoBlock(s,10)}else r.push(n[c])}else r=n;r.length>0&&wx.getGroupCloudStorage({shareTicket:e,keyList:n,success:function(e){var n=o.resolveInfo("Group","OneEatMaxScore",e.data);o.createInfoBlock(n,10)},fail:function(e){console.error(e)}})},getUserMaxScoreData:function(e){var n=this,o=new Array;o.push("OneEatMaxScore"),wx.getUserCloudStorage({keyList:o,success:function(o){var r=n.resolveCloudStorage(o.KVDataList,"OneEatMaxScore");r?(t.OpenCommon.maxScore=r,e(r)):(n.saveMaxScoreData(0),e(0)),t.OpenCommon.isGetMaxScoreSuccess=!0},fail:function(n){t.OpenCommon.isGetMaxScoreSuccess=!1,e(0)}})},resolveCloudStorage:function(e,n){if(!e)return null;console.log("[\u6258\u7ba1\u6570\u636e\u6570\u91cf]"+e.length);for(var o=0;o<e.length;o++)if(e[o].key===n)return e[o].value},saveCloudStorage:function(e,n,o){wx.setUserCloudStorage({KVDataList:e,success:n,fail:o})},saveMaxScoreData:function(e){var n=new Array;n.push({key:"OneEatMaxScore",value:""+e}),this.saveCloudStorage(n,function(){},function(){})},sortList:function(e,n,o){return e.sort(function(e,t){for(var r=0,a=e.KVDataList,c=0;c<a.length;c++)a[c].key==n&&(r=a[c].value);var s=0;a=t.KVDataList;for(var i=0;i<a.length;i++)a[i].key==n&&(s=a[i].value);return o?parseInt(r)-parseInt(s):parseInt(s)-parseInt(r)}),e}}),cc._RF.pop()},{"./OpenCommon":"OpenCommon"}]},{},["OpenCommon","launch"]);
//# sourceMappingURL=project.js.map