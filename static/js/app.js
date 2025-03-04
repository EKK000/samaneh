function validPanNumber(n) {
    var n = normalize(n.trim()).replace(/\D/g, "");
    if (typeof n == "undefined" || n === null || n.length !== 16)
        return !1;
    let t = 0;
    for (let i = 0; i < 16; i += 1) {
        const r = Number(n[i]);
        t += i % 2 == 0 ? r * 2 > 9 ? r * 2 - 9 : r * 2 : r
    }
    return t % 10 == 0
}
function validMobileNumber(n, t = false) {
    var n = normalize(n.trim()).toString()
        , i = {
            1: /^091|0990|0991|0992|0993|0994$/,
            2: /^0900|0901|0902|0903|0904|0905|0930|0933|0935|0936|0937|0938|0939|0941$/,
            3: /^0920|0921|0922|0923$/,
            4: /^0999|099998|099999$/,
            5: /^09981$/,
            6: /^0934$/
        };
    for (var r in i)
        if (t) {
            if (n.match(i[r]))
                return r
        } else if (n.length == 11 && n.match(i[r]) && !/(.)\1{6,}/.test(n))
            return !0;
    return !1
}
function validEmailAddress(n) {
    var t = normalize(n.trim());
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}
function disableF5(n) {
    ((n.which || n.keyCode) == 116 || (n.which || n.keyCode) == 9) && n.preventDefault()
}
function isGiftCard(n) {
    return hasValue(n) && n.length != 2 ? !1 : parseInt(n) >= 20 && parseInt(n) <= 49
}
function hasValue(n) {
    return n == null || n == undefined || n.length == 0 || n == "" ? !1 : !0
}
function normalize(n) {
    var t, u, f;
    if (hasValue(n)) {
        var e = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
            , o = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
            , r = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
            , i = n;
        for (t = 0; t < 10; t++)
            u = new RegExp(e[t], "g"),
                f = new RegExp(o[t], "g"),
                i = i.replace(u, r[t]),
                i = i.replace(f, r[t]);
        return i
    }
    return n
}
function farsiKey(n) {
    return /^[\u0600-\u06FF\s]+$/.test(n) ? !1 : !0
}
function shuffle(n) {
    for (var t = n.length, i = 0, r; t--;)
        i = Math.floor(Math.random() * (t + 1)),
            r = n[t],
            n[t] = n[i],
            n[i] = r;
    return n
}
function cardReMask(n) {
    var n = normalize(n.trim());
    return n.replace(/#/g, "•")
}
function getBankName(n) {
    var t = panBins.some(t => t.bin === n) ? panBins.find(t => t.bin === n).bankName : null;
    return t ? t.trim().replace(/[^\w\s]/gi, "").replace(/ /g, "-").replace(/-{2,}/, "-").toLowerCase() : "unknown"
}
function validatorFormat(n, t, i) {
    return output = i ? n.replace("{0}", t).replace("{1}", i) : n.replace("{0}", t)
}
function cardSeparator(n) {
    return n.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()
}
function initApp() {
    if ($(".purchase-timer").length) {
        var n = document.querySelector("[data-timeout]") ? document.querySelector("[data-timeout]").getAttribute("data-timeout") : 6e5;
        $(".purchase-timer").startTimeoutAction({
            timeOut: parseInt(n),
            timeoutCallback: $("#frmCancel")
        })
    }
    $("input[name=SaveAfterPay]").length ? $("input[name=SaveAfterPay]").attr("checked", !0) : undefined;
    getCaptcha();
    getCardList()
}
function getCardList() {
    var n = $.ajax({
        url: serverUrl + "/Card/GetCards",
        method: "GET",
        data: {
            SessionKey: userSessionKey,
            AreaName: areaName,
            Culture: culture
        }
    });
    n.done(function (n) {
        var i = "", t = "", e = '<a href="javascript:void(0)" class="add-card" tabindex="0" aria-label="' + langs.addNewCard + '"><i class="icn-card-add"><\/i><span>' + langs.addNewCard + "<\/span><\/a>", o = '<a href="javascript:void(0)" class="manage-cards" tabindex="0" aria-label="' + langs.cardsManagement + '"><i class="icn-card-xcross"><\/i><span>' + langs.cardsManagement + "<\/span><\/a>", r, u, f;
        if ($(".card-list").empty(),
            n !== undefined && n !== null && n.HasError == !1) {
            r = ["بانک", "موسسه", "موسسه اعتباری", "قرض الحسنه"];
            u = new RegExp(r.join("|"), "gi");
            function f(n) {
                return hasValue(n) ? n.replace(u, "") : "&#8203;"
            }
            $.each(n.Data, function (n, r) {
                i = i + '<a href="javascript:void(0)" data-card="' + r.SubscriberCardId + '" data-expired="' + r.HasValidExpiredDate + '" data-owner="' + r.CardOwner + '" data-default="' + r.Selected + '" data-gift="' + r.IsGiftCard + '"  tabindex="0" aria-label="' + f(r.BankName) + " | " + cardSeparator(cardReMask(r.SecurePan)) + '" role="listitem"><img src="' + serverUrl + "/bundle/icn/banks/" + getBankName(r.SecurePan.substring(0, 6)) + '.svg" /><span class="card-num">' + cardSeparator(cardReMask(r.SecurePan)) + "<\/span><span>" + f(r.BankName) + "<\/span><\/a>";
                r.CanDeActive == !0 && (t = t + '<a href="javascript:void(0)" tabindex="0" aria-label="' + langs.deleteCard + " : " + cardSeparator(cardReMask(r.SecurePan)) + '"><div class="delete-card" data-pan="' + cardReMask(r.SecurePan) + '" data-card="' + r.SubscriberCardId + '"><i class="icn-bin"><\/i><span>' + langs.deleteCard + '<\/span><\/div><span class="card-num">' + cardSeparator(cardReMask(r.SecurePan)) + "<\/span><\/a>");
                r.Selected == !0 && fillCard({
                    panNumber: cardReMask(r.SecurePan),
                    subscriberCardId: r.SubscriberCardId,
                    cardOwner: r.CardOwner,
                    isGiftCard: r.IsGiftCard,
                    hasValidExpiredDate: r.HasValidExpiredDate
                })
            })
        }
        f = deActiveCardEnabled == "True" && hasValue(t) ? o : "";
        $(".card-list").append('<div id="scroll" class="card-enroll" role="list">' + i + '<\/div><div id="scroll" class="card-manager">' + t + '<\/div><div class="card-commander">' + e + f + "<\/div>");
        return
    })
}
function fillCard(n) {
    if (hasValue(n)) {
        var t = getBankName(n.panNumber.substring(0, 6));
        $("input[id=CardNumber_PanString]").val(cardSeparator(n.panNumber)).addClass("ignore unselect").siblings(".clear").fadeIn(300);
        $("input[id=SelectedCardId]").val(n.subscriberCardId);
        $("input[id=SelectedCardOwner]").val(n.cardOwner);
        $("input[id=Cvv2]").focus();
        n.hasValidExpiredDate ? $("input[id=Month]").val("••").removeClass("mono").addClass("ignore password") : $("input[id=Month]").val("").removeClass("ignore").removeClass("password");
        n.hasValidExpiredDate ? $("input[id=Year]").val("••").removeClass("mono").addClass("ignore password") : $("input[id=Year]").val("").removeClass("ignore").removeClass("password");
        isShortCvv();
        closeCardList();
        clearWrong($("input[id=CardNumber_PanString]"));
        n.isGiftCard ? showMessage($(".form"), giftCardHintMessage, "info", !0, "giftCard") : hideMessage("giftCard");
        t ? $(".card-logo").empty().append('<img src="' + serverUrl + "/bundle/icn/banks/" + t + '.svg" />').fadeIn(300) : $(".card-logo").fadeOut(300, function () {
            $(".card-logo").empty()
        })
    }
}
function purchaseValidate(n) {
    var t = getPurchaseFormData()
        , n = n ? !0 : !1;
    if (t.panNumber)
        t.subCardId && t.cardOwner;
    else
        return inputWrong($("input[id=CardNumber_PanString]"), validatorFormat(validatorMessages[culture].required, $("input[id=CardNumber_PanString]").attr("data-label"))),
            !1;
    if (t.cvv) {
        if (t.cvv.length < 3)
            return inputWrong($("input[id=Cvv2]"), validatorFormat(validatorMessages[culture].minlength, 3, null)),
                !1
    } else
        return inputWrong($("input[id=Cvv2]"), validatorFormat(validatorMessages[culture].required, $("input[id=Cvv2]").attr("data-label"))),
            !1;
    if (!t.expireMonth || !t.expireYear)
        return !1;
    if (t.captcha) {
        if (t.captcha.length < 5)
            return inputWrong($("input[id=CaptchaInputText]"), validatorFormat(validatorMessages[culture].minlength, 5, null)),
                !1
    } else
        return inputWrong($("input[id=CaptchaInputText]"), validatorFormat(validatorMessages[culture].required, $("input[id=CaptchaInputText]").attr("data-label"))),
            !1;
    if ($("input[id=Pin2]").length && !n)
        if (t.pin) {
            if (t.pin.length < 5)
                return inputWrong($("input[id=Pin2]"), validatorFormat(validatorMessages[culture].minlength, 5, null)),
                    !1
        } else
            return inputWrong($("input[id=Pin2]"), validatorFormat(validatorMessages[culture].required, $("input[id=Pin2]").attr("data-label"))),
                !1;
    return !0
}
function billPaymentValidate(n) {
    var n = n.closest(".inline-payment").find("input[id=Pin2]");
    if (n.length)
        if (n.val()) {
            if (n.val().length < 5)
                return inputWrong(n, validatorFormat(validatorMessages[culture].minlength, 5, null)),
                    !1
        } else
            return inputWrong(n, validatorFormat(validatorMessages[culture].required, n.attr("data-label"))),
                !1;
    return !0
}
function getPurchaseFormData() {
    var n = $("#frmPayment").serializeArray();
    return {
        action: n.some(n => n.name == "Action") ? n.find(n => n.name == "Action").value : "",
        culture: n.some(n => n.name == "Culture") ? n.find(n => n.name == "Culture").value : "",
        sessionKey: n.some(n => n.name == "SessionKey") ? n.find(n => n.name == "SessionKey").value : "",
        panNumber: n.some(n => n.name == "CardNumber.PanString") ? n.find(n => n.name == "CardNumber.PanString").value.replace(/\s/g, "") : "",
        subCardId: n.some(n => n.name == "SelectedCardId") ? n.find(n => n.name == "SelectedCardId").value : "",
        cardOwner: n.some(n => n.name == "SelectedCardOwner") ? n.find(n => n.name == "SelectedCardOwner").value : "",
        cvv: n.some(n => n.name == "Cvv2") ? n.find(n => n.name == "Cvv2").value : "",
        expireMonth: n.some(n => n.name == "Month") ? n.find(n => n.name == "Month").value : "",
        expireYear: n.some(n => n.name == "Year") ? n.find(n => n.name == "Year").value : "",
        captcha: n.some(n => n.name == "CaptchaInputText") ? n.find(n => n.name == "CaptchaInputText").value : "",
        pin: n.some(n => n.name == "Pin2") ? n.find(n => n.name == "Pin2").value : "",
        email: n.some(n => n.name == "Email") ? n.find(n => n.name == "Email").value : "",
        cellNumber: n.some(n => n.name == "CellNumber") ? n.find(n => n.name == "CellNumber").value : "",
        saveAfterPay: n.some(n => n.name == "SaveAfterPay") ? n.find(n => n.name == "SaveAfterPay").value : "",
        bills: n.some(n => n.name == "SelectedBill.Identifier") ? {
            identifier: n.some(n => n.name == "SelectedBill.Identifier") ? n.find(n => n.name == "SelectedBill.Identifier").value : "",
            billId: n.some(n => n.name == "SelectedBill.BillId") ? n.find(n => n.name == "SelectedBill.BillId").value : "",
            payId: n.some(n => n.name == "SelectedBill.PayId") ? n.find(n => n.name == "SelectedBill.PayId").value : "",
            amount: n.some(n => n.name == "SelectedBill.Amount") ? n.find(n => n.name == "SelectedBill.Amount").value : ""
        } : null
    }
}
function deleteCard(n, t, i) {
    hasValue(n) && hasValue(t) && hasValue(t) && $.ajax({
        url: serverUrl + "/Card/DeActiveCard",
        method: "POST",
        type: "json",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            SubscriberCardId: t,
            CellNumber: "0" + userCellNumber,
            SessionKey: userSessionKey,
            AreaName: "OnlinePG"
        }),
        beforeSend: function () {
            n.addClass("in-progress")
        },
        success: function (r) {
            if (r !== undefined && r !== null && r.HasError == !1) {
                n.remove();
                $(".card-manager li").length == 0 && ($(".manage-cards").remove(),
                    $(".card-manager").is(":visible") ? $(".dismiss-cards").remove() : undefined,
                    $(".card-manager").is(":visible") ? $(".add-card").show() & $(".manage-cards").show() : undefined,
                    $(".card-manager").is(":visible") ? $(".card-manager").hide() & $(".card-enroll").show() : undefined);
                $(".card-enroll li[data-card=" + t + "]").remove();
                var f = hasValue($("input[id=SelectedCardId]").val()) ? $("input[id=SelectedCardId]").val() : null
                    , u = hasValue($("input[id=CardNumber_PanString]").val()) ? $("input[id=CardNumber_PanString]").val().replace(/\s/g, "") : null;
                u && (u = u.substring(0, 6) + u.substring(6, 12).replace(/[0-9]/g, "•") + u.substring(12),
                    i.replace(/\s/g, "").startsWith(u) && $("input[id=CardNumber_PanString]").val("").removeClass("ignore").removeClass("unselect"));
                f && (clearWrong(),
                    clearSelectedCard(),
                    hideMessage("giftCard"))
            }
        },
        complete: function () {
            n.removeClass("in-progress")
        }
    })
}
function deleteEmail(n, t) {
    hasValue(n) && hasValue(t) && $.ajax({
        url: serverUrl + "/OnlinePG/Fa/Payment/RemoveEmail",
        method: "POST",
        type: "json",
        data: {
            SessionKey: userSessionKey,
            Email: t
        },
        beforeSend: function () {
            n.addClass("in-progress")
        },
        success: function (t) {
            t !== undefined && t !== null && t.Status < 1 && n.remove()
        },
        complete: function () {
            n.removeClass("in-progress")
        }
    })
}
function isShortCvv(n, t) {
    var n = n ? n : hasValue($("input[id=CardNumber_PanString]").val()) ? $("input[id=CardNumber_PanString]").val().replace(/\s/g, "") : null
        , i = 4
        , t = t ? !0 : !1;
    n && n.length >= 6 && [{
        bin: "621986"
    }].some(r => {
        r.bin == n.substring(0, 6) && (i = t ? 4 : 3)
    }
    );
    $("input[id=Cvv2]").attr("maxlength", i).attr("data-val-length-max", i)
}
function clearSelectedCard() {
    $(".clear").fadeOut(150);
    $(".card-logo").fadeOut(300, function () {
        $(".card-logo").empty()
    });
    $("input[id=CardNumber_PanString]").val("").removeClass("ignore").removeClass("unselect");
    $("input[id=SelectedCardId]").val("");
    $("input[id=SelectedCardOwner]").val("");
    $("input[id=Month]").val("").removeClass("ignore password");
    $("input[id=Year]").val("").removeClass("ignore password");
    $("input[id=Cvv2]").val("")
}
function checkFormError() {
    var n = 0;
    return $.each($("input"), function () {
        $(this).hasClass("wrong") || $(this).hasClass("input-validation-error") && !$(this).hasClass("ignore") ? ++n : undefined
    }),
        n == 0 ? !1 : !0
}
function freezeInput(n, t) {
    var i = hasValue(n) ? n : null, t = hasValue(t) ? !0 : !1, r, u;
    i && (typeof i.isArray ? $.each(i, function (n, i) {
        var r = $("input[id=" + i + "]").closest(".col").find(".clear")
            , u = $("input[id=" + i + "]").closest(".col").find(".action");
        r.length ? t ? r.removeClass("is-disabled") : r.addClass("is-disabled") : undefined;
        u.length ? t ? u.removeClass("is-disabled") : u.addClass("is-disabled") : undefined;
        t ? $("input[id=" + i + "]").prop("readonly", !1) : $("input[id=" + i + "]").prop("readonly", !0)
    }) : (r = $("input[id=" + value + "]").closest(".col").find(".clear"),
        u = $("input[id=" + value + "]").closest(".col").find(".action"),
        r.length ? t ? r.removeClass("is-disabled") : r.addClass("is-disabled") : undefined,
        u.length ? t ? u.removeClass("is-disabled") : u.addClass("is-disabled") : undefined,
        t ? $("input[id=" + i + "]").prop("readonly", !1) : $("input[id=" + i + "]").prop("readonly", !0)))
}
function closeLang() {
    $("body").hasClass("overlay") ? $("body").removeClass("overlay overlay-hack") : undefined;
    $(".lang-box").is(":visible") ? $(".lang-box").hasClass("bottom-sheet") ? $(".lang-box").css({
        bottom: -298
    }) : $(".lang-box").fadeOut(300) : undefined;
    $(".lang-box").hasClass("bottom-sheet") ? setTimeout(function () {
        $(".lang-box").hide().removeClass("bottom-sheet")
    }, 150) : undefined
}
function closeCardList() {
    $("body").hasClass("overlay") ? $("body").removeClass("overlay") : undefined;
    $(".card-enroll").is(":visible") ? $(".card-enroll").animate({
        scrollTop: 0
    }, 0) : undefined;
    $(".card-list").is(":visible") ? $(".action[data-relation=CardList]").attr("aria-pressed", "false") : undefined;
    $(".card-list").is(":visible") ? $(window).width() <= 768 && $(".card-list").hasClass("bottom-sheet") ? $(".card-list").css({
        bottom: -298
    }) : $(".card-list").fadeOut(300) : undefined;
    $(".card-list").hasClass("bottom-sheet") ? setTimeout(function () {
        $(".card-list").hide().removeClass("bottom-sheet")
    }, 150) : undefined;
    $(".card-manager").is(":visible") ? $(".card-manager").animate({
        scrollTop: 0
    }, 0) : undefined;
    $(".card-manager").is(":visible") ? setTimeout(function () {
        $(".card-manager").hide() & $(".card-enroll").show()
    }, 220) : undefined;
    $(".card-manager").is(":visible") ? setTimeout(function () {
        $(".dismiss-cards").remove()
    }, 220) : undefined;
    setTimeout(function () {
        $(".card-list").removeAttr("style") & $(".card-list a").removeAttr("style")
    }, 220)
}
function filterCardList(n = false) {
    var i = hasValue($("input[id=CardNumber_PanString]").val()) ? $("input[id=CardNumber_PanString]").val().replace(/\s/g, "") : null
        , t = null;
    return i && (t = 0,
        $(".card-enroll li").each(function () {
            if (n)
                t++;
            else if ($(".card-enroll").is(":visible")) {
                var r = i.toString()
                    , u = r.substring(0, 6) + r.substring(6, 12).replace(/[0-9]/g, "•") + r.substring(12);
                $(this).children(".card-num").text().replace(/\s/g, "").startsWith(u) ? $(this).fadeIn(300) & t++ : $(this).hide()
            }
        })),
        t
}
function closeDialog() {
    $("body").hasClass("overlay") ? setTimeout(function () {
        $("body").removeClass("overlay")
    }, 200) : undefined;
    $(".dialog").is(":visible") ? $(window).width() <= 768 ? $(".dialog").css({
        bottom: -378
    }) : $(".dialog").fadeOut(300) : undefined;
    $(".dialog").hasClass("bottom-sheet") ? setTimeout(function () {
        $(".dialog").hide().removeClass("bottom-sheet") & $(".dialog").removeAttr("style")
    }, 150) : undefined
}
function inputWrong(n, t) {
    hasValue(n) && hasValue(t) && !n.hasClass("input-validation-error") && (n.hasClass("wrong") ? undefined : n.addClass("wrong"),
        n.closest(".input-holder").length ? (n.closest(".input-holder").children(".custom-wrong").remove(),
            n.closest(".input-holder").append('<div class="input-wrong custom-wrong" role="alert" aria-live="polite"><p>' + t + "<\/p><\/div>")) : (n.closest(".col").children(".custom-wrong").remove(),
                n.closest(".col").append('<div class="input-wrong custom-wrong" role="alert" aria-live="polite"><p>' + t + "<\/p><\/div>")))
}
function inputValid(n) {
    hasValue(n) && (n.removeClass("wrong"),
        n.closest(".col").children(".custom-wrong").remove())
}
function clearWrong(n, t = false) {
    hasValue(n) && !n.hasClass("input-validation-error") ? (n.closest(".col").children(".custom-wrong").remove(),
        n.closest(".inline-payment").find("input").length ? (n.closest(".inline-payment").find("input").hasClass("wrong") ? n.closest(".inline-payment").find("input").removeClass("wrong") : undefined,
            setTimeout(function () {
                n.closest(".inline-payment").find(".input-wrong") ? n.closest(".inline-payment").find(".input-wrong").remove() : undefined
            }, 5)) : t ? n.closest(".col").find(".input-wrong").remove() : undefined,
        n.hasClass("wrong") ? n.removeClass("wrong") : undefined) : setTimeout(function () {
            document.querySelectorAll("input:not([type=hidden])").forEach(function (n) {
                n.classList.remove("wrong");
                n.closest(".col").querySelector(".custom-wrong") ? n.closest(".col").querySelector(".custom-wrong").remove() : undefined
            });
            document.querySelectorAll(".input-wrong").forEach(function (n) {
                n.classList.remove("input-validation-error");
                n.closest(".col").querySelector(".ignore:not([type=hidden])") ? n.closest(".col").querySelector(".input-wrong span") ? n.closest(".col").querySelector(".input-wrong span").remove() : undefined : undefined
            })
        }, 5)
}
function showMessage(n, t, i, r, u, f = false) {
    if (hasValue(n) && hasValue(t)) {
        if (i = i ? i : "success",
            r = r ? !0 : !1,
            u = u ? u : "none",
            f)
            return n.find(".message").first().hide().remove(),
                n.parents("td").children(".message").first().hide().remove(),
                i == "success" ? (n.find("td:last").prepend('<div class="message ' + i + ' its-ok" data-hint="' + u + '"><p>' + t + "<\/p><\/div>"),
                    n.parents("td").prepend('<div class="message ' + i + ' its-ok" data-hint="' + u + '"><p>' + t + "<\/p><\/div>")) : (n.find("td:last").prepend('<div class="message ' + i + '" data-hint="' + u + '"><p>' + t + "<\/p><\/div>"),
                        n.parents("td").prepend('<div class="message ' + i + '" data-hint="' + u + '"><p>' + t + "<\/p><\/div>")),
                !1;
        r ? ($(".form").children(".message").first().hide().remove(),
            $(".form").prepend('<div class="message hide ' + i + ' has-xcross" data-hint="' + u + '"><p>' + t + "<\/p><\/div>"),
            $(".form").children(".message").fadeIn(300)) : (n.closest(".row").next(".message").hide().remove(),
                n.closest(".row").next(".row").before('<div class="message hide ' + i + ' has-xcross"><p>' + t + "<\/p><\/div>"),
                n.closest(".row").next(".message").fadeIn(300))
    }
}
function hideMessage(n) {
    hasValue(n) && ($(".message[data-hint=" + n + "]") ? $(".message[data-hint=" + n + "]").hide().remove() : undefined)
}
function showNumPad(n) {
    if (hasValue(n)) {
        var i = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
            , t = "";
        for (inc = 0; inc < 12; inc++)
            switch (inc) {
                case 7:
                    t += '<button id="EraserKey" name="EraserKey" class="num-key eraser-key" role="button" tabindex="0" aria-label="Eraser"><i class="icn-eraser"><\/i><\/button>';
                    break;
                case 11:
                    t += '<button id="BackspaseKey" name="BackspaseKey" class="num-key backspase-key" role="button" tabindex="0" aria-label="Backspase"><i class="icn-backspase"><\/i><\/button>';
                    break;
                default:
                    t += '<button id="NumberKey' + i[inc > 7 ? inc - 1 : inc] + '" name="NumberKey' + i[inc > 7 ? inc - 1 : inc] + '" class="num-key" role="button" tabindex="0" aria-label="Number ' + i[inc > 7 ? inc - 1 : inc] + '">' + i[inc > 7 ? inc - 1 : inc] + "<\/button>"
            }
        n.closest(".inline-payment").length ? n.closest(".inline-payment").prepend('<div class="numpad"><span>' + langs.virtualNumPad + '<\/span><div class="keypad">' + t + '<\/div><button id="CloseNumpad" name="CloseNumpad" type="button" class="icn-button icn-xcross xcross" role="button" tabindex="0" aria-label="بستن" /><\/div>') : n.closest(".col").append('<div class="numpad"><span>' + langs.virtualNumPad + '<\/span><div class="keypad">' + t + '<\/div><button id="CloseNumpad" name="CloseNumpad" type="button" class="icn-button icn-xcross xcross" role="button" tabindex="0" aria-label="بستن" /><\/div>');
        $(window).width() <= 768 ? ($(".numpad").hasClass("bottom-sheet") ? undefined : $(".numpad").addClass("bottom-sheet"),
            $(".numpad").is(":visible") ? undefined : $(".numpad").fadeIn(5).css({
                bottom: 0
            })) : $(".numpad").is(":visible") ? undefined : $(".numpad").fadeIn(300);
        $(n).attr("aria-pressed", "true")
    }
}
function closeNumPad(n = false) {
    $(".numpad").prev().prev(".input-group").find(".action").attr("aria-pressed", "false");
    $(".numpad").prev().prev(".input-holder").find(".action").attr("aria-pressed", "false");
    $(".numpad").is(":visible") ? $(".numpad").hasClass("bottom-sheet") ? $(".numpad").css({
        bottom: -312
    }) : $(".numpad").fadeOut(300) : undefined;
    n ? $(".numpad").remove() : setTimeout(function () {
        $(".numpad").remove()
    }, 150)
}
function autoPay() {
    var t, i, n;
    $(".batch").length && (t = document.querySelector("[data-method]") ? document.querySelector("[data-method]").getAttribute("data-method") : null,
        t && t == "Static" && (i = $(".bill-payment tr").map(function () {
            return this.getAttribute("data-bill") && this.getAttribute("data-identifier") && this.getAttribute("data-state") == "InProgress" ? {
                element: this,
                billId: this.getAttribute("data-bill"),
                paymentId: this.getAttribute("data-pay"),
                amount: this.getAttribute("data-amount"),
                identifier: this.getAttribute("data-identifier"),
                state: this.getAttribute("data-state")
            } : null
        }).get(),
            hasValue(i) && (n = i[0],
                n.state == "InProgress" && $.ajax({
                    url: serverUrl + "/OnlinePg/" + culture + "/Payment/PayBill",
                    method: "POST",
                    type: "json",
                    dataType: "json",
                    cache: !1,
                    async: !1,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        SessionKey: userSessionKey,
                        AreaName: areaName,
                        Bill: {
                            Identifier: n.identifier,
                            BillId: n.billId,
                            PayId: n.paymentId,
                            Amount: n.amount
                        }
                    }),
                    beforeSend: function () {
                        $(n.element).addClass("in-progress");
                        $(".button").each(function () {
                            $(this).hasClass("in-progress") || $(this).addClass("is-disabled")
                        })
                    },
                    success: function (t) {
                        if (t !== undefined && t !== null && t.HasError == !1)
                            showMessage($(n.element), langs.successPayment, null, null, null, !0, !0, n.identifier),
                                $("#" + n.identifier).find(".rrn").text(t.Data.Rrn),
                                $("#" + n.identifier).find(".ref").text(t.Data.RefNum),
                                $("#" + n.identifier).find(".time").text(t.Data.PPayTime),
                                $("#" + n.identifier).find(".trace").text(t.Data.TraceNo),
                                $("#" + n.identifier).prev("tr").addClass("is-show"),
                                $("#" + n.identifier).addClass("is-show");
                        else {
                            var i = t.hasOwnProperty("Message") ? hasValue(t.Message) ? t.Message : langs.errorProgress : langs.errorProgress;
                            t.hasOwnProperty("ValidationErrors") && hasValue(t.ValidationErrors) && $.isArray(t.ValidationErrors) && (i = t.ValidationErrors[0].ErrorMessages[0]);
                            showMessage($(n.element), i, "danger", null, null, !0)
                        }
                    },
                    error: function () {
                        showMessage($(n.element), langs.serviceUnavailable, "danger", null, null, !0)
                    },
                    complete: function () {
                        $(n.element).attr("data-state", "OK");
                        $(n.element).removeClass("in-progress");
                        $(".button").each(function () {
                            $(this).hasClass("is-disabled") && $(this).removeClass("is-disabled")
                        });
                        setTimeout(function () {
                            autoPay()
                        }, 500)
                    }
                }))))
}
var validatorMessages = {
    en: {
        required: "{0} field is required",
        number: "Please enter a valid number",
        digits: "Please enter only digits",
        maxlength: "Please enter no more than {0} characters",
        minlength: "Please enter at least {0} characters",
        range: "Please enter a value between {0} and {1}",
        max: "Please enter a value less than or equal to {0}",
        min: "Please enter a value greater than or equal to {0}",
        pan: "The entered card number is not correct",
        pin2: "The entered pin2 is not correct"
    },
    fa: {
        required: "تکمیل {0} اجباری است",
        number: "لطفا عدد صحیح وارد کنید",
        digits: "لطفا تنها رقم وارد کنید",
        maxlength: "لطفا بیشتر از {0} حرف وارد نکنید",
        minlength: "لطفا کمتر از {0} حرف وارد نکنید",
        range: "لطفا مقداری بین {0} تا {1} حرف وارد کنید",
        max: "لطفا مقداری کمتر از {0} وارد کنید",
        min: "لطفا مقداری بیشتر از {0} وارد کنید",
        pan: "شماره کارت وارد شده صحیح نیست",
        pin2: "رمز دوم وارد شده صحیح نیست"
    }
};
$(document).ready(function () {
    var n, t;
    $(window).scroll(function () {
        $(".nav").length && !$("body").hasClass("overlay") ? $(document).scrollTop() > 64 ? $(".header").addClass("scrolled") : $(".header").removeClass("scrolled") : undefined
    });
    $(window).resize(function () {
        $(window).width() > 768 && ($("*:not(i, tr)").removeAttr("style").removeClass("bottom-sheet"),
            $("body").hasClass("overlay") ? $("body").removeClass("overlay") : undefined,
            $("body").hasClass("overlay-hack") ? $("body").removeClass("overlay-hack") : undefined,
            $(".action[data-relation=MerchantInfo]").removeClass("rotate-180").text(langs.more))
    });
    $(document).on("click", function (n) {
        $(".lang-box").length && $(".lang-box").is(":visible") && !$(n.target).closest(".bottom-sheet").length && !$(n.target).closest(".lang").length ? closeLang() : undefined;
        $(".dialog").length && $(".dialog").is(":visible") ? !$(n.target).closest(".dialog").length && !$(n.target).closest(".button").length ? closeDialog() : undefined : undefined;
        $(".email-list").length && $(".email-list").is(":visible") ? !$(n.target).closest("input").length && !$(n.target).closest(".delete").length ? $(".email-list").fadeOut(300) : undefined : undefined;
        $(".numpad").length && $(".numpad").is(":visible") && !$(n.target).closest(".numpad").length && !$(n.target).closest(".action").length && !$(n.target).closest("input").length ? closeNumPad() : undefined;
        $(".card-list").length && $(".card-list").is(":visible") ? !$(n.target).closest(".action").length && !$(n.target).closest("input").length && !$(n.target).closest(".bottom-sheet").length ? closeCardList() : undefined : undefined
    });
    if ($(document).keydown(function (n) {
        var i, t;
        switch (n.which) {
            case 27:
                $(".numpad").length && $(".numpad").is(":visible") ? closeNumPad() : undefined;
                $(".dialog").length && $(".dialog").is(":visible") ? closeDialog() : undefined;
                $(".lang-box").length && $(".lang-box").is(":visible") ? closeLang() : undefined;
                $(".card-list").length && $(".card-list").is(":visible") ? closeCardList() : undefined;
                break;
            case 38:
            case 40:
                if ($(".card-list").length && $(".card-list").is(":visible")) {
                    i = $(".card-list a").length;
                    i && ($(".card-list a").hasClass("hover") ? (t = null,
                        $(".card-list a").each(function (n) {
                            $(this).hasClass("hover") && (t = n)
                        }),
                        charCode == 38 && t != 0 && ($(".card-list div").animate({
                            scrollTop: t * 50 - 50
                        }, 100),
                            $(".card-list a").removeClass("hover") & $(".card-list a").eq(t - 1).addClass("hover")),
                        charCode == 40 && t != i - 2 && ($(".card-list div").animate({
                            scrollTop: t * 50
                        }, 100),
                            $(".card-list a").removeClass("hover") & $(".card-list a").eq(t + 1).addClass("hover"))) : ($(".card-list div").animate({
                                scrollTop: 0
                            }, 500),
                                $(".card-list a:first").addClass("hover")));
                    break
                }
        }
    }),
        $(".lang").length) {
        $(document).on("click", ".lang .switch", function () {
            $("body").hasClass("freeze") || ($(window).width() <= 768 ? ($("body").hasClass("overlay overlay-hack") ? undefined : $("body").addClass("overlay overlay-hack"),
                $(".lang-box").hasClass("bottom-sheet") ? undefined : $(".lang-box").addClass("bottom-sheet"),
                $(".lang-box").is(":visible") ? undefined : $(".lang-box").fadeIn(5).css({
                    bottom: 0
                })) : $(".lang-box").is(":visible") ? $(".lang-box").fadeOut(300) : $(".lang-box").fadeIn(300))
        });
        $(document).on("click", ".lang .xcross", function () {
            closeLang()
        })
    }
    if ($(".lang-box").length)
        $(document).on("click", ".lang-box .item", function () {
            if (!$("body").hasClass("freeze")) {
                var n = hasValue($(this).attr("data-cultre")) ? $(this).attr("data-cultre") : null;
                $(this).hasClass("current") || ($("input[id=Culture]").val(n),
                    document.getElementById("frmCulture").submit())
            }
        });
    if ($(".card-list").length)
        $(document).on("click", ".card-list a, .dismiss-cards", function (n) {
            var r, t, i;
            if (!$("body").hasClass("freeze")) {
                if ($(this).hasClass("add-card"))
                    return clearSelectedCard(),
                        closeCardList(),
                        $(".card-manager").is(":visible") ? $(".card-manager").hide() & $(".card-enroll").show() : undefined,
                        $("input[id=CardNumber_PanString]").focus(),
                        !1;
                if ($(this).hasClass("manage-cards"))
                    return r = '<div class="dismiss-cards"><button id="DismissCard" name="DismissCard" type="button" class="dismiss" role="button" tabindex="0" aria-label="' + langs.neverMind + '">' + langs.neverMind + "<\/button><\/div>",
                        $(".card-enroll").is(":visible") ? $(".card-commander").append(r) : undefined,
                        $(".card-enroll").is(":visible") ? $(".add-card").hide() & $(".manage-cards").hide() : undefined,
                        $(".card-enroll").is(":visible") ? $(".card-enroll").hide() & $(".card-manager").show() : undefined,
                        !1;
                if ($(this).hasClass("dismiss-cards"))
                    return $(n.target).closest(".dismiss").length && ($(".card-manager").is(":visible") ? $(".dismiss-cards").remove() : undefined,
                        $(".card-manager").is(":visible") ? $(".add-card").show() & $(".manage-cards").show() : undefined,
                        $(".card-manager").is(":visible") ? $(".card-manager").hide() & $(".card-enroll").show() : undefined),
                        !1;
                if ($(this).find(".delete-card").length > 0)
                    return $(n.target).closest(".delete-card").length && (t = hasValue($(this).find(".delete-card").attr("data-card")) ? $(this).find(".delete-card").attr("data-card") : null,
                        i = hasValue($(this).find(".delete-card").attr("data-card")) ? $(this).find(".delete-card").attr("data-pan") : null,
                        deleteCard($(this), t, i)),
                        !1;
                var i = hasValue($(this).children(".card-num").text().replace(/\s/g, "")) ? $(this).children(".card-num").text().replace(/\s/g, "") : null
                    , t = hasValue($(this).attr("data-card")) ? $(this).attr("data-card") : null
                    , u = hasValue($(this).attr("data-owner")) ? $(this).attr("data-owner") : null
                    , f = hasValue($(this).attr("data-gift")) ? $(this).attr("data-gift") == "true" : null
                    , e = hasValue($(this).attr("data-expired")) ? $(this).attr("data-expired") == "true" : null;
                fillCard({
                    panNumber: i,
                    subscriberCardId: t,
                    cardOwner: u,
                    isGiftCard: f,
                    hasValidExpiredDate: e
                });
                $(".card-list a").removeClass("hover") & $(this).addClass("hover")
            }
        });
    if ($(".email-list").length)
        $(document).on("click", ".email-list a", function (n) {
            var t;
            $("body").hasClass("freeze") || ($(n.target).closest(".delete").length ? (t = $(n.target).parent("a").children(".email").text().replace(/\s/g, ""),
                $(n.target).parent("a").hasClass("in-progress") ? undefined : deleteEmail($(n.target).parent("a"), t)) : (t = $(this).children(".email").text().replace(/\s/g, ""),
                    $("input[id=Email]").val(t),
                    $(".email-list").is(":visible") ? $(".email-list").fadeOut(300) : undefined))
        });
    if ($(".dialog").length)
        $(document).on("click", ".dialog .xcross", function () {
            closeDialog()
        });
    if ($(".knowledge").length)
        $(document).on("click", ".knowledge .head", function () {
            if ($(window).width() <= 768) {
                var n = $(this).nextAll(".knowledge-list");
                n.length ? n.is(":visible") ? n.slideUp(250) : n.slideDown(250) : undefined
            }
        });
    if ($(".bill-toggle").length)
        $(document).on("click", ".bill-toggle", function () {
            var n = $(".active").not(this);
            n.toggleClass("active").next(".frame").slideToggle(300);
            $(this).toggleClass("active").next().slideToggle("fast")
        });
    if ($(".action").length)
        $(document).on("click", ".action", function (n) {
            var i, t, r;
            if (!$("body").hasClass("freeze") && !$(this).hasClass("is-disabled") && !$(this).hasClass("in-progress") && !$(this).parent().find("input").is(":disabled") && (i = hasValue($(this).attr("data-relation")) ? $(this).attr("data-relation").trim() : null,
                i))
                switch (i) {
                    case "CardList":
                        $(".card-logo").is(":visible") || (closeNumPad(),
                            t = filterCardList(!0),
                            $(window).width() <= 768 ? (t == null || t > 0) && ($("body").hasClass("overlay") ? undefined : $("body").addClass("overlay"),
                                $(".card-list").hasClass("bottom-sheet") ? undefined : $(".card-list").addClass("bottom-sheet"),
                                $(".card-list").is(":visible") ? $(".card-list").css({
                                    bottom: 0
                                }) : $(".card-list").fadeIn(5).css({
                                    bottom: 0
                                }) & $(this).attr("aria-pressed", "true"),
                                clearWrong("#CardNumber_PanString")) : ($(".card-list").is(":visible") ? closeCardList() : t == null || t > 0 ? $(".card-list").fadeIn(300) & $(this).attr("aria-pressed", "true") : undefined,
                                    clearWrong("#CardNumber_PanString")));
                        break;
                    case "VirtualKeypad":
                        r = $(this);
                        $(".numpad").is(":visible") ? $(this).closest(".col").find(".numpad").length || $(this).closest(".inline-payment").find(".numpad").length ? closeNumPad() : closeNumPad() & setTimeout(function () {
                            showNumPad(r)
                        }, 450) : showNumPad(r);
                        break;
                    case "ReloadCaptcha":
                        $("audio").each(function () {
                            this.pause();
                            this.currentTime = 0
                        });
                        getCaptcha();
                        $("input[id=CaptchaInputText]").val("").focus();
                        break;
                    case "PlayCaptchaAudio":
                        $("input[id=CaptchaInputText]").val("").focus();
                        $("#CaptchaAudio").attr("src", serverUrl + "/captcha/play?sessionKey=" + userSessionKey + "&culture=" + culture + "&areaName=" + areaName);
                        const n = $("audio");
                        n.get(0).load();
                        n.get(0).play();
                        break;
                    case "MerchantInfo":
                        $(".merchant-info").is(":visible") ? $(this).removeClass("rotate-180").text(langs.more) : $(this).addClass("rotate-180").text(langs.less);
                        $(".merchant-info").is(":visible") ? $(this).attr("aria-label", langs.more) : $(this).attr("aria-label", langs.less);
                        $(".merchant-info").is(":visible") ? $(".merchant-info").slideUp(250) : $(".merchant-info").slideDown(250);
                        break;
                    case "MoreDescBtn":
                        $(".terminal-description").hasClass("visible") ? $(".terminal-description").removeClass("visible") : $(".terminal-description").addClass("visible");
                        $(".terminal-description").hasClass("visible") ? $(this).text(langs.less) : $(this).text(langs.more);
                        $(".terminal-description").hasClass("visible") ? $(this).attr("aria-label", langs.less) : $(this).attr("aria-label", langs.more);
                        break;
                    case "MoreTrxDetail":
                        $(this).hasClass("showed") ? $(this).text(langs.more) : $(this).text(langs.less);
                        $(this).hasClass("showed") ? $(".receipt-info").removeClass("showed") : $(".receipt-info").addClass("showed");
                        $(this).hasClass("showed") ? $(this).removeClass("showed") : $(this).addClass("showed")
                }
            n.preventDefault()
        });
    if ($(".checkbox").length) {
        $(document).on("click", ".checkbox", function (n) {
            if (!$("body").hasClass("freeze")) {
                var t = hasValue($(this).attr("data-relation")) ? $(this).attr("data-relation").trim() : null;
                if (t)
                    switch (t) {
                        case "SendReceipt":
                            $(this).closest(".row").fadeOut(250);
                            setTimeout(function () {
                                $(this).closest(".row").remove();
                                $("div[data-relation=SendReceipt]").is(":visible") ? undefined : $("div[data-relation=SendReceipt]").slideDown(250)
                            }, 250);
                            break;
                        case "SaveCard":
                            $(this).hasClass("checked") ? $(this).parent().find("input").attr("checked", !1) : $(this).parent().find("input").attr("checked", !0);
                            $(this).hasClass("checked") ? $(this).attr("aria-checked", "false") : $(this).attr("aria-checked", "true");
                            $(this).hasClass("checked") ? $(this).removeClass("checked") : $(this).addClass("checked")
                    }
            }
            n.preventDefault()
        });
        $(document).on("keydown", ".checkbox", function (n) {
            if (!$("body").hasClass("freeze")) {
                var t = n.which ? n.which : n.keyCode
                    , i = hasValue($(this).attr("data-relation")) ? $(this).attr("data-relation").trim() : null;
                if (i && t && (t == 13 || t == 32)) {
                    switch (i) {
                        case "SendReceipt":
                            $(this).closest(".row").fadeOut(250);
                            setTimeout(function () {
                                $(this).closest(".row").remove();
                                $("div[data-relation=SendReceipt]").is(":visible") ? undefined : $("div[data-relation=SendReceipt]").slideDown(250)
                            }, 250);
                            break;
                        case "SaveCard":
                            $(this).hasClass("checked") ? $(this).parent().find("input").attr("checked", !1) : $(this).parent().find("input").attr("checked", !0);
                            $(this).hasClass("checked") ? $(this).attr("aria-checked", "false") : $(this).attr("aria-checked", "true");
                            $(this).hasClass("checked") ? $(this).removeClass("checked") : $(this).addClass("checked")
                    }
                    n.preventDefault()
                }
            }
        })
    }
    if ($(".purchase").length) {
        initApp();
        $(document).on("click", ".message", function () {
            if ($(this).hasClass("has-xcross")) {
                var n = $(this);
                n.fadeOut(150);
                setTimeout(function () {
                    n.remove()
                }, 300)
            }
        })
    }
    if ($(".batch").length) {
        initApp();
        autoPay();
        $(document).on("click", ".message", function () {
            if ($(this).hasClass("has-xcross")) {
                var n = $(this);
                n.fadeOut(150);
                setTimeout(function () {
                    n.remove()
                }, 300)
            }
        })
    }
    if ($(".receipt").length && $(".callback-timer").length && (n = document.querySelector("[data-timeout]") ? document.querySelector("[data-timeout]").getAttribute("data-timeout") : 2e5,
        $(".callback-timer").startTimeoutAction({
            timeOut: parseInt(n),
            timeoutCallback: $("#frmReturn")
        })),
        $(".button").length)
        $(document).on("click", ".button", function (n) {
            var t, e, s, o;
            if (!$("body").hasClass("freeze") && !$(this).hasClass("is-disabled") && !$(this).hasClass("in-progress") && (t = $(this),
                e = hasValue($(this).attr("data-action")) ? $(this).attr("data-action").trim() : null,
                e))
                switch (e) {
                    case "Otp":
                        if ($("input[id=Pin2]").addClass("ignore").removeClass("wrong").focus(),
                            $("input[id=Pin2]").closest(".col").find(".custom-wrong") ? $("input[id=Pin2]").closest(".col").find(".custom-wrong").remove() : undefined,
                            $("input[id=Pin2]").closest(".col").find(".ignore:not([type=hidden])") ? $("input[id=Pin2]").closest(".col").find(".input-wrong span") ? $("input[id=Pin2]").closest(".col").find(".input-wrong span").remove() : undefined : undefined,
                            $("input[id=Month]").val() == "••" ? $("input[id=Month]").addClass("ignore").removeClass("wrong") : $("input[id=Month]").removeClass("ignore"),
                            $("input[id=Year]").val() == "••" ? $("input[id=Year]").addClass("ignore").removeClass("wrong") : $("input[id=Year]").removeClass("ignore"),
                            $("#frmPayment").validate({
                                onkeyup: !0
                            }).settings.ignore = ".ignore",
                            otpSettings.maxTriesCount <= 0)
                            return $(this).addClass("is-disabled"),
                                !1;
                        if (!$("#frmPayment").valid() || checkFormError())
                            return setTimeout(function () {
                                $(".input-validation-error:not(.ignore):first").focus()
                            }, 500),
                                $(".validation-summary-errors").length ? $(".validation-summary-errors").remove() : undefined,
                                $("html, body").animate({
                                    scrollTop: $(".input-validation-error").offset().top - 150
                                }, 1e3),
                                !1;
                        setTimeout(function () {
                            if (purchaseValidate(!0)) {
                                var t = new otpRequestModel
                                    , n = getPurchaseFormData()
                                    , i = n.subCardId && n.cardOwner ? !0 : !1
                                    , t = {
                                        Pan: i ? "" : n.panNumber,
                                        SessionKey: userSessionKey,
                                        AreaName: areaName,
                                        SubCardId: n.subCardId,
                                        CaptchaInputText: n.captcha,
                                        CardOwner: n.cardOwner
                                    };
                                hasValue(n.bills) && (t["SelectedBill.Identifier"] = n.bills.identifier,
                                    t["SelectedBill.BillId"] = n.bills.billId,
                                    t["SelectedBill.PayId"] = n.bills.payId,
                                    t["SelectedBill.Amount"] = n.bills.amount);
                                sendOtpRequest(t, i)
                            }
                        }, 5);
                        n.preventDefault();
                        break;
                    case "BillOtp":
                        if ($(this).closest(".inline-payment").find("input[id=Pin2]").removeClass("wrong").focus(),
                            $(this).closest(".inline-payment").find(".custom-wrong") ? $(this).closest(".inline-payment").find(".custom-wrong").remove() : undefined,
                            $(this).closest(".inline-payment").find(".input-wrong span") ? $(this).closest(".inline-payment").find(".input-wrong span").remove() : undefined,
                            otpSettings.maxTriesCount <= 0)
                            return $(this).addClass("is-disabled"),
                                !1;
                        var s = new otpRequestModel
                            , i = hasValue($(this).attr("data-identifier")) ? $(this).attr("data-identifier").trim() : null
                            , r = hasValue($(this).attr("data-bill")) ? $(this).attr("data-bill").trim() : null
                            , u = hasValue($(this).attr("data-pay")) ? $(this).attr("data-pay").trim() : null
                            , f = hasValue($(this).attr("data-amount")) ? $(this).attr("data-amount").trim() : null;
                        if (!i || !r || !u || !f)
                            return showMessage($(this), langs.errorProgress, "danger", null, null, !0),
                                !1;
                        s = {
                            Pan: null,
                            SessionKey: userSessionKey,
                            AreaName: areaName,
                            SubCardId: null,
                            CaptchaInputText: null,
                            CardOwner: null,
                            SelectedBill: {
                                Identifier: i,
                                BillId: r,
                                PayId: u,
                                Amount: f
                            }
                        };
                        sendOtpRequest(s, null, !0, t);
                        n.preventDefault();
                        break;
                    case "Purchase":
                        if ($("input[id=Pin2]").removeClass("ignore"),
                            $("input[id=Month]").val() == "••" ? $("input[id=Month]").addClass("ignore").removeClass("wrong") : $("input[id=Month]").removeClass("ignore"),
                            $("input[id=Year]").val() == "••" ? $("input[id=Year]").addClass("ignore").removeClass("wrong") : $("input[id=Year]").removeClass("ignore"),
                            $("#frmPayment").validate({
                                onkeyup: !0
                            }).settings.ignore = ".ignore",
                            !$("#frmPayment").valid() || checkFormError())
                            return setTimeout(function () {
                                $(".input-validation-error:not(.ignore):first").focus()
                            }, 500),
                                $(".validation-summary-errors").length ? $(".validation-summary-errors").remove() : undefined,
                                $("html, body").animate({
                                    scrollTop: $(".input-validation-error").offset().top - 150
                                }, 1e3),
                                !1;
                        setTimeout(function () {
                            if (purchaseValidate()) {
                                var n = getPurchaseFormData()
                                    , i = {
                                        Action: n.action,
                                        Culture: n.culture,
                                        SessionKey: n.sessionKey,
                                        "CardNumber.PanString": n.subCardId && n.cardOwner ? null : n.panNumber,
                                        SelectedCardId: n.subCardId,
                                        SelectedCardOwner: n.cardOwner,
                                        Cvv2: n.cvv,
                                        Month: n.expireMonth == "••" ? null : n.expireMonth,
                                        Year: n.expireYear == "••" ? null : n.expireYear,
                                        CaptchaInputText: n.captcha,
                                        Pin2: n.pin,
                                        Email: n.email,
                                        CellNumber: n.cellNumber,
                                        SaveAfterPay: n.saveAfterPay == "true"
                                    };
                                hasValue(n.bills) && (i["SelectedBill.Identifier"] = n.bills.identifier,
                                    i["SelectedBill.BillId"] = n.bills.billId,
                                    i["SelectedBill.PayId"] = n.bills.payId,
                                    i["SelectedBill.Amount"] = n.bills.amount);
                                t.addClass("in-progress");
                                $(".purchase-timer").stopTimeoutAction();
                                $.redirect(serverUrl + "/OnlinePG", i, "POST")
                            }
                        }, 5);
                        n.preventDefault();
                        break;
                    case "BillPayment":
                        var i = hasValue($(this).attr("data-identifier")) ? $(this).attr("data-identifier").trim() : null
                            , r = hasValue($(this).attr("data-bill")) ? $(this).attr("data-bill").trim() : null
                            , u = hasValue($(this).attr("data-pay")) ? $(this).attr("data-pay").trim() : null
                            , f = hasValue($(this).attr("data-amount")) ? $(this).attr("data-amount").trim() : null
                            , h = hasValue($(this).closest(".inline-payment").find("input[id=Pin2]")) ? $(this).closest(".inline-payment").find("input[id=Pin2]").val().trim() : null;
                        if (!i || !r || !u || !f)
                            return showMessage($(this), langs.errorProgress, "danger", null, null, !0),
                                !1;
                        billPaymentValidate(t) && $.ajax({
                            url: serverUrl + "/OnlinePg/" + culture + "/Payment/PayBill",
                            method: "POST",
                            type: "json",
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({
                                SessionKey: userSessionKey,
                                AreaName: areaName,
                                Pin2: h,
                                Bill: {
                                    Identifier: i,
                                    BillId: r,
                                    PayId: u,
                                    Amount: f
                                }
                            }),
                            beforeSend: function () {
                                t.addClass("in-progress");
                                $(".button").each(function () {
                                    $(this).hasClass("in-progress") || $(this).addClass("is-disabled")
                                })
                            },
                            success: function (n) {
                                if (n !== undefined && n !== null && n.HasError == !1)
                                    showMessage(t, langs.successPayment, null, null, null, !0, !0, i),
                                        t.closest(".inline-payment").remove(),
                                        $("#" + i).find(".rrn").text(n.Data.Rrn),
                                        $("#" + i).find(".ref").text(n.Data.RefNum),
                                        $("#" + i).find(".time").text(n.Data.PPayTime),
                                        $("#" + i).find(".trace").text(n.Data.TraceNo),
                                        $("#" + i).prev("tr").addClass("is-show"),
                                        $("#" + i).addClass("is-show"),
                                        $(".password").each(function () {
                                            $(this).removeAttr("disabled")
                                        });
                                else {
                                    var r = n.hasOwnProperty("Message") ? hasValue(n.Message) ? n.Message : langs.errorProgress : langs.errorProgress;
                                    n.hasOwnProperty("ValidationErrors") && hasValue(n.ValidationErrors) && $.isArray(n.ValidationErrors) && (r = n.ValidationErrors[0].ErrorMessages[0]);
                                    showMessage(t, r, "danger", null, null, !0)
                                }
                            },
                            error: function () {
                                showMessage(t, langs.serviceUnavailable, "danger", null, null, !0)
                            },
                            complete: function () {
                                t.removeClass("in-progress").removeClass("is-disabled");
                                document.getElementsByClassName("btn-timer").length || ($(".password").each(function () {
                                    $(this).removeAttr("disabled")
                                }),
                                    $(".button").each(function () {
                                        $(this).hasClass("is-disabled") && $(this).removeClass("is-disabled")
                                    }))
                            }
                        });
                        n.preventDefault();
                        break;
                    case "Cancel":
                        $("body").hasClass("overlay") ? undefined : $("body").addClass("overlay");
                        $(window).width() <= 768 ? ($(".dialog").hasClass("bottom-sheet") ? undefined : $(".dialog").addClass("bottom-sheet"),
                            $(".dialog").is(":visible") ? undefined : $(".dialog").fadeIn(5).css({
                                bottom: 0
                            })) : $(".dialog").is(":visible") ? undefined : $(".dialog").fadeIn(300);
                        n.preventDefault();
                        break;
                    case "CancelConfirmed":
                        document.getElementById("frmCancel").submit();
                        n.preventDefault();
                        break;
                    case "CancelNeverMind":
                        closeDialog();
                        n.preventDefault();
                        break;
                    case "Return":
                        $("body").addClass("freeze");
                        t.addClass("is-disabled");
                        document.getElementById("frmReturn").submit();
                        n.preventDefault();
                        break;
                    case "SelectPinMethod":
                        o = hasValue($(this).attr("data-method")) ? $(this).attr("data-method").trim() : null;
                        hasValue(o) && ($("#Pin2Method").val(o),
                            document.getElementById("ShowCardView").submit());
                        n.preventDefault();
                        break;
                    default:
                        n.preventDefault()
                }
        });
    if ($(".numpad").length || document.getElementsByClassName("numpad")) {
        $(document).on("click", ".numpad .xcross", function () {
            closeNumPad()
        });
        $(document).on("click", ".num-key", function (n) {
            if (!$(this).hasClass("eraser-key") && !$(this).hasClass("backspase-key") && !$("body").hasClass("freeze")) {
                var u = $(this).closest(".inline-payment").length ? $(this).closest(".inline-payment") : $(this).closest(".col")
                    , f = $(this).text()
                    , t = u.find(".input-holder input")
                    , i = t.val()
                    , e = hasValue(t.attr("id")) ? t.attr("id") : null
                    , r = hasValue(t.attr("data-focus")) ? t.attr("data-focus") : null
                    , o = hasValue(t.attr("maxlength")) ? t.attr("maxlength") : null;
                t.val(i + f).change();
                i.length + 1 >= o && r && (closeNumPad(),
                    e == "Cvv2" && $("input[id=Month]").val().length == 2 && $("input[id=Year]").val().length == 2 ? $("input[id=CaptchaInputText]").focus() : $("input[id=" + r + "]").focus())
            }
            n.preventDefault()
        });
        $(document).on("click", ".eraser-key", function () {
            if (!$("body").hasClass("freeze")) {
                var n = $(this).closest(".inline-payment").length ? $(this).closest(".inline-payment") : $(this).closest(".col")
                    , t = n.find(".input-holder input");
                t.val("").change()
            }
        });
        $(document).on("click", ".backspase-key", function () {
            if (!$("body").hasClass("freeze")) {
                var t = $(this).closest(".inline-payment").length ? $(this).closest(".inline-payment") : $(this).closest(".col")
                    , n = t.find(".input-holder input")
                    , i = n.val();
                n.val(i.slice(0, -1)).change()
            }
        })
    }
    if ($("input").length && (t = {},
        !$("body").hasClass("freeze"))) {
        $("input").keypress(function (n) {
            var i = $(this)
                , t = n.which ? n.which : n.keyCode;
            return clearWrong(i),
                $(this).attr("type") == "tel" && !(t >= 1776 && t <= 1785 || t >= 1632 && t <= 1641 || t >= 48 && t <= 57) ? !1 : void 0
        });
        $("input").on("focus blur", function () {
            var t = $(this)
                , n = hasValue($(this).attr("id")) ? $(this).attr("id") : null
                , i = normalize($(this).val());
            closeNumPad(!0);
            n == "CardNumber_PanString" && (filterCardList(!0),
                $(".card-list").is(":visible") ? undefined : $(".card-list").fadeIn(300));
            n != "CardNumber_PanString" && $(".card-list").length && $(".card-list").is(":visible") && closeCardList();
            n == "Cvv2" && isShortCvv();
            n == "Pin2" && clearWrong(t);
            n == "Email" && ($(".email-list").is(":visible") ? undefined : $(".email-list").fadeIn(300));
            (n == "Month" && i == "••" || n == "Year" && i == "••") && t.val("").removeClass("password").addClass("mono")
        });
        $("input").keyup(function (n) {
            var r = $(this)
                , u = n.which ? n.which : n.keyCode
                , f = hasValue($(this).attr("id")) ? $(this).attr("id") : null
                , i = normalize($(this).val())
                , e = hasValue($(this).attr("data-focus")) ? $(this).attr("data-focus") : null
                , o = hasValue($(this).attr("maxlength")) ? $(this).attr("maxlength") : null;
            if (r.val(i),
                delete t[n.key],
                f == "CardNumber_PanString" && r.val(cardSeparator(i)),
                u != 38 && u != 40 ? isShortCvv() : undefined,
                $(this).siblings(".clear").length && i ? $(this).siblings(".clear").fadeIn(300) : undefined,
                i.length >= o && e && !(u == 8 || u == 46 || u == 9 || u == 35) && u != 38 && u != 40 && (f == "CardNumber_PanString" ? closeCardList() : undefined,
                    f == "Cvv2" && $("input[id=Month]").val() == "••" && $("input[id=Year]").val() == "••" ? $("input[id=CaptchaInputText]").focus() & isShortCvv(isReset = !0) : $("input[id=" + e + "]").focus() & isShortCvv(isReset = !0)),
                u == 17 && f == "CaptchaInputText") {
                $("#CaptchaAudio").attr("src", serverUrl + "/captcha/play?sessionKey=" + userSessionKey + "&culture=" + culture + "&areaName=" + areaName);
                const n = $("audio");
                n.get(0).load();
                n.get(0).play()
            }
            if (u == 13) {
                if ($(".card-list").is(":visible") && !$("body").hasClass("freeze") && $(".card-list a").hasClass("hover"))
                    return $(".card-list a").each(function () {
                        if ($(this).hasClass("hover")) {
                            var n = hasValue($(this).children(".card-num").text().replace(/\s/g, "")) ? $(this).children(".card-num").text().replace(/\s/g, "") : null
                                , t = hasValue($(this).attr("data-card")) ? $(this).attr("data-card") : null
                                , i = hasValue($(this).attr("data-owner")) ? $(this).attr("data-owner") : null
                                , r = hasValue($(this).attr("data-gift")) ? $(this).attr("data-gift") == "true" : null
                                , u = hasValue($(this).attr("data-expired")) ? $(this).attr("data-expired") == "true" : null;
                            fillCard({
                                panNumber: n,
                                subscriberCardId: t,
                                cardOwner: i,
                                isGiftCard: r,
                                hasValidExpiredDate: u
                            });
                            $(".card-list a").removeClass("hover") & $(this).addClass("hover")
                        }
                    }),
                        !1;
                if ($("input[id=Month]").val() == "••" ? $("input[id=Month]").addClass("ignore").removeClass("wrong") : $("input[id=Month]").removeClass("ignore"),
                    $("input[id=Year]").val() == "••" ? $("input[id=Year]").addClass("ignore").removeClass("wrong") : $("input[id=Year]").removeClass("ignore"),
                    $(".lang-box").is(":visible") && $(".numpad").is(":visible"))
                    return !1;
                setTimeout(function () {
                    if ($("#frmPayment").validate({
                        onkeyup: !0
                    }).settings.ignore = ".ignore",
                        purchaseValidate()) {
                        var n = getPurchaseFormData()
                            , t = {
                                Action: n.action,
                                Culture: n.culture,
                                SessionKey: n.sessionKey,
                                "CardNumber.PanString": n.subCardId && n.cardOwner ? null : n.panNumber,
                                SelectedCardId: n.subCardId,
                                SelectedCardOwner: n.cardOwner,
                                Cvv2: n.cvv,
                                Month: n.expireMonth == "••" ? null : n.expireMonth,
                                Year: n.expireYear == "••" ? null : n.expireYear,
                                CaptchaInputText: n.captcha,
                                Pin2: n.pin,
                                Email: n.email,
                                CellNumber: n.cellNumber,
                                SaveAfterPay: n.saveAfterPay == "true"
                            };
                        hasValue(n.bills) && (t["SelectedBill.Identifier"] = n.bills.identifier,
                            t["SelectedBill.BillId"] = n.bills.billId,
                            t["SelectedBill.PayId"] = n.bills.payId,
                            t["SelectedBill.Amount"] = n.bills.amount);
                        r.addClass("in-progress");
                        $(".purchase-timer").stopTimeoutAction();
                        $.redirect(serverUrl + "/OnlinePG", t, "POST")
                    } else
                        setTimeout(function () {
                            $(".input-validation-error:not(.ignore):first").focus()
                        }, 500),
                            $("html, body").animate({
                                scrollTop: $(".input-validation-error").offset().top - 150
                            }, 1e3)
                }, 50)
            }
            (u == 8 || u == 46 || u == 9) && ((i.length == 0 || i.indexOf("•") > -1) && ($(this).val("").siblings(".clear").fadeOut(150),
                f == "CardNumber_PanString" ? clearSelectedCard() : undefined,
                f == "CardNumber_PanString" ? $(".card-logo").fadeOut(300, function () {
                    $(".card-logo").empty()
                }) : undefined),
                i.length < 6 && f == "CardNumber_PanString" && (f == "CardNumber_PanString" ? $(".card-logo").fadeOut(300, function () {
                    $(".card-logo").empty()
                }) : undefined),
                hideMessage("giftCard"));
            setTimeout(function () {
                var t, e;
                f == "CardNumber_PanString" && u != 38 && u != 40 && (i = i.replace(/\s/g, ""),
                    r.hasClass("valid") && (validPanNumber(i) || i.length != 16 ? inputValid(r) : (inputWrong(r, validatorMessages[culture].pan),
                        n.preventDefault())),
                    (i.length == 6 || i.length == 8) && (t = i.length == 6 ? getBankName(i) : i.substring(0, 8) == "62198619" || i.substring(0, 8) == "62198618" ? "blu" : getBankName(i.substring(0, 6)),
                        t ? $(".card-logo").empty().append('<img src="' + serverUrl + "/bundle/icn/banks/" + t + '.svg" />').fadeIn(300) : ($(".card-logo").fadeOut(300, function () {
                            $(".card-logo").empty()
                        }),
                            n.preventDefault())),
                    i.length <= 8 && hideMessage("giftCard"),
                    isGiftCard(i.substring(6, 8)) && i.length == 8 && showMessage($(".form"), giftCardHintMessage, "info", !0, "giftCard"),
                    $(".card-list").is(":visible") && ($(".card-enroll a").each(function () {
                        var n = i.toString()
                            , t = n.substring(0, 6) + n.substring(6, 12).replace(/[0-9]/g, "•") + n.substring(12);
                        n.length != 15 && ($(".card-enroll").is(":visible") ? $(this).hasClass("add-card") || $(this).hasClass("manage-cards") || ($(this).children(".card-num").text().replace(/\s/g, "").startsWith(t) ? $(this).fadeIn(300) : $(this).hide()) : closeCardList())
                    }),
                        i.length >= o ? u != 38 && u != 40 ? closeCardList() : undefined : undefined));
                f == "Cvv2" && r.hasClass("valid") && (i.length < 3 ? (inputWrong(r, validatorFormat(validatorMessages[culture].minlength, 3, null)),
                    n.preventDefault()) : inputValid(r));
                f == "Month" && r.hasClass("valid") && (i > 12 ? (inputWrong(r, langs.validations.invalidValue),
                    n.preventDefault()) : inputValid(r));
                f == "Year" && r.hasClass("valid") && (e = r.attr("data-current-year") ? r.attr("data-current-year").trim() : null,
                    i && i.length != 2 ? (inputWrong(r, langs.validations.invalidValue),
                        n.preventDefault()) : inputValid(r));
                f == "CaptchaInputText" && (i.length < 5 ? n.preventDefault() : inputValid(r));
                f == "Pin2" && (clearWrong(r),
                    r.hasClass("valid") && (i.length < 5 ? n.preventDefault() : inputValid(r)));
                f == "Email" && r.hasClass("valid") && ($(".email-list").is(":visible") ? $(".email-list").fadeOut(300) : undefined,
                    i && i.length >= 8 && !validEmailAddress(i) ? (inputWrong($(this), langs.validations.invalidEmailAddress),
                        n.preventDefault()) : inputValid(r));
                f == "CellNumber" && r.hasClass("valid") && (i && i.length == 11 && !validMobileNumber(i) ? (inputWrong($(this), langs.validations.invalidCellNumber),
                    n.preventDefault()) : inputValid(r))
            }, 50)
        });
        $("input").on("paste", function (n) {
            var r = $(this), t = null, u = hasValue($(this).attr("id")) ? $(this).attr("id") : null, i, f, o, e;
            t = window.clipboardData && window.clipboardData.getData ? normalize(window.clipboardData.getData("text").trim()) : normalize(n.originalEvent.clipboardData.getData("text").trim());
            u == "CardNumber_PanString" && t && (i = t.replace(/\D/g, ""),
                f = selfCurrentPan.get(),
                i.length == 16 && validPanNumber(i) ? (o = i.substring(0, 8) == "62198619" || i.substring(0, 8) == "62198618" ? "blu" : getBankName(i.substring(0, 6)),
                    clearSelectedCard(),
                    isShortCvv(i),
                    o ? $(".card-logo").empty().append('<img src="' + serverUrl + "/bundle/icn/banks/" + o + '.svg" />').fadeIn(300) : ($(".card-logo").fadeOut(300, function () {
                        $(".card-logo").empty()
                    }),
                        n.preventDefault()),
                    isGiftCard(i.substring(6, 8)) ? showMessage($(".form"), giftCardHintMessage, "info", !0, "giftCard") : hideMessage("giftCard"),
                    hasValue(f) && i !== f && handleChangePan(i, f),
                    clearWrong(r),
                    $(this).val(cardSeparator(i))) : ($(this).val(""),
                        inputWrong(r, validatorMessages[culture].pan)));
            u == "Pin2" && t && (e = t.replace(/\D/g, ""),
                e.length >= 5 && $.isNumeric(e) ? (clearWrong(r),
                    $(this).val(e)) : $(this).val(""));
            u == "Email" && t && (t.length >= 8 && validEmailAddress(t) ? (clearWrong(r),
                $(this).val(t)) : ($(this).val(""),
                    inputWrong(r, langs.validations.invalidEmailAddress)));
            u == "CellNumber" && t && (t.length == 11 && $.isNumeric(t) && validMobileNumber(t) ? (clearWrong(r),
                $(this).val(t)) : ($(this).val(""),
                    inputWrong(r, langs.validations.invalidCellNumber)));
            n.preventDefault()
        });
        $(".clear").length && $(".clear").click(function (n) {
            var t = $(this).parent().find("input"), i, r;
            hasValue(t) && !t.is("[readonly]") && (i = hasValue(t.attr("id")) ? t.attr("id") : null,
                r = $(this),
                $(this).fadeOut(150).parent().find("input").val(""),
                clearWrong(t, !0),
                i == "CardNumber_PanString" ? clearSelectedCard() & $("input[id=Cvv2]").attr("maxlength", 4).attr("data-val-length-max", 4) : undefined,
                i == "CardNumber_PanString" ? $(".card-logo").fadeOut(300, function () {
                    $(".card-logo").empty()
                }) & hideMessage("giftCard") : undefined,
                i == "CardNumber_PanString" ? $("input[id=Month]").hasClass("password") ? $("input[id=Month]").removeClass("password").addClass("mono") : undefined : undefined,
                i == "CardNumber_PanString" ? $("input[id=Year]").hasClass("password") ? $("input[id=Year]").removeClass("password").addClass("mono") : undefined : undefined,
                setTimeout(function () {
                    r.parent().find("input").focus()
                }, 100));
            n.preventDefault()
        })
    }
})
