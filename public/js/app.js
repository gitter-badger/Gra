(function() {
  this.app = angular.module('game', []);

  this.app.controller('GameController', [
    '$scope', function($scope) {
      return $scope.round = function(value, precision) {
        var n, p;
        p = precision != null ? precision : 0;
        n = Math.pow(10, p);
        return Math.round(value * n) / n;
      };
    }
  ]);

  this.app.controller('PlayerController', [
    '$scope', function($scope) {
      var old, update;
      old = document.title;
      update = (function(_this) {
        return function() {
          var left, now;
          if (_this.isBusy) {
            now = Math.round((new Date()).getTime() / 1000);
            left = Math.max(_this.jobEnd - now, 0);
            if (left > 0) {
              document.title = window.timeFormat(left) + ' - ' + old;
            } else {
              document.title = old;
            }
          }
          return setTimeout(update, 1000);
        };
      })(this);
      return update();
    }
  ]);

}).call(this);

(function() {
  var clicked;

  clicked = function() {
    $('.avatar').removeClass('active');
    $('#avatar').val($(this).data('avatar'));
    return $(this).addClass('active');
  };

  $(function() {
    return $('.avatar').click(clicked).first().trigger('click');
  });

}).call(this);

(function() {
  var Battle, Character, config;

  config = {
    fontSize: 30,
    barFontSize: 20,
    nameFontSize: 30,
    margin: 5,
    interval: 1000 / 60
  };

  Character = (function() {
    function Character(team, data) {
      var image;
      image = new Image();
      image.src = data.avatar;
      image.onload = (function(_this) {
        return function() {
          return _this.avatar = image;
        };
      })(this);
      this.team = team;
      this.name = data.name;
      this.id = data.id;
      this.level = data.level;
      this.health = data.health;
      this.maxHealth = data.maxHealth;
    }

    Character.prototype.draw = function(context, size) {
      var measure, text;
      if (this.team === 'red') {
        context.strokeStyle = 'rgba(217, 83, 79, 1)';
        context.fillStyle = 'rgba(217, 83, 79, 0.4)';
      } else {
        context.strokeStyle = 'rgba(51, 122, 183, 1)';
        context.fillStyle = 'rgba(51, 122, 183, 0.4)';
      }
      context.fillRect(0, 0, size, size);
      context.strokeRect(0, 0, size, size);
      if (this.avatar != null) {
        context.drawImage(this.avatar, config.margin, config.margin, size - config.margin * 2, size - config.margin * 2);
      }
      text = this.name + ' (' + this.level + ')';
      context.font = config.nameFontSize + 'px Roboto';
      context.lineWidth = 1;
      context.fillStyle = '#FFFFFF';
      context.strokeStyle = '#000000';
      measure = context.measureText(text);
      context.fillText(text, (size - measure.width) / 2, config.nameFontSize);
      context.strokeText(text, (size - measure.width) / 2, config.nameFontSize);
      context.font = config.barFontSize + 'px Roboto';
      context.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      context.fillStyle = 'rgba(0, 0, 0, 0.4)';
      context.fillRect(config.margin, size - config.barFontSize - config.margin, size - config.margin * 2, config.barFontSize);
      context.strokeRect(config.margin, size - config.barFontSize - config.margin, size - config.margin * 2, config.barFontSize);
      context.fillStyle = 'rgba(217, 83, 79, 1)';
      context.fillRect(config.margin, size - config.barFontSize - config.margin, (size - config.margin * 2) * (this.health / this.maxHealth), config.barFontSize);
      text = Math.round(this.health) + ' / ' + this.maxHealth;
      measure = context.measureText(text);
      context.fillStyle = '#000000';
      return context.fillText(text, (size - measure.width) / 2, size - config.barFontSize / 2);
    };

    return Character;

  })();

  Battle = (function() {
    Battle.prototype.speed = {
      view: 3.0,
      info: 3.0,
      next: 3.0
    };

    function Battle(element) {
      this.canvas = $(element).children('canvas')[0];
      this.context = this.canvas.getContext('2d');
      this.battleLog = $.parseJSON($(element).children('.battle-log').first().text());
    }

    Battle.prototype.load = function() {
      var character, data, j, k, len, len1, ref, ref1;
      this.index = 0;
      this.characters = [];
      this.state = 'view';
      this.offset = 0;
      this.pause = false;
      $(this.canvas).click((function(_this) {
        return function(event) {
          return _this.click(event);
        };
      })(this));
      $(document).keydown((function(_this) {
        return function(event) {
          return _this.key(event);
        };
      })(this));
      ref = this.battleLog['teams']['red'];
      for (j = 0, len = ref.length; j < len; j++) {
        data = ref[j];
        character = new Character('red', data);
        this.characters[character.id] = character;
      }
      ref1 = this.battleLog['teams']['blue'];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        data = ref1[k];
        character = new Character('blue', data);
        this.characters[character.id] = character;
      }
      this.context.font = config.fontSize + 'px Roboto';
      this.action = this.battleLog['log'][this.index];
      this.attacker = this.characters[this.action.attacker];
      this.defender = this.characters[this.action.defender];
      return true;
    };

    Battle.prototype.drawCharacters = function(attacker, defender) {
      var halfWidth, size;
      size = this.canvas.height * 0.6;
      halfWidth = this.canvas.width / 2;
      this.context.save();
      this.context.translate((halfWidth - size) / 2, (this.canvas.height - size) / 2);
      attacker.draw(this.context, size);
      this.context.restore();
      this.context.save();
      this.context.translate((halfWidth - size) / 2 + halfWidth, (this.canvas.height - size) / 2);
      defender.draw(this.context, size);
      return this.context.restore();
    };

    Battle.prototype.drawInfo = function(text) {
      var blockSize, halfHeight, halfWidth, measure, starH, starPikes, starRadius, starW, starWidth, starX, starY, textX, textY;
      halfWidth = this.canvas.width / 2;
      halfHeight = this.canvas.height / 2;
      blockSize = this.canvas.height * 0.6;
      starRadius = 50;
      starWidth = starRadius * 2;
      starX = halfWidth + (blockSize + starRadius) / 2;
      starY = halfHeight;
      starW = (blockSize * 0.7) / starWidth;
      starH = 1.2;
      starPikes = 13;
      this.context.font = config.fontSize + 'px Roboto';
      measure = this.context.measureText(text);
      textX = starX - measure.width / 2;
      textY = halfHeight;
      this.context.save();
      this.context.lineWidth = 2;
      this.context.translate(starX, starY);
      this.context.scale(starW, starH);
      this.context.fillStyle = '#FFFFFF';
      this.context.strokeStyle = '#000000';
      this.drawStar(starPikes, starRadius * 0.6, starRadius);
      this.context.restore();
      this.context.save();
      this.context.translate(textX, textY);
      this.context.fillStyle = '#000000';
      this.context.fillText(text, 0, 0);
      return this.context.restore();
    };

    Battle.prototype.drawStar = function(pikes, innerRadius, outerRadius) {
      var i, j, ref, rot, step, x, y;
      rot = Math.PI / 2 * 3;
      step = Math.PI / pikes;
      this.context.beginPath();
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      this.context.moveTo(x, y);
      rot += step;
      for (i = j = 1, ref = pikes; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        this.context.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        this.context.lineTo(x, y);
        rot += step;
      }
      this.context.lineTo(0, -outerRadius);
      this.context.fill();
      this.context.stroke();
      return this.context.closePath();
    };

    Battle.prototype.getEndText = function() {
      if (this.battleLog['win']) {
        return i18n.battle.win;
      } else {
        return i18n.battle.lose;
      }
    };

    Battle.prototype.draw = function(delta) {
      var action, animate, at, attacker, defender, height, i, j, len, mark, measure, nextAction, nextAttacker, nextDefender, position, prevAction, prevAttacker, prevDefender, ref, text, width;
      this.context.fillStyle = '#FFFFFF';
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.offset += this.speed[this.state] * delta;
      animate = true;
      if (this.state === 'view' && animate) {
        action = this.battleLog['log'][this.index];
        attacker = this.characters[action.attacker];
        defender = this.characters[action.defender];
        if (action.type === 'hit') {
          defender.health = action.health;
        }
        this.drawCharacters(attacker, defender);
        if (this.offset > 1.0 && !this.pause) {
          this.offset = 0.0;
          defender.startHealth = defender.health;
          if (action.type === 'hit') {
            defender.endHealth = Math.max(defender.health - action.damage, 0);
          } else {
            defender.endHealth = defender.health;
          }
          this.state = 'info';
        }
        animate = false;
      }
      if (this.state === 'info' && animate) {
        action = this.battleLog['log'][this.index];
        attacker = this.characters[action.attacker];
        defender = this.characters[action.defender];
        this.drawCharacters(attacker, defender);
        if (this.offset <= 1.0) {
          this.context.globalAlpha = this.offset;
          defender.health = defender.startHealth;
        } else {
          if (this.offset <= 2.0) {
            this.context.globalAlpha = 1.0;
            i = Math.clamp(this.offset - 1.0, 0, 1);
            defender.health = Math.lerp(i, defender.endHealth, defender.startHealth);
          } else {
            defender.health = defender.endHealth;
            this.context.globalAlpha = Math.max(3.0 - this.offset, 0);
          }
        }
        if (this.offset > 4.0) {
          this.offset = 0.0;
          this.state = 'next';
        }
        if (action.type === 'hit') {
          text = action.damage;
          if (action.crit) {
            text += '!';
          }
        } else {
          text = i18n.battle.dodge;
        }
        this.drawInfo(text);
        this.context.globalAlpha = 1.0;
        animate = false;
      }
      if (this.state === 'next' && animate) {
        prevAction = this.battleLog['log'][this.index];
        nextAction = this.battleLog['log'][this.index + 1];
        prevAttacker = this.characters[prevAction.attacker];
        prevDefender = this.characters[prevAction.defender];
        position = (this.canvas.height / 2) * this.offset;
        this.context.save();
        this.context.translate(0, -position);
        this.drawCharacters(prevAttacker, prevDefender);
        this.context.restore();
        this.context.save();
        this.context.translate(0, this.canvas.height - position);
        if (nextAction != null) {
          nextAttacker = this.characters[nextAction.attacker];
          nextDefender = this.characters[nextAction.defender];
          if (nextAction.type === 'hit') {
            nextDefender.health = nextAction.health;
          }
          this.drawCharacters(nextAttacker, nextDefender);
        } else {
          text = this.getEndText();
          this.context.fillStyle = '#000000';
          measure = this.context.measureText(text);
          this.context.fillText(text, (this.canvas.width - measure.width) / 2, (this.canvas.height - 15) / 2);
        }
        this.context.restore();
        if (this.offset > 2.0) {
          this.index++;
          this.offset = 0.0;
          if (nextAction != null) {
            this.state = 'view';
          } else {
            this.state = 'end';
          }
        }
        animate = false;
      }
      if (this.state === 'end' && animate) {
        text = this.getEndText();
        this.offset = 0.0;
        this.context.fillStyle = '#000000';
        measure = this.context.measureText(text);
        this.context.fillText(text, (this.canvas.width - measure.width) / 2, (this.canvas.height - 15) / 2);
        animate = false;
      }
      width = this.canvas.width - 4;
      height = this.canvas.height - 2;
      this.context.save();
      this.context.strokeStyle = 'rgba(0, 0, 0, 0.7)';
      this.context.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.context.fillRect(2, height - 20, width, 20);
      this.context.strokeRect(2, height - 20, width, 20);
      this.context.fillStyle = '#5BC0DE';
      this.context.fillRect(2, height - 20, width * (Math.min(this.index / (this.battleLog['log'].length - 1), 1)), 20);
      this.context.lineWidth = 5;
      ref = this.battleLog['marks'];
      for (j = 0, len = ref.length; j < len; j++) {
        mark = ref[j];
        if (mark.type === 'fainted') {
          this.context.strokeStyle = '#D9534F';
        }
        at = (mark.at / (this.battleLog['log'].length - 1)) * width;
        this.context.beginPath();
        this.context.moveTo(at - this.context.lineWidth / 2 + 2, height - 20);
        this.context.lineTo(at - this.context.lineWidth / 2 + 2, height);
        this.context.stroke();
      }
      return this.context.restore();
    };

    Battle.prototype.click = function(event) {
      var b, coords, l, r, t, x, y;
      coords = this.canvas.relMouseCoords(event);
      x = coords.x;
      y = coords.y;
      l = 2;
      r = l + this.canvas.width - 4;
      b = this.canvas.height - 2;
      t = b - 20;
      if (x >= l && x <= r && y >= t && y <= b) {
        this.index = Math.round((x - l) / (r - l) * (this.battleLog['log'].length - 1));
        this.state = 'view';
        return this.offset = 0.0;
      }
    };

    Battle.prototype.key = function(event) {
      if (event.which === 32) {
        this.pause = !this.pause;
      }
      if (event.which === 37) {
        this.index = Math.max(this.index - 1, 0);
        this.offset = 1.0;
        this.state = 'view';
      }
      if (event.which === 39) {
        this.index = Math.min(this.index + 1, this.battleLog['log'].length - 1);
        this.offset = 1.0;
        return this.state = 'view';
      }
    };

    Battle.prototype.requestFrame = function(time) {
      var delta;
      delta = Math.max(time - this.lastTime, 0);
      this.lastTime = time;
      this.accumulator += delta;
      while (this.accumulator >= config.interval) {
        this.accumulator -= config.interval;
        this.draw(config.interval / 1000);
      }
      return window.requestAnimationFrame((function(_this) {
        return function(time) {
          return _this.requestFrame(time);
        };
      })(this));
    };

    Battle.prototype.start = function() {
      if (this.load()) {
        this.lastTime = new Date().getTime();
        this.accumulator = 0.0;
        return this.requestFrame(this.lastTime);
      }
    };

    return Battle;

  })();

  $(function() {
    return $('.battle').bind('show', function() {
      var battle;
      battle = new Battle(this);
      return battle.start();
    }).filter(':visible').trigger('show');
  });

}).call(this);

(function() {
  this.Chat = (function() {
    var commands, defaults;

    defaults = {
      messageUrl: null,
      playerUrl: null,
      emoticonUrl: null,
      interval: 2,
      history: 0,
      minLength: 1,
      maxLength: 512,
      cooldown: 60,
      join: 120,
      allowSend: true,
      allowReceive: true,
      sendExtra: {},
      receiveExtra: {},
      sendMethod: 'POST',
      receiveMethod: 'GET'
    };

    commands = {
      'clear': 'clearOutput'
    };

    function Chat(element, options) {
      var opt;
      opt = $.extend({}, defaults, options);
      this.messageUrl = opt.messageUrl;
      this.playerUrl = opt.playerUrl;
      this.emoticons = new Emoticons();
      this.allowSend = opt.allowSend;
      this.allowReceive = opt.allowReceive;
      this.receiveExtra = opt.receiveExtra;
      this.sendExtra = opt.sendExtra;
      this.receiveMethod = opt.receiveMethod;
      this.sendMethod = opt.sendMethod;
      this.input = $(element).find('.input');
      this.output = $(element).find('.output');
      this.sendBtn = $(element).find('.send');
      this.clearBtn = $(element).find('.clear');
      this.emoticonsBtn = $(element).find('.emoticons');
      this.emoticons.popover(this.emoticonsBtn, this.input);
      this.output[0].scrollTop = this.output[0].scrollHeight;
      $(this.input).keydown((function(_this) {
        return function(event) {
          return _this.onKey(event);
        };
      })(this));
      $(this.sendBtn).click((function(_this) {
        return function() {
          _this.send();
          return _this.clearInput();
        };
      })(this));
      $(this.clearBtn).click((function(_this) {
        return function() {
          return _this.clearOutput();
        };
      })(this));
      this.interval = opt.interval;
      this.join = opt.join;
      this.cooldown = opt.cooldown;
      this.sent = Math.round((new Date()).getTime() / 1000) - this.cooldown;
      this.touch();
      this.time = Math.max(this.time - opt.history, 0);
      this.receive();
    }

    Chat.prototype.getErrorText = function(name, args) {
      var k, ref, text, v;
      text = (ref = i18n.chat.errors[name]) != null ? ref : i18n.chat.errors.unknown;
      if ((args != null) && typeof args === 'object') {
        for (k in args) {
          v = args[k];
          text = text.replace(':' + k, v);
        }
      }
      return text;
    };

    Chat.prototype.error = function(name, args) {
      var alert;
      alert = $('<div></div>').addClass('alert').addClass('alert-danger').text(this.getErrorText(name, args));
      return $(this.output).append(alert);
    };

    Chat.prototype.alert = function(name, args) {
      return alert(this.getErrorText(name, args));
    };

    Chat.prototype.touch = function() {
      return this.time = Math.round((new Date()).getTime() / 1000);
    };

    Chat.prototype.send = function() {
      var command, data, func, k, matches, message, now, v;
      now = Math.round((new Date()).getTime() / 1000);
      message = $(this.input).val();
      matches = message.match(/^\/(\w+)/i);
      if ((matches != null) && (matches[1] != null)) {
        command = matches[1];
        for (k in commands) {
          v = commands[k];
          if (command.toLowerCase() === k.toLowerCase()) {
            func = this[v];
            if (typeof func === 'function') {
              func.call(this);
              return;
            }
          }
        }
        this.error('cmdNotFound', {
          'name': command
        });
        return;
      }
      if (this.allowSend) {
        if (message.length < this.minLength) {
          this.alert('tooShort', {
            'min': this.minLength
          });
          return;
        }
        if (message.length > this.maxLength) {
          alert('tooLong', {
            'max': this.maxLength
          });
          return;
        }
        if (this.sent + this.cooldown > now) {
          this.alert('cooldown');
          return;
        }
        data = $.extend({}, this.sendExtra, {
          message: $(this.input).val()
        });
        $.ajax({
          url: this.messageUrl,
          success: (function(_this) {
            return function(data) {
              return _this.onSent(data);
            };
          })(this),
          data: data,
          dataType: 'json',
          method: this.sendMethod
        });
        this.sent = now;
        return $(this.sendBtn).data('time', this.sent + this.cooldown);
      } else {
        return this.error('cannotSend');
      }
    };

    Chat.prototype.receive = function() {
      var data;
      if (this.allowReceive) {
        data = $.extend({}, this.receiveExtra, {
          time: this.time
        });
        $.ajax({
          url: this.messageUrl,
          data: data,
          complete: (function(_this) {
            return function() {
              return _this.onComplete();
            };
          })(this),
          success: (function(_this) {
            return function(data) {
              return _this.onReceived(data);
            };
          })(this),
          dataType: 'json',
          method: this.receiveMethod
        });
        return this.touch();
      } else {
        return this.error('cannotReceive');
      }
    };

    Chat.prototype.clearOutput = function() {
      return $(this.output).empty();
    };

    Chat.prototype.clearInput = function() {
      return $(this.input).val('');
    };

    Chat.prototype.getMessage = function(data) {
      return $('<p></p>').html(this.emoticons.insert(data.message)).append($('<small></small>').addClass('chat-time').data('time', data.time));
    };

    Chat.prototype.newMessage = function(data) {
      var author, avatar, col1, col2, div1, div2, message, row;
      row = $('<div></div>').addClass('row').addClass('chat-message').data('time', data.time).data('author', data.author);
      col1 = $('<div></div>').addClass('col-xs-1');
      col2 = $('<div></div>').addClass('col-xs-11');
      if (this.playerUrl != null) {
        div1 = $('<a></a>').attr('href', this.getPlayerUrl(data.author)).addClass('chat-author');
      } else {
        div1 = $('<div></div>').addClass('chat-author');
      }
      div2 = $('<div></div>').addClass('chat-content');
      avatar = $('<img></img>').addClass('img-responsive').addClass('chat-avatar').attr('src', data.avatar);
      author = $('<p></p>').append($('<strong></strong>').addClass('chat-name').text(data.author));
      message = this.getMessage(data);
      $(div1).append(avatar).append(author);
      $(div2).append(message);
      $(col1).append(div1);
      $(col2).append(div2);
      $(row).append(col1).append(col2);
      return $(this.output).append(row);
    };

    Chat.prototype.modifyMessage = function(message, data) {
      return $(message).find('.chat-content').append(this.getMessage(data));
    };

    Chat.prototype.addMessage = function(data) {
      var author, message, scroll, time;
      scroll = (this.output[0].scrollHeight - this.output[0].scrollTop - this.output[0].clientHeight) <= 1;
      message = $(this.output).children().last();
      if (message.length === 0 || !$(message).is('.chat-message')) {
        this.newMessage(data);
      } else {
        time = $(message).data('time');
        author = $(message).data('author');
        if (author === data.author && (data.time - time) <= this.join) {
          this.modifyMessage(message, data);
        } else {
          this.newMessage(data);
        }
      }
      if (scroll) {
        return this.output[0].scrollTop = this.output[0].scrollHeight - 1;
      }
    };

    Chat.prototype.onSent = function(data) {
      if (data.status === 'error') {
        return this.error(data.reason, data.args);
      }
    };

    Chat.prototype.onReceived = function(data) {
      var i, len, message, results;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        message = data[i];
        results.push(this.addMessage(message));
      }
      return results;
    };

    Chat.prototype.onComplete = function() {
      return setTimeout((function(_this) {
        return function() {
          return _this.receive();
        };
      })(this), this.interval * 1000);
    };

    Chat.prototype.onKey = function(event) {
      if (event.which === 13) {
        this.send();
        return this.clearInput();
      }
    };

    Chat.prototype.getPlayerUrl = function(name) {
      return this.playerUrl.replace('{name}', name);
    };

    return Chat;

  })();

  $(function() {
    var update;
    update = function() {
      var now;
      now = Math.round((new Date()).getTime() / 1000);
      $('.chat .chat-time').each(function() {
        var interval, text, time;
        time = parseInt($(this).data('time'));
        interval = now - time;
        if (interval < 60) {
          text = i18n.chat.fewSecs;
        } else {
          text = window.timeFormatShort(interval);
        }
        return $(this).text(text + ' ' + i18n.chat.ago);
      });
      $('.chat .send').each(function() {
        var interval, text, time;
        if ($(this).data('disabled') !== 'true') {
          time = parseInt($(this).data('time'));
          text = $(this).data('text');
          interval = time - now;
          if (interval > 0) {
            return $(this).text(window.timeFormat(interval)).addClass('disabled');
          } else {
            return $(this).text(text).removeClass('disabled');
          }
        }
      });
      return setTimeout(update, 1000);
    };
    return update();
  });

}).call(this);

(function() {
  var update;

  update = function() {
    var date, now;
    date = new Date();
    now = Math.round(date.getTime() / 1000);
    $('.current-time').text(date.toUTCString());
    $('.time-left').each(function() {
      var to;
      to = $(this).data('to');
      return $(this).text(window.timeFormat(Math.max(to - now, 0)));
    });
    return setTimeout(update, 1000);
  };

  $(function() {
    return update();
  });

}).call(this);

