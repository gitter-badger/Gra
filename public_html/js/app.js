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
    return setTimeout(load, 2500);
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
    window.active = true;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdmF0YXIuY29mZmVlIiwiYmF0dGxlLmNvZmZlZSIsImNoYXQuY29mZmVlIiwiY2xvY2suY29mZmVlIiwiZGlhbG9nLmNvZmZlZSIsImVtb3RpY29uLmNvZmZlZSIsImVxdWFsaXplci5jb2ZmZWUiLCJmb3JtLmNvZmZlZSIsImhlbHBlci5jb2ZmZWUiLCJpZWZpeC5jb2ZmZWUiLCJpbWFnZVByZXZpZXcuY29mZmVlIiwibGFuZ3VhZ2UuY29mZmVlIiwibmF2Zml4LmNvZmZlZSIsInBsYW50YXRpb24uY29mZmVlIiwicGxheWVyLmNvZmZlZSIsInNxdWFyZS5jb2ZmZWUiLCJzdGF0aXN0aWNzLmNvZmZlZSIsInRpbWVyLmNvZmZlZSIsInRvb2x0aXAuY29mZmVlIiwidHV0b3JpYWwuY29mZmVlIiwidXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BO0VBQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFBdUIsRUFBdkI7O0VBSVAsSUFBQyxDQUFBLEdBQUcsQ0FBQyxVQUFMLENBQWdCLGdCQUFoQixFQUFrQztJQUFDLFFBQUQsRUFBVyxTQUFDLE1BQUQ7YUFHNUMsTUFBTSxDQUFDLEtBQVAsR0FBZSxTQUFDLEtBQUQsRUFBUSxTQUFSO0FBRWQsWUFBQTtRQUFBLENBQUEsdUJBQUksWUFBWTtRQUNoQixDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBYjtlQUVKLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQSxHQUFRLENBQW5CLENBQUEsR0FBd0I7TUFMVjtJQUg2QixDQUFYO0dBQWxDOztFQWNBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixrQkFBaEIsRUFBb0M7SUFBQyxRQUFELEVBQVcsU0FBQyxNQUFEO0FBTTlDLFVBQUE7TUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFDO01BQ2YsTUFBQSxHQUFTLENBQUEsU0FBQSxLQUFBO2VB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LG9CQUFELENBQUMsYUFBZSxTQUFDLE1BQUQsRUFBUyxPQUFUO1dBQy9CLElBQUksQ0FBQyxPQUFMLENBQWlCLElBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxNQUFQLENBQUEsQ0FBUCxFQUF3QixJQUF4QixDQUFqQixFQUFnRCxPQUFoRDtFQUQrQjtBQWxTaEMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5cclxuXHJcblxyXG5cclxuQGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdnYW1lJywgW10pXHJcblxyXG5cclxuXHJcbkBhcHAuY29udHJvbGxlcignR2FtZUNvbnRyb2xsZXInLCBbJyRzY29wZScsICgkc2NvcGUpIC0+XHJcblxyXG5cclxuXHQkc2NvcGUucm91bmQgPSAodmFsdWUsIHByZWNpc2lvbikgLT5cclxuXHJcblx0XHRwID0gcHJlY2lzaW9uID8gMFxyXG5cdFx0biA9IE1hdGgucG93KDEwLCBwKVxyXG5cclxuXHRcdE1hdGgucm91bmQodmFsdWUgKiBuKSAvIG5cclxuXHJcbl0pXHJcblxyXG5cclxuXHJcbkBhcHAuY29udHJvbGxlcignUGxheWVyQ29udHJvbGxlcicsIFsnJHNjb3BlJywgKCRzY29wZSkgLT5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdG9sZCA9IGRvY3VtZW50LnRpdGxlXHJcblx0dXBkYXRlID0gKCkgPT5cclxuXHJcblx0XHRpZiBAaXNCdXN5XHJcblxyXG5cdFx0XHRub3cgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdFx0XHRsZWZ0ID0gTWF0aC5tYXgoQGpvYkVuZCAtIG5vdywgMClcclxuXHJcblx0XHRcdGlmIGxlZnQgPiAwXHJcblxyXG5cdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gd2luZG93LnRpbWVGb3JtYXQobGVmdCkgKyAnIC0gJyArIG9sZFxyXG5cdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdGRvY3VtZW50LnRpdGxlID0gb2xkXHJcblxyXG5cdFx0c2V0VGltZW91dCh1cGRhdGUsIDEwMDApXHJcblxyXG5cclxuXHJcblx0dXBkYXRlKClcclxuXHJcbl0pXHJcblxyXG4iLCJcclxuXHJcbmNsaWNrZWQgPSAtPlxyXG5cdCQoJy5hdmF0YXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHQkKCcjYXZhdGFyJykudmFsKCQodGhpcykuZGF0YSgnYXZhdGFyJykpXHJcblx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJylcclxuXHJcblxyXG4kIC0+XHJcblx0JCgnLmF2YXRhcicpLmNsaWNrKGNsaWNrZWQpLmZpcnN0KCkudHJpZ2dlcignY2xpY2snKSIsImNvbmZpZyA9XHJcblx0Zm9udFNpemU6IDMwXHJcblx0YmFyRm9udFNpemU6IDIwXHJcblx0bmFtZUZvbnRTaXplOiAzMFxyXG5cdG1hcmdpbjogNVxyXG5cdGludGVydmFsOiAxMDAwIC8gNjBcclxuXHJcblxyXG5cclxuY2xhc3MgQ2hhcmFjdGVyXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHRlYW0sIGRhdGEpIC0+XHJcblxyXG5cdFx0aW1hZ2UgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0aW1hZ2Uuc3JjID0gZGF0YS5hdmF0YXJcclxuXHRcdGltYWdlLm9ubG9hZCA9ID0+XHJcblx0XHRcdEBhdmF0YXIgPSBpbWFnZVxyXG5cclxuXHJcblxyXG5cdFx0QHRlYW0gPSB0ZWFtXHJcblx0XHRAbmFtZSA9IGRhdGEubmFtZVxyXG5cdFx0QGlkID0gZGF0YS5pZFxyXG5cdFx0QGxldmVsID0gZGF0YS5sZXZlbFxyXG5cdFx0QGhlYWx0aCA9IGRhdGEuaGVhbHRoXHJcblx0XHRAbWF4SGVhbHRoID0gZGF0YS5tYXhIZWFsdGhcclxuXHJcblxyXG5cdGRyYXc6IChjb250ZXh0LCBzaXplKSAtPlxyXG5cdFx0aWYgQHRlYW0gPT0gJ3JlZCdcclxuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDIxNywgODMsIDc5LCAxKSdcclxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMC40KSdcclxuXHRcdGVsc2VcclxuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDUxLCAxMjIsIDE4MywgMSknXHJcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoNTEsIDEyMiwgMTgzLCAwLjQpJ1xyXG5cclxuXHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaXplLCBzaXplKVxyXG5cclxuXHRcdGlmIEBhdmF0YXI/XHJcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKEBhdmF0YXIsIGNvbmZpZy5tYXJnaW4sIGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcubWFyZ2luICogMiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyKVxyXG5cclxuXHRcdHRleHQgPSBAbmFtZSArICcgKCcgKyBAbGV2ZWwgKyAnKSdcclxuXHJcblx0XHRjb250ZXh0LmZvbnQgPSBjb25maWcubmFtZUZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdGNvbnRleHQubGluZVdpZHRoID0gMVxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcclxuXHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdG1lYXN1cmUgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBjb25maWcubmFtZUZvbnRTaXplKVxyXG5cdFx0Y29udGV4dC5zdHJva2VUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBjb25maWcubmFtZUZvbnRTaXplKVxyXG5cclxuXHJcblx0XHRjb250ZXh0LmZvbnQgPSBjb25maWcuYmFyRm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNCknXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIsIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyLCBjb25maWcuYmFyRm9udFNpemUpXHJcblxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMSknXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCAoc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyKSAqIChAaGVhbHRoIC8gQG1heEhlYWx0aCksIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHJcblx0XHR0ZXh0ID0gTWF0aC5yb3VuZChAaGVhbHRoKSArICcgLyAnICsgQG1heEhlYWx0aFxyXG5cdFx0bWVhc3VyZSA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC8gMilcclxuXHJcblxyXG5cclxuXHJcblxyXG5jbGFzcyBCYXR0bGVcclxuXHJcblx0c3BlZWQ6IFxyXG5cdFx0dmlldzogMy4wXHJcblx0XHRpbmZvOiAzLjBcclxuXHRcdG5leHQ6IDMuMFxyXG5cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0QGNhbnZhcyA9ICQoZWxlbWVudCkuY2hpbGRyZW4oJ2NhbnZhcycpWzBdXHJcblx0XHRAY29udGV4dCA9IEBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cclxuXHRcdEBiYXR0bGVMb2cgPSAkLnBhcnNlSlNPTigkKGVsZW1lbnQpLmNoaWxkcmVuKCcuYmF0dGxlLWxvZycpLmZpcnN0KCkudGV4dCgpKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdGxvYWQ6IC0+XHJcblxyXG5cdFx0QGluZGV4ID0gMFxyXG5cdFx0QGNoYXJhY3RlcnMgPSBbXVxyXG5cdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRAb2Zmc2V0ID0gMFxyXG5cdFx0QHBhdXNlID0gZmFsc2VcclxuXHJcblx0XHQkKEBjYW52YXMpLmNsaWNrKChldmVudCkgPT4gQGNsaWNrKGV2ZW50KSlcclxuXHRcdCQoZG9jdW1lbnQpLmtleWRvd24oKGV2ZW50KSA9PiBAa2V5KGV2ZW50KSlcclxuXHJcblx0XHRmb3IgZGF0YSBpbiBAYmF0dGxlTG9nWyd0ZWFtcyddWydyZWQnXVxyXG5cdFx0XHRjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdyZWQnLCBkYXRhKVxyXG5cdFx0XHRAY2hhcmFjdGVyc1tjaGFyYWN0ZXIuaWRdID0gY2hhcmFjdGVyXHJcblxyXG5cclxuXHRcdGZvciBkYXRhIGluIEBiYXR0bGVMb2dbJ3RlYW1zJ11bJ2JsdWUnXVxyXG5cdFx0XHRjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdibHVlJywgZGF0YSlcclxuXHRcdFx0QGNoYXJhY3RlcnNbY2hhcmFjdGVyLmlkXSA9IGNoYXJhY3RlclxyXG5cclxuXHRcdEBjb250ZXh0LmZvbnQgPSBjb25maWcuZm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cclxuXHJcblx0XHRAYWN0aW9uID0gQGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0QGF0dGFja2VyID0gQGNoYXJhY3RlcnNbQGFjdGlvbi5hdHRhY2tlcl1cclxuXHRcdEBkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW0BhY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0dHJ1ZVxyXG5cclxuXHJcblxyXG5cclxuXHRkcmF3Q2hhcmFjdGVyczogKGF0dGFja2VyLCBkZWZlbmRlcikgLT5cclxuXHJcblx0XHRzaXplID0gQGNhbnZhcy5oZWlnaHQgKiAwLjZcclxuXHRcdGhhbGZXaWR0aCA9IEBjYW52YXMud2lkdGggLyAyXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoKGhhbGZXaWR0aCAtIHNpemUpIC8gMiwgKEBjYW52YXMuaGVpZ2h0IC0gc2l6ZSkgLyAyKVxyXG5cdFx0YXR0YWNrZXIuZHJhdyhAY29udGV4dCwgc2l6ZSlcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKChoYWxmV2lkdGggLSBzaXplKSAvIDIgKyBoYWxmV2lkdGgsIChAY2FudmFzLmhlaWdodCAtIHNpemUpIC8gMilcclxuXHRcdGRlZmVuZGVyLmRyYXcoQGNvbnRleHQsIHNpemUpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdGRyYXdJbmZvOiAodGV4dCkgLT5cclxuXHRcdGhhbGZXaWR0aCA9IEBjYW52YXMud2lkdGggLyAyXHJcblx0XHRoYWxmSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgLyAyXHJcblx0XHRibG9ja1NpemUgPSBAY2FudmFzLmhlaWdodCAqIDAuNlxyXG5cclxuXHRcdHN0YXJSYWRpdXMgPSA1MFxyXG5cdFx0c3RhcldpZHRoID0gc3RhclJhZGl1cyAqIDJcclxuXHRcdHN0YXJYID0gaGFsZldpZHRoICsgKGJsb2NrU2l6ZSArIHN0YXJSYWRpdXMpIC8gMlxyXG5cdFx0c3RhclkgPSBoYWxmSGVpZ2h0XHJcblx0XHRzdGFyVyA9IChibG9ja1NpemUgKiAwLjcpIC8gc3RhcldpZHRoXHJcblx0XHRzdGFySCA9IDEuMlxyXG5cdFx0c3RhclBpa2VzID0gMTNcclxuXHJcblx0XHRAY29udGV4dC5mb250ID0gY29uZmlnLmZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdG1lYXN1cmUgPSBAY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0dGV4dFggPSBzdGFyWCAtIG1lYXN1cmUud2lkdGggLyAyXHJcblx0XHR0ZXh0WSA9IGhhbGZIZWlnaHRcclxuXHJcblxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQubGluZVdpZHRoID0gMlxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKHN0YXJYLCBzdGFyWSlcclxuXHRcdEBjb250ZXh0LnNjYWxlKHN0YXJXLCBzdGFySClcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xyXG5cdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdEBkcmF3U3RhcihzdGFyUGlrZXMsIHN0YXJSYWRpdXMgKiAwLjYsIHN0YXJSYWRpdXMpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSh0ZXh0WCwgdGV4dFkpXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIDAsIDApXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdGRyYXdTdGFyOiAocGlrZXMsIGlubmVyUmFkaXVzLCBvdXRlclJhZGl1cykgLT5cclxuXHRcdHJvdCA9IE1hdGguUEkgLyAyICogM1xyXG5cdFx0c3RlcCA9IE1hdGguUEkgLyBwaWtlc1xyXG5cclxuXHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHR5ID0gTWF0aC5zaW4ocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRAY29udGV4dC5tb3ZlVG8oeCwgeSlcclxuXHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0Zm9yIGkgaW4gWzEuLnBpa2VzXVxyXG5cdFx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIGlubmVyUmFkaXVzXHJcblx0XHRcdHkgPSBNYXRoLnNpbihyb3QpICogaW5uZXJSYWRpdXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKHgsIHkpXHJcblx0XHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRcdHkgPSBNYXRoLnNpbihyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKHgsIHkpXHJcblx0XHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0QGNvbnRleHQubGluZVRvKDAsIC1vdXRlclJhZGl1cylcclxuXHRcdEBjb250ZXh0LmZpbGwoKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRcclxuXHJcblx0Z2V0RW5kVGV4dDogLT5cclxuXHJcblx0XHRpZiBAYmF0dGxlTG9nWyd3aW4nXVxyXG5cclxuXHRcdFx0aTE4bi5iYXR0bGUud2luXHJcblxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0aTE4bi5iYXR0bGUubG9zZVxyXG5cclxuXHJcblx0ZHJhdzogKGRlbHRhKS0+XHJcblxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRAY29udGV4dC5jbGVhclJlY3QoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQpXHJcblx0XHRAb2Zmc2V0ICs9IEBzcGVlZFtAc3RhdGVdICogZGVsdGFcclxuXHRcdGFuaW1hdGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICd2aWV3JyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHRhY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdGF0dGFja2VyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHRcdGlmKGFjdGlvbi50eXBlID09ICdoaXQnKVxyXG5cdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IGFjdGlvbi5oZWFsdGhcclxuXHJcblx0XHRcdEBkcmF3Q2hhcmFjdGVycyhhdHRhY2tlciwgZGVmZW5kZXIpXHJcblxyXG5cdFx0XHRpZihAb2Zmc2V0ID4gMS4wIGFuZCBub3QgQHBhdXNlKVxyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRkZWZlbmRlci5zdGFydEhlYWx0aCA9IGRlZmVuZGVyLmhlYWx0aFxyXG5cclxuXHRcdFx0XHRpZiBhY3Rpb24udHlwZSA9PSAnaGl0J1xyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuZW5kSGVhbHRoID0gTWF0aC5tYXgoZGVmZW5kZXIuaGVhbHRoIC0gYWN0aW9uLmRhbWFnZSwgMClcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRkZWZlbmRlci5lbmRIZWFsdGggPSBkZWZlbmRlci5oZWFsdGhcclxuXHJcblx0XHRcdFx0QHN0YXRlID0gJ2luZm8nXHJcblxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ2luZm8nIGFuZCBhbmltYXRlXHJcblx0XHRcdGFjdGlvbiA9IEBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0YXR0YWNrZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdGRlZmVuZGVyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKGF0dGFja2VyLCBkZWZlbmRlcilcclxuXHJcblx0XHRcdGlmIEBvZmZzZXQgPD0gMS4wXHJcblx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBAb2Zmc2V0XHJcblx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gZGVmZW5kZXIuc3RhcnRIZWFsdGhcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIEBvZmZzZXQgPD0gMi4wXHJcblx0XHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMFxyXG5cclxuXHRcdFx0XHRcdGkgPSBNYXRoLmNsYW1wKEBvZmZzZXQgLSAxLjAsIDAsIDEpXHJcblx0XHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBNYXRoLmxlcnAoaSwgZGVmZW5kZXIuZW5kSGVhbHRoLCBkZWZlbmRlci5zdGFydEhlYWx0aClcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gZGVmZW5kZXIuZW5kSGVhbHRoXHJcblx0XHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IE1hdGgubWF4KDMuMCAtIEBvZmZzZXQsIDApXHJcblxyXG5cdFx0XHRpZihAb2Zmc2V0ID4gNC4wKVxyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRAc3RhdGUgPSAnbmV4dCdcclxuXHJcblx0XHRcdGlmIGFjdGlvbi50eXBlID09ICdoaXQnXHJcblx0XHRcdFx0dGV4dCA9IGFjdGlvbi5kYW1hZ2VcclxuXHJcblx0XHRcdFx0aWYgYWN0aW9uLmNyaXRcclxuXHRcdFx0XHRcdHRleHQgKz0gJyEnXHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IGkxOG4uYmF0dGxlLmRvZGdlXHJcblxyXG5cclxuXHJcblx0XHRcdEBkcmF3SW5mbyh0ZXh0KVxyXG5cclxuXHJcblx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnbmV4dCcgYW5kIGFuaW1hdGVcclxuXHJcblx0XHRcdHByZXZBY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdG5leHRBY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXggKyAxXVxyXG5cclxuXHJcblx0XHRcdHByZXZBdHRhY2tlciA9IEBjaGFyYWN0ZXJzW3ByZXZBY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdHByZXZEZWZlbmRlciA9IEBjaGFyYWN0ZXJzW3ByZXZBY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cclxuXHRcdFx0cG9zaXRpb24gPSAoQGNhbnZhcy5oZWlnaHQgLyAyKSAqIEBvZmZzZXRcclxuXHJcblx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRAY29udGV4dC50cmFuc2xhdGUoMCwgLXBvc2l0aW9uKVxyXG5cdFx0XHRAZHJhd0NoYXJhY3RlcnMocHJldkF0dGFja2VyLCBwcmV2RGVmZW5kZXIpXHJcblx0XHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRAY29udGV4dC50cmFuc2xhdGUoMCwgQGNhbnZhcy5oZWlnaHQgLSBwb3NpdGlvbilcclxuXHJcblx0XHRcdGlmIG5leHRBY3Rpb24/XHJcblx0XHRcdFx0bmV4dEF0dGFja2VyID0gQGNoYXJhY3RlcnNbbmV4dEFjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0XHRuZXh0RGVmZW5kZXIgPSBAY2hhcmFjdGVyc1tuZXh0QWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0XHRpZihuZXh0QWN0aW9uLnR5cGUgPT0gJ2hpdCcpXHJcblx0XHRcdFx0XHRuZXh0RGVmZW5kZXIuaGVhbHRoID0gbmV4dEFjdGlvbi5oZWFsdGhcclxuXHJcblx0XHRcdFx0QGRyYXdDaGFyYWN0ZXJzKG5leHRBdHRhY2tlciwgbmV4dERlZmVuZGVyKVxyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSBAZ2V0RW5kVGV4dCgpXHJcblx0XHRcdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRcdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRcdFx0QGNvbnRleHQuZmlsbFRleHQodGV4dCwgKEBjYW52YXMud2lkdGggLSBtZWFzdXJlLndpZHRoKSAvIDIsIChAY2FudmFzLmhlaWdodCAtIDE1KSAvIDIpXHJcblxyXG5cdFx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblx0XHRcdGlmIEBvZmZzZXQgPiAyLjBcclxuXHRcdFx0XHRAaW5kZXgrK1xyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRpZiBuZXh0QWN0aW9uP1xyXG5cdFx0XHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0QHN0YXRlID0gJ2VuZCdcclxuXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ2VuZCcgYW5kIGFuaW1hdGVcclxuXHRcdFx0dGV4dCA9IEBnZXRFbmRUZXh0KClcclxuXHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIChAY2FudmFzLndpZHRoIC0gbWVhc3VyZS53aWR0aCkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSAxNSkgLyAyKVxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblxyXG5cclxuXHJcblx0XHR3aWR0aCA9IEBjYW52YXMud2lkdGggLSA0XHJcblx0XHRoZWlnaHQgPSBAY2FudmFzLmhlaWdodCAtIDJcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNCknXHJcblx0XHRAY29udGV4dC5maWxsUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGgsIDIwKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGgsIDIwKVxyXG5cclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjNUJDMERFJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFJlY3QoMiwgaGVpZ2h0IC0gMjAsIHdpZHRoICogKE1hdGgubWluKEBpbmRleCAvIChAYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKSwgMSkpLCAyMClcclxuXHRcdEBjb250ZXh0LmxpbmVXaWR0aCA9IDVcclxuXHJcblx0XHRmb3IgbWFyayBpbiBAYmF0dGxlTG9nWydtYXJrcyddXHJcblxyXG5cdFx0XHRpZiBtYXJrLnR5cGUgPT0gJ2ZhaW50ZWQnXHJcblx0XHRcdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0Q5NTM0RidcclxuXHJcblx0XHRcdGF0ID0gKG1hcmsuYXQgLyAoQGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSkpICogd2lkdGhcclxuXHJcblx0XHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblx0XHRcdEBjb250ZXh0Lm1vdmVUbyhhdCAtIEBjb250ZXh0LmxpbmVXaWR0aCAvIDIgKyAyLCBoZWlnaHQgLSAyMClcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKGF0IC0gQGNvbnRleHQubGluZVdpZHRoIC8gMiArIDIsIGhlaWdodClcclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cclxuXHJcblx0Y2xpY2s6IChldmVudCkgLT5cclxuXHRcdGNvb3JkcyA9IEBjYW52YXMucmVsTW91c2VDb29yZHMoZXZlbnQpXHJcblx0XHR4ID0gY29vcmRzLnhcclxuXHRcdHkgPSBjb29yZHMueVxyXG5cclxuXHRcdGwgPSAyXHJcblx0XHRyID0gbCArIEBjYW52YXMud2lkdGggLSA0XHJcblx0XHRiID0gQGNhbnZhcy5oZWlnaHQgLSAyXHJcblx0XHR0ID0gYiAtIDIwXHJcblxyXG5cclxuXHRcdGlmIHggPj0gbCBhbmQgeCA8PSByIGFuZCB5ID49IHQgYW5kIHkgPD0gYlxyXG5cdFx0XHRAaW5kZXggPSBNYXRoLnJvdW5kKCh4IC0gbCkgLyAociAtIGwpICogKEBiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpKVxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cclxuXHRrZXk6IChldmVudCkgLT5cclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAzMlxyXG5cdFx0XHRAcGF1c2UgPSAhQHBhdXNlXHJcblxyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDM3XHJcblx0XHRcdEBpbmRleCA9IE1hdGgubWF4KEBpbmRleCAtIDEsIDApXHJcblx0XHRcdEBvZmZzZXQgPSAxLjBcclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMzlcclxuXHRcdFx0QGluZGV4ID0gTWF0aC5taW4oQGluZGV4ICsgMSwgQGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSlcclxuXHRcdFx0QG9mZnNldCA9IDEuMFxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHJcblxyXG5cdHJlcXVlc3RGcmFtZTogKHRpbWUpIC0+XHJcblxyXG5cdFx0ZGVsdGEgPSBNYXRoLm1heCh0aW1lIC0gQGxhc3RUaW1lLCAwKVxyXG5cdFx0QGxhc3RUaW1lID0gdGltZVxyXG5cdFx0QGFjY3VtdWxhdG9yICs9IGRlbHRhXHJcblxyXG5cdFx0d2hpbGUgQGFjY3VtdWxhdG9yID49IGNvbmZpZy5pbnRlcnZhbFxyXG5cclxuXHRcdFx0QGFjY3VtdWxhdG9yIC09IGNvbmZpZy5pbnRlcnZhbFxyXG5cdFx0XHRAZHJhdyhjb25maWcuaW50ZXJ2YWwgLyAxMDAwKVxyXG5cclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRpbWUpID0+IEByZXF1ZXN0RnJhbWUodGltZSkpXHJcblxyXG5cclxuXHRzdGFydDogLT5cclxuXHJcblx0XHRpZiBAbG9hZCgpXHJcblxyXG5cdFx0XHRAbGFzdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG5cdFx0XHRAYWNjdW11bGF0b3IgPSAwLjBcclxuXHRcdFx0QHJlcXVlc3RGcmFtZShAbGFzdFRpbWUpXHJcblxyXG5cclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdCQoJy5iYXR0bGUnKS5iaW5kKCdzaG93JywgLT5cclxuXHJcblx0XHRiYXR0bGUgPSBuZXcgQmF0dGxlKHRoaXMpXHJcblx0XHRiYXR0bGUuc3RhcnQoKVxyXG5cdFxyXG5cdCkuZmlsdGVyKCc6dmlzaWJsZScpLnRyaWdnZXIoJ3Nob3cnKVxyXG5cclxuKSIsIlxyXG5cclxuY2xhc3MgQENoYXRcclxuXHJcblx0ZGVmYXVsdHMgPSB7XHJcblxyXG5cdFx0bWVzc2FnZVVybDogbnVsbCxcclxuXHRcdHBsYXllclVybDogbnVsbCxcclxuXHRcdGVtb3RpY29uVXJsOiBudWxsLFxyXG5cdFx0aW50ZXJ2YWw6IDIsXHJcblx0XHRoaXN0b3J5OiAwLFxyXG5cdFx0bWluTGVuZ3RoOiAxLFxyXG5cdFx0bWF4TGVuZ3RoOiA1MTIsXHJcblx0XHRjb29sZG93bjogNjAsXHJcblx0XHRqb2luOiAxMjAsXHJcblxyXG5cdFx0YWxsb3dTZW5kOiB0cnVlLFxyXG5cdFx0YWxsb3dSZWNlaXZlOiB0cnVlLFxyXG5cdFx0c2VuZEV4dHJhOiB7fSxcclxuXHRcdHJlY2VpdmVFeHRyYToge30sXHJcblx0XHRzZW5kTWV0aG9kOiAnUE9TVCcsXHJcblx0XHRyZWNlaXZlTWV0aG9kOiAnR0VUJyxcclxuXHR9XHJcblxyXG5cdGNvbW1hbmRzID0ge1xyXG5cclxuXHRcdCdjbGVhcic6ICdjbGVhck91dHB1dCcsXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnQsIG9wdGlvbnMpIC0+XHJcblxyXG5cdFx0I2FsZXJ0KCd3ZWxjb21lJylcclxuXHJcblx0XHRvcHQgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXHJcblxyXG5cdFx0QG1lc3NhZ2VVcmwgPSBvcHQubWVzc2FnZVVybFxyXG5cdFx0QHBsYXllclVybCA9IG9wdC5wbGF5ZXJVcmxcclxuXHRcdEBlbW90aWNvbnMgPSBuZXcgRW1vdGljb25zKClcclxuXHJcblxyXG5cdFx0QGFsbG93U2VuZCA9IG9wdC5hbGxvd1NlbmRcclxuXHRcdEBhbGxvd1JlY2VpdmUgPSBvcHQuYWxsb3dSZWNlaXZlXHJcblx0XHRAcmVjZWl2ZUV4dHJhID0gb3B0LnJlY2VpdmVFeHRyYVxyXG5cdFx0QHNlbmRFeHRyYSA9IG9wdC5zZW5kRXh0cmFcclxuXHRcdEByZWNlaXZlTWV0aG9kID0gb3B0LnJlY2VpdmVNZXRob2RcclxuXHRcdEBzZW5kTWV0aG9kID0gb3B0LnNlbmRNZXRob2RcclxuXHJcblxyXG5cclxuXHJcblx0XHRAaW5wdXQgPSAkKGVsZW1lbnQpLmZpbmQoJy5pbnB1dCcpXHJcblx0XHRAb3V0cHV0ID0gJChlbGVtZW50KS5maW5kKCcub3V0cHV0JylcclxuXHRcdEBzZW5kQnRuID0gJChlbGVtZW50KS5maW5kKCcuc2VuZCcpXHJcblx0XHRAY2xlYXJCdG4gPSAkKGVsZW1lbnQpLmZpbmQoJy5jbGVhcicpXHJcblx0XHRAZW1vdGljb25zQnRuID0gJChlbGVtZW50KS5maW5kKCcuZW1vdGljb25zJylcclxuXHJcblxyXG5cdFx0QGVtb3RpY29ucy5wb3BvdmVyKEBlbW90aWNvbnNCdG4sIEBpbnB1dClcclxuXHJcblx0XHRAb3V0cHV0WzBdLnNjcm9sbFRvcCA9IEBvdXRwdXRbMF0uc2Nyb2xsSGVpZ2h0XHJcblxyXG5cdFx0JChAaW5wdXQpLmtleWRvd24oKGV2ZW50KSA9PiBAb25LZXkoZXZlbnQpKVxyXG5cclxuXHJcblx0XHQkKEBzZW5kQnRuKS5jbGljayggPT5cclxuXHJcblx0XHRcdEBzZW5kKClcclxuXHRcdFx0QGNsZWFySW5wdXQoKVxyXG5cdFx0KVxyXG5cclxuXHRcdCQoQGNsZWFyQnRuKS5jbGljayggPT5cclxuXHJcblx0XHRcdEBjbGVhck91dHB1dCgpXHJcblx0XHQpXHJcblxyXG5cclxuXHJcblx0XHRAaW50ZXJ2YWwgPSBvcHQuaW50ZXJ2YWxcclxuXHJcblxyXG5cdFx0QGpvaW4gPSBvcHQuam9pblxyXG5cclxuXHRcdEBjb29sZG93biA9IG9wdC5jb29sZG93blxyXG5cdFx0QHNlbnQgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKSAtIEBjb29sZG93blxyXG5cclxuXHRcdEB0b3VjaCgpXHJcblx0XHRAdGltZSA9IE1hdGgubWF4KEB0aW1lIC0gb3B0Lmhpc3RvcnksIDApXHJcblxyXG5cclxuXHRcdEByZWNlaXZlKClcclxuXHRcdFxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdGdldEVycm9yVGV4dDogKG5hbWUsIGFyZ3MpIC0+XHJcblxyXG5cdFx0dGV4dCA9IGkxOG4uY2hhdC5lcnJvcnNbbmFtZV0gPyBpMThuLmNoYXQuZXJyb3JzLnVua25vd25cclxuXHJcblx0XHRpZiBhcmdzPyBhbmQgdHlwZW9mKGFyZ3MpID09ICdvYmplY3QnXHJcblxyXG5cdFx0XHRmb3IgaywgdiBvZiBhcmdzXHJcblx0XHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSgnOicgKyBrLCB2KVxyXG5cclxuXHRcdHRleHRcclxuXHJcblxyXG5cclxuXHRlcnJvcjogKG5hbWUsIGFyZ3MpIC0+XHJcblxyXG5cdFx0YWxlcnQgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnYWxlcnQnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2FsZXJ0LWRhbmdlcicpXHJcblx0XHRcdC50ZXh0KEBnZXRFcnJvclRleHQobmFtZSwgYXJncykpXHJcblxyXG5cdFx0JChAb3V0cHV0KVxyXG5cdFx0XHQuYXBwZW5kKGFsZXJ0KVxyXG5cclxuXHRhbGVydDogKG5hbWUsIGFyZ3MpIC0+XHJcblxyXG5cdFx0YWxlcnQoQGdldEVycm9yVGV4dChuYW1lLCBhcmdzKSlcclxuXHJcblxyXG5cclxuXHJcblx0dG91Y2g6IC0+XHJcblx0XHRAdGltZSA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApXHJcblxyXG5cclxuXHRzZW5kOiAtPlxyXG5cclxuXHRcdG5vdyA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApXHJcblx0XHRtZXNzYWdlID0gJChAaW5wdXQpLnZhbCgpXHJcblxyXG5cdFx0bWF0Y2hlcyA9IG1lc3NhZ2UubWF0Y2goL15cXC8oXFx3KykvaSlcclxuXHJcblxyXG5cclxuXHRcdGlmIG1hdGNoZXM/IGFuZCBtYXRjaGVzWzFdP1xyXG5cdFx0XHRjb21tYW5kID0gbWF0Y2hlc1sxXVxyXG5cclxuXHRcdFx0Zm9yIGssIHYgb2YgY29tbWFuZHNcclxuXHJcblx0XHRcdFx0aWYgY29tbWFuZC50b0xvd2VyQ2FzZSgpID09IGsudG9Mb3dlckNhc2UoKVxyXG5cclxuXHRcdFx0XHRcdGZ1bmMgPSB0aGlzW3ZdXHJcblxyXG5cdFx0XHRcdFx0aWYgdHlwZW9mKGZ1bmMpID09ICdmdW5jdGlvbidcclxuXHRcdFx0XHRcdFx0ZnVuYy5jYWxsKHRoaXMpXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0QGVycm9yKCdjbWROb3RGb3VuZCcsIHsnbmFtZSc6IGNvbW1hbmR9KVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cdFx0aWYgQGFsbG93U2VuZFxyXG5cclxuXHRcdFx0aWYgbWVzc2FnZS5sZW5ndGggPCBAbWluTGVuZ3RoXHJcblx0XHRcdFx0QGFsZXJ0KCd0b29TaG9ydCcsIHsnbWluJzogQG1pbkxlbmd0aH0pXHJcblx0XHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdFx0aWYgbWVzc2FnZS5sZW5ndGggPiBAbWF4TGVuZ3RoXHJcblx0XHRcdFx0YWxlcnQoJ3Rvb0xvbmcnLCB7J21heCc6IEBtYXhMZW5ndGh9KVxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0aWYgQHNlbnQgKyBAY29vbGRvd24gPiBub3dcclxuXHRcdFx0XHRAYWxlcnQoJ2Nvb2xkb3duJylcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cdFx0XHRkYXRhID0gJC5leHRlbmQoe30sIEBzZW5kRXh0cmEsIHttZXNzYWdlOiAkKEBpbnB1dCkudmFsKCl9KVxyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiBAbWVzc2FnZVVybCxcclxuXHRcdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4gQG9uU2VudChkYXRhKSxcclxuXHRcdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0bWV0aG9kOiBAc2VuZE1ldGhvZCxcdFxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0QHNlbnQgPSBub3dcclxuXHRcdFx0JChAc2VuZEJ0bikuZGF0YSgndGltZScsIEBzZW50ICsgQGNvb2xkb3duKVxyXG5cclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdEBlcnJvcignY2Fubm90U2VuZCcpXHJcblxyXG5cclxuXHRyZWNlaXZlOiAtPlxyXG5cclxuXHRcdGlmIEBhbGxvd1JlY2VpdmVcclxuXHJcblx0XHRcdGRhdGEgPSAkLmV4dGVuZCh7fSwgQHJlY2VpdmVFeHRyYSwge3RpbWU6IEB0aW1lfSlcclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogQG1lc3NhZ2VVcmwsXHJcblx0XHRcdFx0ZGF0YTogZGF0YSxcclxuXHRcdFx0XHRjb21wbGV0ZTogPT4gQG9uQ29tcGxldGUoKSxcclxuXHRcdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4gQG9uUmVjZWl2ZWQoZGF0YSksXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRtZXRob2Q6IEByZWNlaXZlTWV0aG9kLFxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0QHRvdWNoKClcclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdEBlcnJvcignY2Fubm90UmVjZWl2ZScpXHJcblxyXG5cclxuXHJcblx0Y2xlYXJPdXRwdXQ6IC0+XHJcblxyXG5cdFx0JChAb3V0cHV0KS5lbXB0eSgpXHJcblxyXG5cclxuXHRjbGVhcklucHV0OiAtPlxyXG5cclxuXHRcdCQoQGlucHV0KS52YWwoJycpXHJcblxyXG5cclxuXHJcblx0Z2V0TWVzc2FnZTogKGRhdGEpIC0+XHJcblx0XHQkKCc8cD48L3A+JylcclxuXHRcdFx0Lmh0bWwoQGVtb3RpY29ucy5pbnNlcnQoZGF0YS5tZXNzYWdlKSlcclxuXHRcdFx0LmFwcGVuZChcclxuXHJcblx0XHRcdFx0JCgnPHNtYWxsPjwvc21hbGw+JylcclxuXHRcdFx0XHRcdC5hZGRDbGFzcygnY2hhdC10aW1lJylcclxuXHRcdFx0XHRcdC5kYXRhKCd0aW1lJywgZGF0YS50aW1lKVxyXG5cdFx0XHQpXHJcblxyXG5cclxuXHJcblx0bmV3TWVzc2FnZTogKGRhdGEpIC0+XHJcblxyXG5cdFx0cm93ID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ3JvdycpXHJcblx0XHRcdC5hZGRDbGFzcygnY2hhdC1tZXNzYWdlJylcclxuXHRcdFx0LmRhdGEoJ3RpbWUnLCBkYXRhLnRpbWUpXHJcblx0XHRcdC5kYXRhKCdhdXRob3InLCBkYXRhLmF1dGhvcilcclxuXHJcblx0XHRjb2wxID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NvbC14cy0xJylcclxuXHJcblx0XHRjb2wyID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NvbC14cy0xMScpXHJcblxyXG5cdFx0aWYgQHBsYXllclVybD9cclxuXHJcblx0XHRcdGRpdjEgPSAkKCc8YT48L2E+JylcclxuXHRcdFx0XHQuYXR0cignaHJlZicsIEBnZXRQbGF5ZXJVcmwoZGF0YS5hdXRob3IpKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY2hhdC1hdXRob3InKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHJcblx0XHRcdGRpdjEgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LWF1dGhvcicpXHJcblxyXG5cclxuXHJcblx0XHRkaXYyID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtY29udGVudCcpXHJcblxyXG5cclxuXHJcblxyXG5cdFx0YXZhdGFyID0gJCgnPGltZz48L2ltZz4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2ltZy1yZXNwb25zaXZlJylcclxuXHRcdFx0LmFkZENsYXNzKCdjaGF0LWF2YXRhcicpXHJcblx0XHRcdC5hdHRyKCdzcmMnLCBkYXRhLmF2YXRhcilcclxuXHJcblxyXG5cdFx0YXV0aG9yID0gJCgnPHA+PC9wPicpLmFwcGVuZChcclxuXHJcblx0XHRcdCQoJzxzdHJvbmc+PC9zdHJvbmc+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtbmFtZScpXHJcblx0XHRcdFx0LnRleHQoZGF0YS5hdXRob3IpLFxyXG5cdFx0KVxyXG5cclxuXHRcdG1lc3NhZ2UgPSBAZ2V0TWVzc2FnZShkYXRhKVxyXG5cclxuXHJcblxyXG5cdFx0JChkaXYxKS5hcHBlbmQoYXZhdGFyKS5hcHBlbmQoYXV0aG9yKVxyXG5cdFx0JChkaXYyKS5hcHBlbmQobWVzc2FnZSlcclxuXHRcdCQoY29sMSkuYXBwZW5kKGRpdjEpXHJcblx0XHQkKGNvbDIpLmFwcGVuZChkaXYyKVxyXG5cdFx0JChyb3cpLmFwcGVuZChjb2wxKS5hcHBlbmQoY29sMilcclxuXHRcdCQoQG91dHB1dCkuYXBwZW5kKHJvdylcclxuXHJcblxyXG5cdG1vZGlmeU1lc3NhZ2U6IChtZXNzYWdlLCBkYXRhKSAtPlxyXG5cclxuXHRcdCQobWVzc2FnZSkuZmluZCgnLmNoYXQtY29udGVudCcpLmFwcGVuZChcclxuXHJcblx0XHRcdEBnZXRNZXNzYWdlKGRhdGEpXHJcblx0XHQpXHJcblxyXG5cclxuXHJcblx0YWRkTWVzc2FnZTogKGRhdGEpLT5cclxuXHJcblxyXG5cdFx0c2Nyb2xsID0gKEBvdXRwdXRbMF0uc2Nyb2xsSGVpZ2h0IC0gQG91dHB1dFswXS5zY3JvbGxUb3AgLSBAb3V0cHV0WzBdLmNsaWVudEhlaWdodCkgPD0gMVxyXG5cdFx0bWVzc2FnZSA9ICQoQG91dHB1dCkuY2hpbGRyZW4oKS5sYXN0KClcclxuXHJcblxyXG5cclxuXHRcdGlmIG1lc3NhZ2UubGVuZ3RoID09IDAgb3IgISQobWVzc2FnZSkuaXMoJy5jaGF0LW1lc3NhZ2UnKVxyXG5cdFx0XHRcclxuXHRcdFx0QG5ld01lc3NhZ2UoZGF0YSlcclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdHRpbWUgPSAkKG1lc3NhZ2UpLmRhdGEoJ3RpbWUnKVxyXG5cdFx0XHRhdXRob3IgPSAkKG1lc3NhZ2UpLmRhdGEoJ2F1dGhvcicpXHJcblxyXG5cdFx0XHRpZiBhdXRob3IgPT0gZGF0YS5hdXRob3IgYW5kIChkYXRhLnRpbWUgLSB0aW1lKSA8PSBAam9pblxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdEBtb2RpZnlNZXNzYWdlKG1lc3NhZ2UsIGRhdGEpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0QG5ld01lc3NhZ2UoZGF0YSlcclxuXHJcblxyXG5cclxuXHRcdGlmIHNjcm9sbFxyXG5cdFx0XHRAb3V0cHV0WzBdLnNjcm9sbFRvcCA9IEBvdXRwdXRbMF0uc2Nyb2xsSGVpZ2h0IC0gMVxyXG5cclxuXHJcblxyXG5cclxuXHRvblNlbnQ6IChkYXRhKSAtPlxyXG5cclxuXHRcdEBlcnJvcihkYXRhLnJlYXNvbiwgZGF0YS5hcmdzKSBpZiBkYXRhLnN0YXR1cyA9PSAnZXJyb3InXHJcblxyXG5cclxuXHRvblJlY2VpdmVkOiAoZGF0YSkgLT5cclxuXHJcblx0XHRmb3IgbWVzc2FnZSBpbiBkYXRhXHJcblx0XHRcdEBhZGRNZXNzYWdlKG1lc3NhZ2UpXHJcblxyXG5cdG9uQ29tcGxldGU6IC0+XHJcblxyXG5cdFx0c2V0VGltZW91dCg9PlxyXG5cclxuXHRcdFx0QHJlY2VpdmUoKVxyXG5cdFx0LCBAaW50ZXJ2YWwgKiAxMDAwKVxyXG5cclxuXHJcblx0b25LZXk6IChldmVudCkgLT5cclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAxM1xyXG5cdFx0XHRAc2VuZCgpXHJcblx0XHRcdEBjbGVhcklucHV0KClcclxuXHJcblxyXG5cclxuXHJcblx0Z2V0UGxheWVyVXJsOiAobmFtZSkgLT5cclxuXHJcblx0XHRyZXR1cm4gQHBsYXllclVybC5yZXBsYWNlKCd7bmFtZX0nLCBuYW1lKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQoLT5cclxuXHJcblx0dXBkYXRlID0gKCkgLT5cclxuXHJcblx0XHRub3cgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cclxuXHRcdCQoJy5jaGF0IC5jaGF0LXRpbWUnKS5lYWNoKC0+XHJcblxyXG5cdFx0XHR0aW1lID0gcGFyc2VJbnQoJCh0aGlzKS5kYXRhKCd0aW1lJykpXHJcblx0XHRcdGludGVydmFsID0gbm93IC0gdGltZVxyXG5cclxuXHJcblxyXG5cdFx0XHRpZiBpbnRlcnZhbCA8IDYwXHJcblxyXG5cdFx0XHRcdHRleHQgPSBpMThuLmNoYXQuZmV3U2Vjc1xyXG5cdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdHRleHQgPSB3aW5kb3cudGltZUZvcm1hdFNob3J0KGludGVydmFsKVxyXG5cclxuXHRcdFx0JCh0aGlzKS50ZXh0KHRleHQgKyAnICcgKyBpMThuLmNoYXQuYWdvKVxyXG5cdFx0KVxyXG5cclxuXHRcdCQoJy5jaGF0IC5zZW5kJykuZWFjaCgtPlxyXG5cclxuXHRcdFx0aWYgJCh0aGlzKS5kYXRhKCdkaXNhYmxlZCcpICE9ICd0cnVlJ1xyXG5cclxuXHRcdFx0XHR0aW1lID0gcGFyc2VJbnQoJCh0aGlzKS5kYXRhKCd0aW1lJykpXHJcblx0XHRcdFx0dGV4dCA9ICQodGhpcykuZGF0YSgndGV4dCcpXHJcblx0XHRcdFx0aW50ZXJ2YWwgPSB0aW1lIC0gbm93XHJcblxyXG5cclxuXHRcdFx0XHRpZiBpbnRlcnZhbCA+IDBcclxuXHJcblx0XHRcdFx0XHQkKHRoaXMpXHJcblx0XHRcdFx0XHRcdC50ZXh0KHdpbmRvdy50aW1lRm9ybWF0KGludGVydmFsKSlcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCdkaXNhYmxlZCcpXHJcblx0XHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRcdCQodGhpcylcclxuXHRcdFx0XHRcdFx0LnRleHQodGV4dClcclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpXHJcblxyXG5cdFx0KVxyXG5cclxuXHJcblx0XHRzZXRUaW1lb3V0KHVwZGF0ZSwgMTAwMClcclxuXHJcblx0dXBkYXRlKClcclxuKSIsIlxyXG5cclxudXBkYXRlID0gKCkgLT5cclxuXHJcblx0ZGF0ZSA9IG5ldyBEYXRlKClcclxuXHRub3cgPSBNYXRoLnJvdW5kKGRhdGUuZ2V0VGltZSgpIC8gMTAwMClcclxuXHQkKCcuY3VycmVudC10aW1lJykudGV4dChkYXRlLnRvVVRDU3RyaW5nKCkpXHJcblxyXG5cdCQoJy50aW1lLWxlZnQnKS5lYWNoKC0+XHJcblxyXG5cdFx0dG8gPSAkKHRoaXMpLmRhdGEoJ3RvJylcclxuXHRcdCQodGhpcykudGV4dCh3aW5kb3cudGltZUZvcm1hdChNYXRoLm1heCh0byAtIG5vdywgMCkpKVxyXG5cdClcclxuXHJcblxyXG5cdHNldFRpbWVvdXQodXBkYXRlLCAxMDAwKVxyXG5cclxuXHJcblxyXG4kIC0+XHJcblx0dXBkYXRlKCkiLCJcclxuXHJcbmRpYWxvZ3MgPSBbXVxyXG5cclxuXHJcbnNob3cgPSAoZGlhbG9nKSAtPlxyXG5cclxuXHRkaXNtaXNzaWJsZSA9ICgkKGRpYWxvZykuZGF0YSgnZGlzbWlzc2libGUnKSkgPyB0cnVlXHJcblxyXG5cclxuXHJcblx0JChkaWFsb2cpLmJpbmQoJ3Nob3duLmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cclxuXHRcdCQodGhpcykuZmluZCgnLmJhdHRsZScpLnRyaWdnZXIoJ3Nob3cnKVxyXG5cdClcclxuXHJcblxyXG5cdGlmIGRpc21pc3NpYmxlXHJcblxyXG5cdFx0JChkaWFsb2cpLm1vZGFsKHtiYWNrZHJvcDogdHJ1ZSwgc2hvdzogdHJ1ZSwga2V5Ym9hcmQ6IHRydWV9KVxyXG5cclxuXHRlbHNlXHJcblxyXG5cdFx0JChkaWFsb2cpLm1vZGFsKHtiYWNrZHJvcDogJ3N0YXRpYycsIHNob3c6IHRydWUsIGtleWJvYXJkOiBmYWxzZX0pXHJcblxyXG5cclxuJCAtPlxyXG5cdGRpYWxvZ3MgPSAkKCcubW9kYWwuYXV0b3Nob3cnKVxyXG5cclxuXHJcblx0JChkaWFsb2dzKS5lYWNoKChpbmRleCkgLT5cclxuXHJcblx0XHRpZiBpbmRleCA9PSAwXHJcblx0XHRcdHNob3codGhpcylcclxuXHJcblx0XHRpZiBpbmRleCA8IChkaWFsb2dzLmxlbmd0aCAtIDEpXHJcblx0XHRcdCQodGhpcykub24oJ2hpZGRlbi5icy5tb2RhbCcsIChldmVudCkgLT5cclxuXHJcblx0XHRcdFx0c2hvdyhkaWFsb2dzW2luZGV4ICsgMV0pXHJcblx0XHRcdClcclxuXHQpIiwiXHJcblxyXG5cclxuY2xhc3MgQEVtb3RpY29uc1xyXG5cclxuXHRkZWZhdWx0cyA9IHtcclxuXHJcblx0XHRlbW90aWNvbnM6IHtcclxuXHJcblx0XHRcdCc7KSc6ICdibGluay5wbmcnLFxyXG5cdFx0XHQnOkQnOiAnZ3Jpbi5wbmcnLFxyXG5cdFx0XHQnOignOiAnc2FkLnBuZycsXHJcblx0XHRcdCc6KSc6ICdzbWlsZS5wbmcnLFxyXG5cdFx0XHQnQiknOiAnc3VuZ2xhc3Nlcy5wbmcnLFxyXG5cdFx0XHQnTy5vJzogJ3N1cnByaXNlZC5wbmcnLFxyXG5cdFx0XHQnOnAnOiAndG9uZ3VlLnBuZycsIFxyXG5cdFx0fSxcclxuXHJcblx0XHR1cmw6ICcvaW1hZ2VzL2Vtb3RpY29ucy97bmFtZX0nLFxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHVybCwgZW1vdGljb25zKSAtPlxyXG5cclxuXHRcdEB1cmwgPSB1cmwgPyBkZWZhdWx0cy51cmxcclxuXHRcdEBzZXQgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMuZW1vdGljb25zLCBlbW90aWNvbnMgPyB7fSlcclxuXHJcblxyXG5cdGluc2VydDogKHRleHQpIC0+XHJcblxyXG5cdFx0Zm9yIGssIHYgb2YgQHNldFxyXG5cclxuXHRcdFx0dXJsID0gQHVybC5yZXBsYWNlKCd7bmFtZX0nLCB2KVxyXG5cdFx0XHRlbW90aWNvbiA9ICc8aW1nIGNsYXNzPVwiZW1vdGljb25cIiBzcmM9XCInICsgdXJsICsgJ1wiIGFsdD1cIicgKyBrICsgJ1wiIHRpdGxlPVwiJyArIGsgKyAnXCIvPidcclxuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZUFsbChrLCBlbW90aWNvbilcclxuXHJcblxyXG5cdFx0dGV4dFxyXG5cclxuXHRwb3BvdmVyOiAoYnV0dG9uLCBvdXRwdXQpIC0+XHJcblxyXG5cdFx0JChidXR0b24pLnBvcG92ZXIoe1xyXG5cclxuXHRcdFx0aHRtbDogdHJ1ZSxcclxuXHRcdFx0dHJpZ2dlcjogJ2NsaWNrJyxcclxuXHRcdFx0cGxhY2VtZW50OiAndG9wJyxcclxuXHRcdFx0dGl0bGU6IGkxOG4uZW1vdGljb25zLnRpdGxlLFxyXG5cdFx0XHRjb250ZW50OiA9PiBAZ2V0UG9wb3ZlckNvbnRlbnQob3V0cHV0KSxcclxuXHRcdFx0dGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIHJvbGU9XCJ0b29sdGlwXCI+PGRpdiBjbGFzcz1cImFycm93XCI+PC9kaXY+PGgzIGNsYXNzPVwicG9wb3Zlci10aXRsZVwiPjwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudCBlbW90aWNvbi1jb250YWluZXJcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0fSlcclxuXHJcblx0Z2V0UG9wb3ZlckNvbnRlbnQ6IChvdXRwdXQpIC0+XHJcblxyXG5cdFx0Y29udGFpbmVyID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cclxuXHRcdGZvciBrLCB2IG9mIEBzZXRcclxuXHRcdFx0dXJsID0gQHVybC5yZXBsYWNlKCd7bmFtZX0nLCB2KVxyXG5cdFx0XHRpbWcgPSAkKCc8aW1nPjwvaW1nPicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdlbW90aWNvbicpXHJcblx0XHRcdFx0LmF0dHIoJ3NyYycsIHVybClcclxuXHRcdFx0XHQuYXR0cignYWx0JywgaylcclxuXHRcdFx0XHQuYXR0cigndGl0bGUnLCBrKVxyXG5cdFx0XHRcdC5jbGljaygtPlxyXG5cclxuXHRcdFx0XHRcdCQob3V0cHV0KS52YWwoJChvdXRwdXQpLnZhbCgpICsgJCh0aGlzKS5hdHRyKCdhbHQnKSlcclxuXHRcdFx0XHQpXHJcblxyXG5cdFx0XHQkKGNvbnRhaW5lcikuYXBwZW5kKGltZylcclxuXHJcblx0XHRyZXR1cm4gY29udGFpbmVyXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmNvdW50ZXIgPSAwXHJcblxyXG5cclxuJCgtPlxyXG5cclxuXHRlbW90aWNvbnMgPSBuZXcgRW1vdGljb25zKClcclxuXHJcblx0JCgnW2RhdGEtZW1vdGljb25zPXRydWVdJykuZWFjaCgtPlxyXG5cclxuXHRcdHRleHQgPSAkKHRoaXMpLnRleHQoKVxyXG5cdFx0dGV4dCA9IGVtb3RpY29ucy5pbnNlcnQodGV4dClcclxuXHRcdCQodGhpcykuaHRtbCh0ZXh0KVxyXG5cdClcclxuKSIsIndpZHRocyA9XHJcblx0eHM6IDc2OCxcclxuXHRzbTogOTkyLFxyXG5cdG1kOiAxMjAwLFxyXG5cclxuXHJcblxyXG5nZXRQcmVmaXggPSAtPlxyXG5cdHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKClcclxuXHJcblx0aWYgd2lkdGggPCB3aWR0aHMueHNcclxuXHRcdFsneHMnXVxyXG5cdGVsc2UgaWYgd2lkdGggPCB3aWR0aHMuc21cclxuXHRcdFsnc20nLCAneHMnXVxyXG5cdGVsc2UgaWYgd2lkdGggPCB3aWR0aHMubWRcclxuXHRcdFsnbWQnLCAnc20nLCAneHMnXVxyXG5cdGVsc2VcclxuXHRcdFsnbGcnLCAnbWQnLCAnc20nLCAneHMnXVxyXG5cclxuXHJcbmdldENvbHVtbnMgPSAocHJlZml4KSAtPlxyXG5cdHJlc3VsdCA9IFtdXHJcblx0Zm9yIHAgaW4gcHJlZml4XHJcblx0XHRmb3IgaSBpbiBbMS4uMTJdXHJcblx0XHRcdHJlc3VsdC5wdXNoKFwiY29sLSN7cH0tI3tpfVwiKVxyXG5cdHJlc3VsdFxyXG5cclxuXHJcblxyXG5nZXRTaXplID0gKG9iamVjdCwgcHJlZml4KSAtPlxyXG5cdGZvciBwIGluIHByZWZpeFxyXG5cdFx0cmVnZXhwID0gbmV3IFJlZ0V4cChcImNvbC0je3B9LShcXFxcZCspXCIpXHJcblx0XHRzaXplID0gJChvYmplY3QpLmF0dHIoJ2NsYXNzJykubWF0Y2gocmVnZXhwKT9bMV1cclxuXHRcdHJldHVybiBwYXJzZUludChzaXplKSBpZiBzaXplP1xyXG5cdHJldHVybiBudWxsXHJcblxyXG5cclxuXHJcblxyXG5lcXVhbGl6ZSA9IC0+XHJcblx0cHJlZml4ID0gZ2V0UHJlZml4KClcclxuXHRjb2x1bW5zID0gZ2V0Q29sdW1ucyhwcmVmaXgpXHJcblx0c2VsZWN0b3IgPSAnLicgKyBjb2x1bW5zLmpvaW4oJywuJylcclxuXHRcclxuXHQjY29uc29sZS5sb2coJ3ByZWZpeDogJywgcHJlZml4KVxyXG5cdCNjb25zb2xlLmxvZygnY29sdW1uczogJywgY29sdW1ucylcclxuXHQjY29uc29sZS5sb2coJ3NlbGVjdG9yOiAnLCBzZWxlY3RvcilcclxuXHJcblxyXG5cdCQoJy5yb3cuZXF1YWxpemUnKS5lYWNoIC0+XHJcblx0XHQjY29uc29sZS5sb2coJ25ldyByb3cnKVxyXG5cdFx0aGVpZ2h0cyA9IFtdXHJcblx0XHRyb3cgPSAwXHJcblx0XHRzdW0gPSAwXHJcblxyXG5cdFx0JCh0aGlzKS5jaGlsZHJlbihzZWxlY3RvcikuZWFjaCAtPlxyXG5cdFx0XHRzaXplID0gZ2V0U2l6ZSh0aGlzLCBwcmVmaXgpXHJcblx0XHRcdHN1bSArPSBzaXplXHJcblxyXG5cdFx0XHQjY29uc29sZS5sb2coJ3NpemU6ICcsIHNpemUpXHJcblx0XHRcdCNjb25zb2xlLmxvZygnc3VtOiAnLCBzdW0pXHJcblxyXG5cdFx0XHRpZiBzdW0gPiAxMlxyXG5cdFx0XHRcdHN1bSAtPSAxMlxyXG5cdFx0XHRcdHJvdysrXHJcblx0XHRcdFx0I2NvbnNvbGUubG9nKCduZXh0IHJvdyAnLCByb3csIHNpemUpXHJcblxyXG5cdFx0XHRoZWlnaHRzW3Jvd10gPz0gMFxyXG5cdFx0XHRoZWlnaHRzW3Jvd10gPSBNYXRoLm1heChoZWlnaHRzW3Jvd10sICQodGhpcykuaGVpZ2h0KCkpXHJcblx0XHRcdCNjb25zb2xlLmxvZygnaGVpZ2h0ICcsIGhlaWdodHNbcm93XSlcclxuXHJcblx0XHRyb3cgPSAwXHJcblx0XHRzdW0gPSAwXHJcblx0XHRjb2wgPSBudWxsXHJcblxyXG5cdFx0JCh0aGlzKS5jaGlsZHJlbihzZWxlY3RvcikuZWFjaCAtPlxyXG5cdFx0XHRzdW0gKz0gZ2V0U2l6ZSh0aGlzLCBwcmVmaXgpXHJcblx0XHRcdGNvbCA/PSB0aGlzXHJcblxyXG5cdFx0XHRpZiBzdW0gPiAxMlxyXG5cdFx0XHRcdHN1bSAtPSAxMlxyXG5cdFx0XHRcdHJvdysrXHJcblx0XHRcdFx0Y29sID0gdGhpc1xyXG5cclxuXHRcdFx0JCh0aGlzKS5oZWlnaHQoaGVpZ2h0c1tyb3ddKVxyXG5cclxuXHRcdGhzID0gTWF0aC5yb3VuZCAoMTIgLSBzdW0pIC8gMlxyXG5cdFx0aWYgY29sPyBhbmQgaHMgPiAwXHJcblx0XHRcdHAgPSBwcmVmaXhbMF1cclxuXHJcblx0XHRcdGZvciBpIGluIFsxLi4xMl1cclxuXHRcdFx0XHQkKGNvbCkucmVtb3ZlQ2xhc3MoXCJjb2wtI3twfS1vZmZzZXQtI3tpfVwiKVxyXG5cdFx0XHQkKGNvbCkuYWRkQ2xhc3MoXCJjb2wtI3twfS1vZmZzZXQtI3toc31cIilcclxuXHJcbmFmdGVyTG9hZGVkID0gLT5cclxuXHQkKCdpbWcnKVxyXG5cdFx0Lm9uKCdsb2FkJywgZXF1YWxpemUpXHJcblxyXG5cclxuJCAtPlxyXG5cdCNhZnRlckxvYWRlZCgpXHJcblx0IyQod2luZG93KS5vbigncmVzaXplZCcsIGVxdWFsaXplKVxyXG5cdCNlcXVhbGl6ZSgpIiwic3BlZWQgPSAxXHJcblxyXG5cclxua2V5RG93biA9IChldmVudCkgLT5cclxuXHRzcGVlZCA9IDEwIGlmIGV2ZW50LndoaWNoID09IDE3XHJcblx0c3BlZWQgPSAxMDAgaWYgZXZlbnQud2hpY2ggPT0gMTZcclxuXHJcbmtleVVwID0gKGV2ZW50KSAtPlxyXG5cdHNwZWVkID0gMSBpZiBldmVudC53aGljaCA9PSAxNyBvciBldmVudC53aGljaCA9PSAxNlxyXG5cclxuXHJcbm1vdXNlV2hlZWwgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ21vdXNlV2hlZWwnKVxyXG5cdG1pbiA9IHBhcnNlSW50ICgkKHRoaXMpLmF0dHIoJ21pbicpID8gMClcclxuXHRtYXggPSBwYXJzZUludCAoJCh0aGlzKS5hdHRyKCdtYXgnKSA/IDEwMClcclxuXHRzdGVwID0gcGFyc2VJbnQgKCQodGhpcykuYXR0cignc3RlcCcpID8gMSlcclxuXHJcblx0Y2hhbmdlID0gZXZlbnQuZGVsdGFZICogc3RlcCAqIHNwZWVkXHJcblx0dmFsdWUgPSBwYXJzZUludCAkKHRoaXMpLnZhbCgpID8gMFxyXG5cdHZhbHVlID0gTWF0aC5jbGFtcCB2YWx1ZSArIGNoYW5nZSwgbWluLCBtYXhcclxuXHJcblx0JCh0aGlzKVxyXG5cdFx0LnZhbCB2YWx1ZVxyXG5cdFx0LnRyaWdnZXIgJ2NoYW5nZSdcclxuXHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxucmFuZ2VDaGFuZ2VkID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdyYW5nZUNoYW5nZWQnKVxyXG5cdG91dHB1dCA9ICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5yYW5nZS12YWx1ZScpXHJcblx0YmVmb3JlID0gKCQob3V0cHV0KS5kYXRhICdiZWZvcmUnKSA/ICcnXHJcblx0YWZ0ZXIgPSAoJChvdXRwdXQpLmRhdGEgJ2FmdGVyJykgPyAnJ1xyXG5cdHZhbHVlID0gJCh0aGlzKS52YWwoKSA/IDBcclxuXHJcblx0JChvdXRwdXQpLnRleHQgYmVmb3JlICsgdmFsdWUgKyBhZnRlclxyXG5cclxuXHJcbm51bWJlckRlY3JlYXNlID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdudW1iZXJEZWNyZWFzZScpXHJcblx0aW5wdXQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpXHJcblx0bWluID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21pbicpID8gMClcclxuXHRtYXggPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWF4JykgPyAxMDApXHJcblx0c3RlcCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdzdGVwJykgPyAxKVxyXG5cclxuXHR2YWx1ZSA9IHBhcnNlSW50ICgkKGlucHV0KS52YWwoKSA/IDApXHJcblx0dmFsdWUgPSBNYXRoLmNsYW1wKHZhbHVlIC0gc3BlZWQgKiBzdGVwLCBtaW4sIG1heClcclxuXHQkKGlucHV0KS52YWwodmFsdWUpLnRyaWdnZXIoJ2NoYW5nZScpXHJcblxyXG5cclxubnVtYmVySW5jcmVhc2UgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ251bWJlckluY3JlYXNlJylcclxuXHRpbnB1dCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0JylcclxuXHRtaW4gPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWluJykgPyAwKVxyXG5cdG1heCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtYXgnKSA/IDEwMClcclxuXHRzdGVwID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ3N0ZXAnKSA/IDEpXHJcblxyXG5cdHZhbHVlID0gcGFyc2VJbnQgKCQoaW5wdXQpLnZhbCgpID8gMClcclxuXHR2YWx1ZSA9IE1hdGguY2xhbXAodmFsdWUgKyBzcGVlZCAqIHN0ZXAsIG1pbiwgbWF4KVxyXG5cdCQoaW5wdXQpLnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJylcclxuXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCh3aW5kb3cpXHJcblx0XHQua2V5dXAga2V5VXBcclxuXHRcdC5rZXlkb3duIGtleURvd25cclxuXHJcblx0JCgnaW5wdXRbdHlwZT1udW1iZXJdLCBpbnB1dFt0eXBlPXJhbmdlXScpXHJcblx0XHQuYmluZCAnbW91c2V3aGVlbCcsIG1vdXNlV2hlZWxcclxuXHJcblx0JCgnaW5wdXRbdHlwZT1yYW5nZV0nKVxyXG5cdFx0LmNoYW5nZSByYW5nZUNoYW5nZWRcclxuXHRcdC5tb3VzZW1vdmUgcmFuZ2VDaGFuZ2VkXHJcblxyXG5cdCQoJy5udW1iZXItbWludXMnKS5jaGlsZHJlbignYnV0dG9uJylcclxuXHRcdC5jbGljayBudW1iZXJEZWNyZWFzZVxyXG5cclxuXHJcblx0JCgnLm51bWJlci1wbHVzJykuY2hpbGRyZW4oJ2J1dHRvbicpXHJcblx0XHQuY2xpY2sgbnVtYmVySW5jcmVhc2VcclxuXHJcbiIsIlxyXG5cclxuXHJcbiQoLT5cclxuXHJcblx0Y29uc29sZS5sb2coJChkb2N1bWVudCkuc2l6ZSgpKVxyXG5cclxuXHRoZWxwID0gZmFsc2VcclxuXHJcblxyXG5cdHNpemUgPSAoZWxlbWVudCkgLT5cclxuXHJcblx0XHR7d2lkdGg6ICQoZWxlbWVudCkud2lkdGgoKSwgaGVpZ2h0OiAkKGVsZW1lbnQpLmhlaWdodCgpfVxyXG5cclxuXHRwb3NpdGlvbiA9IChlbGVtZW50KSAtPlxyXG5cclxuXHRcdCQoZWxlbWVudCkub2Zmc2V0KClcclxuXHJcblxyXG5cclxuXHRzaG93ID0gLT5cclxuXHJcblx0XHRpZiBub3QgaGVscFxyXG5cclxuXHRcdFx0aGVscCA9IHRydWVcclxuXHJcblx0XHRcdFxyXG5cdFx0XHRtYWluT3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0XHQuYXR0cignaWQnLCAnbWFpbk92ZXJsYXknKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnb3ZlcmxheScpXHJcblx0XHRcdFx0LmNzcyhzaXplKGRvY3VtZW50KSlcclxuXHRcdFx0XHQuY2xpY2soaGlkZSlcclxuXHRcdFx0XHQuaGlkZSgpXHJcblxyXG5cclxuXHJcblx0XHRcdG5hdk92ZXJsYXkgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdFx0LmF0dHIoJ2lkJywgJ25hdk92ZXJsYXknKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnb3ZlcmxheScpXHJcblx0XHRcdFx0LmNzcygncG9zaXRpb24nLCAnZml4ZWQnKVxyXG5cdFx0XHRcdC5jc3MoJ3otaW5kZXgnLCAxMDAwMDApXHJcblx0XHRcdFx0LmNzcyhzaXplKCcjbWFpbk5hdicpKVxyXG5cdFx0XHRcdC5jbGljayhoaWRlKVxyXG5cdFx0XHRcdC5oaWRlKClcclxuXHJcblxyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coJCgnI21haW5Db250ZW50IFtkYXRhLWhlbHBdJykpXHJcblx0XHRcdGNvbnNvbGUubG9nKCQoJyNtYWluTmF2IFtkYXRhLWhlbHBdJykpXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHQkKCcjbWFpbkNvbnRlbnQgW2RhdGEtaGVscF0nKS5lYWNoKC0+XHJcblxyXG5cdFx0XHRcdGNvcHkgPSAkKHRoaXMpLmNsb25lKClcclxuXHRcdFx0XHRwID0gcG9zaXRpb24odGhpcylcclxuXHRcdFx0XHRzID0gc2l6ZSh0aGlzKVxyXG5cclxuXHRcdFx0XHQkKGNvcHkpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2hlbHBlcicpXHJcblx0XHRcdFx0XHQuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXHJcblx0XHRcdFx0XHQudG9vbHRpcCh7cGxhY2VtZW50OiAnYXV0byB0b3AnLCB0aXRsZTogJCh0aGlzKS5kYXRhKCdoZWxwJyl9KVxyXG5cdFx0XHRcdFx0LmNzcyhwKVxyXG5cdFx0XHRcdFx0LmNzcyhzKVxyXG5cclxuXHRcdFx0XHQkKGNvcHkpLmZpbmQoJ1t0aXRsZV0nKS5yZW1vdmVBdHRyKCd0aXRsZScpXHJcblxyXG5cdFx0XHRcdCQobWFpbk92ZXJsYXkpXHJcblx0XHRcdFx0XHQuYXBwZW5kKGNvcHkpXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQoJyNtYWluTmF2IFtkYXRhLWhlbHBdJykuZWFjaCgtPlxyXG5cclxuXHRcdFx0XHRjb3B5ID0gJCh0aGlzKS5jbG9uZSgpXHJcblx0XHRcdFx0cCA9IHBvc2l0aW9uKHRoaXMpXHJcblx0XHRcdFx0cyA9IHNpemUodGhpcylcclxuXHJcblx0XHRcdFx0JChjb3B5KVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdoZWxwZXInKVxyXG5cdFx0XHRcdFx0LmNzcygncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxyXG5cdFx0XHRcdFx0LnRvb2x0aXAoe3BsYWNlbWVudDogJ2F1dG8gdG9wJywgdGl0bGU6ICQodGhpcykuZGF0YSgnaGVscCcpfSlcclxuXHRcdFx0XHRcdC5jc3MocClcclxuXHRcdFx0XHRcdC5jc3MocylcclxuXHJcblx0XHRcdFx0JChjb3B5KS5maW5kKCdbdGl0bGVdJykucmVtb3ZlQXR0cigndGl0bGUnKVxyXG5cclxuXHRcdFx0XHQkKG5hdk92ZXJsYXkpXHJcblx0XHRcdFx0XHQuYXBwZW5kKGNvcHkpXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQoJ2JvZHknKVxyXG5cdFx0XHRcdC5hcHBlbmQobWFpbk92ZXJsYXkpXHJcblx0XHRcdFx0LmFwcGVuZChuYXZPdmVybGF5KVxyXG5cclxuXHRcdFx0JChtYWluT3ZlcmxheSkuZmFkZUluKClcclxuXHRcdFx0JChuYXZPdmVybGF5KS5mYWRlSW4oKVxyXG5cclxuXHJcblx0aGlkZSA9IC0+XHJcblxyXG5cdFx0aWYgaGVscFxyXG5cclxuXHRcdFx0aGVscCA9IGZhbHNlXHJcblx0XHRcdCQoJy5vdmVybGF5JykuZmFkZU91dCh7Y29tcGxldGU6IC0+XHJcblxyXG5cdFx0XHRcdCQoJy5vdmVybGF5JykucmVtb3ZlKClcclxuXHRcdFx0fSlcclxuXHJcblxyXG5cclxuXHQkKCcjaGVscEJ0bicpLmNsaWNrKC0+XHJcblxyXG5cdFx0c2hvdygpXHJcblx0KVxyXG5cclxuXHQkKGRvY3VtZW50KS5rZXlkb3duKChldmVudCkgLT5cclxuXHJcblx0XHRoaWRlKCkgaWYgZXZlbnQud2hpY2ggPT0gMjdcclxuXHQpXHJcbikiLCJsYXN0VGltZSA9IDBcclxudmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcblxyXG5pZiBub3Qgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgZm9yIHZlbmRvciBpbiB2ZW5kb3JzXHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3IgKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvciArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG5cclxud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBvcj0gKGNhbGxiYWNrLCBlbGVtZW50KSAtPlxyXG4gICAgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG5cclxuICAgIGlkID0gd2luZG93LnNldFRpbWVvdXQoLT5cclxuICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpXHJcbiAgICAsIHRpbWVUb0NhbGwpXHJcblxyXG4gICAgaWRcclxuXHJcbndpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSBvcj0gKGlkKSAtPlxyXG4gICAgY2xlYXJUaW1lb3V0KGlkKSIsIlxyXG5cclxuXHJcblxyXG4kIC0+IFxyXG5cdCQoJy5pbWFnZS1wcmV2aWV3JykuZWFjaCAtPlxyXG5cdFx0cHJldmlldyA9IHRoaXNcclxuXHRcdGlkID0gJCh0aGlzKS5kYXRhKCdmb3InKVxyXG5cdFx0JCgnIycgKyBpZCkuY2hhbmdlKChldmVudCkgLT4gXHJcblxyXG5cdFx0XHRwYXRoID0gVVJMLmNyZWF0ZU9iamVjdFVSTChldmVudC50YXJnZXQuZmlsZXNbMF0pXHJcblx0XHRcdCQocHJldmlldykuYXR0ciAnc3JjJywgcGF0aCBpZiBwYXRoP1xyXG5cclxuXHRcdFx0XHJcblx0XHQpLnRyaWdnZXIgJ2NoYW5nZSdcclxuIiwiXHJcblxyXG5zZXQgPSAobGFuZykgLT5cclxuXHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbGFuZy8nICsgbGFuZ1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmJ1dHRvbiA9ICgpIC0+XHJcblx0c2V0KCQodGhpcykuZGF0YSgnbGFuZycpKVxyXG5cclxuXHJcbnNlbGVjdCA9ICgpIC0+XHJcblx0c2V0KCQodGhpcykudmFsKCkpXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHQkKCcubGFuZ3VhZ2Utc2VsZWN0JykuY2hhbmdlKHNlbGVjdClcclxuXHQkKCcubGFuZ3VhZ2UtYnV0dG9uJykuY2xpY2soYnV0dG9uKVxyXG4iLCJuYXZmaXggPSAtPlxyXG5cdGhlaWdodCA9ICQoJyNtYWluTmF2JykuaGVpZ2h0KCkgKyAxMFxyXG5cdCQoJ2JvZHknKS5jc3MoJ3BhZGRpbmctdG9wJywgaGVpZ2h0ICsgJ3B4JylcclxuXHJcblxyXG4kIC0+XHJcblx0JCh3aW5kb3cpLnJlc2l6ZSAtPiBuYXZmaXgoKVxyXG5cdG5hdmZpeCgpIiwiXHJcblxyXG5pbWFnZUZvckZyYW1lID0gKGZyYW1lKSAtPlxyXG5cdCcvaW1hZ2VzL3BsYW50cy9wbGFudC0nICsgZnJhbWUgKyAnLnBuZydcclxuXHJcbnJlZnJlc2hQbGFudCA9IChwbGFudCkgLT4gXHJcblx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUpLmdldFRpbWUoKSAvIDEwMDApXHJcblx0c3RhcnQgPSBwYXJzZUludCAkKHBsYW50KS5kYXRhICdzdGFydCdcclxuXHRlbmQgPSBwYXJzZUludCAkKHBsYW50KS5kYXRhICdlbmQnXHJcblx0d2F0ZXJpbmcgPSBwYXJzZUludCAkKHBsYW50KS5kYXRhICd3YXRlcmluZydcclxuXHRub3cgPSBNYXRoLm1pbiBub3csIHdhdGVyaW5nXHJcblx0ZnJhbWUgPSBNYXRoLmZsb29yKDE3ICogTWF0aC5jbGFtcCgobm93IC0gc3RhcnQpIC8gKGVuZCAtIHN0YXJ0KSwgMCwgMSkpIFxyXG5cdCQocGxhbnQpLmF0dHIgJ3NyYycsIGltYWdlRm9yRnJhbWUgZnJhbWVcclxuXHJcblx0c2V0VGltZW91dCAoLT4gcmVmcmVzaFBsYW50IHBsYW50KSwgMTAwMCBpZiBmcmFtZSA8IDE3XHJcblxyXG4kIC0+XHJcblx0JCgnLnBsYW50YXRpb24tcGxhbnQnKS5lYWNoIC0+IHJlZnJlc2hQbGFudCB0aGlzXHJcblxyXG5cdCQoJyNzZWVkc01vZGFsJykub24gJ3Nob3cuYnMubW9kYWwnLCAoZXZlbnQpIC0+XHJcblx0XHRzbG90ID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KS5kYXRhICdzbG90J1xyXG5cdFx0JCh0aGlzKS5maW5kKCdpbnB1dFtuYW1lPXNsb3RdJykudmFsIHNsb3QiLCJ1cmwgPSAnL2FwaS9jaGFyYWN0ZXInO1xyXG5cclxuXHJcbnNldFByb2dyZXNzID0gKG9iamVjdCwgdmFsdWUsIG1pblZhbHVlLCBtYXhWYWx1ZSwgbGFzdFVwZGF0ZSwgbmV4dFVwZGF0ZSkgLT5cclxuXHJcblx0YmFyID0gJCgnLicgKyBvYmplY3QgKyAnLWJhcicpXHJcblx0dGltZXIgPSAkKCcuJyArIG9iamVjdCArICctdGltZXInKVxyXG5cclxuXHJcblx0aWYgYmFyLmxlbmd0aCA+IDBcclxuXHRcdGNoaWxkID0gJChiYXIpLmNoaWxkcmVuICcucHJvZ3Jlc3MtYmFyJ1xyXG5cclxuXHRcdCQoY2hpbGQpXHJcblx0XHRcdC5kYXRhICdtYXgnLCBtYXhWYWx1ZVxyXG5cdFx0XHQuZGF0YSAnbWluJywgbWluVmFsdWVcclxuXHRcdFx0LmRhdGEgJ25vdycsIHZhbHVlXHJcblx0XHRiYXJbMF0udXBkYXRlPygpXHJcblxyXG5cclxuXHRpZiB0aW1lci5sZW5ndGggPiAwXHJcblx0XHRjaGlsZCA9ICQodGltZXIpLmNoaWxkcmVuICcucHJvZ3Jlc3MtYmFyJ1xyXG5cclxuXHRcdGlmIG5leHRVcGRhdGU/XHJcblx0XHRcdCQoY2hpbGQpXHJcblx0XHRcdFx0LmRhdGEgJ21heCcsIG5leHRVcGRhdGVcclxuXHRcdFx0XHQuZGF0YSAnbWluJywgbGFzdFVwZGF0ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQkKGNoaWxkKVxyXG5cdFx0XHRcdC5kYXRhICdtYXgnLCAxXHJcblx0XHRcdFx0LmRhdGEgJ21pbicsIDBcclxuXHJcblxyXG5zZXRWYWx1ZXMgPSAob2JqZWN0LCB2YWx1ZSwgbWluVmFsdWUsIG1heFZhbHVlKSAtPlxyXG5cdCQoJy4nICsgb2JqZWN0ICsgJy1ub3cnKVxyXG5cdFx0LnRleHQgdmFsdWVcclxuXHJcblx0JCgnLicgKyBvYmplY3QgKyAnLW1pbicpXHJcblx0XHQudGV4dCBtaW5WYWx1ZVxyXG5cclxuXHQkKCcuJyArIG9iamVjdCArICctbWF4JylcclxuXHRcdC50ZXh0IG1heFZhbHVlXHJcblxyXG5zZXRWYWx1ZSA9IChvYmplY3QsIHZhbHVlKSAtPlxyXG5cdCQoJy4nICsgb2JqZWN0KVxyXG5cdFx0LnRleHQgdmFsdWVcclxuXHJcblxyXG5cclxuXHJcbmZpbGwgPSAoZGF0YSkgLT5cclxuXHRzZXRQcm9ncmVzcyAnaGVhbHRoJywgZGF0YS5oZWFsdGgsIDAsIGRhdGEubWF4SGVhbHRoLCBkYXRhLmhlYWx0aFVwZGF0ZSwgZGF0YS5uZXh0SGVhbHRoVXBkYXRlXHJcblx0c2V0VmFsdWVzICdoZWFsdGgnLCBkYXRhLmhlYWx0aCwgMCwgZGF0YS5tYXhIZWFsdGhcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ2VuZXJneScsIGRhdGEuZW5lcmd5LCAwLCBkYXRhLm1heEVuZXJneSwgZGF0YS5lbmVyZ3lVcGRhdGUsIGRhdGEubmV4dEVuZXJneVVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnZW5lcmd5JywgZGF0YS5lbmVyZ3ksIDAsIGRhdGEubWF4RW5lcmd5XHJcblxyXG5cdHNldFByb2dyZXNzICd3YW50ZWQnLCBkYXRhLndhbnRlZCwgMCwgNiwgZGF0YS53YW50ZWRVcGRhdGUsIGRhdGEubmV4dFdhbnRlZFVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnd2FudGVkJywgZGF0YS53YW50ZWQsIDAsIDZcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ2V4cGVyaWVuY2UnLCBkYXRhLmV4cGVyaWVuY2UsIDAsIGRhdGEubWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnZXhwZXJpZW5jZScsIGRhdGEuZXhwZXJpZW5jZSwgMCwgZGF0YS5tYXhFeHBlcmllbmNlXHJcblxyXG5cclxuXHRzZXRQcm9ncmVzcyAncGxhbnRhdG9yJywgZGF0YS5wbGFudGF0b3JFeHBlcmllbmNlLCAwLCBkYXRhLnBsYW50YXRvck1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ3BsYW50YXRvcicsIGRhdGEucGxhbnRhdG9yRXhwZXJpZW5jZSwgMCwgZGF0YS5wbGFudGF0b3JNYXhFeHBlcmllbmNlXHJcblxyXG5cdHNldFByb2dyZXNzICdzbXVnZ2xlcicsIGRhdGEuc211Z2dsZXJFeHBlcmllbmNlLCAwLCBkYXRhLnNtdWdnbGVyTWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnc211Z2dsZXInLCBkYXRhLnNtdWdnbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5zbXVnZ2xlck1heEV4cGVyaWVuY2VcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ2RlYWxlcicsIGRhdGEuZGVhbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5kZWFsZXJNYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdkZWFsZXInLCBkYXRhLmRlYWxlckV4cGVyaWVuY2UsIDAsIGRhdGEuZGVhbGVyTWF4RXhwZXJpZW5jZVxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0I3NldFZhbHVlICdsZXZlbCcsIGRhdGEubGV2ZWxcclxuXHQjc2V0VmFsdWUgJ3BsYW50YXRvci1sZXZlbCcsIGRhdGEucGxhbnRhdG9yTGV2ZWxcclxuXHQjc2V0VmFsdWUgJ3NtdWdnbGVyLWxldmVsJywgZGF0YS5zbXVnZ2xlckxldmVsXHJcblx0I3NldFZhbHVlICdkZWFsZXItbGV2ZWwnLCBkYXRhLmRlYWxlckxldmVsXHJcblx0I3NldFZhbHVlICdzdHJlbmd0aCcsIGRhdGEuc3RyZW5ndGgsXHJcblx0I3NldFZhbHVlICdwZXJjZXB0aW9uJywgZGF0YS5wZXJjZXB0aW9uXHJcblx0I3NldFZhbHVlICdlbmR1cmFuY2UnLCBkYXRhLmVuZHVyYW5jZVxyXG5cdCNzZXRWYWx1ZSAnY2hhcmlzbWEnLCBkYXRhLmNoYXJpc21hXHJcblx0I3NldFZhbHVlICdpbnRlbGxpZ2VuY2UnLCBkYXRhLmludGVsbGlnZW5jZVxyXG5cdCNzZXRWYWx1ZSAnYWdpbGl0eScsIGRhdGEuYWdpbGl0eVxyXG5cdCNzZXRWYWx1ZSAnbHVjaycsIGRhdGEubHVjayArICclJ1xyXG5cdCNzZXRWYWx1ZSAnc3RhdGlzdGljUG9pbnRzJywgZGF0YS5zdGF0aXN0aWNQb2ludHNcclxuXHQjc2V0VmFsdWUgJ3RhbGVudFBvaW50cycsIGRhdGEudGFsZW50UG9pbnRzXHJcblx0I3NldFZhbHVlICdtb25leScsICckJyArIGRhdGEubW9uZXlcclxuXHQjc2V0VmFsdWUgJ3JlcG9ydHMnLCBkYXRhLnJlcG9ydHNDb3VudFxyXG5cdCNzZXRWYWx1ZSAnbWVzc2FnZXMnLCBkYXRhLm1lc3NhZ2VzQ291bnRcclxuXHJcblx0c2NvcGUgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuc2NvcGUoKVxyXG5cclxuXHRpZiBzY29wZT8gYW5kIHNjb3BlLnBsYXllcj9cclxuXHRcdCNzY29wZS5wbGF5ZXIubGV2ZWwgPSBkYXRhLmxldmVsXHJcblx0XHQjc2NvcGUucGxheWVyLnBsYW50YXRvckxldmVsID0gZGF0YS5wbGFudGF0b3JMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5zbXVnZ2xlckxldmVsID0gZGF0YS5zbXVnZ2xlckxldmVsXHJcblx0XHQjc2NvcGUucGxheWVyLmRlYWxlckxldmVsID0gZGF0YS5kZWFsZXJMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5zdHJlbmd0aCA9IGRhdGEuc3RyZW5ndGhcclxuXHRcdCNzY29wZS5wbGF5ZXIucGVyY2VwdGlvbiA9IGRhdGEucGVyY2VwdGlvblxyXG5cdFx0I3Njb3BlLnBsYXllci5lbmR1cmFuY2UgPSBkYXRhLmVuZHVyYW5jZVxyXG5cdFx0I3Njb3BlLnBsYXllci5jaGFyaXNtYSA9IGRhdGEuY2hhcmlzbWFcclxuXHRcdCNzY29wZS5wbGF5ZXIuaW50ZWxsaWdlbmNlID0gZGF0YS5pbnRlbGxpZ2VuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuYWdpbGl0eSA9IGRhdGEuYWdpbGl0eVxyXG5cdFx0I3Njb3BlLnBsYXllci5sdWNrID0gZGF0YS5sdWNrXHJcblx0XHQjc2NvcGUucGxheWVyLnJlc3BlY3QgPSBkYXRhLnJlc3BlY3RcclxuXHRcdCNzY29wZS5wbGF5ZXIud2VpZ2h0ID0gZGF0YS53ZWlnaHRcclxuXHRcdCNzY29wZS5wbGF5ZXIuY2FwYWNpdHkgPSBkYXRhLmNhcGFjaXR5XHJcblx0XHQjc2NvcGUucGxheWVyLm1pbkRhbWFnZSA9IGRhdGEubWluRGFtYWdlXHJcblx0XHQjc2NvcGUucGxheWVyLm1heERhbWFnZSA9IGRhdGEubWF4RGFtYWdlXHJcblx0XHQjc2NvcGUucGxheWVyLmRlZmVuc2UgPSBkYXRhLmRlZmVuc2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuY3JpdENoYW5jZSA9IGRhdGEuY3JpdENoYW5jZVxyXG5cdFx0I3Njb3BlLnBsYXllci5zcGVlZCA9IGRhdGEuc3BlZWRcclxuXHRcdCNzY29wZS5wbGF5ZXIuZXhwZXJpZW5jZU1vZGlmaWVyID0gZGF0YS5leHBlcmllbmNlTW9kaWZpZXJcclxuXHRcdCNzY29wZS5wbGF5ZXIubW9uZXlNb2RpZmllciA9IGRhdGEubW9uZXlNb2RpZmllclxyXG5cclxuXHRcdGZvciBrLCB2IG9mIGRhdGFcclxuXHRcdFx0c2NvcGUucGxheWVyW2tdID0gdlxyXG5cclxuXHRcdHNjb3BlLiRhcHBseSgpXHJcblxyXG5cclxuXHJcblxyXG5sb2FkZWQgPSAoZGF0YSkgLT5cclxuXHJcblx0ZmlsbCBkYXRhXHJcblxyXG5cdGlmIGRhdGEucmVsb2FkXHJcblxyXG5cdFx0d2luZG93LmxvY2F0aW9uLnJlZnJlc2goKVxyXG5cclxuXHRzZXRUaW1lb3V0IGxvYWQsIGRhdGEubmV4dFVwZGF0ZSAqIDEwMDBcclxuXHJcblxyXG5ub3RpZnkgPSAoZGF0YSkgLT5cclxuXHRmb3IgbiBpbiBkYXRhXHJcblx0XHR3aW5kb3cubm90aWZ5IHtcclxuXHJcblx0XHRcdHRpdGxlOiAnPHN0cm9uZz4nICsgbi50aXRsZSArICc8L3N0cm9uZz4nLFxyXG5cdFx0XHRtZXNzYWdlOiAnJyxcclxuXHRcdFx0dXJsOiAnL3JlcG9ydHMvJyArIG4uaWQsXHJcblxyXG5cdFx0fVxyXG5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHR3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5tZXNzYWdlID0gKGRhdGEpIC0+XHJcblx0Zm9yIG4gaW4gZGF0YVxyXG5cdFx0d2luZG93Lm5vdGlmeSB7XHJcblxyXG5cdFx0XHR0aXRsZTogJzxzdHJvbmc+JyArIG4uYXV0aG9yICsgJzwvc3Ryb25nPjogJyArIG4udGl0bGUgKyAnPGJyLz4nLFxyXG5cdFx0XHRtZXNzYWdlOiBuLmNvbnRlbnQsXHJcblx0XHRcdHVybDogJy9tZXNzYWdlcy9pbmJveC8nICsgbi5pZCxcclxuXHJcblx0XHR9XHJcblxyXG5cdGlmIHdpbmRvdy5hY3RpdmVcclxuXHRcdHdpbmRvdy5ub3RpZnlTaG93KClcclxuXHJcblxyXG5cclxubG9hZCA9IC0+XHJcblxyXG5cdCQuYWpheCB7XHJcblxyXG5cdFx0dXJsOiB1cmwsXHJcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdHN1Y2Nlc3M6IGxvYWRlZFxyXG5cdH1cclxuXHJcblx0JC5hamF4IHtcclxuXHJcblx0XHR1cmw6IHVybCArICcvbm90aWZpY2F0aW9ucycsXHJcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdHN1Y2Nlc3M6IG5vdGlmeVxyXG5cdH1cclxuXHJcblx0JC5hamF4IHtcclxuXHJcblx0XHR1cmw6IHVybCArICcvbWVzc2FnZXMnLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRzdWNjZXNzOiBtZXNzYWdlLFxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRcclxuJCh3aW5kb3cpLmZvY3VzIC0+XHJcblx0bG9hZCgpXHJcblxyXG5cclxuJCAtPlxyXG5cdHNldFRpbWVvdXQgbG9hZCwgMjUwMCIsIlxyXG5zcXVhcmUgPSAtPlxyXG5cclxuXHQkKCcuc3F1YXJlJykuZWFjaCAtPlxyXG5cclxuXHRcdGlmICQodGhpcykuZGF0YSgnc3F1YXJlJykgPT0gJ3dpZHRoJ1xyXG5cclxuXHRcdFx0JCh0aGlzKS53aWR0aCAkKHRoaXMpLmhlaWdodCgpXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHQkKHRoaXMpLmhlaWdodCAkKHRoaXMpLndpZHRoKClcclxuXHJcbiQgLT5cclxuXHQkKHdpbmRvdykucmVzaXplIC0+IFxyXG5cdFx0c3F1YXJlKClcclxuXHRcdFxyXG5cdHNxdWFyZSgpIiwiXHJcbmNoYW5nZWQgPSAtPiBcclxuXHRjdXJyZW50ID0gcGFyc2VJbnQgKCQoJyNjdXJyZW50U3RhdGlzdGljc1BvaW50cycpLnRleHQoKSA/IDApXHJcblx0bGVmdCA9IHBhcnNlSW50ICQoJyNzdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpXHJcblx0b2xkID0gcGFyc2VJbnQgKCQodGhpcykuZGF0YSgnb2xkJykgPyAwKVxyXG5cdHZhbCA9IHBhcnNlSW50ICgkKHRoaXMpLnZhbCgpID8gMClcclxuXHRkaWZmID0gdmFsIC0gb2xkXHJcblxyXG5cdGRpZmYgPSBsZWZ0IGlmIGRpZmYgPiBsZWZ0XHJcblx0dmFsID0gb2xkICsgZGlmZlxyXG5cdGxlZnQgLT0gZGlmZlxyXG5cclxuXHRpZiBub3QgaXNOYU4gZGlmZlxyXG5cclxuXHRcdCQodGhpcylcclxuXHRcdFx0LnZhbCB2YWxcclxuXHRcdFx0LmRhdGEgJ29sZCcsIHZhbFxyXG5cclxuXHRcdCQoJyNzdGF0aXN0aWNzUG9pbnRzJylcclxuXHRcdFx0LnRleHQgbGVmdFxyXG5cclxuXHRcdCQoJy5zdGF0aXN0aWMnKS5lYWNoIC0+XHJcblx0XHRcdHZhbCA9IHBhcnNlSW50ICQodGhpcykudmFsKCkgPyAwXHJcblx0XHRcdCQodGhpcykuYXR0ciAnbWF4JywgbGVmdCArIHZhbFxyXG5cclxuXHJcbnJhbmRvbSA9IChtaW4sIG1heCkgLT4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXHJcblxyXG5yYW5kb21JbiA9IChhcnJheSkgLT5cclxuXHRpbmRleCA9IHJhbmRvbSgwLCBhcnJheS5sZW5ndGggLSAxKVxyXG5cdGFycmF5W2luZGV4XVxyXG5cclxuXHJcblxyXG5cclxuXHJcbnJvbGwgPSAtPlxyXG5cclxuXHRyb2xsYWJsZSA9ICQoJy5zdGF0aXN0aWMucm9sbGFibGUnKVxyXG5cdCQocm9sbGFibGUpLnZhbCgwKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cdHBvaW50cyA9IHBhcnNlSW50ICQoJyNzdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpXHJcblxyXG5cclxuXHRmb3IgaSBpbiBbMS4ucG9pbnRzXVxyXG5cclxuXHRcdHN0YXRpc3RpYyA9IHJhbmRvbUluKHJvbGxhYmxlKVxyXG5cdFx0dmFsID0gcGFyc2VJbnQgJChzdGF0aXN0aWMpLnZhbCgpXHJcblx0XHQkKHN0YXRpc3RpYykudmFsKHZhbCArIDEpXHJcblxyXG5cclxuXHQkKHJvbGxhYmxlKS50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCgnLnN0YXRpc3RpYycpXHJcblx0XHQuYmluZCAna2V5dXAgaW5wdXQgY2hhbmdlJywgY2hhbmdlZFxyXG5cdFx0LnRyaWdnZXIgJ2NoYW5nZSdcclxuXHJcblx0JCgnLnN0YXRSb2xsZXInKVxyXG5cdFx0LmNsaWNrKHJvbGwpXHJcblxyXG5cdHJvbGwoKVxyXG4iLCJcclxucmVmcmVzaGluZyA9IGZhbHNlXHJcblxyXG5yZWZyZXNoID0gLT5cclxuXHR3aW5kb3cubG9jYXRpb24ucmVmcmVzaCgpIGlmIG5vdCByZWZyZXNoaW5nXHJcblx0cmVmcmVzaGluZyA9IHRydWVcclxuXHJcbnVwZGF0ZSA9ICh0aW1lcikgLT5cclxuXHRiYXIgPSAkKHRpbWVyKS5jaGlsZHJlbignLnByb2dyZXNzLWJhcicpLmxhc3QoKVxyXG5cdGxhYmVsID0gJCh0aW1lcikuY2hpbGRyZW4gJy5wcm9ncmVzcy1sYWJlbCdcclxuXHR0aW1lID0gTWF0aC5yb3VuZCAobmV3IERhdGUpLmdldFRpbWUoKSAvIDEwMDAuMFxyXG5cclxuXHJcblx0bWluID0gJChiYXIpLmRhdGEgJ21pbidcclxuXHRtYXggPSAkKGJhcikuZGF0YSAnbWF4J1xyXG5cdHN0b3AgPSAkKGJhcikuZGF0YSAnc3RvcCdcclxuXHRjYSA9ICQoYmFyKS5kYXRhKCdjYScpXHJcblx0Y2IgPSAkKGJhcikuZGF0YSgnY2InKVxyXG5cclxuXHJcblxyXG5cdHJldmVyc2VkID0gQm9vbGVhbigkKGJhcikuZGF0YSgncmV2ZXJzZWQnKSA/IGZhbHNlKVxyXG5cdHJlbG9hZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JlbG9hZCcpID8gdHJ1ZSlcclxuXHJcblx0aWYgc3RvcD9cclxuXHRcdHRpbWUgPSBNYXRoLm1pbiB0aW1lLCBzdG9wXHJcblxyXG5cdG5vdyA9IE1hdGguY2xhbXAodGltZSwgbWluLCBtYXgpXHJcblxyXG5cclxuXHRwZXJjZW50ID0gKG5vdyAtIG1pbikgLyAobWF4IC0gbWluKVxyXG5cdHBlcmNlbnQgPSAxIC0gcGVyY2VudCBpZiByZXZlcnNlZFxyXG5cclxuXHJcblxyXG5cclxuXHQkKGJhcikuY3NzICd3aWR0aCcsIChwZXJjZW50ICogMTAwKSArICclJ1xyXG5cdCQoYmFyKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBNYXRoLmxlcnBDb2xvcnMocGVyY2VudCwgY2EsIGNiKSkgaWYgY2E/IGFuZCBjYj9cclxuXHQkKGxhYmVsKS50ZXh0IHdpbmRvdy50aW1lRm9ybWF0PyBtYXggLSBub3dcclxuXHJcblx0cmVmcmVzaCgpIGlmIHRpbWUgPiBtYXggYW5kIHJlbG9hZFxyXG5cclxuXHRzZXRUaW1lb3V0KC0+IFxyXG5cclxuXHRcdHVwZGF0ZSh0aW1lcilcclxuXHJcblx0LCAxMDAwKSAjaWYgdGltZSA8PSBtYXhcclxuXHJcblxyXG51cGRhdGVOYXYgPSAodGltZXIpIC0+XHJcblxyXG5cdHRpbWUgPSBNYXRoLnJvdW5kIChuZXcgRGF0ZSkuZ2V0VGltZSgpIC8gMTAwMC4wXHJcblx0bWluID0gJCh0aW1lcikuZGF0YSAnbWluJ1xyXG5cdG1heCA9ICQodGltZXIpLmRhdGEgJ21heCdcclxuXHRub3cgPSBNYXRoLmNsYW1wKHRpbWUsIG1pbiwgbWF4KVxyXG5cclxuXHRwZXJjZW50ID0gMSAtIChub3cgLSBtaW4pIC8gKG1heCAtIG1pbilcclxuXHJcblx0JCh0aW1lcikuY3NzKCd3aWR0aCcsIChwZXJjZW50ICogMTAwKSArICclJylcclxuXHJcblx0c2V0VGltZW91dCgtPiBcclxuXHJcblx0XHR1cGRhdGVOYXYodGltZXIpXHJcblxyXG5cdCwgMTAwMClcclxuXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHQkKCcucHJvZ3Jlc3MtdGltZScpLmVhY2ggLT5cclxuXHRcdHVwZGF0ZSB0aGlzXHJcblxyXG5cdCQoJy5uYXYtdGltZXIgPiAubmF2LXRpbWVyLWJhcicpLmVhY2ggLT5cclxuXHRcdHVwZGF0ZU5hdiB0aGlzXHJcblxyXG5cclxuXHJcblxyXG4iLCIkIC0+XHJcblx0JCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goLT5cclxuXHJcblx0XHRvcHRpb25zID0ge1xyXG5cclxuXHRcdFx0aHRtbDogdHJ1ZSxcclxuXHRcdFx0cGxhY2VtZW50OiAnYXV0byBsZWZ0J1xyXG5cdFx0fVxyXG5cclxuXHRcdHRyaWdnZXIgPSAkKHRoaXMpLmRhdGEoJ3RyaWdnZXInKVxyXG5cclxuXHRcdGlmIHRyaWdnZXI/XHJcblx0XHRcdG9wdGlvbnMudHJpZ2dlciA9IHRyaWdnZXJcclxuXHJcblxyXG5cdFx0JCh0aGlzKS50b29sdGlwKG9wdGlvbnMpXHJcblx0KSIsIlxyXG4kIC0+XHJcblxyXG5cdHR1dG9yaWFscyA9IHt9XHJcblx0JCgnLnR1dG9yaWFsLXN0ZXAnKS5wb3BvdmVyKHt0cmlnZ2VyOiAnbWFudWFsJywgcGxhY2VtZW50OiAnYm90dG9tJ30pXHJcblxyXG5cdHNob3cgPSAoc3RlcCkgLT5cclxuXHJcblx0XHRpZiBzdGVwP1xyXG5cclxuXHRcdFx0JChzdGVwLmVsZW1lbnRzKVxyXG5cdFx0XHRcdC5iaW5kKCdjbGljaycsIGNsaWNrZWQpXHJcblx0XHRcdFx0LmFkZENsYXNzKCd0dXRvcmlhbC1hY3RpdmUnKVxyXG5cdFx0XHRcdC5maXJzdCgpXHJcblx0XHRcdFx0LnBvcG92ZXIoJ3Nob3cnKVxyXG5cclxuXHJcblx0Y2xpY2tlZCA9IChldmVudCkgLT5cclxuXHJcblx0XHRuZXh0ID0gdHV0b3JpYWxzW3RoaXMuc3RlcC5uYW1lXS5zaGlmdCgpXHJcblxyXG5cdFx0aWYgbmV4dD9cclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IG5leHQuaW5kZXh9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KC0+XHJcblxyXG5cdFx0XHRcdHNob3cobmV4dClcclxuXHRcdFx0LCA1MDApXHJcblx0XHRlbHNlXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IHRoaXMuc3RlcC5pbmRleCArIDF9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblx0XHRcclxuXHJcblxyXG5cclxuXHRcdCQodGhpcy5zdGVwLmVsZW1lbnRzKS51bmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCd0dXRvcmlhbC1hY3RpdmUnKVxyXG5cdFx0XHQucG9wb3ZlcignaGlkZScpXHJcblxyXG5cdFx0I2V2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHRcdCNldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuXHJcblx0cmVjZWl2ZSA9IChvYmplY3QsIG5hbWUsIGRhdGEpIC0+XHJcblxyXG5cdFx0aWYgZGF0YS5zdGFnZSA8IDBcclxuXHJcblxyXG5cdFx0XHRtb2RhbCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsIGZhZGUnKVxyXG5cdFx0XHRkaWFsb2cgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1kaWFsb2cnKVxyXG5cdFx0XHRjb250ZW50ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtY29udGVudCcpXHJcblx0XHRcdGhlYWRlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWhlYWRlcicpXHJcblx0XHRcdGJvZHkgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1ib2R5JylcclxuXHRcdFx0Zm9vdGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtZm9vdGVyJylcclxuXHRcdFx0dGl0bGUgPSAkKCc8aDQ+PC9oND4nKS5hZGRDbGFzcygnbW9kYWwtdGl0bGUnKVxyXG5cclxuXHRcdFx0Z3JvdXAgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdidG4tZ3JvdXAnKVxyXG5cdFx0XHRidG4xID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnRuIGJ0bi1zdWNjZXNzJykuYXR0cigndmFsdWUnLCAneWVzJykudGV4dChpMThuLnllcylcclxuXHRcdFx0YnRuMiA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2J0biBidG4tZGFuZ2VyJykuYXR0cigndmFsdWUnLCAnbm8nKS50ZXh0KGkxOG4ubm8pXHJcblxyXG5cdFx0XHQkKGJ0bjEpLmNsaWNrKC0+XHJcblxyXG5cdFx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lLCBhY3RpdmU6IDF9LFxyXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHQkKG1vZGFsKS5tb2RhbCgnaGlkZScpXHJcblxyXG5cdFx0XHRcdGxvYWQob2JqZWN0LCBuYW1lLCBkYXRhKVxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHQkKGJ0bjIpLmNsaWNrKC0+XHJcblxyXG5cdFx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lLCBhY3RpdmU6IDB9LFxyXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHQkKG1vZGFsKS5tb2RhbCgnaGlkZScpXHJcblxyXG5cdFx0XHQpXHJcblxyXG5cdFx0XHQkKHRpdGxlKVxyXG5cdFx0XHRcdC50ZXh0KGRhdGEudGl0bGUpXHJcblxyXG5cdFx0XHQkKGJvZHkpXHJcblx0XHRcdFx0LnRleHQoZGF0YS5kZXNjcmlwdGlvbilcclxuXHJcblx0XHRcdCQoaGVhZGVyKVxyXG5cdFx0XHRcdC5hcHBlbmQodGl0bGUpXHJcblxyXG5cclxuXHRcdFx0JChncm91cClcclxuXHRcdFx0XHQuYXBwZW5kKGJ0bjIpXHJcblx0XHRcdFx0LmFwcGVuZChidG4xKVxyXG5cclxuXHRcdFx0JChmb290ZXIpXHJcblx0XHRcdFx0LmFwcGVuZChncm91cClcclxuXHJcblxyXG5cdFx0XHQkKGNvbnRlbnQpXHJcblx0XHRcdFx0LmFwcGVuZChoZWFkZXIpXHJcblx0XHRcdFx0LmFwcGVuZChib2R5KVxyXG5cdFx0XHRcdC5hcHBlbmQoZm9vdGVyKVxyXG5cclxuXHRcdFx0JChkaWFsb2cpXHJcblx0XHRcdFx0LmFwcGVuZChjb250ZW50KVxyXG5cclxuXHRcdFx0JChtb2RhbClcclxuXHRcdFx0XHQuYXBwZW5kKGRpYWxvZylcclxuXHJcblx0XHRcdCQoJ2JvZHknKVxyXG5cdFx0XHRcdC5hcHBlbmQobW9kYWwpXHJcblxyXG5cdFx0XHQkKG1vZGFsKS5tb2RhbCh7YmFja2Ryb3A6ICdzdGF0aWMnLCBzaG93OiB0cnVlLCBrZXlib2FyZDogZmFsc2V9KVxyXG5cclxuXHJcblx0XHRlbHNlXHJcblx0XHRcdGxvYWQob2JqZWN0LCBuYW1lLCBkYXRhKVxyXG5cclxuXHJcblxyXG5cdGxvYWQgPSAob2JqZWN0LCBuYW1lLCBkYXRhKSAtPlxyXG5cclxuXHJcblx0XHR0dXRvcmlhbCA9IFtdXHJcblx0XHRkZXB0aCA9ICQob2JqZWN0KS5wYXJlbnRzKCdbZGF0YS10dXRvcmlhbD10cnVlXScpLmxlbmd0aCArIDFcclxuXHJcblxyXG5cdFx0JChvYmplY3QpLmZpbmQoJy50dXRvcmlhbC1zdGVwJykuZWFjaCgtPlxyXG5cclxuXHJcblx0XHRcdHN0ZXAgPSBudWxsXHJcblx0XHRcdGluZGV4ID0gJCh0aGlzKS5kYXRhKCd0dXRvcmlhbC1pbmRleCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gaWYgaW5kZXggPCBkYXRhLnN0YWdlIG9yICQodGhpcykucGFyZW50cygnW2RhdGEtdHV0b3JpYWw9dHJ1ZV0nKS5sZW5ndGggIT0gZGVwdGhcclxuXHJcblxyXG5cclxuXHRcdFx0aWYgdHV0b3JpYWxbaW5kZXhdP1xyXG5cdFx0XHRcdHN0ZXAgPSB0dXRvcmlhbFtpbmRleF1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHN0ZXAgPSB7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbWVudHM6IFtdLFxyXG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0XHRcdGluZGV4OiBpbmRleCxcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dHV0b3JpYWxbaW5kZXhdID0gc3RlcFxyXG5cclxuXHJcblx0XHRcdHN0ZXAuZWxlbWVudHMucHVzaCh0aGlzKVxyXG5cdFx0XHR0aGlzLnN0ZXAgPSBzdGVwXHJcblx0XHQpXHJcblxyXG5cdFx0dHV0b3JpYWwgPSB0dXRvcmlhbC5maWx0ZXIoKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0XHRpZiBlbGVtZW50P1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRcdHR1dG9yaWFsc1tuYW1lXSA9IHR1dG9yaWFsXHJcblx0XHRzaG93KHR1dG9yaWFsLnNoaWZ0KCkpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQkKCdbZGF0YS10dXRvcmlhbD10cnVlJykuZWFjaCgtPlxyXG5cclxuXHRcdG5hbWUgPSAkKHRoaXMpLmRhdGEoJ3R1dG9yaWFsLW5hbWUnKVxyXG5cclxuXHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lfSxcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0c3VjY2VzczogKGRhdGEpID0+XHJcblx0XHRcdFx0cmVjZWl2ZSh0aGlzLCBuYW1lLCBkYXRhKSBpZiBkYXRhLmFjdGl2ZVxyXG5cdFx0fSlcclxuXHQpIiwid2luZG93LmZvcm1hdCBvcj0gXHJcblx0dGltZTpcclxuXHRcdGRheTogJ2QnXHJcblx0XHRob3VyOiAnaCdcclxuXHRcdG1pbnV0ZTogJ20nXHJcblx0XHRzZWNvbmQ6ICdzJ1xyXG5cclxuXHJcblxyXG5cclxud2luZG93LmFjdGl2ZSA/PSB0cnVlXHJcblxyXG5cclxuXHJcbiQod2luZG93KS5mb2N1cyAtPlxyXG5cdHdpbmRvdy5hY3RpdmUgPSB0cnVlXHJcblxyXG4kKHdpbmRvdykuYmx1ciAtPlxyXG5cdHdpbmRvdy5hY3RpdmUgPSBmYWxzZVxyXG5cclxuJCh3aW5kb3cpLnJlc2l6ZSAtPlxyXG5cdGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRvKSBpZiB0aGlzLnJlc2l6ZVRvXHJcblx0dGhpcy5yZXNpemVUbyA9IHNldFRpbWVvdXQoLT5cclxuXHRcdCQodGhpcykudHJpZ2dlcigncmVzaXplZCcpXHJcblx0LCA1MDApXHJcblx0XHJcblxyXG5cclxuXHJcbndpbmRvdy5scGFkIG9yPSAodmFsdWUsIHBhZGRpbmcpIC0+XHJcbiAgemVyb2VzID0gXCIwXCJcclxuICB6ZXJvZXMgKz0gXCIwXCIgZm9yIGkgaW4gWzEuLnBhZGRpbmddXHJcblxyXG4gICh6ZXJvZXMgKyB2YWx1ZSkuc2xpY2UocGFkZGluZyAqIC0xKVxyXG5cclxuXHJcbnRpbWVTZXBhcmF0ZSA9ICh2YWx1ZSkgLT5cclxuXHRpZiB2YWx1ZS5sZW5ndGggPiAwXHJcblx0XHR2YWx1ZSArICcgJ1xyXG5cdGVsc2VcclxuXHRcdHZhbHVlXHJcblxyXG50aW1lRm9ybWF0ID0gKHRleHQsIHZhbHVlLCBmb3JtYXQpIC0+XHJcblx0dGV4dCA9IHRpbWVTZXBhcmF0ZSh0ZXh0KVxyXG5cclxuXHRpZiB0ZXh0Lmxlbmd0aCA+IDBcclxuXHRcdHRleHQgKz0gd2luZG93LmxwYWQgdmFsdWUsIDJcclxuXHRlbHNlIFxyXG5cdFx0dGV4dCArPSB2YWx1ZVxyXG5cclxuXHR0ZXh0ICsgZm9ybWF0XHJcblxyXG5cclxud2luZG93LnRpbWVGb3JtYXQgb3I9ICh2YWx1ZSkgLT5cclxuXHRcclxuXHR0ZXh0ID0gJydcclxuXHRkYXRlID0gbmV3IERhdGUodmFsdWUgKiAxMDAwKVxyXG5cdGQgPSBkYXRlLmdldFVUQ0RhdGUoKSAtIDFcclxuXHRoID0gZGF0ZS5nZXRVVENIb3VycygpXHJcblx0bSA9IGRhdGUuZ2V0VVRDTWludXRlcygpXHJcblx0cyA9IGRhdGUuZ2V0VVRDU2Vjb25kcygpXHJcblxyXG5cclxuXHR0ZXh0ICs9IGQgKyBmb3JtYXQudGltZS5kYXkgaWYgZCA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBoLCBmb3JtYXQudGltZS5ob3VyKSBpZiBoID4gMFxyXG5cdHRleHQgPSB0aW1lRm9ybWF0KHRleHQsIG0sIGZvcm1hdC50aW1lLm1pbnV0ZSkgaWYgaCA+IDAgb3IgbSA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBzLCBmb3JtYXQudGltZS5zZWNvbmQpIGlmIGggPiAwIG9yIG0gPiAwIG9yIHMgPiAwXHJcblxyXG5cdHRleHRcclxuXHJcbndpbmRvdy50aW1lRm9ybWF0U2hvcnQgb3I9ICh2YWx1ZSkgLT5cclxuXHJcblx0dGV4dCA9ICcnXHJcblx0ZGF0ZSA9IG5ldyBEYXRlKHZhbHVlICogMTAwMClcclxuXHRkID0gZGF0ZS5nZXRVVENEYXRlKCkgLSAxXHJcblx0aCA9IGRhdGUuZ2V0VVRDSG91cnMoKVxyXG5cdG0gPSBkYXRlLmdldFVUQ01pbnV0ZXMoKVxyXG5cdHMgPSBkYXRlLmdldFVUQ1NlY29uZHMoKVxyXG5cclxuXHJcblx0cmV0dXJuIGQgKyBmb3JtYXQudGltZS5kYXkgaWYgZCA+IDBcclxuXHRyZXR1cm4gdGltZUZvcm1hdCh0ZXh0LCBoLCBmb3JtYXQudGltZS5ob3VyKSBpZiBoID4gMFxyXG5cdHJldHVybiB0aW1lRm9ybWF0KHRleHQsIG0sIGZvcm1hdC50aW1lLm1pbnV0ZSkgaWYgbSA+IDBcclxuXHRyZXR1cm4gdGltZUZvcm1hdCh0ZXh0LCBzLCBmb3JtYXQudGltZS5zZWNvbmQpIGlmIHMgPiAwXHJcblxyXG5cclxuXHJcblxyXG5yZWZyZXNoaW5nID0gZmFsc2VcclxuXHJcblxyXG53aW5kb3cubG9jYXRpb24ucmVmcmVzaCBvcj0gLT5cclxuXHRpZiBub3QgcmVmcmVzaGluZ1xyXG5cdFx0cmVmcmVzaGluZyA9IHRydWVcclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSlcclxuXHJcblxyXG5cclxuXHJcbm5vdGlmaWNhdGlvbnMgPSBbXVxyXG53aW5kb3cubm90aWZ5IG9yPSAocHJvcHMpLT5cclxuXHRub3RpZmljYXRpb25zLnB1c2ggcHJvcHNcclxuXHJcblxyXG5jbG9uZSA9IChvYmopIC0+XHJcblx0cmV0dXJuIG9iaiAgaWYgb2JqIGlzIG51bGwgb3IgdHlwZW9mIChvYmopIGlzbnQgXCJvYmplY3RcIlxyXG5cdHRlbXAgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKClcclxuXHRmb3Iga2V5IG9mIG9ialxyXG5cdFx0dGVtcFtrZXldID0gY2xvbmUob2JqW2tleV0pXHJcblx0dGVtcFxyXG5cclxuc2hvd05vdGlmeSA9IChuLCBpKSAtPlxyXG5cdGNvbnNvbGUubG9nKCdQJywgbiwgaSk7XHJcblx0c2V0VGltZW91dCAoLT4gXHJcblx0XHRjb25zb2xlLmxvZygnUycsIG4sIGkpO1xyXG5cdFx0JC5ub3RpZnkobiwge1xyXG5cclxuXHRcdFx0cGxhY2VtZW50OiB7XHJcblxyXG5cdFx0XHRcdGZyb206ICdib3R0b20nLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtb3VzZV9vdmVyOiAncGF1c2UnLFxyXG5cclxuXHRcdFx0fSkpLCBpICogMTAwMFxyXG5cdFxyXG5cclxuXHJcblxyXG53aW5kb3cubm90aWZ5U2hvdyBvcj0gLT5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblxyXG5cdFx0Zm9yIG5vdGlmaWNhdGlvbiwgaW5kZXggaW4gbm90aWZpY2F0aW9uc1xyXG5cdFx0XHRzaG93Tm90aWZ5ICQuZXh0ZW5kKHt9LCBub3RpZmljYXRpb24pLCBpbmRleFxyXG5cdFx0bm90aWZpY2F0aW9ucyA9IFtdXHJcblxyXG5cclxuXHJcbiQod2luZG93KS5mb2N1cyAtPiB3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuTWF0aC5jbGFtcCBvcj0gKHZhbHVlLCBtaW4sIG1heCkgLT5cclxuXHRNYXRoLm1heChNYXRoLm1pbih2YWx1ZSwgbWF4KSwgbWluKVxyXG5cclxuXHJcbk1hdGgubGVycCBvcj0gKGksIGEsIGIpIC0+XHJcblx0KGEgKiBpKSArIChiICogKDEgLSBpKSlcclxuXHJcblxyXG5cclxuTWF0aC5oZXhUb1JnYiBvcj0gKGhleCkgLT4gXHJcbiAgICByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbiAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcclxuXHJcbiAgICB9IGlmIHJlc3VsdDtcclxuICAgIG51bGw7XHJcblxyXG5NYXRoLnJnYlRvSGV4IG9yPSAociwgZywgYikgLT5cclxuICAgIHJldHVybiBcIiNcIiArICgoMSA8PCAyNCkgKyAociA8PCAxNikgKyAoZyA8PCA4KSArIGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxuXHJcblxyXG5NYXRoLmxlcnBDb2xvcnMgb3I9IChpLCBhLCBiKSAtPlxyXG5cclxuXHRjYSA9IE1hdGguaGV4VG9SZ2IgYVxyXG5cdGNiID0gTWF0aC5oZXhUb1JnYiBiXHJcblxyXG5cdGNjID0ge1xyXG5cdFx0cjogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuciwgY2IucikpLFxyXG5cdFx0ZzogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuZywgY2IuZykpLFxyXG5cdFx0YjogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuYiwgY2IuYikpLFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE1hdGgucmdiVG9IZXgoY2MuciwgY2MuZywgY2MuYilcclxuXHJcblxyXG5cclxuXHJcblxyXG51cGRhdGVQcm9ncmVzcyA9IC0+XHJcblx0YmFyID0gJCh0aGlzKS5jaGlsZHJlbignLnByb2dyZXNzLWJhcicpXHJcblx0bGFiZWwgPSAkKHRoaXMpLmNoaWxkcmVuKCcucHJvZ3Jlc3MtbGFiZWwnKVxyXG5cclxuXHRtaW4gPSAkKGJhcikuZGF0YSgnbWluJylcclxuXHRtYXggPSAkKGJhcikuZGF0YSgnbWF4JylcclxuXHRjYSA9ICQoYmFyKS5kYXRhKCdjYScpXHJcblx0Y2IgPSAkKGJhcikuZGF0YSgnY2InKVxyXG5cdG5vdyA9IE1hdGguY2xhbXAoJChiYXIpLmRhdGEoJ25vdycpLCBtaW4sIG1heClcclxuXHRyZXZlcnNlZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JldmVyc2VkJykgPyBmYWxzZSlcclxuXHJcblx0cGVyY2VudCA9IChub3cgLSBtaW4pIC8gKG1heCAtIG1pbikgKiAxMDBcclxuXHRwZXJjZW50ID0gMTAwIC0gcGVyY2VudCBpZiByZXZlcnNlZFxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0JChiYXIpLmNzcygnd2lkdGgnLCBwZXJjZW50ICsgJyUnKVxyXG5cdCQoYmFyKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBNYXRoLmxlcnBDb2xvcnMocGVyY2VudCAvIDEwMCwgY2EsIGNiKSkgaWYgY2E/IGFuZCBjYj9cclxuXHJcblxyXG5cclxuXHQkKGxhYmVsKS50ZXh0KG5vdyArICcgLyAnICsgbWF4KVxyXG5cclxuJCAtPiBcclxuXHQkKCcucHJvZ3Jlc3MnKS5lYWNoIC0+XHJcblx0XHR0aGlzLnVwZGF0ZSBvcj0gdXBkYXRlUHJvZ3Jlc3NcclxuXHJcblxyXG5cclxucmVsTW91c2VDb29yZHMgPSBgZnVuY3Rpb24gKGV2ZW50KXtcclxuICAgIHZhciB0b3RhbE9mZnNldFggPSAwO1xyXG4gICAgdmFyIHRvdGFsT2Zmc2V0WSA9IDA7XHJcbiAgICB2YXIgY2FudmFzWCA9IDA7XHJcbiAgICB2YXIgY2FudmFzWSA9IDA7XHJcbiAgICB2YXIgY3VycmVudEVsZW1lbnQgPSB0aGlzO1xyXG5cclxuICAgIGRve1xyXG4gICAgICAgIHRvdGFsT2Zmc2V0WCArPSBjdXJyZW50RWxlbWVudC5vZmZzZXRMZWZ0IC0gY3VycmVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB0b3RhbE9mZnNldFkgKz0gY3VycmVudEVsZW1lbnQub2Zmc2V0VG9wIC0gY3VycmVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gICAgfVxyXG4gICAgd2hpbGUoY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5vZmZzZXRQYXJlbnQpXHJcblxyXG4gICAgY2FudmFzWCA9IGV2ZW50LnBhZ2VYIC0gdG90YWxPZmZzZXRYO1xyXG4gICAgY2FudmFzWSA9IGV2ZW50LnBhZ2VZIC0gdG90YWxPZmZzZXRZO1xyXG5cclxuICAgIHJldHVybiB7eDpjYW52YXNYLCB5OmNhbnZhc1l9XHJcbn1gXHJcblxyXG5IVE1MQ2FudmFzRWxlbWVudC5wcm90b3R5cGUucmVsTW91c2VDb29yZHMgPSByZWxNb3VzZUNvb3JkcztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4oLT5cclxuXHJcblx0b2xkU2hvdyA9ICQuZm4uc2hvd1xyXG5cclxuXHQjIyNcclxuXHJcblxyXG5cdCQuZm4uc2hvdyA9IChzcGVlZCwgb2xkQ2FsbGJhY2spIC0+XHJcblxyXG5cdFx0Y29uc29sZS5sb2coJ3Nob3cnLCB0aGlzKVxyXG5cclxuXHRcdG5ld0NhbGxiYWNrID0gLT5cclxuXHJcblx0XHRcdG9sZENhbGxiYWNrLmFwcGx5KHRoaXMpIGlmICQuaXNGdW5jdGlvbihvbGRDYWxsYmFjaylcclxuXHRcdFx0JCh0aGlzKS50cmlnZ2VyKCdhZnRlclNob3cnKVxyXG5cclxuXHRcdCQodGhpcykudHJpZ2dlcignYmVmb3JlU2hvdycpXHJcblxyXG5cdFx0ZGVlcCA9ICQodGhpcykuZmluZCgnW2RhdGEtZGVlcHNob3ddJylcclxuXHJcblx0XHRpZiBkZWVwLmxlbmd0aFxyXG5cdFx0XHRkZWVwLnNob3coKVxyXG5cclxuXHRcdG9sZFNob3cuYXBwbHkodGhpcywgW3NwZWVkLCBuZXdDYWxsYmFja10pXHJcblx0IyMjXHJcbikoKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblN0cmluZy5wcm90b3R5cGUuZXNjYXBlIG9yPSAtPlxyXG5cdHRoaXMucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCBcIlxcXFwkMVwiKVxyXG5cclxuXHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgb3I9IChzZWFyY2gsIHJlcGxhY2UpIC0+XHJcblx0dGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoc2VhcmNoLmVzY2FwZSgpLCAnZ2knKSwgcmVwbGFjZSlcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==