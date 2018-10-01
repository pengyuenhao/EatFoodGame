cc.loader.downloader.loadSubpackage = function (name, completeCallback) {
    wx.loadSubpackage({
        name: name,
        success: function () {
            if (completeCallback) completeCallback();
        },
        fail: function () {
            if (completeCallback) completeCallback(new Error(`Failed to load subpackage ${name}`));
        }
    })
};

function downloadScript (item, callback, isAsync) {
    var url = '../../' + item.url;
    require(url);
    callback(null, item.url);
}

function loadFont (item) {
    var url = item.url;
    var fontFamily = wx.loadFont(url);
    return fontFamily || 'Arial';
}

cc.loader.downloader.addHandlers({
    js : downloadScript,

    pvr: cc.loader.downloader.extMap.png,
    etc: cc.loader.downloader.extMap.png,
});

cc.loader.loader.addHandlers({
    pvr: cc.loader.loader.extMap.png,
    etc: cc.loader.loader.extMap.png,

    // Font
    font: loadFont,
    eot: loadFont,
    ttf: loadFont,
    woff: loadFont,
    svg: loadFont,
    ttc: loadFont,
});