(function() {
  var dialogs, show;

  dialogs = [];

  show = function(dialog) {
    var dismissible, ref;
    dismissible = (ref = $(dialog).data('dismissible')) != null ? ref : true;
    $(dialog).bind('shown.bs.modal', function(event) {
      return $(this).find('.battle').trigger('show');
    });
    if (dismissible) {
      return $(dialog).modal({
        backdrop: true,
        show: true,
        keyboard: true
      });
    } else {
      return $(dialog).modal({
        backdrop: 'static',
        show: true,
        keyboard: false
      });
    }
  };

  $(function() {
    dialogs = $('.modal.autoshow');
    return $(dialogs).each(function(index) {
      if (index === 0) {
        show(this);
      }
      if (index < (dialogs.length - 1)) {
        return $(this).on('hidden.bs.modal', function(event) {
          return show(dialogs[index + 1]);
        });
      }
    });
  });

}).call(this);

(function() {
  var counter;

  this.Emoticons = (function() {
    var defaults;

    defaults = {
      emoticons: {
        ';)': 'blink.png',
        ':D': 'grin.png',
        ':(': 'sad.png',
        ':)': 'smile.png',
        'B)': 'sunglasses.png',
        'O.o': 'surprised.png',
        ':p': 'tongue.png'
      },
      url: '/images/emoticons/{name}'
    };

    function Emoticons(url, emoticons) {
      this.url = url != null ? url : defaults.url;
      this.set = $.extend({}, defaults.emoticons, emoticons != null ? emoticons : {});
    }

    Emoticons.prototype.insert = function(text) {
      var emoticon, k, ref, url, v;
      ref = this.set;
      for (k in ref) {
        v = ref[k];
        url = this.url.replace('{name}', v);
        emoticon = '<img class="emoticon" src="' + url + '" alt="' + k + '" title="' + k + '"/>';
        text = text.replaceAll(k, emoticon);
      }
      return text;
    };

    Emoticons.prototype.popover = function(button, output) {
      return $(button).popover({
        html: true,
        trigger: 'click',
        placement: 'top',
        title: i18n.emoticons.title,
        content: (function(_this) {
          return function() {
            return _this.getPopoverContent(output);
          };
        })(this),
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content emoticon-container"></div></div>'
      });
    };

    Emoticons.prototype.getPopoverContent = function(output) {
      var container, img, k, ref, url, v;
      container = $('<div></div>');
      ref = this.set;
      for (k in ref) {
        v = ref[k];
        url = this.url.replace('{name}', v);
        img = $('<img></img>').addClass('emoticon').attr('src', url).attr('alt', k).attr('title', k).click(function() {
          return $(output).val($(output).val() + $(this).attr('alt'));
        });
        $(container).append(img);
      }
      return container;
    };

    return Emoticons;

  })();

  counter = 0;

  $(function() {
    var emoticons;
    emoticons = new Emoticons();
    return $('[data-emoticons=true]').each(function() {
      var text;
      text = $(this).text();
      text = emoticons.insert(text);
      return $(this).html(text);
    });
  });

}).call(this);

(function() {
  var afterLoaded, equalize, getColumns, getPrefix, getSize, widths;

  widths = {
    xs: 768,
    sm: 992,
    md: 1200
  };

  getPrefix = function() {
    var width;
    width = $(window).width();
    if (width < widths.xs) {
      return ['xs'];
    } else if (width < widths.sm) {
      return ['sm', 'xs'];
    } else if (width < widths.md) {
      return ['md', 'sm', 'xs'];
    } else {
      return ['lg', 'md', 'sm', 'xs'];
    }
  };

  getColumns = function(prefix) {
    var i, j, k, len, p, result;
    result = [];
    for (j = 0, len = prefix.length; j < len; j++) {
      p = prefix[j];
      for (i = k = 1; k <= 12; i = ++k) {
        result.push("col-" + p + "-" + i);
      }
    }
    return result;
  };

  getSize = function(object, prefix) {
    var j, len, p, ref, regexp, size;
    for (j = 0, len = prefix.length; j < len; j++) {
      p = prefix[j];
      regexp = new RegExp("col-" + p + "-(\\d+)");
      size = (ref = $(object).attr('class').match(regexp)) != null ? ref[1] : void 0;
      if (size != null) {
        return parseInt(size);
      }
    }
    return null;
  };

  equalize = function() {
    var columns, prefix, selector;
    prefix = getPrefix();
    columns = getColumns(prefix);
    selector = '.' + columns.join(',.');
    return $('.row.equalize').each(function() {
      var col, heights, hs, i, j, p, row, sum;
      heights = [];
      row = 0;
      sum = 0;
      $(this).children(selector).each(function() {
        var size;
        size = getSize(this, prefix);
        sum += size;
        if (sum > 12) {
          sum -= 12;
          row++;
        }
        if (heights[row] == null) {
          heights[row] = 0;
        }
        return heights[row] = Math.max(heights[row], $(this).height());
      });
      row = 0;
      sum = 0;
      col = null;
      $(this).children(selector).each(function() {
        sum += getSize(this, prefix);
        if (col == null) {
          col = this;
        }
        if (sum > 12) {
          sum -= 12;
          row++;
          col = this;
        }
        return $(this).height(heights[row]);
      });
      hs = Math.round((12 - sum) / 2);
      if ((col != null) && hs > 0) {
        p = prefix[0];
        for (i = j = 1; j <= 12; i = ++j) {
          $(col).removeClass("col-" + p + "-offset-" + i);
        }
        return $(col).addClass("col-" + p + "-offset-" + hs);
      }
    });
  };

  afterLoaded = function() {
    return $('img').on('load', equalize);
  };

  $(function() {});

}).call(this);

(function() {
  var keyDown, keyUp, mouseWheel, numberDecrease, numberIncrease, rangeChanged, speed;

  speed = 1;

  keyDown = function(event) {
    if (event.which === 17) {
      speed = 10;
    }
    if (event.which === 16) {
      return speed = 100;
    }
  };

  keyUp = function(event) {
    if (event.which === 17 || event.which === 16) {
      return speed = 1;
    }
  };

  mouseWheel = function(event) {
    var change, max, min, ref, ref1, ref2, ref3, step, value;
    console.log('mouseWheel');
    min = parseInt((ref = $(this).attr('min')) != null ? ref : 0);
    max = parseInt((ref1 = $(this).attr('max')) != null ? ref1 : 100);
    step = parseInt((ref2 = $(this).attr('step')) != null ? ref2 : 1);
    change = event.deltaY * step * speed;
    value = parseInt((ref3 = $(this).val()) != null ? ref3 : 0);
    value = Math.clamp(value + change, min, max);
    $(this).val(value).trigger('change');
    return event.preventDefault();
  };

  rangeChanged = function(event) {
    var after, before, output, ref, ref1, ref2, value;
    console.log('rangeChanged');
    output = $(this).parent().children('.range-value');
    before = (ref = $(output).data('before')) != null ? ref : '';
    after = (ref1 = $(output).data('after')) != null ? ref1 : '';
    value = (ref2 = $(this).val()) != null ? ref2 : 0;
    return $(output).text(before + value + after);
  };

  numberDecrease = function(event) {
    var input, max, min, ref, ref1, ref2, ref3, step, value;
    console.log('numberDecrease');
    input = $(this).parent().parent().children('input');
    min = parseInt((ref = $(input).attr('min')) != null ? ref : 0);
    max = parseInt((ref1 = $(input).attr('max')) != null ? ref1 : 100);
    step = parseInt((ref2 = $(input).attr('step')) != null ? ref2 : 1);
    value = parseInt((ref3 = $(input).val()) != null ? ref3 : 0);
    value = Math.clamp(value - speed * step, min, max);
    return $(input).val(value).trigger('change');
  };

  numberIncrease = function(event) {
    var input, max, min, ref, ref1, ref2, ref3, step, value;
    console.log('numberIncrease');
    input = $(this).parent().parent().children('input');
    min = parseInt((ref = $(input).attr('min')) != null ? ref : 0);
    max = parseInt((ref1 = $(input).attr('max')) != null ? ref1 : 100);
    step = parseInt((ref2 = $(input).attr('step')) != null ? ref2 : 1);
    value = parseInt((ref3 = $(input).val()) != null ? ref3 : 0);
    value = Math.clamp(value + speed * step, min, max);
    return $(input).val(value).trigger('change');
  };

  $(function() {
    $(window).keyup(keyUp).keydown(keyDown);
    $('input[type=number], input[type=range]').bind('mousewheel', mouseWheel);
    $('input[type=range]').change(rangeChanged).mousemove(rangeChanged);
    $('.number-minus').children('button').click(numberDecrease);
    return $('.number-plus').children('button').click(numberIncrease);
  });

}).call(this);

(function() {
  $(function() {
    var help, hide, position, show, size;
    console.log($(document).size());
    help = false;
    size = function(element) {
      return {
        width: $(element).width(),
        height: $(element).height()
      };
    };
    position = function(element) {
      return $(element).offset();
    };
    show = function() {
      var mainOverlay, navOverlay;
      if (!help) {
        help = true;
        mainOverlay = $('<div></div>').attr('id', 'mainOverlay').addClass('overlay').css(size(document)).click(hide).hide();
        navOverlay = $('<div></div>').attr('id', 'navOverlay').addClass('overlay').css('position', 'fixed').css('z-index', 100000).css(size('#mainNav')).click(hide).hide();
        console.log($('#mainContent [data-help]'));
        console.log($('#mainNav [data-help]'));
        $('#mainContent [data-help]').each(function() {
          var copy, p, s;
          copy = $(this).clone();
          p = position(this);
          s = size(this);
          $(copy).addClass('helper').css('position', 'absolute').tooltip({
            placement: 'auto top',
            title: $(this).data('help')
          }).css(p).css(s);
          $(copy).find('[title]').removeAttr('title');
          return $(mainOverlay).append(copy);
        });
        $('#mainNav [data-help]').each(function() {
          var copy, p, s;
          copy = $(this).clone();
          p = position(this);
          s = size(this);
          $(copy).addClass('helper').css('position', 'absolute').tooltip({
            placement: 'auto top',
            title: $(this).data('help')
          }).css(p).css(s);
          $(copy).find('[title]').removeAttr('title');
          return $(navOverlay).append(copy);
        });
        $('body').append(mainOverlay).append(navOverlay);
        $(mainOverlay).fadeIn();
        return $(navOverlay).fadeIn();
      }
    };
    hide = function() {
      if (help) {
        help = false;
        return $('.overlay').fadeOut({
          complete: function() {
            return $('.overlay').remove();
          }
        });
      }
    };
    $('#helpBtn').click(function() {
      return show();
    });
    return $(document).keydown(function(event) {
      if (event.which === 27) {
        return hide();
      }
    });
  });

}).call(this);

(function() {
  var i, lastTime, len, vendor, vendors;

  lastTime = 0;

  vendors = ['webkit', 'moz'];

  if (!window.requestAnimationFrame) {
    for (i = 0, len = vendors.length; i < len; i++) {
      vendor = vendors[i];
      window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
    }
  }

  window.requestAnimationFrame || (window.requestAnimationFrame = function(callback, element) {
    var currTime, id, timeToCall;
    currTime = new Date().getTime();
    timeToCall = Math.max(0, 16 - (currTime - lastTime));
    id = window.setTimeout(function() {
      return callback(currTime + timeToCall);
    }, timeToCall);
    return id;
  });

  window.cancelAnimationFrame || (window.cancelAnimationFrame = function(id) {
    return clearTimeout(id);
  });

}).call(this);

(function() {
  $(function() {
    return $('.image-preview').each(function() {
      var id, preview;
      preview = this;
      id = $(this).data('for');
      return $('#' + id).change(function(event) {
        var path;
        path = URL.createObjectURL(event.target.files[0]);
        if (path != null) {
          return $(preview).attr('src', path);
        }
      }).trigger('change');
    });
  });

}).call(this);

(function() {
  var button, select, set;

  set = function(lang) {
    return window.location.href = '/lang/' + lang;
  };

  button = function() {
    return set($(this).data('lang'));
  };

  select = function() {
    return set($(this).val());
  };

  $(function() {
    $('.language-select').change(select);
    return $('.language-button').click(button);
  });

}).call(this);

(function() {
  var navfix;

  navfix = function() {
    var height;
    height = $('#mainNav').height() + 10;
    return $('body').css('padding-top', height + 'px');
  };

  $(function() {
    $(window).resize(function() {
      return navfix();
    });
    return navfix();
  });

}).call(this);

(function() {
  var imageForFrame, refreshPlant;

  imageForFrame = function(frame) {
    return '/images/plants/plant-' + frame + '.png';
  };

  refreshPlant = function(plant) {
    var end, frame, now, start, watering;
    now = Math.round((new Date).getTime() / 1000);
    start = parseInt($(plant).data('start'));
    end = parseInt($(plant).data('end'));
    watering = parseInt($(plant).data('watering'));
    now = Math.min(now, watering);
    frame = Math.floor(17 * Math.clamp((now - start) / (end - start), 0, 1));
    $(plant).attr('src', imageForFrame(frame));
    if (frame < 17) {
      return setTimeout((function() {
        return refreshPlant(plant);
      }), 1000);
    }
  };

  $(function() {
    $('.plantation-plant').each(function() {
      return refreshPlant(this);
    });
    return $('#seedsModal').on('show.bs.modal', function(event) {
      var slot;
      slot = $(event.relatedTarget).data('slot');
      return $(this).find('input[name=slot]').val(slot);
    });
  });

}).call(this);

(function() {
  var fill, load, loaded, message, notify, setProgress, setValue, setValues, url;

  url = '/api/character';

  setProgress = function(object, value, minValue, maxValue, lastUpdate, nextUpdate) {
    var bar, base, child, timer;
    bar = $('.' + object + '-bar');
    timer = $('.' + object + '-timer');
    if (bar.length > 0) {
      child = $(bar).children('.progress-bar');
      $(child).data('max', maxValue).data('min', minValue).data('now', value);
      if (typeof (base = bar[0]).update === "function") {
        base.update();
      }
    }
    if (timer.length > 0) {
      child = $(timer).children('.progress-bar');
      if (nextUpdate != null) {
        return $(child).data('max', nextUpdate).data('min', lastUpdate);
      } else {
        return $(child).data('max', 1).data('min', 0);
      }
    }
  };

  setValues = function(object, value, minValue, maxValue) {
    $('.' + object + '-now').text(value);
    $('.' + object + '-min').text(minValue);
    return $('.' + object + '-max').text(maxValue);
  };

  setValue = function(object, value) {
    return $('.' + object).text(value);
  };

  fill = function(data) {
    var k, scope, v;
    setProgress('health', data.health, 0, data.maxHealth, data.healthUpdate, data.nextHealthUpdate);
    setValues('health', data.health, 0, data.maxHealth);
    setProgress('energy', data.energy, 0, data.maxEnergy, data.energyUpdate, data.nextEnergyUpdate);
    setValues('energy', data.energy, 0, data.maxEnergy);
    setProgress('wanted', data.wanted, 0, 6, data.wantedUpdate, data.nextWantedUpdate);
    setValues('wanted', data.wanted, 0, 6);
    setProgress('experience', data.experience, 0, data.maxExperience, null, null);
    setValues('experience', data.experience, 0, data.maxExperience);
    setProgress('plantator', data.plantatorExperience, 0, data.plantatorMaxExperience, null, null);
    setValues('plantator', data.plantatorExperience, 0, data.plantatorMaxExperience);
    setProgress('smuggler', data.smugglerExperience, 0, data.smugglerMaxExperience, null, null);
    setValues('smuggler', data.smugglerExperience, 0, data.smugglerMaxExperience);
    setProgress('dealer', data.dealerExperience, 0, data.dealerMaxExperience, null, null);
    setValues('dealer', data.dealerExperience, 0, data.dealerMaxExperience);
    scope = angular.element(document.body).scope();
    if ((scope != null) && (scope.player != null)) {
      for (k in data) {
        v = data[k];
        scope.player[k] = v;
      }
      return scope.$apply();
    }
  };

  loaded = function(data) {
    fill(data);
    if (data.reload) {
      window.location.refresh();
    }
    return setTimeout(load, data.nextUpdate * 1000);
  };

  notify = function(data) {
    var i, len, n;
    for (i = 0, len = data.length; i < len; i++) {
      n = data[i];
      window.notify({
        title: '<strong>' + n.title + '</strong>',
        message: '',
        url: '/reports/' + n.id
      });
    }
    if (window.active) {
      return window.notifyShow();
    }
  };

  message = function(data) {
    var i, len, n;
    for (i = 0, len = data.length; i < len; i++) {
      n = data[i];
      window.notify({
        title: '<strong>' + n.author + '</strong>: ' + n.title + '<br/>',
        message: n.content,
        url: '/messages/inbox/' + n.id
      });
    }
    if (window.active) {
      return window.notifyShow();
    }
  };

  load = function() {
    $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
      success: loaded
    });
    $.ajax({
      url: url + '/notifications',
      dataType: 'json',
      method: 'GET',
      success: notify
    });
    return $.ajax({
      url: url + '/messages',
      dataType: 'json',
      method: 'GET',
      success: message
    });
  };

  $(window).focus(function() {
    return load();
  });

  $(function() {
    return load();
  });

}).call(this);

(function() {
  var square;

  square = function() {
    return $('.square').each(function() {
      if ($(this).data('square') === 'width') {
        return $(this).width($(this).height());
      } else {
        return $(this).height($(this).width());
      }
    });
  };

  $(function() {
    $(window).resize(function() {
      return square();
    });
    return square();
  });

}).call(this);

(function() {
  var changed, random, randomIn, roll;

  changed = function() {
    var current, diff, left, old, ref, ref1, ref2, val;
    current = parseInt((ref = $('#currentStatisticsPoints').text()) != null ? ref : 0);
    left = parseInt($('#statisticsPoints').text());
    old = parseInt((ref1 = $(this).data('old')) != null ? ref1 : 0);
    val = parseInt((ref2 = $(this).val()) != null ? ref2 : 0);
    diff = val - old;
    if (diff > left) {
      diff = left;
    }
    val = old + diff;
    left -= diff;
    if (!isNaN(diff)) {
      $(this).val(val).data('old', val);
      $('#statisticsPoints').text(left);
      return $('.statistic').each(function() {
        var ref3;
        val = parseInt((ref3 = $(this).val()) != null ? ref3 : 0);
        return $(this).attr('max', left + val);
      });
    }
  };

  random = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  randomIn = function(array) {
    var index;
    index = random(0, array.length - 1);
    return array[index];
  };

  roll = function() {
    var i, j, points, ref, rollable, statistic, val;
    rollable = $('.statistic.rollable');
    $(rollable).val(0).trigger('change');
    points = parseInt($('#statisticsPoints').text());
    for (i = j = 1, ref = points; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      statistic = randomIn(rollable);
      val = parseInt($(statistic).val());
      $(statistic).val(val + 1);
    }
    return $(rollable).trigger('change');
  };

  $(function() {
    $('.statistic').bind('keyup input change', changed).trigger('change');
    $('.statRoller').click(roll);
    return roll();
  });

}).call(this);

(function() {
  var refresh, refreshing, update, updateNav;

  refreshing = false;

  refresh = function() {
    if (!refreshing) {
      window.location.refresh();
    }
    return refreshing = true;
  };

  update = function(timer) {
    var bar, ca, cb, label, max, min, now, percent, ref, ref1, reload, reversed, stop, time;
    bar = $(timer).children('.progress-bar').last();
    label = $(timer).children('.progress-label');
    time = Math.round((new Date).getTime() / 1000.0);
    min = $(bar).data('min');
    max = $(bar).data('max');
    stop = $(bar).data('stop');
    ca = $(bar).data('ca');
    cb = $(bar).data('cb');
    reversed = Boolean((ref = $(bar).data('reversed')) != null ? ref : false);
    reload = Boolean((ref1 = $(bar).data('reload')) != null ? ref1 : true);
    if (stop != null) {
      time = Math.min(time, stop);
    }
    now = Math.clamp(time, min, max);
    percent = (now - min) / (max - min);
    if (reversed) {
      percent = 1 - percent;
    }
    $(bar).css('width', (percent * 100) + '%');
    if ((ca != null) && (cb != null)) {
      $(bar).css('background-color', Math.lerpColors(percent, ca, cb));
    }
    $(label).text(typeof window.timeFormat === "function" ? window.timeFormat(max - now) : void 0);
    if (time > max && reload) {
      refresh();
    }
    return setTimeout(function() {
      return update(timer);
    }, 1000);
  };

  updateNav = function(timer) {
    var max, min, now, percent, time;
    time = Math.round((new Date).getTime() / 1000.0);
    min = $(timer).data('min');
    max = $(timer).data('max');
    now = Math.clamp(time, min, max);
    percent = 1 - (now - min) / (max - min);
    $(timer).css('width', (percent * 100) + '%');
    return setTimeout(function() {
      return updateNav(timer);
    }, 1000);
  };

  $(function() {
    $('.progress-time').each(function() {
      return update(this);
    });
    return $('.nav-timer > .nav-timer-bar').each(function() {
      return updateNav(this);
    });
  });

}).call(this);

(function() {
  $(function() {
    return $('[data-toggle="tooltip"]').each(function() {
      var options, trigger;
      options = {
        html: true,
        placement: 'auto left'
      };
      trigger = $(this).data('trigger');
      if (trigger != null) {
        options.trigger = trigger;
      }
      return $(this).tooltip(options);
    });
  });

}).call(this);

