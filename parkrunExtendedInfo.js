(function() {
    'use strict';

    var latestPage = false;

    // Выполняем обработку, если мы на нужной странице
    if (isResultsPage()) {

        // Локализация / Localization
        var L10n = {
            en: {
                nativeLanguageTitle: 'English',
                sex: {m: 'm', f: ' f ', men: 'Men', women: 'Women', all: 'All'},
                summaryTable: {
                    mainTitle: 'Summary race results',
                    fastest: 'Best on time:',
                    ageRate: 'Best on age rating: ',
                    maxRaces: 'Maximum of races:',
                    number: 'Total participants:',
                    unknown: 'unknowns',
                    unknownTooltip: 'no barcode - no result :-(',
                    personalBest: 'Personal records:',
                    firstHome: 'For the first time visiting this parkrun:',
                    firstHomeNote: 'name (parkruns in general)',
                    firstRun: 'For the first time visiting parkrun:',
                    firstRunTooltip: 'Information is only available for the last race',
                    jubileeNext: 'Soon jubilee race:',
                    jubilee: 'Jubilee race:',
                    jubileeTooltip: 'Shows the total number of races now, and not at the date of the viewed race',
                    ageAVG: 'Average age:*',
                    ageAVGTooltip: 'The average age may be inaccurate (deviation not more than 2 years)'
                },
                ageTable: {
                    mainTitle: 'Number of participants and the fastest by age',
                    WC: 'Wheelchair users',
                    '---': 'Age not specified'
                },
                scriptSettings: {
                    headerTooltip: 'Script settings',
                    jubileeMax: {
                        'title': 'Show upcoming jubilee races:',
                        '0': 'Do not show',
                        '1': '1 race before',
                        '2': '2 races before',
                        '3': '3 races before',
                        '4': '4 races before',
                        '5': '5 races before'
                    }
                }
            },
            ru: {
                nativeLanguageTitle: 'Русский',
                sex: {m: 'м', f: 'ж', men: 'Мужчины', women: 'Женщины', all: 'Все'},
                summaryTable: {
                    mainTitle: 'Сводные результаты забега',
                    fastest: 'Лучшие по времени:',
                    ageRate: 'Лучшие по возр. рейтингу:',
                    maxRaces: 'Максимум забегов:',
                    number: 'Всего участников:',
                    unknown: 'редисок',
                    unknownTooltip: 'нет штрихкода - нет результата :-(',
                    personalBest: 'Личные рекорды:',
                    firstHome: 'Впервые в гостях на этом parkrun:',
                    firstHomeNote: 'имя (всего забегов)',
                    firstRun: 'Впервые пробежали parkrun:',
                    firstRunTooltip: 'Информация доступна только для последнего забега',
                    jubileeNext: 'Скоро юбилейный забег:',
                    jubilee: 'Юбилейный забег:',
                    jubileeTooltip: 'Показывается общее число забегов на сегодняшний день, а не на момент проведения просматриваемого забега',
                    ageAVG: 'Средний возраст:*',
                    ageAVGTooltip: 'Средний возраст может быть неточным (отклонение не более 2 лет)'
                },
                ageTable: {
                    mainTitle: 'Число участников и быстрейшие по возрастам',
                    WC: 'Инвалиды-колясочники',
                    '---': 'Возраст не указан'
                },
                scriptSettings: {
                    headerTooltip: 'Настройки скрипта',
                    jubileeMax: {
                        'title': 'Показывать приближение к юбилейным забегам:',
                        '0': 'Не показывать',
                        '1': 'За 1 забег',
                        '2': 'За 2 забега',
                        '3': 'За 3 забега',
                        '4': 'За 4 забега',
                        '5': 'За 5 забегов'
                    }
                }
            }
        };

        // настройки по умолчанию
        var LANG = 'en';
        var jubileeMax = 2;
        var defaultPrefs = {
            LANG: LANG,
            jubileeMax: jubileeMax
        };

        // иконки, закодированные в base64
        var IMGbase64 = {
            extIco48: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABelBMVEWLjQmMjQmMjguNjw2OkA6QkgySlAyTlQ6UlhCWmAySlBWQkhSVlx+Ymh2eoBamqB2mqDCrrTCxsyy4ui66vC/DxT/Jy0q8vVfBwmLExmPNz27T1GO/wHXBwnzCw33DxH/ExYHHyIjExY/Oz5jb3LPi4sDl5sjr69Xw8OD29uz6+vL8/Pv+/v7///+3uWiztF2xslqvsFWsrletrlGrrEyqrEuqq0qmp0ChozqgojygojefoDOenzGRklavsHBubmVsbG1VVVNIR0tBQUw7O0ZAQEA2Nj0zMzw1NTgyMjAvLy4vLy0oKCwkJC0lJDAnJzMoKDIuLTk1NSExMRYsLRUoKBwmJxohIhozNA06OhM+PxFCQwpPUA1WVwZaWg9hYgdydAl3eQV6ewZ6fAd8fgV9fwSAggOChACChQCDhQCEhgCFhwCGiACHiQKJiwSJiwiIigiHiQeGiAiEhgiChAmDhQuGiA+JiwqKjAh/gQiBgxVqajRLTCdCQh+MD1J8AAADAElEQVR42tWTg6MrORjF02Tm2rZV5Nq2b227HdRK9bfvzpu+Zb3eUwXnl6/nSwv+P4KC2rJHOZYnqGU/x/WdHF8ghrRYhT1Zx4KkyxTXCgH5JSxf295Z2sRbp1ycNPMjdgGv9zOhCN29LJeND3bGm51/jjcID+lCsfR0f3t1ODECSOMCq/iSg2mHWqm1WnQmzc30ON2IIJR0g8t5y8qSO5/kfC6b6X5uvEF0KtKHV4P5sqrYQaUSQyO0z2G6nxmtlwMRJnKCl/1OZXEQgID1bnoglnaYbma7YrX9XO/SlgKvuXX3w51x6DM/TA0kJV7Ly9xIAtbMeyjFW6tz+66vqxFA0wHzw/SAhM45TVcTpKZ/F0t3SIgN2DX7A9mh4X7rw+TI0PCIx3g7UaNRkL9QbPWHAKIy1ufJHsvz/dO78Hq6m4rr7yZqhID8Oj5nKGGQtr1M9dssVqv+tWS1lvsz+rvxDlLtP8WrIerbKGVXXo/6mZTX/DBJB9mk23AzBqsTMIv4lBfXiUtoJJ1Dvm+h4zDpVF2NVF8EZNfkvdHK0GN+XhhPAr/5cWogkfNrn4ZrReDWpZBUhkmn6W52jPZYtRf9JGHXXI12kdoVyPdxwG66254YloDu/nTp6+HqbHKUVGdYEjNU5Cm+am6uzvoKzg9V2fD4eDszRup2SaSvV0omlUaj+iy7PbrPj9daRGQdX7IVAoUX8KXLaXe43EnKrft6exeJ6hJbfWGIEBKAeXzI5BI5AAlIO4yfIjFalWIbSw8iDMMSFFrAxzzimXCYAJCvEDezwqX8rlF7Ury5tHPQCxmhQp6cby/PUwRAkfh42Bv8/Y8csT3LUizHezw7j09ONrECKy4jsEKo7wY7SI1/HDrd3REqLOI1Gd6YP7gQPTDvtJQknQRUCSLCMwxB4UWMpXsRhuW/rzM+Dor+WgwS2yo7CQpD+NOqhID6Etu6GqZqnlcX6oc/gFYlfqVjDrYDzOMj9j8HHP+9FZg5fNJOl0C08xCBtkQ40KYQ+Lf0I5mywlu7pFkzAAAAAElFTkSuQmCC',
            prefsIco36: 'data:image/png;base64,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',
            en: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAMAAACXZR4WAAAAWlBMVEVAQEBAQEDMAAD////PDg/88PAAM5nw8/kNPp/miImTqdThamr++fmEnc4JOp36+/3h5/PY3+765ubXyNb20dGKkL1Lb7dHbLbvsbE8Y7EtV6vuqqrMf4vfZGXxBPxdAAAAAnRSTlNfO/q7ZYcAAABzSURBVAjXZc9JEoAgDERRBAwEnOfx/te0gxss/ybVbxdVqDyZsQqenNWlb2o+YfM9dYvAOsYhAOi42LSAjfudAM5IgHQBVucBPtsCjFRqm64D0N7zBmgNXwcBwhDHFeCWbrpnwMl14wXIhyoCZL8gon6/PDvNBSUoA2a1AAAAAElFTkSuQmCC',
            ru: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAAASElEQVR42mNwcHCwBuJIIE4gEYP0WDOAGP/JBCC9IAMSKDAggToG1Nf//08OhhvAwPD/Pzl4EBnwn0wTBo8BkRQYAE6JFOUFAB950GCPrs2eAAAAAElFTkSuQmCC',
            m: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABelBMVEUulMswmNAumtQvnNUundQxndYzn9g0oNg4odo3ots4pNk8ptg7pd0+pt1Ap99DqN9DquBIrOFMreJNruFQsOJSseJSsORYs+VYtOJht+VjuOZSqtI0otIsmdMnl9Aklc8nlM0mk8oikMogkcoijcYfi8QdicEdh74fhrwhh7kehLkeg7ckg7YZgbMYg7onjsQnj8YDfbQDea4KgLAQkMECeKUAe6gPj74Pkb8jlsAsnccHjb0AgK8AdKMwn8hDn8Qnm8c/ock9e5hhWlpQT09KSkpJSUlHR0dGRkZFRUVFRERDQ0NBQUE+QEA+Pj49PT08PDw6Ojo5OTk1NTUzMzMyMjIxMTEsLS0sLCwmJycaHBxSUFBERERRTk47ODhbWFhIRkYAAADjvb/uvb34y8ruxcfxwcHsxsf1ysr5zs760tL31dX71tb62dn72tr83Nz73t774OD74uL84+P+5uP/6Oj/6uf/7u7+4N//2Nj/2tbfvLy2oKCausyquyT6AAAAfHRSTlP////////////////////////////////////7/P/////+/////////////////////v/gy7KEYjwgChQRMTtlksj9/v39//////////////z/////////////yq1zWkIOABN3osfe/////////////////////////9z+koo2owAAAjNJREFUeAF10U9PE1EUBfBz7nszQ2khGiBqZMffyELjSr6MiX4wP4wbF25ciCG2JIqAaKJQGjudmffudYACDZ2et/293Jtz+QZ3MTOYAXTEZDzuouEXUqopVrzMQHoCtpwiRv1tT6URWcgs0puJBNpxrRpQzNMIc6glQ0yOVmUa2SBRoZrACYHoQ8IppCmgfjB8DNCcqf164qeRGdLR7tn+o9oAqmJNi7v491WerXeXPcVR0ICY9F/GErG9s/iBGZ3mD27RbeP8vlu6IQUwQ75M2A83PW7tzAVPEIS2R+LZVIHWAoABFEDPK04jWNkJKjcumqEJRZ0bmY3/B52B8gUfeIUYqtiIoGWRIXi5NKOgaETQf5K5yoShqM0MZHHQzlxpsVDFLATTvOqkwwrAbARK7MPIpVObhXphx1FVEsWB2kYT6hUR7BRZBW1BBvziN6cOvBdHYf7nawAA+u9jyaVs8x76HHIzbxdvAeDdIvNvc9WLWk2ivapQGJA5ELBh65NkWfks2Z7YqRcqAjAbAm2ArT69Q6e3vr99h0YVDFangwsCfT1MUkHMDp7jBnUZzABT5TnsXGEnSUohMfdRw9Y1YlEjrY3a4SqOKUyd8FJxQTyuUWEALNbP5JQJ6a6EOELIMYKqK1XjIZ2jUIQEpaaAATdIpIy1EamFw9gICXUxjNFOl6owOvFCAb2JAhrj/LauTZTZrUzxJx6JWzmD8SGwAbNq697t8BURMKCFHATBsQDwH9z5L5joIlrtAAAAAElFTkSuQmCC',
            f: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABgFBMVEXeXt/eXuLgYObkYOnoYubrYuztZfDvZvH0aPX2afL4avD7be7+be7+bO3+cO3/cu3+dO79dO/8ce/6cfD2cPT5Z/b1Z+3zZOnzZuTsY9/kYdvbXd7YXNrYW9fWWtfTW9PVU9DMScTcStPfSt/0XujzYeX0X+fsbtryX+b1XuvzZOfdPtDJPbvUPsjkbtT5eOz+duz/d+3/ee7/e+7/fO//f+/+gu//hfD+iPD8h+v/jvHux8jlvb/10NH91NT619n82dn72tr73Nz839/94OD64OD53+H64uL74uL74+P94+P+5OX/5uf/6er+6+z/8e796OL73tzNq6mihX2QcFyLblmKbF2GaFSDZVeBZVN7YU55X0x0XEt2WkhzWEZyWUVwV0RyVUFvVkhqUz9pTz5qTTlmSzZkSzpkTDxiTD9eSDpZSDheRTNaPyxSPS9PPC5QOStNNiZEMCE5KRhRPzNUQjRTPzZyVUyGUmJxWUZcQDZ3XkskHBc2KyEuIRj///82hf3PAAAAgHRSTlP////////////////////////////8//z////////////+7f7w162Tf1EhGE6p//////////////////P8///////////////////////////38vv///z//v/////////////////////8//z/////////+v//1r/3cWAyJaCrAMas5/8AAAJMSURBVHgBZdPRTmNVGMXx//r2Pqe0FFJHBYOOSUl8G2+MYeLb+CQ+wIzojS8ERphhVEZocdqec/ZyYgmge13/sr61T3L0PY/pSwEIRWl4kvyE9BeWUkhZe5EqtDW/AgxSS/L1LBI1Kue2IRJ9ayad2lSh/szFKEeKNASyN+MauYDaXDxkr2hNM6T/of43xZBaWex0t1cHo8/qJkruSSOI2Plzdd2s/ui+tKpzOUigHV2+3o1Yz97MeUiwjSI3Ujv1xdWUNjclLkXVJBhlXV5MxgSABmrUIt6ufp+WTAGp4BqRl9dXo3bIZVvsqatNKL3rkpXMNgfjGgFEHny/JDZyqdHGTT9VSQA4lrMSNVL3/Eb77gBQOUyhGrEpX/wV07IZoGtu9ledXb3Off95WTZ7i66gxWHepHqTNaz9fLxkf+Ju/WzWjXdHVE1djnDarJrBiPYu/62datPaiCHFUKx8NWs6l7qp9NnZESD74OdvvKRGSh+91NHHAiiUH/3ipkK/fP3S58e3adKLWK+6Tf/D3nfBNvc/52ksPFxo/v4TgHepH7z05PDb/zTFYsBwVsYwkM6OKMr91asXT5p+uisufi2EDwHsO6evyqI5eWyS8QcTAG/5FHwb6dh5f/Fw7lR3dvlgJJhZA7yPkIJm/EonWyS5+DIikLgVCRyaS4rRKh7O2ZZCQgg1vdA8AhHmEV0oQtIEYzs4RqEIutA9MvnoTaRdsLGZCymE+/UqnTx8gtO4O48IjcscCdvmPJ6lOIEHBKcUF4wB0L9hS+AfVDsfaaQ0bawAAAAASUVORK5CYII='
        };

        // Читаем настройки из кэша
        var lsprefs = {};
        chrome.storage.local.get(['parkrunExtendedInfo'], function(result) {
            if (result.parkrunExtendedInfo !== undefined) {
                lsprefs = result.parkrunExtendedInfo;
                console.log(lsprefs);
                if (lsprefs.LANG !== undefined && L10n.hasOwnProperty(lsprefs.LANG)) {
                    LANG = lsprefs.LANG;
                }
            }
            extendObjects(lsprefs, defaultPrefs);
            // запускаем основное тело скрипта
            main();
        });
    } else {
        return;
    }

    // Основное тело скрипта
    function main() {
        // добавляем непереведенные фразы из основных языков
        if (LANG != 'ru') {
            extendObjects(L10n.en, L10n.ru);
            if (LANG != 'en') {
                extendObjects(L10n[LANG], L10n.en);
            }
        }

        // заменяем пробелы на неразрывные для выравнивания колонок
        L10n[LANG].sex.m = L10n[LANG].sex.m.replace(/\s/g, '&nbsp;');
        L10n[LANG].sex.f = L10n[LANG].sex.f.replace(/\s/g, '&nbsp;');

        // удаляем добавленные скриптом элементы
        if (document.getElementById('scriptPrefsMain') !== null) {
            document.getElementById('scriptPrefsMain').remove();
        }
        if (document.getElementById('scriptTage') !== null) {
            document.getElementById('scriptTage').remove();
        }
        if (document.getElementById('scriptTsummary') !== null) {
            document.getElementById('scriptTsummary').remove();
        }


        // добавляем на страницу блок настроек скрипта
        addMainOptionsSelector();

        var note = {
            pb: ['Личный рекорд!', 'New PB!'],
            first: ['Первый забег!', 'First Timer!']
        };

        var Cmain = document.getElementById('main');
        var Tresults = document.getElementById('results');
        var Atr = Tresults.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        if (document.getElementById('scriptStyles') === null) {
            var style = document.createElement('style');
            style.id = 'scriptStyles';
            style.innerHTML = '.ageTable, .summaryTable {text-align: center; border: 2px solid #c7dbe3; border-collapse: collapse; background: #f5fafc; margin: 30px 5px 20px; font-size: 11pt; width: 100%;} \
                               .ageTable thead th, .summaryTable thead th {font-weight: normal; font-size: 14pt; background: #e5f3fc;} \
                               .ageTable td, .summaryTable td, .ageTable th, .summaryTable th {border: 1px solid #c7dbe3;} \
                               .ageTable td, .summaryTable td {padding: 5px;} \
                               .ageTable th, .summaryTable th {padding: 5px 0px; vertical-align: middle;} \
                               .ageTable th:nth-child(1), .summaryTable th:nth-child(1) {font-weight: bold; text-align: left; font-size: 12pt; padding: 0px 10px;} \
                               .summaryTable td:nth-child(1) {padding-left: 10px; text-align: left; font-weight: bold;} \
                               .summaryTable tr:nth-child(1) td:not(:nth-child(2)), .summaryTable tr:nth-child(2) td:not(:nth-child(2)), .summaryTable tr:nth-child(3) td:not(:nth-child(2)) \
                                   {padding-left: 10px; text-align: left;} \
                               .ageTable td:nth-child(3n), .ageTable td:nth-child(3n+1) {width: 45px;} \
                               .ageTable tbody tr:hover, .summaryTable tbody tr:hover {background: #e5f3fc; font-weight: bold; vertical-align: top;} \
                               .ageTable tbody td p, .summaryTable tbody td p {text-align: left; font-weight: normal; display: none;} \
                               .ageTable tbody td p {font-size: 9pt; text-indent: -40px; padding-left: 40px;} \
                               .summaryTable tbody td p {font-size: 10pt; margin-left: 5px;} \
                               .ageTable tbody td p:first-child, .summaryTable tbody td p:first-child {margin-top: 5px;} \
                               .ageTable tbody tr:hover p, .summaryTable tbody tr:hover p {display: block;} \
                               .sexMF img {vertical-align: middle;} \
                               .sexMF span {font-size: 14pt; vertical-align: middle;} \
                               .guestsInfo {margin: 20px 15px -10px; font-size: 11pt; text-align: left;} \
                               .guestsInfo p {margin-bottom: 5px;} \
                               .guestsInfo p span {font-weight: bold;} \
                               .scriptPrefsMain {position: absolute; right: 100px; top: 5px; width: 200px; z-index: 4; align: left; text-align: left;}\
                               .headerPrefs {font-size: 10pt; text-align: left; color: white; text-shadow: #333333 -1px -1px 1px, #333333 -1px 1px 1px, #333333 1px -1px 1px, #333333 1px 1px 1px;}\
                               .selLang {display: inline-block; margin: 5px auto 0px; text-align: left;}\
                               .extIco {float: left; margin-right: 2px; border-radius: 5px;}\
                               .optionFlag {display: inline-block; padding: 4px;}\
                               .optionFlag:hover {padding: 2px; border: 2px dashed #DDDDDD; cursor: pointer;}\
                               .currentFlag {vertical-align: top; padding: 2px; border: 2px inset #DDDDDD;}\
                               .scriptPrefs {position: absolute; right: 345px; top: 0px; padding: 5px 10px; width: auto; height: 164px; z-index: 4; text-align: left;}\
                               .scriptPrefs div {color: white; text-shadow: #333333 -1px -1px 1px, #333333 -1px 1px 1px, #333333 1px -1px 1px, #333333 1px 1px 1px;}\
                               .scriptPrefsIcoDiv {filter: grayscale(100%); position: absolute; right: 305px; top: 5px; width: 36px; height: 48px; z-index: 4; background: url("' + IMGbase64.prefsIco36 + '") no-repeat center center; background-size: 32px;}\
                               .scriptPrefsIcoDiv:hover {filter: none !important; cursor: pointer; background-size: 36px !important;}\
                               .selJubilee {margin-top: 2px;}\
                               .selJubilee option {color: rgb(0, 0, 0); font-weight: normal;}\
                               .selJubilee option:checked {color: rgb(0, 144, 255) !important; font-weight: bold !important;}\
                              ';
            Cmain.appendChild(style);
        }

        // база для хранения собранной информации
        var DB = {
            firstRun: {
                        all: {all: 0, home: 0, allNames: [], homeNames: []},
                          m: {all: 0, home: 0, allNames: [], homeNames: []},
                          f: {all: 0, home: 0, allNames: [], homeNames: []}
            },
            maxRaces: {
                        m: {name: '', races: 0},
                        f: {name: '', races: 0}
            },
            jubilee: {
                        all: {number: 0, names: [], strNames: ''},
                          m: {number: 0, names: [], strNames: ''},
                          f: {number: 0, names: [], strNames: ''},
                       next: {
                        all: {number: 0, names: [], strNames: ''},
                          m: {number: 0, names: [], strNames: ''},
                          f: {number: 0, names: [], strNames: ''}
                       }
            },
            personalBest: {
                        all: {number: 0, names: [], strNames: ''},
                          m: {number: 0, names: [], strNames: ''},
                          f: {number: 0, names: [], strNames: ''}
            },
            fastest: {
                        m: {name: '', time: 0},
                        f: {name: '', time: 0}
            },
            ageRate: {
                        m: {name: '', rate: 0},
                        f: {name: '', rate: 0}
            },
            ageNumber: {},
            number: {all: 0, m: 0, f: 0, u: 0, WC: {all: 0, m: 0, f: 0}, '---': {all: 0, m: 0, f: 0}},
            ageAVG: {m: 0, f: 0}
        }

        // перебираем всех участников забега и собираем информацию
        for (var i = 0; i < Atr.length; i++) {
            var Atd = Atr[i].getElementsByTagName('td');
            if (Atd.length > 10) {
                var indexes = {name: 1, time: 2, age: 3, rate: 4, sex: 5, persbest: 8, races: 9};
            } else {
                indexes = {name: 0, time: 1, age: 2, rate: 3, sex: 4, persbest: 6, races: 7};
            }
            var time = Atd[indexes.time].innerHTML;
            if (time == '') {
                DB.number.u += 1;
            } else {
                var name = Atd[indexes.name].getElementsByTagName('a')[0].innerHTML;
                name = name.split(/(\s|\-)+/).map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(' ').replace(/\s*\-\s*/g, '-');
                var rate = parseFloat(Atd[indexes.rate].innerHTML);
                var sex = Atd[indexes.sex].innerHTML.toLowerCase();
                var age = Atd[indexes.age].getElementsByTagName('a')[0].innerHTML.replace(/^[^0-9\-]*/, '');
                if (age.length < 1) {
                    age = 'WC';
                }
                if (!DB.ageNumber.hasOwnProperty(age)) {
                    DB.ageNumber[age] = {all: {names: []}, m: {number: 0, time: '', name: '', names: []}, f: {number: 0, time: '', name: '', names: []}};
                }
                DB.ageNumber[age][sex].number += 1;
                DB.ageNumber[age][sex].names.push({time: time, name: name});
                DB.ageNumber[age].all.names.push({time: time, name: name, sex: sex});
                if (DB.ageNumber[age][sex].time == '' || time2sec(time) < time2sec(DB.ageNumber[age][sex].time)) {
                    DB.ageNumber[age][sex].time = time;
                    DB.ageNumber[age][sex].name = name;
                }
                var persbest = Atd[indexes.persbest].innerHTML;
                var races = parseInt(Atd[indexes.races].innerHTML);
                if (races == 1) {
                    DB.firstRun[sex].all += 1;
                    DB.firstRun[sex].allNames.push({name: name});
                } else if (races % 50 == 0) {
                    DB.jubilee[sex].number += 1;
                    DB.jubilee[sex].names.push({name: name, races: races});
                    DB.jubilee.all.number += 1;
                    DB.jubilee.all.names.push({name: name, races: races});
                } else if (races % 50 >= 50 - lsprefs.jubileeMax) {
                    DB.jubilee.next[sex].number += 1;
                    DB.jubilee.next[sex].names.push({name: name, races: races});
                    DB.jubilee.next.all.number += 1;
                    DB.jubilee.next.all.names.push({name: name, races: races});
                }
                if (~note.first.indexOf(persbest)) {
                    if (races != 1) {
                        DB.firstRun[sex].home += 1;
                        DB.firstRun[sex].homeNames.push({name: name, races: races});
                    }
                } else if (~note.pb.indexOf(persbest)) {
                    DB.personalBest[sex].number += 1;
                    DB.personalBest[sex].names.push({name: name, time: time});
                }
                DB.number[sex] += 1;
                if (DB.fastest[sex].time == 0 || time2sec(time) < time2sec(DB.fastest[sex].time)) {
                    DB.fastest[sex].time = time;
                    DB.fastest[sex].name = name;
                }
                if (rate > DB.ageRate[sex].rate) {
                    DB.ageRate[sex].rate = rate;
                    DB.ageRate[sex].name = name;
                }
                if (races > DB.maxRaces[sex].races) {
                    DB.maxRaces[sex].races = races;
                    DB.maxRaces[sex].name = name;
                }
            }
        }
        DB.personalBest.all.number = DB.personalBest.m.number + DB.personalBest.f.number;
        DB.number.all = DB.number.m + DB.number.f + DB.number.u;
        DB.firstRun.all.home = DB.firstRun.m.home + DB.firstRun.f.home;
        DB.firstRun.all.all = DB.firstRun.m.all + DB.firstRun.f.all;
        for (sex of ['m', 'f']) {
            for (var key of ['allNames', 'homeNames']) {
                for (i = 0; i < DB.firstRun[sex][key].length; i++) {
                    DB.firstRun.all[key].push(DB.firstRun[sex][key][i]);
                }
                DB.firstRun[sex][key].sort(compareFirst);
            }
            for (i = 0; i < DB.personalBest[sex].names.length; i++) {
                DB.personalBest.all.names.push(extendObjects({sex: sex}, DB.personalBest[sex].names[i]));
            }
            DB.personalBest[sex].names.sort(compareByName);
            DB.jubilee[sex].names.sort(compareByRaces);
            DB.jubilee.next[sex].names.sort(compareByRaces);

        }
        DB.firstRun.all.allNames.sort(compareFirst);
        DB.firstRun.all.homeNames.sort(compareFirst);
        DB.personalBest.all.names.sort(compareByName);
        DB.jubilee.all.names.sort(compareByRaces);
        DB.jubilee.next.all.names.sort(compareByRaces);

        // добавляем на страничку информацию о количестве участников по возрастным группам
        var Tage = document.createElement('table');
        Tage.id = 'scriptTage';
        Tage.className = 'ageTable';
        var Tagehead = document.createElement('thead');
        Tagehead.innerHTML = '<tr>\
                                  <th style="width: 220px;">' + L10n[LANG].ageTable.mainTitle + '</th>\
                                  <th class="sexMF" title="' + L10n[LANG].sex.all + '">\
                                      <img src="' + IMGbase64.m + '"><span>+</span><img src="' + IMGbase64.f + '">\
                                  </th>\
                                  <th colspan="3" class="sexMF" title="' + L10n[LANG].sex.men + '"><img src="' + IMGbase64.m + '"></th>\
                                  <th colspan="3" class="sexMF" title="' + L10n[LANG].sex.women + '"><img src="' + IMGbase64.f + '"></th>\
                              </tr>';
        Tage.appendChild(Tagehead);
        var Tagebody = document.createElement('tbody');
        Tage.appendChild(Tagebody);
        var Aage = Object.keys(DB.ageNumber).sort();
        for (i = 0; i < Aage.length; i++) {
            var agetr = document.createElement('tr');
            var ageGR = Aage[i];
            var GRname = ageGR;
            var mnumber = DB.ageNumber[ageGR].m.number;
            var fnumber = DB.ageNumber[ageGR].f.number;
            var allnumber = mnumber + fnumber;
            if (ageGR != 'WC' && ageGR != '---') {
                var ageAVG = ageGR.split('-');
                ageAVG = (parseInt(ageAVG[ageAVG.length - 1]) + parseInt(ageAVG[0])) / 2.0;
                DB.ageAVG.m += ageAVG * mnumber;
                DB.ageAVG.f += ageAVG * fnumber;
            } else {
                DB.number[ageGR].m = mnumber;
                DB.number[ageGR].f = fnumber;
                DB.number[ageGR].all = mnumber + fnumber;
                GRname = L10n[LANG].ageTable[ageGR];
            }
            agetr.innerHTML = '<td>' + GRname + names2p(DB.ageNumber[ageGR].all.names) + '</td>' +
                '<td>' + allnumber + '</td>' +
                '<td>' + mnumber + '</td>' +
                '<td>' + DB.ageNumber[ageGR].m.time + '</td>' +
                '<td>' + DB.ageNumber[ageGR].m.name + names2p(DB.ageNumber[ageGR].m.names) + '</td>' +
                '<td>' + fnumber + '</td>' +
                '<td>' + DB.ageNumber[ageGR].f.time + '</td>' +
                '<td>' + DB.ageNumber[ageGR].f.name + names2p(DB.ageNumber[ageGR].f.names) + '</td>';
            Tagebody.appendChild(agetr);
        }
        Cmain.insertBefore(Tage, Cmain.firstChild);

        // добавляем на страничку пустую таблицу для общих результатов
        var Tsummary = document.createElement('table');
        Tsummary.id = 'scriptTsummary';
        Tsummary.className = 'summaryTable';
        var Thead = document.createElement('thead');
        Thead.innerHTML = '<tr>\
                               <th style="font-size: 14pt;">' + L10n[LANG].summaryTable.mainTitle + '</th>\
                               <th class="sexMF" title="' + L10n[LANG].sex.all + '">\
                                   <img src="' + IMGbase64.m + '">+<img src="' + IMGbase64.f + '">\
                               </th>\
                               <th colspan="2" class="sexMF" title="' + L10n[LANG].sex.men + '"><img src="' + IMGbase64.m + '"></th>\
                               <th colspan="2" class="sexMF" title="' + L10n[LANG].sex.women + '"><img src="' + IMGbase64.f + '"></th>\
                           </tr>';
        Tsummary.appendChild(Thead);
        var Tbody = document.createElement('tbody');
        Tsummary.appendChild(Tbody);
        for (i = 0; i < 10; i++) {
            var tr = document.createElement('tr');
            tr.id = 'summary' + (1 + i);
            if (i < 3) {
                for (var j = 0; j < 6; j++) {
                    var td = document.createElement('td');
                    tr.appendChild(td);
                }
            } else {
                for (j = 0; j < 4; j++) {
                    td = document.createElement('td');
                    if (j > 1) {
                        td.colSpan = 2;
                    }
                    tr.appendChild(td);
                }
            }
            Tbody.appendChild(tr);
        }
        Cmain.insertBefore(Tsummary, Cmain.firstChild);

        // заполняем таблицу с общими результатами
        // лучшие по времени
        var nodes = document.getElementById('summary1').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.fastest;
        if (time2sec(DB.fastest.m.time) < time2sec(DB.fastest.f.time)) {
            nodes[1].innerHTML = DB.fastest.m.time;
            nodes[1].title = DB.fastest.m.name;
        } else {
            nodes[1].innerHTML = DB.fastest.f.time;
            nodes[1].title = DB.fastest.f.name;
        }
        nodes[2].innerHTML = DB.fastest.m.time;
        nodes[3].innerHTML = DB.fastest.m.name;
        nodes[4].innerHTML = DB.fastest.f.time;
        nodes[5].innerHTML = DB.fastest.f.name;
        // лучшие по возрастному рейтингу
        nodes = document.getElementById('summary2').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.ageRate;
        if (DB.ageRate.m.rate > DB.ageRate.f.rate) {
            nodes[1].innerHTML = DB.ageRate.m.rate + ' %';
            nodes[1].title = DB.ageRate.m.name;
        } else {
            nodes[1].innerHTML = DB.ageRate.f.rate + ' %';
            nodes[1].title = DB.ageRate.f.name;
        }
        nodes[2].innerHTML = DB.ageRate.m.rate + ' %';
        nodes[3].innerHTML = DB.ageRate.m.name;
        nodes[4].innerHTML = DB.ageRate.f.rate + ' %';
        nodes[5].innerHTML = DB.ageRate.f.name;
        // лучшие максимальному количеству забегов
        nodes = document.getElementById('summary3').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.maxRaces;
        if (DB.maxRaces.m.races > DB.maxRaces.f.races) {
            nodes[1].innerHTML = DB.maxRaces.m.races;
            nodes[1].title = DB.maxRaces.m.name;
        } else {
            nodes[1].innerHTML = DB.maxRaces.f.races;
            nodes[1].title = DB.maxRaces.f.name;
        }
        nodes[2].innerHTML = DB.maxRaces.m.races;
        nodes[3].innerHTML = DB.maxRaces.m.name;
        nodes[4].innerHTML = DB.maxRaces.f.races;
        nodes[5].innerHTML = DB.maxRaces.f.name;
        // количество участников забега
        nodes = document.getElementById('summary4').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.number;
        var notscan = '';
        if (DB.number.u > 0) {
            notscan = '<span title="' + L10n[LANG].summaryTable.unknownTooltip + '"> (' + L10n[LANG].summaryTable.unknown + ': ' + DB.number.u + ')</span>';
        }
        nodes[1].innerHTML = DB.number.all + notscan;
        nodes[2].innerHTML = DB.number.m;
        nodes[3].innerHTML = DB.number.f;
        // личные рекорды
        nodes = document.getElementById('summary5').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.personalBest + names2p(DB.personalBest.all.names);
        nodes[1].innerHTML = DB.personalBest.all.number;
        nodes[2].innerHTML = DB.personalBest.m.number + names2p(DB.personalBest.m.names);
        nodes[3].innerHTML = DB.personalBest.f.number + names2p(DB.personalBest.f.names);
        // впервые на паркране вообще
        nodes = document.getElementById('summary6').getElementsByTagName('td');
        if (latestPage) {
            nodes[0].innerHTML = L10n[LANG].summaryTable.firstRun + names2p(DB.firstRun.all.allNames);
            nodes[1].innerHTML = DB.firstRun.all.all;
            nodes[2].innerHTML = DB.firstRun.m.all + names2p(DB.firstRun.m.allNames);
            nodes[3].innerHTML = DB.firstRun.f.all + names2p(DB.firstRun.f.allNames);
        } else {
            nodes[0].innerHTML = L10n[LANG].summaryTable.firstRun + '<p style="width: 280px;">' + L10n[LANG].summaryTable.firstRunTooltip + '</p>';
            nodes[1].innerHTML = '?';
            nodes[2].innerHTML = '?';
            nodes[3].innerHTML = '?';
            nodes[1].title = L10n[LANG].summaryTable.firstRunTooltip;
            nodes[2].title = L10n[LANG].summaryTable.firstRunTooltip;
            nodes[3].title = L10n[LANG].summaryTable.firstRunTooltip;
        }
        // впервые на этом паркране
        nodes = document.getElementById('summary7').getElementsByTagName('td');
        nodes[0].innerHTML = L10n[LANG].summaryTable.firstHome + names2p(DB.firstRun.all.homeNames);
        nodes[1].innerHTML = DB.firstRun.all.home;
        nodes[2].innerHTML = DB.firstRun.m.home + names2p(DB.firstRun.m.homeNames);
        nodes[3].innerHTML = DB.firstRun.f.home + names2p(DB.firstRun.f.homeNames);
        // средний возраст
        nodes = document.getElementById('summary8').getElementsByTagName('td');
        document.getElementById('summary8').title = L10n[LANG].summaryTable.ageAVGTooltip;
        nodes[0].innerHTML = L10n[LANG].summaryTable.ageAVG;
        nodes[1].innerHTML = ((DB.ageAVG.m + DB.ageAVG.f)/(DB.number.m + DB.number.f - DB.number.WC.all)).toFixed();
        nodes[2].innerHTML = (DB.ageAVG.m/(DB.number.m - DB.number.WC.m)).toFixed();
        nodes[3].innerHTML = (DB.ageAVG.f/(DB.number.f - DB.number.WC.f)).toFixed();
        // юбилейные забеги
        nodes = document.getElementById('summary9').getElementsByTagName('td');
        if (latestPage) {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubilee + '' + names2p(DB.jubilee.all.names);
        } else {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubilee + '*' + names2p(DB.jubilee.all.names);
            nodes[0].title = L10n[LANG].summaryTable.jubileeTooltip;
        }
        nodes[1].innerHTML = DB.jubilee.all.number;
        nodes[2].innerHTML = DB.jubilee.m.number + names2p(DB.jubilee.m.names);
        nodes[3].innerHTML = DB.jubilee.f.number + names2p(DB.jubilee.f.names);
        // скоро юбилейные забеги
        nodes = document.getElementById('summary10').getElementsByTagName('td');
        if (latestPage) {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubileeNext + '' + names2p(DB.jubilee.next.all.names);
        } else {
            nodes[0].innerHTML = L10n[LANG].summaryTable.jubileeNext + '*' + names2p(DB.jubilee.next.all.names);
            nodes[0].title = L10n[LANG].summaryTable.jubileeTooltip;
        }
        nodes[1].innerHTML = DB.jubilee.next.all.number;
        nodes[2].innerHTML = DB.jubilee.next.m.number + names2p(DB.jubilee.next.m.names);
        nodes[3].innerHTML = DB.jubilee.next.f.number + names2p(DB.jubilee.next.f.names);
        if (lsprefs.jubileeMax == 0) {
            document.getElementById('summary10').style.display = 'none';
        }
    }

    // проверка, находимся ли мы на страничке результатов
    function isResultsPage() {
        var url = String(window.location);
        if (!~url.indexOf('runSeqNumber')) {
            latestPage = true;
        }
        return ~url.indexOf('parkrun.') && (~url.indexOf('/latestresults') || ~url.indexOf('/ostatnierezultaty') || ~url.indexOf('/?runSeqNumber='));
    }

    // переводим запись времени в секунды
    function time2sec(str) {
        var Atime = str.split(':');
        for (var i = 0; i < Atime.length; i++) {
            Atime[i] = parseInt(Atime[i].replace(/^0/, ''));
        }
        if (Atime.length == 2) {
            Atime.unshift(0);
        }
        return 3600*Atime[0] + 60*Atime[1] + Atime[2];
    }

    // функция сравнения для сортировки впервые пробежавших
    function compareFirst(obj1, obj2) {
        if (obj1.hasOwnProperty('races')) {
            return compareObjects(obj2, obj1, 'races');
        } else {
            return compareObjects(obj1, obj2, 'name');
        }
    }

    // функция сравнения для сортировки объектов по количеству забегов
    function compareByRaces(obj1, obj2) {
        return compareObjects(obj2, obj1, 'races');
    }

    // функция сравнения для сортировки объектов по имени
    function compareByName(obj1, obj2) {
        return compareObjects(obj1, obj2, 'name');
    }

    // функция сравнения для сортировки объектов по заданному свойству
    function compareObjects(obj1, obj2, property) {
        property = property || 'name';
        if (obj1[property] > obj2[property]) {
            return 1;
        } else {
            return -1;
        }
    }

    // создаем строку имен из массива объектов
    function homeNames2str(Names) {
        var str = '';
        var split = ', ';
        for (var i = 0; i < Names.length; i++) {
            if (i == Names.length - 1) {
                split = '';
            }
            if (Names[i].hasOwnProperty('races')) {
                str += Names[i].name + ' (' + Names[i].races + ')' + split;
            } else {
                str += Names[i].name + split;
            }
        }
        return str;
    }

    // создаем строку имен из массива объектов
    function names2p(Names, key) {
        key = key || '';
        var str = '';
        if (Names.length > 0) {
            if (key == 'time' || (key == '' && Names[0].hasOwnProperty('time'))) {
                for (var i = 0; i < Names.length; i++) {
                    if (Names[i].hasOwnProperty('sex')) {
                        str += '<p>' + Names[i].time + ' - ' + L10n[LANG].sex[Names[i].sex] + ' - ' + Names[i].name + '</p>';
                    } else {
                        str += '<p>' + Names[i].time + ' - ' + Names[i].name + '</p>';
                    }
                }
            } else if (key == 'races' || (key == '' && Names[0].hasOwnProperty('races'))) {
                str = '<p>' + L10n[LANG].summaryTable.firstHomeNote + '</p>';
                for (i = 0; i < Names.length; i++) {
                    str += '<p>' + Names[i].name + ' (' + Names[i].races + ')' + '</p>';
                }
            } else if (Names[0].hasOwnProperty('name')) {
                for (i = 0; i < Names.length; i++) {
                    str += '<p>' + Names[i].name + '</p>';
                }
            }
        }
        return str;
    }

    // добавляем отсутствующие поля в объект
    function extendObjects(target, source) {
        if (!(target instanceof Object)) {
            target = {};
        }
        if (source instanceof Object) {
            for (var i in source) {
                target[i] = source[i] instanceof Object ? extendObjects(target[i], source[i]) : i in target ? target[i] : source[i];
            }
        }
        return target;
    }

    // добавляем на страницу блок настроек скрипта
    function addMainOptionsSelector() {
        // блок с основными настройками
        var div = document.createElement('div');
        div.id = 'scriptPrefsMain';
        div.className = 'scriptPrefsMain';

        // иконка расширения
        var extIco = document.createElement('img');
        extIco.className = 'extIco';
        extIco.title = 'parkrun Extended Info';
        extIco.src = IMGbase64.extIco48;
        div.appendChild(extIco);

        // заголовок
        var header = document.createElement('div');
        header.className = 'headerPrefs';
        header.innerHTML = 'parkrun Extended Info';
        header.title = L10n[LANG].scriptSettings.headerTooltip;
        div.appendChild(header);

        // выбор языка
        var selLang = document.createElement('div');
        selLang.className = 'selLang';

        // добавляем флажки языков
        for (var lang in L10n) {
            var flag = document.createElement('img');
            flag.id = 'optionFlag_' + lang;
            flag.title = L10n[lang].nativeLanguageTitle;
            flag.src = IMGbase64[lang];
            if (lang == LANG) {
                flag.className = 'currentFlag';
            } else {
                flag.className = 'optionFlag';
                // при клике по флажку меняем язык и перезагружаем элементы
                flag.onclick = function() {
                    this.className = 'currentFlag';
                    document.getElementById('optionFlag_' + LANG).className = 'optionFlag';
                    LANG = this.id.slice(this.id.indexOf('_') + 1);
                    lsprefs.LANG = LANG;
                    chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                        if (document.getElementById('scriptPrefs') != null) {
                            addOptionsSelector();
                        }
                        if (document.getElementById('scriptPrefsIcoDiv') != null) {
                            document.getElementById('scriptPrefsIcoDiv').title = L10n[LANG].scriptSettings.headerTooltip;
                        }
                        main();
                    });
                };
            }
            selLang.appendChild(flag);
        }


        // добавляем блок на страничку
        div.appendChild(selLang);
        var node = document.getElementById('mainheader');
        node.insertBefore(div, node.firstChild);

        // иконка настроек
        if (document.getElementById('scriptPrefsIcoDiv') == null) {
            var div = document.createElement('div');
            div.id = 'scriptPrefsIcoDiv';
            div.className = 'scriptPrefsIcoDiv';
            div.title = L10n[LANG].scriptSettings.headerTooltip;
            div.onclick = function() {
                if (this.style.filter == 'none') {
                    this.style.filter = 'grayscale(100%)';
                    this.style.backgroundSize = '32px';
                    document.getElementById('scriptPrefs').remove();
                } else {
                    this.style.filter = 'none';
                    this.style.backgroundSize = '36px';
                    if (document.getElementById('scriptPrefs') == null) {
                        addOptionsSelector();
                    }
                }
            };
            // добавляем блок на страничку
            node.insertBefore(div, node.firstChild);
        }
    }

    // добавляем на страницу раскрывающийся блок настроек скрипта
    function addOptionsSelector() {
        // Удаляем блок, если он уже есть
        if (document.getElementById('scriptPrefs') != null) {
            document.getElementById('scriptPrefs').remove();
        }

        // блок с дополнительными настройками
        var div = document.createElement('div');
        div.id = 'scriptPrefs';
        div.className = 'scriptPrefs';
        // прячем блок, если мышь покинула его
        div.onmouseleave = function() {
            document.getElementById('scriptPrefsIcoDiv').style.filter = 'grayscale(100%)';
            document.getElementById('scriptPrefsIcoDiv').style.backgroundSize = '32px';
            this.remove();
        };

        // заголовок выбора максимального лимита количества забегов, оставшихся до юбилея
        var pJubilee = document.createElement('div');
        pJubilee.id = 'pJubilee';
        pJubilee.innerHTML = L10n[LANG].scriptSettings.jubileeMax.title;
        div.appendChild(pJubilee);

        // добавляем выбор максимального лимита количества забегов, оставшихся до юбилея
        var selJubilee = document.createElement('select');
        selJubilee.id = 'selJubilee';
        selJubilee.className = 'selJubilee';
        for (var i = 0; i <= 5; i++) {
            var option = document.createElement('option');
            option.innerHTML = L10n[LANG].scriptSettings.jubileeMax[i];
            option.value = i;
            if (i == lsprefs.jubileeMax) {
                option.selected = 'selected';
            } else {
                option.style.color = 'rgb(0, 0, 0)';
                option.style.fontWeight = 'normal';
            }
            selJubilee.appendChild(option);
        }

        selJubilee.onchange = selectLength;
        function selectLength() {
            var Aopt = this.getElementsByTagName('option');
            for (i = 0; i < Aopt.length; i++) {
                if (this.value == Aopt[i].value) {
                    if (Aopt[i].style.color == 'rgb(0, 0, 0)') {
                        Aopt[i].selected = 'selected';
                        lsprefs.jubileeMax = this.value;
                        console.log(lsprefs);
                        chrome.storage.local.set({parkrunExtendedInfo: lsprefs}, function() {
                            main();
                        });
                    }
                } else {
                    Aopt[i].style.color = 'rgb(0, 0, 0)';
                    Aopt[i].style.fontWeight = 'normal';
                }
            }
        }
        div.appendChild(selJubilee);

        var node = document.getElementById('mainheader');
        node.insertBefore(div, node.firstChild);

        document.getElementById('pJubilee').style.width = document.getElementById('pJubilee').style.left;
    }
})();