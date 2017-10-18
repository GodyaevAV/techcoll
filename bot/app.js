/**
 * Created by User on 17.10.2017.
 */
"use strict";
if (document.readyState === 'complete' || document.readyState !== 'loading') {
    eventHandler();
} else {
    document.addEventListener('DOMContentLoaded', eventHandler);
}
function eventHandler() {
    var list = document.querySelector('.message-list'),
        input = document.querySelector('.message-input input[type="text"]'),
        button = document.querySelector('.message-input button'),
        database = localStorage['wordBase'] ? JSON.parse(localStorage['wordBase']) : {};

    button.setAttribute('disabled', 'true');
    input.addEventListener('keyup', function (ev) {
        if (ev.srcElement.value.length > 3) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', 'true');
        }
    });
    input.addEventListener('keypress', function (ev) {
        if (ev.keyCode == 13) {
            makeQuestion();
        }
    });
    button.addEventListener('click', makeQuestion);

    setInterval(silentDetected, 10000);
    // спроси! спроси бота!!
    function askBot(message) {
        if (database.hasOwnProperty(message)) return database[message];
        var words = message.split(' '), result = '';
        for (var field in database) {
            if (result != '') break;
            for (var i = 0; i < words.length; i++) {
                if (field.indexOf(words[i].toLowerCase()) > -1) {
                    result = database[field];
                    break;
                }
            }
        }
        return result.length ? result : false;
    }

    // детектор тишины
    function silentDetected() {
        if (!input.value.length) {
            printMessage('Молчишь? Ну молчи молчи.')
        } else {
            printMessage('Вижу ты что-то пишешь! Я постараюсь ответить :)')
        }
    }

    // поделись ответом, не жадничай
    function requestAnswer(question) {
        var answer = prompt('А ты сам знаешь ответ на "' + question + '"');
        if (answer && answer.length) {
            setCache(question, answer);
            printMessage('О! Спасибо! Буду знать :)');
            printMessage('Давай, спроси меня еще о чем-нибудь!');
        } else {
            printMessage('Ну и ладно.. ');
        }
    }

    // кешируем накопленный опыт
    function setCache(question, answer) {
        database[question.toLowerCase()] = answer;
        localStorage['wordBase'] = JSON.stringify(database);
    }

    // задаем вопрос
    function makeQuestion() {
        var result = askBot(input.value), question = input.value;
        printMessage(question, true);
        if (result) {
            printMessage(result, false)
        } else {
            printMessage('Я работаю ботом всего две недели и пока мало знаю... Ты знаешь ответ?', false);
            setTimeout(function () {
                requestAnswer(question);
            }, 1500);
        }
        // очищаем форму ввода
        input.value = '';
        button.setAttribute('disabled', 'true');
    }

    // добавление сообщения на страницу
    function printMessage(message, question) {
        var div = document.createElement('div');
        div.className = "message" + (question ? " own" : "");
        div.innerHTML = "<p>" + message + "</p>";
        list.appendChild(div);
        // скролим вниз до упора
        list.scrollTop = list.scrollHeight - list.clientHeight;
    }
}