(function() {
  $(function() {
    var clicked, load, receive, show, tutorials;
    tutorials = {};
    $('.tutorial-step').popover({
      trigger: 'manual',
      placement: 'bottom'
    });
    show = function(step) {
      if (step != null) {
        return $(step.elements).bind('click', clicked).addClass('tutorial-active').first().popover('show');
      }
    };
    clicked = function(event) {
      var next;
      next = tutorials[this.step.name].shift();
      if (next != null) {
        $.ajax({
          url: '/api/character/tutorial',
          dataType: 'json',
          data: {
            name: this.step.name,
            stage: next.index
          },
          method: 'POST'
        });
        setTimeout(function() {
          return show(next);
        }, 500);
      } else {
        $.ajax({
          url: '/api/character/tutorial',
          dataType: 'json',
          data: {
            name: this.step.name,
            stage: this.step.index + 1
          },
          method: 'POST'
        });
      }
      return $(this.step.elements).unbind('click', clicked).removeClass('tutorial-active').popover('hide');
    };
    receive = function(object, name, data) {
      var body, btn1, btn2, content, dialog, footer, group, header, modal, title;
      if (data.stage < 0) {
        modal = $('<div></div>').addClass('modal fade');
        dialog = $('<div></div>').addClass('modal-dialog');
        content = $('<div></div>').addClass('modal-content');
        header = $('<div></div>').addClass('modal-header');
        body = $('<div></div>').addClass('modal-body');
        footer = $('<div></div>').addClass('modal-footer');
        title = $('<h4></h4>').addClass('modal-title');
        group = $('<div></div>').addClass('btn-group');
        btn1 = $('<div></div>').addClass('btn btn-success').attr('value', 'yes').text(i18n.yes);
        btn2 = $('<div></div>').addClass('btn btn-danger').attr('value', 'no').text(i18n.no);
        $(btn1).click(function() {
          $.ajax({
            url: '/api/character/tutorial',
            dataType: 'json',
            data: {
              name: name,
              active: 1
            },
            method: 'POST'
          });
          $(modal).modal('hide');
          return load(object, name, data);
        });
        $(btn2).click(function() {
          $.ajax({
            url: '/api/character/tutorial',
            dataType: 'json',
            data: {
              name: name,
              active: 0
            },
            method: 'POST'
          });
          return $(modal).modal('hide');
        });
        $(title).text(data.title);
        $(body).text(data.description);
        $(header).append(title);
        $(group).append(btn2).append(btn1);
        $(footer).append(group);
        $(content).append(header).append(body).append(footer);
        $(dialog).append(content);
        $(modal).append(dialog);
        $('body').append(modal);
        return $(modal).modal({
          backdrop: 'static',
          show: true,
          keyboard: false
        });
      } else {
        return load(object, name, data);
      }
    };
    load = function(object, name, data) {
      var depth, tutorial;
      tutorial = [];
      depth = $(object).parents('[data-tutorial=true]').length + 1;
      $(object).find('.tutorial-step').each(function() {
        var index, step;
        step = null;
        index = $(this).data('tutorial-index');
        if (index < data.stage || $(this).parents('[data-tutorial=true]').length !== depth) {
          return;
        }
        if (tutorial[index] != null) {
          step = tutorial[index];
        } else {
          step = {
            elements: [],
            name: name,
            index: index
          };
          tutorial[index] = step;
        }
        step.elements.push(this);
        return this.step = step;
      });
      tutorial = tutorial.filter(function(element) {
        if (element != null) {
          return true;
        } else {
          return false;
        }
      });
      tutorials[name] = tutorial;
      return show(tutorial.shift());
    };
    return $('[data-tutorial=true').each(function() {
      var name;
      name = $(this).data('tutorial-name');
      return $.ajax({
        url: '/api/character/tutorial',
        dataType: 'json',
        data: {
          name: name
        },
        method: 'GET',
        success: (function(_this) {
          return function(data) {
            if (data.active) {
              return receive(_this, name, data);
            }
          };
        })(this)
      });
    });
  });

}).call(this);

