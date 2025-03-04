function currentPan() {
    this.selfPan = ""
}
function customeOtpTimer(n, t) {
    this.selfDuration = n;
    this.selfElemId = t;
    this.selfTimerId = null
}
function pansTimersHistory() {
    this.selfDic = {}
}
function timerHistory(n, t) {
    this.selfStopedAt = n;
    this.selfElapsedTime = t
}
function otpRequestModel(n, t, i, r, u, f) {
    this.pan = n;
    this.sessionKey = t;
    this.areaName = i;
    this.subCardId = r;
    this.CaptchaDeText = u;
    this.CaptchaInputText = f
}
function handleFailedOtp() {
    selfOtpTimer.stop();
    otpRequestButton.disable();
    document.getElementById("frmFailedOtp").submit()
}
function handleTryAgain() {
    if (otpSettings.maxTriesCount <= 0) {
        handleFailedOtp();
        return
    }
    otpRequestButton.toTryAgainState();
    getCaptcha();
    freezeInput(["CardNumber_PanString", "Cvv2", "Month", "Year", "CaptchaInputText"], !0)
}
function timerCallBack() {
    handleTryAgain();
    freezeInput(["CardNumber_PanString", "Cvv2", "Month", "Year", "CaptchaInputText"], !0);
    selfHistory.remove(selfCurrentPan.get());
    hasValue(otpSettings.otpTryAgainMessage) && showMessage($("button[id=Otp]"), otpSettings.otpTryAgainMessage, "info")
}
function sendOtpRequest(n, t, i=false, r=null) {
    $.ajax({
        url: serverUrl + "/Otp/RequestOtp?culture=" + culture,
        method: "POST",
        type: "json",
        data: n,
        beforeSend: function() {
            $("body").addClass("freeze");
            i ? (r.addClass("in-progress"),
            $(".button").each(function() {
                $(this).hasClass("in-progress") || $(this).hasClass("cancel") || $(this).addClass("is-disabled")
            })) : $("button[id=Otp]").addClass("in-progress")
        },
        success: function(u) {
            var f, e;
            if (u !== undefined && u !== null)
                if (f = u,
                i)
                    f.HasError === !1 ? (showMessage(r, f.Message, null, null, null, !0),
                    r.closest(".inline-form").find("input").focus(),
                    setTimeout(function() {
                        $(".button").each(function() {
                            $(this).hasClass("in-progress") && $(this).hasClass("cancel") && $(this).hasClass("return") || $(this).addClass("is-disabled")
                        });
                        $(".password").each(function() {
                            $(this).attr("disabled", "disabled")
                        });
                        r.addClass("btn-timer");
                        r.closest(".inline-form").find("input").removeAttr("disabled");
                        r.closest(".inline-form").find("button.success").removeClass("is-disabled")
                    }, 5),
                    batchBillOtpTimer(r)) : showMessage(r, f.Message, "danger", null, null, !0);
                else if (f.HasError === !1)
                    otpSettings.maxTriesCount--,
                    otpRequestButton.toTimerState(),
                    freezeInput(["CardNumber_PanString", "Cvv2", "Month", "Year", "CaptchaInputText"]),
                    showMessage($("button[id=Otp]"), f.Message),
                    $("input[id=Pin2]").focus(),
                    e = t ? n.subCardId : n.pan,
                    selfCurrentPan.set(e),
                    selfOtpTimer.start(timerCallBack);
                else if (getCaptcha(),
                otpRequestButton.enable(),
                freezeInput(["CardNumber_PanString", "Cvv2", "Month", "Year", "CaptchaInputText"], !0),
                showMessage($("button[id=Otp]"), u.Message, "danger"),
                otpSettings.maxTriesCount <= 0) {
                    timerToFailedOtp();
                    return
                }
        },
        error: function() {
            i ? (showMessage($(r), langs.serviceUnavailable, "danger", null, null, !0),
            otpRequestButton.enable()) : (showMessage($("button[id=Otp]"), langs.serviceUnavailable, "danger"),
            otpRequestButton.enable())
        },
        complete: function() {
            $("body").removeClass("freeze");
            i ? (r.removeClass("in-progress"),
            document.getElementsByClassName("btn-timer").length || $(".button").each(function() {
                $(this).hasClass("is-disabled") && $(this).removeClass("is-disabled")
            })) : $("button[id=Otp]").removeClass("in-progress")
        }
    })
}
function handleChangePan(n, t) {
    var r, i;
    try {
        selfCurrentPan.set(n);
        freezeInput(["Cvv2", "Month", "Year", "CaptchaInputText"], !0);
        var u = new Date
          , f = selfOtpTimer.stop()
          , e = new timerHistory(u,f);
        if (selfHistory.save(t, e),
        r = selfHistory.get(n),
        r == null) {
            otpRequestButton.toTryAgainState();
            return
        }
        if (i = r.getRealElapsedSeconds(),
        i == null || i <= 0) {
            selfHistory.remove(n);
            otpRequestButton.toTryAgainState();
            return
        }
        otpRequestButton.toTimerState();
        selfOtpTimer.start(timerCallBack, i)
    } finally {
        refreshCaptcha()
    }
}
function batchBillOtpTimer(n) {
    var r = otpSettings.otpTimeOut, t, i;
    timerInterval = setInterval(function() {
        t = parseInt(r / 60, 10);
        i = parseInt(r % 60, 10);
        t = t < 10 ? "0" + t : t;
        i = i < 10 ? "0" + i : i;
        n.text(t + ":" + i);
        document.getElementsByClassName("btn-timer").length || (clearInterval(timerInterval),
        $(".password").each(function() {
            $(this).removeAttr("disabled")
        }));
        --r < 0 && (r = otpSettings.otpTimeOut,
        clearInterval(timerInterval),
        setTimeout(function() {
            $(".button").each(function() {
                $(this).removeClass("is-disabled")
            });
            $(".password").each(function() {
                $(this).removeAttr("disabled")
            });
            n.removeClass("btn-timer");
            n.text(langs.otpButtonTitle)
        }, 5),
        showMessage($(n), otpSettings.otpTryAgainMessage, "info", null, null, !0))
    }, 1e3)
}
function countdownTimer(n) {
    if (n.paused = n.timerElement.attr("paused") !== undefined,
    n.stopped = n.timerElement.attr("stopped") !== undefined,
    n.stopped) {
        $("body").hasClass("freeze") || n.timerElement.stopTimeoutAction();
        return
    }
    if (!n.paused && (n.elapsedTime -= 1e3,
    n.timerElement.setNewTime(n),
    n.elapsedTime <= 2e3 && $("body").addClass("freeze"),
    n.elapsedTime <= 0)) {
        n.timeoutCallback.submit();
        return
    }
    setTimeout(function() {
        countdownTimer(n)
    }, 1e3)
}
function getCaptcha() {
    var n = serverUrl + "/Captcha/Refresh"
      , t = "data:image/JPEG;base64,"
      , i = {
        sessionKey: userSessionKey,
        areaName
    }
      , r = $.ajax({
        url: n,
        method: "POST",
        data: i
    });
    r.done(function(n) {
        $("input[id=CaptchaInputText]").val("");
        $("img[id=CaptchaImage]").attr("src", t + n.image);
        $("button[data-action=Otp]").removeClass("is-disabled")
    })
}
function expireCaptcha() {
    var n = serverUrl + "/Captcha/Expire"
      , t = {
        userSessionKey,
        areaName
    }
      , i = $.ajax({
        url: n,
        method: "POST",
        data: t,
        type: "json"
    });
    i.done(function() {
        return
    });
    $("input[id=CaptchaInputText]").val("")
}
var defaultTimerOptions;
currentPan.prototype.set = function(n) {
    this.selfPan = n
}
;
currentPan.prototype.get = function() {
    return this.selfPan
}
;
customeOtpTimer.prototype.start = function(n, t) {
    var i, r, f = document.getElementById(this.selfElemId), u = t == null ? this.selfDuration : t, e = setInterval(function() {
        i = parseInt(u / 60, 10);
        r = parseInt(u % 60, 10);
        i = i < 10 ? "0" + i : i;
        r = r < 10 ? "0" + r : r;
        f.textContent = i + ":" + r;
        f.value = u;
        --u < 0 && (f.elapsed = 0,
        clearInterval(e),
        n())
    }, 1e3);
    this.selfTimerId = e
}
;
customeOtpTimer.prototype.stop = function() {
    var n = document.getElementById(this.selfElemId).value;
    return clearInterval(this.selfTimerId),
    n
}
;
pansTimersHistory.prototype.save = function(n, t) {
    this.selfDic[n] = t
}
;
pansTimersHistory.prototype.get = function(n) {
    var t = this.selfDic[n];
    return t == null ? null : t
}
;
pansTimersHistory.prototype.remove = function(n) {
    this.selfDic[n] = null
}
;
timerHistory.prototype.getStopedAtTotalSeconds = function() {
    return this.selfStopedAt === null || this.selfStopedAt === undefined ? 0 : parseInt(this.selfStopedAt.getTime() / 1e3)
}
;
timerHistory.prototype.getRealElapsedSeconds = function() {
    var t = this.getStopedAtTotalSeconds()
      , i = parseInt((new Date).getTime() / 1e3)
      , r = this.selfElapsedTime
      , u = i - t
      , n = r - u;
    return n >= 0 ? n : 0
}
;
var otpButtonStates = {
    normal: "1",
    timer: "2",
    tryAgain: "3"
}, otpRequestButton = {
    elementId: "Otp",
    enable: function() {
        $("button[id=Otp]").removeClass("is-disabled")
    },
    disable: function() {
        $("button[id=Otp]").addClass("is-disabled")
    },
    toTimerState: function() {
        $("button[id=Otp]").attr("data-state") != otpButtonStates.timer && $("button[id=Otp]").attr("data-state", otpButtonStates.timer).addClass("is-disabled btn-timer")
    },
    toTryAgainState: function() {
        $("button[id=Otp]").attr("data-state") != otpButtonStates.tryAgain && $("button[id=Otp]").attr("data-state", otpButtonStates.tryAgain).removeClass("is-disabled btn-timer").text(langs.otpButton)
    }
}, timerInterval, selfOtpTimer = new customeOtpTimer(otpSettings.otpTimeOut,otpRequestButton.elementId), selfCurrentPan = new currentPan, selfHistory = new pansTimersHistory;
defaultTimerOptions = {
    colorCaution: !0,
    timeOut: 6e5,
    elapsedTime: 0,
    paused: !1,
    stopped: !1,
    dangerClassName: "danger",
    timeoutCallback: null,
    timerElement: null
};
$.fn.puaseTimeoutAction = function() {
    $(this).attr("paused", !0)
}
;
$.fn.stopTimeoutAction = function() {
    $(this).attr("stopped", !0);
    $(this).removeClass("class", "danger");
    $(this).find(".remaining-time").text("00:00")
}
;
$.fn.resumeTimeoutAction = function() {
    $(this).removeAttr("paused")
}
;
$.fn.restartTimeoutAction = function(n) {
    $(this).attr("stopped", !0);
    setTimeout(function() {
        $(this).startTimeoutAction(n);
        $(this).removeAttr("stopped")
    }, 1100)
}
;
$.fn.startTimeoutAction = function(n) {
    $(this).removeAttr("stopped");
    var t = $.extend({}, defaultTimerOptions, n);
    t.timerElement = $(this);
    t.elapsedTime = t.timeOut;
    countdownTimer(t)
}
;
$.fn.setNewTime = function(n) {
    n.colorCaution && n.elapsedTime < 3e5 && $(this).removeClass(n.dangerClassName);
    n.colorCaution && n.elapsedTime < 15e4 && $(this).addClass(n.dangerClassName);
    var t = Math.ceil(n.elapsedTime / 6e4) - 1
      , i = n.elapsedTime % 6e4 / 1e3;
    t = t < 0 ? 0 : t;
    t = n.elapsedTime == 6e4 ? 1 : t;
    i < 10 && (i = "0" + i);
    t < 10 && (t = "0" + t);
    $(this).find(".remaining-time").text(t + ":" + i)
}
