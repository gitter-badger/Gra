(function() {
  this.app = angular.module('game', []);

  this.app.controller('GameController', function($scope) {
    return $scope.round = function(value, precision) {
      var n, p;
      p = precision != null ? precision : 0;
      n = Math.pow(10, p);
      return Math.round(value * n) / n;
    };
  });

  this.app.controller('PlayerController', function($scope) {});

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
    } else {
      if (window.active) {
        $.ajax({
          url: url + '/notifications',
          dataType: 'json',
          method: 'GET',
          success: notify
        });
        $.ajax({
          url: url + '/messages',
          dataType: 'json',
          method: 'GET',
          success: message
        });
      }
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
    return $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
      success: loaded
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
  var refresh, refreshing, update;

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
      return update(timer, 1000);
    });
  };

  $(function() {
    return $('.progress-time').each(function() {
      return update(this);
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
    clicked = function() {
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
      var tutorial;
      tutorial = [];
      $(object).find('.tutorial-step').each(function() {
        var index, step;
        step = null;
        index = $(this).data('tutorial-index');
        if (index < data.stage) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdmF0YXIuY29mZmVlIiwiYmF0dGxlLmNvZmZlZSIsImNoYXQuY29mZmVlIiwiY2xvY2suY29mZmVlIiwiZGlhbG9nLmNvZmZlZSIsImVtb3RpY29uLmNvZmZlZSIsImVxdWFsaXplci5jb2ZmZWUiLCJmb3JtLmNvZmZlZSIsImllZml4LmNvZmZlZSIsImltYWdlUHJldmlldy5jb2ZmZWUiLCJsYW5ndWFnZS5jb2ZmZWUiLCJuYXZmaXguY29mZmVlIiwicGxhbnRhdGlvbi5jb2ZmZWUiLCJwbGF5ZXIuY29mZmVlIiwic3F1YXJlLmNvZmZlZSIsInN0YXRpc3RpY3MuY29mZmVlIiwidGltZXIuY29mZmVlIiwidG9vbHRpcC5jb2ZmZWUiLCJ0dXRvcmlhbC5jb2ZmZWUiLCJ1dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7RUFBQSxJQUFDLENBQUEsR0FBRCxHQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUF1QixFQUF2Qjs7RUFJUCxJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFNBQUMsTUFBRDtXQUdqQyxNQUFNLENBQUMsS0FBUCxHQUFlLFNBQUMsS0FBRCxFQUFRLFNBQVI7QUFFZCxVQUFBO01BQUEsQ0FBQSx1QkFBSSxZQUFZO01BQ2hCLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsRUFBYSxDQUFiO2FBRUosSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFBLEdBQVEsQ0FBbkIsQ0FBQSxHQUF3QjtJQUxWO0VBSGtCLENBQWxDOztFQWNBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixrQkFBaEIsRUFBb0MsU0FBQyxNQUFELEdBQUEsQ0FBcEM7QUFsQkE7OztBQ0pBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsU0FBQTtJQUNULENBQUEsQ0FBRSxTQUFGLENBQVksQ0FBQyxXQUFiLENBQXlCLFFBQXpCO0lBQ0EsQ0FBQSxDQUFFLFNB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TUFBQSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsR0FBUCxDQUFXLGtCQUFYLEVBQStCLElBQUksQ0FBQyxVQUFMLENBQWdCLE9BQUEsR0FBVSxHQUExQixFQUErQixFQUEvQixFQUFtQyxFQUFuQyxDQUEvQixFQUFBOztXQUlBLENBQUEsQ0FBRSxLQUFGLENBQVEsQ0FBQyxJQUFULENBQWMsR0FBQSxHQUFNLEtBQU4sR0FBYyxHQUE1QjtFQXZCZ0I7O0VBeUJqQixDQUFBLENBQUUsU0FBQTtXQUNELENBQUEsQ0FBRSxXQUFGLENBQWMsQ0FBQyxJQUFmLENBQW9CLFNBQUE7YUFDbkIsSUFBSSxDQUFDLFdBQUwsSUFBSSxDQUFDLFNBQVc7SUFERyxDQUFwQjtFQURDLENBQUY7O0VBTUEsY0FBQSxHQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CakIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLGNBQTVCLEdBQTZDOztFQVk3QyxDQUFDLFNBQUE7QUFFQSxRQUFBO1dBQUEsT0FBQSxHQUFVLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FBRWY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUpBLENBQUQsQ0FBQSxDQUFBOztXQWtDQSxNQUFNLENBQUMsVUFBUyxDQUFDLGdCQUFELENBQUMsU0FBVyxTQUFBO1dBQzNCLElBQUksQ0FBQyxPQUFMLENBQWEsNkJBQWIsRUFBNEMsTUFBNUM7RUFEMkI7O1dBSzVCLE1BQU0sQ0FBQyxVQUFTLENBQUMsb0JBQUQsQ0FBQyxhQUFlLFNBQUMsTUFBRCxFQUFTLE9BQVQ7V0FDL0IsSUFBSSxDQUFDLE9BQUwsQ0FBaUIsSUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUFQLEVBQXdCLElBQXhCLENBQWpCLEVBQWdELE9BQWhEO0VBRCtCO0FBbFNoQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuXHJcblxyXG5cclxuXHJcblxyXG5AYXBwID0gYW5ndWxhci5tb2R1bGUoJ2dhbWUnLCBbXSlcclxuXHJcblxyXG5cclxuQGFwcC5jb250cm9sbGVyKCdHYW1lQ29udHJvbGxlcicsICgkc2NvcGUpIC0+XHJcblxyXG5cclxuXHQkc2NvcGUucm91bmQgPSAodmFsdWUsIHByZWNpc2lvbikgLT5cclxuXHJcblx0XHRwID0gcHJlY2lzaW9uID8gMFxyXG5cdFx0biA9IE1hdGgucG93KDEwLCBwKVxyXG5cclxuXHRcdE1hdGgucm91bmQodmFsdWUgKiBuKSAvIG5cclxuXHJcbilcclxuXHJcblxyXG5cclxuQGFwcC5jb250cm9sbGVyKCdQbGF5ZXJDb250cm9sbGVyJywgKCRzY29wZSkgLT5cclxuXHJcblxyXG4pXHJcblxyXG4iLCJcclxuXHJcbmNsaWNrZWQgPSAtPlxyXG5cdCQoJy5hdmF0YXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHQkKCcjYXZhdGFyJykudmFsKCQodGhpcykuZGF0YSgnYXZhdGFyJykpXHJcblx0JCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJylcclxuXHJcblxyXG4kIC0+XHJcblx0JCgnLmF2YXRhcicpLmNsaWNrKGNsaWNrZWQpLmZpcnN0KCkudHJpZ2dlcignY2xpY2snKSIsImNvbmZpZyA9XHJcblx0Zm9udFNpemU6IDMwXHJcblx0YmFyRm9udFNpemU6IDIwXHJcblx0bmFtZUZvbnRTaXplOiAzMFxyXG5cdG1hcmdpbjogNVxyXG5cdGludGVydmFsOiAxMDAwIC8gNjBcclxuXHJcblxyXG5cclxuY2xhc3MgQ2hhcmFjdGVyXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHRlYW0sIGRhdGEpIC0+XHJcblxyXG5cdFx0aW1hZ2UgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0aW1hZ2Uuc3JjID0gZGF0YS5hdmF0YXJcclxuXHRcdGltYWdlLm9ubG9hZCA9ID0+XHJcblx0XHRcdEBhdmF0YXIgPSBpbWFnZVxyXG5cclxuXHJcblxyXG5cdFx0QHRlYW0gPSB0ZWFtXHJcblx0XHRAbmFtZSA9IGRhdGEubmFtZVxyXG5cdFx0QGlkID0gZGF0YS5pZFxyXG5cdFx0QGxldmVsID0gZGF0YS5sZXZlbFxyXG5cdFx0QGhlYWx0aCA9IGRhdGEuaGVhbHRoXHJcblx0XHRAbWF4SGVhbHRoID0gZGF0YS5tYXhIZWFsdGhcclxuXHJcblxyXG5cdGRyYXc6IChjb250ZXh0LCBzaXplKSAtPlxyXG5cdFx0aWYgQHRlYW0gPT0gJ3JlZCdcclxuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDIxNywgODMsIDc5LCAxKSdcclxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMC40KSdcclxuXHRcdGVsc2VcclxuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDUxLCAxMjIsIDE4MywgMSknXHJcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoNTEsIDEyMiwgMTgzLCAwLjQpJ1xyXG5cclxuXHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaXplLCBzaXplKVxyXG5cclxuXHRcdGlmIEBhdmF0YXI/XHJcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKEBhdmF0YXIsIGNvbmZpZy5tYXJnaW4sIGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcubWFyZ2luICogMiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyKVxyXG5cclxuXHRcdHRleHQgPSBAbmFtZSArICcgKCcgKyBAbGV2ZWwgKyAnKSdcclxuXHJcblx0XHRjb250ZXh0LmZvbnQgPSBjb25maWcubmFtZUZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdGNvbnRleHQubGluZVdpZHRoID0gMVxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcclxuXHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdG1lYXN1cmUgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBjb25maWcubmFtZUZvbnRTaXplKVxyXG5cdFx0Y29udGV4dC5zdHJva2VUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBjb25maWcubmFtZUZvbnRTaXplKVxyXG5cclxuXHJcblx0XHRjb250ZXh0LmZvbnQgPSBjb25maWcuYmFyRm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNCknXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIsIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyLCBjb25maWcuYmFyRm9udFNpemUpXHJcblxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMSknXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCAoc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyKSAqIChAaGVhbHRoIC8gQG1heEhlYWx0aCksIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHJcblx0XHR0ZXh0ID0gTWF0aC5yb3VuZChAaGVhbHRoKSArICcgLyAnICsgQG1heEhlYWx0aFxyXG5cdFx0bWVhc3VyZSA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC8gMilcclxuXHJcblxyXG5cclxuXHJcblxyXG5jbGFzcyBCYXR0bGVcclxuXHJcblx0c3BlZWQ6IFxyXG5cdFx0dmlldzogMy4wXHJcblx0XHRpbmZvOiAzLjBcclxuXHRcdG5leHQ6IDMuMFxyXG5cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0QGNhbnZhcyA9ICQoZWxlbWVudCkuY2hpbGRyZW4oJ2NhbnZhcycpWzBdXHJcblx0XHRAY29udGV4dCA9IEBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cclxuXHRcdEBiYXR0bGVMb2cgPSAkLnBhcnNlSlNPTigkKGVsZW1lbnQpLmNoaWxkcmVuKCcuYmF0dGxlLWxvZycpLmZpcnN0KCkudGV4dCgpKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdGxvYWQ6IC0+XHJcblxyXG5cdFx0QGluZGV4ID0gMFxyXG5cdFx0QGNoYXJhY3RlcnMgPSBbXVxyXG5cdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRAb2Zmc2V0ID0gMFxyXG5cdFx0QHBhdXNlID0gZmFsc2VcclxuXHJcblx0XHQkKEBjYW52YXMpLmNsaWNrKChldmVudCkgPT4gQGNsaWNrKGV2ZW50KSlcclxuXHRcdCQoZG9jdW1lbnQpLmtleWRvd24oKGV2ZW50KSA9PiBAa2V5KGV2ZW50KSlcclxuXHJcblx0XHRmb3IgZGF0YSBpbiBAYmF0dGxlTG9nWyd0ZWFtcyddWydyZWQnXVxyXG5cdFx0XHRjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdyZWQnLCBkYXRhKVxyXG5cdFx0XHRAY2hhcmFjdGVyc1tjaGFyYWN0ZXIuaWRdID0gY2hhcmFjdGVyXHJcblxyXG5cclxuXHRcdGZvciBkYXRhIGluIEBiYXR0bGVMb2dbJ3RlYW1zJ11bJ2JsdWUnXVxyXG5cdFx0XHRjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdibHVlJywgZGF0YSlcclxuXHRcdFx0QGNoYXJhY3RlcnNbY2hhcmFjdGVyLmlkXSA9IGNoYXJhY3RlclxyXG5cclxuXHRcdEBjb250ZXh0LmZvbnQgPSBjb25maWcuZm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cclxuXHJcblx0XHRAYWN0aW9uID0gQGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0QGF0dGFja2VyID0gQGNoYXJhY3RlcnNbQGFjdGlvbi5hdHRhY2tlcl1cclxuXHRcdEBkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW0BhY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0dHJ1ZVxyXG5cclxuXHJcblxyXG5cclxuXHRkcmF3Q2hhcmFjdGVyczogKGF0dGFja2VyLCBkZWZlbmRlcikgLT5cclxuXHJcblx0XHRzaXplID0gQGNhbnZhcy5oZWlnaHQgKiAwLjZcclxuXHRcdGhhbGZXaWR0aCA9IEBjYW52YXMud2lkdGggLyAyXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoKGhhbGZXaWR0aCAtIHNpemUpIC8gMiwgKEBjYW52YXMuaGVpZ2h0IC0gc2l6ZSkgLyAyKVxyXG5cdFx0YXR0YWNrZXIuZHJhdyhAY29udGV4dCwgc2l6ZSlcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKChoYWxmV2lkdGggLSBzaXplKSAvIDIgKyBoYWxmV2lkdGgsIChAY2FudmFzLmhlaWdodCAtIHNpemUpIC8gMilcclxuXHRcdGRlZmVuZGVyLmRyYXcoQGNvbnRleHQsIHNpemUpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdGRyYXdJbmZvOiAodGV4dCkgLT5cclxuXHRcdGhhbGZXaWR0aCA9IEBjYW52YXMud2lkdGggLyAyXHJcblx0XHRoYWxmSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgLyAyXHJcblx0XHRibG9ja1NpemUgPSBAY2FudmFzLmhlaWdodCAqIDAuNlxyXG5cclxuXHRcdHN0YXJSYWRpdXMgPSA1MFxyXG5cdFx0c3RhcldpZHRoID0gc3RhclJhZGl1cyAqIDJcclxuXHRcdHN0YXJYID0gaGFsZldpZHRoICsgKGJsb2NrU2l6ZSArIHN0YXJSYWRpdXMpIC8gMlxyXG5cdFx0c3RhclkgPSBoYWxmSGVpZ2h0XHJcblx0XHRzdGFyVyA9IChibG9ja1NpemUgKiAwLjcpIC8gc3RhcldpZHRoXHJcblx0XHRzdGFySCA9IDEuMlxyXG5cdFx0c3RhclBpa2VzID0gMTNcclxuXHJcblx0XHRAY29udGV4dC5mb250ID0gY29uZmlnLmZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdG1lYXN1cmUgPSBAY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0dGV4dFggPSBzdGFyWCAtIG1lYXN1cmUud2lkdGggLyAyXHJcblx0XHR0ZXh0WSA9IGhhbGZIZWlnaHRcclxuXHJcblxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQubGluZVdpZHRoID0gMlxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKHN0YXJYLCBzdGFyWSlcclxuXHRcdEBjb250ZXh0LnNjYWxlKHN0YXJXLCBzdGFySClcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xyXG5cdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdEBkcmF3U3RhcihzdGFyUGlrZXMsIHN0YXJSYWRpdXMgKiAwLjYsIHN0YXJSYWRpdXMpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSh0ZXh0WCwgdGV4dFkpXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIDAsIDApXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdGRyYXdTdGFyOiAocGlrZXMsIGlubmVyUmFkaXVzLCBvdXRlclJhZGl1cykgLT5cclxuXHRcdHJvdCA9IE1hdGguUEkgLyAyICogM1xyXG5cdFx0c3RlcCA9IE1hdGguUEkgLyBwaWtlc1xyXG5cclxuXHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHR5ID0gTWF0aC5zaW4ocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRAY29udGV4dC5tb3ZlVG8oeCwgeSlcclxuXHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0Zm9yIGkgaW4gWzEuLnBpa2VzXVxyXG5cdFx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIGlubmVyUmFkaXVzXHJcblx0XHRcdHkgPSBNYXRoLnNpbihyb3QpICogaW5uZXJSYWRpdXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKHgsIHkpXHJcblx0XHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRcdHkgPSBNYXRoLnNpbihyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKHgsIHkpXHJcblx0XHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0QGNvbnRleHQubGluZVRvKDAsIC1vdXRlclJhZGl1cylcclxuXHRcdEBjb250ZXh0LmZpbGwoKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRcclxuXHJcblx0Z2V0RW5kVGV4dDogLT5cclxuXHJcblx0XHRpZiBAYmF0dGxlTG9nWyd3aW4nXVxyXG5cclxuXHRcdFx0aTE4bi5iYXR0bGUud2luXHJcblxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0aTE4bi5iYXR0bGUubG9zZVxyXG5cclxuXHJcblx0ZHJhdzogKGRlbHRhKS0+XHJcblxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRAY29udGV4dC5jbGVhclJlY3QoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQpXHJcblx0XHRAb2Zmc2V0ICs9IEBzcGVlZFtAc3RhdGVdICogZGVsdGFcclxuXHRcdGFuaW1hdGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICd2aWV3JyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHRhY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdGF0dGFja2VyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHRcdGlmKGFjdGlvbi50eXBlID09ICdoaXQnKVxyXG5cdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IGFjdGlvbi5oZWFsdGhcclxuXHJcblx0XHRcdEBkcmF3Q2hhcmFjdGVycyhhdHRhY2tlciwgZGVmZW5kZXIpXHJcblxyXG5cdFx0XHRpZihAb2Zmc2V0ID4gMS4wIGFuZCBub3QgQHBhdXNlKVxyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRkZWZlbmRlci5zdGFydEhlYWx0aCA9IGRlZmVuZGVyLmhlYWx0aFxyXG5cclxuXHRcdFx0XHRpZiBhY3Rpb24udHlwZSA9PSAnaGl0J1xyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuZW5kSGVhbHRoID0gTWF0aC5tYXgoZGVmZW5kZXIuaGVhbHRoIC0gYWN0aW9uLmRhbWFnZSwgMClcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRkZWZlbmRlci5lbmRIZWFsdGggPSBkZWZlbmRlci5oZWFsdGhcclxuXHJcblx0XHRcdFx0QHN0YXRlID0gJ2luZm8nXHJcblxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ2luZm8nIGFuZCBhbmltYXRlXHJcblx0XHRcdGFjdGlvbiA9IEBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0YXR0YWNrZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdGRlZmVuZGVyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKGF0dGFja2VyLCBkZWZlbmRlcilcclxuXHJcblx0XHRcdGlmIEBvZmZzZXQgPD0gMS4wXHJcblx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBAb2Zmc2V0XHJcblx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gZGVmZW5kZXIuc3RhcnRIZWFsdGhcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIEBvZmZzZXQgPD0gMi4wXHJcblx0XHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMFxyXG5cclxuXHRcdFx0XHRcdGkgPSBNYXRoLmNsYW1wKEBvZmZzZXQgLSAxLjAsIDAsIDEpXHJcblx0XHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBNYXRoLmxlcnAoaSwgZGVmZW5kZXIuZW5kSGVhbHRoLCBkZWZlbmRlci5zdGFydEhlYWx0aClcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gZGVmZW5kZXIuZW5kSGVhbHRoXHJcblx0XHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IE1hdGgubWF4KDMuMCAtIEBvZmZzZXQsIDApXHJcblxyXG5cdFx0XHRpZihAb2Zmc2V0ID4gNC4wKVxyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRAc3RhdGUgPSAnbmV4dCdcclxuXHJcblx0XHRcdGlmIGFjdGlvbi50eXBlID09ICdoaXQnXHJcblx0XHRcdFx0dGV4dCA9IGFjdGlvbi5kYW1hZ2VcclxuXHJcblx0XHRcdFx0aWYgYWN0aW9uLmNyaXRcclxuXHRcdFx0XHRcdHRleHQgKz0gJyEnXHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IGkxOG4uYmF0dGxlLmRvZGdlXHJcblxyXG5cclxuXHJcblx0XHRcdEBkcmF3SW5mbyh0ZXh0KVxyXG5cclxuXHJcblx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnbmV4dCcgYW5kIGFuaW1hdGVcclxuXHJcblx0XHRcdHByZXZBY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdG5leHRBY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXggKyAxXVxyXG5cclxuXHJcblx0XHRcdHByZXZBdHRhY2tlciA9IEBjaGFyYWN0ZXJzW3ByZXZBY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdHByZXZEZWZlbmRlciA9IEBjaGFyYWN0ZXJzW3ByZXZBY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cclxuXHRcdFx0cG9zaXRpb24gPSAoQGNhbnZhcy5oZWlnaHQgLyAyKSAqIEBvZmZzZXRcclxuXHJcblx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRAY29udGV4dC50cmFuc2xhdGUoMCwgLXBvc2l0aW9uKVxyXG5cdFx0XHRAZHJhd0NoYXJhY3RlcnMocHJldkF0dGFja2VyLCBwcmV2RGVmZW5kZXIpXHJcblx0XHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRAY29udGV4dC50cmFuc2xhdGUoMCwgQGNhbnZhcy5oZWlnaHQgLSBwb3NpdGlvbilcclxuXHJcblx0XHRcdGlmIG5leHRBY3Rpb24/XHJcblx0XHRcdFx0bmV4dEF0dGFja2VyID0gQGNoYXJhY3RlcnNbbmV4dEFjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0XHRuZXh0RGVmZW5kZXIgPSBAY2hhcmFjdGVyc1tuZXh0QWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0XHRpZihuZXh0QWN0aW9uLnR5cGUgPT0gJ2hpdCcpXHJcblx0XHRcdFx0XHRuZXh0RGVmZW5kZXIuaGVhbHRoID0gbmV4dEFjdGlvbi5oZWFsdGhcclxuXHJcblx0XHRcdFx0QGRyYXdDaGFyYWN0ZXJzKG5leHRBdHRhY2tlciwgbmV4dERlZmVuZGVyKVxyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSBAZ2V0RW5kVGV4dCgpXHJcblx0XHRcdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRcdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRcdFx0QGNvbnRleHQuZmlsbFRleHQodGV4dCwgKEBjYW52YXMud2lkdGggLSBtZWFzdXJlLndpZHRoKSAvIDIsIChAY2FudmFzLmhlaWdodCAtIDE1KSAvIDIpXHJcblxyXG5cdFx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblx0XHRcdGlmIEBvZmZzZXQgPiAyLjBcclxuXHRcdFx0XHRAaW5kZXgrK1xyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRpZiBuZXh0QWN0aW9uP1xyXG5cdFx0XHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0QHN0YXRlID0gJ2VuZCdcclxuXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ2VuZCcgYW5kIGFuaW1hdGVcclxuXHRcdFx0dGV4dCA9IEBnZXRFbmRUZXh0KClcclxuXHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIChAY2FudmFzLndpZHRoIC0gbWVhc3VyZS53aWR0aCkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSAxNSkgLyAyKVxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblxyXG5cclxuXHJcblx0XHR3aWR0aCA9IEBjYW52YXMud2lkdGggLSA0XHJcblx0XHRoZWlnaHQgPSBAY2FudmFzLmhlaWdodCAtIDJcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNCknXHJcblx0XHRAY29udGV4dC5maWxsUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGgsIDIwKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGgsIDIwKVxyXG5cclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjNUJDMERFJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFJlY3QoMiwgaGVpZ2h0IC0gMjAsIHdpZHRoICogKE1hdGgubWluKEBpbmRleCAvIChAYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKSwgMSkpLCAyMClcclxuXHRcdEBjb250ZXh0LmxpbmVXaWR0aCA9IDVcclxuXHJcblx0XHRmb3IgbWFyayBpbiBAYmF0dGxlTG9nWydtYXJrcyddXHJcblxyXG5cdFx0XHRpZiBtYXJrLnR5cGUgPT0gJ2ZhaW50ZWQnXHJcblx0XHRcdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0Q5NTM0RidcclxuXHJcblx0XHRcdGF0ID0gKG1hcmsuYXQgLyAoQGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSkpICogd2lkdGhcclxuXHJcblx0XHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblx0XHRcdEBjb250ZXh0Lm1vdmVUbyhhdCAtIEBjb250ZXh0LmxpbmVXaWR0aCAvIDIgKyAyLCBoZWlnaHQgLSAyMClcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKGF0IC0gQGNvbnRleHQubGluZVdpZHRoIC8gMiArIDIsIGhlaWdodClcclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cclxuXHJcblx0Y2xpY2s6IChldmVudCkgLT5cclxuXHRcdGNvb3JkcyA9IEBjYW52YXMucmVsTW91c2VDb29yZHMoZXZlbnQpXHJcblx0XHR4ID0gY29vcmRzLnhcclxuXHRcdHkgPSBjb29yZHMueVxyXG5cclxuXHRcdGwgPSAyXHJcblx0XHRyID0gbCArIEBjYW52YXMud2lkdGggLSA0XHJcblx0XHRiID0gQGNhbnZhcy5oZWlnaHQgLSAyXHJcblx0XHR0ID0gYiAtIDIwXHJcblxyXG5cclxuXHRcdGlmIHggPj0gbCBhbmQgeCA8PSByIGFuZCB5ID49IHQgYW5kIHkgPD0gYlxyXG5cdFx0XHRAaW5kZXggPSBNYXRoLnJvdW5kKCh4IC0gbCkgLyAociAtIGwpICogKEBiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpKVxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cclxuXHRrZXk6IChldmVudCkgLT5cclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAzMlxyXG5cdFx0XHRAcGF1c2UgPSAhQHBhdXNlXHJcblxyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDM3XHJcblx0XHRcdEBpbmRleCA9IE1hdGgubWF4KEBpbmRleCAtIDEsIDApXHJcblx0XHRcdEBvZmZzZXQgPSAxLjBcclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMzlcclxuXHRcdFx0QGluZGV4ID0gTWF0aC5taW4oQGluZGV4ICsgMSwgQGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSlcclxuXHRcdFx0QG9mZnNldCA9IDEuMFxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHJcblxyXG5cdHJlcXVlc3RGcmFtZTogKHRpbWUpIC0+XHJcblxyXG5cdFx0ZGVsdGEgPSBNYXRoLm1heCh0aW1lIC0gQGxhc3RUaW1lLCAwKVxyXG5cdFx0QGxhc3RUaW1lID0gdGltZVxyXG5cdFx0QGFjY3VtdWxhdG9yICs9IGRlbHRhXHJcblxyXG5cdFx0d2hpbGUgQGFjY3VtdWxhdG9yID49IGNvbmZpZy5pbnRlcnZhbFxyXG5cclxuXHRcdFx0QGFjY3VtdWxhdG9yIC09IGNvbmZpZy5pbnRlcnZhbFxyXG5cdFx0XHRAZHJhdyhjb25maWcuaW50ZXJ2YWwgLyAxMDAwKVxyXG5cclxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRpbWUpID0+IEByZXF1ZXN0RnJhbWUodGltZSkpXHJcblxyXG5cclxuXHRzdGFydDogLT5cclxuXHJcblx0XHRpZiBAbG9hZCgpXHJcblxyXG5cdFx0XHRAbGFzdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG5cdFx0XHRAYWNjdW11bGF0b3IgPSAwLjBcclxuXHRcdFx0QHJlcXVlc3RGcmFtZShAbGFzdFRpbWUpXHJcblxyXG5cclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdCQoJy5iYXR0bGUnKS5iaW5kKCdzaG93JywgLT5cclxuXHJcblx0XHRiYXR0bGUgPSBuZXcgQmF0dGxlKHRoaXMpXHJcblx0XHRiYXR0bGUuc3RhcnQoKVxyXG5cdFxyXG5cdCkuZmlsdGVyKCc6dmlzaWJsZScpLnRyaWdnZXIoJ3Nob3cnKVxyXG5cclxuKSIsIlxyXG5cclxuY2xhc3MgQENoYXRcclxuXHJcblx0ZGVmYXVsdHMgPSB7XHJcblxyXG5cdFx0bWVzc2FnZVVybDogbnVsbCxcclxuXHRcdHBsYXllclVybDogbnVsbCxcclxuXHRcdGVtb3RpY29uVXJsOiBudWxsLFxyXG5cdFx0aW50ZXJ2YWw6IDIsXHJcblx0XHRoaXN0b3J5OiAwLFxyXG5cdFx0bWluTGVuZ3RoOiAxLFxyXG5cdFx0bWF4TGVuZ3RoOiA1MTIsXHJcblx0XHRjb29sZG93bjogNjAsXHJcblx0XHRqb2luOiAxMjAsXHJcblxyXG5cdFx0YWxsb3dTZW5kOiB0cnVlLFxyXG5cdFx0YWxsb3dSZWNlaXZlOiB0cnVlLFxyXG5cdFx0c2VuZEV4dHJhOiB7fSxcclxuXHRcdHJlY2VpdmVFeHRyYToge30sXHJcblx0XHRzZW5kTWV0aG9kOiAnUE9TVCcsXHJcblx0XHRyZWNlaXZlTWV0aG9kOiAnR0VUJyxcclxuXHR9XHJcblxyXG5cdGNvbW1hbmRzID0ge1xyXG5cclxuXHRcdCdjbGVhcic6ICdjbGVhck91dHB1dCcsXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnQsIG9wdGlvbnMpIC0+XHJcblxyXG5cdFx0I2FsZXJ0KCd3ZWxjb21lJylcclxuXHJcblx0XHRvcHQgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpXHJcblxyXG5cdFx0QG1lc3NhZ2VVcmwgPSBvcHQubWVzc2FnZVVybFxyXG5cdFx0QHBsYXllclVybCA9IG9wdC5wbGF5ZXJVcmxcclxuXHRcdEBlbW90aWNvbnMgPSBuZXcgRW1vdGljb25zKClcclxuXHJcblxyXG5cdFx0QGFsbG93U2VuZCA9IG9wdC5hbGxvd1NlbmRcclxuXHRcdEBhbGxvd1JlY2VpdmUgPSBvcHQuYWxsb3dSZWNlaXZlXHJcblx0XHRAcmVjZWl2ZUV4dHJhID0gb3B0LnJlY2VpdmVFeHRyYVxyXG5cdFx0QHNlbmRFeHRyYSA9IG9wdC5zZW5kRXh0cmFcclxuXHRcdEByZWNlaXZlTWV0aG9kID0gb3B0LnJlY2VpdmVNZXRob2RcclxuXHRcdEBzZW5kTWV0aG9kID0gb3B0LnNlbmRNZXRob2RcclxuXHJcblxyXG5cclxuXHRcdEBpbnB1dCA9ICQoZWxlbWVudCkuZmluZCgnLmlucHV0JylcclxuXHRcdEBvdXRwdXQgPSAkKGVsZW1lbnQpLmZpbmQoJy5vdXRwdXQnKVxyXG5cdFx0QHNlbmRCdG4gPSAkKGVsZW1lbnQpLmZpbmQoJy5zZW5kJylcclxuXHRcdEBjbGVhckJ0biA9ICQoZWxlbWVudCkuZmluZCgnLmNsZWFyJylcclxuXHRcdEBlbW90aWNvbnNCdG4gPSAkKGVsZW1lbnQpLmZpbmQoJy5lbW90aWNvbnMnKVxyXG5cclxuXHJcblx0XHRAZW1vdGljb25zLnBvcG92ZXIoQGVtb3RpY29uc0J0biwgQGlucHV0KVxyXG5cclxuXHRcdEBvdXRwdXRbMF0uc2Nyb2xsVG9wID0gQG91dHB1dFswXS5zY3JvbGxIZWlnaHRcclxuXHJcblx0XHQkKEBpbnB1dCkua2V5ZG93bigoZXZlbnQpID0+IEBvbktleShldmVudCkpXHJcblxyXG5cclxuXHRcdCQoQHNlbmRCdG4pLmNsaWNrKCA9PlxyXG5cclxuXHRcdFx0QHNlbmQoKVxyXG5cdFx0XHRAY2xlYXJJbnB1dCgpXHJcblx0XHQpXHJcblxyXG5cdFx0JChAY2xlYXJCdG4pLmNsaWNrKCA9PlxyXG5cclxuXHRcdFx0QGNsZWFyT3V0cHV0KClcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRcdEBpbnRlcnZhbCA9IG9wdC5pbnRlcnZhbFxyXG5cclxuXHJcblx0XHRAam9pbiA9IG9wdC5qb2luXHJcblxyXG5cdFx0QGNvb2xkb3duID0gb3B0LmNvb2xkb3duXHJcblx0XHRAc2VudCA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApIC0gQGNvb2xkb3duXHJcblxyXG5cdFx0QHRvdWNoKClcclxuXHRcdEB0aW1lID0gTWF0aC5tYXgoQHRpbWUgLSBvcHQuaGlzdG9yeSwgMClcclxuXHJcblxyXG5cdFx0QHJlY2VpdmUoKVxyXG5cdFx0XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Z2V0RXJyb3JUZXh0OiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHR0ZXh0ID0gaTE4bi5jaGF0LmVycm9yc1tuYW1lXSA/IGkxOG4uY2hhdC5lcnJvcnMudW5rbm93blxyXG5cclxuXHRcdGlmIGFyZ3M/IGFuZCB0eXBlb2YoYXJncykgPT0gJ29iamVjdCdcclxuXHJcblx0XHRcdGZvciBrLCB2IG9mIGFyZ3NcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCc6JyArIGssIHYpXHJcblxyXG5cdFx0dGV4dFxyXG5cclxuXHJcblxyXG5cdGVycm9yOiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHRhbGVydCA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdhbGVydCcpXHJcblx0XHRcdC5hZGRDbGFzcygnYWxlcnQtZGFuZ2VyJylcclxuXHRcdFx0LnRleHQoQGdldEVycm9yVGV4dChuYW1lLCBhcmdzKSlcclxuXHJcblx0XHQkKEBvdXRwdXQpXHJcblx0XHRcdC5hcHBlbmQoYWxlcnQpXHJcblxyXG5cdGFsZXJ0OiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHRhbGVydChAZ2V0RXJyb3JUZXh0KG5hbWUsIGFyZ3MpKVxyXG5cclxuXHJcblxyXG5cclxuXHR0b3VjaDogLT5cclxuXHRcdEB0aW1lID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHJcblxyXG5cdHNlbmQ6IC0+XHJcblxyXG5cdFx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHRcdG1lc3NhZ2UgPSAkKEBpbnB1dCkudmFsKClcclxuXHJcblx0XHRtYXRjaGVzID0gbWVzc2FnZS5tYXRjaCgvXlxcLyhcXHcrKS9pKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgbWF0Y2hlcz8gYW5kIG1hdGNoZXNbMV0/XHJcblx0XHRcdGNvbW1hbmQgPSBtYXRjaGVzWzFdXHJcblxyXG5cdFx0XHRmb3IgaywgdiBvZiBjb21tYW5kc1xyXG5cclxuXHRcdFx0XHRpZiBjb21tYW5kLnRvTG93ZXJDYXNlKCkgPT0gay50b0xvd2VyQ2FzZSgpXHJcblxyXG5cdFx0XHRcdFx0ZnVuYyA9IHRoaXNbdl1cclxuXHJcblx0XHRcdFx0XHRpZiB0eXBlb2YoZnVuYykgPT0gJ2Z1bmN0aW9uJ1xyXG5cdFx0XHRcdFx0XHRmdW5jLmNhbGwodGhpcylcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRAZXJyb3IoJ2NtZE5vdEZvdW5kJywgeyduYW1lJzogY29tbWFuZH0pXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHJcblx0XHRpZiBAYWxsb3dTZW5kXHJcblxyXG5cdFx0XHRpZiBtZXNzYWdlLmxlbmd0aCA8IEBtaW5MZW5ndGhcclxuXHRcdFx0XHRAYWxlcnQoJ3Rvb1Nob3J0JywgeydtaW4nOiBAbWluTGVuZ3RofSlcclxuXHRcdFx0XHRyZXR1cm4gXHJcblxyXG5cdFx0XHRpZiBtZXNzYWdlLmxlbmd0aCA+IEBtYXhMZW5ndGhcclxuXHRcdFx0XHRhbGVydCgndG9vTG9uZycsIHsnbWF4JzogQG1heExlbmd0aH0pXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRpZiBAc2VudCArIEBjb29sZG93biA+IG5vd1xyXG5cdFx0XHRcdEBhbGVydCgnY29vbGRvd24nKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHJcblx0XHRcdGRhdGEgPSAkLmV4dGVuZCh7fSwgQHNlbmRFeHRyYSwge21lc3NhZ2U6ICQoQGlucHV0KS52YWwoKX0pXHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0XHR1cmw6IEBtZXNzYWdlVXJsLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PiBAb25TZW50KGRhdGEpLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRtZXRob2Q6IEBzZW5kTWV0aG9kLFx0XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRAc2VudCA9IG5vd1xyXG5cdFx0XHQkKEBzZW5kQnRuKS5kYXRhKCd0aW1lJywgQHNlbnQgKyBAY29vbGRvd24pXHJcblxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0QGVycm9yKCdjYW5ub3RTZW5kJylcclxuXHJcblxyXG5cdHJlY2VpdmU6IC0+XHJcblxyXG5cdFx0aWYgQGFsbG93UmVjZWl2ZVxyXG5cclxuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKHt9LCBAcmVjZWl2ZUV4dHJhLCB7dGltZTogQHRpbWV9KVxyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiBAbWVzc2FnZVVybCxcclxuXHRcdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0XHRcdGNvbXBsZXRlOiA9PiBAb25Db21wbGV0ZSgpLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PiBAb25SZWNlaXZlZChkYXRhKSxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdG1ldGhvZDogQHJlY2VpdmVNZXRob2QsXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRAdG91Y2goKVxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0QGVycm9yKCdjYW5ub3RSZWNlaXZlJylcclxuXHJcblxyXG5cclxuXHRjbGVhck91dHB1dDogLT5cclxuXHJcblx0XHQkKEBvdXRwdXQpLmVtcHR5KClcclxuXHJcblxyXG5cdGNsZWFySW5wdXQ6IC0+XHJcblxyXG5cdFx0JChAaW5wdXQpLnZhbCgnJylcclxuXHJcblxyXG5cclxuXHRnZXRNZXNzYWdlOiAoZGF0YSkgLT5cclxuXHRcdCQoJzxwPjwvcD4nKVxyXG5cdFx0XHQuaHRtbChAZW1vdGljb25zLmluc2VydChkYXRhLm1lc3NhZ2UpKVxyXG5cdFx0XHQuYXBwZW5kKFxyXG5cclxuXHRcdFx0XHQkKCc8c21hbGw+PC9zbWFsbD4nKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LXRpbWUnKVxyXG5cdFx0XHRcdFx0LmRhdGEoJ3RpbWUnLCBkYXRhLnRpbWUpXHJcblx0XHRcdClcclxuXHJcblxyXG5cclxuXHRuZXdNZXNzYWdlOiAoZGF0YSkgLT5cclxuXHJcblx0XHRyb3cgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygncm93JylcclxuXHRcdFx0LmFkZENsYXNzKCdjaGF0LW1lc3NhZ2UnKVxyXG5cdFx0XHQuZGF0YSgndGltZScsIGRhdGEudGltZSlcclxuXHRcdFx0LmRhdGEoJ2F1dGhvcicsIGRhdGEuYXV0aG9yKVxyXG5cclxuXHRcdGNvbDEgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnY29sLXhzLTEnKVxyXG5cclxuXHRcdGNvbDIgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnY29sLXhzLTExJylcclxuXHJcblx0XHRpZiBAcGxheWVyVXJsP1xyXG5cclxuXHRcdFx0ZGl2MSA9ICQoJzxhPjwvYT4nKVxyXG5cdFx0XHRcdC5hdHRyKCdocmVmJywgQGdldFBsYXllclVybChkYXRhLmF1dGhvcikpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LWF1dGhvcicpXHJcblx0XHRlbHNlXHJcblx0XHRcclxuXHRcdFx0ZGl2MSA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtYXV0aG9yJylcclxuXHJcblxyXG5cclxuXHRcdGRpdjIgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnY2hhdC1jb250ZW50JylcclxuXHJcblxyXG5cclxuXHJcblx0XHRhdmF0YXIgPSAkKCc8aW1nPjwvaW1nPicpXHJcblx0XHRcdC5hZGRDbGFzcygnaW1nLXJlc3BvbnNpdmUnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtYXZhdGFyJylcclxuXHRcdFx0LmF0dHIoJ3NyYycsIGRhdGEuYXZhdGFyKVxyXG5cclxuXHJcblx0XHRhdXRob3IgPSAkKCc8cD48L3A+JykuYXBwZW5kKFxyXG5cclxuXHRcdFx0JCgnPHN0cm9uZz48L3N0cm9uZz4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY2hhdC1uYW1lJylcclxuXHRcdFx0XHQudGV4dChkYXRhLmF1dGhvciksXHJcblx0XHQpXHJcblxyXG5cdFx0bWVzc2FnZSA9IEBnZXRNZXNzYWdlKGRhdGEpXHJcblxyXG5cclxuXHJcblx0XHQkKGRpdjEpLmFwcGVuZChhdmF0YXIpLmFwcGVuZChhdXRob3IpXHJcblx0XHQkKGRpdjIpLmFwcGVuZChtZXNzYWdlKVxyXG5cdFx0JChjb2wxKS5hcHBlbmQoZGl2MSlcclxuXHRcdCQoY29sMikuYXBwZW5kKGRpdjIpXHJcblx0XHQkKHJvdykuYXBwZW5kKGNvbDEpLmFwcGVuZChjb2wyKVxyXG5cdFx0JChAb3V0cHV0KS5hcHBlbmQocm93KVxyXG5cclxuXHJcblx0bW9kaWZ5TWVzc2FnZTogKG1lc3NhZ2UsIGRhdGEpIC0+XHJcblxyXG5cdFx0JChtZXNzYWdlKS5maW5kKCcuY2hhdC1jb250ZW50JykuYXBwZW5kKFxyXG5cclxuXHRcdFx0QGdldE1lc3NhZ2UoZGF0YSlcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRhZGRNZXNzYWdlOiAoZGF0YSktPlxyXG5cclxuXHJcblx0XHRzY3JvbGwgPSAoQG91dHB1dFswXS5zY3JvbGxIZWlnaHQgLSBAb3V0cHV0WzBdLnNjcm9sbFRvcCAtIEBvdXRwdXRbMF0uY2xpZW50SGVpZ2h0KSA8PSAxXHJcblx0XHRtZXNzYWdlID0gJChAb3V0cHV0KS5jaGlsZHJlbigpLmxhc3QoKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgbWVzc2FnZS5sZW5ndGggPT0gMCBvciAhJChtZXNzYWdlKS5pcygnLmNoYXQtbWVzc2FnZScpXHJcblx0XHRcdFxyXG5cdFx0XHRAbmV3TWVzc2FnZShkYXRhKVxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0dGltZSA9ICQobWVzc2FnZSkuZGF0YSgndGltZScpXHJcblx0XHRcdGF1dGhvciA9ICQobWVzc2FnZSkuZGF0YSgnYXV0aG9yJylcclxuXHJcblx0XHRcdGlmIGF1dGhvciA9PSBkYXRhLmF1dGhvciBhbmQgKGRhdGEudGltZSAtIHRpbWUpIDw9IEBqb2luXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0QG1vZGlmeU1lc3NhZ2UobWVzc2FnZSwgZGF0YSlcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRAbmV3TWVzc2FnZShkYXRhKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgc2Nyb2xsXHJcblx0XHRcdEBvdXRwdXRbMF0uc2Nyb2xsVG9wID0gQG91dHB1dFswXS5zY3JvbGxIZWlnaHQgLSAxXHJcblxyXG5cclxuXHJcblxyXG5cdG9uU2VudDogKGRhdGEpIC0+XHJcblxyXG5cdFx0QGVycm9yKGRhdGEucmVhc29uLCBkYXRhLmFyZ3MpIGlmIGRhdGEuc3RhdHVzID09ICdlcnJvcidcclxuXHJcblxyXG5cdG9uUmVjZWl2ZWQ6IChkYXRhKSAtPlxyXG5cclxuXHRcdGZvciBtZXNzYWdlIGluIGRhdGFcclxuXHRcdFx0QGFkZE1lc3NhZ2UobWVzc2FnZSlcclxuXHJcblx0b25Db21wbGV0ZTogLT5cclxuXHJcblx0XHRzZXRUaW1lb3V0KD0+XHJcblxyXG5cdFx0XHRAcmVjZWl2ZSgpXHJcblx0XHQsIEBpbnRlcnZhbCAqIDEwMDApXHJcblxyXG5cclxuXHRvbktleTogKGV2ZW50KSAtPlxyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDEzXHJcblx0XHRcdEBzZW5kKClcclxuXHRcdFx0QGNsZWFySW5wdXQoKVxyXG5cclxuXHJcblxyXG5cclxuXHRnZXRQbGF5ZXJVcmw6IChuYW1lKSAtPlxyXG5cclxuXHRcdHJldHVybiBAcGxheWVyVXJsLnJlcGxhY2UoJ3tuYW1lfScsIG5hbWUpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuJCgtPlxyXG5cclxuXHR1cGRhdGUgPSAoKSAtPlxyXG5cclxuXHRcdG5vdyA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApXHJcblxyXG5cdFx0JCgnLmNoYXQgLmNoYXQtdGltZScpLmVhY2goLT5cclxuXHJcblx0XHRcdHRpbWUgPSBwYXJzZUludCgkKHRoaXMpLmRhdGEoJ3RpbWUnKSlcclxuXHRcdFx0aW50ZXJ2YWwgPSBub3cgLSB0aW1lXHJcblxyXG5cclxuXHJcblx0XHRcdGlmIGludGVydmFsIDwgNjBcclxuXHJcblx0XHRcdFx0dGV4dCA9IGkxOG4uY2hhdC5mZXdTZWNzXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0dGV4dCA9IHdpbmRvdy50aW1lRm9ybWF0U2hvcnQoaW50ZXJ2YWwpXHJcblxyXG5cdFx0XHQkKHRoaXMpLnRleHQodGV4dCArICcgJyArIGkxOG4uY2hhdC5hZ28pXHJcblx0XHQpXHJcblxyXG5cdFx0JCgnLmNoYXQgLnNlbmQnKS5lYWNoKC0+XHJcblxyXG5cdFx0XHRpZiAkKHRoaXMpLmRhdGEoJ2Rpc2FibGVkJykgIT0gJ3RydWUnXHJcblxyXG5cdFx0XHRcdHRpbWUgPSBwYXJzZUludCgkKHRoaXMpLmRhdGEoJ3RpbWUnKSlcclxuXHRcdFx0XHR0ZXh0ID0gJCh0aGlzKS5kYXRhKCd0ZXh0JylcclxuXHRcdFx0XHRpbnRlcnZhbCA9IHRpbWUgLSBub3dcclxuXHJcblxyXG5cdFx0XHRcdGlmIGludGVydmFsID4gMFxyXG5cclxuXHRcdFx0XHRcdCQodGhpcylcclxuXHRcdFx0XHRcdFx0LnRleHQod2luZG93LnRpbWVGb3JtYXQoaW50ZXJ2YWwpKVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcclxuXHRcdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQudGV4dCh0ZXh0KVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcclxuXHJcblx0XHQpXHJcblxyXG5cclxuXHRcdHNldFRpbWVvdXQodXBkYXRlLCAxMDAwKVxyXG5cclxuXHR1cGRhdGUoKVxyXG4pIiwiXHJcblxyXG51cGRhdGUgPSAoKSAtPlxyXG5cclxuXHRkYXRlID0gbmV3IERhdGUoKVxyXG5cdG5vdyA9IE1hdGgucm91bmQoZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdCQoJy5jdXJyZW50LXRpbWUnKS50ZXh0KGRhdGUudG9VVENTdHJpbmcoKSlcclxuXHJcblx0JCgnLnRpbWUtbGVmdCcpLmVhY2goLT5cclxuXHJcblx0XHR0byA9ICQodGhpcykuZGF0YSgndG8nKVxyXG5cdFx0JCh0aGlzKS50ZXh0KHdpbmRvdy50aW1lRm9ybWF0KE1hdGgubWF4KHRvIC0gbm93LCAwKSkpXHJcblx0KVxyXG5cclxuXHJcblx0c2V0VGltZW91dCh1cGRhdGUsIDEwMDApXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHR1cGRhdGUoKSIsIlxyXG5cclxuZGlhbG9ncyA9IFtdXHJcblxyXG5cclxuc2hvdyA9IChkaWFsb2cpIC0+XHJcblxyXG5cdGRpc21pc3NpYmxlID0gKCQoZGlhbG9nKS5kYXRhKCdkaXNtaXNzaWJsZScpKSA/IHRydWVcclxuXHJcblxyXG5cclxuXHQkKGRpYWxvZykuYmluZCgnc2hvd24uYnMubW9kYWwnLCAoZXZlbnQpIC0+XHJcblxyXG5cdFx0JCh0aGlzKS5maW5kKCcuYmF0dGxlJykudHJpZ2dlcignc2hvdycpXHJcblx0KVxyXG5cclxuXHJcblx0aWYgZGlzbWlzc2libGVcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiB0cnVlLCBzaG93OiB0cnVlLCBrZXlib2FyZDogdHJ1ZX0pXHJcblxyXG5cdGVsc2VcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywgc2hvdzogdHJ1ZSwga2V5Ym9hcmQ6IGZhbHNlfSlcclxuXHJcblxyXG4kIC0+XHJcblx0ZGlhbG9ncyA9ICQoJy5tb2RhbC5hdXRvc2hvdycpXHJcblxyXG5cclxuXHQkKGRpYWxvZ3MpLmVhY2goKGluZGV4KSAtPlxyXG5cclxuXHRcdGlmIGluZGV4ID09IDBcclxuXHRcdFx0c2hvdyh0aGlzKVxyXG5cclxuXHRcdGlmIGluZGV4IDwgKGRpYWxvZ3MubGVuZ3RoIC0gMSlcclxuXHRcdFx0JCh0aGlzKS5vbignaGlkZGVuLmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cclxuXHRcdFx0XHRzaG93KGRpYWxvZ3NbaW5kZXggKyAxXSlcclxuXHRcdFx0KVxyXG5cdCkiLCJcclxuXHJcblxyXG5jbGFzcyBARW1vdGljb25zXHJcblxyXG5cdGRlZmF1bHRzID0ge1xyXG5cclxuXHRcdGVtb3RpY29uczoge1xyXG5cclxuXHRcdFx0JzspJzogJ2JsaW5rLnBuZycsXHJcblx0XHRcdCc6RCc6ICdncmluLnBuZycsXHJcblx0XHRcdCc6KCc6ICdzYWQucG5nJyxcclxuXHRcdFx0JzopJzogJ3NtaWxlLnBuZycsXHJcblx0XHRcdCdCKSc6ICdzdW5nbGFzc2VzLnBuZycsXHJcblx0XHRcdCdPLm8nOiAnc3VycHJpc2VkLnBuZycsXHJcblx0XHRcdCc6cCc6ICd0b25ndWUucG5nJywgXHJcblx0XHR9LFxyXG5cclxuXHRcdHVybDogJy9pbWFnZXMvZW1vdGljb25zL3tuYW1lfScsXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAodXJsLCBlbW90aWNvbnMpIC0+XHJcblxyXG5cdFx0QHVybCA9IHVybCA/IGRlZmF1bHRzLnVybFxyXG5cdFx0QHNldCA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cy5lbW90aWNvbnMsIGVtb3RpY29ucyA/IHt9KVxyXG5cclxuXHJcblx0aW5zZXJ0OiAodGV4dCkgLT5cclxuXHJcblx0XHRmb3IgaywgdiBvZiBAc2V0XHJcblxyXG5cdFx0XHR1cmwgPSBAdXJsLnJlcGxhY2UoJ3tuYW1lfScsIHYpXHJcblx0XHRcdGVtb3RpY29uID0gJzxpbWcgY2xhc3M9XCJlbW90aWNvblwiIHNyYz1cIicgKyB1cmwgKyAnXCIgYWx0PVwiJyArIGsgKyAnXCIgdGl0bGU9XCInICsgayArICdcIi8+J1xyXG5cdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlQWxsKGssIGVtb3RpY29uKVxyXG5cclxuXHJcblx0XHR0ZXh0XHJcblxyXG5cdHBvcG92ZXI6IChidXR0b24sIG91dHB1dCkgLT5cclxuXHJcblx0XHQkKGJ1dHRvbikucG9wb3Zlcih7XHJcblxyXG5cdFx0XHRodG1sOiB0cnVlLFxyXG5cdFx0XHR0cmlnZ2VyOiAnY2xpY2snLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICd0b3AnLFxyXG5cdFx0XHR0aXRsZTogaTE4bi5lbW90aWNvbnMudGl0bGUsXHJcblx0XHRcdGNvbnRlbnQ6ID0+IEBnZXRQb3BvdmVyQ29udGVudChvdXRwdXQpLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50IGVtb3RpY29uLWNvbnRhaW5lclwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR9KVxyXG5cclxuXHRnZXRQb3BvdmVyQ29udGVudDogKG91dHB1dCkgLT5cclxuXHJcblx0XHRjb250YWluZXIgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblxyXG5cdFx0Zm9yIGssIHYgb2YgQHNldFxyXG5cdFx0XHR1cmwgPSBAdXJsLnJlcGxhY2UoJ3tuYW1lfScsIHYpXHJcblx0XHRcdGltZyA9ICQoJzxpbWc+PC9pbWc+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2Vtb3RpY29uJylcclxuXHRcdFx0XHQuYXR0cignc3JjJywgdXJsKVxyXG5cdFx0XHRcdC5hdHRyKCdhbHQnLCBrKVxyXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIGspXHJcblx0XHRcdFx0LmNsaWNrKC0+XHJcblxyXG5cdFx0XHRcdFx0JChvdXRwdXQpLnZhbCgkKG91dHB1dCkudmFsKCkgKyAkKHRoaXMpLmF0dHIoJ2FsdCcpKVxyXG5cdFx0XHRcdClcclxuXHJcblx0XHRcdCQoY29udGFpbmVyKS5hcHBlbmQoaW1nKVxyXG5cclxuXHRcdHJldHVybiBjb250YWluZXJcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuY291bnRlciA9IDBcclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdGVtb3RpY29ucyA9IG5ldyBFbW90aWNvbnMoKVxyXG5cclxuXHQkKCdbZGF0YS1lbW90aWNvbnM9dHJ1ZV0nKS5lYWNoKC0+XHJcblxyXG5cdFx0dGV4dCA9ICQodGhpcykudGV4dCgpXHJcblx0XHR0ZXh0ID0gZW1vdGljb25zLmluc2VydCh0ZXh0KVxyXG5cdFx0JCh0aGlzKS5odG1sKHRleHQpXHJcblx0KVxyXG4pIiwid2lkdGhzID1cclxuXHR4czogNzY4LFxyXG5cdHNtOiA5OTIsXHJcblx0bWQ6IDEyMDAsXHJcblxyXG5cclxuXHJcbmdldFByZWZpeCA9IC0+XHJcblx0d2lkdGggPSAkKHdpbmRvdykud2lkdGgoKVxyXG5cclxuXHRpZiB3aWR0aCA8IHdpZHRocy54c1xyXG5cdFx0Wyd4cyddXHJcblx0ZWxzZSBpZiB3aWR0aCA8IHdpZHRocy5zbVxyXG5cdFx0WydzbScsICd4cyddXHJcblx0ZWxzZSBpZiB3aWR0aCA8IHdpZHRocy5tZFxyXG5cdFx0WydtZCcsICdzbScsICd4cyddXHJcblx0ZWxzZVxyXG5cdFx0WydsZycsICdtZCcsICdzbScsICd4cyddXHJcblxyXG5cclxuZ2V0Q29sdW1ucyA9IChwcmVmaXgpIC0+XHJcblx0cmVzdWx0ID0gW11cclxuXHRmb3IgcCBpbiBwcmVmaXhcclxuXHRcdGZvciBpIGluIFsxLi4xMl1cclxuXHRcdFx0cmVzdWx0LnB1c2goXCJjb2wtI3twfS0je2l9XCIpXHJcblx0cmVzdWx0XHJcblxyXG5cclxuXHJcbmdldFNpemUgPSAob2JqZWN0LCBwcmVmaXgpIC0+XHJcblx0Zm9yIHAgaW4gcHJlZml4XHJcblx0XHRyZWdleHAgPSBuZXcgUmVnRXhwKFwiY29sLSN7cH0tKFxcXFxkKylcIilcclxuXHRcdHNpemUgPSAkKG9iamVjdCkuYXR0cignY2xhc3MnKS5tYXRjaChyZWdleHApP1sxXVxyXG5cdFx0cmV0dXJuIHBhcnNlSW50KHNpemUpIGlmIHNpemU/XHJcblx0cmV0dXJuIG51bGxcclxuXHJcblxyXG5cclxuXHJcbmVxdWFsaXplID0gLT5cclxuXHRwcmVmaXggPSBnZXRQcmVmaXgoKVxyXG5cdGNvbHVtbnMgPSBnZXRDb2x1bW5zKHByZWZpeClcclxuXHRzZWxlY3RvciA9ICcuJyArIGNvbHVtbnMuam9pbignLC4nKVxyXG5cdFxyXG5cdCNjb25zb2xlLmxvZygncHJlZml4OiAnLCBwcmVmaXgpXHJcblx0I2NvbnNvbGUubG9nKCdjb2x1bW5zOiAnLCBjb2x1bW5zKVxyXG5cdCNjb25zb2xlLmxvZygnc2VsZWN0b3I6ICcsIHNlbGVjdG9yKVxyXG5cclxuXHJcblx0JCgnLnJvdy5lcXVhbGl6ZScpLmVhY2ggLT5cclxuXHRcdCNjb25zb2xlLmxvZygnbmV3IHJvdycpXHJcblx0XHRoZWlnaHRzID0gW11cclxuXHRcdHJvdyA9IDBcclxuXHRcdHN1bSA9IDBcclxuXHJcblx0XHQkKHRoaXMpLmNoaWxkcmVuKHNlbGVjdG9yKS5lYWNoIC0+XHJcblx0XHRcdHNpemUgPSBnZXRTaXplKHRoaXMsIHByZWZpeClcclxuXHRcdFx0c3VtICs9IHNpemVcclxuXHJcblx0XHRcdCNjb25zb2xlLmxvZygnc2l6ZTogJywgc2l6ZSlcclxuXHRcdFx0I2NvbnNvbGUubG9nKCdzdW06ICcsIHN1bSlcclxuXHJcblx0XHRcdGlmIHN1bSA+IDEyXHJcblx0XHRcdFx0c3VtIC09IDEyXHJcblx0XHRcdFx0cm93KytcclxuXHRcdFx0XHQjY29uc29sZS5sb2coJ25leHQgcm93ICcsIHJvdywgc2l6ZSlcclxuXHJcblx0XHRcdGhlaWdodHNbcm93XSA/PSAwXHJcblx0XHRcdGhlaWdodHNbcm93XSA9IE1hdGgubWF4KGhlaWdodHNbcm93XSwgJCh0aGlzKS5oZWlnaHQoKSlcclxuXHRcdFx0I2NvbnNvbGUubG9nKCdoZWlnaHQgJywgaGVpZ2h0c1tyb3ddKVxyXG5cclxuXHRcdHJvdyA9IDBcclxuXHRcdHN1bSA9IDBcclxuXHRcdGNvbCA9IG51bGxcclxuXHJcblx0XHQkKHRoaXMpLmNoaWxkcmVuKHNlbGVjdG9yKS5lYWNoIC0+XHJcblx0XHRcdHN1bSArPSBnZXRTaXplKHRoaXMsIHByZWZpeClcclxuXHRcdFx0Y29sID89IHRoaXNcclxuXHJcblx0XHRcdGlmIHN1bSA+IDEyXHJcblx0XHRcdFx0c3VtIC09IDEyXHJcblx0XHRcdFx0cm93KytcclxuXHRcdFx0XHRjb2wgPSB0aGlzXHJcblxyXG5cdFx0XHQkKHRoaXMpLmhlaWdodChoZWlnaHRzW3Jvd10pXHJcblxyXG5cdFx0aHMgPSBNYXRoLnJvdW5kICgxMiAtIHN1bSkgLyAyXHJcblx0XHRpZiBjb2w/IGFuZCBocyA+IDBcclxuXHRcdFx0cCA9IHByZWZpeFswXVxyXG5cclxuXHRcdFx0Zm9yIGkgaW4gWzEuLjEyXVxyXG5cdFx0XHRcdCQoY29sKS5yZW1vdmVDbGFzcyhcImNvbC0je3B9LW9mZnNldC0je2l9XCIpXHJcblx0XHRcdCQoY29sKS5hZGRDbGFzcyhcImNvbC0je3B9LW9mZnNldC0je2hzfVwiKVxyXG5cclxuYWZ0ZXJMb2FkZWQgPSAtPlxyXG5cdCQoJ2ltZycpXHJcblx0XHQub24oJ2xvYWQnLCBlcXVhbGl6ZSlcclxuXHJcblxyXG4kIC0+XHJcblx0I2FmdGVyTG9hZGVkKClcclxuXHQjJCh3aW5kb3cpLm9uKCdyZXNpemVkJywgZXF1YWxpemUpXHJcblx0I2VxdWFsaXplKCkiLCJzcGVlZCA9IDFcclxuXHJcblxyXG5rZXlEb3duID0gKGV2ZW50KSAtPlxyXG5cdHNwZWVkID0gMTAgaWYgZXZlbnQud2hpY2ggPT0gMTdcclxuXHRzcGVlZCA9IDEwMCBpZiBldmVudC53aGljaCA9PSAxNlxyXG5cclxua2V5VXAgPSAoZXZlbnQpIC0+XHJcblx0c3BlZWQgPSAxIGlmIGV2ZW50LndoaWNoID09IDE3IG9yIGV2ZW50LndoaWNoID09IDE2XHJcblxyXG5cclxubW91c2VXaGVlbCA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygnbW91c2VXaGVlbCcpXHJcblx0bWluID0gcGFyc2VJbnQgKCQodGhpcykuYXR0cignbWluJykgPyAwKVxyXG5cdG1heCA9IHBhcnNlSW50ICgkKHRoaXMpLmF0dHIoJ21heCcpID8gMTAwKVxyXG5cdHN0ZXAgPSBwYXJzZUludCAoJCh0aGlzKS5hdHRyKCdzdGVwJykgPyAxKVxyXG5cclxuXHRjaGFuZ2UgPSBldmVudC5kZWx0YVkgKiBzdGVwICogc3BlZWRcclxuXHR2YWx1ZSA9IHBhcnNlSW50ICQodGhpcykudmFsKCkgPyAwXHJcblx0dmFsdWUgPSBNYXRoLmNsYW1wIHZhbHVlICsgY2hhbmdlLCBtaW4sIG1heFxyXG5cclxuXHQkKHRoaXMpXHJcblx0XHQudmFsIHZhbHVlXHJcblx0XHQudHJpZ2dlciAnY2hhbmdlJ1xyXG5cclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG5yYW5nZUNoYW5nZWQgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ3JhbmdlQ2hhbmdlZCcpXHJcblx0b3V0cHV0ID0gJCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLnJhbmdlLXZhbHVlJylcclxuXHRiZWZvcmUgPSAoJChvdXRwdXQpLmRhdGEgJ2JlZm9yZScpID8gJydcclxuXHRhZnRlciA9ICgkKG91dHB1dCkuZGF0YSAnYWZ0ZXInKSA/ICcnXHJcblx0dmFsdWUgPSAkKHRoaXMpLnZhbCgpID8gMFxyXG5cclxuXHQkKG91dHB1dCkudGV4dCBiZWZvcmUgKyB2YWx1ZSArIGFmdGVyXHJcblxyXG5cclxubnVtYmVyRGVjcmVhc2UgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ251bWJlckRlY3JlYXNlJylcclxuXHRpbnB1dCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0JylcclxuXHRtaW4gPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWluJykgPyAwKVxyXG5cdG1heCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtYXgnKSA/IDEwMClcclxuXHRzdGVwID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ3N0ZXAnKSA/IDEpXHJcblxyXG5cdHZhbHVlID0gcGFyc2VJbnQgKCQoaW5wdXQpLnZhbCgpID8gMClcclxuXHR2YWx1ZSA9IE1hdGguY2xhbXAodmFsdWUgLSBzcGVlZCAqIHN0ZXAsIG1pbiwgbWF4KVxyXG5cdCQoaW5wdXQpLnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJylcclxuXHJcblxyXG5udW1iZXJJbmNyZWFzZSA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygnbnVtYmVySW5jcmVhc2UnKVxyXG5cdGlucHV0ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKVxyXG5cdG1pbiA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtaW4nKSA/IDApXHJcblx0bWF4ID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21heCcpID8gMTAwKVxyXG5cdHN0ZXAgPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignc3RlcCcpID8gMSlcclxuXHJcblx0dmFsdWUgPSBwYXJzZUludCAoJChpbnB1dCkudmFsKCkgPyAwKVxyXG5cdHZhbHVlID0gTWF0aC5jbGFtcCh2YWx1ZSArIHNwZWVkICogc3RlcCwgbWluLCBtYXgpXHJcblx0JChpbnB1dCkudmFsKHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cclxuXHJcblxyXG5cclxuJCAtPiBcclxuXHQkKHdpbmRvdylcclxuXHRcdC5rZXl1cCBrZXlVcFxyXG5cdFx0LmtleWRvd24ga2V5RG93blxyXG5cclxuXHQkKCdpbnB1dFt0eXBlPW51bWJlcl0sIGlucHV0W3R5cGU9cmFuZ2VdJylcclxuXHRcdC5iaW5kICdtb3VzZXdoZWVsJywgbW91c2VXaGVlbFxyXG5cclxuXHQkKCdpbnB1dFt0eXBlPXJhbmdlXScpXHJcblx0XHQuY2hhbmdlIHJhbmdlQ2hhbmdlZFxyXG5cdFx0Lm1vdXNlbW92ZSByYW5nZUNoYW5nZWRcclxuXHJcblx0JCgnLm51bWJlci1taW51cycpLmNoaWxkcmVuKCdidXR0b24nKVxyXG5cdFx0LmNsaWNrIG51bWJlckRlY3JlYXNlXHJcblxyXG5cclxuXHQkKCcubnVtYmVyLXBsdXMnKS5jaGlsZHJlbignYnV0dG9uJylcclxuXHRcdC5jbGljayBudW1iZXJJbmNyZWFzZVxyXG5cclxuIiwibGFzdFRpbWUgPSAwXHJcbnZlbmRvcnMgPSBbJ3dlYmtpdCcsICdtb3onXVxyXG5cclxuaWYgbm90IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgIGZvciB2ZW5kb3IgaW4gdmVuZG9yc1xyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvciArICdDYW5jZWxBbmltYXRpb25GcmFtZSddIHx8IHdpbmRvd1t2ZW5kb3IgKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuXHJcbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgb3I9IChjYWxsYmFjaywgZWxlbWVudCkgLT5cclxuICAgIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSlcclxuXHJcbiAgICBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KC0+XHJcbiAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKVxyXG4gICAgLCB0aW1lVG9DYWxsKVxyXG5cclxuICAgIGlkXHJcblxyXG53aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgb3I9IChpZCkgLT5cclxuICAgIGNsZWFyVGltZW91dChpZCkiLCJcclxuXHJcblxyXG5cclxuJCAtPiBcclxuXHQkKCcuaW1hZ2UtcHJldmlldycpLmVhY2ggLT5cclxuXHRcdHByZXZpZXcgPSB0aGlzXHJcblx0XHRpZCA9ICQodGhpcykuZGF0YSgnZm9yJylcclxuXHRcdCQoJyMnICsgaWQpLmNoYW5nZSgoZXZlbnQpIC0+IFxyXG5cclxuXHRcdFx0cGF0aCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKVxyXG5cdFx0XHQkKHByZXZpZXcpLmF0dHIgJ3NyYycsIHBhdGggaWYgcGF0aD9cclxuXHJcblx0XHRcdFxyXG5cdFx0KS50cmlnZ2VyICdjaGFuZ2UnXHJcbiIsIlxyXG5cclxuc2V0ID0gKGxhbmcpIC0+XHJcblx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xhbmcvJyArIGxhbmdcclxuXHJcblxyXG5cclxuXHJcblxyXG5idXR0b24gPSAoKSAtPlxyXG5cdHNldCgkKHRoaXMpLmRhdGEoJ2xhbmcnKSlcclxuXHJcblxyXG5zZWxlY3QgPSAoKSAtPlxyXG5cdHNldCgkKHRoaXMpLnZhbCgpKVxyXG5cclxuXHJcblxyXG4kIC0+XHJcblx0JCgnLmxhbmd1YWdlLXNlbGVjdCcpLmNoYW5nZShzZWxlY3QpXHJcblx0JCgnLmxhbmd1YWdlLWJ1dHRvbicpLmNsaWNrKGJ1dHRvbilcclxuIiwibmF2Zml4ID0gLT5cclxuXHRoZWlnaHQgPSAkKCcjbWFpbk5hdicpLmhlaWdodCgpICsgMTBcclxuXHQkKCdib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcsIGhlaWdodCArICdweCcpXHJcblxyXG5cclxuJCAtPlxyXG5cdCQod2luZG93KS5yZXNpemUgLT4gbmF2Zml4KClcclxuXHRuYXZmaXgoKSIsIlxyXG5cclxuaW1hZ2VGb3JGcmFtZSA9IChmcmFtZSkgLT5cclxuXHQnL2ltYWdlcy9wbGFudHMvcGxhbnQtJyArIGZyYW1lICsgJy5wbmcnXHJcblxyXG5yZWZyZXNoUGxhbnQgPSAocGxhbnQpIC0+IFxyXG5cdG5vdyA9IE1hdGgucm91bmQoKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdHN0YXJ0ID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnc3RhcnQnXHJcblx0ZW5kID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnZW5kJ1xyXG5cdHdhdGVyaW5nID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnd2F0ZXJpbmcnXHJcblx0bm93ID0gTWF0aC5taW4gbm93LCB3YXRlcmluZ1xyXG5cdGZyYW1lID0gTWF0aC5mbG9vcigxNyAqIE1hdGguY2xhbXAoKG5vdyAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCksIDAsIDEpKSBcclxuXHQkKHBsYW50KS5hdHRyICdzcmMnLCBpbWFnZUZvckZyYW1lIGZyYW1lXHJcblxyXG5cdHNldFRpbWVvdXQgKC0+IHJlZnJlc2hQbGFudCBwbGFudCksIDEwMDAgaWYgZnJhbWUgPCAxN1xyXG5cclxuJCAtPlxyXG5cdCQoJy5wbGFudGF0aW9uLXBsYW50JykuZWFjaCAtPiByZWZyZXNoUGxhbnQgdGhpc1xyXG5cclxuXHQkKCcjc2VlZHNNb2RhbCcpLm9uICdzaG93LmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cdFx0c2xvdCA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkuZGF0YSAnc2xvdCdcclxuXHRcdCQodGhpcykuZmluZCgnaW5wdXRbbmFtZT1zbG90XScpLnZhbCBzbG90IiwidXJsID0gJy9hcGkvY2hhcmFjdGVyJztcclxuXHJcblxyXG5zZXRQcm9ncmVzcyA9IChvYmplY3QsIHZhbHVlLCBtaW5WYWx1ZSwgbWF4VmFsdWUsIGxhc3RVcGRhdGUsIG5leHRVcGRhdGUpIC0+XHJcblxyXG5cdGJhciA9ICQoJy4nICsgb2JqZWN0ICsgJy1iYXInKVxyXG5cdHRpbWVyID0gJCgnLicgKyBvYmplY3QgKyAnLXRpbWVyJylcclxuXHJcblxyXG5cdGlmIGJhci5sZW5ndGggPiAwXHJcblx0XHRjaGlsZCA9ICQoYmFyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWJhcidcclxuXHJcblx0XHQkKGNoaWxkKVxyXG5cdFx0XHQuZGF0YSAnbWF4JywgbWF4VmFsdWVcclxuXHRcdFx0LmRhdGEgJ21pbicsIG1pblZhbHVlXHJcblx0XHRcdC5kYXRhICdub3cnLCB2YWx1ZVxyXG5cdFx0YmFyWzBdLnVwZGF0ZT8oKVxyXG5cclxuXHJcblx0aWYgdGltZXIubGVuZ3RoID4gMFxyXG5cdFx0Y2hpbGQgPSAkKHRpbWVyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWJhcidcclxuXHJcblx0XHRpZiBuZXh0VXBkYXRlP1xyXG5cdFx0XHQkKGNoaWxkKVxyXG5cdFx0XHRcdC5kYXRhICdtYXgnLCBuZXh0VXBkYXRlXHJcblx0XHRcdFx0LmRhdGEgJ21pbicsIGxhc3RVcGRhdGVcclxuXHRcdGVsc2VcclxuXHRcdFx0JChjaGlsZClcclxuXHRcdFx0XHQuZGF0YSAnbWF4JywgMVxyXG5cdFx0XHRcdC5kYXRhICdtaW4nLCAwXHJcblxyXG5cclxuc2V0VmFsdWVzID0gKG9iamVjdCwgdmFsdWUsIG1pblZhbHVlLCBtYXhWYWx1ZSkgLT5cclxuXHQkKCcuJyArIG9iamVjdCArICctbm93JylcclxuXHRcdC50ZXh0IHZhbHVlXHJcblxyXG5cdCQoJy4nICsgb2JqZWN0ICsgJy1taW4nKVxyXG5cdFx0LnRleHQgbWluVmFsdWVcclxuXHJcblx0JCgnLicgKyBvYmplY3QgKyAnLW1heCcpXHJcblx0XHQudGV4dCBtYXhWYWx1ZVxyXG5cclxuc2V0VmFsdWUgPSAob2JqZWN0LCB2YWx1ZSkgLT5cclxuXHQkKCcuJyArIG9iamVjdClcclxuXHRcdC50ZXh0IHZhbHVlXHJcblxyXG5cclxuXHJcblxyXG5maWxsID0gKGRhdGEpIC0+XHJcblx0c2V0UHJvZ3Jlc3MgJ2hlYWx0aCcsIGRhdGEuaGVhbHRoLCAwLCBkYXRhLm1heEhlYWx0aCwgZGF0YS5oZWFsdGhVcGRhdGUsIGRhdGEubmV4dEhlYWx0aFVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnaGVhbHRoJywgZGF0YS5oZWFsdGgsIDAsIGRhdGEubWF4SGVhbHRoXHJcblxyXG5cdHNldFByb2dyZXNzICdlbmVyZ3knLCBkYXRhLmVuZXJneSwgMCwgZGF0YS5tYXhFbmVyZ3ksIGRhdGEuZW5lcmd5VXBkYXRlLCBkYXRhLm5leHRFbmVyZ3lVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ2VuZXJneScsIGRhdGEuZW5lcmd5LCAwLCBkYXRhLm1heEVuZXJneVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnd2FudGVkJywgZGF0YS53YW50ZWQsIDAsIDYsIGRhdGEud2FudGVkVXBkYXRlLCBkYXRhLm5leHRXYW50ZWRVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ3dhbnRlZCcsIGRhdGEud2FudGVkLCAwLCA2XHJcblxyXG5cdHNldFByb2dyZXNzICdleHBlcmllbmNlJywgZGF0YS5leHBlcmllbmNlLCAwLCBkYXRhLm1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ2V4cGVyaWVuY2UnLCBkYXRhLmV4cGVyaWVuY2UsIDAsIGRhdGEubWF4RXhwZXJpZW5jZVxyXG5cclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ3BsYW50YXRvcicsIGRhdGEucGxhbnRhdG9yRXhwZXJpZW5jZSwgMCwgZGF0YS5wbGFudGF0b3JNYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdwbGFudGF0b3InLCBkYXRhLnBsYW50YXRvckV4cGVyaWVuY2UsIDAsIGRhdGEucGxhbnRhdG9yTWF4RXhwZXJpZW5jZVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnc211Z2dsZXInLCBkYXRhLnNtdWdnbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5zbXVnZ2xlck1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ3NtdWdnbGVyJywgZGF0YS5zbXVnZ2xlckV4cGVyaWVuY2UsIDAsIGRhdGEuc211Z2dsZXJNYXhFeHBlcmllbmNlXHJcblxyXG5cdHNldFByb2dyZXNzICdkZWFsZXInLCBkYXRhLmRlYWxlckV4cGVyaWVuY2UsIDAsIGRhdGEuZGVhbGVyTWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnZGVhbGVyJywgZGF0YS5kZWFsZXJFeHBlcmllbmNlLCAwLCBkYXRhLmRlYWxlck1heEV4cGVyaWVuY2VcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdCNzZXRWYWx1ZSAnbGV2ZWwnLCBkYXRhLmxldmVsXHJcblx0I3NldFZhbHVlICdwbGFudGF0b3ItbGV2ZWwnLCBkYXRhLnBsYW50YXRvckxldmVsXHJcblx0I3NldFZhbHVlICdzbXVnZ2xlci1sZXZlbCcsIGRhdGEuc211Z2dsZXJMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnZGVhbGVyLWxldmVsJywgZGF0YS5kZWFsZXJMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnc3RyZW5ndGgnLCBkYXRhLnN0cmVuZ3RoLFxyXG5cdCNzZXRWYWx1ZSAncGVyY2VwdGlvbicsIGRhdGEucGVyY2VwdGlvblxyXG5cdCNzZXRWYWx1ZSAnZW5kdXJhbmNlJywgZGF0YS5lbmR1cmFuY2VcclxuXHQjc2V0VmFsdWUgJ2NoYXJpc21hJywgZGF0YS5jaGFyaXNtYVxyXG5cdCNzZXRWYWx1ZSAnaW50ZWxsaWdlbmNlJywgZGF0YS5pbnRlbGxpZ2VuY2VcclxuXHQjc2V0VmFsdWUgJ2FnaWxpdHknLCBkYXRhLmFnaWxpdHlcclxuXHQjc2V0VmFsdWUgJ2x1Y2snLCBkYXRhLmx1Y2sgKyAnJSdcclxuXHQjc2V0VmFsdWUgJ3N0YXRpc3RpY1BvaW50cycsIGRhdGEuc3RhdGlzdGljUG9pbnRzXHJcblx0I3NldFZhbHVlICd0YWxlbnRQb2ludHMnLCBkYXRhLnRhbGVudFBvaW50c1xyXG5cdCNzZXRWYWx1ZSAnbW9uZXknLCAnJCcgKyBkYXRhLm1vbmV5XHJcblx0I3NldFZhbHVlICdyZXBvcnRzJywgZGF0YS5yZXBvcnRzQ291bnRcclxuXHQjc2V0VmFsdWUgJ21lc3NhZ2VzJywgZGF0YS5tZXNzYWdlc0NvdW50XHJcblxyXG5cdHNjb3BlID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLnNjb3BlKClcclxuXHJcblx0aWYgc2NvcGU/IGFuZCBzY29wZS5wbGF5ZXI/XHJcblx0XHQjc2NvcGUucGxheWVyLmxldmVsID0gZGF0YS5sZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5wbGFudGF0b3JMZXZlbCA9IGRhdGEucGxhbnRhdG9yTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuc211Z2dsZXJMZXZlbCA9IGRhdGEuc211Z2dsZXJMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5kZWFsZXJMZXZlbCA9IGRhdGEuZGVhbGVyTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuc3RyZW5ndGggPSBkYXRhLnN0cmVuZ3RoXHJcblx0XHQjc2NvcGUucGxheWVyLnBlcmNlcHRpb24gPSBkYXRhLnBlcmNlcHRpb25cclxuXHRcdCNzY29wZS5wbGF5ZXIuZW5kdXJhbmNlID0gZGF0YS5lbmR1cmFuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuY2hhcmlzbWEgPSBkYXRhLmNoYXJpc21hXHJcblx0XHQjc2NvcGUucGxheWVyLmludGVsbGlnZW5jZSA9IGRhdGEuaW50ZWxsaWdlbmNlXHJcblx0XHQjc2NvcGUucGxheWVyLmFnaWxpdHkgPSBkYXRhLmFnaWxpdHlcclxuXHRcdCNzY29wZS5wbGF5ZXIubHVjayA9IGRhdGEubHVja1xyXG5cdFx0I3Njb3BlLnBsYXllci5yZXNwZWN0ID0gZGF0YS5yZXNwZWN0XHJcblx0XHQjc2NvcGUucGxheWVyLndlaWdodCA9IGRhdGEud2VpZ2h0XHJcblx0XHQjc2NvcGUucGxheWVyLmNhcGFjaXR5ID0gZGF0YS5jYXBhY2l0eVxyXG5cdFx0I3Njb3BlLnBsYXllci5taW5EYW1hZ2UgPSBkYXRhLm1pbkRhbWFnZVxyXG5cdFx0I3Njb3BlLnBsYXllci5tYXhEYW1hZ2UgPSBkYXRhLm1heERhbWFnZVxyXG5cdFx0I3Njb3BlLnBsYXllci5kZWZlbnNlID0gZGF0YS5kZWZlbnNlXHJcblx0XHQjc2NvcGUucGxheWVyLmNyaXRDaGFuY2UgPSBkYXRhLmNyaXRDaGFuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuc3BlZWQgPSBkYXRhLnNwZWVkXHJcblx0XHQjc2NvcGUucGxheWVyLmV4cGVyaWVuY2VNb2RpZmllciA9IGRhdGEuZXhwZXJpZW5jZU1vZGlmaWVyXHJcblx0XHQjc2NvcGUucGxheWVyLm1vbmV5TW9kaWZpZXIgPSBkYXRhLm1vbmV5TW9kaWZpZXJcclxuXHJcblx0XHRmb3IgaywgdiBvZiBkYXRhXHJcblx0XHRcdHNjb3BlLnBsYXllcltrXSA9IHZcclxuXHJcblx0XHRzY29wZS4kYXBwbHkoKVxyXG5cclxuXHJcblxyXG5cclxubG9hZGVkID0gKGRhdGEpIC0+XHJcblxyXG5cdGZpbGwgZGF0YVxyXG5cclxuXHRpZiBkYXRhLnJlbG9hZFxyXG5cclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWZyZXNoKClcclxuXHRlbHNlXHJcblx0XHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHRcdCQuYWpheCB7XHJcblxyXG5cdFx0XHRcdHVybDogdXJsICsgJy9ub3RpZmljYXRpb25zJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdFx0c3VjY2Vzczogbm90aWZ5XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuYWpheCB7XHJcblxyXG5cdFx0XHRcdHVybDogdXJsICsgJy9tZXNzYWdlcycsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IG1lc3NhZ2UsXHJcblx0XHRcdH1cclxuXHJcblx0c2V0VGltZW91dCBsb2FkLCBkYXRhLm5leHRVcGRhdGUgKiAxMDAwXHJcblxyXG5cclxubm90aWZ5ID0gKGRhdGEpIC0+XHJcblx0Zm9yIG4gaW4gZGF0YVxyXG5cdFx0d2luZG93Lm5vdGlmeSB7XHJcblxyXG5cdFx0XHR0aXRsZTogJzxzdHJvbmc+JyArIG4udGl0bGUgKyAnPC9zdHJvbmc+JyxcclxuXHRcdFx0bWVzc2FnZTogJycsXHJcblx0XHRcdHVybDogJy9yZXBvcnRzLycgKyBuLmlkLFxyXG5cclxuXHRcdH1cclxuXHJcblx0aWYgd2luZG93LmFjdGl2ZVxyXG5cdFx0d2luZG93Lm5vdGlmeVNob3coKVxyXG5cclxubWVzc2FnZSA9IChkYXRhKSAtPlxyXG5cdGZvciBuIGluIGRhdGFcclxuXHRcdHdpbmRvdy5ub3RpZnkge1xyXG5cclxuXHRcdFx0dGl0bGU6ICc8c3Ryb25nPicgKyBuLmF1dGhvciArICc8L3N0cm9uZz46ICcgKyBuLnRpdGxlICsgJzxici8+JyxcclxuXHRcdFx0bWVzc2FnZTogbi5jb250ZW50LFxyXG5cdFx0XHR1cmw6ICcvbWVzc2FnZXMvaW5ib3gvJyArIG4uaWQsXHJcblxyXG5cdFx0fVxyXG5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHR3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5cclxuXHJcbmxvYWQgPSAtPlxyXG5cclxuXHQkLmFqYXgge1xyXG5cclxuXHRcdHVybDogdXJsLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRzdWNjZXNzOiBsb2FkZWRcclxuXHR9XHJcblxyXG5cclxuXHJcblx0XHJcbiQod2luZG93KS5mb2N1cyAtPlxyXG5cdGxvYWQoKVxyXG5cclxuXHJcbiQgLT5cclxuXHRsb2FkKCkiLCJcclxuc3F1YXJlID0gLT5cclxuXHJcblx0JCgnLnNxdWFyZScpLmVhY2ggLT5cclxuXHJcblx0XHRpZiAkKHRoaXMpLmRhdGEoJ3NxdWFyZScpID09ICd3aWR0aCdcclxuXHJcblx0XHRcdCQodGhpcykud2lkdGggJCh0aGlzKS5oZWlnaHQoKVxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0JCh0aGlzKS5oZWlnaHQgJCh0aGlzKS53aWR0aCgpXHJcblxyXG4kIC0+XHJcblx0JCh3aW5kb3cpLnJlc2l6ZSAtPiBcclxuXHRcdHNxdWFyZSgpXHJcblx0XHRcclxuXHRzcXVhcmUoKSIsIlxyXG5jaGFuZ2VkID0gLT4gXHJcblx0Y3VycmVudCA9IHBhcnNlSW50ICgkKCcjY3VycmVudFN0YXRpc3RpY3NQb2ludHMnKS50ZXh0KCkgPyAwKVxyXG5cdGxlZnQgPSBwYXJzZUludCAkKCcjc3RhdGlzdGljc1BvaW50cycpLnRleHQoKVxyXG5cdG9sZCA9IHBhcnNlSW50ICgkKHRoaXMpLmRhdGEoJ29sZCcpID8gMClcclxuXHR2YWwgPSBwYXJzZUludCAoJCh0aGlzKS52YWwoKSA/IDApXHJcblx0ZGlmZiA9IHZhbCAtIG9sZFxyXG5cclxuXHRkaWZmID0gbGVmdCBpZiBkaWZmID4gbGVmdFxyXG5cdHZhbCA9IG9sZCArIGRpZmZcclxuXHRsZWZ0IC09IGRpZmZcclxuXHJcblx0aWYgbm90IGlzTmFOIGRpZmZcclxuXHJcblx0XHQkKHRoaXMpXHJcblx0XHRcdC52YWwgdmFsXHJcblx0XHRcdC5kYXRhICdvbGQnLCB2YWxcclxuXHJcblx0XHQkKCcjc3RhdGlzdGljc1BvaW50cycpXHJcblx0XHRcdC50ZXh0IGxlZnRcclxuXHJcblx0XHQkKCcuc3RhdGlzdGljJykuZWFjaCAtPlxyXG5cdFx0XHR2YWwgPSBwYXJzZUludCAkKHRoaXMpLnZhbCgpID8gMFxyXG5cdFx0XHQkKHRoaXMpLmF0dHIgJ21heCcsIGxlZnQgKyB2YWxcclxuXHJcblxyXG5yYW5kb20gPSAobWluLCBtYXgpIC0+IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxyXG5cclxucmFuZG9tSW4gPSAoYXJyYXkpIC0+XHJcblx0aW5kZXggPSByYW5kb20oMCwgYXJyYXkubGVuZ3RoIC0gMSlcclxuXHRhcnJheVtpbmRleF1cclxuXHJcblxyXG5cclxuXHJcblxyXG5yb2xsID0gLT5cclxuXHJcblx0cm9sbGFibGUgPSAkKCcuc3RhdGlzdGljLnJvbGxhYmxlJylcclxuXHQkKHJvbGxhYmxlKS52YWwoMCkudHJpZ2dlcignY2hhbmdlJylcclxuXHRwb2ludHMgPSBwYXJzZUludCAkKCcjc3RhdGlzdGljc1BvaW50cycpLnRleHQoKVxyXG5cclxuXHJcblx0Zm9yIGkgaW4gWzEuLnBvaW50c11cclxuXHJcblx0XHRzdGF0aXN0aWMgPSByYW5kb21Jbihyb2xsYWJsZSlcclxuXHRcdHZhbCA9IHBhcnNlSW50ICQoc3RhdGlzdGljKS52YWwoKVxyXG5cdFx0JChzdGF0aXN0aWMpLnZhbCh2YWwgKyAxKVxyXG5cclxuXHJcblx0JChyb2xsYWJsZSkudHJpZ2dlciAnY2hhbmdlJ1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4kIC0+IFxyXG5cdCQoJy5zdGF0aXN0aWMnKVxyXG5cdFx0LmJpbmQgJ2tleXVwIGlucHV0IGNoYW5nZScsIGNoYW5nZWRcclxuXHRcdC50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cdCQoJy5zdGF0Um9sbGVyJylcclxuXHRcdC5jbGljayhyb2xsKVxyXG5cclxuXHRyb2xsKClcclxuIiwiXHJcbnJlZnJlc2hpbmcgPSBmYWxzZVxyXG5cclxucmVmcmVzaCA9IC0+XHJcblx0d2luZG93LmxvY2F0aW9uLnJlZnJlc2goKSBpZiBub3QgcmVmcmVzaGluZ1xyXG5cdHJlZnJlc2hpbmcgPSB0cnVlXHJcblxyXG51cGRhdGUgPSAodGltZXIpIC0+XHJcblx0YmFyID0gJCh0aW1lcikuY2hpbGRyZW4oJy5wcm9ncmVzcy1iYXInKS5sYXN0KClcclxuXHRsYWJlbCA9ICQodGltZXIpLmNoaWxkcmVuICcucHJvZ3Jlc3MtbGFiZWwnXHJcblx0dGltZSA9IE1hdGgucm91bmQgKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwLjBcclxuXHJcblxyXG5cdG1pbiA9ICQoYmFyKS5kYXRhICdtaW4nXHJcblx0bWF4ID0gJChiYXIpLmRhdGEgJ21heCdcclxuXHRzdG9wID0gJChiYXIpLmRhdGEgJ3N0b3AnXHJcblx0Y2EgPSAkKGJhcikuZGF0YSgnY2EnKVxyXG5cdGNiID0gJChiYXIpLmRhdGEoJ2NiJylcclxuXHJcblxyXG5cclxuXHRyZXZlcnNlZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JldmVyc2VkJykgPyBmYWxzZSlcclxuXHRyZWxvYWQgPSBCb29sZWFuKCQoYmFyKS5kYXRhKCdyZWxvYWQnKSA/IHRydWUpXHJcblxyXG5cdGlmIHN0b3A/XHJcblx0XHR0aW1lID0gTWF0aC5taW4gdGltZSwgc3RvcFxyXG5cclxuXHRub3cgPSBNYXRoLmNsYW1wKHRpbWUsIG1pbiwgbWF4KVxyXG5cclxuXHJcblx0cGVyY2VudCA9IChub3cgLSBtaW4pIC8gKG1heCAtIG1pbilcclxuXHRwZXJjZW50ID0gMSAtIHBlcmNlbnQgaWYgcmV2ZXJzZWRcclxuXHJcblxyXG5cclxuXHJcblx0JChiYXIpLmNzcyAnd2lkdGgnLCAocGVyY2VudCAqIDEwMCkgKyAnJSdcclxuXHQkKGJhcikuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgTWF0aC5sZXJwQ29sb3JzKHBlcmNlbnQsIGNhLCBjYikpIGlmIGNhPyBhbmQgY2I/XHJcblx0JChsYWJlbCkudGV4dCB3aW5kb3cudGltZUZvcm1hdD8gbWF4IC0gbm93XHJcblxyXG5cdHJlZnJlc2goKSBpZiB0aW1lID4gbWF4IGFuZCByZWxvYWRcclxuXHJcblx0c2V0VGltZW91dCAtPiB1cGRhdGUgdGltZXIsIDEwMDAgI2lmIHRpbWUgPD0gbWF4XHJcblxyXG5cclxuJCAtPlxyXG5cdCQoJy5wcm9ncmVzcy10aW1lJykuZWFjaCAtPlxyXG5cdFx0dXBkYXRlIHRoaXNcclxuXHJcblxyXG5cclxuXHJcbiIsIiQgLT5cclxuXHQkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZWFjaCgtPlxyXG5cclxuXHRcdG9wdGlvbnMgPSB7XHJcblxyXG5cdFx0XHRodG1sOiB0cnVlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdhdXRvIGxlZnQnXHJcblx0XHR9XHJcblxyXG5cdFx0dHJpZ2dlciA9ICQodGhpcykuZGF0YSgndHJpZ2dlcicpXHJcblxyXG5cdFx0aWYgdHJpZ2dlcj9cclxuXHRcdFx0b3B0aW9ucy50cmlnZ2VyID0gdHJpZ2dlclxyXG5cclxuXHJcblx0XHQkKHRoaXMpLnRvb2x0aXAob3B0aW9ucylcclxuXHQpIiwiXHJcbiQgLT5cclxuXHJcblx0dHV0b3JpYWxzID0ge31cclxuXHQkKCcudHV0b3JpYWwtc3RlcCcpLnBvcG92ZXIoe3RyaWdnZXI6ICdtYW51YWwnLCBwbGFjZW1lbnQ6ICdib3R0b20nfSlcclxuXHJcblx0c2hvdyA9IChzdGVwKSAtPlxyXG5cclxuXHRcdGlmIHN0ZXA/XHJcblxyXG5cdFx0XHQkKHN0ZXAuZWxlbWVudHMpXHJcblx0XHRcdFx0LmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ3R1dG9yaWFsLWFjdGl2ZScpXHJcblx0XHRcdFx0LmZpcnN0KClcclxuXHRcdFx0XHQucG9wb3Zlcignc2hvdycpXHJcblxyXG5cclxuXHRjbGlja2VkID0gKCkgLT5cclxuXHJcblx0XHRuZXh0ID0gdHV0b3JpYWxzW3RoaXMuc3RlcC5uYW1lXS5zaGlmdCgpXHJcblxyXG5cdFx0aWYgbmV4dD9cclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IG5leHQuaW5kZXh9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KC0+XHJcblxyXG5cdFx0XHRcdHNob3cobmV4dClcclxuXHRcdFx0LCA1MDApXHJcblx0XHRlbHNlXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IHRoaXMuc3RlcC5pbmRleCArIDF9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblx0XHRcclxuXHJcblxyXG5cclxuXHRcdCQodGhpcy5zdGVwLmVsZW1lbnRzKS51bmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCd0dXRvcmlhbC1hY3RpdmUnKVxyXG5cdFx0XHQucG9wb3ZlcignaGlkZScpXHJcblxyXG5cclxuXHRyZWNlaXZlID0gKG9iamVjdCwgbmFtZSwgZGF0YSkgLT5cclxuXHJcblx0XHRpZiBkYXRhLnN0YWdlIDwgMFxyXG5cclxuXHJcblx0XHRcdG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwgZmFkZScpXHJcblx0XHRcdGRpYWxvZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWRpYWxvZycpXHJcblx0XHRcdGNvbnRlbnQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1jb250ZW50JylcclxuXHRcdFx0aGVhZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtaGVhZGVyJylcclxuXHRcdFx0Ym9keSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWJvZHknKVxyXG5cdFx0XHRmb290ZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1mb290ZXInKVxyXG5cdFx0XHR0aXRsZSA9ICQoJzxoND48L2g0PicpLmFkZENsYXNzKCdtb2RhbC10aXRsZScpXHJcblxyXG5cdFx0XHRncm91cCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2J0bi1ncm91cCcpXHJcblx0XHRcdGJ0bjEgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdidG4gYnRuLXN1Y2Nlc3MnKS5hdHRyKCd2YWx1ZScsICd5ZXMnKS50ZXh0KGkxOG4ueWVzKVxyXG5cdFx0XHRidG4yID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnRuIGJ0bi1kYW5nZXInKS5hdHRyKCd2YWx1ZScsICdubycpLnRleHQoaTE4bi5ubylcclxuXHJcblx0XHRcdCQoYnRuMSkuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YToge25hbWU6IG5hbWUsIGFjdGl2ZTogMX0sXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcdFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdCQobW9kYWwpLm1vZGFsKCdoaWRlJylcclxuXHJcblx0XHRcdFx0bG9hZChvYmplY3QsIG5hbWUsIGRhdGEpXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQoYnRuMikuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YToge25hbWU6IG5hbWUsIGFjdGl2ZTogMH0sXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcdFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdCQobW9kYWwpLm1vZGFsKCdoaWRlJylcclxuXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQodGl0bGUpXHJcblx0XHRcdFx0LnRleHQoZGF0YS50aXRsZSlcclxuXHJcblx0XHRcdCQoYm9keSlcclxuXHRcdFx0XHQudGV4dChkYXRhLmRlc2NyaXB0aW9uKVxyXG5cclxuXHRcdFx0JChoZWFkZXIpXHJcblx0XHRcdFx0LmFwcGVuZCh0aXRsZSlcclxuXHJcblxyXG5cdFx0XHQkKGdyb3VwKVxyXG5cdFx0XHRcdC5hcHBlbmQoYnRuMilcclxuXHRcdFx0XHQuYXBwZW5kKGJ0bjEpXHJcblxyXG5cdFx0XHQkKGZvb3RlcilcclxuXHRcdFx0XHQuYXBwZW5kKGdyb3VwKVxyXG5cclxuXHJcblx0XHRcdCQoY29udGVudClcclxuXHRcdFx0XHQuYXBwZW5kKGhlYWRlcilcclxuXHRcdFx0XHQuYXBwZW5kKGJvZHkpXHJcblx0XHRcdFx0LmFwcGVuZChmb290ZXIpXHJcblxyXG5cdFx0XHQkKGRpYWxvZylcclxuXHRcdFx0XHQuYXBwZW5kKGNvbnRlbnQpXHJcblxyXG5cdFx0XHQkKG1vZGFsKVxyXG5cdFx0XHRcdC5hcHBlbmQoZGlhbG9nKVxyXG5cclxuXHRcdFx0JCgnYm9keScpXHJcblx0XHRcdFx0LmFwcGVuZChtb2RhbClcclxuXHJcblx0XHRcdCQobW9kYWwpLm1vZGFsKHtiYWNrZHJvcDogJ3N0YXRpYycsIHNob3c6IHRydWUsIGtleWJvYXJkOiBmYWxzZX0pXHJcblxyXG5cclxuXHRcdGVsc2VcclxuXHRcdFx0bG9hZChvYmplY3QsIG5hbWUsIGRhdGEpXHJcblxyXG5cclxuXHJcblx0bG9hZCA9IChvYmplY3QsIG5hbWUsIGRhdGEpIC0+XHJcblxyXG5cdFx0dHV0b3JpYWwgPSBbXVxyXG5cclxuXHRcdCQob2JqZWN0KS5maW5kKCcudHV0b3JpYWwtc3RlcCcpLmVhY2goLT5cclxuXHJcblx0XHRcdHN0ZXAgPSBudWxsXHJcblx0XHRcdGluZGV4ID0gJCh0aGlzKS5kYXRhKCd0dXRvcmlhbC1pbmRleCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gaWYgaW5kZXggPCBkYXRhLnN0YWdlXHJcblxyXG5cclxuXHJcblx0XHRcdGlmIHR1dG9yaWFsW2luZGV4XT9cclxuXHRcdFx0XHRzdGVwID0gdHV0b3JpYWxbaW5kZXhdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzdGVwID0ge1xyXG5cclxuXHRcdFx0XHRcdGVsZW1lbnRzOiBbXSxcclxuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdFx0XHRpbmRleDogaW5kZXgsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHR1dG9yaWFsW2luZGV4XSA9IHN0ZXBcclxuXHJcblxyXG5cdFx0XHRzdGVwLmVsZW1lbnRzLnB1c2godGhpcylcclxuXHRcdFx0dGhpcy5zdGVwID0gc3RlcFxyXG5cdFx0KVxyXG5cclxuXHRcdHR1dG9yaWFsID0gdHV0b3JpYWwuZmlsdGVyKChlbGVtZW50KSAtPlxyXG5cclxuXHRcdFx0aWYgZWxlbWVudD9cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQpXHJcblxyXG5cclxuXHJcblx0XHR0dXRvcmlhbHNbbmFtZV0gPSB0dXRvcmlhbFxyXG5cdFx0c2hvdyh0dXRvcmlhbC5zaGlmdCgpKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0JCgnW2RhdGEtdHV0b3JpYWw9dHJ1ZScpLmVhY2goLT5cclxuXHJcblx0XHRuYW1lID0gJCh0aGlzKS5kYXRhKCd0dXRvcmlhbC1uYW1lJylcclxuXHJcblx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRkYXRhOiB7bmFtZTogbmFtZX0sXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PlxyXG5cdFx0XHRcdHJlY2VpdmUodGhpcywgbmFtZSwgZGF0YSkgaWYgZGF0YS5hY3RpdmVcclxuXHRcdH0pXHJcblx0KSIsIndpbmRvdy5mb3JtYXQgb3I9IFxyXG5cdHRpbWU6XHJcblx0XHRkYXk6ICdkJ1xyXG5cdFx0aG91cjogJ2gnXHJcblx0XHRtaW51dGU6ICdtJ1xyXG5cdFx0c2Vjb25kOiAncydcclxuXHJcblxyXG5cclxuXHJcbndpbmRvdy5hY3RpdmUgPz0gZmFsc2VcclxuXHJcblxyXG5cclxuJCh3aW5kb3cpLmZvY3VzIC0+XHJcblx0d2luZG93LmFjdGl2ZSA9IHRydWVcclxuXHJcbiQod2luZG93KS5ibHVyIC0+XHJcblx0d2luZG93LmFjdGl2ZSA9IGZhbHNlXHJcblxyXG4kKHdpbmRvdykucmVzaXplIC0+XHJcblx0Y2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVG8pIGlmIHRoaXMucmVzaXplVG9cclxuXHR0aGlzLnJlc2l6ZVRvID0gc2V0VGltZW91dCgtPlxyXG5cdFx0JCh0aGlzKS50cmlnZ2VyKCdyZXNpemVkJylcclxuXHQsIDUwMClcclxuXHRcclxuXHJcblxyXG5cclxud2luZG93LmxwYWQgb3I9ICh2YWx1ZSwgcGFkZGluZykgLT5cclxuICB6ZXJvZXMgPSBcIjBcIlxyXG4gIHplcm9lcyArPSBcIjBcIiBmb3IgaSBpbiBbMS4ucGFkZGluZ11cclxuXHJcbiAgKHplcm9lcyArIHZhbHVlKS5zbGljZShwYWRkaW5nICogLTEpXHJcblxyXG5cclxudGltZVNlcGFyYXRlID0gKHZhbHVlKSAtPlxyXG5cdGlmIHZhbHVlLmxlbmd0aCA+IDBcclxuXHRcdHZhbHVlICsgJyAnXHJcblx0ZWxzZVxyXG5cdFx0dmFsdWVcclxuXHJcbnRpbWVGb3JtYXQgPSAodGV4dCwgdmFsdWUsIGZvcm1hdCkgLT5cclxuXHR0ZXh0ID0gdGltZVNlcGFyYXRlKHRleHQpXHJcblxyXG5cdGlmIHRleHQubGVuZ3RoID4gMFxyXG5cdFx0dGV4dCArPSB3aW5kb3cubHBhZCB2YWx1ZSwgMlxyXG5cdGVsc2UgXHJcblx0XHR0ZXh0ICs9IHZhbHVlXHJcblxyXG5cdHRleHQgKyBmb3JtYXRcclxuXHJcblxyXG53aW5kb3cudGltZUZvcm1hdCBvcj0gKHZhbHVlKSAtPlxyXG5cdFxyXG5cdHRleHQgPSAnJ1xyXG5cdGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSAqIDEwMDApXHJcblx0ZCA9IGRhdGUuZ2V0VVRDRGF0ZSgpIC0gMVxyXG5cdGggPSBkYXRlLmdldFVUQ0hvdXJzKClcclxuXHRtID0gZGF0ZS5nZXRVVENNaW51dGVzKClcclxuXHRzID0gZGF0ZS5nZXRVVENTZWNvbmRzKClcclxuXHJcblxyXG5cdHRleHQgKz0gZCArIGZvcm1hdC50aW1lLmRheSBpZiBkID4gMFxyXG5cdHRleHQgPSB0aW1lRm9ybWF0KHRleHQsIGgsIGZvcm1hdC50aW1lLmhvdXIpIGlmIGggPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgbSwgZm9ybWF0LnRpbWUubWludXRlKSBpZiBoID4gMCBvciBtID4gMFxyXG5cdHRleHQgPSB0aW1lRm9ybWF0KHRleHQsIHMsIGZvcm1hdC50aW1lLnNlY29uZCkgaWYgaCA+IDAgb3IgbSA+IDAgb3IgcyA+IDBcclxuXHJcblx0dGV4dFxyXG5cclxud2luZG93LnRpbWVGb3JtYXRTaG9ydCBvcj0gKHZhbHVlKSAtPlxyXG5cclxuXHR0ZXh0ID0gJydcclxuXHRkYXRlID0gbmV3IERhdGUodmFsdWUgKiAxMDAwKVxyXG5cdGQgPSBkYXRlLmdldFVUQ0RhdGUoKSAtIDFcclxuXHRoID0gZGF0ZS5nZXRVVENIb3VycygpXHJcblx0bSA9IGRhdGUuZ2V0VVRDTWludXRlcygpXHJcblx0cyA9IGRhdGUuZ2V0VVRDU2Vjb25kcygpXHJcblxyXG5cclxuXHRyZXR1cm4gZCArIGZvcm1hdC50aW1lLmRheSBpZiBkID4gMFxyXG5cdHJldHVybiB0aW1lRm9ybWF0KHRleHQsIGgsIGZvcm1hdC50aW1lLmhvdXIpIGlmIGggPiAwXHJcblx0cmV0dXJuIHRpbWVGb3JtYXQodGV4dCwgbSwgZm9ybWF0LnRpbWUubWludXRlKSBpZiBtID4gMFxyXG5cdHJldHVybiB0aW1lRm9ybWF0KHRleHQsIHMsIGZvcm1hdC50aW1lLnNlY29uZCkgaWYgcyA+IDBcclxuXHJcblxyXG5cclxuXHJcbnJlZnJlc2hpbmcgPSBmYWxzZVxyXG5cclxuXHJcbndpbmRvdy5sb2NhdGlvbi5yZWZyZXNoIG9yPSAtPlxyXG5cdGlmIG5vdCByZWZyZXNoaW5nXHJcblx0XHRyZWZyZXNoaW5nID0gdHJ1ZVxyXG5cdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKVxyXG5cclxuXHJcblxyXG5cclxubm90aWZpY2F0aW9ucyA9IFtdXHJcbndpbmRvdy5ub3RpZnkgb3I9IChwcm9wcyktPlxyXG5cdG5vdGlmaWNhdGlvbnMucHVzaCBwcm9wc1xyXG5cclxuXHJcbmNsb25lID0gKG9iaikgLT5cclxuXHRyZXR1cm4gb2JqICBpZiBvYmogaXMgbnVsbCBvciB0eXBlb2YgKG9iaikgaXNudCBcIm9iamVjdFwiXHJcblx0dGVtcCA9IG5ldyBvYmouY29uc3RydWN0b3IoKVxyXG5cdGZvciBrZXkgb2Ygb2JqXHJcblx0XHR0ZW1wW2tleV0gPSBjbG9uZShvYmpba2V5XSlcclxuXHR0ZW1wXHJcblxyXG5zaG93Tm90aWZ5ID0gKG4sIGkpIC0+XHJcblx0Y29uc29sZS5sb2coJ1AnLCBuLCBpKTtcclxuXHRzZXRUaW1lb3V0ICgtPiBcclxuXHRcdGNvbnNvbGUubG9nKCdTJywgbiwgaSk7XHJcblx0XHQkLm5vdGlmeShuLCB7XHJcblxyXG5cdFx0XHRwbGFjZW1lbnQ6IHtcclxuXHJcblx0XHRcdFx0ZnJvbTogJ2JvdHRvbScsXHJcblx0XHRcdH0sXHJcblx0XHRcdG1vdXNlX292ZXI6ICdwYXVzZScsXHJcblxyXG5cdFx0XHR9KSksIGkgKiAxMDAwXHJcblx0XHJcblxyXG5cclxuXHJcbndpbmRvdy5ub3RpZnlTaG93IG9yPSAtPlxyXG5cdGlmIHdpbmRvdy5hY3RpdmVcclxuXHJcblx0XHRmb3Igbm90aWZpY2F0aW9uLCBpbmRleCBpbiBub3RpZmljYXRpb25zXHJcblx0XHRcdHNob3dOb3RpZnkgJC5leHRlbmQoe30sIG5vdGlmaWNhdGlvbiksIGluZGV4XHJcblx0XHRub3RpZmljYXRpb25zID0gW11cclxuXHJcblxyXG5cclxuJCh3aW5kb3cpLmZvY3VzIC0+IHdpbmRvdy5ub3RpZnlTaG93KClcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5NYXRoLmNsYW1wIG9yPSAodmFsdWUsIG1pbiwgbWF4KSAtPlxyXG5cdE1hdGgubWF4KE1hdGgubWluKHZhbHVlLCBtYXgpLCBtaW4pXHJcblxyXG5cclxuTWF0aC5sZXJwIG9yPSAoaSwgYSwgYikgLT5cclxuXHQoYSAqIGkpICsgKGIgKiAoMSAtIGkpKVxyXG5cclxuXHJcblxyXG5NYXRoLmhleFRvUmdiIG9yPSAoaGV4KSAtPiBcclxuICAgIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcclxuICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcclxuICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG5cclxuICAgIH0gaWYgcmVzdWx0O1xyXG4gICAgbnVsbDtcclxuXHJcbk1hdGgucmdiVG9IZXggb3I9IChyLCBnLCBiKSAtPlxyXG4gICAgcmV0dXJuIFwiI1wiICsgKCgxIDw8IDI0KSArIChyIDw8IDE2KSArIChnIDw8IDgpICsgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG5cclxuXHJcbk1hdGgubGVycENvbG9ycyBvcj0gKGksIGEsIGIpIC0+XHJcblxyXG5cdGNhID0gTWF0aC5oZXhUb1JnYiBhXHJcblx0Y2IgPSBNYXRoLmhleFRvUmdiIGJcclxuXHJcblx0Y2MgPSB7XHJcblx0XHRyOiBNYXRoLnJvdW5kKE1hdGgubGVycChpLCBjYS5yLCBjYi5yKSksXHJcblx0XHRnOiBNYXRoLnJvdW5kKE1hdGgubGVycChpLCBjYS5nLCBjYi5nKSksXHJcblx0XHRiOiBNYXRoLnJvdW5kKE1hdGgubGVycChpLCBjYS5iLCBjYi5iKSksXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gTWF0aC5yZ2JUb0hleChjYy5yLCBjYy5nLCBjYy5iKVxyXG5cclxuXHJcblxyXG5cclxuXHJcbnVwZGF0ZVByb2dyZXNzID0gLT5cclxuXHRiYXIgPSAkKHRoaXMpLmNoaWxkcmVuKCcucHJvZ3Jlc3MtYmFyJylcclxuXHRsYWJlbCA9ICQodGhpcykuY2hpbGRyZW4oJy5wcm9ncmVzcy1sYWJlbCcpXHJcblxyXG5cdG1pbiA9ICQoYmFyKS5kYXRhKCdtaW4nKVxyXG5cdG1heCA9ICQoYmFyKS5kYXRhKCdtYXgnKVxyXG5cdGNhID0gJChiYXIpLmRhdGEoJ2NhJylcclxuXHRjYiA9ICQoYmFyKS5kYXRhKCdjYicpXHJcblx0bm93ID0gTWF0aC5jbGFtcCgkKGJhcikuZGF0YSgnbm93JyksIG1pbiwgbWF4KVxyXG5cdHJldmVyc2VkID0gQm9vbGVhbigkKGJhcikuZGF0YSgncmV2ZXJzZWQnKSA/IGZhbHNlKVxyXG5cclxuXHRwZXJjZW50ID0gKG5vdyAtIG1pbikgLyAobWF4IC0gbWluKSAqIDEwMFxyXG5cdHBlcmNlbnQgPSAxMDAgLSBwZXJjZW50IGlmIHJldmVyc2VkXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQkKGJhcikuY3NzKCd3aWR0aCcsIHBlcmNlbnQgKyAnJScpXHJcblx0JChiYXIpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIE1hdGgubGVycENvbG9ycyhwZXJjZW50IC8gMTAwLCBjYSwgY2IpKSBpZiBjYT8gYW5kIGNiP1xyXG5cclxuXHJcblxyXG5cdCQobGFiZWwpLnRleHQobm93ICsgJyAvICcgKyBtYXgpXHJcblxyXG4kIC0+IFxyXG5cdCQoJy5wcm9ncmVzcycpLmVhY2ggLT5cclxuXHRcdHRoaXMudXBkYXRlIG9yPSB1cGRhdGVQcm9ncmVzc1xyXG5cclxuXHJcblxyXG5yZWxNb3VzZUNvb3JkcyA9IGBmdW5jdGlvbiAoZXZlbnQpe1xyXG4gICAgdmFyIHRvdGFsT2Zmc2V0WCA9IDA7XHJcbiAgICB2YXIgdG90YWxPZmZzZXRZID0gMDtcclxuICAgIHZhciBjYW52YXNYID0gMDtcclxuICAgIHZhciBjYW52YXNZID0gMDtcclxuICAgIHZhciBjdXJyZW50RWxlbWVudCA9IHRoaXM7XHJcblxyXG4gICAgZG97XHJcbiAgICAgICAgdG90YWxPZmZzZXRYICs9IGN1cnJlbnRFbGVtZW50Lm9mZnNldExlZnQgLSBjdXJyZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG4gICAgICAgIHRvdGFsT2Zmc2V0WSArPSBjdXJyZW50RWxlbWVudC5vZmZzZXRUb3AgLSBjdXJyZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICB9XHJcbiAgICB3aGlsZShjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50Lm9mZnNldFBhcmVudClcclxuXHJcbiAgICBjYW52YXNYID0gZXZlbnQucGFnZVggLSB0b3RhbE9mZnNldFg7XHJcbiAgICBjYW52YXNZID0gZXZlbnQucGFnZVkgLSB0b3RhbE9mZnNldFk7XHJcblxyXG4gICAgcmV0dXJuIHt4OmNhbnZhc1gsIHk6Y2FudmFzWX1cclxufWBcclxuXHJcbkhUTUxDYW52YXNFbGVtZW50LnByb3RvdHlwZS5yZWxNb3VzZUNvb3JkcyA9IHJlbE1vdXNlQ29vcmRzO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbigtPlxyXG5cclxuXHRvbGRTaG93ID0gJC5mbi5zaG93XHJcblxyXG5cdCMjI1xyXG5cclxuXHJcblx0JC5mbi5zaG93ID0gKHNwZWVkLCBvbGRDYWxsYmFjaykgLT5cclxuXHJcblx0XHRjb25zb2xlLmxvZygnc2hvdycsIHRoaXMpXHJcblxyXG5cdFx0bmV3Q2FsbGJhY2sgPSAtPlxyXG5cclxuXHRcdFx0b2xkQ2FsbGJhY2suYXBwbHkodGhpcykgaWYgJC5pc0Z1bmN0aW9uKG9sZENhbGxiYWNrKVxyXG5cdFx0XHQkKHRoaXMpLnRyaWdnZXIoJ2FmdGVyU2hvdycpXHJcblxyXG5cdFx0JCh0aGlzKS50cmlnZ2VyKCdiZWZvcmVTaG93JylcclxuXHJcblx0XHRkZWVwID0gJCh0aGlzKS5maW5kKCdbZGF0YS1kZWVwc2hvd10nKVxyXG5cclxuXHRcdGlmIGRlZXAubGVuZ3RoXHJcblx0XHRcdGRlZXAuc2hvdygpXHJcblxyXG5cdFx0b2xkU2hvdy5hcHBseSh0aGlzLCBbc3BlZWQsIG5ld0NhbGxiYWNrXSlcclxuXHQjIyNcclxuKSgpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5lc2NhcGUgb3I9IC0+XHJcblx0dGhpcy5yZXBsYWNlKC8oWy4qKz9ePSE6JHt9KCl8XFxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG5cclxuXHJcblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCBvcj0gKHNlYXJjaCwgcmVwbGFjZSkgLT5cclxuXHR0aGlzLnJlcGxhY2UobmV3IFJlZ0V4cChzZWFyY2guZXNjYXBlKCksICdnaScpLCByZXBsYWNlKSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==