(function() {
  var base, base1, base2, clone, notifications, refreshing, relMouseCoords, showNotify, timeFormat, timeSeparate, updateProgress;

  window.format || (window.format = {
    time: {
      day: 'd',
      hour: 'h',
      minute: 'm',
      second: 's'
    }
  });

  if (window.active == null) {
    window.active = false;
  }

  $(window).focus(function() {
    return window.active = true;
  });

  $(window).blur(function() {
    return window.active = false;
  });

  $(window).resize(function() {
    if (this.resizeTo) {
      clearTimeout(this.resizeTo);
    }
    return this.resizeTo = setTimeout(function() {
      return $(this).trigger('resized');
    }, 500);
  });

  window.lpad || (window.lpad = function(value, padding) {
    var i, j, ref, zeroes;
    zeroes = "0";
    for (i = j = 1, ref = padding; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      zeroes += "0";
    }
    return (zeroes + value).slice(padding * -1);
  });

  timeSeparate = function(value) {
    if (value.length > 0) {
      return value + ' ';
    } else {
      return value;
    }
  };

  timeFormat = function(text, value, format) {
    text = timeSeparate(text);
    if (text.length > 0) {
      text += window.lpad(value, 2);
    } else {
      text += value;
    }
    return text + format;
  };

  window.timeFormat || (window.timeFormat = function(value) {
    var d, date, h, m, s, text;
    text = '';
    date = new Date(value * 1000);
    d = date.getUTCDate() - 1;
    h = date.getUTCHours();
    m = date.getUTCMinutes();
    s = date.getUTCSeconds();
    if (d > 0) {
      text += d + format.time.day;
    }
    if (h > 0) {
      text = timeFormat(text, h, format.time.hour);
    }
    if (h > 0 || m > 0) {
      text = timeFormat(text, m, format.time.minute);
    }
    if (h > 0 || m > 0 || s > 0) {
      text = timeFormat(text, s, format.time.second);
    }
    return text;
  });

  window.timeFormatShort || (window.timeFormatShort = function(value) {
    var d, date, h, m, s, text;
    text = '';
    date = new Date(value * 1000);
    d = date.getUTCDate() - 1;
    h = date.getUTCHours();
    m = date.getUTCMinutes();
    s = date.getUTCSeconds();
    if (d > 0) {
      return d + format.time.day;
    }
    if (h > 0) {
      return timeFormat(text, h, format.time.hour);
    }
    if (m > 0) {
      return timeFormat(text, m, format.time.minute);
    }
    if (s > 0) {
      return timeFormat(text, s, format.time.second);
    }
  });

  refreshing = false;

  (base = window.location).refresh || (base.refresh = function() {
    if (!refreshing) {
      refreshing = true;
      return window.location.reload(true);
    }
  });

  notifications = [];

  window.notify || (window.notify = function(props) {
    return notifications.push(props);
  });

  clone = function(obj) {
    var key, temp;
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    temp = new obj.constructor();
    for (key in obj) {
      temp[key] = clone(obj[key]);
    }
    return temp;
  };

  showNotify = function(n, i) {
    console.log('P', n, i);
    return setTimeout((function() {
      console.log('S', n, i);
      return $.notify(n, {
        placement: {
          from: 'bottom'
        },
        mouse_over: 'pause'
      });
    }), i * 1000);
  };

  window.notifyShow || (window.notifyShow = function() {
    var index, j, len, notification;
    if (window.active) {
      for (index = j = 0, len = notifications.length; j < len; index = ++j) {
        notification = notifications[index];
        showNotify($.extend({}, notification), index);
      }
      return notifications = [];
    }
  });

  $(window).focus(function() {
    return window.notifyShow();
  });

  Math.clamp || (Math.clamp = function(value, min, max) {
    return Math.max(Math.min(value, max), min);
  });

  Math.lerp || (Math.lerp = function(i, a, b) {
    return (a * i) + (b * (1 - i));
  });

  Math.hexToRgb || (Math.hexToRgb = function(hex) {
    var result;
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    }
    return null;
  });

  Math.rgbToHex || (Math.rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  });

  Math.lerpColors || (Math.lerpColors = function(i, a, b) {
    var ca, cb, cc;
    ca = Math.hexToRgb(a);
    cb = Math.hexToRgb(b);
    cc = {
      r: Math.round(Math.lerp(i, ca.r, cb.r)),
      g: Math.round(Math.lerp(i, ca.g, cb.g)),
      b: Math.round(Math.lerp(i, ca.b, cb.b))
    };
    return Math.rgbToHex(cc.r, cc.g, cc.b);
  });

  updateProgress = function() {
    var bar, ca, cb, label, max, min, now, percent, ref, reversed;
    bar = $(this).children('.progress-bar');
    label = $(this).children('.progress-label');
    min = $(bar).data('min');
    max = $(bar).data('max');
    ca = $(bar).data('ca');
    cb = $(bar).data('cb');
    now = Math.clamp($(bar).data('now'), min, max);
    reversed = Boolean((ref = $(bar).data('reversed')) != null ? ref : false);
    percent = (now - min) / (max - min) * 100;
    if (reversed) {
      percent = 100 - percent;
    }
    $(bar).css('width', percent + '%');
    if ((ca != null) && (cb != null)) {
      $(bar).css('background-color', Math.lerpColors(percent / 100, ca, cb));
    }
    return $(label).text(now + ' / ' + max);
  };

  $(function() {
    return $('.progress').each(function() {
      return this.update || (this.update = updateProgress);
    });
  });

  relMouseCoords = function (event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
};

  HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

  (function() {
    var oldShow;
    return oldShow = $.fn.show;

    /*
    
    
    	$.fn.show = (speed, oldCallback) ->
    
    		console.log('show', this)
    
    		newCallback = ->
    
    			oldCallback.apply(this) if $.isFunction(oldCallback)
    			$(this).trigger('afterShow')
    
    		$(this).trigger('beforeShow')
    
    		deep = $(this).find('[data-deepshow]')
    
    		if deep.length
    			deep.show()
    
    		oldShow.apply(this, [speed, newCallback])
     */
  })();

  (base1 = String.prototype).escape || (base1.escape = function() {
    return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  });

  (base2 = String.prototype).replaceAll || (base2.replaceAll = function(search, replace) {
    return this.replace(new RegExp(search.escape(), 'gi'), replace);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdmF0YXIuY29mZmVlIiwiYmF0dGxlLmNvZmZlZSIsImNoYXQuY29mZmVlIiwiY2xvY2suY29mZmVlIiwiZGlhbG9nLmNvZmZlZSIsImVtb3RpY29uLmNvZmZlZSIsImVxdWFsaXplci5jb2ZmZWUiLCJmb3JtLmNvZmZlZSIsImhlbHBlci5jb2ZmZWUiLCJpZWZpeC5jb2ZmZWUiLCJpbWFnZVByZXZpZXcuY29mZmVlIiwibGFuZ3VhZ2UuY29mZmVlIiwibmF2Zml4LmNvZmZlZSIsInBsYW50YXRpb24uY29mZmVlIiwicGxheWVyLmNvZmZlZSIsInNxdWFyZS5jb2ZmZWUiLCJzdGF0aXN0aWNzLmNvZmZlZSIsInRpbWVyLmNvZmZlZSIsInRvb2x0aXAuY29mZmVlIiwidHV0b3JpYWwuY29mZmVlIiwidXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BO0VBQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFBdUIsRUFBdkI7O0VBSVAsSUFBQyxDQUFBLEdBQUcsQ0FBQyxVQUFMLENBQWdCLGdCQUFoQixFQUFrQztJQUFDLFFBQUQsRUFBVyxTQUFDLE1BQUQ7YUFHNUMsTUFBTSxDQUFDLEtBQVAsR0FBZSxTQUFDLEtBQUQsRUFBUSxTQUFSO0FBRWQsWUFBQTtRQUFBLENBQUEsdUJBQUksWUFBWTtRQUNoQixDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBYjtlQUVKLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQSxHQUFRLENBQW5CLENBQUEsR0FBd0I7TUFMVjtJQUg2QixDQUFYO0dBQWxDOztFQWNBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixrQkFBaEIsRUFBb0M7SUFBQyxRQUFELEVBQVcsU0FBQyxNQUFEO0FBTTlDLFVBQUE7TUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFDO01BQ2YsTUFBQSxHQUFTLENBQUEsU0FBQSxLQUFBO2VB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U0FBQyxNQUFELEVBQVMsT0FBVDtXQUMvQixJQUFJLENBQUMsT0FBTCxDQUFpQixJQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBUCxDQUFBLENBQVAsRUFBd0IsSUFBeEIsQ0FBakIsRUFBZ0QsT0FBaEQ7RUFEK0I7QUFsU2hDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcblxyXG5cclxuXHJcbkBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZ2FtZScsIFtdKVxyXG5cclxuXHJcblxyXG5AYXBwLmNvbnRyb2xsZXIoJ0dhbWVDb250cm9sbGVyJywgWyckc2NvcGUnLCAoJHNjb3BlKSAtPlxyXG5cclxuXHJcblx0JHNjb3BlLnJvdW5kID0gKHZhbHVlLCBwcmVjaXNpb24pIC0+XHJcblxyXG5cdFx0cCA9IHByZWNpc2lvbiA/IDBcclxuXHRcdG4gPSBNYXRoLnBvdygxMCwgcClcclxuXHJcblx0XHRNYXRoLnJvdW5kKHZhbHVlICogbikgLyBuXHJcblxyXG5dKVxyXG5cclxuXHJcblxyXG5AYXBwLmNvbnRyb2xsZXIoJ1BsYXllckNvbnRyb2xsZXInLCBbJyRzY29wZScsICgkc2NvcGUpIC0+XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRvbGQgPSBkb2N1bWVudC50aXRsZVxyXG5cdHVwZGF0ZSA9ICgpID0+XHJcblxyXG5cdFx0aWYgQGlzQnVzeVxyXG5cclxuXHRcdFx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHRcdFx0bGVmdCA9IE1hdGgubWF4KEBqb2JFbmQgLSBub3csIDApXHJcblxyXG5cdFx0XHRpZiBsZWZ0ID4gMFxyXG5cclxuXHRcdFx0XHRkb2N1bWVudC50aXRsZSA9IHdpbmRvdy50aW1lRm9ybWF0KGxlZnQpICsgJyAtICcgKyBvbGRcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRkb2N1bWVudC50aXRsZSA9IG9sZFxyXG5cclxuXHRcdHNldFRpbWVvdXQodXBkYXRlLCAxMDAwKVxyXG5cclxuXHJcblxyXG5cdHVwZGF0ZSgpXHJcblxyXG5dKVxyXG5cclxuIiwiXHJcblxyXG5jbGlja2VkID0gLT5cclxuXHQkKCcuYXZhdGFyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcblx0JCgnI2F2YXRhcicpLnZhbCgkKHRoaXMpLmRhdGEoJ2F2YXRhcicpKVxyXG5cdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblxyXG5cclxuJCAtPlxyXG5cdCQoJy5hdmF0YXInKS5jbGljayhjbGlja2VkKS5maXJzdCgpLnRyaWdnZXIoJ2NsaWNrJykiLCJjb25maWcgPVxyXG5cdGZvbnRTaXplOiAzMFxyXG5cdGJhckZvbnRTaXplOiAyMFxyXG5cdG5hbWVGb250U2l6ZTogMzBcclxuXHRtYXJnaW46IDVcclxuXHRpbnRlcnZhbDogMTAwMCAvIDYwXHJcblxyXG5cclxuXHJcbmNsYXNzIENoYXJhY3RlclxyXG5cclxuXHJcblx0Y29uc3RydWN0b3I6ICh0ZWFtLCBkYXRhKSAtPlxyXG5cclxuXHRcdGltYWdlID0gbmV3IEltYWdlKClcclxuXHRcdGltYWdlLnNyYyA9IGRhdGEuYXZhdGFyXHJcblx0XHRpbWFnZS5vbmxvYWQgPSA9PlxyXG5cdFx0XHRAYXZhdGFyID0gaW1hZ2VcclxuXHJcblxyXG5cclxuXHRcdEB0ZWFtID0gdGVhbVxyXG5cdFx0QG5hbWUgPSBkYXRhLm5hbWVcclxuXHRcdEBpZCA9IGRhdGEuaWRcclxuXHRcdEBsZXZlbCA9IGRhdGEubGV2ZWxcclxuXHRcdEBoZWFsdGggPSBkYXRhLmhlYWx0aFxyXG5cdFx0QG1heEhlYWx0aCA9IGRhdGEubWF4SGVhbHRoXHJcblxyXG5cclxuXHRkcmF3OiAoY29udGV4dCwgc2l6ZSkgLT5cclxuXHRcdGlmIEB0ZWFtID09ICdyZWQnXHJcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMSknXHJcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjE3LCA4MywgNzksIDAuNCknXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSg1MSwgMTIyLCAxODMsIDEpJ1xyXG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDUxLCAxMjIsIDE4MywgMC40KSdcclxuXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHNpemUsIHNpemUpXHJcblx0XHRjb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSlcclxuXHJcblx0XHRpZiBAYXZhdGFyP1xyXG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZShAYXZhdGFyLCBjb25maWcubWFyZ2luLCBjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIsIHNpemUgLSBjb25maWcubWFyZ2luICogMilcclxuXHJcblx0XHR0ZXh0ID0gQG5hbWUgKyAnICgnICsgQGxldmVsICsgJyknXHJcblxyXG5cdFx0Y29udGV4dC5mb250ID0gY29uZmlnLm5hbWVGb250U2l6ZSArICdweCBSb2JvdG8nXHJcblx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDFcclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRtZWFzdXJlID0gY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0LCAoc2l6ZSAtIG1lYXN1cmUud2lkdGgpIC8gMiwgY29uZmlnLm5hbWVGb250U2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCAoc2l6ZSAtIG1lYXN1cmUud2lkdGgpIC8gMiwgY29uZmlnLm5hbWVGb250U2l6ZSlcclxuXHJcblxyXG5cdFx0Y29udGV4dC5mb250ID0gY29uZmlnLmJhckZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjcpJ1xyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjQpJ1xyXG5cdFx0Y29udGV4dC5maWxsUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyLCBjb25maWcuYmFyRm9udFNpemUpXHJcblx0XHRjb250ZXh0LnN0cm9rZVJlY3QoY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5iYXJGb250U2l6ZSAtIGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcubWFyZ2luICogMiwgY29uZmlnLmJhckZvbnRTaXplKVxyXG5cclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjE3LCA4MywgNzksIDEpJ1xyXG5cdFx0Y29udGV4dC5maWxsUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgKHNpemUgLSBjb25maWcubWFyZ2luICogMikgKiAoQGhlYWx0aCAvIEBtYXhIZWFsdGgpLCBjb25maWcuYmFyRm9udFNpemUpXHJcblxyXG5cdFx0dGV4dCA9IE1hdGgucm91bmQoQGhlYWx0aCkgKyAnIC8gJyArIEBtYXhIZWFsdGhcclxuXHRcdG1lYXN1cmUgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0LCAoc2l6ZSAtIG1lYXN1cmUud2lkdGgpIC8gMiwgc2l6ZSAtIGNvbmZpZy5iYXJGb250U2l6ZSAvIDIpXHJcblxyXG5cclxuXHJcblxyXG5cclxuY2xhc3MgQmF0dGxlXHJcblxyXG5cdHNwZWVkOiBcclxuXHRcdHZpZXc6IDMuMFxyXG5cdFx0aW5mbzogMy4wXHJcblx0XHRuZXh0OiAzLjBcclxuXHJcblxyXG5cclxuXHJcblx0Y29uc3RydWN0b3I6IChlbGVtZW50KSAtPlxyXG5cclxuXHRcdEBjYW52YXMgPSAkKGVsZW1lbnQpLmNoaWxkcmVuKCdjYW52YXMnKVswXVxyXG5cdFx0QGNvbnRleHQgPSBAY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHJcblx0XHRAYmF0dGxlTG9nID0gJC5wYXJzZUpTT04oJChlbGVtZW50KS5jaGlsZHJlbignLmJhdHRsZS1sb2cnKS5maXJzdCgpLnRleHQoKSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRsb2FkOiAtPlxyXG5cclxuXHRcdEBpbmRleCA9IDBcclxuXHRcdEBjaGFyYWN0ZXJzID0gW11cclxuXHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cdFx0QG9mZnNldCA9IDBcclxuXHRcdEBwYXVzZSA9IGZhbHNlXHJcblxyXG5cdFx0JChAY2FudmFzKS5jbGljaygoZXZlbnQpID0+IEBjbGljayhldmVudCkpXHJcblx0XHQkKGRvY3VtZW50KS5rZXlkb3duKChldmVudCkgPT4gQGtleShldmVudCkpXHJcblxyXG5cdFx0Zm9yIGRhdGEgaW4gQGJhdHRsZUxvZ1sndGVhbXMnXVsncmVkJ11cclxuXHRcdFx0Y2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcigncmVkJywgZGF0YSlcclxuXHRcdFx0QGNoYXJhY3RlcnNbY2hhcmFjdGVyLmlkXSA9IGNoYXJhY3RlclxyXG5cclxuXHJcblx0XHRmb3IgZGF0YSBpbiBAYmF0dGxlTG9nWyd0ZWFtcyddWydibHVlJ11cclxuXHRcdFx0Y2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcignYmx1ZScsIGRhdGEpXHJcblx0XHRcdEBjaGFyYWN0ZXJzW2NoYXJhY3Rlci5pZF0gPSBjaGFyYWN0ZXJcclxuXHJcblx0XHRAY29udGV4dC5mb250ID0gY29uZmlnLmZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHJcblxyXG5cdFx0QGFjdGlvbiA9IEBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdEBhdHRhY2tlciA9IEBjaGFyYWN0ZXJzW0BhY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRAZGVmZW5kZXIgPSBAY2hhcmFjdGVyc1tAYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdHRydWVcclxuXHJcblxyXG5cclxuXHJcblx0ZHJhd0NoYXJhY3RlcnM6IChhdHRhY2tlciwgZGVmZW5kZXIpIC0+XHJcblxyXG5cdFx0c2l6ZSA9IEBjYW52YXMuaGVpZ2h0ICogMC42XHJcblx0XHRoYWxmV2lkdGggPSBAY2FudmFzLndpZHRoIC8gMlxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKChoYWxmV2lkdGggLSBzaXplKSAvIDIsIChAY2FudmFzLmhlaWdodCAtIHNpemUpIC8gMilcclxuXHRcdGF0dGFja2VyLmRyYXcoQGNvbnRleHQsIHNpemUpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSgoaGFsZldpZHRoIC0gc2l6ZSkgLyAyICsgaGFsZldpZHRoLCAoQGNhbnZhcy5oZWlnaHQgLSBzaXplKSAvIDIpXHJcblx0XHRkZWZlbmRlci5kcmF3KEBjb250ZXh0LCBzaXplKVxyXG5cdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cclxuXHRkcmF3SW5mbzogKHRleHQpIC0+XHJcblx0XHRoYWxmV2lkdGggPSBAY2FudmFzLndpZHRoIC8gMlxyXG5cdFx0aGFsZkhlaWdodCA9IEBjYW52YXMuaGVpZ2h0IC8gMlxyXG5cdFx0YmxvY2tTaXplID0gQGNhbnZhcy5oZWlnaHQgKiAwLjZcclxuXHJcblx0XHRzdGFyUmFkaXVzID0gNTBcclxuXHRcdHN0YXJXaWR0aCA9IHN0YXJSYWRpdXMgKiAyXHJcblx0XHRzdGFyWCA9IGhhbGZXaWR0aCArIChibG9ja1NpemUgKyBzdGFyUmFkaXVzKSAvIDJcclxuXHRcdHN0YXJZID0gaGFsZkhlaWdodFxyXG5cdFx0c3RhclcgPSAoYmxvY2tTaXplICogMC43KSAvIHN0YXJXaWR0aFxyXG5cdFx0c3RhckggPSAxLjJcclxuXHRcdHN0YXJQaWtlcyA9IDEzXHJcblxyXG5cdFx0QGNvbnRleHQuZm9udCA9IGNvbmZpZy5mb250U2l6ZSArICdweCBSb2JvdG8nXHJcblx0XHRtZWFzdXJlID0gQGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdHRleHRYID0gc3RhclggLSBtZWFzdXJlLndpZHRoIC8gMlxyXG5cdFx0dGV4dFkgPSBoYWxmSGVpZ2h0XHJcblxyXG5cclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LmxpbmVXaWR0aCA9IDJcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZShzdGFyWCwgc3RhclkpXHJcblx0XHRAY29udGV4dC5zY2FsZShzdGFyVywgc3RhckgpXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcclxuXHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRAZHJhd1N0YXIoc3RhclBpa2VzLCBzdGFyUmFkaXVzICogMC42LCBzdGFyUmFkaXVzKVxyXG5cdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUodGV4dFgsIHRleHRZKVxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRAY29udGV4dC5maWxsVGV4dCh0ZXh0LCAwLCAwKVxyXG5cdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cclxuXHRkcmF3U3RhcjogKHBpa2VzLCBpbm5lclJhZGl1cywgb3V0ZXJSYWRpdXMpIC0+XHJcblx0XHRyb3QgPSBNYXRoLlBJIC8gMiAqIDNcclxuXHRcdHN0ZXAgPSBNYXRoLlBJIC8gcGlrZXNcclxuXHJcblx0XHRAY29udGV4dC5iZWdpblBhdGgoKVxyXG5cdFx0eCA9IE1hdGguY29zKHJvdCkgKiBvdXRlclJhZGl1c1xyXG5cdFx0eSA9IE1hdGguc2luKHJvdCkgKiBvdXRlclJhZGl1c1xyXG5cdFx0QGNvbnRleHQubW92ZVRvKHgsIHkpXHJcblx0XHRyb3QgKz0gc3RlcFxyXG5cclxuXHRcdGZvciBpIGluIFsxLi5waWtlc11cclxuXHRcdFx0eCA9IE1hdGguY29zKHJvdCkgKiBpbm5lclJhZGl1c1xyXG5cdFx0XHR5ID0gTWF0aC5zaW4ocm90KSAqIGlubmVyUmFkaXVzXHJcblx0XHRcdEBjb250ZXh0LmxpbmVUbyh4LCB5KVxyXG5cdFx0XHRyb3QgKz0gc3RlcFxyXG5cclxuXHRcdFx0eCA9IE1hdGguY29zKHJvdCkgKiBvdXRlclJhZGl1c1xyXG5cdFx0XHR5ID0gTWF0aC5zaW4ocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRcdEBjb250ZXh0LmxpbmVUbyh4LCB5KVxyXG5cdFx0XHRyb3QgKz0gc3RlcFxyXG5cclxuXHRcdEBjb250ZXh0LmxpbmVUbygwLCAtb3V0ZXJSYWRpdXMpXHJcblx0XHRAY29udGV4dC5maWxsKClcclxuXHRcdEBjb250ZXh0LnN0cm9rZSgpXHJcblx0XHRAY29udGV4dC5jbG9zZVBhdGgoKVxyXG5cdFx0XHJcblxyXG5cdGdldEVuZFRleHQ6IC0+XHJcblxyXG5cdFx0aWYgQGJhdHRsZUxvZ1snd2luJ11cclxuXHJcblx0XHRcdGkxOG4uYmF0dGxlLndpblxyXG5cclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdGkxOG4uYmF0dGxlLmxvc2VcclxuXHJcblxyXG5cdGRyYXc6IChkZWx0YSktPlxyXG5cclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xyXG5cdFx0QGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIEBjYW52YXMud2lkdGgsIEBjYW52YXMuaGVpZ2h0KVxyXG5cdFx0QG9mZnNldCArPSBAc3BlZWRbQHN0YXRlXSAqIGRlbHRhXHJcblx0XHRhbmltYXRlID0gdHJ1ZVxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAndmlldycgYW5kIGFuaW1hdGVcclxuXHRcdFx0YWN0aW9uID0gQGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0XHRhdHRhY2tlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0ZGVmZW5kZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0XHRpZihhY3Rpb24udHlwZSA9PSAnaGl0JylcclxuXHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBhY3Rpb24uaGVhbHRoXHJcblxyXG5cdFx0XHRAZHJhd0NoYXJhY3RlcnMoYXR0YWNrZXIsIGRlZmVuZGVyKVxyXG5cclxuXHRcdFx0aWYoQG9mZnNldCA+IDEuMCBhbmQgbm90IEBwYXVzZSlcclxuXHRcdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdFx0ZGVmZW5kZXIuc3RhcnRIZWFsdGggPSBkZWZlbmRlci5oZWFsdGhcclxuXHJcblx0XHRcdFx0aWYgYWN0aW9uLnR5cGUgPT0gJ2hpdCdcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmVuZEhlYWx0aCA9IE1hdGgubWF4KGRlZmVuZGVyLmhlYWx0aCAtIGFjdGlvbi5kYW1hZ2UsIDApXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuZW5kSGVhbHRoID0gZGVmZW5kZXIuaGVhbHRoXHJcblxyXG5cdFx0XHRcdEBzdGF0ZSA9ICdpbmZvJ1xyXG5cclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICdpbmZvJyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHRhY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdGF0dGFja2VyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHRcdEBkcmF3Q2hhcmFjdGVycyhhdHRhY2tlciwgZGVmZW5kZXIpXHJcblxyXG5cdFx0XHRpZiBAb2Zmc2V0IDw9IDEuMFxyXG5cdFx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gQG9mZnNldFxyXG5cdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IGRlZmVuZGVyLnN0YXJ0SGVhbHRoXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBAb2Zmc2V0IDw9IDIuMFxyXG5cdFx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjBcclxuXHJcblx0XHRcdFx0XHRpID0gTWF0aC5jbGFtcChAb2Zmc2V0IC0gMS4wLCAwLCAxKVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gTWF0aC5sZXJwKGksIGRlZmVuZGVyLmVuZEhlYWx0aCwgZGVmZW5kZXIuc3RhcnRIZWFsdGgpXHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IGRlZmVuZGVyLmVuZEhlYWx0aFxyXG5cdFx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBNYXRoLm1heCgzLjAgLSBAb2Zmc2V0LCAwKVxyXG5cclxuXHRcdFx0aWYoQG9mZnNldCA+IDQuMClcclxuXHRcdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdFx0QHN0YXRlID0gJ25leHQnXHJcblxyXG5cdFx0XHRpZiBhY3Rpb24udHlwZSA9PSAnaGl0J1xyXG5cdFx0XHRcdHRleHQgPSBhY3Rpb24uZGFtYWdlXHJcblxyXG5cdFx0XHRcdGlmIGFjdGlvbi5jcml0XHJcblx0XHRcdFx0XHR0ZXh0ICs9ICchJ1xyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSBpMThuLmJhdHRsZS5kb2RnZVxyXG5cclxuXHJcblxyXG5cdFx0XHRAZHJhd0luZm8odGV4dClcclxuXHJcblxyXG5cdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMFxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ25leHQnIGFuZCBhbmltYXRlXHJcblxyXG5cdFx0XHRwcmV2QWN0aW9uID0gQGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0XHRuZXh0QWN0aW9uID0gQGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4ICsgMV1cclxuXHJcblxyXG5cdFx0XHRwcmV2QXR0YWNrZXIgPSBAY2hhcmFjdGVyc1twcmV2QWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRwcmV2RGVmZW5kZXIgPSBAY2hhcmFjdGVyc1twcmV2QWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHJcblx0XHRcdHBvc2l0aW9uID0gKEBjYW52YXMuaGVpZ2h0IC8gMikgKiBAb2Zmc2V0XHJcblxyXG5cdFx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdFx0QGNvbnRleHQudHJhbnNsYXRlKDAsIC1wb3NpdGlvbilcclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKHByZXZBdHRhY2tlciwgcHJldkRlZmVuZGVyKVxyXG5cdFx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdFx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdFx0QGNvbnRleHQudHJhbnNsYXRlKDAsIEBjYW52YXMuaGVpZ2h0IC0gcG9zaXRpb24pXHJcblxyXG5cdFx0XHRpZiBuZXh0QWN0aW9uP1xyXG5cdFx0XHRcdG5leHRBdHRhY2tlciA9IEBjaGFyYWN0ZXJzW25leHRBY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdFx0bmV4dERlZmVuZGVyID0gQGNoYXJhY3RlcnNbbmV4dEFjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHRcdFx0aWYobmV4dEFjdGlvbi50eXBlID09ICdoaXQnKVxyXG5cdFx0XHRcdFx0bmV4dERlZmVuZGVyLmhlYWx0aCA9IG5leHRBY3Rpb24uaGVhbHRoXHJcblxyXG5cdFx0XHRcdEBkcmF3Q2hhcmFjdGVycyhuZXh0QXR0YWNrZXIsIG5leHREZWZlbmRlcilcclxuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0ZXh0ID0gQGdldEVuZFRleHQoKVxyXG5cdFx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0XHRcdG1lYXN1cmUgPSBAY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0XHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIChAY2FudmFzLndpZHRoIC0gbWVhc3VyZS53aWR0aCkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSAxNSkgLyAyKVxyXG5cclxuXHRcdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cdFx0XHRpZiBAb2Zmc2V0ID4gMi4wXHJcblx0XHRcdFx0QGluZGV4KytcclxuXHRcdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdFx0aWYgbmV4dEFjdGlvbj9cclxuXHRcdFx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdEBzdGF0ZSA9ICdlbmQnXHJcblxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICdlbmQnIGFuZCBhbmltYXRlXHJcblx0XHRcdHRleHQgPSBAZ2V0RW5kVGV4dCgpXHJcblx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRcdG1lYXN1cmUgPSBAY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0XHRAY29udGV4dC5maWxsVGV4dCh0ZXh0LCAoQGNhbnZhcy53aWR0aCAtIG1lYXN1cmUud2lkdGgpIC8gMiwgKEBjYW52YXMuaGVpZ2h0IC0gMTUpIC8gMilcclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cclxuXHJcblxyXG5cdFx0d2lkdGggPSBAY2FudmFzLndpZHRoIC0gNFxyXG5cdFx0aGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgLSAyXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjQpJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFJlY3QoMiwgaGVpZ2h0IC0gMjAsIHdpZHRoLCAyMClcclxuXHRcdEBjb250ZXh0LnN0cm9rZVJlY3QoMiwgaGVpZ2h0IC0gMjAsIHdpZHRoLCAyMClcclxuXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzVCQzBERSdcclxuXHRcdEBjb250ZXh0LmZpbGxSZWN0KDIsIGhlaWdodCAtIDIwLCB3aWR0aCAqIChNYXRoLm1pbihAaW5kZXggLyAoQGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSksIDEpKSwgMjApXHJcblx0XHRAY29udGV4dC5saW5lV2lkdGggPSA1XHJcblxyXG5cdFx0Zm9yIG1hcmsgaW4gQGJhdHRsZUxvZ1snbWFya3MnXVxyXG5cclxuXHRcdFx0aWYgbWFyay50eXBlID09ICdmYWludGVkJ1xyXG5cdFx0XHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyNEOTUzNEYnXHJcblxyXG5cdFx0XHRhdCA9IChtYXJrLmF0IC8gKEBiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpKSAqIHdpZHRoXHJcblxyXG5cdFx0XHRAY29udGV4dC5iZWdpblBhdGgoKVxyXG5cdFx0XHRAY29udGV4dC5tb3ZlVG8oYXQgLSBAY29udGV4dC5saW5lV2lkdGggLyAyICsgMiwgaGVpZ2h0IC0gMjApXHJcblx0XHRcdEBjb250ZXh0LmxpbmVUbyhhdCAtIEBjb250ZXh0LmxpbmVXaWR0aCAvIDIgKyAyLCBoZWlnaHQpXHJcblx0XHRcdEBjb250ZXh0LnN0cm9rZSgpXHJcblxyXG5cdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cclxuXHJcblxyXG5cdGNsaWNrOiAoZXZlbnQpIC0+XHJcblx0XHRjb29yZHMgPSBAY2FudmFzLnJlbE1vdXNlQ29vcmRzKGV2ZW50KVxyXG5cdFx0eCA9IGNvb3Jkcy54XHJcblx0XHR5ID0gY29vcmRzLnlcclxuXHJcblx0XHRsID0gMlxyXG5cdFx0ciA9IGwgKyBAY2FudmFzLndpZHRoIC0gNFxyXG5cdFx0YiA9IEBjYW52YXMuaGVpZ2h0IC0gMlxyXG5cdFx0dCA9IGIgLSAyMFxyXG5cclxuXHJcblx0XHRpZiB4ID49IGwgYW5kIHggPD0gciBhbmQgeSA+PSB0IGFuZCB5IDw9IGJcclxuXHRcdFx0QGluZGV4ID0gTWF0aC5yb3VuZCgoeCAtIGwpIC8gKHIgLSBsKSAqIChAYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKSlcclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHJcblx0a2V5OiAoZXZlbnQpIC0+XHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMzJcclxuXHRcdFx0QHBhdXNlID0gIUBwYXVzZVxyXG5cclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAzN1xyXG5cdFx0XHRAaW5kZXggPSBNYXRoLm1heChAaW5kZXggLSAxLCAwKVxyXG5cdFx0XHRAb2Zmc2V0ID0gMS4wXHJcblx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDM5XHJcblx0XHRcdEBpbmRleCA9IE1hdGgubWluKEBpbmRleCArIDEsIEBiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpXHJcblx0XHRcdEBvZmZzZXQgPSAxLjBcclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblxyXG5cclxuXHRyZXF1ZXN0RnJhbWU6ICh0aW1lKSAtPlxyXG5cclxuXHRcdGRlbHRhID0gTWF0aC5tYXgodGltZSAtIEBsYXN0VGltZSwgMClcclxuXHRcdEBsYXN0VGltZSA9IHRpbWVcclxuXHRcdEBhY2N1bXVsYXRvciArPSBkZWx0YVxyXG5cclxuXHRcdHdoaWxlIEBhY2N1bXVsYXRvciA+PSBjb25maWcuaW50ZXJ2YWxcclxuXHJcblx0XHRcdEBhY2N1bXVsYXRvciAtPSBjb25maWcuaW50ZXJ2YWxcclxuXHRcdFx0QGRyYXcoY29uZmlnLmludGVydmFsIC8gMTAwMClcclxuXHJcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lKSA9PiBAcmVxdWVzdEZyYW1lKHRpbWUpKVxyXG5cclxuXHJcblx0c3RhcnQ6IC0+XHJcblxyXG5cdFx0aWYgQGxvYWQoKVxyXG5cclxuXHRcdFx0QGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuXHRcdFx0QGFjY3VtdWxhdG9yID0gMC4wXHJcblx0XHRcdEByZXF1ZXN0RnJhbWUoQGxhc3RUaW1lKVxyXG5cclxuXHJcblxyXG5cclxuJCgtPlxyXG5cclxuXHQkKCcuYmF0dGxlJykuYmluZCgnc2hvdycsIC0+XHJcblxyXG5cdFx0YmF0dGxlID0gbmV3IEJhdHRsZSh0aGlzKVxyXG5cdFx0YmF0dGxlLnN0YXJ0KClcclxuXHRcclxuXHQpLmZpbHRlcignOnZpc2libGUnKS50cmlnZ2VyKCdzaG93JylcclxuXHJcbikiLCJcclxuXHJcbmNsYXNzIEBDaGF0XHJcblxyXG5cdGRlZmF1bHRzID0ge1xyXG5cclxuXHRcdG1lc3NhZ2VVcmw6IG51bGwsXHJcblx0XHRwbGF5ZXJVcmw6IG51bGwsXHJcblx0XHRlbW90aWNvblVybDogbnVsbCxcclxuXHRcdGludGVydmFsOiAyLFxyXG5cdFx0aGlzdG9yeTogMCxcclxuXHRcdG1pbkxlbmd0aDogMSxcclxuXHRcdG1heExlbmd0aDogNTEyLFxyXG5cdFx0Y29vbGRvd246IDYwLFxyXG5cdFx0am9pbjogMTIwLFxyXG5cclxuXHRcdGFsbG93U2VuZDogdHJ1ZSxcclxuXHRcdGFsbG93UmVjZWl2ZTogdHJ1ZSxcclxuXHRcdHNlbmRFeHRyYToge30sXHJcblx0XHRyZWNlaXZlRXh0cmE6IHt9LFxyXG5cdFx0c2VuZE1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0cmVjZWl2ZU1ldGhvZDogJ0dFVCcsXHJcblx0fVxyXG5cclxuXHRjb21tYW5kcyA9IHtcclxuXHJcblx0XHQnY2xlYXInOiAnY2xlYXJPdXRwdXQnLFxyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblx0Y29uc3RydWN0b3I6IChlbGVtZW50LCBvcHRpb25zKSAtPlxyXG5cclxuXHRcdCNhbGVydCgnd2VsY29tZScpXHJcblxyXG5cdFx0b3B0ID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKVxyXG5cclxuXHRcdEBtZXNzYWdlVXJsID0gb3B0Lm1lc3NhZ2VVcmxcclxuXHRcdEBwbGF5ZXJVcmwgPSBvcHQucGxheWVyVXJsXHJcblx0XHRAZW1vdGljb25zID0gbmV3IEVtb3RpY29ucygpXHJcblxyXG5cclxuXHRcdEBhbGxvd1NlbmQgPSBvcHQuYWxsb3dTZW5kXHJcblx0XHRAYWxsb3dSZWNlaXZlID0gb3B0LmFsbG93UmVjZWl2ZVxyXG5cdFx0QHJlY2VpdmVFeHRyYSA9IG9wdC5yZWNlaXZlRXh0cmFcclxuXHRcdEBzZW5kRXh0cmEgPSBvcHQuc2VuZEV4dHJhXHJcblx0XHRAcmVjZWl2ZU1ldGhvZCA9IG9wdC5yZWNlaXZlTWV0aG9kXHJcblx0XHRAc2VuZE1ldGhvZCA9IG9wdC5zZW5kTWV0aG9kXHJcblxyXG5cclxuXHJcblxyXG5cdFx0QGlucHV0ID0gJChlbGVtZW50KS5maW5kKCcuaW5wdXQnKVxyXG5cdFx0QG91dHB1dCA9ICQoZWxlbWVudCkuZmluZCgnLm91dHB1dCcpXHJcblx0XHRAc2VuZEJ0biA9ICQoZWxlbWVudCkuZmluZCgnLnNlbmQnKVxyXG5cdFx0QGNsZWFyQnRuID0gJChlbGVtZW50KS5maW5kKCcuY2xlYXInKVxyXG5cdFx0QGVtb3RpY29uc0J0biA9ICQoZWxlbWVudCkuZmluZCgnLmVtb3RpY29ucycpXHJcblxyXG5cclxuXHRcdEBlbW90aWNvbnMucG9wb3ZlcihAZW1vdGljb25zQnRuLCBAaW5wdXQpXHJcblxyXG5cdFx0QG91dHB1dFswXS5zY3JvbGxUb3AgPSBAb3V0cHV0WzBdLnNjcm9sbEhlaWdodFxyXG5cclxuXHRcdCQoQGlucHV0KS5rZXlkb3duKChldmVudCkgPT4gQG9uS2V5KGV2ZW50KSlcclxuXHJcblxyXG5cdFx0JChAc2VuZEJ0bikuY2xpY2soID0+XHJcblxyXG5cdFx0XHRAc2VuZCgpXHJcblx0XHRcdEBjbGVhcklucHV0KClcclxuXHRcdClcclxuXHJcblx0XHQkKEBjbGVhckJ0bikuY2xpY2soID0+XHJcblxyXG5cdFx0XHRAY2xlYXJPdXRwdXQoKVxyXG5cdFx0KVxyXG5cclxuXHJcblxyXG5cdFx0QGludGVydmFsID0gb3B0LmludGVydmFsXHJcblxyXG5cclxuXHRcdEBqb2luID0gb3B0LmpvaW5cclxuXHJcblx0XHRAY29vbGRvd24gPSBvcHQuY29vbGRvd25cclxuXHRcdEBzZW50ID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMCkgLSBAY29vbGRvd25cclxuXHJcblx0XHRAdG91Y2goKVxyXG5cdFx0QHRpbWUgPSBNYXRoLm1heChAdGltZSAtIG9wdC5oaXN0b3J5LCAwKVxyXG5cclxuXHJcblx0XHRAcmVjZWl2ZSgpXHJcblx0XHRcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRnZXRFcnJvclRleHQ6IChuYW1lLCBhcmdzKSAtPlxyXG5cclxuXHRcdHRleHQgPSBpMThuLmNoYXQuZXJyb3JzW25hbWVdID8gaTE4bi5jaGF0LmVycm9ycy51bmtub3duXHJcblxyXG5cdFx0aWYgYXJncz8gYW5kIHR5cGVvZihhcmdzKSA9PSAnb2JqZWN0J1xyXG5cclxuXHRcdFx0Zm9yIGssIHYgb2YgYXJnc1xyXG5cdFx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoJzonICsgaywgdilcclxuXHJcblx0XHR0ZXh0XHJcblxyXG5cclxuXHJcblx0ZXJyb3I6IChuYW1lLCBhcmdzKSAtPlxyXG5cclxuXHRcdGFsZXJ0ID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2FsZXJ0JylcclxuXHRcdFx0LmFkZENsYXNzKCdhbGVydC1kYW5nZXInKVxyXG5cdFx0XHQudGV4dChAZ2V0RXJyb3JUZXh0KG5hbWUsIGFyZ3MpKVxyXG5cclxuXHRcdCQoQG91dHB1dClcclxuXHRcdFx0LmFwcGVuZChhbGVydClcclxuXHJcblx0YWxlcnQ6IChuYW1lLCBhcmdzKSAtPlxyXG5cclxuXHRcdGFsZXJ0KEBnZXRFcnJvclRleHQobmFtZSwgYXJncykpXHJcblxyXG5cclxuXHJcblxyXG5cdHRvdWNoOiAtPlxyXG5cdFx0QHRpbWUgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cclxuXHJcblx0c2VuZDogLT5cclxuXHJcblx0XHRub3cgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdFx0bWVzc2FnZSA9ICQoQGlucHV0KS52YWwoKVxyXG5cclxuXHRcdG1hdGNoZXMgPSBtZXNzYWdlLm1hdGNoKC9eXFwvKFxcdyspL2kpXHJcblxyXG5cclxuXHJcblx0XHRpZiBtYXRjaGVzPyBhbmQgbWF0Y2hlc1sxXT9cclxuXHRcdFx0Y29tbWFuZCA9IG1hdGNoZXNbMV1cclxuXHJcblx0XHRcdGZvciBrLCB2IG9mIGNvbW1hbmRzXHJcblxyXG5cdFx0XHRcdGlmIGNvbW1hbmQudG9Mb3dlckNhc2UoKSA9PSBrLnRvTG93ZXJDYXNlKClcclxuXHJcblx0XHRcdFx0XHRmdW5jID0gdGhpc1t2XVxyXG5cclxuXHRcdFx0XHRcdGlmIHR5cGVvZihmdW5jKSA9PSAnZnVuY3Rpb24nXHJcblx0XHRcdFx0XHRcdGZ1bmMuY2FsbCh0aGlzKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdEBlcnJvcignY21kTm90Rm91bmQnLCB7J25hbWUnOiBjb21tYW5kfSlcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cclxuXHRcdGlmIEBhbGxvd1NlbmRcclxuXHJcblx0XHRcdGlmIG1lc3NhZ2UubGVuZ3RoIDwgQG1pbkxlbmd0aFxyXG5cdFx0XHRcdEBhbGVydCgndG9vU2hvcnQnLCB7J21pbic6IEBtaW5MZW5ndGh9KVxyXG5cdFx0XHRcdHJldHVybiBcclxuXHJcblx0XHRcdGlmIG1lc3NhZ2UubGVuZ3RoID4gQG1heExlbmd0aFxyXG5cdFx0XHRcdGFsZXJ0KCd0b29Mb25nJywgeydtYXgnOiBAbWF4TGVuZ3RofSlcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdGlmIEBzZW50ICsgQGNvb2xkb3duID4gbm93XHJcblx0XHRcdFx0QGFsZXJ0KCdjb29sZG93bicpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cclxuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKHt9LCBAc2VuZEV4dHJhLCB7bWVzc2FnZTogJChAaW5wdXQpLnZhbCgpfSlcclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogQG1lc3NhZ2VVcmwsXHJcblx0XHRcdFx0c3VjY2VzczogKGRhdGEpID0+IEBvblNlbnQoZGF0YSksXHJcblx0XHRcdFx0ZGF0YTogZGF0YSxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdG1ldGhvZDogQHNlbmRNZXRob2QsXHRcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdEBzZW50ID0gbm93XHJcblx0XHRcdCQoQHNlbmRCdG4pLmRhdGEoJ3RpbWUnLCBAc2VudCArIEBjb29sZG93bilcclxuXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHRAZXJyb3IoJ2Nhbm5vdFNlbmQnKVxyXG5cclxuXHJcblx0cmVjZWl2ZTogLT5cclxuXHJcblx0XHRpZiBAYWxsb3dSZWNlaXZlXHJcblxyXG5cdFx0XHRkYXRhID0gJC5leHRlbmQoe30sIEByZWNlaXZlRXh0cmEsIHt0aW1lOiBAdGltZX0pXHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0XHR1cmw6IEBtZXNzYWdlVXJsLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHRcdFx0Y29tcGxldGU6ID0+IEBvbkNvbXBsZXRlKCksXHJcblx0XHRcdFx0c3VjY2VzczogKGRhdGEpID0+IEBvblJlY2VpdmVkKGRhdGEpLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0bWV0aG9kOiBAcmVjZWl2ZU1ldGhvZCxcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdEB0b3VjaCgpXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHRAZXJyb3IoJ2Nhbm5vdFJlY2VpdmUnKVxyXG5cclxuXHJcblxyXG5cdGNsZWFyT3V0cHV0OiAtPlxyXG5cclxuXHRcdCQoQG91dHB1dCkuZW1wdHkoKVxyXG5cclxuXHJcblx0Y2xlYXJJbnB1dDogLT5cclxuXHJcblx0XHQkKEBpbnB1dCkudmFsKCcnKVxyXG5cclxuXHJcblxyXG5cdGdldE1lc3NhZ2U6IChkYXRhKSAtPlxyXG5cdFx0JCgnPHA+PC9wPicpXHJcblx0XHRcdC5odG1sKEBlbW90aWNvbnMuaW5zZXJ0KGRhdGEubWVzc2FnZSkpXHJcblx0XHRcdC5hcHBlbmQoXHJcblxyXG5cdFx0XHRcdCQoJzxzbWFsbD48L3NtYWxsPicpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtdGltZScpXHJcblx0XHRcdFx0XHQuZGF0YSgndGltZScsIGRhdGEudGltZSlcclxuXHRcdFx0KVxyXG5cclxuXHJcblxyXG5cdG5ld01lc3NhZ2U6IChkYXRhKSAtPlxyXG5cclxuXHRcdHJvdyA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdyb3cnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtbWVzc2FnZScpXHJcblx0XHRcdC5kYXRhKCd0aW1lJywgZGF0YS50aW1lKVxyXG5cdFx0XHQuZGF0YSgnYXV0aG9yJywgZGF0YS5hdXRob3IpXHJcblxyXG5cdFx0Y29sMSA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdjb2wteHMtMScpXHJcblxyXG5cdFx0Y29sMiA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdjb2wteHMtMTEnKVxyXG5cclxuXHRcdGlmIEBwbGF5ZXJVcmw/XHJcblxyXG5cdFx0XHRkaXYxID0gJCgnPGE+PC9hPicpXHJcblx0XHRcdFx0LmF0dHIoJ2hyZWYnLCBAZ2V0UGxheWVyVXJsKGRhdGEuYXV0aG9yKSlcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtYXV0aG9yJylcclxuXHRcdGVsc2VcclxuXHRcdFxyXG5cdFx0XHRkaXYxID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY2hhdC1hdXRob3InKVxyXG5cclxuXHJcblxyXG5cdFx0ZGl2MiA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdjaGF0LWNvbnRlbnQnKVxyXG5cclxuXHJcblxyXG5cclxuXHRcdGF2YXRhciA9ICQoJzxpbWc+PC9pbWc+JylcclxuXHRcdFx0LmFkZENsYXNzKCdpbWctcmVzcG9uc2l2ZScpXHJcblx0XHRcdC5hZGRDbGFzcygnY2hhdC1hdmF0YXInKVxyXG5cdFx0XHQuYXR0cignc3JjJywgZGF0YS5hdmF0YXIpXHJcblxyXG5cclxuXHRcdGF1dGhvciA9ICQoJzxwPjwvcD4nKS5hcHBlbmQoXHJcblxyXG5cdFx0XHQkKCc8c3Ryb25nPjwvc3Ryb25nPicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LW5hbWUnKVxyXG5cdFx0XHRcdC50ZXh0KGRhdGEuYXV0aG9yKSxcclxuXHRcdClcclxuXHJcblx0XHRtZXNzYWdlID0gQGdldE1lc3NhZ2UoZGF0YSlcclxuXHJcblxyXG5cclxuXHRcdCQoZGl2MSkuYXBwZW5kKGF2YXRhcikuYXBwZW5kKGF1dGhvcilcclxuXHRcdCQoZGl2MikuYXBwZW5kKG1lc3NhZ2UpXHJcblx0XHQkKGNvbDEpLmFwcGVuZChkaXYxKVxyXG5cdFx0JChjb2wyKS5hcHBlbmQoZGl2MilcclxuXHRcdCQocm93KS5hcHBlbmQoY29sMSkuYXBwZW5kKGNvbDIpXHJcblx0XHQkKEBvdXRwdXQpLmFwcGVuZChyb3cpXHJcblxyXG5cclxuXHRtb2RpZnlNZXNzYWdlOiAobWVzc2FnZSwgZGF0YSkgLT5cclxuXHJcblx0XHQkKG1lc3NhZ2UpLmZpbmQoJy5jaGF0LWNvbnRlbnQnKS5hcHBlbmQoXHJcblxyXG5cdFx0XHRAZ2V0TWVzc2FnZShkYXRhKVxyXG5cdFx0KVxyXG5cclxuXHJcblxyXG5cdGFkZE1lc3NhZ2U6IChkYXRhKS0+XHJcblxyXG5cclxuXHRcdHNjcm9sbCA9IChAb3V0cHV0WzBdLnNjcm9sbEhlaWdodCAtIEBvdXRwdXRbMF0uc2Nyb2xsVG9wIC0gQG91dHB1dFswXS5jbGllbnRIZWlnaHQpIDw9IDFcclxuXHRcdG1lc3NhZ2UgPSAkKEBvdXRwdXQpLmNoaWxkcmVuKCkubGFzdCgpXHJcblxyXG5cclxuXHJcblx0XHRpZiBtZXNzYWdlLmxlbmd0aCA9PSAwIG9yICEkKG1lc3NhZ2UpLmlzKCcuY2hhdC1tZXNzYWdlJylcclxuXHRcdFx0XHJcblx0XHRcdEBuZXdNZXNzYWdlKGRhdGEpXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHR0aW1lID0gJChtZXNzYWdlKS5kYXRhKCd0aW1lJylcclxuXHRcdFx0YXV0aG9yID0gJChtZXNzYWdlKS5kYXRhKCdhdXRob3InKVxyXG5cclxuXHRcdFx0aWYgYXV0aG9yID09IGRhdGEuYXV0aG9yIGFuZCAoZGF0YS50aW1lIC0gdGltZSkgPD0gQGpvaW5cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRAbW9kaWZ5TWVzc2FnZShtZXNzYWdlLCBkYXRhKVxyXG5cdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdEBuZXdNZXNzYWdlKGRhdGEpXHJcblxyXG5cclxuXHJcblx0XHRpZiBzY3JvbGxcclxuXHRcdFx0QG91dHB1dFswXS5zY3JvbGxUb3AgPSBAb3V0cHV0WzBdLnNjcm9sbEhlaWdodCAtIDFcclxuXHJcblxyXG5cclxuXHJcblx0b25TZW50OiAoZGF0YSkgLT5cclxuXHJcblx0XHRAZXJyb3IoZGF0YS5yZWFzb24sIGRhdGEuYXJncykgaWYgZGF0YS5zdGF0dXMgPT0gJ2Vycm9yJ1xyXG5cclxuXHJcblx0b25SZWNlaXZlZDogKGRhdGEpIC0+XHJcblxyXG5cdFx0Zm9yIG1lc3NhZ2UgaW4gZGF0YVxyXG5cdFx0XHRAYWRkTWVzc2FnZShtZXNzYWdlKVxyXG5cclxuXHRvbkNvbXBsZXRlOiAtPlxyXG5cclxuXHRcdHNldFRpbWVvdXQoPT5cclxuXHJcblx0XHRcdEByZWNlaXZlKClcclxuXHRcdCwgQGludGVydmFsICogMTAwMClcclxuXHJcblxyXG5cdG9uS2V5OiAoZXZlbnQpIC0+XHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMTNcclxuXHRcdFx0QHNlbmQoKVxyXG5cdFx0XHRAY2xlYXJJbnB1dCgpXHJcblxyXG5cclxuXHJcblxyXG5cdGdldFBsYXllclVybDogKG5hbWUpIC0+XHJcblxyXG5cdFx0cmV0dXJuIEBwbGF5ZXJVcmwucmVwbGFjZSgne25hbWV9JywgbmFtZSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdHVwZGF0ZSA9ICgpIC0+XHJcblxyXG5cdFx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHJcblx0XHQkKCcuY2hhdCAuY2hhdC10aW1lJykuZWFjaCgtPlxyXG5cclxuXHRcdFx0dGltZSA9IHBhcnNlSW50KCQodGhpcykuZGF0YSgndGltZScpKVxyXG5cdFx0XHRpbnRlcnZhbCA9IG5vdyAtIHRpbWVcclxuXHJcblxyXG5cclxuXHRcdFx0aWYgaW50ZXJ2YWwgPCA2MFxyXG5cclxuXHRcdFx0XHR0ZXh0ID0gaTE4bi5jaGF0LmZld1NlY3NcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHR0ZXh0ID0gd2luZG93LnRpbWVGb3JtYXRTaG9ydChpbnRlcnZhbClcclxuXHJcblx0XHRcdCQodGhpcykudGV4dCh0ZXh0ICsgJyAnICsgaTE4bi5jaGF0LmFnbylcclxuXHRcdClcclxuXHJcblx0XHQkKCcuY2hhdCAuc2VuZCcpLmVhY2goLT5cclxuXHJcblx0XHRcdGlmICQodGhpcykuZGF0YSgnZGlzYWJsZWQnKSAhPSAndHJ1ZSdcclxuXHJcblx0XHRcdFx0dGltZSA9IHBhcnNlSW50KCQodGhpcykuZGF0YSgndGltZScpKVxyXG5cdFx0XHRcdHRleHQgPSAkKHRoaXMpLmRhdGEoJ3RleHQnKVxyXG5cdFx0XHRcdGludGVydmFsID0gdGltZSAtIG5vd1xyXG5cclxuXHJcblx0XHRcdFx0aWYgaW50ZXJ2YWwgPiAwXHJcblxyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQudGV4dCh3aW5kb3cudGltZUZvcm1hdChpbnRlcnZhbCkpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnZGlzYWJsZWQnKVxyXG5cdFx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0XHQkKHRoaXMpXHJcblx0XHRcdFx0XHRcdC50ZXh0KHRleHQpXHJcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxyXG5cclxuXHRcdClcclxuXHJcblxyXG5cdFx0c2V0VGltZW91dCh1cGRhdGUsIDEwMDApXHJcblxyXG5cdHVwZGF0ZSgpXHJcbikiLCJcclxuXHJcbnVwZGF0ZSA9ICgpIC0+XHJcblxyXG5cdGRhdGUgPSBuZXcgRGF0ZSgpXHJcblx0bm93ID0gTWF0aC5yb3VuZChkYXRlLmdldFRpbWUoKSAvIDEwMDApXHJcblx0JCgnLmN1cnJlbnQtdGltZScpLnRleHQoZGF0ZS50b1VUQ1N0cmluZygpKVxyXG5cclxuXHQkKCcudGltZS1sZWZ0JykuZWFjaCgtPlxyXG5cclxuXHRcdHRvID0gJCh0aGlzKS5kYXRhKCd0bycpXHJcblx0XHQkKHRoaXMpLnRleHQod2luZG93LnRpbWVGb3JtYXQoTWF0aC5tYXgodG8gLSBub3csIDApKSlcclxuXHQpXHJcblxyXG5cclxuXHRzZXRUaW1lb3V0KHVwZGF0ZSwgMTAwMClcclxuXHJcblxyXG5cclxuJCAtPlxyXG5cdHVwZGF0ZSgpIiwiXHJcblxyXG5kaWFsb2dzID0gW11cclxuXHJcblxyXG5zaG93ID0gKGRpYWxvZykgLT5cclxuXHJcblx0ZGlzbWlzc2libGUgPSAoJChkaWFsb2cpLmRhdGEoJ2Rpc21pc3NpYmxlJykpID8gdHJ1ZVxyXG5cclxuXHJcblxyXG5cdCQoZGlhbG9nKS5iaW5kKCdzaG93bi5icy5tb2RhbCcsIChldmVudCkgLT5cclxuXHJcblx0XHQkKHRoaXMpLmZpbmQoJy5iYXR0bGUnKS50cmlnZ2VyKCdzaG93JylcclxuXHQpXHJcblxyXG5cclxuXHRpZiBkaXNtaXNzaWJsZVxyXG5cclxuXHRcdCQoZGlhbG9nKS5tb2RhbCh7YmFja2Ryb3A6IHRydWUsIHNob3c6IHRydWUsIGtleWJvYXJkOiB0cnVlfSlcclxuXHJcblx0ZWxzZVxyXG5cclxuXHRcdCQoZGlhbG9nKS5tb2RhbCh7YmFja2Ryb3A6ICdzdGF0aWMnLCBzaG93OiB0cnVlLCBrZXlib2FyZDogZmFsc2V9KVxyXG5cclxuXHJcbiQgLT5cclxuXHRkaWFsb2dzID0gJCgnLm1vZGFsLmF1dG9zaG93JylcclxuXHJcblxyXG5cdCQoZGlhbG9ncykuZWFjaCgoaW5kZXgpIC0+XHJcblxyXG5cdFx0aWYgaW5kZXggPT0gMFxyXG5cdFx0XHRzaG93KHRoaXMpXHJcblxyXG5cdFx0aWYgaW5kZXggPCAoZGlhbG9ncy5sZW5ndGggLSAxKVxyXG5cdFx0XHQkKHRoaXMpLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAoZXZlbnQpIC0+XHJcblxyXG5cdFx0XHRcdHNob3coZGlhbG9nc1tpbmRleCArIDFdKVxyXG5cdFx0XHQpXHJcblx0KSIsIlxyXG5cclxuXHJcbmNsYXNzIEBFbW90aWNvbnNcclxuXHJcblx0ZGVmYXVsdHMgPSB7XHJcblxyXG5cdFx0ZW1vdGljb25zOiB7XHJcblxyXG5cdFx0XHQnOyknOiAnYmxpbmsucG5nJyxcclxuXHRcdFx0JzpEJzogJ2dyaW4ucG5nJyxcclxuXHRcdFx0JzooJzogJ3NhZC5wbmcnLFxyXG5cdFx0XHQnOiknOiAnc21pbGUucG5nJyxcclxuXHRcdFx0J0IpJzogJ3N1bmdsYXNzZXMucG5nJyxcclxuXHRcdFx0J08ubyc6ICdzdXJwcmlzZWQucG5nJyxcclxuXHRcdFx0JzpwJzogJ3Rvbmd1ZS5wbmcnLCBcclxuXHRcdH0sXHJcblxyXG5cdFx0dXJsOiAnL2ltYWdlcy9lbW90aWNvbnMve25hbWV9JyxcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29uc3RydWN0b3I6ICh1cmwsIGVtb3RpY29ucykgLT5cclxuXHJcblx0XHRAdXJsID0gdXJsID8gZGVmYXVsdHMudXJsXHJcblx0XHRAc2V0ID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLmVtb3RpY29ucywgZW1vdGljb25zID8ge30pXHJcblxyXG5cclxuXHRpbnNlcnQ6ICh0ZXh0KSAtPlxyXG5cclxuXHRcdGZvciBrLCB2IG9mIEBzZXRcclxuXHJcblx0XHRcdHVybCA9IEB1cmwucmVwbGFjZSgne25hbWV9JywgdilcclxuXHRcdFx0ZW1vdGljb24gPSAnPGltZyBjbGFzcz1cImVtb3RpY29uXCIgc3JjPVwiJyArIHVybCArICdcIiBhbHQ9XCInICsgayArICdcIiB0aXRsZT1cIicgKyBrICsgJ1wiLz4nXHJcblx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2VBbGwoaywgZW1vdGljb24pXHJcblxyXG5cclxuXHRcdHRleHRcclxuXHJcblx0cG9wb3ZlcjogKGJ1dHRvbiwgb3V0cHV0KSAtPlxyXG5cclxuXHRcdCQoYnV0dG9uKS5wb3BvdmVyKHtcclxuXHJcblx0XHRcdGh0bWw6IHRydWUsXHJcblx0XHRcdHRyaWdnZXI6ICdjbGljaycsXHJcblx0XHRcdHBsYWNlbWVudDogJ3RvcCcsXHJcblx0XHRcdHRpdGxlOiBpMThuLmVtb3RpY29ucy50aXRsZSxcclxuXHRcdFx0Y29udGVudDogPT4gQGdldFBvcG92ZXJDb250ZW50KG91dHB1dCksXHJcblx0XHRcdHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnQgZW1vdGljb24tY29udGFpbmVyXCI+PC9kaXY+PC9kaXY+JyxcclxuXHRcdH0pXHJcblxyXG5cdGdldFBvcG92ZXJDb250ZW50OiAob3V0cHV0KSAtPlxyXG5cclxuXHRcdGNvbnRhaW5lciA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHJcblx0XHRmb3IgaywgdiBvZiBAc2V0XHJcblx0XHRcdHVybCA9IEB1cmwucmVwbGFjZSgne25hbWV9JywgdilcclxuXHRcdFx0aW1nID0gJCgnPGltZz48L2ltZz4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnZW1vdGljb24nKVxyXG5cdFx0XHRcdC5hdHRyKCdzcmMnLCB1cmwpXHJcblx0XHRcdFx0LmF0dHIoJ2FsdCcsIGspXHJcblx0XHRcdFx0LmF0dHIoJ3RpdGxlJywgaylcclxuXHRcdFx0XHQuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0XHQkKG91dHB1dCkudmFsKCQob3V0cHV0KS52YWwoKSArICQodGhpcykuYXR0cignYWx0JykpXHJcblx0XHRcdFx0KVxyXG5cclxuXHRcdFx0JChjb250YWluZXIpLmFwcGVuZChpbWcpXHJcblxyXG5cdFx0cmV0dXJuIGNvbnRhaW5lclxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5jb3VudGVyID0gMFxyXG5cclxuXHJcbiQoLT5cclxuXHJcblx0ZW1vdGljb25zID0gbmV3IEVtb3RpY29ucygpXHJcblxyXG5cdCQoJ1tkYXRhLWVtb3RpY29ucz10cnVlXScpLmVhY2goLT5cclxuXHJcblx0XHR0ZXh0ID0gJCh0aGlzKS50ZXh0KClcclxuXHRcdHRleHQgPSBlbW90aWNvbnMuaW5zZXJ0KHRleHQpXHJcblx0XHQkKHRoaXMpLmh0bWwodGV4dClcclxuXHQpXHJcbikiLCJ3aWR0aHMgPVxyXG5cdHhzOiA3NjgsXHJcblx0c206IDk5MixcclxuXHRtZDogMTIwMCxcclxuXHJcblxyXG5cclxuZ2V0UHJlZml4ID0gLT5cclxuXHR3aWR0aCA9ICQod2luZG93KS53aWR0aCgpXHJcblxyXG5cdGlmIHdpZHRoIDwgd2lkdGhzLnhzXHJcblx0XHRbJ3hzJ11cclxuXHRlbHNlIGlmIHdpZHRoIDwgd2lkdGhzLnNtXHJcblx0XHRbJ3NtJywgJ3hzJ11cclxuXHRlbHNlIGlmIHdpZHRoIDwgd2lkdGhzLm1kXHJcblx0XHRbJ21kJywgJ3NtJywgJ3hzJ11cclxuXHRlbHNlXHJcblx0XHRbJ2xnJywgJ21kJywgJ3NtJywgJ3hzJ11cclxuXHJcblxyXG5nZXRDb2x1bW5zID0gKHByZWZpeCkgLT5cclxuXHRyZXN1bHQgPSBbXVxyXG5cdGZvciBwIGluIHByZWZpeFxyXG5cdFx0Zm9yIGkgaW4gWzEuLjEyXVxyXG5cdFx0XHRyZXN1bHQucHVzaChcImNvbC0je3B9LSN7aX1cIilcclxuXHRyZXN1bHRcclxuXHJcblxyXG5cclxuZ2V0U2l6ZSA9IChvYmplY3QsIHByZWZpeCkgLT5cclxuXHRmb3IgcCBpbiBwcmVmaXhcclxuXHRcdHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJjb2wtI3twfS0oXFxcXGQrKVwiKVxyXG5cdFx0c2l6ZSA9ICQob2JqZWN0KS5hdHRyKCdjbGFzcycpLm1hdGNoKHJlZ2V4cCk/WzFdXHJcblx0XHRyZXR1cm4gcGFyc2VJbnQoc2l6ZSkgaWYgc2l6ZT9cclxuXHRyZXR1cm4gbnVsbFxyXG5cclxuXHJcblxyXG5cclxuZXF1YWxpemUgPSAtPlxyXG5cdHByZWZpeCA9IGdldFByZWZpeCgpXHJcblx0Y29sdW1ucyA9IGdldENvbHVtbnMocHJlZml4KVxyXG5cdHNlbGVjdG9yID0gJy4nICsgY29sdW1ucy5qb2luKCcsLicpXHJcblx0XHJcblx0I2NvbnNvbGUubG9nKCdwcmVmaXg6ICcsIHByZWZpeClcclxuXHQjY29uc29sZS5sb2coJ2NvbHVtbnM6ICcsIGNvbHVtbnMpXHJcblx0I2NvbnNvbGUubG9nKCdzZWxlY3RvcjogJywgc2VsZWN0b3IpXHJcblxyXG5cclxuXHQkKCcucm93LmVxdWFsaXplJykuZWFjaCAtPlxyXG5cdFx0I2NvbnNvbGUubG9nKCduZXcgcm93JylcclxuXHRcdGhlaWdodHMgPSBbXVxyXG5cdFx0cm93ID0gMFxyXG5cdFx0c3VtID0gMFxyXG5cclxuXHRcdCQodGhpcykuY2hpbGRyZW4oc2VsZWN0b3IpLmVhY2ggLT5cclxuXHRcdFx0c2l6ZSA9IGdldFNpemUodGhpcywgcHJlZml4KVxyXG5cdFx0XHRzdW0gKz0gc2l6ZVxyXG5cclxuXHRcdFx0I2NvbnNvbGUubG9nKCdzaXplOiAnLCBzaXplKVxyXG5cdFx0XHQjY29uc29sZS5sb2coJ3N1bTogJywgc3VtKVxyXG5cclxuXHRcdFx0aWYgc3VtID4gMTJcclxuXHRcdFx0XHRzdW0gLT0gMTJcclxuXHRcdFx0XHRyb3crK1xyXG5cdFx0XHRcdCNjb25zb2xlLmxvZygnbmV4dCByb3cgJywgcm93LCBzaXplKVxyXG5cclxuXHRcdFx0aGVpZ2h0c1tyb3ddID89IDBcclxuXHRcdFx0aGVpZ2h0c1tyb3ddID0gTWF0aC5tYXgoaGVpZ2h0c1tyb3ddLCAkKHRoaXMpLmhlaWdodCgpKVxyXG5cdFx0XHQjY29uc29sZS5sb2coJ2hlaWdodCAnLCBoZWlnaHRzW3Jvd10pXHJcblxyXG5cdFx0cm93ID0gMFxyXG5cdFx0c3VtID0gMFxyXG5cdFx0Y29sID0gbnVsbFxyXG5cclxuXHRcdCQodGhpcykuY2hpbGRyZW4oc2VsZWN0b3IpLmVhY2ggLT5cclxuXHRcdFx0c3VtICs9IGdldFNpemUodGhpcywgcHJlZml4KVxyXG5cdFx0XHRjb2wgPz0gdGhpc1xyXG5cclxuXHRcdFx0aWYgc3VtID4gMTJcclxuXHRcdFx0XHRzdW0gLT0gMTJcclxuXHRcdFx0XHRyb3crK1xyXG5cdFx0XHRcdGNvbCA9IHRoaXNcclxuXHJcblx0XHRcdCQodGhpcykuaGVpZ2h0KGhlaWdodHNbcm93XSlcclxuXHJcblx0XHRocyA9IE1hdGgucm91bmQgKDEyIC0gc3VtKSAvIDJcclxuXHRcdGlmIGNvbD8gYW5kIGhzID4gMFxyXG5cdFx0XHRwID0gcHJlZml4WzBdXHJcblxyXG5cdFx0XHRmb3IgaSBpbiBbMS4uMTJdXHJcblx0XHRcdFx0JChjb2wpLnJlbW92ZUNsYXNzKFwiY29sLSN7cH0tb2Zmc2V0LSN7aX1cIilcclxuXHRcdFx0JChjb2wpLmFkZENsYXNzKFwiY29sLSN7cH0tb2Zmc2V0LSN7aHN9XCIpXHJcblxyXG5hZnRlckxvYWRlZCA9IC0+XHJcblx0JCgnaW1nJylcclxuXHRcdC5vbignbG9hZCcsIGVxdWFsaXplKVxyXG5cclxuXHJcbiQgLT5cclxuXHQjYWZ0ZXJMb2FkZWQoKVxyXG5cdCMkKHdpbmRvdykub24oJ3Jlc2l6ZWQnLCBlcXVhbGl6ZSlcclxuXHQjZXF1YWxpemUoKSIsInNwZWVkID0gMVxyXG5cclxuXHJcbmtleURvd24gPSAoZXZlbnQpIC0+XHJcblx0c3BlZWQgPSAxMCBpZiBldmVudC53aGljaCA9PSAxN1xyXG5cdHNwZWVkID0gMTAwIGlmIGV2ZW50LndoaWNoID09IDE2XHJcblxyXG5rZXlVcCA9IChldmVudCkgLT5cclxuXHRzcGVlZCA9IDEgaWYgZXZlbnQud2hpY2ggPT0gMTcgb3IgZXZlbnQud2hpY2ggPT0gMTZcclxuXHJcblxyXG5tb3VzZVdoZWVsID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdtb3VzZVdoZWVsJylcclxuXHRtaW4gPSBwYXJzZUludCAoJCh0aGlzKS5hdHRyKCdtaW4nKSA/IDApXHJcblx0bWF4ID0gcGFyc2VJbnQgKCQodGhpcykuYXR0cignbWF4JykgPyAxMDApXHJcblx0c3RlcCA9IHBhcnNlSW50ICgkKHRoaXMpLmF0dHIoJ3N0ZXAnKSA/IDEpXHJcblxyXG5cdGNoYW5nZSA9IGV2ZW50LmRlbHRhWSAqIHN0ZXAgKiBzcGVlZFxyXG5cdHZhbHVlID0gcGFyc2VJbnQgJCh0aGlzKS52YWwoKSA/IDBcclxuXHR2YWx1ZSA9IE1hdGguY2xhbXAgdmFsdWUgKyBjaGFuZ2UsIG1pbiwgbWF4XHJcblxyXG5cdCQodGhpcylcclxuXHRcdC52YWwgdmFsdWVcclxuXHRcdC50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcbnJhbmdlQ2hhbmdlZCA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygncmFuZ2VDaGFuZ2VkJylcclxuXHRvdXRwdXQgPSAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcucmFuZ2UtdmFsdWUnKVxyXG5cdGJlZm9yZSA9ICgkKG91dHB1dCkuZGF0YSAnYmVmb3JlJykgPyAnJ1xyXG5cdGFmdGVyID0gKCQob3V0cHV0KS5kYXRhICdhZnRlcicpID8gJydcclxuXHR2YWx1ZSA9ICQodGhpcykudmFsKCkgPyAwXHJcblxyXG5cdCQob3V0cHV0KS50ZXh0IGJlZm9yZSArIHZhbHVlICsgYWZ0ZXJcclxuXHJcblxyXG5udW1iZXJEZWNyZWFzZSA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygnbnVtYmVyRGVjcmVhc2UnKVxyXG5cdGlucHV0ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKVxyXG5cdG1pbiA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtaW4nKSA/IDApXHJcblx0bWF4ID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21heCcpID8gMTAwKVxyXG5cdHN0ZXAgPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignc3RlcCcpID8gMSlcclxuXHJcblx0dmFsdWUgPSBwYXJzZUludCAoJChpbnB1dCkudmFsKCkgPyAwKVxyXG5cdHZhbHVlID0gTWF0aC5jbGFtcCh2YWx1ZSAtIHNwZWVkICogc3RlcCwgbWluLCBtYXgpXHJcblx0JChpbnB1dCkudmFsKHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cclxuXHJcbm51bWJlckluY3JlYXNlID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdudW1iZXJJbmNyZWFzZScpXHJcblx0aW5wdXQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpXHJcblx0bWluID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21pbicpID8gMClcclxuXHRtYXggPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWF4JykgPyAxMDApXHJcblx0c3RlcCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdzdGVwJykgPyAxKVxyXG5cclxuXHR2YWx1ZSA9IHBhcnNlSW50ICgkKGlucHV0KS52YWwoKSA/IDApXHJcblx0dmFsdWUgPSBNYXRoLmNsYW1wKHZhbHVlICsgc3BlZWQgKiBzdGVwLCBtaW4sIG1heClcclxuXHQkKGlucHV0KS52YWwodmFsdWUpLnRyaWdnZXIoJ2NoYW5nZScpXHJcblxyXG5cclxuXHJcblxyXG4kIC0+IFxyXG5cdCQod2luZG93KVxyXG5cdFx0LmtleXVwIGtleVVwXHJcblx0XHQua2V5ZG93biBrZXlEb3duXHJcblxyXG5cdCQoJ2lucHV0W3R5cGU9bnVtYmVyXSwgaW5wdXRbdHlwZT1yYW5nZV0nKVxyXG5cdFx0LmJpbmQgJ21vdXNld2hlZWwnLCBtb3VzZVdoZWVsXHJcblxyXG5cdCQoJ2lucHV0W3R5cGU9cmFuZ2VdJylcclxuXHRcdC5jaGFuZ2UgcmFuZ2VDaGFuZ2VkXHJcblx0XHQubW91c2Vtb3ZlIHJhbmdlQ2hhbmdlZFxyXG5cclxuXHQkKCcubnVtYmVyLW1pbnVzJykuY2hpbGRyZW4oJ2J1dHRvbicpXHJcblx0XHQuY2xpY2sgbnVtYmVyRGVjcmVhc2VcclxuXHJcblxyXG5cdCQoJy5udW1iZXItcGx1cycpLmNoaWxkcmVuKCdidXR0b24nKVxyXG5cdFx0LmNsaWNrIG51bWJlckluY3JlYXNlXHJcblxyXG4iLCJcclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdGNvbnNvbGUubG9nKCQoZG9jdW1lbnQpLnNpemUoKSlcclxuXHJcblx0aGVscCA9IGZhbHNlXHJcblxyXG5cclxuXHRzaXplID0gKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0e3dpZHRoOiAkKGVsZW1lbnQpLndpZHRoKCksIGhlaWdodDogJChlbGVtZW50KS5oZWlnaHQoKX1cclxuXHJcblx0cG9zaXRpb24gPSAoZWxlbWVudCkgLT5cclxuXHJcblx0XHQkKGVsZW1lbnQpLm9mZnNldCgpXHJcblxyXG5cclxuXHJcblx0c2hvdyA9IC0+XHJcblxyXG5cdFx0aWYgbm90IGhlbHBcclxuXHJcblx0XHRcdGhlbHAgPSB0cnVlXHJcblxyXG5cdFx0XHRcclxuXHRcdFx0bWFpbk92ZXJsYXkgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdFx0LmF0dHIoJ2lkJywgJ21haW5PdmVybGF5JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ292ZXJsYXknKVxyXG5cdFx0XHRcdC5jc3Moc2l6ZShkb2N1bWVudCkpXHJcblx0XHRcdFx0LmNsaWNrKGhpZGUpXHJcblx0XHRcdFx0LmhpZGUoKVxyXG5cclxuXHJcblxyXG5cdFx0XHRuYXZPdmVybGF5ID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHRcdC5hdHRyKCdpZCcsICduYXZPdmVybGF5JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ292ZXJsYXknKVxyXG5cdFx0XHRcdC5jc3MoJ3Bvc2l0aW9uJywgJ2ZpeGVkJylcclxuXHRcdFx0XHQuY3NzKCd6LWluZGV4JywgMTAwMDAwKVxyXG5cdFx0XHRcdC5jc3Moc2l6ZSgnI21haW5OYXYnKSlcclxuXHRcdFx0XHQuY2xpY2soaGlkZSlcclxuXHRcdFx0XHQuaGlkZSgpXHJcblxyXG5cclxuXHJcblx0XHRcdGNvbnNvbGUubG9nKCQoJyNtYWluQ29udGVudCBbZGF0YS1oZWxwXScpKVxyXG5cdFx0XHRjb25zb2xlLmxvZygkKCcjbWFpbk5hdiBbZGF0YS1oZWxwXScpKVxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0JCgnI21haW5Db250ZW50IFtkYXRhLWhlbHBdJykuZWFjaCgtPlxyXG5cclxuXHRcdFx0XHRjb3B5ID0gJCh0aGlzKS5jbG9uZSgpXHJcblx0XHRcdFx0cCA9IHBvc2l0aW9uKHRoaXMpXHJcblx0XHRcdFx0cyA9IHNpemUodGhpcylcclxuXHJcblx0XHRcdFx0JChjb3B5KVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdoZWxwZXInKVxyXG5cdFx0XHRcdFx0LmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxyXG5cdFx0XHRcdFx0LnRvb2x0aXAoe3BsYWNlbWVudDogJ2F1dG8gdG9wJywgdGl0bGU6ICQodGhpcykuZGF0YSgnaGVscCcpfSlcclxuXHRcdFx0XHRcdC5jc3MocClcclxuXHRcdFx0XHRcdC5jc3MocylcclxuXHJcblx0XHRcdFx0JChjb3B5KS5maW5kKCdbdGl0bGVdJykucmVtb3ZlQXR0cigndGl0bGUnKVxyXG5cclxuXHRcdFx0XHQkKG1haW5PdmVybGF5KVxyXG5cdFx0XHRcdFx0LmFwcGVuZChjb3B5KVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHQkKCcjbWFpbk5hdiBbZGF0YS1oZWxwXScpLmVhY2goLT5cclxuXHJcblx0XHRcdFx0Y29weSA9ICQodGhpcykuY2xvbmUoKVxyXG5cdFx0XHRcdHAgPSBwb3NpdGlvbih0aGlzKVxyXG5cdFx0XHRcdHMgPSBzaXplKHRoaXMpXHJcblxyXG5cdFx0XHRcdCQoY29weSlcclxuXHRcdFx0XHRcdC5hZGRDbGFzcygnaGVscGVyJylcclxuXHRcdFx0XHRcdC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcclxuXHRcdFx0XHRcdC50b29sdGlwKHtwbGFjZW1lbnQ6ICdhdXRvIHRvcCcsIHRpdGxlOiAkKHRoaXMpLmRhdGEoJ2hlbHAnKX0pXHJcblx0XHRcdFx0XHQuY3NzKHApXHJcblx0XHRcdFx0XHQuY3NzKHMpXHJcblxyXG5cdFx0XHRcdCQoY29weSkuZmluZCgnW3RpdGxlXScpLnJlbW92ZUF0dHIoJ3RpdGxlJylcclxuXHJcblx0XHRcdFx0JChuYXZPdmVybGF5KVxyXG5cdFx0XHRcdFx0LmFwcGVuZChjb3B5KVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHQkKCdib2R5JylcclxuXHRcdFx0XHQuYXBwZW5kKG1haW5PdmVybGF5KVxyXG5cdFx0XHRcdC5hcHBlbmQobmF2T3ZlcmxheSlcclxuXHJcblx0XHRcdCQobWFpbk92ZXJsYXkpLmZhZGVJbigpXHJcblx0XHRcdCQobmF2T3ZlcmxheSkuZmFkZUluKClcclxuXHJcblxyXG5cdGhpZGUgPSAtPlxyXG5cclxuXHRcdGlmIGhlbHBcclxuXHJcblx0XHRcdGhlbHAgPSBmYWxzZVxyXG5cdFx0XHQkKCcub3ZlcmxheScpLmZhZGVPdXQoe2NvbXBsZXRlOiAtPlxyXG5cclxuXHRcdFx0XHQkKCcub3ZlcmxheScpLnJlbW92ZSgpXHJcblx0XHRcdH0pXHJcblxyXG5cclxuXHJcblx0JCgnI2hlbHBCdG4nKS5jbGljaygtPlxyXG5cclxuXHRcdHNob3coKVxyXG5cdClcclxuXHJcblx0JChkb2N1bWVudCkua2V5ZG93bigoZXZlbnQpIC0+XHJcblxyXG5cdFx0aGlkZSgpIGlmIGV2ZW50LndoaWNoID09IDI3XHJcblx0KVxyXG4pIiwibGFzdFRpbWUgPSAwXHJcbnZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXVxyXG5cclxuaWYgbm90IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgIGZvciB2ZW5kb3IgaW4gdmVuZG9yc1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvciArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3IgKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuXHJcbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3I9IChjYWxsYmFjaywgZWxlbWVudCkgLT5cclxuICAgIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSlcclxuXHJcbiAgICBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KC0+XHJcbiAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKVxyXG4gICAgLCB0aW1lVG9DYWxsKVxyXG5cclxuICAgIGlkXHJcblxyXG53aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgb3I9IChpZCkgLT5cclxuICAgIGNsZWFyVGltZW91dChpZCkiLCJcclxuXHJcblxyXG5cclxuJCAtPiBcclxuXHQkKCcuaW1hZ2UtcHJldmlldycpLmVhY2ggLT5cclxuXHRcdHByZXZpZXcgPSB0aGlzXHJcblx0XHRpZCA9ICQodGhpcykuZGF0YSgnZm9yJylcclxuXHRcdCQoJyMnICsgaWQpLmNoYW5nZSgoZXZlbnQpIC0+IFxyXG5cclxuXHRcdFx0cGF0aCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKVxyXG5cdFx0XHQkKHByZXZpZXcpLmF0dHIgJ3NyYycsIHBhdGggaWYgcGF0aD9cclxuXHJcblx0XHRcdFxyXG5cdFx0KS50cmlnZ2VyICdjaGFuZ2UnXHJcbiIsIlxyXG5cclxuc2V0ID0gKGxhbmcpIC0+XHJcblx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xhbmcvJyArIGxhbmdcclxuXHJcblxyXG5cclxuXHJcblxyXG5idXR0b24gPSAoKSAtPlxyXG5cdHNldCgkKHRoaXMpLmRhdGEoJ2xhbmcnKSlcclxuXHJcblxyXG5zZWxlY3QgPSAoKSAtPlxyXG5cdHNldCgkKHRoaXMpLnZhbCgpKVxyXG5cclxuXHJcblxyXG4kIC0+XHJcblx0JCgnLmxhbmd1YWdlLXNlbGVjdCcpLmNoYW5nZShzZWxlY3QpXHJcblx0JCgnLmxhbmd1YWdlLWJ1dHRvbicpLmNsaWNrKGJ1dHRvbilcclxuIiwibmF2Zml4ID0gLT5cclxuXHRoZWlnaHQgPSAkKCcjbWFpbk5hdicpLmhlaWdodCgpICsgMTBcclxuXHQkKCdib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcsIGhlaWdodCArICdweCcpXHJcblxyXG5cclxuJCAtPlxyXG5cdCQod2luZG93KS5yZXNpemUgLT4gbmF2Zml4KClcclxuXHRuYXZmaXgoKSIsIlxyXG5cclxuaW1hZ2VGb3JGcmFtZSA9IChmcmFtZSkgLT5cclxuXHQnL2ltYWdlcy9wbGFudHMvcGxhbnQtJyArIGZyYW1lICsgJy5wbmcnXHJcblxyXG5yZWZyZXNoUGxhbnQgPSAocGxhbnQpIC0+IFxyXG5cdG5vdyA9IE1hdGgucm91bmQoKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdHN0YXJ0ID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnc3RhcnQnXHJcblx0ZW5kID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnZW5kJ1xyXG5cdHdhdGVyaW5nID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnd2F0ZXJpbmcnXHJcblx0bm93ID0gTWF0aC5taW4gbm93LCB3YXRlcmluZ1xyXG5cdGZyYW1lID0gTWF0aC5mbG9vcigxNyAqIE1hdGguY2xhbXAoKG5vdyAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCksIDAsIDEpKSBcclxuXHQkKHBsYW50KS5hdHRyICdzcmMnLCBpbWFnZUZvckZyYW1lIGZyYW1lXHJcblxyXG5cdHNldFRpbWVvdXQgKC0+IHJlZnJlc2hQbGFudCBwbGFudCksIDEwMDAgaWYgZnJhbWUgPCAxN1xyXG5cclxuJCAtPlxyXG5cdCQoJy5wbGFudGF0aW9uLXBsYW50JykuZWFjaCAtPiByZWZyZXNoUGxhbnQgdGhpc1xyXG5cclxuXHQkKCcjc2VlZHNNb2RhbCcpLm9uICdzaG93LmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cdFx0c2xvdCA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkuZGF0YSAnc2xvdCdcclxuXHRcdCQodGhpcykuZmluZCgnaW5wdXRbbmFtZT1zbG90XScpLnZhbCBzbG90IiwidXJsID0gJy9hcGkvY2hhcmFjdGVyJztcclxuXHJcblxyXG5zZXRQcm9ncmVzcyA9IChvYmplY3QsIHZhbHVlLCBtaW5WYWx1ZSwgbWF4VmFsdWUsIGxhc3RVcGRhdGUsIG5leHRVcGRhdGUpIC0+XHJcblxyXG5cdGJhciA9ICQoJy4nICsgb2JqZWN0ICsgJy1iYXInKVxyXG5cdHRpbWVyID0gJCgnLicgKyBvYmplY3QgKyAnLXRpbWVyJylcclxuXHJcblxyXG5cdGlmIGJhci5sZW5ndGggPiAwXHJcblx0XHRjaGlsZCA9ICQoYmFyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWJhcidcclxuXHJcblx0XHQkKGNoaWxkKVxyXG5cdFx0XHQuZGF0YSAnbWF4JywgbWF4VmFsdWVcclxuXHRcdFx0LmRhdGEgJ21pbicsIG1pblZhbHVlXHJcblx0XHRcdC5kYXRhICdub3cnLCB2YWx1ZVxyXG5cdFx0YmFyWzBdLnVwZGF0ZT8oKVxyXG5cclxuXHJcblx0aWYgdGltZXIubGVuZ3RoID4gMFxyXG5cdFx0Y2hpbGQgPSAkKHRpbWVyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWJhcidcclxuXHJcblx0XHRpZiBuZXh0VXBkYXRlP1xyXG5cdFx0XHQkKGNoaWxkKVxyXG5cdFx0XHRcdC5kYXRhICdtYXgnLCBuZXh0VXBkYXRlXHJcblx0XHRcdFx0LmRhdGEgJ21pbicsIGxhc3RVcGRhdGVcclxuXHRcdGVsc2VcclxuXHRcdFx0JChjaGlsZClcclxuXHRcdFx0XHQuZGF0YSAnbWF4JywgMVxyXG5cdFx0XHRcdC5kYXRhICdtaW4nLCAwXHJcblxyXG5cclxuc2V0VmFsdWVzID0gKG9iamVjdCwgdmFsdWUsIG1pblZhbHVlLCBtYXhWYWx1ZSkgLT5cclxuXHQkKCcuJyArIG9iamVjdCArICctbm93JylcclxuXHRcdC50ZXh0IHZhbHVlXHJcblxyXG5cdCQoJy4nICsgb2JqZWN0ICsgJy1taW4nKVxyXG5cdFx0LnRleHQgbWluVmFsdWVcclxuXHJcblx0JCgnLicgKyBvYmplY3QgKyAnLW1heCcpXHJcblx0XHQudGV4dCBtYXhWYWx1ZVxyXG5cclxuc2V0VmFsdWUgPSAob2JqZWN0LCB2YWx1ZSkgLT5cclxuXHQkKCcuJyArIG9iamVjdClcclxuXHRcdC50ZXh0IHZhbHVlXHJcblxyXG5cclxuXHJcblxyXG5maWxsID0gKGRhdGEpIC0+XHJcblx0c2V0UHJvZ3Jlc3MgJ2hlYWx0aCcsIGRhdGEuaGVhbHRoLCAwLCBkYXRhLm1heEhlYWx0aCwgZGF0YS5oZWFsdGhVcGRhdGUsIGRhdGEubmV4dEhlYWx0aFVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnaGVhbHRoJywgZGF0YS5oZWFsdGgsIDAsIGRhdGEubWF4SGVhbHRoXHJcblxyXG5cdHNldFByb2dyZXNzICdlbmVyZ3knLCBkYXRhLmVuZXJneSwgMCwgZGF0YS5tYXhFbmVyZ3ksIGRhdGEuZW5lcmd5VXBkYXRlLCBkYXRhLm5leHRFbmVyZ3lVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ2VuZXJneScsIGRhdGEuZW5lcmd5LCAwLCBkYXRhLm1heEVuZXJneVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnd2FudGVkJywgZGF0YS53YW50ZWQsIDAsIDYsIGRhdGEud2FudGVkVXBkYXRlLCBkYXRhLm5leHRXYW50ZWRVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ3dhbnRlZCcsIGRhdGEud2FudGVkLCAwLCA2XHJcblxyXG5cdHNldFByb2dyZXNzICdleHBlcmllbmNlJywgZGF0YS5leHBlcmllbmNlLCAwLCBkYXRhLm1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ2V4cGVyaWVuY2UnLCBkYXRhLmV4cGVyaWVuY2UsIDAsIGRhdGEubWF4RXhwZXJpZW5jZVxyXG5cclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ3BsYW50YXRvcicsIGRhdGEucGxhbnRhdG9yRXhwZXJpZW5jZSwgMCwgZGF0YS5wbGFudGF0b3JNYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdwbGFudGF0b3InLCBkYXRhLnBsYW50YXRvckV4cGVyaWVuY2UsIDAsIGRhdGEucGxhbnRhdG9yTWF4RXhwZXJpZW5jZVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnc211Z2dsZXInLCBkYXRhLnNtdWdnbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5zbXVnZ2xlck1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ3NtdWdnbGVyJywgZGF0YS5zbXVnZ2xlckV4cGVyaWVuY2UsIDAsIGRhdGEuc211Z2dsZXJNYXhFeHBlcmllbmNlXHJcblxyXG5cdHNldFByb2dyZXNzICdkZWFsZXInLCBkYXRhLmRlYWxlckV4cGVyaWVuY2UsIDAsIGRhdGEuZGVhbGVyTWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnZGVhbGVyJywgZGF0YS5kZWFsZXJFeHBlcmllbmNlLCAwLCBkYXRhLmRlYWxlck1heEV4cGVyaWVuY2VcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdCNzZXRWYWx1ZSAnbGV2ZWwnLCBkYXRhLmxldmVsXHJcblx0I3NldFZhbHVlICdwbGFudGF0b3ItbGV2ZWwnLCBkYXRhLnBsYW50YXRvckxldmVsXHJcblx0I3NldFZhbHVlICdzbXVnZ2xlci1sZXZlbCcsIGRhdGEuc211Z2dsZXJMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnZGVhbGVyLWxldmVsJywgZGF0YS5kZWFsZXJMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnc3RyZW5ndGgnLCBkYXRhLnN0cmVuZ3RoLFxyXG5cdCNzZXRWYWx1ZSAncGVyY2VwdGlvbicsIGRhdGEucGVyY2VwdGlvblxyXG5cdCNzZXRWYWx1ZSAnZW5kdXJhbmNlJywgZGF0YS5lbmR1cmFuY2VcclxuXHQjc2V0VmFsdWUgJ2NoYXJpc21hJywgZGF0YS5jaGFyaXNtYVxyXG5cdCNzZXRWYWx1ZSAnaW50ZWxsaWdlbmNlJywgZGF0YS5pbnRlbGxpZ2VuY2VcclxuXHQjc2V0VmFsdWUgJ2FnaWxpdHknLCBkYXRhLmFnaWxpdHlcclxuXHQjc2V0VmFsdWUgJ2x1Y2snLCBkYXRhLmx1Y2sgKyAnJSdcclxuXHQjc2V0VmFsdWUgJ3N0YXRpc3RpY1BvaW50cycsIGRhdGEuc3RhdGlzdGljUG9pbnRzXHJcblx0I3NldFZhbHVlICd0YWxlbnRQb2ludHMnLCBkYXRhLnRhbGVudFBvaW50c1xyXG5cdCNzZXRWYWx1ZSAnbW9uZXknLCAnJCcgKyBkYXRhLm1vbmV5XHJcblx0I3NldFZhbHVlICdyZXBvcnRzJywgZGF0YS5yZXBvcnRzQ291bnRcclxuXHQjc2V0VmFsdWUgJ21lc3NhZ2VzJywgZGF0YS5tZXNzYWdlc0NvdW50XHJcblxyXG5cdHNjb3BlID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLnNjb3BlKClcclxuXHJcblx0aWYgc2NvcGU/IGFuZCBzY29wZS5wbGF5ZXI/XHJcblx0XHQjc2NvcGUucGxheWVyLmxldmVsID0gZGF0YS5sZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5wbGFudGF0b3JMZXZlbCA9IGRhdGEucGxhbnRhdG9yTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuc211Z2dsZXJMZXZlbCA9IGRhdGEuc211Z2dsZXJMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5kZWFsZXJMZXZlbCA9IGRhdGEuZGVhbGVyTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuc3RyZW5ndGggPSBkYXRhLnN0cmVuZ3RoXHJcblx0XHQjc2NvcGUucGxheWVyLnBlcmNlcHRpb24gPSBkYXRhLnBlcmNlcHRpb25cclxuXHRcdCNzY29wZS5wbGF5ZXIuZW5kdXJhbmNlID0gZGF0YS5lbmR1cmFuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuY2hhcmlzbWEgPSBkYXRhLmNoYXJpc21hXHJcblx0XHQjc2NvcGUucGxheWVyLmludGVsbGlnZW5jZSA9IGRhdGEuaW50ZWxsaWdlbmNlXHJcblx0XHQjc2NvcGUucGxheWVyLmFnaWxpdHkgPSBkYXRhLmFnaWxpdHlcclxuXHRcdCNzY29wZS5wbGF5ZXIubHVjayA9IGRhdGEubHVja1xyXG5cdFx0I3Njb3BlLnBsYXllci5yZXNwZWN0ID0gZGF0YS5yZXNwZWN0XHJcblx0XHQjc2NvcGUucGxheWVyLndlaWdodCA9IGRhdGEud2VpZ2h0XHJcblx0XHQjc2NvcGUucGxheWVyLmNhcGFjaXR5ID0gZGF0YS5jYXBhY2l0eVxyXG5cdFx0I3Njb3BlLnBsYXllci5taW5EYW1hZ2UgPSBkYXRhLm1pbkRhbWFnZVxyXG5cdFx0I3Njb3BlLnBsYXllci5tYXhEYW1hZ2UgPSBkYXRhLm1heERhbWFnZVxyXG5cdFx0I3Njb3BlLnBsYXllci5kZWZlbnNlID0gZGF0YS5kZWZlbnNlXHJcblx0XHQjc2NvcGUucGxheWVyLmNyaXRDaGFuY2UgPSBkYXRhLmNyaXRDaGFuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuc3BlZWQgPSBkYXRhLnNwZWVkXHJcblx0XHQjc2NvcGUucGxheWVyLmV4cGVyaWVuY2VNb2RpZmllciA9IGRhdGEuZXhwZXJpZW5jZU1vZGlmaWVyXHJcblx0XHQjc2NvcGUucGxheWVyLm1vbmV5TW9kaWZpZXIgPSBkYXRhLm1vbmV5TW9kaWZpZXJcclxuXHJcblx0XHRmb3IgaywgdiBvZiBkYXRhXHJcblx0XHRcdHNjb3BlLnBsYXllcltrXSA9IHZcclxuXHJcblx0XHRzY29wZS4kYXBwbHkoKVxyXG5cclxuXHJcblxyXG5cclxubG9hZGVkID0gKGRhdGEpIC0+XHJcblxyXG5cdGZpbGwgZGF0YVxyXG5cclxuXHRpZiBkYXRhLnJlbG9hZFxyXG5cclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWZyZXNoKClcclxuXHJcblx0c2V0VGltZW91dCBsb2FkLCBkYXRhLm5leHRVcGRhdGUgKiAxMDAwXHJcblxyXG5cclxubm90aWZ5ID0gKGRhdGEpIC0+XHJcblx0Zm9yIG4gaW4gZGF0YVxyXG5cdFx0d2luZG93Lm5vdGlmeSB7XHJcblxyXG5cdFx0XHR0aXRsZTogJzxzdHJvbmc+JyArIG4udGl0bGUgKyAnPC9zdHJvbmc+JyxcclxuXHRcdFx0bWVzc2FnZTogJycsXHJcblx0XHRcdHVybDogJy9yZXBvcnRzLycgKyBuLmlkLFxyXG5cclxuXHRcdH1cclxuXHJcblx0aWYgd2luZG93LmFjdGl2ZVxyXG5cdFx0d2luZG93Lm5vdGlmeVNob3coKVxyXG5cclxubWVzc2FnZSA9IChkYXRhKSAtPlxyXG5cdGZvciBuIGluIGRhdGFcclxuXHRcdHdpbmRvdy5ub3RpZnkge1xyXG5cclxuXHRcdFx0dGl0bGU6ICc8c3Ryb25nPicgKyBuLmF1dGhvciArICc8L3N0cm9uZz46ICcgKyBuLnRpdGxlICsgJzxici8+JyxcclxuXHRcdFx0bWVzc2FnZTogbi5jb250ZW50LFxyXG5cdFx0XHR1cmw6ICcvbWVzc2FnZXMvaW5ib3gvJyArIG4uaWQsXHJcblxyXG5cdFx0fVxyXG5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHR3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5cclxuXHJcbmxvYWQgPSAtPlxyXG5cclxuXHQkLmFqYXgge1xyXG5cclxuXHRcdHVybDogdXJsLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRzdWNjZXNzOiBsb2FkZWRcclxuXHR9XHJcblx0XHJcblx0JC5hamF4IHtcclxuXHJcblx0XHR1cmw6IHVybCArICcvbm90aWZpY2F0aW9ucycsXHJcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdHN1Y2Nlc3M6IG5vdGlmeVxyXG5cdH1cclxuXHJcblx0JC5hamF4IHtcclxuXHJcblx0XHR1cmw6IHVybCArICcvbWVzc2FnZXMnLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRzdWNjZXNzOiBtZXNzYWdlLFxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRcclxuJCh3aW5kb3cpLmZvY3VzIC0+XHJcblx0bG9hZCgpXHJcblxyXG5cclxuJCAtPlxyXG5cdGxvYWQoKSIsIlxyXG5zcXVhcmUgPSAtPlxyXG5cclxuXHQkKCcuc3F1YXJlJykuZWFjaCAtPlxyXG5cclxuXHRcdGlmICQodGhpcykuZGF0YSgnc3F1YXJlJykgPT0gJ3dpZHRoJ1xyXG5cclxuXHRcdFx0JCh0aGlzKS53aWR0aCAkKHRoaXMpLmhlaWdodCgpXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHQkKHRoaXMpLmhlaWdodCAkKHRoaXMpLndpZHRoKClcclxuXHJcbiQgLT5cclxuXHQkKHdpbmRvdykucmVzaXplIC0+IFxyXG5cdFx0c3F1YXJlKClcclxuXHRcdFxyXG5cdHNxdWFyZSgpIiwiXHJcbmNoYW5nZWQgPSAtPiBcclxuXHRjdXJyZW50ID0gcGFyc2VJbnQgKCQoJyNjdXJyZW50U3RhdGlzdGljc1BvaW50cycpLnRleHQoKSA/IDApXHJcblx0bGVmdCA9IHBhcnNlSW50ICQoJyNzdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpXHJcblx0b2xkID0gcGFyc2VJbnQgKCQodGhpcykuZGF0YSgnb2xkJykgPyAwKVxyXG5cdHZhbCA9IHBhcnNlSW50ICgkKHRoaXMpLnZhbCgpID8gMClcclxuXHRkaWZmID0gdmFsIC0gb2xkXHJcblxyXG5cdGRpZmYgPSBsZWZ0IGlmIGRpZmYgPiBsZWZ0XHJcblx0dmFsID0gb2xkICsgZGlmZlxyXG5cdGxlZnQgLT0gZGlmZlxyXG5cclxuXHRpZiBub3QgaXNOYU4gZGlmZlxyXG5cclxuXHRcdCQodGhpcylcclxuXHRcdFx0LnZhbCB2YWxcclxuXHRcdFx0LmRhdGEgJ29sZCcsIHZhbFxyXG5cclxuXHRcdCQoJyNzdGF0aXN0aWNzUG9pbnRzJylcclxuXHRcdFx0LnRleHQgbGVmdFxyXG5cclxuXHRcdCQoJy5zdGF0aXN0aWMnKS5lYWNoIC0+XHJcblx0XHRcdHZhbCA9IHBhcnNlSW50ICQodGhpcykudmFsKCkgPyAwXHJcblx0XHRcdCQodGhpcykuYXR0ciAnbWF4JywgbGVmdCArIHZhbFxyXG5cclxuXHJcbnJhbmRvbSA9IChtaW4sIG1heCkgLT4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXHJcblxyXG5yYW5kb21JbiA9IChhcnJheSkgLT5cclxuXHRpbmRleCA9IHJhbmRvbSgwLCBhcnJheS5sZW5ndGggLSAxKVxyXG5cdGFycmF5W2luZGV4XVxyXG5cclxuXHJcblxyXG5cclxuXHJcbnJvbGwgPSAtPlxyXG5cclxuXHRyb2xsYWJsZSA9ICQoJy5zdGF0aXN0aWMucm9sbGFibGUnKVxyXG5cdCQocm9sbGFibGUpLnZhbCgwKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cdHBvaW50cyA9IHBhcnNlSW50ICQoJyNzdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpXHJcblxyXG5cclxuXHRmb3IgaSBpbiBbMS4ucG9pbnRzXVxyXG5cclxuXHRcdHN0YXRpc3RpYyA9IHJhbmRvbUluKHJvbGxhYmxlKVxyXG5cdFx0dmFsID0gcGFyc2VJbnQgJChzdGF0aXN0aWMpLnZhbCgpXHJcblx0XHQkKHN0YXRpc3RpYykudmFsKHZhbCArIDEpXHJcblxyXG5cclxuXHQkKHJvbGxhYmxlKS50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCgnLnN0YXRpc3RpYycpXHJcblx0XHQuYmluZCAna2V5dXAgaW5wdXQgY2hhbmdlJywgY2hhbmdlZFxyXG5cdFx0LnRyaWdnZXIgJ2NoYW5nZSdcclxuXHJcblx0JCgnLnN0YXRSb2xsZXInKVxyXG5cdFx0LmNsaWNrKHJvbGwpXHJcblxyXG5cdHJvbGwoKVxyXG4iLCJcclxucmVmcmVzaGluZyA9IGZhbHNlXHJcblxyXG5yZWZyZXNoID0gLT5cclxuXHR3aW5kb3cubG9jYXRpb24ucmVmcmVzaCgpIGlmIG5vdCByZWZyZXNoaW5nXHJcblx0cmVmcmVzaGluZyA9IHRydWVcclxuXHJcbnVwZGF0ZSA9ICh0aW1lcikgLT5cclxuXHRiYXIgPSAkKHRpbWVyKS5jaGlsZHJlbignLnByb2dyZXNzLWJhcicpLmxhc3QoKVxyXG5cdGxhYmVsID0gJCh0aW1lcikuY2hpbGRyZW4gJy5wcm9ncmVzcy1sYWJlbCdcclxuXHR0aW1lID0gTWF0aC5yb3VuZCAobmV3IERhdGUpLmdldFRpbWUoKSAvIDEwMDAuMFxyXG5cclxuXHJcblx0bWluID0gJChiYXIpLmRhdGEgJ21pbidcclxuXHRtYXggPSAkKGJhcikuZGF0YSAnbWF4J1xyXG5cdHN0b3AgPSAkKGJhcikuZGF0YSAnc3RvcCdcclxuXHRjYSA9ICQoYmFyKS5kYXRhKCdjYScpXHJcblx0Y2IgPSAkKGJhcikuZGF0YSgnY2InKVxyXG5cclxuXHJcblxyXG5cdHJldmVyc2VkID0gQm9vbGVhbigkKGJhcikuZGF0YSgncmV2ZXJzZWQnKSA/IGZhbHNlKVxyXG5cdHJlbG9hZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JlbG9hZCcpID8gdHJ1ZSlcclxuXHJcblx0aWYgc3RvcD9cclxuXHRcdHRpbWUgPSBNYXRoLm1pbiB0aW1lLCBzdG9wXHJcblxyXG5cdG5vdyA9IE1hdGguY2xhbXAodGltZSwgbWluLCBtYXgpXHJcblxyXG5cclxuXHRwZXJjZW50ID0gKG5vdyAtIG1pbikgLyAobWF4IC0gbWluKVxyXG5cdHBlcmNlbnQgPSAxIC0gcGVyY2VudCBpZiByZXZlcnNlZFxyXG5cclxuXHJcblxyXG5cclxuXHQkKGJhcikuY3NzICd3aWR0aCcsIChwZXJjZW50ICogMTAwKSArICclJ1xyXG5cdCQoYmFyKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBNYXRoLmxlcnBDb2xvcnMocGVyY2VudCwgY2EsIGNiKSkgaWYgY2E/IGFuZCBjYj9cclxuXHQkKGxhYmVsKS50ZXh0IHdpbmRvdy50aW1lRm9ybWF0PyBtYXggLSBub3dcclxuXHJcblx0cmVmcmVzaCgpIGlmIHRpbWUgPiBtYXggYW5kIHJlbG9hZFxyXG5cclxuXHRzZXRUaW1lb3V0KC0+IFxyXG5cclxuXHRcdHVwZGF0ZSh0aW1lcilcclxuXHJcblx0LCAxMDAwKSAjaWYgdGltZSA8PSBtYXhcclxuXHJcblxyXG51cGRhdGVOYXYgPSAodGltZXIpIC0+XHJcblxyXG5cdHRpbWUgPSBNYXRoLnJvdW5kIChuZXcgRGF0ZSkuZ2V0VGltZSgpIC8gMTAwMC4wXHJcblx0bWluID0gJCh0aW1lcikuZGF0YSAnbWluJ1xyXG5cdG1heCA9ICQodGltZXIpLmRhdGEgJ21heCdcclxuXHRub3cgPSBNYXRoLmNsYW1wKHRpbWUsIG1pbiwgbWF4KVxyXG5cclxuXHRwZXJjZW50ID0gMSAtIChub3cgLSBtaW4pIC8gKG1heCAtIG1pbilcclxuXHJcblx0JCh0aW1lcikuY3NzKCd3aWR0aCcsIChwZXJjZW50ICogMTAwKSArICclJylcclxuXHJcblx0c2V0VGltZW91dCgtPiBcclxuXHJcblx0XHR1cGRhdGVOYXYodGltZXIpXHJcblxyXG5cdCwgMTAwMClcclxuXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHQkKCcucHJvZ3Jlc3MtdGltZScpLmVhY2ggLT5cclxuXHRcdHVwZGF0ZSB0aGlzXHJcblxyXG5cdCQoJy5uYXYtdGltZXIgPiAubmF2LXRpbWVyLWJhcicpLmVhY2ggLT5cclxuXHRcdHVwZGF0ZU5hdiB0aGlzXHJcblxyXG5cclxuXHJcblxyXG4iLCIkIC0+XHJcblx0JCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goLT5cclxuXHJcblx0XHRvcHRpb25zID0ge1xyXG5cclxuXHRcdFx0aHRtbDogdHJ1ZSxcclxuXHRcdFx0cGxhY2VtZW50OiAnYXV0byBsZWZ0J1xyXG5cdFx0fVxyXG5cclxuXHRcdHRyaWdnZXIgPSAkKHRoaXMpLmRhdGEoJ3RyaWdnZXInKVxyXG5cclxuXHRcdGlmIHRyaWdnZXI/XHJcblx0XHRcdG9wdGlvbnMudHJpZ2dlciA9IHRyaWdnZXJcclxuXHJcblxyXG5cdFx0JCh0aGlzKS50b29sdGlwKG9wdGlvbnMpXHJcblx0KSIsIlxyXG4kIC0+XHJcblxyXG5cdHR1dG9yaWFscyA9IHt9XHJcblx0JCgnLnR1dG9yaWFsLXN0ZXAnKS5wb3BvdmVyKHt0cmlnZ2VyOiAnbWFudWFsJywgcGxhY2VtZW50OiAnYm90dG9tJ30pXHJcblxyXG5cdHNob3cgPSAoc3RlcCkgLT5cclxuXHJcblx0XHRpZiBzdGVwP1xyXG5cclxuXHRcdFx0JChzdGVwLmVsZW1lbnRzKVxyXG5cdFx0XHRcdC5iaW5kKCdjbGljaycsIGNsaWNrZWQpXHJcblx0XHRcdFx0LmFkZENsYXNzKCd0dXRvcmlhbC1hY3RpdmUnKVxyXG5cdFx0XHRcdC5maXJzdCgpXHJcblx0XHRcdFx0LnBvcG92ZXIoJ3Nob3cnKVxyXG5cclxuXHJcblx0Y2xpY2tlZCA9IChldmVudCkgLT5cclxuXHJcblx0XHRuZXh0ID0gdHV0b3JpYWxzW3RoaXMuc3RlcC5uYW1lXS5zaGlmdCgpXHJcblxyXG5cdFx0aWYgbmV4dD9cclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IG5leHQuaW5kZXh9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KC0+XHJcblxyXG5cdFx0XHRcdHNob3cobmV4dClcclxuXHRcdFx0LCA1MDApXHJcblx0XHRlbHNlXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IHRoaXMuc3RlcC5pbmRleCArIDF9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblx0XHRcclxuXHJcblxyXG5cclxuXHRcdCQodGhpcy5zdGVwLmVsZW1lbnRzKS51bmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCd0dXRvcmlhbC1hY3RpdmUnKVxyXG5cdFx0XHQucG9wb3ZlcignaGlkZScpXHJcblxyXG5cdFx0I2V2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRcdCNldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuXHJcblx0cmVjZWl2ZSA9IChvYmplY3QsIG5hbWUsIGRhdGEpIC0+XHJcblxyXG5cdFx0aWYgZGF0YS5zdGFnZSA8IDBcclxuXHJcblxyXG5cdFx0XHRtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsIGZhZGUnKVxyXG5cdFx0XHRkaWFsb2cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1kaWFsb2cnKVxyXG5cdFx0XHRjb250ZW50ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpXHJcblx0XHRcdGhlYWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWhlYWRlcicpXHJcblx0XHRcdGJvZHkgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1ib2R5JylcclxuXHRcdFx0Zm9vdGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtZm9vdGVyJylcclxuXHRcdFx0dGl0bGUgPSAkKCc8aDQ+PC9oND4nKS5hZGRDbGFzcygnbW9kYWwtdGl0bGUnKVxyXG5cclxuXHRcdFx0Z3JvdXAgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdidG4tZ3JvdXAnKVxyXG5cdFx0XHRidG4xID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnRuIGJ0bi1zdWNjZXNzJykuYXR0cigndmFsdWUnLCAneWVzJykudGV4dChpMThuLnllcylcclxuXHRcdFx0YnRuMiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2J0biBidG4tZGFuZ2VyJykuYXR0cigndmFsdWUnLCAnbm8nKS50ZXh0KGkxOG4ubm8pXHJcblxyXG5cdFx0XHQkKGJ0bjEpLmNsaWNrKC0+XHJcblxyXG5cdFx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lLCBhY3RpdmU6IDF9LFxyXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHQkKG1vZGFsKS5tb2RhbCgnaGlkZScpXHJcblxyXG5cdFx0XHRcdGxvYWQob2JqZWN0LCBuYW1lLCBkYXRhKVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHQkKGJ0bjIpLmNsaWNrKC0+XHJcblxyXG5cdFx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lLCBhY3RpdmU6IDB9LFxyXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHQkKG1vZGFsKS5tb2RhbCgnaGlkZScpXHJcblxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHQkKHRpdGxlKVxyXG5cdFx0XHRcdC50ZXh0KGRhdGEudGl0bGUpXHJcblxyXG5cdFx0XHQkKGJvZHkpXHJcblx0XHRcdFx0LnRleHQoZGF0YS5kZXNjcmlwdGlvbilcclxuXHJcblx0XHRcdCQoaGVhZGVyKVxyXG5cdFx0XHRcdC5hcHBlbmQodGl0bGUpXHJcblxyXG5cclxuXHRcdFx0JChncm91cClcclxuXHRcdFx0XHQuYXBwZW5kKGJ0bjIpXHJcblx0XHRcdFx0LmFwcGVuZChidG4xKVxyXG5cclxuXHRcdFx0JChmb290ZXIpXHJcblx0XHRcdFx0LmFwcGVuZChncm91cClcclxuXHJcblxyXG5cdFx0XHQkKGNvbnRlbnQpXHJcblx0XHRcdFx0LmFwcGVuZChoZWFkZXIpXHJcblx0XHRcdFx0LmFwcGVuZChib2R5KVxyXG5cdFx0XHRcdC5hcHBlbmQoZm9vdGVyKVxyXG5cclxuXHRcdFx0JChkaWFsb2cpXHJcblx0XHRcdFx0LmFwcGVuZChjb250ZW50KVxyXG5cclxuXHRcdFx0JChtb2RhbClcclxuXHRcdFx0XHQuYXBwZW5kKGRpYWxvZylcclxuXHJcblx0XHRcdCQoJ2JvZHknKVxyXG5cdFx0XHRcdC5hcHBlbmQobW9kYWwpXHJcblxyXG5cdFx0XHQkKG1vZGFsKS5tb2RhbCh7YmFja2Ryb3A6ICdzdGF0aWMnLCBzaG93OiB0cnVlLCBrZXlib2FyZDogZmFsc2V9KVxyXG5cclxuXHJcblx0XHRlbHNlXHJcblx0XHRcdGxvYWQob2JqZWN0LCBuYW1lLCBkYXRhKVxyXG5cclxuXHJcblxyXG5cdGxvYWQgPSAob2JqZWN0LCBuYW1lLCBkYXRhKSAtPlxyXG5cclxuXHJcblx0XHR0dXRvcmlhbCA9IFtdXHJcblx0XHRkZXB0aCA9ICQob2JqZWN0KS5wYXJlbnRzKCdbZGF0YS10dXRvcmlhbD10cnVlXScpLmxlbmd0aCArIDFcclxuXHJcblxyXG5cdFx0JChvYmplY3QpLmZpbmQoJy50dXRvcmlhbC1zdGVwJykuZWFjaCgtPlxyXG5cclxuXHJcblx0XHRcdHN0ZXAgPSBudWxsXHJcblx0XHRcdGluZGV4ID0gJCh0aGlzKS5kYXRhKCd0dXRvcmlhbC1pbmRleCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gaWYgaW5kZXggPCBkYXRhLnN0YWdlIG9yICQodGhpcykucGFyZW50cygnW2RhdGEtdHV0b3JpYWw9dHJ1ZV0nKS5sZW5ndGggIT0gZGVwdGhcclxuXHJcblxyXG5cclxuXHRcdFx0aWYgdHV0b3JpYWxbaW5kZXhdP1xyXG5cdFx0XHRcdHN0ZXAgPSB0dXRvcmlhbFtpbmRleF1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHN0ZXAgPSB7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbWVudHM6IFtdLFxyXG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0XHRcdGluZGV4OiBpbmRleCxcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dHV0b3JpYWxbaW5kZXhdID0gc3RlcFxyXG5cclxuXHJcblx0XHRcdHN0ZXAuZWxlbWVudHMucHVzaCh0aGlzKVxyXG5cdFx0XHR0aGlzLnN0ZXAgPSBzdGVwXHJcblx0XHQpXHJcblxyXG5cdFx0dHV0b3JpYWwgPSB0dXRvcmlhbC5maWx0ZXIoKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0XHRpZiBlbGVtZW50P1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRcdHR1dG9yaWFsc1tuYW1lXSA9IHR1dG9yaWFsXHJcblx0XHRzaG93KHR1dG9yaWFsLnNoaWZ0KCkpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQkKCdbZGF0YS10dXRvcmlhbD10cnVlJykuZWFjaCgtPlxyXG5cclxuXHRcdG5hbWUgPSAkKHRoaXMpLmRhdGEoJ3R1dG9yaWFsLW5hbWUnKVxyXG5cclxuXHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lfSxcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0c3VjY2VzczogKGRhdGEpID0+XHJcblx0XHRcdFx0cmVjZWl2ZSh0aGlzLCBuYW1lLCBkYXRhKSBpZiBkYXRhLmFjdGl2ZVxyXG5cdFx0fSlcclxuXHQpIiwid2luZG93LmZvcm1hdCBvcj0gXHJcblx0dGltZTpcclxuXHRcdGRheTogJ2QnXHJcblx0XHRob3VyOiAnaCdcclxuXHRcdG1pbnV0ZTogJ20nXHJcblx0XHRzZWNvbmQ6ICdzJ1xyXG5cclxuXHJcblxyXG5cclxud2luZG93LmFjdGl2ZSA/PSBmYWxzZVxyXG5cclxuXHJcblxyXG4kKHdpbmRvdykuZm9jdXMgLT5cclxuXHR3aW5kb3cuYWN0aXZlID0gdHJ1ZVxyXG5cclxuJCh3aW5kb3cpLmJsdXIgLT5cclxuXHR3aW5kb3cuYWN0aXZlID0gZmFsc2VcclxuXHJcbiQod2luZG93KS5yZXNpemUgLT5cclxuXHRjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUbykgaWYgdGhpcy5yZXNpemVUb1xyXG5cdHRoaXMucmVzaXplVG8gPSBzZXRUaW1lb3V0KC0+XHJcblx0XHQkKHRoaXMpLnRyaWdnZXIoJ3Jlc2l6ZWQnKVxyXG5cdCwgNTAwKVxyXG5cdFxyXG5cclxuXHJcblxyXG53aW5kb3cubHBhZCBvcj0gKHZhbHVlLCBwYWRkaW5nKSAtPlxyXG4gIHplcm9lcyA9IFwiMFwiXHJcbiAgemVyb2VzICs9IFwiMFwiIGZvciBpIGluIFsxLi5wYWRkaW5nXVxyXG5cclxuICAoemVyb2VzICsgdmFsdWUpLnNsaWNlKHBhZGRpbmcgKiAtMSlcclxuXHJcblxyXG50aW1lU2VwYXJhdGUgPSAodmFsdWUpIC0+XHJcblx0aWYgdmFsdWUubGVuZ3RoID4gMFxyXG5cdFx0dmFsdWUgKyAnICdcclxuXHRlbHNlXHJcblx0XHR2YWx1ZVxyXG5cclxudGltZUZvcm1hdCA9ICh0ZXh0LCB2YWx1ZSwgZm9ybWF0KSAtPlxyXG5cdHRleHQgPSB0aW1lU2VwYXJhdGUodGV4dClcclxuXHJcblx0aWYgdGV4dC5sZW5ndGggPiAwXHJcblx0XHR0ZXh0ICs9IHdpbmRvdy5scGFkIHZhbHVlLCAyXHJcblx0ZWxzZSBcclxuXHRcdHRleHQgKz0gdmFsdWVcclxuXHJcblx0dGV4dCArIGZvcm1hdFxyXG5cclxuXHJcbndpbmRvdy50aW1lRm9ybWF0IG9yPSAodmFsdWUpIC0+XHJcblx0XHJcblx0dGV4dCA9ICcnXHJcblx0ZGF0ZSA9IG5ldyBEYXRlKHZhbHVlICogMTAwMClcclxuXHRkID0gZGF0ZS5nZXRVVENEYXRlKCkgLSAxXHJcblx0aCA9IGRhdGUuZ2V0VVRDSG91cnMoKVxyXG5cdG0gPSBkYXRlLmdldFVUQ01pbnV0ZXMoKVxyXG5cdHMgPSBkYXRlLmdldFVUQ1NlY29uZHMoKVxyXG5cclxuXHJcblx0dGV4dCArPSBkICsgZm9ybWF0LnRpbWUuZGF5IGlmIGQgPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgaCwgZm9ybWF0LnRpbWUuaG91cikgaWYgaCA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBtLCBmb3JtYXQudGltZS5taW51dGUpIGlmIGggPiAwIG9yIG0gPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgcywgZm9ybWF0LnRpbWUuc2Vjb25kKSBpZiBoID4gMCBvciBtID4gMCBvciBzID4gMFxyXG5cclxuXHR0ZXh0XHJcblxyXG53aW5kb3cudGltZUZvcm1hdFNob3J0IG9yPSAodmFsdWUpIC0+XHJcblxyXG5cdHRleHQgPSAnJ1xyXG5cdGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSAqIDEwMDApXHJcblx0ZCA9IGRhdGUuZ2V0VVRDRGF0ZSgpIC0gMVxyXG5cdGggPSBkYXRlLmdldFVUQ0hvdXJzKClcclxuXHRtID0gZGF0ZS5nZXRVVENNaW51dGVzKClcclxuXHRzID0gZGF0ZS5nZXRVVENTZWNvbmRzKClcclxuXHJcblxyXG5cdHJldHVybiBkICsgZm9ybWF0LnRpbWUuZGF5IGlmIGQgPiAwXHJcblx0cmV0dXJuIHRpbWVGb3JtYXQodGV4dCwgaCwgZm9ybWF0LnRpbWUuaG91cikgaWYgaCA+IDBcclxuXHRyZXR1cm4gdGltZUZvcm1hdCh0ZXh0LCBtLCBmb3JtYXQudGltZS5taW51dGUpIGlmIG0gPiAwXHJcblx0cmV0dXJuIHRpbWVGb3JtYXQodGV4dCwgcywgZm9ybWF0LnRpbWUuc2Vjb25kKSBpZiBzID4gMFxyXG5cclxuXHJcblxyXG5cclxucmVmcmVzaGluZyA9IGZhbHNlXHJcblxyXG5cclxud2luZG93LmxvY2F0aW9uLnJlZnJlc2ggb3I9IC0+XHJcblx0aWYgbm90IHJlZnJlc2hpbmdcclxuXHRcdHJlZnJlc2hpbmcgPSB0cnVlXHJcblx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpXHJcblxyXG5cclxuXHJcblxyXG5ub3RpZmljYXRpb25zID0gW11cclxud2luZG93Lm5vdGlmeSBvcj0gKHByb3BzKS0+XHJcblx0bm90aWZpY2F0aW9ucy5wdXNoIHByb3BzXHJcblxyXG5cclxuY2xvbmUgPSAob2JqKSAtPlxyXG5cdHJldHVybiBvYmogIGlmIG9iaiBpcyBudWxsIG9yIHR5cGVvZiAob2JqKSBpc250IFwib2JqZWN0XCJcclxuXHR0ZW1wID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpXHJcblx0Zm9yIGtleSBvZiBvYmpcclxuXHRcdHRlbXBba2V5XSA9IGNsb25lKG9ialtrZXldKVxyXG5cdHRlbXBcclxuXHJcbnNob3dOb3RpZnkgPSAobiwgaSkgLT5cclxuXHRjb25zb2xlLmxvZygnUCcsIG4sIGkpO1xyXG5cdHNldFRpbWVvdXQgKC0+IFxyXG5cdFx0Y29uc29sZS5sb2coJ1MnLCBuLCBpKTtcclxuXHRcdCQubm90aWZ5KG4sIHtcclxuXHJcblx0XHRcdHBsYWNlbWVudDoge1xyXG5cclxuXHRcdFx0XHRmcm9tOiAnYm90dG9tJyxcclxuXHRcdFx0fSxcclxuXHRcdFx0bW91c2Vfb3ZlcjogJ3BhdXNlJyxcclxuXHJcblx0XHRcdH0pKSwgaSAqIDEwMDBcclxuXHRcclxuXHJcblxyXG5cclxud2luZG93Lm5vdGlmeVNob3cgb3I9IC0+XHJcblx0aWYgd2luZG93LmFjdGl2ZVxyXG5cclxuXHRcdGZvciBub3RpZmljYXRpb24sIGluZGV4IGluIG5vdGlmaWNhdGlvbnNcclxuXHRcdFx0c2hvd05vdGlmeSAkLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uKSwgaW5kZXhcclxuXHRcdG5vdGlmaWNhdGlvbnMgPSBbXVxyXG5cclxuXHJcblxyXG4kKHdpbmRvdykuZm9jdXMgLT4gd2luZG93Lm5vdGlmeVNob3coKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbk1hdGguY2xhbXAgb3I9ICh2YWx1ZSwgbWluLCBtYXgpIC0+XHJcblx0TWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIG1heCksIG1pbilcclxuXHJcblxyXG5NYXRoLmxlcnAgb3I9IChpLCBhLCBiKSAtPlxyXG5cdChhICogaSkgKyAoYiAqICgxIC0gaSkpXHJcblxyXG5cclxuXHJcbk1hdGguaGV4VG9SZ2Igb3I9IChoZXgpIC0+IFxyXG4gICAgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxyXG4gICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxyXG4gICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXHJcblxyXG4gICAgfSBpZiByZXN1bHQ7XHJcbiAgICBudWxsO1xyXG5cclxuTWF0aC5yZ2JUb0hleCBvcj0gKHIsIGcsIGIpIC0+XHJcbiAgICByZXR1cm4gXCIjXCIgKyAoKDEgPDwgMjQpICsgKHIgPDwgMTYpICsgKGcgPDwgOCkgKyBiKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcblxyXG5cclxuTWF0aC5sZXJwQ29sb3JzIG9yPSAoaSwgYSwgYikgLT5cclxuXHJcblx0Y2EgPSBNYXRoLmhleFRvUmdiIGFcclxuXHRjYiA9IE1hdGguaGV4VG9SZ2IgYlxyXG5cclxuXHRjYyA9IHtcclxuXHRcdHI6IE1hdGgucm91bmQoTWF0aC5sZXJwKGksIGNhLnIsIGNiLnIpKSxcclxuXHRcdGc6IE1hdGgucm91bmQoTWF0aC5sZXJwKGksIGNhLmcsIGNiLmcpKSxcclxuXHRcdGI6IE1hdGgucm91bmQoTWF0aC5sZXJwKGksIGNhLmIsIGNiLmIpKSxcclxuXHR9XHJcblxyXG5cdHJldHVybiBNYXRoLnJnYlRvSGV4KGNjLnIsIGNjLmcsIGNjLmIpXHJcblxyXG5cclxuXHJcblxyXG5cclxudXBkYXRlUHJvZ3Jlc3MgPSAtPlxyXG5cdGJhciA9ICQodGhpcykuY2hpbGRyZW4oJy5wcm9ncmVzcy1iYXInKVxyXG5cdGxhYmVsID0gJCh0aGlzKS5jaGlsZHJlbignLnByb2dyZXNzLWxhYmVsJylcclxuXHJcblx0bWluID0gJChiYXIpLmRhdGEoJ21pbicpXHJcblx0bWF4ID0gJChiYXIpLmRhdGEoJ21heCcpXHJcblx0Y2EgPSAkKGJhcikuZGF0YSgnY2EnKVxyXG5cdGNiID0gJChiYXIpLmRhdGEoJ2NiJylcclxuXHRub3cgPSBNYXRoLmNsYW1wKCQoYmFyKS5kYXRhKCdub3cnKSwgbWluLCBtYXgpXHJcblx0cmV2ZXJzZWQgPSBCb29sZWFuKCQoYmFyKS5kYXRhKCdyZXZlcnNlZCcpID8gZmFsc2UpXHJcblxyXG5cdHBlcmNlbnQgPSAobm93IC0gbWluKSAvIChtYXggLSBtaW4pICogMTAwXHJcblx0cGVyY2VudCA9IDEwMCAtIHBlcmNlbnQgaWYgcmV2ZXJzZWRcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdCQoYmFyKS5jc3MoJ3dpZHRoJywgcGVyY2VudCArICclJylcclxuXHQkKGJhcikuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgTWF0aC5sZXJwQ29sb3JzKHBlcmNlbnQgLyAxMDAsIGNhLCBjYikpIGlmIGNhPyBhbmQgY2I/XHJcblxyXG5cclxuXHJcblx0JChsYWJlbCkudGV4dChub3cgKyAnIC8gJyArIG1heClcclxuXHJcbiQgLT4gXHJcblx0JCgnLnByb2dyZXNzJykuZWFjaCAtPlxyXG5cdFx0dGhpcy51cGRhdGUgb3I9IHVwZGF0ZVByb2dyZXNzXHJcblxyXG5cclxuXHJcbnJlbE1vdXNlQ29vcmRzID0gYGZ1bmN0aW9uIChldmVudCl7XHJcbiAgICB2YXIgdG90YWxPZmZzZXRYID0gMDtcclxuICAgIHZhciB0b3RhbE9mZnNldFkgPSAwO1xyXG4gICAgdmFyIGNhbnZhc1ggPSAwO1xyXG4gICAgdmFyIGNhbnZhc1kgPSAwO1xyXG4gICAgdmFyIGN1cnJlbnRFbGVtZW50ID0gdGhpcztcclxuXHJcbiAgICBkb3tcclxuICAgICAgICB0b3RhbE9mZnNldFggKz0gY3VycmVudEVsZW1lbnQub2Zmc2V0TGVmdCAtIGN1cnJlbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgdG90YWxPZmZzZXRZICs9IGN1cnJlbnRFbGVtZW50Lm9mZnNldFRvcCAtIGN1cnJlbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgIH1cclxuICAgIHdoaWxlKGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQub2Zmc2V0UGFyZW50KVxyXG5cclxuICAgIGNhbnZhc1ggPSBldmVudC5wYWdlWCAtIHRvdGFsT2Zmc2V0WDtcclxuICAgIGNhbnZhc1kgPSBldmVudC5wYWdlWSAtIHRvdGFsT2Zmc2V0WTtcclxuXHJcbiAgICByZXR1cm4ge3g6Y2FudmFzWCwgeTpjYW52YXNZfVxyXG59YFxyXG5cclxuSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnJlbE1vdXNlQ29vcmRzID0gcmVsTW91c2VDb29yZHM7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuKC0+XHJcblxyXG5cdG9sZFNob3cgPSAkLmZuLnNob3dcclxuXHJcblx0IyMjXHJcblxyXG5cclxuXHQkLmZuLnNob3cgPSAoc3BlZWQsIG9sZENhbGxiYWNrKSAtPlxyXG5cclxuXHRcdGNvbnNvbGUubG9nKCdzaG93JywgdGhpcylcclxuXHJcblx0XHRuZXdDYWxsYmFjayA9IC0+XHJcblxyXG5cdFx0XHRvbGRDYWxsYmFjay5hcHBseSh0aGlzKSBpZiAkLmlzRnVuY3Rpb24ob2xkQ2FsbGJhY2spXHJcblx0XHRcdCQodGhpcykudHJpZ2dlcignYWZ0ZXJTaG93JylcclxuXHJcblx0XHQkKHRoaXMpLnRyaWdnZXIoJ2JlZm9yZVNob3cnKVxyXG5cclxuXHRcdGRlZXAgPSAkKHRoaXMpLmZpbmQoJ1tkYXRhLWRlZXBzaG93XScpXHJcblxyXG5cdFx0aWYgZGVlcC5sZW5ndGhcclxuXHRcdFx0ZGVlcC5zaG93KClcclxuXHJcblx0XHRvbGRTaG93LmFwcGx5KHRoaXMsIFtzcGVlZCwgbmV3Q2FsbGJhY2tdKVxyXG5cdCMjI1xyXG4pKClcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5TdHJpbmcucHJvdG90eXBlLmVzY2FwZSBvcj0gLT5cclxuXHR0aGlzLnJlcGxhY2UoLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIilcclxuXHJcblxyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsIG9yPSAoc2VhcmNoLCByZXBsYWNlKSAtPlxyXG5cdHRoaXMucmVwbGFjZShuZXcgUmVnRXhwKHNlYXJjaC5lc2NhcGUoKSwgJ2dpJyksIHJlcGxhY2UpXHJcblxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=