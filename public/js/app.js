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

  this.app.controller('PlayerController', ['$scope', function($scope) {}]);

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
    } else {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdmF0YXIuY29mZmVlIiwiYmF0dGxlLmNvZmZlZSIsImNoYXQuY29mZmVlIiwiY2xvY2suY29mZmVlIiwiZGlhbG9nLmNvZmZlZSIsImVtb3RpY29uLmNvZmZlZSIsImVxdWFsaXplci5jb2ZmZWUiLCJmb3JtLmNvZmZlZSIsImhlbHBlci5jb2ZmZWUiLCJpZWZpeC5jb2ZmZWUiLCJpbWFnZVByZXZpZXcuY29mZmVlIiwibGFuZ3VhZ2UuY29mZmVlIiwibmF2Zml4LmNvZmZlZSIsInBsYW50YXRpb24uY29mZmVlIiwicGxheWVyLmNvZmZlZSIsInNxdWFyZS5jb2ZmZWUiLCJzdGF0aXN0aWNzLmNvZmZlZSIsInRpbWVyLmNvZmZlZSIsInRvb2x0aXAuY29mZmVlIiwidHV0b3JpYWwuY29mZmVlIiwidXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BO0VBQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFBdUIsRUFBdkI7O0VBSVAsSUFBQyxDQUFBLEdBQUcsQ0FBQyxVQUFMLENBQWdCLGdCQUFoQixFQUFrQztJQUFDLFFBQUQsRUFBVyxTQUFDLE1BQUQ7YUFHNUMsTUFBTSxDQUFDLEtBQVAsR0FBZSxTQUFDLEtBQUQsRUFBUSxTQUFSO0FBRWQsWUFBQTtRQUFBLENBQUEsdUJBQUksWUFBWTtRQUNoQixDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBYjtlQUVKLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBQSxHQUFRLENBQW5CLENBQUEsR0FBd0I7TUFMVjtJQUg2QixDQUFYO0dBQWxDOztFQWNBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixrQkFBaEIsRUFBb0MsQ0FBQyxRQUFELEVBQVcsU0FBQyxNQUFELEdBQUEsQ0FBWCxDQUFwQztBQWxCQTs7O0FDSkE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxTQUFBO0lBQ1QsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLFdBQWIsQ0FBeUIsUUFBekI7SUFDQSxDQUFBLENBQUUsU0FBRixDQUFZLENBQUMsR0FBYixDQUFpQixDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLFFBQWIsQ0FBakI7V0FDQSxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsUUFBUixDQUFpQixRQUFqQjtFQUhTOztFQU1WLENBQUEsQ0FBRSxTQUFBO1dBQ0QsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLEtBQWIsQ0FBbUIsT0FBbkIsQ0FBMkIsQ0FBQyxLQUE1QixDQUFBLENBQW1DLENBQUMsT0FBcEMsQ0FBNEMsT0FBNUM7RUFEQyxDQUFGO0FBTkE7OztBQ0ZBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQ0M7SUFBQSxRQUFBLEVBQVUsRUFBVjtJQUNBLFdBQUEsRUFBYSxFQURiO0lBRUEsWUFBQSxFQUFjLEVBRmQ7SUFHQSxNQUFBLEVBQVEsQ0FIUjtJQUlBLFFBQUEsRUFBVSxJQUFBLEdBQU8sRUFKakI7OztFQVFLO0lBR1EsbUJBQUMsSUFBRCxFQUFPLElBQVA7QUFFWixVQUFBO01BQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFBO01BQ1osS0FBSyxDQUFDLEdBQU4sR0FBWSxJQUFJLENBQUM7TUFDakIsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2QsS0FBQyxDQUFBLE1BQUQsR0FBVTtRQURJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQUtmLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsSUFBRCxHQUFRLElBQUksQ0FBQztNQUNiLElBQUMsQ0FBQSxFQUFELEdBQU0sSUFBSSxDQUFDO01BQ1gsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUM7TUFDZCxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQztNQUNmLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSSxDQUFDO0lBZE47O3dCQWlCYixJQUFBLEdBQU0sU0FBQyxPQUFELEVBQVUsSUFBVjtBQUNMLFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFELEtBQVMsS0FBWjtRQUNDLE9BQU8sQ0FBQyxXQUFSLEdBQXNCO1FBQ3RCLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLHlCQUZyQjtPQUFBLE1BQUE7UUFJQyxPQUFPLENBQUMsV0FBUixHQUFzQjtRQUN0QixPQUFPLENBQUMsU0FBUixHQUFvQiwwQkFMckI7O01BT0EsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0IsQ0FBcEIsRUFBdUIsSUFBdkIsRUFBNkIsSUFBN0I7TUFDQSxPQUFPLENBQUMsVUFBUixDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixJQUF6QixFQUErQixJQUEvQjtNQUVBLElBQUcsbUJBQUg7UUFDQyxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFDLENBQUEsTUFBbkIsRUFBMkIsTUFBTSxDQUFDLE1BQWxDLEVBQTBDLE1BQU0sQ0FBQyxNQUFqRCxFQUF5RCxJQUFBLEdBQU8sTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBaEYsRUFBbUYsSUFBQSxHQUFPLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQTFHLEVBREQ7O01BR0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBUixHQUFlLElBQUMsQ0FBQSxLQUFoQixHQUF3QjtNQUUvQixPQUFPLENBQUMsSUFBUixHQUFlLE1BQU0sQ0FBQyxZQUFQLEdBQXNCO01BQ3JDLE9BQU8sQ0FBQyxTQUFSLEdBQW9CO01BQ3BCLE9BQU8sQ0FBQyxTQUFSLEdBQW9CO01BQ3BCLE9BQU8sQ0FBQyxXQUFSLEdBQXNCO01BQ3RCLE9BQUEsR0FBVSxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFwQjtNQUNWLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBQWpCLEVBQXVCLENBQUMsSUFBQSxHQUFPLE9BQU8sQ0FBQyxLQUFoQixDQUFBLEdBQXlCLENBQWhELEVBQW1ELE1BQU0sQ0FBQyxZQUExRDtNQUNBLE9BQU8sQ0FBQyxVQUFSLENBQW1CLElBQW5CLEVBQXlCLENBQUMsSUFBQSxHQUFPLE9BQU8sQ0FBQyxLQUFoQixDQUFBLEdBQXlCLENBQWxELEVBQXFELE1BQU0sQ0FBQyxZQUE1RDtNQUdBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsTUFBTSxDQUFDLFdBQVAsR0FBcUI7TUFDcEMsT0FBTyxDQUFDLFdBQVIsR0FBc0I7TUFDdEIsT0FBTyxDQUFDLFNBQVIsR0FBb0I7TUFDcEIsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsTUFBTSxDQUFDLE1BQXhCLEVBQWdDLElBQUEsR0FBTyxNQUFNLENBQUMsV0FBZCxHQUE0QixNQUFNLENBQUMsTUFBbkUsRUFBMkUsSUFBQSxHQUFPLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQWxHLEVBQXFHLE1BQU0sQ0FBQyxXQUE1RztNQUNBLE9BQU8sQ0FBQyxVQUFSLENBQW1CLE1BQU0sQ0FBQyxNQUExQixFQUFrQyxJQUFBLEdBQU8sTUFBTSxDQUFDLFdBQWQsR0FBNEIsTUFBTSxDQUFDLE1BQXJFLEVBQTZFLElBQUEsR0FBTyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFwRyxFQUF1RyxNQUFNLENBQUMsV0FBOUc7TUFFQSxPQUFPLENBQUMsU0FBUixHQUFvQjtNQUNwQixPQUFPLENBQUMsUUFBUixDQUFpQixNQUFNLENBQUMsTUFBeEIsRUFBZ0MsSUFBQSxHQUFPLE1BQU0sQ0FBQyxXQUFkLEdBQTRCLE1BQU0sQ0FBQyxNQUFuRSxFQUEyRSxDQUFDLElBQUEsR0FBTyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUF4QixDQUFBLEdBQTZCLENBQUMsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsU0FBWixDQUF4RyxFQUFnSSxNQUFNLENBQUMsV0FBdkk7TUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBWixDQUFBLEdBQXNCLEtBQXRCLEdBQThCLElBQUMsQ0FBQTtNQUN0QyxPQUFBLEdBQVUsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsSUFBcEI7TUFDVixPQUFPLENBQUMsU0FBUixHQUFvQjthQUNwQixPQUFPLENBQUMsUUFBUixDQUFpQixJQUFqQixFQUF1QixDQUFDLElBQUEsR0FBTyxPQUFPLENBQUMsS0FBaEIsQ0FBQSxHQUF5QixDQUFoRCxFQUFtRCxJQUFBLEdBQU8sTUFBTSxDQUFDLFdBQVAsR0FBcUIsQ0FBL0U7SUFyQ0s7Ozs7OztFQTJDRDtxQkFFTCxLQUFBLEdBQ0M7TUFBQSxJQUFBLEVBQU0sR0FBTjtNQUNBLElBQUEsRUFBTSxHQUROO01BRUEsSUFBQSxFQUFNLEdBRk47OztJQU9ZLGdCQUFDLE9BQUQ7TUFFWixJQUFDLENBQUEsTUFBRCxHQUFVLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxRQUFYLENBQW9CLFFBQXBCLENBQThCLENBQUEsQ0FBQTtNQUN4QyxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixJQUFuQjtNQUVYLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsUUFBWCxDQUFvQixhQUFwQixDQUFrQyxDQUFDLEtBQW5DLENBQUEsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFBLENBQVo7SUFMRDs7cUJBWWIsSUFBQSxHQUFNLFNBQUE7QUFFTCxVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxVQUFELEdBQWM7TUFDZCxJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFFVCxDQUFBLENBQUUsSUFBQyxDQUFBLE1BQUgsQ0FBVSxDQUFDLEtBQVgsQ0FBaUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQVcsS0FBQyxDQUFBLEtBQUQsQ0FBTyxLQUFQO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpCO01BQ0EsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQVcsS0FBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCO0FBRUE7QUFBQSxXQUFBLHFDQUFBOztRQUNDLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQVUsS0FBVixFQUFpQixJQUFqQjtRQUNoQixJQUFDLENBQUEsVUFBVyxDQUFBLFNBQVMsQ0FBQyxFQUFWLENBQVosR0FBNEI7QUFGN0I7QUFLQTtBQUFBLFdBQUEsd0NBQUE7O1FBQ0MsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVSxNQUFWLEVBQWtCLElBQWxCO1FBQ2hCLElBQUMsQ0FBQSxVQUFXLENBQUEsU0FBUyxDQUFDLEVBQVYsQ0FBWixHQUE0QjtBQUY3QjtNQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQixNQUFNLENBQUMsUUFBUCxHQUFrQjtNQUdsQyxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxTQUFVLENBQUEsS0FBQSxDQUFPLENBQUEsSUFBQyxDQUFBLEtBQUQ7TUFDNUIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsVUFBVyxDQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUjtNQUN4QixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxVQUFXLENBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSO2FBRXhCO0lBM0JLOztxQkFnQ04sY0FBQSxHQUFnQixTQUFDLFFBQUQsRUFBVyxRQUFYO0FBRWYsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUI7TUFDeEIsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQjtNQUU1QixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFtQixDQUFDLFNBQUEsR0FBWSxJQUFiLENBQUEsR0FBcUIsQ0FBeEMsRUFBMkMsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBbEIsQ0FBQSxHQUEwQixDQUFyRTtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBQyxDQUFBLE9BQWYsRUFBd0IsSUFBeEI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQW1CLENBQUMsU0FBQSxHQUFZLElBQWIsQ0FBQSxHQUFxQixDQUFyQixHQUF5QixTQUE1QyxFQUF1RCxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFsQixDQUFBLEdBQTBCLENBQWpGO01BQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYyxJQUFDLENBQUEsT0FBZixFQUF3QixJQUF4QjthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBO0lBYmU7O3FCQWdCaEIsUUFBQSxHQUFVLFNBQUMsSUFBRDtBQUNULFVBQUE7TUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQWdCO01BQzVCLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUI7TUFDOUIsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtNQUU3QixVQUFBLEdBQWE7TUFDYixTQUFBLEdBQVksVUFBQSxHQUFhO01BQ3pCLEtBQUEsR0FBUSxTQUFBLEdBQVksQ0FBQyxTQUFBLEdBQVksVUFBYixDQUFBLEdBQTJCO01BQy9DLEtBQUEsR0FBUTtNQUNSLEtBQUEsR0FBUSxDQUFDLFNBQUEsR0FBWSxHQUFiLENBQUEsR0FBb0I7TUFDNUIsS0FBQSxHQUFRO01BQ1IsU0FBQSxHQUFZO01BRVosSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULEdBQWdCLE1BQU0sQ0FBQyxRQUFQLEdBQWtCO01BQ2xDLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBckI7TUFDVixLQUFBLEdBQVEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxLQUFSLEdBQWdCO01BQ2hDLEtBQUEsR0FBUTtNQUlSLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO01BQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixLQUExQjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsS0FBdEI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUI7TUFDckIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCO01BQ3ZCLElBQUMsQ0FBQSxRQUFELENBQVUsU0FBVixFQUFxQixVQUFBLEdBQWEsR0FBbEMsRUFBdUMsVUFBdkM7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQTtNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEtBQTFCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO01BQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixDQUF4QixFQUEyQixDQUEzQjthQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBO0lBakNTOztxQkFvQ1YsUUFBQSxHQUFVLFNBQUMsS0FBRCxFQUFRLFdBQVIsRUFBcUIsV0FBckI7QUFDVCxVQUFBO01BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBVixHQUFjO01BQ3BCLElBQUEsR0FBTyxJQUFJLENBQUMsRUFBTCxHQUFVO01BRWpCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFBO01BQ0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxDQUFBLEdBQWdCO01BQ3BCLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsQ0FBQSxHQUFnQjtNQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7TUFDQSxHQUFBLElBQU87QUFFUCxXQUFTLGdGQUFUO1FBQ0MsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxDQUFBLEdBQWdCO1FBQ3BCLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsQ0FBQSxHQUFnQjtRQUNwQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkI7UUFDQSxHQUFBLElBQU87UUFFUCxDQUFBLEdBQUksSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULENBQUEsR0FBZ0I7UUFDcEIsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsR0FBVCxDQUFBLEdBQWdCO1FBQ3BCLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQjtRQUNBLEdBQUEsSUFBTztBQVRSO01BV0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLENBQWhCLEVBQW1CLENBQUMsV0FBcEI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULENBQUE7SUF4QlM7O3FCQTJCVixVQUFBLEdBQVksU0FBQTtNQUVYLElBQUcsSUFBQyxDQUFBLFNBQVUsQ0FBQSxLQUFBLENBQWQ7ZUFFQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBRmI7T0FBQSxNQUFBO2VBTUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQU5iOztJQUZXOztxQkFXWixJQUFBLEdBQU0sU0FBQyxLQUFEO0FBRUwsVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQjtNQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFqQyxFQUF3QyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQWhEO01BQ0EsSUFBQyxDQUFBLE1BQUQsSUFBVyxJQUFDLENBQUEsS0FBTSxDQUFBLElBQUMsQ0FBQSxLQUFELENBQVAsR0FBaUI7TUFDNUIsT0FBQSxHQUFVO01BRVYsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLE1BQVYsSUFBcUIsT0FBeEI7UUFDQyxNQUFBLEdBQVMsSUFBQyxDQUFBLFNBQVUsQ0FBQSxLQUFBLENBQU8sQ0FBQSxJQUFDLENBQUEsS0FBRDtRQUMzQixRQUFBLEdBQVcsSUFBQyxDQUFBLFVBQVcsQ0FBQSxNQUFNLENBQUMsUUFBUDtRQUN2QixRQUFBLEdBQVcsSUFBQyxDQUFBLFVBQVcsQ0FBQSxNQUFNLENBQUMsUUFBUDtRQUV2QixJQUFHLE1BQU0sQ0FBQyxJQUFQLEtBQWUsS0FBbEI7VUFDQyxRQUFRLENBQUMsTUFBVCxHQUFrQixNQUFNLENBQUMsT0FEMUI7O1FBR0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUI7UUFFQSxJQUFHLElBQUMsQ0FBQSxNQUFELEdBQVUsR0FBVixJQUFrQixDQUFJLElBQUMsQ0FBQSxLQUExQjtVQUNDLElBQUMsQ0FBQSxNQUFELEdBQVU7VUFDVixRQUFRLENBQUMsV0FBVCxHQUF1QixRQUFRLENBQUM7VUFFaEMsSUFBRyxNQUFNLENBQUMsSUFBUCxLQUFlLEtBQWxCO1lBQ0MsUUFBUSxDQUFDLFNBQVQsR0FBcUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxRQUFRLENBQUMsTUFBVCxHQUFrQixNQUFNLENBQUMsTUFBbEMsRUFBMEMsQ0FBMUMsRUFEdEI7V0FBQSxNQUFBO1lBR0MsUUFBUSxDQUFDLFNBQVQsR0FBcUIsUUFBUSxDQUFDLE9BSC9COztVQUtBLElBQUMsQ0FBQSxLQUFELEdBQVMsT0FUVjs7UUFXQSxPQUFBLEdBQVUsTUFyQlg7O01BdUJBLElBQUcsSUFBQyxDQUFBLEtBQUQsS0FBVSxNQUFWLElBQXFCLE9BQXhCO1FBQ0MsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFVLENBQUEsS0FBQSxDQUFPLENBQUEsSUFBQyxDQUFBLEtBQUQ7UUFDM0IsUUFBQSxHQUFXLElBQUMsQ0FBQSxVQUFXLENBQUEsTUFBTSxDQUFDLFFBQVA7UUFDdkIsUUFBQSxHQUFXLElBQUMsQ0FBQSxVQUFXLENBQUEsTUFBTSxDQUFDLFFBQVA7UUFFdkIsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUI7UUFFQSxJQUFHLElBQUMsQ0FBQSxNQUFELElBQVcsR0FBZDtVQUNDLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxHQUF1QixJQUFDLENBQUE7VUFDeEIsUUFBUSxDQUFDLE1BQVQsR0FBa0IsUUFBUSxDQUFDLFlBRjVCO1NBQUEsTUFBQTtVQUlDLElBQUcsSUFBQyxDQUFBLE1BQUQsSUFBVyxHQUFkO1lBQ0MsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCO1lBRXZCLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUMsQ0FBQSxNQUFELEdBQVUsR0FBckIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0I7WUFDSixRQUFRLENBQUMsTUFBVCxHQUFrQixJQUFJLENBQUMsSUFBTCxDQUFVLENBQVYsRUFBYSxRQUFRLENBQUMsU0FBdEIsRUFBaUMsUUFBUSxDQUFDLFdBQTFDLEVBSm5CO1dBQUEsTUFBQTtZQU9DLFFBQVEsQ0FBQyxNQUFULEdBQWtCLFFBQVEsQ0FBQztZQUMzQixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsR0FBdUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQWhCLEVBQXdCLENBQXhCLEVBUnhCO1dBSkQ7O1FBY0EsSUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVLEdBQWI7VUFDQyxJQUFDLENBQUEsTUFBRCxHQUFVO1VBQ1YsSUFBQyxDQUFBLEtBQUQsR0FBUyxPQUZWOztRQUlBLElBQUcsTUFBTSxDQUFDLElBQVAsS0FBZSxLQUFsQjtVQUNDLElBQUEsR0FBTyxNQUFNLENBQUM7VUFFZCxJQUFHLE1BQU0sQ0FBQyxJQUFWO1lBQ0MsSUFBQSxJQUFRLElBRFQ7V0FIRDtTQUFBLE1BQUE7VUFPQyxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQVBwQjs7UUFXQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQVY7UUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsR0FBdUI7UUFDdkIsT0FBQSxHQUFVLE1BeENYOztNQTBDQSxJQUFHLElBQUMsQ0FBQSxLQUFELEtBQVUsTUFBVixJQUFxQixPQUF4QjtRQUVDLFVBQUEsR0FBYSxJQUFDLENBQUEsU0FBVSxDQUFBLEtBQUEsQ0FBTyxDQUFBLElBQUMsQ0FBQSxLQUFEO1FBQy9CLFVBQUEsR0FBYSxJQUFDLENBQUEsU0FBVSxDQUFBLEtBQUEsQ0FBTyxDQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBVDtRQUcvQixZQUFBLEdBQWUsSUFBQyxDQUFBLFVBQVcsQ0FBQSxVQUFVLENBQUMsUUFBWDtRQUMzQixZQUFBLEdBQWUsSUFBQyxDQUFBLFVBQVcsQ0FBQSxVQUFVLENBQUMsUUFBWDtRQUczQixRQUFBLEdBQVcsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsQ0FBbEIsQ0FBQSxHQUF1QixJQUFDLENBQUE7UUFFbkMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQUE7UUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBQyxRQUF2QjtRQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLFlBQWhCLEVBQThCLFlBQTlCO1FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUE7UUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBQTtRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsUUFBdkM7UUFFQSxJQUFHLGtCQUFIO1VBQ0MsWUFBQSxHQUFlLElBQUMsQ0FBQSxVQUFXLENBQUEsVUFBVSxDQUFDLFFBQVg7VUFDM0IsWUFBQSxHQUFlLElBQUMsQ0FBQSxVQUFXLENBQUEsVUFBVSxDQUFDLFFBQVg7VUFFM0IsSUFBRyxVQUFVLENBQUMsSUFBWCxLQUFtQixLQUF0QjtZQUNDLFlBQVksQ0FBQyxNQUFiLEdBQXNCLFVBQVUsQ0FBQyxPQURsQzs7VUFHQSxJQUFDLENBQUEsY0FBRCxDQUFnQixZQUFoQixFQUE4QixZQUE5QixFQVBEO1NBQUEsTUFBQTtVQVVDLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBRCxDQUFBO1VBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO1VBQ3JCLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBckI7VUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0IsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0IsT0FBTyxDQUFDLEtBQXpCLENBQUEsR0FBa0MsQ0FBMUQsRUFBNkQsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsRUFBbEIsQ0FBQSxHQUF3QixDQUFyRixFQWJEOztRQWVBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBO1FBRUEsSUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVLEdBQWI7VUFDQyxJQUFDLENBQUEsS0FBRDtVQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7VUFDVixJQUFHLGtCQUFIO1lBQ0MsSUFBQyxDQUFBLEtBQUQsR0FBUyxPQURWO1dBQUEsTUFBQTtZQUdDLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFIVjtXQUhEOztRQVFBLE9BQUEsR0FBVSxNQTlDWDs7TUFpREEsSUFBRyxJQUFDLENBQUEsS0FBRCxLQUFVLEtBQVYsSUFBb0IsT0FBdkI7UUFDQyxJQUFBLEdBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBQTtRQUNQLElBQUMsQ0FBQSxNQUFELEdBQVU7UUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsR0FBcUI7UUFDckIsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixJQUFyQjtRQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixPQUFPLENBQUMsS0FBekIsQ0FBQSxHQUFrQyxDQUExRCxFQUE2RCxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixFQUFsQixDQUFBLEdBQXdCLENBQXJGO1FBQ0EsT0FBQSxHQUFVLE1BTlg7O01BV0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQjtNQUN4QixNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO01BRTFCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFBO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCO01BQ3ZCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQjtNQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUIsTUFBQSxHQUFTLEVBQTlCLEVBQWtDLEtBQWxDLEVBQXlDLEVBQXpDO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxVQUFULENBQW9CLENBQXBCLEVBQXVCLE1BQUEsR0FBUyxFQUFoQyxFQUFvQyxLQUFwQyxFQUEyQyxFQUEzQztNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQjtNQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsQ0FBbEIsRUFBcUIsTUFBQSxHQUFTLEVBQTlCLEVBQWtDLEtBQUEsR0FBUSxDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLElBQUMsQ0FBQSxTQUFVLENBQUEsS0FBQSxDQUFNLENBQUMsTUFBbEIsR0FBMkIsQ0FBNUIsQ0FBbEIsRUFBa0QsQ0FBbEQsQ0FBRCxDQUExQyxFQUFrRyxFQUFsRztNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQjtBQUVyQjtBQUFBLFdBQUEscUNBQUE7O1FBRUMsSUFBRyxJQUFJLENBQUMsSUFBTCxLQUFhLFNBQWhCO1VBQ0MsSUFBQyxDQUFBLE9BQU8sQ0FBQyxXQUFULEdBQXVCLFVBRHhCOztRQUdBLEVBQUEsR0FBSyxDQUFDLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBQyxJQUFDLENBQUEsU0FBVSxDQUFBLEtBQUEsQ0FBTSxDQUFDLE1BQWxCLEdBQTJCLENBQTVCLENBQVgsQ0FBQSxHQUE2QztRQUVsRCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsQ0FBQTtRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixFQUFBLEdBQUssSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLENBQTFCLEdBQThCLENBQTlDLEVBQWlELE1BQUEsR0FBUyxFQUExRDtRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixFQUFBLEdBQUssSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCLENBQTFCLEdBQThCLENBQTlDLEVBQWlELE1BQWpEO1FBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUE7QUFWRDthQVlBLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFBO0lBN0pLOztxQkFrS04sS0FBQSxHQUFPLFNBQUMsS0FBRDtBQUNOLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLEtBQXZCO01BQ1QsQ0FBQSxHQUFJLE1BQU0sQ0FBQztNQUNYLENBQUEsR0FBSSxNQUFNLENBQUM7TUFFWCxDQUFBLEdBQUk7TUFDSixDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBWixHQUFvQjtNQUN4QixDQUFBLEdBQUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCO01BQ3JCLENBQUEsR0FBSSxDQUFBLEdBQUk7TUFHUixJQUFHLENBQUEsSUFBSyxDQUFMLElBQVcsQ0FBQSxJQUFLLENBQWhCLElBQXNCLENBQUEsSUFBSyxDQUEzQixJQUFpQyxDQUFBLElBQUssQ0FBekM7UUFDQyxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFWLEdBQW9CLENBQUMsSUFBQyxDQUFBLFNBQVUsQ0FBQSxLQUFBLENBQU0sQ0FBQyxNQUFsQixHQUEyQixDQUE1QixDQUEvQjtRQUNULElBQUMsQ0FBQSxLQUFELEdBQVM7ZUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVLElBSFg7O0lBWE07O3FCQWdCUCxHQUFBLEdBQUssU0FBQyxLQUFEO01BRUosSUFBRyxLQUFLLENBQUMsS0FBTixLQUFlLEVBQWxCO1FBQ0MsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFDLElBQUMsQ0FBQSxNQURaOztNQUlBLElBQUcsS0FBSyxDQUFDLEtBQU4sS0FBZSxFQUFsQjtRQUNDLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQWxCLEVBQXFCLENBQXJCO1FBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtRQUNWLElBQUMsQ0FBQSxLQUFELEdBQVMsT0FIVjs7TUFLQSxJQUFHLEtBQUssQ0FBQyxLQUFOLEtBQWUsRUFBbEI7UUFDQyxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFsQixFQUFxQixJQUFDLENBQUEsU0FBVSxDQUFBLEtBQUEsQ0FBTSxDQUFDLE1BQWxCLEdBQTJCLENBQWhEO1FBQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVTtlQUNWLElBQUMsQ0FBQSxLQUFELEdBQVMsT0FIVjs7SUFYSTs7cUJBaUJMLFlBQUEsR0FBYyxTQUFDLElBQUQ7QUFFYixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQSxHQUFPLElBQUMsQ0FBQSxRQUFqQixFQUEyQixDQUEzQjtNQUNSLElBQUMsQ0FBQSxRQUFELEdBQVk7TUFDWixJQUFDLENBQUEsV0FBRCxJQUFnQjtBQUVoQixhQUFNLElBQUMsQ0FBQSxXQUFELElBQWdCLE1BQU0sQ0FBQyxRQUE3QjtRQUVDLElBQUMsQ0FBQSxXQUFELElBQWdCLE1BQU0sQ0FBQztRQUN2QixJQUFDLENBQUEsSUFBRCxDQUFNLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLElBQXhCO01BSEQ7YUFLQSxNQUFNLENBQUMscUJBQVAsQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQVUsS0FBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkO1FBQVY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO0lBWGE7O3FCQWNkLEtBQUEsR0FBTyxTQUFBO01BRU4sSUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUg7UUFFQyxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLElBQUEsQ0FBQSxDQUFNLENBQUMsT0FBUCxDQUFBO1FBQ2hCLElBQUMsQ0FBQSxXQUFELEdBQWU7ZUFDZixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxRQUFmLEVBSkQ7O0lBRk07Ozs7OztFQVdSLENBQUEsQ0FBRSxTQUFBO1dBRUQsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsTUFBbEIsRUFBMEIsU0FBQTtBQUV6QixVQUFBO01BQUEsTUFBQSxHQUFhLElBQUEsTUFBQSxDQUFPLElBQVA7YUFDYixNQUFNLENBQUMsS0FBUCxDQUFBO0lBSHlCLENBQTFCLENBS0MsQ0FBQyxNQUxGLENBS1MsVUFMVCxDQUtvQixDQUFDLE9BTHJCLENBSzZCLE1BTDdCO0VBRkMsQ0FBRjtBQXBiQTs7O0FDRUE7RUFBTSxJQUFDLENBQUE7QUFFTixRQUFBOztJQUFBLFFBQUEsR0FBVztNQUVWLFVBQUEsRUFBWSxJQUZGO01BR1YsU0FBQSxFQUFXLElBSEQ7TUFJVixXQUFBLEVBQWEsSUFKSDtNQUtWLFFBQUEsRUFBVSxDQUxBO01BTVYsT0FBQSxFQUFTLENBTkM7TUFPVixTQUFBLEVBQVcsQ0FQRDtNQVFWLFNBQUEsRUFBVyxHQVJEO01BU1YsUUFBQSxFQUFVLEVBVEE7TUFVVixJQUFBLEVBQU0sR0FWSTtNQVlWLFNBQUEsRUFBVyxJQVpEO01BYVYsWUFBQSxFQUFjLElBYko7TUFjVixTQUFBLEVBQVcsRUFkRDtNQWVWLFlBQUEsRUFBYyxFQWZKO01BZ0JWLFVBQUEsRUFBWSxNQWhCRjtNQWlCVixhQUFBLEVBQWUsS0FqQkw7OztJQW9CWCxRQUFBLEdBQVc7TUFFVixPQUFBLEVBQVMsYUFGQzs7O0lBUUUsY0FBQyxPQUFELEVBQVUsT0FBVjtBQUlaLFVBQUE7TUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsUUFBYixFQUF1QixPQUF2QjtNQUVOLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBRyxDQUFDO01BQ2xCLElBQUMsQ0FBQSxTQUFELEdBQWEsR0FBRyxDQUFDO01BQ2pCLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFBO01BR2pCLElBQUMsQ0FBQSxTQUFELEdBQWEsR0FBRyxDQUFDO01BQ2pCLElBQUMsQ0FBQSxZQUFELEdBQWdCLEdBQUcsQ0FBQztNQUNwQixJQUFDLENBQUEsWUFBRCxHQUFnQixHQUFHLENBQUM7TUFDcEIsSUFBQyxDQUFBLFNBQUQsR0FBYSxHQUFHLENBQUM7TUFDakIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBRyxDQUFDO01BQ3JCLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBRyxDQUFDO01BS2xCLElBQUMsQ0FBQSxLQUFELEdBQVMsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsUUFBaEI7TUFDVCxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxJQUFYLENBQWdCLFNBQWhCO01BQ1YsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsSUFBWCxDQUFnQixPQUFoQjtNQUNYLElBQUMsQ0FBQSxRQUFELEdBQVksQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsUUFBaEI7TUFDWixJQUFDLENBQUEsWUFBRCxHQUFnQixDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsSUFBWCxDQUFnQixZQUFoQjtNQUdoQixJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxDQUFBLFlBQXBCLEVBQWtDLElBQUMsQ0FBQSxLQUFuQztNQUVBLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBWCxHQUF1QixJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDO01BRWxDLENBQUEsQ0FBRSxJQUFDLENBQUEsS0FBSCxDQUFTLENBQUMsT0FBVixDQUFrQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsS0FBRDtpQkFBVyxLQUFDLENBQUEsS0FBRCxDQUFPLEtBQVA7UUFBWDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEI7TUFHQSxDQUFBLENBQUUsSUFBQyxDQUFBLE9BQUgsQ0FBVyxDQUFDLEtBQVosQ0FBbUIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBRWxCLEtBQUMsQ0FBQSxJQUFELENBQUE7aUJBQ0EsS0FBQyxDQUFBLFVBQUQsQ0FBQTtRQUhrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7TUFNQSxDQUFBLENBQUUsSUFBQyxDQUFBLFFBQUgsQ0FBWSxDQUFDLEtBQWIsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUVuQixLQUFDLENBQUEsV0FBRCxDQUFBO1FBRm1CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtNQU9BLElBQUMsQ0FBQSxRQUFELEdBQVksR0FBRyxDQUFDO01BR2hCLElBQUMsQ0FBQSxJQUFELEdBQVEsR0FBRyxDQUFDO01BRVosSUFBQyxDQUFBLFFBQUQsR0FBWSxHQUFHLENBQUM7TUFDaEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUssSUFBQSxJQUFBLENBQUEsQ0FBTCxDQUFZLENBQUMsT0FBYixDQUFBLENBQUEsR0FBeUIsSUFBcEMsQ0FBQSxHQUE0QyxJQUFDLENBQUE7TUFFckQsSUFBQyxDQUFBLEtBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFDLENBQUEsSUFBRCxHQUFRLEdBQUcsQ0FBQyxPQUFyQixFQUE4QixDQUE5QjtNQUdSLElBQUMsQ0FBQSxPQUFELENBQUE7SUE1RFk7O21CQW9FYixZQUFBLEdBQWMsU0FBQyxJQUFELEVBQU8sSUFBUDtBQUViLFVBQUE7TUFBQSxJQUFBLGtEQUFnQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUVqRCxJQUFHLGNBQUEsSUFBVSxPQUFPLElBQVAsS0FBZ0IsUUFBN0I7QUFFQyxhQUFBLFNBQUE7O1VBQ0MsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBQSxHQUFNLENBQW5CLEVBQXNCLENBQXRCO0FBRFIsU0FGRDs7YUFLQTtJQVRhOzttQkFhZCxLQUFBLEdBQU8sU0FBQyxJQUFELEVBQU8sSUFBUDtBQUVOLFVBQUE7TUFBQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLGFBQUYsQ0FDUCxDQUFDLFFBRE0sQ0FDRyxPQURILENBRVAsQ0FBQyxRQUZNLENBRUcsY0FGSCxDQUdQLENBQUMsSUFITSxDQUdELElBQUMsQ0FBQSxZQUFELENBQWMsSUFBZCxFQUFvQixJQUFwQixDQUhDO2FBS1IsQ0FBQSxDQUFFLElBQUMsQ0FBQSxNQUFILENBQ0MsQ0FBQyxNQURGLENBQ1MsS0FEVDtJQVBNOzttQkFVUCxLQUFBLEdBQU8sU0FBQyxJQUFELEVBQU8sSUFBUDthQUVOLEtBQUEsQ0FBTSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQWQsRUFBb0IsSUFBcEIsQ0FBTjtJQUZNOzttQkFPUCxLQUFBLEdBQU8sU0FBQTthQUNOLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFLLElBQUEsSUFBQSxDQUFBLENBQUwsQ0FBWSxDQUFDLE9BQWIsQ0FBQSxDQUFBLEdBQXlCLElBQXBDO0lBREY7O21CQUlQLElBQUEsR0FBTSxTQUFBO0FBRUwsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUssSUFBQSxJQUFBLENBQUEsQ0FBTCxDQUFZLENBQUMsT0FBYixDQUFBLENBQUEsR0FBeUIsSUFBcEM7TUFDTixPQUFBLEdBQVUsQ0FBQSxDQUFFLElBQUMsQ0FBQSxLQUFILENBQVMsQ0FBQyxHQUFWLENBQUE7TUFFVixPQUFBLEdBQVUsT0FBTyxDQUFDLEtBQVIsQ0FBYyxXQUFkO01BSVYsSUFBRyxpQkFBQSxJQUFhLG9CQUFoQjtRQUNDLE9BQUEsR0FBVSxPQUFRLENBQUEsQ0FBQTtBQUVsQixhQUFBLGFBQUE7O1VBRUMsSUFBRyxPQUFPLENBQUMsV0FBUixDQUFBLENBQUEsS0FBeUIsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxDQUE1QjtZQUVDLElBQUEsR0FBTyxJQUFLLENBQUEsQ0FBQTtZQUVaLElBQUcsT0FBTyxJQUFQLEtBQWdCLFVBQW5CO2NBQ0MsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWO0FBQ0EscUJBRkQ7YUFKRDs7QUFGRDtRQVVBLElBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUFzQjtVQUFDLE1BQUEsRUFBUSxPQUFUO1NBQXRCO0FBQ0EsZUFkRDs7TUFpQkEsSUFBRyxJQUFDLENBQUEsU0FBSjtRQUVDLElBQUcsT0FBTyxDQUFDLE1BQVIsR0FBaUIsSUFBQyxDQUFBLFNBQXJCO1VBQ0MsSUFBQyxDQUFBLEtBQUQsQ0FBTyxVQUFQLEVBQW1CO1lBQUMsS0FBQSxFQUFPLElBQUMsQ0FBQSxTQUFUO1dBQW5CO0FBQ0EsaUJBRkQ7O1FBSUEsSUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUEsU0FBckI7VUFDQyxLQUFBLENBQU0sU0FBTixFQUFpQjtZQUFDLEtBQUEsRUFBTyxJQUFDLENBQUEsU0FBVDtXQUFqQjtBQUNBLGlCQUZEOztRQUlBLElBQUcsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsUUFBVCxHQUFvQixHQUF2QjtVQUNDLElBQUMsQ0FBQSxLQUFELENBQU8sVUFBUDtBQUNBLGlCQUZEOztRQUtBLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxJQUFDLENBQUEsU0FBZCxFQUF5QjtVQUFDLE9BQUEsRUFBUyxDQUFBLENBQUUsSUFBQyxDQUFBLEtBQUgsQ0FBUyxDQUFDLEdBQVYsQ0FBQSxDQUFWO1NBQXpCO1FBRVAsQ0FBQyxDQUFDLElBQUYsQ0FBTztVQUVOLEdBQUEsRUFBSyxJQUFDLENBQUEsVUFGQTtVQUdOLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFDLElBQUQ7cUJBQVUsS0FBQyxDQUFBLE1BQUQsQ0FBUSxJQUFSO1lBQVY7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSEg7VUFJTixJQUFBLEVBQU0sSUFKQTtVQUtOLFFBQUEsRUFBVSxNQUxKO1VBTU4sTUFBQSxFQUFRLElBQUMsQ0FBQSxVQU5IO1NBQVA7UUFTQSxJQUFDLENBQUEsSUFBRCxHQUFRO2VBQ1IsQ0FBQSxDQUFFLElBQUMsQ0FBQSxPQUFILENBQVcsQ0FBQyxJQUFaLENBQWlCLE1BQWpCLEVBQXlCLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFFBQWxDLEVBM0JEO09BQUEsTUFBQTtlQStCQyxJQUFDLENBQUEsS0FBRCxDQUFPLFlBQVAsRUEvQkQ7O0lBMUJLOzttQkE0RE4sT0FBQSxHQUFTLFNBQUE7QUFFUixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsWUFBSjtRQUVDLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxJQUFDLENBQUEsWUFBZCxFQUE0QjtVQUFDLElBQUEsRUFBTSxJQUFDLENBQUEsSUFBUjtTQUE1QjtRQUVQLENBQUMsQ0FBQyxJQUFGLENBQU87VUFFTixHQUFBLEVBQUssSUFBQyxDQUFBLFVBRkE7VUFHTixJQUFBLEVBQU0sSUFIQTtVQUlOLFFBQUEsRUFBVSxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFBO3FCQUFHLEtBQUMsQ0FBQSxVQUFELENBQUE7WUFBSDtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKSjtVQUtOLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFDLElBQUQ7cUJBQVUsS0FBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaO1lBQVY7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTEg7VUFNTixRQUFBLEVBQVUsTUFOSjtVQU9OLE1BQUEsRUFBUSxJQUFDLENBQUEsYUFQSDtTQUFQO2VBVUEsSUFBQyxDQUFBLEtBQUQsQ0FBQSxFQWREO09BQUEsTUFBQTtlQWlCQyxJQUFDLENBQUEsS0FBRCxDQUFPLGVBQVAsRUFqQkQ7O0lBRlE7O21CQXVCVCxXQUFBLEdBQWEsU0FBQTthQUVaLENBQUEsQ0FBRSxJQUFDLENBQUEsTUFBSCxDQUFVLENBQUMsS0FBWCxDQUFBO0lBRlk7O21CQUtiLFVBQUEsR0FBWSxTQUFBO2FBRVgsQ0FBQSxDQUFFLElBQUMsQ0FBQSxLQUFILENBQVMsQ0FBQyxHQUFWLENBQWMsRUFBZDtJQUZXOzttQkFNWixVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1gsQ0FBQSxDQUFFLFNBQUYsQ0FDQyxDQUFDLElBREYsQ0FDTyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsQ0FBa0IsSUFBSSxDQUFDLE9BQXZCLENBRFAsQ0FFQyxDQUFDLE1BRkYsQ0FJRSxDQUFBLENBQUUsaUJBQUYsQ0FDQyxDQUFDLFFBREYsQ0FDVyxXQURYLENBRUMsQ0FBQyxJQUZGLENBRU8sTUFGUCxFQUVlLElBQUksQ0FBQyxJQUZwQixDQUpGO0lBRFc7O21CQVlaLFVBQUEsR0FBWSxTQUFDLElBQUQ7QUFFWCxVQUFBO01BQUEsR0FBQSxHQUFNLENBQUEsQ0FBRSxhQUFGLENBQ0wsQ0FBQyxRQURJLENBQ0ssS0FETCxDQUVMLENBQUMsUUFGSSxDQUVLLGNBRkwsQ0FHTCxDQUFDLElBSEksQ0FHQyxNQUhELEVBR1MsSUFBSSxDQUFDLElBSGQsQ0FJTCxDQUFDLElBSkksQ0FJQyxRQUpELEVBSVcsSUFBSSxDQUFDLE1BSmhCO01BTU4sSUFBQSxHQUFPLENBQUEsQ0FBRSxhQUFGLENBQ04sQ0FBQyxRQURLLENBQ0ksVUFESjtNQUdQLElBQUEsR0FBTyxDQUFBLENBQUUsYUFBRixDQUNOLENBQUMsUUFESyxDQUNJLFdBREo7TUFHUCxJQUFHLHNCQUFIO1FBRUMsSUFBQSxHQUFPLENBQUEsQ0FBRSxTQUFGLENBQ04sQ0FBQyxJQURLLENBQ0EsTUFEQSxFQUNRLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBSSxDQUFDLE1BQW5CLENBRFIsQ0FFTixDQUFDLFFBRkssQ0FFSSxhQUZKLEVBRlI7T0FBQSxNQUFBO1FBT0MsSUFBQSxHQUFPLENBQUEsQ0FBRSxhQUFGLENBQ04sQ0FBQyxRQURLLENBQ0ksYUFESixFQVBSOztNQVlBLElBQUEsR0FBTyxDQUFBLENBQUUsYUFBRixDQUNOLENBQUMsUUFESyxDQUNJLGNBREo7TUFNUCxNQUFBLEdBQVMsQ0FBQSxDQUFFLGFBQUYsQ0FDUixDQUFDLFFBRE8sQ0FDRSxnQkFERixDQUVSLENBQUMsUUFGTyxDQUVFLGFBRkYsQ0FHUixDQUFDLElBSE8sQ0FHRixLQUhFLEVBR0ssSUFBSSxDQUFDLE1BSFY7TUFNVCxNQUFBLEdBQVMsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLE1BQWIsQ0FFUixDQUFBLENBQUUsbUJBQUYsQ0FDQyxDQUFDLFFBREYsQ0FDVyxXQURYLENBRUMsQ0FBQyxJQUZGLENBRU8sSUFBSSxDQUFDLE1BRlosQ0FGUTtNQU9ULE9BQUEsR0FBVSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVo7TUFJVixDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsQ0FBc0IsQ0FBQyxNQUF2QixDQUE4QixNQUE5QjtNQUNBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQWUsT0FBZjtNQUNBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQWUsSUFBZjtNQUNBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQWUsSUFBZjtNQUNBLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxNQUFQLENBQWMsSUFBZCxDQUFtQixDQUFDLE1BQXBCLENBQTJCLElBQTNCO2FBQ0EsQ0FBQSxDQUFFLElBQUMsQ0FBQSxNQUFILENBQVUsQ0FBQyxNQUFYLENBQWtCLEdBQWxCO0lBdERXOzttQkF5RFosYUFBQSxHQUFlLFNBQUMsT0FBRCxFQUFVLElBQVY7YUFFZCxDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsSUFBWCxDQUFnQixlQUFoQixDQUFnQyxDQUFDLE1BQWpDLENBRUMsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLENBRkQ7SUFGYzs7bUJBU2YsVUFBQSxHQUFZLFNBQUMsSUFBRDtBQUdYLFVBQUE7TUFBQSxNQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQVgsR0FBMEIsSUFBQyxDQUFBLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUFyQyxHQUFpRCxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQTdELENBQUEsSUFBOEU7TUFDdkYsT0FBQSxHQUFVLENBQUEsQ0FBRSxJQUFDLENBQUEsTUFBSCxDQUFVLENBQUMsUUFBWCxDQUFBLENBQXFCLENBQUMsSUFBdEIsQ0FBQTtNQUlWLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBbEIsSUFBdUIsQ0FBQyxDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsRUFBWCxDQUFjLGVBQWQsQ0FBM0I7UUFFQyxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFGRDtPQUFBLE1BQUE7UUFLQyxJQUFBLEdBQU8sQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsTUFBaEI7UUFDUCxNQUFBLEdBQVMsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsUUFBaEI7UUFFVCxJQUFHLE1BQUEsS0FBVSxJQUFJLENBQUMsTUFBZixJQUEwQixDQUFDLElBQUksQ0FBQyxJQUFMLEdBQVksSUFBYixDQUFBLElBQXNCLElBQUMsQ0FBQSxJQUFwRDtVQUVDLElBQUMsQ0FBQSxhQUFELENBQWUsT0FBZixFQUF3QixJQUF4QixFQUZEO1NBQUEsTUFBQTtVQUtDLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixFQUxEO1NBUkQ7O01BaUJBLElBQUcsTUFBSDtlQUNDLElBQUMsQ0FBQSxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBWCxHQUF1QixJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQVgsR0FBMEIsRUFEbEQ7O0lBekJXOzttQkErQlosTUFBQSxHQUFRLFNBQUMsSUFBRDtNQUVQLElBQWtDLElBQUksQ0FBQyxNQUFMLEtBQWUsT0FBakQ7ZUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLElBQUksQ0FBQyxNQUFaLEVBQW9CLElBQUksQ0FBQyxJQUF6QixFQUFBOztJQUZPOzttQkFLUixVQUFBLEdBQVksU0FBQyxJQUFEO0FBRVgsVUFBQTtBQUFBO1dBQUEsc0NBQUE7O3FCQUNDLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWjtBQUREOztJQUZXOzttQkFLWixVQUFBLEdBQVksU0FBQTthQUVYLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBRVYsS0FBQyxDQUFBLE9BQUQsQ0FBQTtRQUZVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBR0UsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUhkO0lBRlc7O21CQVFaLEtBQUEsR0FBTyxTQUFDLEtBQUQ7TUFFTixJQUFHLEtBQUssQ0FBQyxLQUFOLEtBQWUsRUFBbEI7UUFDQyxJQUFDLENBQUEsSUFBRCxDQUFBO2VBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQUZEOztJQUZNOzttQkFTUCxZQUFBLEdBQWMsU0FBQyxJQUFEO0FBRWIsYUFBTyxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQVgsQ0FBbUIsUUFBbkIsRUFBNkIsSUFBN0I7SUFGTTs7Ozs7O0VBb0JmLENBQUEsQ0FBRSxTQUFBO0FBRUQsUUFBQTtJQUFBLE1BQUEsR0FBUyxTQUFBO0FBRVIsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUssSUFBQSxJQUFBLENBQUEsQ0FBTCxDQUFZLENBQUMsT0FBYixDQUFBLENBQUEsR0FBeUIsSUFBcEM7TUFFTixDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFBO0FBRTFCLFlBQUE7UUFBQSxJQUFBLEdBQU8sUUFBQSxDQUFTLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsTUFBYixDQUFUO1FBQ1AsUUFBQSxHQUFXLEdBQUEsR0FBTTtRQUlqQixJQUFHLFFBQUEsR0FBVyxFQUFkO1VBRUMsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFGbEI7U0FBQSxNQUFBO1VBS0MsSUFBQSxHQUFPLE1BQU0sQ0FBQyxlQUFQLENBQXVCLFFBQXZCLEVBTFI7O2VBT0EsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFBLEdBQU8sR0FBUCxHQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBcEM7TUFkMEIsQ0FBM0I7TUFpQkEsQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixTQUFBO0FBRXJCLFlBQUE7UUFBQSxJQUFHLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsVUFBYixDQUFBLEtBQTRCLE1BQS9CO1VBRUMsSUFBQSxHQUFPLFFBQUEsQ0FBUyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLE1BQWIsQ0FBVDtVQUNQLElBQUEsR0FBTyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLE1BQWI7VUFDUCxRQUFBLEdBQVcsSUFBQSxHQUFPO1VBR2xCLElBQUcsUUFBQSxHQUFXLENBQWQ7bUJBRUMsQ0FBQSxDQUFFLElBQUYsQ0FDQyxDQUFDLElBREYsQ0FDTyxNQUFNLENBQUMsVUFBUCxDQUFrQixRQUFsQixDQURQLENBRUMsQ0FBQyxRQUZGLENBRVcsVUFGWCxFQUZEO1dBQUEsTUFBQTttQkFPQyxDQUFBLENBQUUsSUFBRixDQUNDLENBQUMsSUFERixDQUNPLElBRFAsQ0FFQyxDQUFDLFdBRkYsQ0FFYyxVQUZkLEVBUEQ7V0FQRDs7TUFGcUIsQ0FBdEI7YUF1QkEsVUFBQSxDQUFXLE1BQVgsRUFBbUIsSUFBbkI7SUE1Q1E7V0E4Q1QsTUFBQSxDQUFBO0VBaERDLENBQUY7QUE5WEE7OztBQ0FBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQVMsU0FBQTtBQUVSLFFBQUE7SUFBQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUE7SUFDWCxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsT0FBTCxDQUFBLENBQUEsR0FBaUIsSUFBNUI7SUFDTixDQUFBLENBQUUsZUFBRixDQUFrQixDQUFDLElBQW5CLENBQXdCLElBQUksQ0FBQyxXQUFMLENBQUEsQ0FBeEI7SUFFQSxDQUFBLENBQUUsWUFBRixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsU0FBQTtBQUVwQixVQUFBO01BQUEsRUFBQSxHQUFLLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsSUFBYjthQUNMLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFBLEdBQUssR0FBZCxFQUFtQixDQUFuQixDQUFsQixDQUFiO0lBSG9CLENBQXJCO1dBT0EsVUFBQSxDQUFXLE1BQVgsRUFBbUIsSUFBbkI7RUFiUTs7RUFpQlQsQ0FBQSxDQUFFLFNBQUE7V0FDRCxNQUFBLENBQUE7RUFEQyxDQUFGO0FBakJBOzs7QUNBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUFVOztFQUdWLElBQUEsR0FBTyxTQUFDLE1BQUQ7QUFFTixRQUFBO0lBQUEsV0FBQSx5REFBZ0Q7SUFJaEQsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxnQkFBZixFQUFpQyxTQUFDLEtBQUQ7YUFFaEMsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFiLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsTUFBaEM7SUFGZ0MsQ0FBakM7SUFNQSxJQUFHLFdBQUg7YUFFQyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsS0FBVixDQUFnQjtRQUFDLFFBQUEsRUFBVSxJQUFYO1FBQWlCLElBQUEsRUFBTSxJQUF2QjtRQUE2QixRQUFBLEVBQVUsSUFBdkM7T0FBaEIsRUFGRDtLQUFBLE1BQUE7YUFNQyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsS0FBVixDQUFnQjtRQUFDLFFBQUEsRUFBVSxRQUFYO1FBQXFCLElBQUEsRUFBTSxJQUEzQjtRQUFpQyxRQUFBLEVBQVUsS0FBM0M7T0FBaEIsRUFORDs7RUFaTTs7RUFxQlAsQ0FBQSxDQUFFLFNBQUE7SUFDRCxPQUFBLEdBQVUsQ0FBQSxDQUFFLGlCQUFGO1dBR1YsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsU0FBQyxLQUFEO01BRWYsSUFBRyxLQUFBLEtBQVMsQ0FBWjtRQUNDLElBQUEsQ0FBSyxJQUFMLEVBREQ7O01BR0EsSUFBRyxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFsQixDQUFYO2VBQ0MsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLEVBQVIsQ0FBVyxpQkFBWCxFQUE4QixTQUFDLEtBQUQ7aUJBRTdCLElBQUEsQ0FBSyxPQUFRLENBQUEsS0FBQSxHQUFRLENBQVIsQ0FBYjtRQUY2QixDQUE5QixFQUREOztJQUxlLENBQWhCO0VBSkMsQ0FBRjtBQXhCQTs7O0FDQ0E7QUFBQSxNQUFBOztFQUFNLElBQUMsQ0FBQTtBQUVOLFFBQUE7O0lBQUEsUUFBQSxHQUFXO01BRVYsU0FBQSxFQUFXO1FBRVYsSUFBQSxFQUFNLFdBRkk7UUFHVixJQUFBLEVBQU0sVUFISTtRQUlWLElBQUEsRUFBTSxTQUpJO1FBS1YsSUFBQSxFQUFNLFdBTEk7UUFNVixJQUFBLEVBQU0sZ0JBTkk7UUFPVixLQUFBLEVBQU8sZUFQRztRQVFWLElBQUEsRUFBTSxZQVJJO09BRkQ7TUFhVixHQUFBLEVBQUssMEJBYks7OztJQWtCRSxtQkFBQyxHQUFELEVBQU0sU0FBTjtNQUVaLElBQUMsQ0FBQSxHQUFELGlCQUFPLE1BQU0sUUFBUSxDQUFDO01BQ3RCLElBQUMsQ0FBQSxHQUFELEdBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsUUFBUSxDQUFDLFNBQXRCLHNCQUFpQyxZQUFZLEVBQTdDO0lBSEs7O3dCQU1iLE1BQUEsR0FBUSxTQUFDLElBQUQ7QUFFUCxVQUFBO0FBQUE7QUFBQSxXQUFBLFFBQUE7O1FBRUMsR0FBQSxHQUFNLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLFFBQWIsRUFBdUIsQ0FBdkI7UUFDTixRQUFBLEdBQVcsNkJBQUEsR0FBZ0MsR0FBaEMsR0FBc0MsU0FBdEMsR0FBa0QsQ0FBbEQsR0FBc0QsV0FBdEQsR0FBb0UsQ0FBcEUsR0FBd0U7UUFDbkYsSUFBQSxHQUFPLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCLEVBQW1CLFFBQW5CO0FBSlI7YUFPQTtJQVRPOzt3QkFXUixPQUFBLEdBQVMsU0FBQyxNQUFELEVBQVMsTUFBVDthQUVSLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxPQUFWLENBQWtCO1FBRWpCLElBQUEsRUFBTSxJQUZXO1FBR2pCLE9BQUEsRUFBUyxPQUhRO1FBSWpCLFNBQUEsRUFBVyxLQUpNO1FBS2pCLEtBQUEsRUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBTEw7UUFNakIsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGlCQUFELENBQW1CLE1BQW5CO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTlE7UUFPakIsUUFBQSxFQUFVLDBKQVBPO09BQWxCO0lBRlE7O3dCQVlULGlCQUFBLEdBQW1CLFNBQUMsTUFBRDtBQUVsQixVQUFBO01BQUEsU0FBQSxHQUFZLENBQUEsQ0FBRSxhQUFGO0FBRVo7QUFBQSxXQUFBLFFBQUE7O1FBQ0MsR0FBQSxHQUFNLElBQUMsQ0FBQSxHQUFHLENBQUMsT0FBTCxDQUFhLFFBQWIsRUFBdUIsQ0FBdkI7UUFDTixHQUFBLEdBQU0sQ0FBQSxDQUFFLGFBQUYsQ0FDTCxDQUFDLFFBREksQ0FDSyxVQURMLENBRUwsQ0FBQyxJQUZJLENBRUMsS0FGRCxFQUVRLEdBRlIsQ0FHTCxDQUFDLElBSEksQ0FHQyxLQUhELEVBR1EsQ0FIUixDQUlMLENBQUMsSUFKSSxDQUlDLE9BSkQsRUFJVSxDQUpWLENBS0wsQ0FBQyxLQUxJLENBS0UsU0FBQTtpQkFFTixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsR0FBVixDQUFjLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxHQUFWLENBQUEsQ0FBQSxHQUFrQixDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLEtBQWIsQ0FBaEM7UUFGTSxDQUxGO1FBVU4sQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLE1BQWIsQ0FBb0IsR0FBcEI7QUFaRDtBQWNBLGFBQU87SUFsQlc7Ozs7OztFQTRCcEIsT0FBQSxHQUFVOztFQUdWLENBQUEsQ0FBRSxTQUFBO0FBRUQsUUFBQTtJQUFBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQUE7V0FFaEIsQ0FBQSxDQUFFLHVCQUFGLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsU0FBQTtBQUUvQixVQUFBO01BQUEsSUFBQSxHQUFPLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQUE7TUFDUCxJQUFBLEdBQU8sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsSUFBakI7YUFDUCxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLElBQWI7SUFKK0IsQ0FBaEM7RUFKQyxDQUFGO0FBaEZBOzs7QUNIQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUNDO0lBQUEsRUFBQSxFQUFJLEdBQUo7SUFDQSxFQUFBLEVBQUksR0FESjtJQUVBLEVBQUEsRUFBSSxJQUZKOzs7RUFNRCxTQUFBLEdBQVksU0FBQTtBQUNYLFFBQUE7SUFBQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEtBQVYsQ0FBQTtJQUVSLElBQUcsS0FBQSxHQUFRLE1BQU0sQ0FBQyxFQUFsQjthQUNDLENBQUMsSUFBRCxFQUREO0tBQUEsTUFFSyxJQUFHLEtBQUEsR0FBUSxNQUFNLENBQUMsRUFBbEI7YUFDSixDQUFDLElBQUQsRUFBTyxJQUFQLEVBREk7S0FBQSxNQUVBLElBQUcsS0FBQSxHQUFRLE1BQU0sQ0FBQyxFQUFsQjthQUNKLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBREk7S0FBQSxNQUFBO2FBR0osQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFISTs7RUFQTTs7RUFhWixVQUFBLEdBQWEsU0FBQyxNQUFEO0FBQ1osUUFBQTtJQUFBLE1BQUEsR0FBUztBQUNULFNBQUEsd0NBQUE7O0FBQ0MsV0FBUywyQkFBVDtRQUNDLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBQSxHQUFPLENBQVAsR0FBUyxHQUFULEdBQVksQ0FBeEI7QUFERDtBQUREO1dBR0E7RUFMWTs7RUFTYixPQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMsTUFBVDtBQUNULFFBQUE7QUFBQSxTQUFBLHdDQUFBOztNQUNDLE1BQUEsR0FBYSxJQUFBLE1BQUEsQ0FBTyxNQUFBLEdBQU8sQ0FBUCxHQUFTLFNBQWhCO01BQ2IsSUFBQSw4REFBOEMsQ0FBQSxDQUFBO01BQzlDLElBQXlCLFlBQXpCO0FBQUEsZUFBTyxRQUFBLENBQVMsSUFBVCxFQUFQOztBQUhEO0FBSUEsV0FBTztFQUxFOztFQVVWLFFBQUEsR0FBVyxTQUFBO0FBQ1YsUUFBQTtJQUFBLE1BQUEsR0FBUyxTQUFBLENBQUE7SUFDVCxPQUFBLEdBQVUsVUFBQSxDQUFXLE1BQVg7SUFDVixRQUFBLEdBQVcsR0FBQSxHQUFNLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBYjtXQU9qQixDQUFBLENBQUUsZUFBRixDQUFrQixDQUFDLElBQW5CLENBQXdCLFNBQUE7QUFFdkIsVUFBQTtNQUFBLE9BQUEsR0FBVTtNQUNWLEdBQUEsR0FBTTtNQUNOLEdBQUEsR0FBTTtNQUVOLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxRQUFSLENBQWlCLFFBQWpCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsU0FBQTtBQUMvQixZQUFBO1FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLEVBQWMsTUFBZDtRQUNQLEdBQUEsSUFBTztRQUtQLElBQUcsR0FBQSxHQUFNLEVBQVQ7VUFDQyxHQUFBLElBQU87VUFDUCxHQUFBLEdBRkQ7OztVQUtBLE9BQVEsQ0FBQSxHQUFBLElBQVE7O2VBQ2hCLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZSxJQUFJLENBQUMsR0FBTCxDQUFTLE9BQVEsQ0FBQSxHQUFBLENBQWpCLEVBQXVCLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQUEsQ0FBdkI7TUFiZ0IsQ0FBaEM7TUFnQkEsR0FBQSxHQUFNO01BQ04sR0FBQSxHQUFNO01BQ04sR0FBQSxHQUFNO01BRU4sQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLFFBQVIsQ0FBaUIsUUFBakIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxTQUFBO1FBQy9CLEdBQUEsSUFBTyxPQUFBLENBQVEsSUFBUixFQUFjLE1BQWQ7O1VBQ1AsTUFBTzs7UUFFUCxJQUFHLEdBQUEsR0FBTSxFQUFUO1VBQ0MsR0FBQSxJQUFPO1VBQ1AsR0FBQTtVQUNBLEdBQUEsR0FBTSxLQUhQOztlQUtBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQWUsT0FBUSxDQUFBLEdBQUEsQ0FBdkI7TUFUK0IsQ0FBaEM7TUFXQSxFQUFBLEdBQUssSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLEVBQUEsR0FBSyxHQUFOLENBQUEsR0FBYSxDQUF4QjtNQUNMLElBQUcsYUFBQSxJQUFTLEVBQUEsR0FBSyxDQUFqQjtRQUNDLENBQUEsR0FBSSxNQUFPLENBQUEsQ0FBQTtBQUVYLGFBQVMsMkJBQVQ7VUFDQyxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsV0FBUCxDQUFtQixNQUFBLEdBQU8sQ0FBUCxHQUFTLFVBQVQsR0FBbUIsQ0FBdEM7QUFERDtlQUVBLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxRQUFQLENBQWdCLE1BQUEsR0FBTyxDQUFQLEdBQVMsVUFBVCxHQUFtQixFQUFuQyxFQUxEOztJQXRDdUIsQ0FBeEI7RUFWVTs7RUF1RFgsV0FBQSxHQUFjLFNBQUE7V0FDYixDQUFBLENBQUUsS0FBRixDQUNDLENBQUMsRUFERixDQUNLLE1BREwsRUFDYSxRQURiO0VBRGE7O0VBS2QsQ0FBQSxDQUFFLFNBQUEsR0FBQSxDQUFGO0FBbkdBOzs7QUNBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFROztFQUdSLE9BQUEsR0FBVSxTQUFDLEtBQUQ7SUFDVCxJQUFjLEtBQUssQ0FBQyxLQUFOLEtBQWUsRUFBN0I7TUFBQSxLQUFBLEdBQVEsR0FBUjs7SUFDQSxJQUFlLEtBQUssQ0FBQyxLQUFOLEtBQWUsRUFBOUI7YUFBQSxLQUFBLEdBQVEsSUFBUjs7RUFGUzs7RUFJVixLQUFBLEdBQVEsU0FBQyxLQUFEO0lBQ1AsSUFBYSxLQUFLLENBQUMsS0FBTixLQUFlLEVBQWYsSUFBcUIsS0FBSyxDQUFDLEtBQU4sS0FBZSxFQUFqRDthQUFBLEtBQUEsR0FBUSxFQUFSOztFQURPOztFQUlSLFVBQUEsR0FBYSxTQUFDLEtBQUQ7QUFDWixRQUFBO0lBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaO0lBQ0EsR0FBQSxHQUFNLFFBQUEsNkNBQWdDLENBQWhDO0lBQ04sR0FBQSxHQUFNLFFBQUEsK0NBQWdDLEdBQWhDO0lBQ04sSUFBQSxHQUFPLFFBQUEsZ0RBQWlDLENBQWpDO0lBRVAsTUFBQSxHQUFTLEtBQUssQ0FBQyxNQUFOLEdBQWUsSUFBZixHQUFzQjtJQUMvQixLQUFBLEdBQVEsUUFBQSx5Q0FBeUIsQ0FBekI7SUFDUixLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFBLEdBQVEsTUFBbkIsRUFBMkIsR0FBM0IsRUFBZ0MsR0FBaEM7SUFFUixDQUFBLENBQUUsSUFBRixDQUNDLENBQUMsR0FERixDQUNNLEtBRE4sQ0FFQyxDQUFDLE9BRkYsQ0FFVSxRQUZWO1dBSUEsS0FBSyxDQUFDLGNBQU4sQ0FBQTtFQWRZOztFQWdCYixZQUFBLEdBQWUsU0FBQyxLQUFEO0FBQ2QsUUFBQTtJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksY0FBWjtJQUNBLE1BQUEsR0FBUyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsTUFBUixDQUFBLENBQWdCLENBQUMsUUFBakIsQ0FBMEIsY0FBMUI7SUFDVCxNQUFBLG9EQUFxQztJQUNyQyxLQUFBLHFEQUFtQztJQUNuQyxLQUFBLDJDQUF3QjtXQUV4QixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLE1BQUEsR0FBUyxLQUFULEdBQWlCLEtBQWhDO0VBUGM7O0VBVWYsY0FBQSxHQUFpQixTQUFDLEtBQUQ7QUFDaEIsUUFBQTtJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0JBQVo7SUFDQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLE1BQVIsQ0FBQSxDQUFnQixDQUFDLE1BQWpCLENBQUEsQ0FBeUIsQ0FBQyxRQUExQixDQUFtQyxPQUFuQztJQUNSLEdBQUEsR0FBTSxRQUFBLDhDQUFpQyxDQUFqQztJQUNOLEdBQUEsR0FBTSxRQUFBLGdEQUFpQyxHQUFqQztJQUNOLElBQUEsR0FBTyxRQUFBLGlEQUFrQyxDQUFsQztJQUVQLEtBQUEsR0FBUSxRQUFBLDBDQUEyQixDQUEzQjtJQUNSLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUEsR0FBUSxLQUFBLEdBQVEsSUFBM0IsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEM7V0FDUixDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsR0FBVCxDQUFhLEtBQWIsQ0FBbUIsQ0FBQyxPQUFwQixDQUE0QixRQUE1QjtFQVRnQjs7RUFZakIsY0FBQSxHQUFpQixTQUFDLEtBQUQ7QUFDaEIsUUFBQTtJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0JBQVo7SUFDQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLE1BQVIsQ0FBQSxDQUFnQixDQUFDLE1BQWpCLENBQUEsQ0FBeUIsQ0FBQyxRQUExQixDQUFtQyxPQUFuQztJQUNSLEdBQUEsR0FBTSxRQUFBLDhDQUFpQyxDQUFqQztJQUNOLEdBQUEsR0FBTSxRQUFBLGdEQUFpQyxHQUFqQztJQUNOLElBQUEsR0FBTyxRQUFBLGlEQUFrQyxDQUFsQztJQUVQLEtBQUEsR0FBUSxRQUFBLDBDQUEyQixDQUEzQjtJQUNSLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUEsR0FBUSxLQUFBLEdBQVEsSUFBM0IsRUFBaUMsR0FBakMsRUFBc0MsR0FBdEM7V0FDUixDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsR0FBVCxDQUFhLEtBQWIsQ0FBbUIsQ0FBQyxPQUFwQixDQUE0QixRQUE1QjtFQVRnQjs7RUFjakIsQ0FBQSxDQUFFLFNBQUE7SUFDRCxDQUFBLENBQUUsTUFBRixDQUNDLENBQUMsS0FERixDQUNRLEtBRFIsQ0FFQyxDQUFDLE9BRkYsQ0FFVSxPQUZWO0lBSUEsQ0FBQSxDQUFFLHVDQUFGLENBQ0MsQ0FBQyxJQURGLENBQ08sWUFEUCxFQUNxQixVQURyQjtJQUdBLENBQUEsQ0FBRSxtQkFBRixDQUNDLENBQUMsTUFERixDQUNTLFlBRFQsQ0FFQyxDQUFDLFNBRkYsQ0FFWSxZQUZaO0lBSUEsQ0FBQSxDQUFFLGVBQUYsQ0FBa0IsQ0FBQyxRQUFuQixDQUE0QixRQUE1QixDQUNDLENBQUMsS0FERixDQUNRLGNBRFI7V0FJQSxDQUFBLENBQUUsY0FBRixDQUFpQixDQUFDLFFBQWxCLENBQTJCLFFBQTNCLENBQ0MsQ0FBQyxLQURGLENBQ1EsY0FEUjtFQWhCQyxDQUFGO0FBL0RBOzs7QUNHQTtFQUFBLENBQUEsQ0FBRSxTQUFBO0FBRUQsUUFBQTtJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLElBQVosQ0FBQSxDQUFaO0lBRUEsSUFBQSxHQUFPO0lBR1AsSUFBQSxHQUFPLFNBQUMsT0FBRDthQUVOO1FBQUMsS0FBQSxFQUFPLENBQUEsQ0FBRSxPQUFGLENBQVUsQ0FBQyxLQUFYLENBQUEsQ0FBUjtRQUE0QixNQUFBLEVBQVEsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLE1BQVgsQ0FBQSxDQUFwQzs7SUFGTTtJQUlQLFFBQUEsR0FBVyxTQUFDLE9BQUQ7YUFFVixDQUFBLENBQUUsT0FBRixDQUFVLENBQUMsTUFBWCxDQUFBO0lBRlU7SUFNWCxJQUFBLEdBQU8sU0FBQTtBQUVOLFVBQUE7TUFBQSxJQUFHLENBQUksSUFBUDtRQUVDLElBQUEsR0FBTztRQUdQLFdBQUEsR0FBYyxDQUFBLENBQUUsYUFBRixDQUNiLENBQUMsSUFEWSxDQUNQLElBRE8sRUFDRCxhQURDLENBRWIsQ0FBQyxRQUZZLENBRUgsU0FGRyxDQUdiLENBQUMsR0FIWSxDQUdSLElBQUEsQ0FBSyxRQUFMLENBSFEsQ0FJYixDQUFDLEtBSlksQ0FJTixJQUpNLENBS2IsQ0FBQyxJQUxZLENBQUE7UUFTZCxVQUFBLEdBQWEsQ0FBQSxDQUFFLGFBQUYsQ0FDWixDQUFDLElBRFcsQ0FDTixJQURNLEVBQ0EsWUFEQSxDQUVaLENBQUMsUUFGVyxDQUVGLFNBRkUsQ0FHWixDQUFDLEdBSFcsQ0FHUCxVQUhPLEVBR0ssT0FITCxDQUlaLENBQUMsR0FKVyxDQUlQLFNBSk8sRUFJSSxNQUpKLENBS1osQ0FBQyxHQUxXLENBS1AsSUFBQSxDQUFLLFVBQUwsQ0FMTyxDQU1aLENBQUMsS0FOVyxDQU1MLElBTkssQ0FPWixDQUFDLElBUFcsQ0FBQTtRQVdiLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQSxDQUFFLDBCQUFGLENBQVo7UUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQUEsQ0FBRSxzQkFBRixDQUFaO1FBS0EsQ0FBQSxDQUFFLDBCQUFGLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsU0FBQTtBQUVsQyxjQUFBO1VBQUEsSUFBQSxHQUFPLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxLQUFSLENBQUE7VUFDUCxDQUFBLEdBQUksUUFBQSxDQUFTLElBQVQ7VUFDSixDQUFBLEdBQUksSUFBQSxDQUFLLElBQUw7VUFFSixDQUFBLENBQUUsSUFBRixDQUNDLENBQUMsUUFERixDQUNXLFFBRFgsQ0FFQyxDQUFDLEdBRkYsQ0FFTSxVQUZOLEVBRWtCLFVBRmxCLENBR0MsQ0FBQyxPQUhGLENBR1U7WUFBQyxTQUFBLEVBQVcsVUFBWjtZQUF3QixLQUFBLEVBQU8sQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxNQUFiLENBQS9CO1dBSFYsQ0FJQyxDQUFDLEdBSkYsQ0FJTSxDQUpOLENBS0MsQ0FBQyxHQUxGLENBS00sQ0FMTjtVQU9BLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsU0FBYixDQUF1QixDQUFDLFVBQXhCLENBQW1DLE9BQW5DO2lCQUVBLENBQUEsQ0FBRSxXQUFGLENBQ0MsQ0FBQyxNQURGLENBQ1MsSUFEVDtRQWZrQyxDQUFuQztRQW1CQSxDQUFBLENBQUUsc0JBQUYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixTQUFBO0FBRTlCLGNBQUE7VUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLEtBQVIsQ0FBQTtVQUNQLENBQUEsR0FBSSxRQUFBLENBQVMsSUFBVDtVQUNKLENBQUEsR0FBSSxJQUFBLENBQUssSUFBTDtVQUVKLENBQUEsQ0FBRSxJQUFGLENBQ0MsQ0FBQyxRQURGLENBQ1csUUFEWCxDQUVDLENBQUMsR0FGRixDQUVNLFVBRk4sRUFFa0IsVUFGbEIsQ0FHQyxDQUFDLE9BSEYsQ0FHVTtZQUFDLFNBQUEsRUFBVyxVQUFaO1lBQXdCLEtBQUEsRUFBTyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLE1BQWIsQ0FBL0I7V0FIVixDQUlDLENBQUMsR0FKRixDQUlNLENBSk4sQ0FLQyxDQUFDLEdBTEYsQ0FLTSxDQUxOO1VBT0EsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFiLENBQXVCLENBQUMsVUFBeEIsQ0FBbUMsT0FBbkM7aUJBRUEsQ0FBQSxDQUFFLFVBQUYsQ0FDQyxDQUFDLE1BREYsQ0FDUyxJQURUO1FBZjhCLENBQS9CO1FBbUJBLENBQUEsQ0FBRSxNQUFGLENBQ0MsQ0FBQyxNQURGLENBQ1MsV0FEVCxDQUVDLENBQUMsTUFGRixDQUVTLFVBRlQ7UUFJQSxDQUFBLENBQUUsV0FBRixDQUFjLENBQUMsTUFBZixDQUFBO2VBQ0EsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLE1BQWQsQ0FBQSxFQTFFRDs7SUFGTTtJQStFUCxJQUFBLEdBQU8sU0FBQTtNQUVOLElBQUcsSUFBSDtRQUVDLElBQUEsR0FBTztlQUNQLENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxPQUFkLENBQXNCO1VBQUMsUUFBQSxFQUFVLFNBQUE7bUJBRWhDLENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxNQUFkLENBQUE7VUFGZ0MsQ0FBWDtTQUF0QixFQUhEOztJQUZNO0lBWVAsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLEtBQWQsQ0FBb0IsU0FBQTthQUVuQixJQUFBLENBQUE7SUFGbUIsQ0FBcEI7V0FLQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsT0FBWixDQUFvQixTQUFDLEtBQUQ7TUFFbkIsSUFBVSxLQUFLLENBQUMsS0FBTixLQUFlLEVBQXpCO2VBQUEsSUFBQSxDQUFBLEVBQUE7O0lBRm1CLENBQXBCO0VBakhDLENBQUY7QUFBQTs7O0FDSEE7QUFBQSxNQUFBOztFQUFBLFFBQUEsR0FBVzs7RUFDWCxPQUFBLEdBQVUsQ0FBQyxRQUFELEVBQVcsS0FBWDs7RUFFVixJQUFHLENBQUksTUFBTSxDQUFDLHFCQUFkO0FBQ0ksU0FBQSx5Q0FBQTs7TUFDSSxNQUFNLENBQUMscUJBQVAsR0FBK0IsTUFBTyxDQUFBLE1BQUEsR0FBUyx1QkFBVDtNQUN0QyxNQUFNLENBQUMsb0JBQVAsR0FBOEIsTUFBTyxDQUFBLE1BQUEsR0FBUyxzQkFBVCxDQUFQLElBQTJDLE1BQU8sQ0FBQSxNQUFBLEdBQVMsNkJBQVQ7QUFGcEYsS0FESjs7O0VBS0EsTUFBTSxDQUFDLDBCQUFQLE1BQU0sQ0FBQyx3QkFBMEIsU0FBQyxRQUFELEVBQVcsT0FBWDtBQUM3QixRQUFBO0lBQUEsUUFBQSxHQUFlLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxPQUFQLENBQUE7SUFDZixVQUFBLEdBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBQSxHQUFLLENBQUMsUUFBQSxHQUFXLFFBQVosQ0FBakI7SUFFYixFQUFBLEdBQUssTUFBTSxDQUFDLFVBQVAsQ0FBa0IsU0FBQTthQUNuQixRQUFBLENBQVMsUUFBQSxHQUFXLFVBQXBCO0lBRG1CLENBQWxCLEVBRUgsVUFGRztXQUlMO0VBUjZCOztFQVVqQyxNQUFNLENBQUMseUJBQVAsTUFBTSxDQUFDLHVCQUF5QixTQUFDLEVBQUQ7V0FDNUIsWUFBQSxDQUFhLEVBQWI7RUFENEI7QUFsQmhDOzs7QUNJQTtFQUFBLENBQUEsQ0FBRSxTQUFBO1dBQ0QsQ0FBQSxDQUFFLGdCQUFGLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsU0FBQTtBQUN4QixVQUFBO01BQUEsT0FBQSxHQUFVO01BQ1YsRUFBQSxHQUFLLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsS0FBYjthQUNMLENBQUEsQ0FBRSxHQUFBLEdBQU0sRUFBUixDQUFXLENBQUMsTUFBWixDQUFtQixTQUFDLEtBQUQ7QUFFbEIsWUFBQTtRQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsZUFBSixDQUFvQixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQXZDO1FBQ1AsSUFBK0IsWUFBL0I7aUJBQUEsQ0FBQSxDQUFFLE9BQUYsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsS0FBaEIsRUFBdUIsSUFBdkIsRUFBQTs7TUFIa0IsQ0FBbkIsQ0FNQyxDQUFDLE9BTkYsQ0FNVSxRQU5WO0lBSHdCLENBQXpCO0VBREMsQ0FBRjtBQUFBOzs7QUNGQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLFNBQUMsSUFBRDtXQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBaEIsR0FBdUIsUUFBQSxHQUFXO0VBRDdCOztFQU9OLE1BQUEsR0FBUyxTQUFBO1dBQ1IsR0FBQSxDQUFJLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsTUFBYixDQUFKO0VBRFE7O0VBSVQsTUFBQSxHQUFTLFNBQUE7V0FDUixHQUFBLENBQUksQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLEdBQVIsQ0FBQSxDQUFKO0VBRFE7O0VBS1QsQ0FBQSxDQUFFLFNBQUE7SUFDRCxDQUFBLENBQUUsa0JBQUYsQ0FBcUIsQ0FBQyxNQUF0QixDQUE2QixNQUE3QjtXQUNBLENBQUEsQ0FBRSxrQkFBRixDQUFxQixDQUFDLEtBQXRCLENBQTRCLE1BQTVCO0VBRkMsQ0FBRjtBQWhCQTs7O0FDRkE7QUFBQSxNQUFBOztFQUFBLE1BQUEsR0FBUyxTQUFBO0FBQ1IsUUFBQTtJQUFBLE1BQUEsR0FBUyxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsTUFBZCxDQUFBLENBQUEsR0FBeUI7V0FDbEMsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLEdBQVYsQ0FBYyxhQUFkLEVBQTZCLE1BQUEsR0FBUyxJQUF0QztFQUZROztFQUtULENBQUEsQ0FBRSxTQUFBO0lBQ0QsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQTthQUFHLE1BQUEsQ0FBQTtJQUFILENBQWpCO1dBQ0EsTUFBQSxDQUFBO0VBRkMsQ0FBRjtBQUxBOzs7QUNFQTtBQUFBLE1BQUE7O0VBQUEsYUFBQSxHQUFnQixTQUFDLEtBQUQ7V0FDZix1QkFBQSxHQUEwQixLQUExQixHQUFrQztFQURuQjs7RUFHaEIsWUFBQSxHQUFlLFNBQUMsS0FBRDtBQUNkLFFBQUE7SUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUksSUFBTCxDQUFVLENBQUMsT0FBWCxDQUFBLENBQUEsR0FBdUIsSUFBbEM7SUFDTixLQUFBLEdBQVEsUUFBQSxDQUFTLENBQUEsQ0FBRSxLQUFGLENBQVEsQ0FBQyxJQUFULENBQWMsT0FBZCxDQUFUO0lBQ1IsR0FBQSxHQUFNLFFBQUEsQ0FBUyxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsSUFBVCxDQUFjLEtBQWQsQ0FBVDtJQUNOLFFBQUEsR0FBVyxRQUFBLENBQVMsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLElBQVQsQ0FBYyxVQUFkLENBQVQ7SUFDWCxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsUUFBZDtJQUNOLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUEsR0FBSyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsR0FBQSxHQUFNLEtBQVAsQ0FBQSxHQUFnQixDQUFDLEdBQUEsR0FBTSxLQUFQLENBQTNCLEVBQTBDLENBQTFDLEVBQTZDLENBQTdDLENBQWhCO0lBQ1IsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLElBQVQsQ0FBYyxLQUFkLEVBQXFCLGFBQUEsQ0FBYyxLQUFkLENBQXJCO0lBRUEsSUFBNEMsS0FBQSxHQUFRLEVBQXBEO2FBQUEsVUFBQSxDQUFXLENBQUMsU0FBQTtlQUFHLFlBQUEsQ0FBYSxLQUFiO01BQUgsQ0FBRCxDQUFYLEVBQW9DLElBQXBDLEVBQUE7O0VBVGM7O0VBV2YsQ0FBQSxDQUFFLFNBQUE7SUFDRCxDQUFBLENBQUUsbUJBQUYsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixTQUFBO2FBQUcsWUFBQSxDQUFhLElBQWI7SUFBSCxDQUE1QjtXQUVBLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsRUFBakIsQ0FBb0IsZUFBcEIsRUFBcUMsU0FBQyxLQUFEO0FBQ3BDLFVBQUE7TUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLEtBQUssQ0FBQyxhQUFSLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsTUFBNUI7YUFDUCxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLGtCQUFiLENBQWdDLENBQUMsR0FBakMsQ0FBcUMsSUFBckM7SUFGb0MsQ0FBckM7RUFIQyxDQUFGO0FBZEE7OztBQ0ZBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU07O0VBR04sV0FBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsRUFBb0MsVUFBcEMsRUFBZ0QsVUFBaEQ7QUFFYixRQUFBO0lBQUEsR0FBQSxHQUFNLENBQUEsQ0FBRSxHQUFBLEdBQU0sTUFBTixHQUFlLE1BQWpCO0lBQ04sS0FBQSxHQUFRLENBQUEsQ0FBRSxHQUFBLEdBQU0sTUFBTixHQUFlLFFBQWpCO0lBR1IsSUFBRyxHQUFHLENBQUMsTUFBSixHQUFhLENBQWhCO01BQ0MsS0FBQSxHQUFRLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxRQUFQLENBQWdCLGVBQWhCO01BRVIsQ0FBQSxDQUFFLEtBQUYsQ0FDQyxDQUFDLElBREYsQ0FDTyxLQURQLEVBQ2MsUUFEZCxDQUVDLENBQUMsSUFGRixDQUVPLEtBRlAsRUFFYyxRQUZkLENBR0MsQ0FBQyxJQUhGLENBR08sS0FIUCxFQUdjLEtBSGQ7O1lBSU0sQ0FBQztPQVBSOztJQVVBLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtNQUNDLEtBQUEsR0FBUSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsUUFBVCxDQUFrQixlQUFsQjtNQUVSLElBQUcsa0JBQUg7ZUFDQyxDQUFBLENBQUUsS0FBRixDQUNDLENBQUMsSUFERixDQUNPLEtBRFAsRUFDYyxVQURkLENBRUMsQ0FBQyxJQUZGLENBRU8sS0FGUCxFQUVjLFVBRmQsRUFERDtPQUFBLE1BQUE7ZUFLQyxDQUFBLENBQUUsS0FBRixDQUNDLENBQUMsSUFERixDQUNPLEtBRFAsRUFDYyxDQURkLENBRUMsQ0FBQyxJQUZGLENBRU8sS0FGUCxFQUVjLENBRmQsRUFMRDtPQUhEOztFQWhCYTs7RUE2QmQsU0FBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsUUFBaEIsRUFBMEIsUUFBMUI7SUFDWCxDQUFBLENBQUUsR0FBQSxHQUFNLE1BQU4sR0FBZSxNQUFqQixDQUNDLENBQUMsSUFERixDQUNPLEtBRFA7SUFHQSxDQUFBLENBQUUsR0FBQSxHQUFNLE1BQU4sR0FBZSxNQUFqQixDQUNDLENBQUMsSUFERixDQUNPLFFBRFA7V0FHQSxDQUFBLENBQUUsR0FBQSxHQUFNLE1BQU4sR0FBZSxNQUFqQixDQUNDLENBQUMsSUFERixDQUNPLFFBRFA7RUFQVzs7RUFVWixRQUFBLEdBQVcsU0FBQyxNQUFELEVBQVMsS0FBVDtXQUNWLENBQUEsQ0FBRSxHQUFBLEdBQU0sTUFBUixDQUNDLENBQUMsSUFERixDQUNPLEtBRFA7RUFEVTs7RUFPWCxJQUFBLEdBQU8sU0FBQyxJQUFEO0FBQ04sUUFBQTtJQUFBLFdBQUEsQ0FBWSxRQUFaLEVBQXNCLElBQUksQ0FBQyxNQUEzQixFQUFtQyxDQUFuQyxFQUFzQyxJQUFJLENBQUMsU0FBM0MsRUFBc0QsSUFBSSxDQUFDLFlBQTNELEVBQXlFLElBQUksQ0FBQyxnQkFBOUU7SUFDQSxTQUFBLENBQVUsUUFBVixFQUFvQixJQUFJLENBQUMsTUFBekIsRUFBaUMsQ0FBakMsRUFBb0MsSUFBSSxDQUFDLFNBQXpDO0lBRUEsV0FBQSxDQUFZLFFBQVosRUFBc0IsSUFBSSxDQUFDLE1BQTNCLEVBQW1DLENBQW5DLEVBQXNDLElBQUksQ0FBQyxTQUEzQyxFQUFzRCxJQUFJLENBQUMsWUFBM0QsRUFBeUUsSUFBSSxDQUFDLGdCQUE5RTtJQUNBLFNBQUEsQ0FBVSxRQUFWLEVBQW9CLElBQUksQ0FBQyxNQUF6QixFQUFpQyxDQUFqQyxFQUFvQyxJQUFJLENBQUMsU0FBekM7SUFFQSxXQUFBLENBQVksUUFBWixFQUFzQixJQUFJLENBQUMsTUFBM0IsRUFBbUMsQ0FBbkMsRUFBc0MsQ0FBdEMsRUFBeUMsSUFBSSxDQUFDLFlBQTlDLEVBQTRELElBQUksQ0FBQyxnQkFBakU7SUFDQSxTQUFBLENBQVUsUUFBVixFQUFvQixJQUFJLENBQUMsTUFBekIsRUFBaUMsQ0FBakMsRUFBb0MsQ0FBcEM7SUFFQSxXQUFBLENBQVksWUFBWixFQUEwQixJQUFJLENBQUMsVUFBL0IsRUFBMkMsQ0FBM0MsRUFBOEMsSUFBSSxDQUFDLGFBQW5ELEVBQWtFLElBQWxFLEVBQXdFLElBQXhFO0lBQ0EsU0FBQSxDQUFVLFlBQVYsRUFBd0IsSUFBSSxDQUFDLFVBQTdCLEVBQXlDLENBQXpDLEVBQTRDLElBQUksQ0FBQyxhQUFqRDtJQUdBLFdBQUEsQ0FBWSxXQUFaLEVBQXlCLElBQUksQ0FBQyxtQkFBOUIsRUFBbUQsQ0FBbkQsRUFBc0QsSUFBSSxDQUFDLHNCQUEzRCxFQUFtRixJQUFuRixFQUF5RixJQUF6RjtJQUNBLFNBQUEsQ0FBVSxXQUFWLEVBQXVCLElBQUksQ0FBQyxtQkFBNUIsRUFBaUQsQ0FBakQsRUFBb0QsSUFBSSxDQUFDLHNCQUF6RDtJQUVBLFdBQUEsQ0FBWSxVQUFaLEVBQXdCLElBQUksQ0FBQyxrQkFBN0IsRUFBaUQsQ0FBakQsRUFBb0QsSUFBSSxDQUFDLHFCQUF6RCxFQUFnRixJQUFoRixFQUFzRixJQUF0RjtJQUNBLFNBQUEsQ0FBVSxVQUFWLEVBQXNCLElBQUksQ0FBQyxrQkFBM0IsRUFBK0MsQ0FBL0MsRUFBa0QsSUFBSSxDQUFDLHFCQUF2RDtJQUVBLFdBQUEsQ0FBWSxRQUFaLEVBQXNCLElBQUksQ0FBQyxnQkFBM0IsRUFBNkMsQ0FBN0MsRUFBZ0QsSUFBSSxDQUFDLG1CQUFyRCxFQUEwRSxJQUExRSxFQUFnRixJQUFoRjtJQUNBLFNBQUEsQ0FBVSxRQUFWLEVBQW9CLElBQUksQ0FBQyxnQkFBekIsRUFBMkMsQ0FBM0MsRUFBOEMsSUFBSSxDQUFDLG1CQUFuRDtJQXVCQSxLQUFBLEdBQVEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBUSxDQUFDLElBQXpCLENBQThCLENBQUMsS0FBL0IsQ0FBQTtJQUVSLElBQUcsZUFBQSxJQUFXLHNCQUFkO0FBdUJDLFdBQUEsU0FBQTs7UUFDQyxLQUFLLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBYixHQUFrQjtBQURuQjthQUdBLEtBQUssQ0FBQyxNQUFOLENBQUEsRUExQkQ7O0VBOUNNOztFQTZFUCxNQUFBLEdBQVMsU0FBQyxJQUFEO0lBRVIsSUFBQSxDQUFLLElBQUw7SUFFQSxJQUFHLElBQUksQ0FBQyxNQUFSO01BRUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFoQixDQUFBLEVBRkQ7S0FBQSxNQUFBO01BSUMsQ0FBQyxDQUFDLElBQUYsQ0FBTztRQUVOLEdBQUEsRUFBSyxHQUFBLEdBQU0sZ0JBRkw7UUFHTixRQUFBLEVBQVUsTUFISjtRQUlOLE1BQUEsRUFBUSxLQUpGO1FBS04sT0FBQSxFQUFTLE1BTEg7T0FBUDtNQVFBLENBQUMsQ0FBQyxJQUFGLENBQU87UUFFTixHQUFBLEVBQUssR0FBQSxHQUFNLFdBRkw7UUFHTixRQUFBLEVBQVUsTUFISjtRQUlOLE1BQUEsRUFBUSxLQUpGO1FBS04sT0FBQSxFQUFTLE9BTEg7T0FBUCxFQVpEOztXQW9CQSxVQUFBLENBQVcsSUFBWCxFQUFpQixJQUFJLENBQUMsVUFBTCxHQUFrQixJQUFuQztFQXhCUTs7RUEyQlQsTUFBQSxHQUFTLFNBQUMsSUFBRDtBQUNSLFFBQUE7QUFBQSxTQUFBLHNDQUFBOztNQUNDLE1BQU0sQ0FBQyxNQUFQLENBQWM7UUFFYixLQUFBLEVBQU8sVUFBQSxHQUFhLENBQUMsQ0FBQyxLQUFmLEdBQXVCLFdBRmpCO1FBR2IsT0FBQSxFQUFTLEVBSEk7UUFJYixHQUFBLEVBQUssV0FBQSxHQUFjLENBQUMsQ0FBQyxFQUpSO09BQWQ7QUFERDtJQVNBLElBQUcsTUFBTSxDQUFDLE1BQVY7YUFDQyxNQUFNLENBQUMsVUFBUCxDQUFBLEVBREQ7O0VBVlE7O0VBYVQsT0FBQSxHQUFVLFNBQUMsSUFBRDtBQUNULFFBQUE7QUFBQSxTQUFBLHNDQUFBOztNQUNDLE1BQU0sQ0FBQyxNQUFQLENBQWM7UUFFYixLQUFBLEVBQU8sVUFBQSxHQUFhLENBQUMsQ0FBQyxNQUFmLEdBQXdCLGFBQXhCLEdBQXdDLENBQUMsQ0FBQyxLQUExQyxHQUFrRCxPQUY1QztRQUdiLE9BQUEsRUFBUyxDQUFDLENBQUMsT0FIRTtRQUliLEdBQUEsRUFBSyxrQkFBQSxHQUFxQixDQUFDLENBQUMsRUFKZjtPQUFkO0FBREQ7SUFTQSxJQUFHLE1BQU0sQ0FBQyxNQUFWO2FBQ0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxFQUREOztFQVZTOztFQWVWLElBQUEsR0FBTyxTQUFBO1dBRU4sQ0FBQyxDQUFDLElBQUYsQ0FBTztNQUVOLEdBQUEsRUFBSyxHQUZDO01BR04sUUFBQSxFQUFVLE1BSEo7TUFJTixNQUFBLEVBQVEsS0FKRjtNQUtOLE9BQUEsRUFBUyxNQUxIO0tBQVA7RUFGTTs7RUFhUCxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsS0FBVixDQUFnQixTQUFBO1dBQ2YsSUFBQSxDQUFBO0VBRGUsQ0FBaEI7O0VBSUEsQ0FBQSxDQUFFLFNBQUE7V0FDRCxJQUFBLENBQUE7RUFEQyxDQUFGO0FBdE1BOzs7QUNDQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLFNBQUE7V0FFUixDQUFBLENBQUUsU0FBRixDQUFZLENBQUMsSUFBYixDQUFrQixTQUFBO01BRWpCLElBQUcsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLElBQVIsQ0FBYSxRQUFiLENBQUEsS0FBMEIsT0FBN0I7ZUFFQyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsS0FBUixDQUFjLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQUEsQ0FBZCxFQUZEO09BQUEsTUFBQTtlQUtDLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxNQUFSLENBQWUsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLEtBQVIsQ0FBQSxDQUFmLEVBTEQ7O0lBRmlCLENBQWxCO0VBRlE7O0VBV1QsQ0FBQSxDQUFFLFNBQUE7SUFDRCxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsTUFBVixDQUFpQixTQUFBO2FBQ2hCLE1BQUEsQ0FBQTtJQURnQixDQUFqQjtXQUdBLE1BQUEsQ0FBQTtFQUpDLENBQUY7QUFYQTs7O0FDQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxTQUFBO0FBQ1QsUUFBQTtJQUFBLE9BQUEsR0FBVSxRQUFBLDhEQUFpRCxDQUFqRDtJQUNWLElBQUEsR0FBTyxRQUFBLENBQVMsQ0FBQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsSUFBdkIsQ0FBQSxDQUFUO0lBQ1AsR0FBQSxHQUFNLFFBQUEsK0NBQWdDLENBQWhDO0lBQ04sR0FBQSxHQUFNLFFBQUEseUNBQTBCLENBQTFCO0lBQ04sSUFBQSxHQUFPLEdBQUEsR0FBTTtJQUViLElBQWUsSUFBQSxHQUFPLElBQXRCO01BQUEsSUFBQSxHQUFPLEtBQVA7O0lBQ0EsR0FBQSxHQUFNLEdBQUEsR0FBTTtJQUNaLElBQUEsSUFBUTtJQUVSLElBQUcsQ0FBSSxLQUFBLENBQU0sSUFBTixDQUFQO01BRUMsQ0FBQSxDQUFFLElBQUYsQ0FDQyxDQUFDLEdBREYsQ0FDTSxHQUROLENBRUMsQ0FBQyxJQUZGLENBRU8sS0FGUCxFQUVjLEdBRmQ7TUFJQSxDQUFBLENBQUUsbUJBQUYsQ0FDQyxDQUFDLElBREYsQ0FDTyxJQURQO2FBR0EsQ0FBQSxDQUFFLFlBQUYsQ0FBZSxDQUFDLElBQWhCLENBQXFCLFNBQUE7QUFDcEIsWUFBQTtRQUFBLEdBQUEsR0FBTSxRQUFBLHlDQUF5QixDQUF6QjtlQUNOLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsS0FBYixFQUFvQixJQUFBLEdBQU8sR0FBM0I7TUFGb0IsQ0FBckIsRUFURDs7RUFYUzs7RUF5QlYsTUFBQSxHQUFTLFNBQUMsR0FBRCxFQUFNLEdBQU47V0FBYyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixDQUFDLEdBQUEsR0FBTSxHQUFQLENBQWhCLEdBQThCLEdBQXpDO0VBQWQ7O0VBRVQsUUFBQSxHQUFXLFNBQUMsS0FBRDtBQUNWLFFBQUE7SUFBQSxLQUFBLEdBQVEsTUFBQSxDQUFPLENBQVAsRUFBVSxLQUFLLENBQUMsTUFBTixHQUFlLENBQXpCO1dBQ1IsS0FBTSxDQUFBLEtBQUE7RUFGSTs7RUFRWCxJQUFBLEdBQU8sU0FBQTtBQUVOLFFBQUE7SUFBQSxRQUFBLEdBQVcsQ0FBQSxDQUFFLHFCQUFGO0lBQ1gsQ0FBQSxDQUFFLFFBQUYsQ0FBVyxDQUFDLEdBQVosQ0FBZ0IsQ0FBaEIsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixRQUEzQjtJQUNBLE1BQUEsR0FBUyxRQUFBLENBQVMsQ0FBQSxDQUFFLG1CQUFGLENBQXNCLENBQUMsSUFBdkIsQ0FBQSxDQUFUO0FBR1QsU0FBUyxpRkFBVDtNQUVDLFNBQUEsR0FBWSxRQUFBLENBQVMsUUFBVDtNQUNaLEdBQUEsR0FBTSxRQUFBLENBQVMsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLEdBQWIsQ0FBQSxDQUFUO01BQ04sQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLEdBQWIsQ0FBaUIsR0FBQSxHQUFNLENBQXZCO0FBSkQ7V0FPQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsT0FBWixDQUFvQixRQUFwQjtFQWRNOztFQXFCUCxDQUFBLENBQUUsU0FBQTtJQUNELENBQUEsQ0FBRSxZQUFGLENBQ0MsQ0FBQyxJQURGLENBQ08sb0JBRFAsRUFDNkIsT0FEN0IsQ0FFQyxDQUFDLE9BRkYsQ0FFVSxRQUZWO0lBSUEsQ0FBQSxDQUFFLGFBQUYsQ0FDQyxDQUFDLEtBREYsQ0FDUSxJQURSO1dBR0EsSUFBQSxDQUFBO0VBUkMsQ0FBRjtBQXhEQTs7O0FDQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYTs7RUFFYixPQUFBLEdBQVUsU0FBQTtJQUNULElBQTZCLENBQUksVUFBakM7TUFBQSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQWhCLENBQUEsRUFBQTs7V0FDQSxVQUFBLEdBQWE7RUFGSjs7RUFJVixNQUFBLEdBQVMsU0FBQyxLQUFEO0FBQ1IsUUFBQTtJQUFBLEdBQUEsR0FBTSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsUUFBVCxDQUFrQixlQUFsQixDQUFrQyxDQUFDLElBQW5DLENBQUE7SUFDTixLQUFBLEdBQVEsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLFFBQVQsQ0FBa0IsaUJBQWxCO0lBQ1IsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxJQUFJLElBQUwsQ0FBVSxDQUFDLE9BQVgsQ0FBQSxDQUFBLEdBQXVCLE1BQWxDO0lBR1AsR0FBQSxHQUFNLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxJQUFQLENBQVksS0FBWjtJQUNOLEdBQUEsR0FBTSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsSUFBUCxDQUFZLEtBQVo7SUFDTixJQUFBLEdBQU8sQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLElBQVAsQ0FBWSxNQUFaO0lBQ1AsRUFBQSxHQUFLLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxJQUFQLENBQVksSUFBWjtJQUNMLEVBQUEsR0FBSyxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsSUFBUCxDQUFZLElBQVo7SUFJTCxRQUFBLEdBQVcsT0FBQSxpREFBa0MsS0FBbEM7SUFDWCxNQUFBLEdBQVMsT0FBQSxpREFBZ0MsSUFBaEM7SUFFVCxJQUFHLFlBQUg7TUFDQyxJQUFBLEdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFULEVBQWUsSUFBZixFQURSOztJQUdBLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsRUFBaUIsR0FBakIsRUFBc0IsR0FBdEI7SUFHTixPQUFBLEdBQVUsQ0FBQyxHQUFBLEdBQU0sR0FBUCxDQUFBLEdBQWMsQ0FBQyxHQUFBLEdBQU0sR0FBUDtJQUN4QixJQUF5QixRQUF6QjtNQUFBLE9BQUEsR0FBVSxDQUFBLEdBQUksUUFBZDs7SUFLQSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsR0FBUCxDQUFXLE9BQVgsRUFBb0IsQ0FBQyxPQUFBLEdBQVUsR0FBWCxDQUFBLEdBQWtCLEdBQXRDO0lBQ0EsSUFBb0UsWUFBQSxJQUFRLFlBQTVFO01BQUEsQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLEdBQVAsQ0FBVyxrQkFBWCxFQUErQixJQUFJLENBQUMsVUFBTCxDQUFnQixPQUFoQixFQUF5QixFQUF6QixFQUE2QixFQUE3QixDQUEvQixFQUFBOztJQUNBLENBQUEsQ0FBRSxLQUFGLENBQVEsQ0FBQyxJQUFULDJDQUFjLE1BQU0sQ0FBQyxXQUFZLEdBQUEsR0FBTSxhQUF2QztJQUVBLElBQWEsSUFBQSxHQUFPLEdBQVAsSUFBZSxNQUE1QjtNQUFBLE9BQUEsQ0FBQSxFQUFBOztXQUVBLFVBQUEsQ0FBVyxTQUFBO2FBRVYsTUFBQSxDQUFPLEtBQVA7SUFGVSxDQUFYLEVBSUUsSUFKRjtFQW5DUTs7RUEwQ1QsU0FBQSxHQUFZLFNBQUMsS0FBRDtBQUVYLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLElBQUksSUFBTCxDQUFVLENBQUMsT0FBWCxDQUFBLENBQUEsR0FBdUIsTUFBbEM7SUFDUCxHQUFBLEdBQU0sQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLElBQVQsQ0FBYyxLQUFkO0lBQ04sR0FBQSxHQUFNLENBQUEsQ0FBRSxLQUFGLENBQVEsQ0FBQyxJQUFULENBQWMsS0FBZDtJQUNOLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsRUFBaUIsR0FBakIsRUFBc0IsR0FBdEI7SUFFTixPQUFBLEdBQVUsQ0FBQSxHQUFJLENBQUMsR0FBQSxHQUFNLEdBQVAsQ0FBQSxHQUFjLENBQUMsR0FBQSxHQUFNLEdBQVA7SUFFNUIsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLEdBQVQsQ0FBYSxPQUFiLEVBQXNCLENBQUMsT0FBQSxHQUFVLEdBQVgsQ0FBQSxHQUFrQixHQUF4QztXQUVBLFVBQUEsQ0FBVyxTQUFBO2FBRVYsU0FBQSxDQUFVLEtBQVY7SUFGVSxDQUFYLEVBSUUsSUFKRjtFQVhXOztFQW9CWixDQUFBLENBQUUsU0FBQTtJQUNELENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLElBQXBCLENBQXlCLFNBQUE7YUFDeEIsTUFBQSxDQUFPLElBQVA7SUFEd0IsQ0FBekI7V0FHQSxDQUFBLENBQUUsNkJBQUYsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxTQUFBO2FBQ3JDLFNBQUEsQ0FBVSxJQUFWO0lBRHFDLENBQXRDO0VBSkMsQ0FBRjtBQXBFQTs7O0FDREE7RUFBQSxDQUFBLENBQUUsU0FBQTtXQUNELENBQUEsQ0FBRSx5QkFBRixDQUE0QixDQUFDLElBQTdCLENBQWtDLFNBQUE7QUFFakMsVUFBQTtNQUFBLE9BQUEsR0FBVTtRQUVULElBQUEsRUFBTSxJQUZHO1FBR1QsU0FBQSxFQUFXLFdBSEY7O01BTVYsT0FBQSxHQUFVLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsU0FBYjtNQUVWLElBQUcsZUFBSDtRQUNDLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLFFBRG5COzthQUlBLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxPQUFSLENBQWdCLE9BQWhCO0lBZGlDLENBQWxDO0VBREMsQ0FBRjtBQUFBOzs7QUNDQTtFQUFBLENBQUEsQ0FBRSxTQUFBO0FBRUQsUUFBQTtJQUFBLFNBQUEsR0FBWTtJQUNaLENBQUEsQ0FBRSxnQkFBRixDQUFtQixDQUFDLE9BQXBCLENBQTRCO01BQUMsT0FBQSxFQUFTLFFBQVY7TUFBb0IsU0FBQSxFQUFXLFFBQS9CO0tBQTVCO0lBRUEsSUFBQSxHQUFPLFNBQUMsSUFBRDtNQUVOLElBQUcsWUFBSDtlQUVDLENBQUEsQ0FBRSxJQUFJLENBQUMsUUFBUCxDQUNDLENBQUMsSUFERixDQUNPLE9BRFAsRUFDZ0IsT0FEaEIsQ0FFQyxDQUFDLFFBRkYsQ0FFVyxpQkFGWCxDQUdDLENBQUMsS0FIRixDQUFBLENBSUMsQ0FBQyxPQUpGLENBSVUsTUFKVixFQUZEOztJQUZNO0lBV1AsT0FBQSxHQUFVLFNBQUMsS0FBRDtBQUVULFVBQUE7TUFBQSxJQUFBLEdBQU8sU0FBVSxDQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBVixDQUFlLENBQUMsS0FBMUIsQ0FBQTtNQUVQLElBQUcsWUFBSDtRQUVDLENBQUMsQ0FBQyxJQUFGLENBQU87VUFFTixHQUFBLEVBQUsseUJBRkM7VUFHTixRQUFBLEVBQVUsTUFISjtVQUlOLElBQUEsRUFBTTtZQUFDLElBQUEsRUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQWpCO1lBQXVCLEtBQUEsRUFBTyxJQUFJLENBQUMsS0FBbkM7V0FKQTtVQUtOLE1BQUEsRUFBUSxNQUxGO1NBQVA7UUFRQSxVQUFBLENBQVcsU0FBQTtpQkFFVixJQUFBLENBQUssSUFBTDtRQUZVLENBQVgsRUFHRSxHQUhGLEVBVkQ7T0FBQSxNQUFBO1FBZUMsQ0FBQyxDQUFDLElBQUYsQ0FBTztVQUVOLEdBQUEsRUFBSyx5QkFGQztVQUdOLFFBQUEsRUFBVSxNQUhKO1VBSU4sSUFBQSxFQUFNO1lBQUMsSUFBQSxFQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBakI7WUFBdUIsS0FBQSxFQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBVixHQUFrQixDQUFoRDtXQUpBO1VBS04sTUFBQSxFQUFRLE1BTEY7U0FBUCxFQWZEOzthQTBCQSxDQUFBLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFaLENBQXFCLENBQUMsTUFBdEIsQ0FBNkIsT0FBN0IsRUFBc0MsT0FBdEMsQ0FDQyxDQUFDLFdBREYsQ0FDYyxpQkFEZCxDQUVDLENBQUMsT0FGRixDQUVVLE1BRlY7SUE5QlM7SUFzQ1YsT0FBQSxHQUFVLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxJQUFmO0FBRVQsVUFBQTtNQUFBLElBQUcsSUFBSSxDQUFDLEtBQUwsR0FBYSxDQUFoQjtRQUdDLEtBQUEsR0FBUSxDQUFBLENBQUUsYUFBRixDQUFnQixDQUFDLFFBQWpCLENBQTBCLFlBQTFCO1FBQ1IsTUFBQSxHQUFTLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsUUFBakIsQ0FBMEIsY0FBMUI7UUFDVCxPQUFBLEdBQVUsQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxRQUFqQixDQUEwQixlQUExQjtRQUNWLE1BQUEsR0FBUyxDQUFBLENBQUUsYUFBRixDQUFnQixDQUFDLFFBQWpCLENBQTBCLGNBQTFCO1FBQ1QsSUFBQSxHQUFPLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsUUFBakIsQ0FBMEIsWUFBMUI7UUFDUCxNQUFBLEdBQVMsQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxRQUFqQixDQUEwQixjQUExQjtRQUNULEtBQUEsR0FBUSxDQUFBLENBQUUsV0FBRixDQUFjLENBQUMsUUFBZixDQUF3QixhQUF4QjtRQUVSLEtBQUEsR0FBUSxDQUFBLENBQUUsYUFBRixDQUFnQixDQUFDLFFBQWpCLENBQTBCLFdBQTFCO1FBQ1IsSUFBQSxHQUFPLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsUUFBakIsQ0FBMEIsaUJBQTFCLENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsT0FBbEQsRUFBMkQsS0FBM0QsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUFJLENBQUMsR0FBNUU7UUFDUCxJQUFBLEdBQU8sQ0FBQSxDQUFFLGFBQUYsQ0FBZ0IsQ0FBQyxRQUFqQixDQUEwQixnQkFBMUIsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxPQUFqRCxFQUEwRCxJQUExRCxDQUErRCxDQUFDLElBQWhFLENBQXFFLElBQUksQ0FBQyxFQUExRTtRQUVQLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxLQUFSLENBQWMsU0FBQTtVQUViLENBQUMsQ0FBQyxJQUFGLENBQU87WUFFTixHQUFBLEVBQUsseUJBRkM7WUFHTixRQUFBLEVBQVUsTUFISjtZQUlOLElBQUEsRUFBTTtjQUFDLElBQUEsRUFBTSxJQUFQO2NBQWEsTUFBQSxFQUFRLENBQXJCO2FBSkE7WUFLTixNQUFBLEVBQVEsTUFMRjtXQUFQO1VBUUEsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLEtBQVQsQ0FBZSxNQUFmO2lCQUVBLElBQUEsQ0FBSyxNQUFMLEVBQWEsSUFBYixFQUFtQixJQUFuQjtRQVphLENBQWQ7UUFlQSxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsS0FBUixDQUFjLFNBQUE7VUFFYixDQUFDLENBQUMsSUFBRixDQUFPO1lBRU4sR0FBQSxFQUFLLHlCQUZDO1lBR04sUUFBQSxFQUFVLE1BSEo7WUFJTixJQUFBLEVBQU07Y0FBQyxJQUFBLEVBQU0sSUFBUDtjQUFhLE1BQUEsRUFBUSxDQUFyQjthQUpBO1lBS04sTUFBQSxFQUFRLE1BTEY7V0FBUDtpQkFRQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsS0FBVCxDQUFlLE1BQWY7UUFWYSxDQUFkO1FBY0EsQ0FBQSxDQUFFLEtBQUYsQ0FDQyxDQUFDLElBREYsQ0FDTyxJQUFJLENBQUMsS0FEWjtRQUdBLENBQUEsQ0FBRSxJQUFGLENBQ0MsQ0FBQyxJQURGLENBQ08sSUFBSSxDQUFDLFdBRFo7UUFHQSxDQUFBLENBQUUsTUFBRixDQUNDLENBQUMsTUFERixDQUNTLEtBRFQ7UUFJQSxDQUFBLENBQUUsS0FBRixDQUNDLENBQUMsTUFERixDQUNTLElBRFQsQ0FFQyxDQUFDLE1BRkYsQ0FFUyxJQUZUO1FBSUEsQ0FBQSxDQUFFLE1BQUYsQ0FDQyxDQUFDLE1BREYsQ0FDUyxLQURUO1FBSUEsQ0FBQSxDQUFFLE9BQUYsQ0FDQyxDQUFDLE1BREYsQ0FDUyxNQURULENBRUMsQ0FBQyxNQUZGLENBRVMsSUFGVCxDQUdDLENBQUMsTUFIRixDQUdTLE1BSFQ7UUFLQSxDQUFBLENBQUUsTUFBRixDQUNDLENBQUMsTUFERixDQUNTLE9BRFQ7UUFHQSxDQUFBLENBQUUsS0FBRixDQUNDLENBQUMsTUFERixDQUNTLE1BRFQ7UUFHQSxDQUFBLENBQUUsTUFBRixDQUNDLENBQUMsTUFERixDQUNTLEtBRFQ7ZUFHQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsS0FBVCxDQUFlO1VBQUMsUUFBQSxFQUFVLFFBQVg7VUFBcUIsSUFBQSxFQUFNLElBQTNCO1VBQWlDLFFBQUEsRUFBVSxLQUEzQztTQUFmLEVBNUVEO09BQUEsTUFBQTtlQWdGQyxJQUFBLENBQUssTUFBTCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFoRkQ7O0lBRlM7SUFzRlYsSUFBQSxHQUFPLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxJQUFmO0FBR04sVUFBQTtNQUFBLFFBQUEsR0FBVztNQUNYLEtBQUEsR0FBUSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsT0FBVixDQUFrQixzQkFBbEIsQ0FBeUMsQ0FBQyxNQUExQyxHQUFtRDtNQUczRCxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLGdCQUFmLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsU0FBQTtBQUdyQyxZQUFBO1FBQUEsSUFBQSxHQUFPO1FBQ1AsS0FBQSxHQUFRLENBQUEsQ0FBRSxJQUFGLENBQU8sQ0FBQyxJQUFSLENBQWEsZ0JBQWI7UUFFUixJQUFVLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBYixJQUFzQixDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsT0FBUixDQUFnQixzQkFBaEIsQ0FBdUMsQ0FBQyxNQUF4QyxLQUFrRCxLQUFsRjtBQUFBLGlCQUFBOztRQUlBLElBQUcsdUJBQUg7VUFDQyxJQUFBLEdBQU8sUUFBUyxDQUFBLEtBQUEsRUFEakI7U0FBQSxNQUFBO1VBR0MsSUFBQSxHQUFPO1lBRU4sUUFBQSxFQUFVLEVBRko7WUFHTixJQUFBLEVBQU0sSUFIQTtZQUlOLEtBQUEsRUFBTyxLQUpEOztVQU1QLFFBQVMsQ0FBQSxLQUFBLENBQVQsR0FBa0IsS0FUbkI7O1FBWUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFkLENBQW1CLElBQW5CO2VBQ0EsSUFBSSxDQUFDLElBQUwsR0FBWTtNQXZCeUIsQ0FBdEM7TUEwQkEsUUFBQSxHQUFXLFFBQVEsQ0FBQyxNQUFULENBQWdCLFNBQUMsT0FBRDtRQUUxQixJQUFHLGVBQUg7QUFDQyxpQkFBTyxLQURSO1NBQUEsTUFBQTtBQUdDLGlCQUFPLE1BSFI7O01BRjBCLENBQWhCO01BVVgsU0FBVSxDQUFBLElBQUEsQ0FBVixHQUFrQjthQUNsQixJQUFBLENBQUssUUFBUSxDQUFDLEtBQVQsQ0FBQSxDQUFMO0lBNUNNO1dBa0RQLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQUE7QUFFN0IsVUFBQTtNQUFBLElBQUEsR0FBTyxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLGVBQWI7YUFFUCxDQUFDLENBQUMsSUFBRixDQUFPO1FBRU4sR0FBQSxFQUFLLHlCQUZDO1FBR04sUUFBQSxFQUFVLE1BSEo7UUFJTixJQUFBLEVBQU07VUFBQyxJQUFBLEVBQU0sSUFBUDtTQUpBO1FBS04sTUFBQSxFQUFRLEtBTEY7UUFNTixPQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFEO1lBQ1IsSUFBNkIsSUFBSSxDQUFDLE1BQWxDO3FCQUFBLE9BQUEsQ0FBUSxLQUFSLEVBQWMsSUFBZCxFQUFvQixJQUFwQixFQUFBOztVQURRO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5IO09BQVA7SUFKNkIsQ0FBOUI7RUE5TEMsQ0FBRjtBQUFBOzs7QUNEQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLFdBQVAsTUFBTSxDQUFDLFNBQ047SUFBQSxJQUFBLEVBQ0M7TUFBQSxHQUFBLEVBQUssR0FBTDtNQUNBLElBQUEsRUFBTSxHQUROO01BRUEsTUFBQSxFQUFRLEdBRlI7TUFHQSxNQUFBLEVBQVEsR0FIUjtLQUREOzs7O0lBU0QsTUFBTSxDQUFDLFNBQVU7OztFQUlqQixDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsS0FBVixDQUFnQixTQUFBO1dBQ2YsTUFBTSxDQUFDLE1BQVAsR0FBZ0I7RUFERCxDQUFoQjs7RUFHQSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFNBQUE7V0FDZCxNQUFNLENBQUMsTUFBUCxHQUFnQjtFQURGLENBQWY7O0VBR0EsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQTtJQUNoQixJQUErQixJQUFJLENBQUMsUUFBcEM7TUFBQSxZQUFBLENBQWEsSUFBSSxDQUFDLFFBQWxCLEVBQUE7O1dBQ0EsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsVUFBQSxDQUFXLFNBQUE7YUFDMUIsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBaEI7SUFEMEIsQ0FBWCxFQUVkLEdBRmM7RUFGQSxDQUFqQjs7RUFTQSxNQUFNLENBQUMsU0FBUCxNQUFNLENBQUMsT0FBUyxTQUFDLEtBQUQsRUFBUSxPQUFSO0FBQ2QsUUFBQTtJQUFBLE1BQUEsR0FBUztBQUNULFNBQXVCLGtGQUF2QjtNQUFBLE1BQUEsSUFBVTtBQUFWO1dBRUEsQ0FBQyxNQUFBLEdBQVMsS0FBVixDQUFnQixDQUFDLEtBQWpCLENBQXVCLE9BQUEsR0FBVSxDQUFDLENBQWxDO0VBSmM7O0VBT2hCLFlBQUEsR0FBZSxTQUFDLEtBQUQ7SUFDZCxJQUFHLEtBQUssQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7YUFDQyxLQUFBLEdBQVEsSUFEVDtLQUFBLE1BQUE7YUFHQyxNQUhEOztFQURjOztFQU1mLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsTUFBZDtJQUNaLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYjtJQUVQLElBQUcsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUFqQjtNQUNDLElBQUEsSUFBUSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosRUFBbUIsQ0FBbkIsRUFEVDtLQUFBLE1BQUE7TUFHQyxJQUFBLElBQVEsTUFIVDs7V0FLQSxJQUFBLEdBQU87RUFSSzs7RUFXYixNQUFNLENBQUMsZUFBUCxNQUFNLENBQUMsYUFBZSxTQUFDLEtBQUQ7QUFFckIsUUFBQTtJQUFBLElBQUEsR0FBTztJQUNQLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FBSyxLQUFBLEdBQVEsSUFBYjtJQUNYLENBQUEsR0FBSSxJQUFJLENBQUMsVUFBTCxDQUFBLENBQUEsR0FBb0I7SUFDeEIsQ0FBQSxHQUFJLElBQUksQ0FBQyxXQUFMLENBQUE7SUFDSixDQUFBLEdBQUksSUFBSSxDQUFDLGFBQUwsQ0FBQTtJQUNKLENBQUEsR0FBSSxJQUFJLENBQUMsYUFBTCxDQUFBO0lBR0osSUFBK0IsQ0FBQSxHQUFJLENBQW5DO01BQUEsSUFBQSxJQUFRLENBQUEsR0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQXhCOztJQUNBLElBQWdELENBQUEsR0FBSSxDQUFwRDtNQUFBLElBQUEsR0FBTyxVQUFBLENBQVcsSUFBWCxFQUFpQixDQUFqQixFQUFvQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQWhDLEVBQVA7O0lBQ0EsSUFBa0QsQ0FBQSxHQUFJLENBQUosSUFBUyxDQUFBLEdBQUksQ0FBL0Q7TUFBQSxJQUFBLEdBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsQ0FBakIsRUFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFoQyxFQUFQOztJQUNBLElBQWtELENBQUEsR0FBSSxDQUFKLElBQVMsQ0FBQSxHQUFJLENBQWIsSUFBa0IsQ0FBQSxHQUFJLENBQXhFO01BQUEsSUFBQSxHQUFPLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLENBQWpCLEVBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBaEMsRUFBUDs7V0FFQTtFQWZxQjs7RUFpQnRCLE1BQU0sQ0FBQyxvQkFBUCxNQUFNLENBQUMsa0JBQW9CLFNBQUMsS0FBRDtBQUUxQixRQUFBO0lBQUEsSUFBQSxHQUFPO0lBQ1AsSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFLLEtBQUEsR0FBUSxJQUFiO0lBQ1gsQ0FBQSxHQUFJLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBQSxHQUFvQjtJQUN4QixDQUFBLEdBQUksSUFBSSxDQUFDLFdBQUwsQ0FBQTtJQUNKLENBQUEsR0FBSSxJQUFJLENBQUMsYUFBTCxDQUFBO0lBQ0osQ0FBQSxHQUFJLElBQUksQ0FBQyxhQUFMLENBQUE7SUFHSixJQUE4QixDQUFBLEdBQUksQ0FBbEM7QUFBQSxhQUFPLENBQUEsR0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQXZCOztJQUNBLElBQWdELENBQUEsR0FBSSxDQUFwRDtBQUFBLGFBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsQ0FBakIsRUFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFoQyxFQUFQOztJQUNBLElBQWtELENBQUEsR0FBSSxDQUF0RDtBQUFBLGFBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsQ0FBakIsRUFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFoQyxFQUFQOztJQUNBLElBQWtELENBQUEsR0FBSSxDQUF0RDtBQUFBLGFBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsQ0FBakIsRUFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFoQyxFQUFQOztFQWIwQjs7RUFrQjNCLFVBQUEsR0FBYTs7VUFHYixNQUFNLENBQUMsU0FBUSxDQUFDLGdCQUFELENBQUMsVUFBWSxTQUFBO0lBQzNCLElBQUcsQ0FBSSxVQUFQO01BQ0MsVUFBQSxHQUFhO2FBQ2IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFoQixDQUF1QixJQUF2QixFQUZEOztFQUQyQjs7RUFRNUIsYUFBQSxHQUFnQjs7RUFDaEIsTUFBTSxDQUFDLFdBQVAsTUFBTSxDQUFDLFNBQVcsU0FBQyxLQUFEO1dBQ2pCLGFBQWEsQ0FBQyxJQUFkLENBQW1CLEtBQW5CO0VBRGlCOztFQUlsQixLQUFBLEdBQVEsU0FBQyxHQUFEO0FBQ1AsUUFBQTtJQUFBLElBQWUsR0FBQSxLQUFPLElBQVAsSUFBZSxPQUFRLEdBQVIsS0FBa0IsUUFBaEQ7QUFBQSxhQUFPLElBQVA7O0lBQ0EsSUFBQSxHQUFXLElBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQTtBQUNYLFNBQUEsVUFBQTtNQUNDLElBQUssQ0FBQSxHQUFBLENBQUwsR0FBWSxLQUFBLENBQU0sR0FBSSxDQUFBLEdBQUEsQ0FBVjtBQURiO1dBRUE7RUFMTzs7RUFPUixVQUFBLEdBQWEsU0FBQyxDQUFELEVBQUksQ0FBSjtJQUNaLE9BQU8sQ0FBQyxHQUFSLENBQVksR0FBWixFQUFpQixDQUFqQixFQUFvQixDQUFwQjtXQUNBLFVBQUEsQ0FBVyxDQUFDLFNBQUE7TUFDWCxPQUFPLENBQUMsR0FBUixDQUFZLEdBQVosRUFBaUIsQ0FBakIsRUFBb0IsQ0FBcEI7YUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLENBQVQsRUFBWTtRQUVYLFNBQUEsRUFBVztVQUVWLElBQUEsRUFBTSxRQUZJO1NBRkE7UUFNWCxVQUFBLEVBQVksT0FORDtPQUFaO0lBRlcsQ0FBRCxDQUFYLEVBVU8sQ0FBQSxHQUFJLElBVlg7RUFGWTs7RUFpQmIsTUFBTSxDQUFDLGVBQVAsTUFBTSxDQUFDLGFBQWUsU0FBQTtBQUNyQixRQUFBO0lBQUEsSUFBRyxNQUFNLENBQUMsTUFBVjtBQUVDLFdBQUEsK0RBQUE7O1FBQ0MsVUFBQSxDQUFXLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxFQUFhLFlBQWIsQ0FBWCxFQUF1QyxLQUF2QztBQUREO2FBRUEsYUFBQSxHQUFnQixHQUpqQjs7RUFEcUI7O0VBU3RCLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxLQUFWLENBQWdCLFNBQUE7V0FBRyxNQUFNLENBQUMsVUFBUCxDQUFBO0VBQUgsQ0FBaEI7O0VBWUEsSUFBSSxDQUFDLFVBQUwsSUFBSSxDQUFDLFFBQVUsU0FBQyxLQUFELEVBQVEsR0FBUixFQUFhLEdBQWI7V0FDZCxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxFQUFnQixHQUFoQixDQUFULEVBQStCLEdBQS9CO0VBRGM7O0VBSWYsSUFBSSxDQUFDLFNBQUwsSUFBSSxDQUFDLE9BQVMsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7V0FDYixDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUw7RUFERzs7RUFLZCxJQUFJLENBQUMsYUFBTCxJQUFJLENBQUMsV0FBYSxTQUFDLEdBQUQ7QUFDZCxRQUFBO0lBQUEsTUFBQSxHQUFTLDJDQUEyQyxDQUFDLElBQTVDLENBQWlELEdBQWpEO0lBQ1QsSUFLSyxNQUxMO0FBQUEsYUFBTztRQUNILENBQUEsRUFBRyxRQUFBLENBQVMsTUFBTyxDQUFBLENBQUEsQ0FBaEIsRUFBb0IsRUFBcEIsQ0FEQTtRQUVILENBQUEsRUFBRyxRQUFBLENBQVMsTUFBTyxDQUFBLENBQUEsQ0FBaEIsRUFBb0IsRUFBcEIsQ0FGQTtRQUdILENBQUEsRUFBRyxRQUFBLENBQVMsTUFBTyxDQUFBLENBQUEsQ0FBaEIsRUFBb0IsRUFBcEIsQ0FIQTtRQUFQOztXQU1BO0VBUmM7O0VBVWxCLElBQUksQ0FBQyxhQUFMLElBQUksQ0FBQyxXQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQO0FBQ2QsV0FBTyxHQUFBLEdBQU0sQ0FBQyxDQUFDLENBQUEsSUFBSyxFQUFOLENBQUEsR0FBWSxDQUFDLENBQUEsSUFBSyxFQUFOLENBQVosR0FBd0IsQ0FBQyxDQUFBLElBQUssQ0FBTixDQUF4QixHQUFtQyxDQUFwQyxDQUFzQyxDQUFDLFFBQXZDLENBQWdELEVBQWhELENBQW1ELENBQUMsS0FBcEQsQ0FBMEQsQ0FBMUQ7RUFEQzs7RUFJbEIsSUFBSSxDQUFDLGVBQUwsSUFBSSxDQUFDLGFBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVA7QUFFbkIsUUFBQTtJQUFBLEVBQUEsR0FBSyxJQUFJLENBQUMsUUFBTCxDQUFjLENBQWQ7SUFDTCxFQUFBLEdBQUssSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUFkO0lBRUwsRUFBQSxHQUFLO01BQ0osQ0FBQSxFQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFWLEVBQWEsRUFBRSxDQUFDLENBQWhCLEVBQW1CLEVBQUUsQ0FBQyxDQUF0QixDQUFYLENBREM7TUFFSixDQUFBLEVBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLENBQVYsRUFBYSxFQUFFLENBQUMsQ0FBaEIsRUFBbUIsRUFBRSxDQUFDLENBQXRCLENBQVgsQ0FGQztNQUdKLENBQUEsRUFBRyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsQ0FBVixFQUFhLEVBQUUsQ0FBQyxDQUFoQixFQUFtQixFQUFFLENBQUMsQ0FBdEIsQ0FBWCxDQUhDOztBQU1MLFdBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxFQUFFLENBQUMsQ0FBakIsRUFBb0IsRUFBRSxDQUFDLENBQXZCLEVBQTBCLEVBQUUsQ0FBQyxDQUE3QjtFQVhZOztFQWlCcEIsY0FBQSxHQUFpQixTQUFBO0FBQ2hCLFFBQUE7SUFBQSxHQUFBLEdBQU0sQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLFFBQVIsQ0FBaUIsZUFBakI7SUFDTixLQUFBLEdBQVEsQ0FBQSxDQUFFLElBQUYsQ0FBTyxDQUFDLFFBQVIsQ0FBaUIsaUJBQWpCO0lBRVIsR0FBQSxHQUFNLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxJQUFQLENBQVksS0FBWjtJQUNOLEdBQUEsR0FBTSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsSUFBUCxDQUFZLEtBQVo7SUFDTixFQUFBLEdBQUssQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLElBQVAsQ0FBWSxJQUFaO0lBQ0wsRUFBQSxHQUFLLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxJQUFQLENBQVksSUFBWjtJQUNMLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxJQUFQLENBQVksS0FBWixDQUFYLEVBQStCLEdBQS9CLEVBQW9DLEdBQXBDO0lBQ04sUUFBQSxHQUFXLE9BQUEsaURBQWtDLEtBQWxDO0lBRVgsT0FBQSxHQUFVLENBQUMsR0FBQSxHQUFNLEdBQVAsQ0FBQSxHQUFjLENBQUMsR0FBQSxHQUFNLEdBQVAsQ0FBZCxHQUE0QjtJQUN0QyxJQUEyQixRQUEzQjtNQUFBLE9BQUEsR0FBVSxHQUFBLEdBQU0sUUFBaEI7O0lBTUEsQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLEdBQVAsQ0FBVyxPQUFYLEVBQW9CLE9BQUEsR0FBVSxHQUE5QjtJQUNBLElBQTBFLFlBQUEsSUFBUSxZQUFsRjtNQUFBLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxHQUFQLENBQVcsa0JBQVgsRUFBK0IsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsT0FBQSxHQUFVLEdBQTFCLEVBQStCLEVBQS9CLEVBQW1DLEVBQW5DLENBQS9CLEVBQUE7O1dBSUEsQ0FBQSxDQUFFLEtBQUYsQ0FBUSxDQUFDLElBQVQsQ0FBYyxHQUFBLEdBQU0sS0FBTixHQUFjLEdBQTVCO0VBdkJnQjs7RUF5QmpCLENBQUEsQ0FBRSxTQUFBO1dBQ0QsQ0FBQSxDQUFFLFdBQUYsQ0FBYyxDQUFDLElBQWYsQ0FBb0IsU0FBQTthQUNuQixJQUFJLENBQUMsV0FBTCxJQUFJLENBQUMsU0FBVztJQURHLENBQXBCO0VBREMsQ0FBRjs7RUFNQSxjQUFBLEdBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUJqQixpQkFBaUIsQ0FBQyxTQUFTLENBQUMsY0FBNUIsR0FBNkM7O0VBWTdDLENBQUMsU0FBQTtBQUVBLFFBQUE7V0FBQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUFFZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBSkEsQ0FBRCxDQUFBLENBQUE7O1dBa0NBLE1BQU0sQ0FBQyxVQUFTLENBQUMsZ0JBQUQsQ0FBQyxTQUFXLFNBQUE7V0FDM0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSw2QkFBYixFQUE0QyxNQUE1QztFQUQyQjs7V0FLNUIsTUFBTSxDQUFDLFVBQVMsQ0FBQyxvQkFBRCxDQUFDLGFBQWUsU0FBQyxNQUFELEVBQVMsT0FBVDtXQUMvQixJQUFJLENBQUMsT0FBTCxDQUFpQixJQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBUCxDQUFBLENBQVAsRUFBd0IsSUFBeEIsQ0FBakIsRUFBZ0QsT0FBaEQ7RUFEK0I7QUFsU2hDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcblxyXG5cclxuXHJcbkBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZ2FtZScsIFtdKVxyXG5cclxuXHJcblxyXG5AYXBwLmNvbnRyb2xsZXIoJ0dhbWVDb250cm9sbGVyJywgWyckc2NvcGUnLCAoJHNjb3BlKSAtPlxyXG5cclxuXHJcblx0JHNjb3BlLnJvdW5kID0gKHZhbHVlLCBwcmVjaXNpb24pIC0+XHJcblxyXG5cdFx0cCA9IHByZWNpc2lvbiA/IDBcclxuXHRcdG4gPSBNYXRoLnBvdygxMCwgcClcclxuXHJcblx0XHRNYXRoLnJvdW5kKHZhbHVlICogbikgLyBuXHJcblxyXG5dKVxyXG5cclxuXHJcblxyXG5AYXBwLmNvbnRyb2xsZXIoJ1BsYXllckNvbnRyb2xsZXInLCBbJyRzY29wZScsICgkc2NvcGUpIC0+XHJcblxyXG5cclxuXSlcclxuXHJcbiIsIlxyXG5cclxuY2xpY2tlZCA9IC0+XHJcblx0JCgnLmF2YXRhcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdCQoJyNhdmF0YXInKS52YWwoJCh0aGlzKS5kYXRhKCdhdmF0YXInKSlcclxuXHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cclxuXHJcbiQgLT5cclxuXHQkKCcuYXZhdGFyJykuY2xpY2soY2xpY2tlZCkuZmlyc3QoKS50cmlnZ2VyKCdjbGljaycpIiwiY29uZmlnID1cclxuXHRmb250U2l6ZTogMzBcclxuXHRiYXJGb250U2l6ZTogMjBcclxuXHRuYW1lRm9udFNpemU6IDMwXHJcblx0bWFyZ2luOiA1XHJcblx0aW50ZXJ2YWw6IDEwMDAgLyA2MFxyXG5cclxuXHJcblxyXG5jbGFzcyBDaGFyYWN0ZXJcclxuXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAodGVhbSwgZGF0YSkgLT5cclxuXHJcblx0XHRpbWFnZSA9IG5ldyBJbWFnZSgpXHJcblx0XHRpbWFnZS5zcmMgPSBkYXRhLmF2YXRhclxyXG5cdFx0aW1hZ2Uub25sb2FkID0gPT5cclxuXHRcdFx0QGF2YXRhciA9IGltYWdlXHJcblxyXG5cclxuXHJcblx0XHRAdGVhbSA9IHRlYW1cclxuXHRcdEBuYW1lID0gZGF0YS5uYW1lXHJcblx0XHRAaWQgPSBkYXRhLmlkXHJcblx0XHRAbGV2ZWwgPSBkYXRhLmxldmVsXHJcblx0XHRAaGVhbHRoID0gZGF0YS5oZWFsdGhcclxuXHRcdEBtYXhIZWFsdGggPSBkYXRhLm1heEhlYWx0aFxyXG5cclxuXHJcblx0ZHJhdzogKGNvbnRleHQsIHNpemUpIC0+XHJcblx0XHRpZiBAdGVhbSA9PSAncmVkJ1xyXG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjE3LCA4MywgNzksIDEpJ1xyXG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDIxNywgODMsIDc5LCAwLjQpJ1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoNTEsIDEyMiwgMTgzLCAxKSdcclxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSg1MSwgMTIyLCAxODMsIDAuNCknXHJcblxyXG5cdFx0Y29udGV4dC5maWxsUmVjdCgwLCAwLCBzaXplLCBzaXplKVxyXG5cdFx0Y29udGV4dC5zdHJva2VSZWN0KDAsIDAsIHNpemUsIHNpemUpXHJcblxyXG5cdFx0aWYgQGF2YXRhcj9cclxuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UoQGF2YXRhciwgY29uZmlnLm1hcmdpbiwgY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIpXHJcblxyXG5cdFx0dGV4dCA9IEBuYW1lICsgJyAoJyArIEBsZXZlbCArICcpJ1xyXG5cclxuXHRcdGNvbnRleHQuZm9udCA9IGNvbmZpZy5uYW1lRm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cdFx0Y29udGV4dC5saW5lV2lkdGggPSAxXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xyXG5cdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0bWVhc3VyZSA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdGNvbnRleHQuZmlsbFRleHQodGV4dCwgKHNpemUgLSBtZWFzdXJlLndpZHRoKSAvIDIsIGNvbmZpZy5uYW1lRm9udFNpemUpXHJcblx0XHRjb250ZXh0LnN0cm9rZVRleHQodGV4dCwgKHNpemUgLSBtZWFzdXJlLndpZHRoKSAvIDIsIGNvbmZpZy5uYW1lRm9udFNpemUpXHJcblxyXG5cclxuXHRcdGNvbnRleHQuZm9udCA9IGNvbmZpZy5iYXJGb250U2l6ZSArICdweCBSb2JvdG8nXHJcblx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC40KSdcclxuXHRcdGNvbnRleHQuZmlsbFJlY3QoY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5iYXJGb250U2l6ZSAtIGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcubWFyZ2luICogMiwgY29uZmlnLmJhckZvbnRTaXplKVxyXG5cdFx0Y29udGV4dC5zdHJva2VSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIsIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDIxNywgODMsIDc5LCAxKSdcclxuXHRcdGNvbnRleHQuZmlsbFJlY3QoY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5iYXJGb250U2l6ZSAtIGNvbmZpZy5tYXJnaW4sIChzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIpICogKEBoZWFsdGggLyBAbWF4SGVhbHRoKSwgY29uZmlnLmJhckZvbnRTaXplKVxyXG5cclxuXHRcdHRleHQgPSBNYXRoLnJvdW5kKEBoZWFsdGgpICsgJyAvICcgKyBAbWF4SGVhbHRoXHJcblx0XHRtZWFzdXJlID0gY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdGNvbnRleHQuZmlsbFRleHQodGV4dCwgKHNpemUgLSBtZWFzdXJlLndpZHRoKSAvIDIsIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLyAyKVxyXG5cclxuXHJcblxyXG5cclxuXHJcbmNsYXNzIEJhdHRsZVxyXG5cclxuXHRzcGVlZDogXHJcblx0XHR2aWV3OiAzLjBcclxuXHRcdGluZm86IDMuMFxyXG5cdFx0bmV4dDogMy4wXHJcblxyXG5cclxuXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoZWxlbWVudCkgLT5cclxuXHJcblx0XHRAY2FudmFzID0gJChlbGVtZW50KS5jaGlsZHJlbignY2FudmFzJylbMF1cclxuXHRcdEBjb250ZXh0ID0gQGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcblxyXG5cdFx0QGJhdHRsZUxvZyA9ICQucGFyc2VKU09OKCQoZWxlbWVudCkuY2hpbGRyZW4oJy5iYXR0bGUtbG9nJykuZmlyc3QoKS50ZXh0KCkpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0bG9hZDogLT5cclxuXHJcblx0XHRAaW5kZXggPSAwXHJcblx0XHRAY2hhcmFjdGVycyA9IFtdXHJcblx0XHRAc3RhdGUgPSAndmlldydcclxuXHRcdEBvZmZzZXQgPSAwXHJcblx0XHRAcGF1c2UgPSBmYWxzZVxyXG5cclxuXHRcdCQoQGNhbnZhcykuY2xpY2soKGV2ZW50KSA9PiBAY2xpY2soZXZlbnQpKVxyXG5cdFx0JChkb2N1bWVudCkua2V5ZG93bigoZXZlbnQpID0+IEBrZXkoZXZlbnQpKVxyXG5cclxuXHRcdGZvciBkYXRhIGluIEBiYXR0bGVMb2dbJ3RlYW1zJ11bJ3JlZCddXHJcblx0XHRcdGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoJ3JlZCcsIGRhdGEpXHJcblx0XHRcdEBjaGFyYWN0ZXJzW2NoYXJhY3Rlci5pZF0gPSBjaGFyYWN0ZXJcclxuXHJcblxyXG5cdFx0Zm9yIGRhdGEgaW4gQGJhdHRsZUxvZ1sndGVhbXMnXVsnYmx1ZSddXHJcblx0XHRcdGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoJ2JsdWUnLCBkYXRhKVxyXG5cdFx0XHRAY2hhcmFjdGVyc1tjaGFyYWN0ZXIuaWRdID0gY2hhcmFjdGVyXHJcblxyXG5cdFx0QGNvbnRleHQuZm9udCA9IGNvbmZpZy5mb250U2l6ZSArICdweCBSb2JvdG8nXHJcblxyXG5cclxuXHRcdEBhY3Rpb24gPSBAYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRAYXR0YWNrZXIgPSBAY2hhcmFjdGVyc1tAYWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0QGRlZmVuZGVyID0gQGNoYXJhY3RlcnNbQGFjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHR0cnVlXHJcblxyXG5cclxuXHJcblxyXG5cdGRyYXdDaGFyYWN0ZXJzOiAoYXR0YWNrZXIsIGRlZmVuZGVyKSAtPlxyXG5cclxuXHRcdHNpemUgPSBAY2FudmFzLmhlaWdodCAqIDAuNlxyXG5cdFx0aGFsZldpZHRoID0gQGNhbnZhcy53aWR0aCAvIDJcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSgoaGFsZldpZHRoIC0gc2l6ZSkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSBzaXplKSAvIDIpXHJcblx0XHRhdHRhY2tlci5kcmF3KEBjb250ZXh0LCBzaXplKVxyXG5cdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoKGhhbGZXaWR0aCAtIHNpemUpIC8gMiArIGhhbGZXaWR0aCwgKEBjYW52YXMuaGVpZ2h0IC0gc2l6ZSkgLyAyKVxyXG5cdFx0ZGVmZW5kZXIuZHJhdyhAY29udGV4dCwgc2l6ZSlcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0ZHJhd0luZm86ICh0ZXh0KSAtPlxyXG5cdFx0aGFsZldpZHRoID0gQGNhbnZhcy53aWR0aCAvIDJcclxuXHRcdGhhbGZIZWlnaHQgPSBAY2FudmFzLmhlaWdodCAvIDJcclxuXHRcdGJsb2NrU2l6ZSA9IEBjYW52YXMuaGVpZ2h0ICogMC42XHJcblxyXG5cdFx0c3RhclJhZGl1cyA9IDUwXHJcblx0XHRzdGFyV2lkdGggPSBzdGFyUmFkaXVzICogMlxyXG5cdFx0c3RhclggPSBoYWxmV2lkdGggKyAoYmxvY2tTaXplICsgc3RhclJhZGl1cykgLyAyXHJcblx0XHRzdGFyWSA9IGhhbGZIZWlnaHRcclxuXHRcdHN0YXJXID0gKGJsb2NrU2l6ZSAqIDAuNykgLyBzdGFyV2lkdGhcclxuXHRcdHN0YXJIID0gMS4yXHJcblx0XHRzdGFyUGlrZXMgPSAxM1xyXG5cclxuXHRcdEBjb250ZXh0LmZvbnQgPSBjb25maWcuZm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHR0ZXh0WCA9IHN0YXJYIC0gbWVhc3VyZS53aWR0aCAvIDJcclxuXHRcdHRleHRZID0gaGFsZkhlaWdodFxyXG5cclxuXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC5saW5lV2lkdGggPSAyXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoc3RhclgsIHN0YXJZKVxyXG5cdFx0QGNvbnRleHQuc2NhbGUoc3RhclcsIHN0YXJIKVxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRAY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0QGRyYXdTdGFyKHN0YXJQaWtlcywgc3RhclJhZGl1cyAqIDAuNiwgc3RhclJhZGl1cylcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKHRleHRYLCB0ZXh0WSlcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFRleHQodGV4dCwgMCwgMClcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0ZHJhd1N0YXI6IChwaWtlcywgaW5uZXJSYWRpdXMsIG91dGVyUmFkaXVzKSAtPlxyXG5cdFx0cm90ID0gTWF0aC5QSSAvIDIgKiAzXHJcblx0XHRzdGVwID0gTWF0aC5QSSAvIHBpa2VzXHJcblxyXG5cdFx0QGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHRcdHggPSBNYXRoLmNvcyhyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdHkgPSBNYXRoLnNpbihyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdEBjb250ZXh0Lm1vdmVUbyh4LCB5KVxyXG5cdFx0cm90ICs9IHN0ZXBcclxuXHJcblx0XHRmb3IgaSBpbiBbMS4ucGlrZXNdXHJcblx0XHRcdHggPSBNYXRoLmNvcyhyb3QpICogaW5uZXJSYWRpdXNcclxuXHRcdFx0eSA9IE1hdGguc2luKHJvdCkgKiBpbm5lclJhZGl1c1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8oeCwgeSlcclxuXHRcdFx0cm90ICs9IHN0ZXBcclxuXHJcblx0XHRcdHggPSBNYXRoLmNvcyhyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdFx0eSA9IE1hdGguc2luKHJvdCkgKiBvdXRlclJhZGl1c1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8oeCwgeSlcclxuXHRcdFx0cm90ICs9IHN0ZXBcclxuXHJcblx0XHRAY29udGV4dC5saW5lVG8oMCwgLW91dGVyUmFkaXVzKVxyXG5cdFx0QGNvbnRleHQuZmlsbCgpXHJcblx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdFxyXG5cclxuXHRnZXRFbmRUZXh0OiAtPlxyXG5cclxuXHRcdGlmIEBiYXR0bGVMb2dbJ3dpbiddXHJcblxyXG5cdFx0XHRpMThuLmJhdHRsZS53aW5cclxuXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHRpMThuLmJhdHRsZS5sb3NlXHJcblxyXG5cclxuXHRkcmF3OiAoZGVsdGEpLT5cclxuXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcclxuXHRcdEBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodClcclxuXHRcdEBvZmZzZXQgKz0gQHNwZWVkW0BzdGF0ZV0gKiBkZWx0YVxyXG5cdFx0YW5pbWF0ZSA9IHRydWVcclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ3ZpZXcnIGFuZCBhbmltYXRlXHJcblx0XHRcdGFjdGlvbiA9IEBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0YXR0YWNrZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdGRlZmVuZGVyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0aWYoYWN0aW9uLnR5cGUgPT0gJ2hpdCcpXHJcblx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gYWN0aW9uLmhlYWx0aFxyXG5cclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKGF0dGFja2VyLCBkZWZlbmRlcilcclxuXHJcblx0XHRcdGlmKEBvZmZzZXQgPiAxLjAgYW5kIG5vdCBAcGF1c2UpXHJcblx0XHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRcdGRlZmVuZGVyLnN0YXJ0SGVhbHRoID0gZGVmZW5kZXIuaGVhbHRoXHJcblxyXG5cdFx0XHRcdGlmIGFjdGlvbi50eXBlID09ICdoaXQnXHJcblx0XHRcdFx0XHRkZWZlbmRlci5lbmRIZWFsdGggPSBNYXRoLm1heChkZWZlbmRlci5oZWFsdGggLSBhY3Rpb24uZGFtYWdlLCAwKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmVuZEhlYWx0aCA9IGRlZmVuZGVyLmhlYWx0aFxyXG5cclxuXHRcdFx0XHRAc3RhdGUgPSAnaW5mbydcclxuXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnaW5mbycgYW5kIGFuaW1hdGVcclxuXHRcdFx0YWN0aW9uID0gQGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0XHRhdHRhY2tlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0ZGVmZW5kZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0XHRAZHJhd0NoYXJhY3RlcnMoYXR0YWNrZXIsIGRlZmVuZGVyKVxyXG5cclxuXHRcdFx0aWYgQG9mZnNldCA8PSAxLjBcclxuXHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IEBvZmZzZXRcclxuXHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBkZWZlbmRlci5zdGFydEhlYWx0aFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgQG9mZnNldCA8PSAyLjBcclxuXHRcdFx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wXHJcblxyXG5cdFx0XHRcdFx0aSA9IE1hdGguY2xhbXAoQG9mZnNldCAtIDEuMCwgMCwgMSlcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IE1hdGgubGVycChpLCBkZWZlbmRlci5lbmRIZWFsdGgsIGRlZmVuZGVyLnN0YXJ0SGVhbHRoKVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBkZWZlbmRlci5lbmRIZWFsdGhcclxuXHRcdFx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gTWF0aC5tYXgoMy4wIC0gQG9mZnNldCwgMClcclxuXHJcblx0XHRcdGlmKEBvZmZzZXQgPiA0LjApXHJcblx0XHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRcdEBzdGF0ZSA9ICduZXh0J1xyXG5cclxuXHRcdFx0aWYgYWN0aW9uLnR5cGUgPT0gJ2hpdCdcclxuXHRcdFx0XHR0ZXh0ID0gYWN0aW9uLmRhbWFnZVxyXG5cclxuXHRcdFx0XHRpZiBhY3Rpb24uY3JpdFxyXG5cdFx0XHRcdFx0dGV4dCArPSAnISdcclxuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0ZXh0ID0gaTE4bi5iYXR0bGUuZG9kZ2VcclxuXHJcblxyXG5cclxuXHRcdFx0QGRyYXdJbmZvKHRleHQpXHJcblxyXG5cclxuXHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjBcclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICduZXh0JyBhbmQgYW5pbWF0ZVxyXG5cclxuXHRcdFx0cHJldkFjdGlvbiA9IEBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0bmV4dEFjdGlvbiA9IEBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleCArIDFdXHJcblxyXG5cclxuXHRcdFx0cHJldkF0dGFja2VyID0gQGNoYXJhY3RlcnNbcHJldkFjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0cHJldkRlZmVuZGVyID0gQGNoYXJhY3RlcnNbcHJldkFjdGlvbi5kZWZlbmRlcl1cclxuXHJcblxyXG5cdFx0XHRwb3NpdGlvbiA9IChAY2FudmFzLmhlaWdodCAvIDIpICogQG9mZnNldFxyXG5cclxuXHRcdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRcdEBjb250ZXh0LnRyYW5zbGF0ZSgwLCAtcG9zaXRpb24pXHJcblx0XHRcdEBkcmF3Q2hhcmFjdGVycyhwcmV2QXR0YWNrZXIsIHByZXZEZWZlbmRlcilcclxuXHRcdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cclxuXHRcdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRcdEBjb250ZXh0LnRyYW5zbGF0ZSgwLCBAY2FudmFzLmhlaWdodCAtIHBvc2l0aW9uKVxyXG5cclxuXHRcdFx0aWYgbmV4dEFjdGlvbj9cclxuXHRcdFx0XHRuZXh0QXR0YWNrZXIgPSBAY2hhcmFjdGVyc1tuZXh0QWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRcdG5leHREZWZlbmRlciA9IEBjaGFyYWN0ZXJzW25leHRBY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0XHRcdGlmKG5leHRBY3Rpb24udHlwZSA9PSAnaGl0JylcclxuXHRcdFx0XHRcdG5leHREZWZlbmRlci5oZWFsdGggPSBuZXh0QWN0aW9uLmhlYWx0aFxyXG5cclxuXHRcdFx0XHRAZHJhd0NoYXJhY3RlcnMobmV4dEF0dGFja2VyLCBuZXh0RGVmZW5kZXIpXHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9IEBnZXRFbmRUZXh0KClcclxuXHRcdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdFx0XHRtZWFzdXJlID0gQGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdFx0XHRAY29udGV4dC5maWxsVGV4dCh0ZXh0LCAoQGNhbnZhcy53aWR0aCAtIG1lYXN1cmUud2lkdGgpIC8gMiwgKEBjYW52YXMuaGVpZ2h0IC0gMTUpIC8gMilcclxuXHJcblx0XHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdFx0aWYgQG9mZnNldCA+IDIuMFxyXG5cdFx0XHRcdEBpbmRleCsrXHJcblx0XHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRcdGlmIG5leHRBY3Rpb24/XHJcblx0XHRcdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRAc3RhdGUgPSAnZW5kJ1xyXG5cclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnZW5kJyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHR0ZXh0ID0gQGdldEVuZFRleHQoKVxyXG5cdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0XHRtZWFzdXJlID0gQGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdFx0QGNvbnRleHQuZmlsbFRleHQodGV4dCwgKEBjYW52YXMud2lkdGggLSBtZWFzdXJlLndpZHRoKSAvIDIsIChAY2FudmFzLmhlaWdodCAtIDE1KSAvIDIpXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHJcblxyXG5cclxuXHRcdHdpZHRoID0gQGNhbnZhcy53aWR0aCAtIDRcclxuXHRcdGhlaWdodCA9IEBjYW52YXMuaGVpZ2h0IC0gMlxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjcpJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC40KSdcclxuXHRcdEBjb250ZXh0LmZpbGxSZWN0KDIsIGhlaWdodCAtIDIwLCB3aWR0aCwgMjApXHJcblx0XHRAY29udGV4dC5zdHJva2VSZWN0KDIsIGhlaWdodCAtIDIwLCB3aWR0aCwgMjApXHJcblxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyM1QkMwREUnXHJcblx0XHRAY29udGV4dC5maWxsUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGggKiAoTWF0aC5taW4oQGluZGV4IC8gKEBiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpLCAxKSksIDIwKVxyXG5cdFx0QGNvbnRleHQubGluZVdpZHRoID0gNVxyXG5cclxuXHRcdGZvciBtYXJrIGluIEBiYXR0bGVMb2dbJ21hcmtzJ11cclxuXHJcblx0XHRcdGlmIG1hcmsudHlwZSA9PSAnZmFpbnRlZCdcclxuXHRcdFx0XHRAY29udGV4dC5zdHJva2VTdHlsZSA9ICcjRDk1MzRGJ1xyXG5cclxuXHRcdFx0YXQgPSAobWFyay5hdCAvIChAYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKSkgKiB3aWR0aFxyXG5cclxuXHRcdFx0QGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHRcdFx0QGNvbnRleHQubW92ZVRvKGF0IC0gQGNvbnRleHQubGluZVdpZHRoIC8gMiArIDIsIGhlaWdodCAtIDIwKVxyXG5cdFx0XHRAY29udGV4dC5saW5lVG8oYXQgLSBAY29udGV4dC5saW5lV2lkdGggLyAyICsgMiwgaGVpZ2h0KVxyXG5cdFx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblxyXG5cclxuXHRjbGljazogKGV2ZW50KSAtPlxyXG5cdFx0Y29vcmRzID0gQGNhbnZhcy5yZWxNb3VzZUNvb3JkcyhldmVudClcclxuXHRcdHggPSBjb29yZHMueFxyXG5cdFx0eSA9IGNvb3Jkcy55XHJcblxyXG5cdFx0bCA9IDJcclxuXHRcdHIgPSBsICsgQGNhbnZhcy53aWR0aCAtIDRcclxuXHRcdGIgPSBAY2FudmFzLmhlaWdodCAtIDJcclxuXHRcdHQgPSBiIC0gMjBcclxuXHJcblxyXG5cdFx0aWYgeCA+PSBsIGFuZCB4IDw9IHIgYW5kIHkgPj0gdCBhbmQgeSA8PSBiXHJcblx0XHRcdEBpbmRleCA9IE1hdGgucm91bmQoKHggLSBsKSAvIChyIC0gbCkgKiAoQGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSkpXHJcblx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblxyXG5cdGtleTogKGV2ZW50KSAtPlxyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDMyXHJcblx0XHRcdEBwYXVzZSA9ICFAcGF1c2VcclxuXHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMzdcclxuXHRcdFx0QGluZGV4ID0gTWF0aC5tYXgoQGluZGV4IC0gMSwgMClcclxuXHRcdFx0QG9mZnNldCA9IDEuMFxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAzOVxyXG5cdFx0XHRAaW5kZXggPSBNYXRoLm1pbihAaW5kZXggKyAxLCBAYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKVxyXG5cdFx0XHRAb2Zmc2V0ID0gMS4wXHJcblx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cclxuXHJcblx0cmVxdWVzdEZyYW1lOiAodGltZSkgLT5cclxuXHJcblx0XHRkZWx0YSA9IE1hdGgubWF4KHRpbWUgLSBAbGFzdFRpbWUsIDApXHJcblx0XHRAbGFzdFRpbWUgPSB0aW1lXHJcblx0XHRAYWNjdW11bGF0b3IgKz0gZGVsdGFcclxuXHJcblx0XHR3aGlsZSBAYWNjdW11bGF0b3IgPj0gY29uZmlnLmludGVydmFsXHJcblxyXG5cdFx0XHRAYWNjdW11bGF0b3IgLT0gY29uZmlnLmludGVydmFsXHJcblx0XHRcdEBkcmF3KGNvbmZpZy5pbnRlcnZhbCAvIDEwMDApXHJcblxyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodGltZSkgPT4gQHJlcXVlc3RGcmFtZSh0aW1lKSlcclxuXHJcblxyXG5cdHN0YXJ0OiAtPlxyXG5cclxuXHRcdGlmIEBsb2FkKClcclxuXHJcblx0XHRcdEBsYXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcblx0XHRcdEBhY2N1bXVsYXRvciA9IDAuMFxyXG5cdFx0XHRAcmVxdWVzdEZyYW1lKEBsYXN0VGltZSlcclxuXHJcblxyXG5cclxuXHJcbiQoLT5cclxuXHJcblx0JCgnLmJhdHRsZScpLmJpbmQoJ3Nob3cnLCAtPlxyXG5cclxuXHRcdGJhdHRsZSA9IG5ldyBCYXR0bGUodGhpcylcclxuXHRcdGJhdHRsZS5zdGFydCgpXHJcblx0XHJcblx0KS5maWx0ZXIoJzp2aXNpYmxlJykudHJpZ2dlcignc2hvdycpXHJcblxyXG4pIiwiXHJcblxyXG5jbGFzcyBAQ2hhdFxyXG5cclxuXHRkZWZhdWx0cyA9IHtcclxuXHJcblx0XHRtZXNzYWdlVXJsOiBudWxsLFxyXG5cdFx0cGxheWVyVXJsOiBudWxsLFxyXG5cdFx0ZW1vdGljb25Vcmw6IG51bGwsXHJcblx0XHRpbnRlcnZhbDogMixcclxuXHRcdGhpc3Rvcnk6IDAsXHJcblx0XHRtaW5MZW5ndGg6IDEsXHJcblx0XHRtYXhMZW5ndGg6IDUxMixcclxuXHRcdGNvb2xkb3duOiA2MCxcclxuXHRcdGpvaW46IDEyMCxcclxuXHJcblx0XHRhbGxvd1NlbmQ6IHRydWUsXHJcblx0XHRhbGxvd1JlY2VpdmU6IHRydWUsXHJcblx0XHRzZW5kRXh0cmE6IHt9LFxyXG5cdFx0cmVjZWl2ZUV4dHJhOiB7fSxcclxuXHRcdHNlbmRNZXRob2Q6ICdQT1NUJyxcclxuXHRcdHJlY2VpdmVNZXRob2Q6ICdHRVQnLFxyXG5cdH1cclxuXHJcblx0Y29tbWFuZHMgPSB7XHJcblxyXG5cdFx0J2NsZWFyJzogJ2NsZWFyT3V0cHV0JyxcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAoZWxlbWVudCwgb3B0aW9ucykgLT5cclxuXHJcblx0XHQjYWxlcnQoJ3dlbGNvbWUnKVxyXG5cclxuXHRcdG9wdCA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucylcclxuXHJcblx0XHRAbWVzc2FnZVVybCA9IG9wdC5tZXNzYWdlVXJsXHJcblx0XHRAcGxheWVyVXJsID0gb3B0LnBsYXllclVybFxyXG5cdFx0QGVtb3RpY29ucyA9IG5ldyBFbW90aWNvbnMoKVxyXG5cclxuXHJcblx0XHRAYWxsb3dTZW5kID0gb3B0LmFsbG93U2VuZFxyXG5cdFx0QGFsbG93UmVjZWl2ZSA9IG9wdC5hbGxvd1JlY2VpdmVcclxuXHRcdEByZWNlaXZlRXh0cmEgPSBvcHQucmVjZWl2ZUV4dHJhXHJcblx0XHRAc2VuZEV4dHJhID0gb3B0LnNlbmRFeHRyYVxyXG5cdFx0QHJlY2VpdmVNZXRob2QgPSBvcHQucmVjZWl2ZU1ldGhvZFxyXG5cdFx0QHNlbmRNZXRob2QgPSBvcHQuc2VuZE1ldGhvZFxyXG5cclxuXHJcblxyXG5cclxuXHRcdEBpbnB1dCA9ICQoZWxlbWVudCkuZmluZCgnLmlucHV0JylcclxuXHRcdEBvdXRwdXQgPSAkKGVsZW1lbnQpLmZpbmQoJy5vdXRwdXQnKVxyXG5cdFx0QHNlbmRCdG4gPSAkKGVsZW1lbnQpLmZpbmQoJy5zZW5kJylcclxuXHRcdEBjbGVhckJ0biA9ICQoZWxlbWVudCkuZmluZCgnLmNsZWFyJylcclxuXHRcdEBlbW90aWNvbnNCdG4gPSAkKGVsZW1lbnQpLmZpbmQoJy5lbW90aWNvbnMnKVxyXG5cclxuXHJcblx0XHRAZW1vdGljb25zLnBvcG92ZXIoQGVtb3RpY29uc0J0biwgQGlucHV0KVxyXG5cclxuXHRcdEBvdXRwdXRbMF0uc2Nyb2xsVG9wID0gQG91dHB1dFswXS5zY3JvbGxIZWlnaHRcclxuXHJcblx0XHQkKEBpbnB1dCkua2V5ZG93bigoZXZlbnQpID0+IEBvbktleShldmVudCkpXHJcblxyXG5cclxuXHRcdCQoQHNlbmRCdG4pLmNsaWNrKCA9PlxyXG5cclxuXHRcdFx0QHNlbmQoKVxyXG5cdFx0XHRAY2xlYXJJbnB1dCgpXHJcblx0XHQpXHJcblxyXG5cdFx0JChAY2xlYXJCdG4pLmNsaWNrKCA9PlxyXG5cclxuXHRcdFx0QGNsZWFyT3V0cHV0KClcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRcdEBpbnRlcnZhbCA9IG9wdC5pbnRlcnZhbFxyXG5cclxuXHJcblx0XHRAam9pbiA9IG9wdC5qb2luXHJcblxyXG5cdFx0QGNvb2xkb3duID0gb3B0LmNvb2xkb3duXHJcblx0XHRAc2VudCA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApIC0gQGNvb2xkb3duXHJcblxyXG5cdFx0QHRvdWNoKClcclxuXHRcdEB0aW1lID0gTWF0aC5tYXgoQHRpbWUgLSBvcHQuaGlzdG9yeSwgMClcclxuXHJcblxyXG5cdFx0QHJlY2VpdmUoKVxyXG5cdFx0XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Z2V0RXJyb3JUZXh0OiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHR0ZXh0ID0gaTE4bi5jaGF0LmVycm9yc1tuYW1lXSA/IGkxOG4uY2hhdC5lcnJvcnMudW5rbm93blxyXG5cclxuXHRcdGlmIGFyZ3M/IGFuZCB0eXBlb2YoYXJncykgPT0gJ29iamVjdCdcclxuXHJcblx0XHRcdGZvciBrLCB2IG9mIGFyZ3NcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCc6JyArIGssIHYpXHJcblxyXG5cdFx0dGV4dFxyXG5cclxuXHJcblxyXG5cdGVycm9yOiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHRhbGVydCA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdhbGVydCcpXHJcblx0XHRcdC5hZGRDbGFzcygnYWxlcnQtZGFuZ2VyJylcclxuXHRcdFx0LnRleHQoQGdldEVycm9yVGV4dChuYW1lLCBhcmdzKSlcclxuXHJcblx0XHQkKEBvdXRwdXQpXHJcblx0XHRcdC5hcHBlbmQoYWxlcnQpXHJcblxyXG5cdGFsZXJ0OiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHRhbGVydChAZ2V0RXJyb3JUZXh0KG5hbWUsIGFyZ3MpKVxyXG5cclxuXHJcblxyXG5cclxuXHR0b3VjaDogLT5cclxuXHRcdEB0aW1lID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHJcblxyXG5cdHNlbmQ6IC0+XHJcblxyXG5cdFx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHRcdG1lc3NhZ2UgPSAkKEBpbnB1dCkudmFsKClcclxuXHJcblx0XHRtYXRjaGVzID0gbWVzc2FnZS5tYXRjaCgvXlxcLyhcXHcrKS9pKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgbWF0Y2hlcz8gYW5kIG1hdGNoZXNbMV0/XHJcblx0XHRcdGNvbW1hbmQgPSBtYXRjaGVzWzFdXHJcblxyXG5cdFx0XHRmb3IgaywgdiBvZiBjb21tYW5kc1xyXG5cclxuXHRcdFx0XHRpZiBjb21tYW5kLnRvTG93ZXJDYXNlKCkgPT0gay50b0xvd2VyQ2FzZSgpXHJcblxyXG5cdFx0XHRcdFx0ZnVuYyA9IHRoaXNbdl1cclxuXHJcblx0XHRcdFx0XHRpZiB0eXBlb2YoZnVuYykgPT0gJ2Z1bmN0aW9uJ1xyXG5cdFx0XHRcdFx0XHRmdW5jLmNhbGwodGhpcylcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRAZXJyb3IoJ2NtZE5vdEZvdW5kJywgeyduYW1lJzogY29tbWFuZH0pXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHJcblx0XHRpZiBAYWxsb3dTZW5kXHJcblxyXG5cdFx0XHRpZiBtZXNzYWdlLmxlbmd0aCA8IEBtaW5MZW5ndGhcclxuXHRcdFx0XHRAYWxlcnQoJ3Rvb1Nob3J0JywgeydtaW4nOiBAbWluTGVuZ3RofSlcclxuXHRcdFx0XHRyZXR1cm4gXHJcblxyXG5cdFx0XHRpZiBtZXNzYWdlLmxlbmd0aCA+IEBtYXhMZW5ndGhcclxuXHRcdFx0XHRhbGVydCgndG9vTG9uZycsIHsnbWF4JzogQG1heExlbmd0aH0pXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRpZiBAc2VudCArIEBjb29sZG93biA+IG5vd1xyXG5cdFx0XHRcdEBhbGVydCgnY29vbGRvd24nKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHJcblx0XHRcdGRhdGEgPSAkLmV4dGVuZCh7fSwgQHNlbmRFeHRyYSwge21lc3NhZ2U6ICQoQGlucHV0KS52YWwoKX0pXHJcblxyXG5cdFx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0XHR1cmw6IEBtZXNzYWdlVXJsLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PiBAb25TZW50KGRhdGEpLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGEsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRtZXRob2Q6IEBzZW5kTWV0aG9kLFx0XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRAc2VudCA9IG5vd1xyXG5cdFx0XHQkKEBzZW5kQnRuKS5kYXRhKCd0aW1lJywgQHNlbnQgKyBAY29vbGRvd24pXHJcblxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0QGVycm9yKCdjYW5ub3RTZW5kJylcclxuXHJcblxyXG5cdHJlY2VpdmU6IC0+XHJcblxyXG5cdFx0aWYgQGFsbG93UmVjZWl2ZVxyXG5cclxuXHRcdFx0ZGF0YSA9ICQuZXh0ZW5kKHt9LCBAcmVjZWl2ZUV4dHJhLCB7dGltZTogQHRpbWV9KVxyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiBAbWVzc2FnZVVybCxcclxuXHRcdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0XHRcdGNvbXBsZXRlOiA9PiBAb25Db21wbGV0ZSgpLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PiBAb25SZWNlaXZlZChkYXRhKSxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdG1ldGhvZDogQHJlY2VpdmVNZXRob2QsXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRAdG91Y2goKVxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0QGVycm9yKCdjYW5ub3RSZWNlaXZlJylcclxuXHJcblxyXG5cclxuXHRjbGVhck91dHB1dDogLT5cclxuXHJcblx0XHQkKEBvdXRwdXQpLmVtcHR5KClcclxuXHJcblxyXG5cdGNsZWFySW5wdXQ6IC0+XHJcblxyXG5cdFx0JChAaW5wdXQpLnZhbCgnJylcclxuXHJcblxyXG5cclxuXHRnZXRNZXNzYWdlOiAoZGF0YSkgLT5cclxuXHRcdCQoJzxwPjwvcD4nKVxyXG5cdFx0XHQuaHRtbChAZW1vdGljb25zLmluc2VydChkYXRhLm1lc3NhZ2UpKVxyXG5cdFx0XHQuYXBwZW5kKFxyXG5cclxuXHRcdFx0XHQkKCc8c21hbGw+PC9zbWFsbD4nKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LXRpbWUnKVxyXG5cdFx0XHRcdFx0LmRhdGEoJ3RpbWUnLCBkYXRhLnRpbWUpXHJcblx0XHRcdClcclxuXHJcblxyXG5cclxuXHRuZXdNZXNzYWdlOiAoZGF0YSkgLT5cclxuXHJcblx0XHRyb3cgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygncm93JylcclxuXHRcdFx0LmFkZENsYXNzKCdjaGF0LW1lc3NhZ2UnKVxyXG5cdFx0XHQuZGF0YSgndGltZScsIGRhdGEudGltZSlcclxuXHRcdFx0LmRhdGEoJ2F1dGhvcicsIGRhdGEuYXV0aG9yKVxyXG5cclxuXHRcdGNvbDEgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnY29sLXhzLTEnKVxyXG5cclxuXHRcdGNvbDIgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnY29sLXhzLTExJylcclxuXHJcblx0XHRpZiBAcGxheWVyVXJsP1xyXG5cclxuXHRcdFx0ZGl2MSA9ICQoJzxhPjwvYT4nKVxyXG5cdFx0XHRcdC5hdHRyKCdocmVmJywgQGdldFBsYXllclVybChkYXRhLmF1dGhvcikpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LWF1dGhvcicpXHJcblx0XHRlbHNlXHJcblx0XHRcclxuXHRcdFx0ZGl2MSA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtYXV0aG9yJylcclxuXHJcblxyXG5cclxuXHRcdGRpdjIgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdC5hZGRDbGFzcygnY2hhdC1jb250ZW50JylcclxuXHJcblxyXG5cclxuXHJcblx0XHRhdmF0YXIgPSAkKCc8aW1nPjwvaW1nPicpXHJcblx0XHRcdC5hZGRDbGFzcygnaW1nLXJlc3BvbnNpdmUnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtYXZhdGFyJylcclxuXHRcdFx0LmF0dHIoJ3NyYycsIGRhdGEuYXZhdGFyKVxyXG5cclxuXHJcblx0XHRhdXRob3IgPSAkKCc8cD48L3A+JykuYXBwZW5kKFxyXG5cclxuXHRcdFx0JCgnPHN0cm9uZz48L3N0cm9uZz4nKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY2hhdC1uYW1lJylcclxuXHRcdFx0XHQudGV4dChkYXRhLmF1dGhvciksXHJcblx0XHQpXHJcblxyXG5cdFx0bWVzc2FnZSA9IEBnZXRNZXNzYWdlKGRhdGEpXHJcblxyXG5cclxuXHJcblx0XHQkKGRpdjEpLmFwcGVuZChhdmF0YXIpLmFwcGVuZChhdXRob3IpXHJcblx0XHQkKGRpdjIpLmFwcGVuZChtZXNzYWdlKVxyXG5cdFx0JChjb2wxKS5hcHBlbmQoZGl2MSlcclxuXHRcdCQoY29sMikuYXBwZW5kKGRpdjIpXHJcblx0XHQkKHJvdykuYXBwZW5kKGNvbDEpLmFwcGVuZChjb2wyKVxyXG5cdFx0JChAb3V0cHV0KS5hcHBlbmQocm93KVxyXG5cclxuXHJcblx0bW9kaWZ5TWVzc2FnZTogKG1lc3NhZ2UsIGRhdGEpIC0+XHJcblxyXG5cdFx0JChtZXNzYWdlKS5maW5kKCcuY2hhdC1jb250ZW50JykuYXBwZW5kKFxyXG5cclxuXHRcdFx0QGdldE1lc3NhZ2UoZGF0YSlcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRhZGRNZXNzYWdlOiAoZGF0YSktPlxyXG5cclxuXHJcblx0XHRzY3JvbGwgPSAoQG91dHB1dFswXS5zY3JvbGxIZWlnaHQgLSBAb3V0cHV0WzBdLnNjcm9sbFRvcCAtIEBvdXRwdXRbMF0uY2xpZW50SGVpZ2h0KSA8PSAxXHJcblx0XHRtZXNzYWdlID0gJChAb3V0cHV0KS5jaGlsZHJlbigpLmxhc3QoKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgbWVzc2FnZS5sZW5ndGggPT0gMCBvciAhJChtZXNzYWdlKS5pcygnLmNoYXQtbWVzc2FnZScpXHJcblx0XHRcdFxyXG5cdFx0XHRAbmV3TWVzc2FnZShkYXRhKVxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0dGltZSA9ICQobWVzc2FnZSkuZGF0YSgndGltZScpXHJcblx0XHRcdGF1dGhvciA9ICQobWVzc2FnZSkuZGF0YSgnYXV0aG9yJylcclxuXHJcblx0XHRcdGlmIGF1dGhvciA9PSBkYXRhLmF1dGhvciBhbmQgKGRhdGEudGltZSAtIHRpbWUpIDw9IEBqb2luXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0QG1vZGlmeU1lc3NhZ2UobWVzc2FnZSwgZGF0YSlcclxuXHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRAbmV3TWVzc2FnZShkYXRhKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgc2Nyb2xsXHJcblx0XHRcdEBvdXRwdXRbMF0uc2Nyb2xsVG9wID0gQG91dHB1dFswXS5zY3JvbGxIZWlnaHQgLSAxXHJcblxyXG5cclxuXHJcblxyXG5cdG9uU2VudDogKGRhdGEpIC0+XHJcblxyXG5cdFx0QGVycm9yKGRhdGEucmVhc29uLCBkYXRhLmFyZ3MpIGlmIGRhdGEuc3RhdHVzID09ICdlcnJvcidcclxuXHJcblxyXG5cdG9uUmVjZWl2ZWQ6IChkYXRhKSAtPlxyXG5cclxuXHRcdGZvciBtZXNzYWdlIGluIGRhdGFcclxuXHRcdFx0QGFkZE1lc3NhZ2UobWVzc2FnZSlcclxuXHJcblx0b25Db21wbGV0ZTogLT5cclxuXHJcblx0XHRzZXRUaW1lb3V0KD0+XHJcblxyXG5cdFx0XHRAcmVjZWl2ZSgpXHJcblx0XHQsIEBpbnRlcnZhbCAqIDEwMDApXHJcblxyXG5cclxuXHRvbktleTogKGV2ZW50KSAtPlxyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDEzXHJcblx0XHRcdEBzZW5kKClcclxuXHRcdFx0QGNsZWFySW5wdXQoKVxyXG5cclxuXHJcblxyXG5cclxuXHRnZXRQbGF5ZXJVcmw6IChuYW1lKSAtPlxyXG5cclxuXHRcdHJldHVybiBAcGxheWVyVXJsLnJlcGxhY2UoJ3tuYW1lfScsIG5hbWUpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuJCgtPlxyXG5cclxuXHR1cGRhdGUgPSAoKSAtPlxyXG5cclxuXHRcdG5vdyA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApXHJcblxyXG5cdFx0JCgnLmNoYXQgLmNoYXQtdGltZScpLmVhY2goLT5cclxuXHJcblx0XHRcdHRpbWUgPSBwYXJzZUludCgkKHRoaXMpLmRhdGEoJ3RpbWUnKSlcclxuXHRcdFx0aW50ZXJ2YWwgPSBub3cgLSB0aW1lXHJcblxyXG5cclxuXHJcblx0XHRcdGlmIGludGVydmFsIDwgNjBcclxuXHJcblx0XHRcdFx0dGV4dCA9IGkxOG4uY2hhdC5mZXdTZWNzXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0dGV4dCA9IHdpbmRvdy50aW1lRm9ybWF0U2hvcnQoaW50ZXJ2YWwpXHJcblxyXG5cdFx0XHQkKHRoaXMpLnRleHQodGV4dCArICcgJyArIGkxOG4uY2hhdC5hZ28pXHJcblx0XHQpXHJcblxyXG5cdFx0JCgnLmNoYXQgLnNlbmQnKS5lYWNoKC0+XHJcblxyXG5cdFx0XHRpZiAkKHRoaXMpLmRhdGEoJ2Rpc2FibGVkJykgIT0gJ3RydWUnXHJcblxyXG5cdFx0XHRcdHRpbWUgPSBwYXJzZUludCgkKHRoaXMpLmRhdGEoJ3RpbWUnKSlcclxuXHRcdFx0XHR0ZXh0ID0gJCh0aGlzKS5kYXRhKCd0ZXh0JylcclxuXHRcdFx0XHRpbnRlcnZhbCA9IHRpbWUgLSBub3dcclxuXHJcblxyXG5cdFx0XHRcdGlmIGludGVydmFsID4gMFxyXG5cclxuXHRcdFx0XHRcdCQodGhpcylcclxuXHRcdFx0XHRcdFx0LnRleHQod2luZG93LnRpbWVGb3JtYXQoaW50ZXJ2YWwpKVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2Rpc2FibGVkJylcclxuXHRcdFx0XHRlbHNlXHJcblxyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQudGV4dCh0ZXh0KVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJylcclxuXHJcblx0XHQpXHJcblxyXG5cclxuXHRcdHNldFRpbWVvdXQodXBkYXRlLCAxMDAwKVxyXG5cclxuXHR1cGRhdGUoKVxyXG4pIiwiXHJcblxyXG51cGRhdGUgPSAoKSAtPlxyXG5cclxuXHRkYXRlID0gbmV3IERhdGUoKVxyXG5cdG5vdyA9IE1hdGgucm91bmQoZGF0ZS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdCQoJy5jdXJyZW50LXRpbWUnKS50ZXh0KGRhdGUudG9VVENTdHJpbmcoKSlcclxuXHJcblx0JCgnLnRpbWUtbGVmdCcpLmVhY2goLT5cclxuXHJcblx0XHR0byA9ICQodGhpcykuZGF0YSgndG8nKVxyXG5cdFx0JCh0aGlzKS50ZXh0KHdpbmRvdy50aW1lRm9ybWF0KE1hdGgubWF4KHRvIC0gbm93LCAwKSkpXHJcblx0KVxyXG5cclxuXHJcblx0c2V0VGltZW91dCh1cGRhdGUsIDEwMDApXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHR1cGRhdGUoKSIsIlxyXG5cclxuZGlhbG9ncyA9IFtdXHJcblxyXG5cclxuc2hvdyA9IChkaWFsb2cpIC0+XHJcblxyXG5cdGRpc21pc3NpYmxlID0gKCQoZGlhbG9nKS5kYXRhKCdkaXNtaXNzaWJsZScpKSA/IHRydWVcclxuXHJcblxyXG5cclxuXHQkKGRpYWxvZykuYmluZCgnc2hvd24uYnMubW9kYWwnLCAoZXZlbnQpIC0+XHJcblxyXG5cdFx0JCh0aGlzKS5maW5kKCcuYmF0dGxlJykudHJpZ2dlcignc2hvdycpXHJcblx0KVxyXG5cclxuXHJcblx0aWYgZGlzbWlzc2libGVcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiB0cnVlLCBzaG93OiB0cnVlLCBrZXlib2FyZDogdHJ1ZX0pXHJcblxyXG5cdGVsc2VcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywgc2hvdzogdHJ1ZSwga2V5Ym9hcmQ6IGZhbHNlfSlcclxuXHJcblxyXG4kIC0+XHJcblx0ZGlhbG9ncyA9ICQoJy5tb2RhbC5hdXRvc2hvdycpXHJcblxyXG5cclxuXHQkKGRpYWxvZ3MpLmVhY2goKGluZGV4KSAtPlxyXG5cclxuXHRcdGlmIGluZGV4ID09IDBcclxuXHRcdFx0c2hvdyh0aGlzKVxyXG5cclxuXHRcdGlmIGluZGV4IDwgKGRpYWxvZ3MubGVuZ3RoIC0gMSlcclxuXHRcdFx0JCh0aGlzKS5vbignaGlkZGVuLmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cclxuXHRcdFx0XHRzaG93KGRpYWxvZ3NbaW5kZXggKyAxXSlcclxuXHRcdFx0KVxyXG5cdCkiLCJcclxuXHJcblxyXG5jbGFzcyBARW1vdGljb25zXHJcblxyXG5cdGRlZmF1bHRzID0ge1xyXG5cclxuXHRcdGVtb3RpY29uczoge1xyXG5cclxuXHRcdFx0JzspJzogJ2JsaW5rLnBuZycsXHJcblx0XHRcdCc6RCc6ICdncmluLnBuZycsXHJcblx0XHRcdCc6KCc6ICdzYWQucG5nJyxcclxuXHRcdFx0JzopJzogJ3NtaWxlLnBuZycsXHJcblx0XHRcdCdCKSc6ICdzdW5nbGFzc2VzLnBuZycsXHJcblx0XHRcdCdPLm8nOiAnc3VycHJpc2VkLnBuZycsXHJcblx0XHRcdCc6cCc6ICd0b25ndWUucG5nJywgXHJcblx0XHR9LFxyXG5cclxuXHRcdHVybDogJy9pbWFnZXMvZW1vdGljb25zL3tuYW1lfScsXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGNvbnN0cnVjdG9yOiAodXJsLCBlbW90aWNvbnMpIC0+XHJcblxyXG5cdFx0QHVybCA9IHVybCA/IGRlZmF1bHRzLnVybFxyXG5cdFx0QHNldCA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cy5lbW90aWNvbnMsIGVtb3RpY29ucyA/IHt9KVxyXG5cclxuXHJcblx0aW5zZXJ0OiAodGV4dCkgLT5cclxuXHJcblx0XHRmb3IgaywgdiBvZiBAc2V0XHJcblxyXG5cdFx0XHR1cmwgPSBAdXJsLnJlcGxhY2UoJ3tuYW1lfScsIHYpXHJcblx0XHRcdGVtb3RpY29uID0gJzxpbWcgY2xhc3M9XCJlbW90aWNvblwiIHNyYz1cIicgKyB1cmwgKyAnXCIgYWx0PVwiJyArIGsgKyAnXCIgdGl0bGU9XCInICsgayArICdcIi8+J1xyXG5cdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlQWxsKGssIGVtb3RpY29uKVxyXG5cclxuXHJcblx0XHR0ZXh0XHJcblxyXG5cdHBvcG92ZXI6IChidXR0b24sIG91dHB1dCkgLT5cclxuXHJcblx0XHQkKGJ1dHRvbikucG9wb3Zlcih7XHJcblxyXG5cdFx0XHRodG1sOiB0cnVlLFxyXG5cdFx0XHR0cmlnZ2VyOiAnY2xpY2snLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICd0b3AnLFxyXG5cdFx0XHR0aXRsZTogaTE4bi5lbW90aWNvbnMudGl0bGUsXHJcblx0XHRcdGNvbnRlbnQ6ID0+IEBnZXRQb3BvdmVyQ29udGVudChvdXRwdXQpLFxyXG5cdFx0XHR0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJwb3BvdmVyXCIgcm9sZT1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50IGVtb3RpY29uLWNvbnRhaW5lclwiPjwvZGl2PjwvZGl2PicsXHJcblx0XHR9KVxyXG5cclxuXHRnZXRQb3BvdmVyQ29udGVudDogKG91dHB1dCkgLT5cclxuXHJcblx0XHRjb250YWluZXIgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblxyXG5cdFx0Zm9yIGssIHYgb2YgQHNldFxyXG5cdFx0XHR1cmwgPSBAdXJsLnJlcGxhY2UoJ3tuYW1lfScsIHYpXHJcblx0XHRcdGltZyA9ICQoJzxpbWc+PC9pbWc+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2Vtb3RpY29uJylcclxuXHRcdFx0XHQuYXR0cignc3JjJywgdXJsKVxyXG5cdFx0XHRcdC5hdHRyKCdhbHQnLCBrKVxyXG5cdFx0XHRcdC5hdHRyKCd0aXRsZScsIGspXHJcblx0XHRcdFx0LmNsaWNrKC0+XHJcblxyXG5cdFx0XHRcdFx0JChvdXRwdXQpLnZhbCgkKG91dHB1dCkudmFsKCkgKyAkKHRoaXMpLmF0dHIoJ2FsdCcpKVxyXG5cdFx0XHRcdClcclxuXHJcblx0XHRcdCQoY29udGFpbmVyKS5hcHBlbmQoaW1nKVxyXG5cclxuXHRcdHJldHVybiBjb250YWluZXJcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuY291bnRlciA9IDBcclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdGVtb3RpY29ucyA9IG5ldyBFbW90aWNvbnMoKVxyXG5cclxuXHQkKCdbZGF0YS1lbW90aWNvbnM9dHJ1ZV0nKS5lYWNoKC0+XHJcblxyXG5cdFx0dGV4dCA9ICQodGhpcykudGV4dCgpXHJcblx0XHR0ZXh0ID0gZW1vdGljb25zLmluc2VydCh0ZXh0KVxyXG5cdFx0JCh0aGlzKS5odG1sKHRleHQpXHJcblx0KVxyXG4pIiwid2lkdGhzID1cclxuXHR4czogNzY4LFxyXG5cdHNtOiA5OTIsXHJcblx0bWQ6IDEyMDAsXHJcblxyXG5cclxuXHJcbmdldFByZWZpeCA9IC0+XHJcblx0d2lkdGggPSAkKHdpbmRvdykud2lkdGgoKVxyXG5cclxuXHRpZiB3aWR0aCA8IHdpZHRocy54c1xyXG5cdFx0Wyd4cyddXHJcblx0ZWxzZSBpZiB3aWR0aCA8IHdpZHRocy5zbVxyXG5cdFx0WydzbScsICd4cyddXHJcblx0ZWxzZSBpZiB3aWR0aCA8IHdpZHRocy5tZFxyXG5cdFx0WydtZCcsICdzbScsICd4cyddXHJcblx0ZWxzZVxyXG5cdFx0WydsZycsICdtZCcsICdzbScsICd4cyddXHJcblxyXG5cclxuZ2V0Q29sdW1ucyA9IChwcmVmaXgpIC0+XHJcblx0cmVzdWx0ID0gW11cclxuXHRmb3IgcCBpbiBwcmVmaXhcclxuXHRcdGZvciBpIGluIFsxLi4xMl1cclxuXHRcdFx0cmVzdWx0LnB1c2goXCJjb2wtI3twfS0je2l9XCIpXHJcblx0cmVzdWx0XHJcblxyXG5cclxuXHJcbmdldFNpemUgPSAob2JqZWN0LCBwcmVmaXgpIC0+XHJcblx0Zm9yIHAgaW4gcHJlZml4XHJcblx0XHRyZWdleHAgPSBuZXcgUmVnRXhwKFwiY29sLSN7cH0tKFxcXFxkKylcIilcclxuXHRcdHNpemUgPSAkKG9iamVjdCkuYXR0cignY2xhc3MnKS5tYXRjaChyZWdleHApP1sxXVxyXG5cdFx0cmV0dXJuIHBhcnNlSW50KHNpemUpIGlmIHNpemU/XHJcblx0cmV0dXJuIG51bGxcclxuXHJcblxyXG5cclxuXHJcbmVxdWFsaXplID0gLT5cclxuXHRwcmVmaXggPSBnZXRQcmVmaXgoKVxyXG5cdGNvbHVtbnMgPSBnZXRDb2x1bW5zKHByZWZpeClcclxuXHRzZWxlY3RvciA9ICcuJyArIGNvbHVtbnMuam9pbignLC4nKVxyXG5cdFxyXG5cdCNjb25zb2xlLmxvZygncHJlZml4OiAnLCBwcmVmaXgpXHJcblx0I2NvbnNvbGUubG9nKCdjb2x1bW5zOiAnLCBjb2x1bW5zKVxyXG5cdCNjb25zb2xlLmxvZygnc2VsZWN0b3I6ICcsIHNlbGVjdG9yKVxyXG5cclxuXHJcblx0JCgnLnJvdy5lcXVhbGl6ZScpLmVhY2ggLT5cclxuXHRcdCNjb25zb2xlLmxvZygnbmV3IHJvdycpXHJcblx0XHRoZWlnaHRzID0gW11cclxuXHRcdHJvdyA9IDBcclxuXHRcdHN1bSA9IDBcclxuXHJcblx0XHQkKHRoaXMpLmNoaWxkcmVuKHNlbGVjdG9yKS5lYWNoIC0+XHJcblx0XHRcdHNpemUgPSBnZXRTaXplKHRoaXMsIHByZWZpeClcclxuXHRcdFx0c3VtICs9IHNpemVcclxuXHJcblx0XHRcdCNjb25zb2xlLmxvZygnc2l6ZTogJywgc2l6ZSlcclxuXHRcdFx0I2NvbnNvbGUubG9nKCdzdW06ICcsIHN1bSlcclxuXHJcblx0XHRcdGlmIHN1bSA+IDEyXHJcblx0XHRcdFx0c3VtIC09IDEyXHJcblx0XHRcdFx0cm93KytcclxuXHRcdFx0XHQjY29uc29sZS5sb2coJ25leHQgcm93ICcsIHJvdywgc2l6ZSlcclxuXHJcblx0XHRcdGhlaWdodHNbcm93XSA/PSAwXHJcblx0XHRcdGhlaWdodHNbcm93XSA9IE1hdGgubWF4KGhlaWdodHNbcm93XSwgJCh0aGlzKS5oZWlnaHQoKSlcclxuXHRcdFx0I2NvbnNvbGUubG9nKCdoZWlnaHQgJywgaGVpZ2h0c1tyb3ddKVxyXG5cclxuXHRcdHJvdyA9IDBcclxuXHRcdHN1bSA9IDBcclxuXHRcdGNvbCA9IG51bGxcclxuXHJcblx0XHQkKHRoaXMpLmNoaWxkcmVuKHNlbGVjdG9yKS5lYWNoIC0+XHJcblx0XHRcdHN1bSArPSBnZXRTaXplKHRoaXMsIHByZWZpeClcclxuXHRcdFx0Y29sID89IHRoaXNcclxuXHJcblx0XHRcdGlmIHN1bSA+IDEyXHJcblx0XHRcdFx0c3VtIC09IDEyXHJcblx0XHRcdFx0cm93KytcclxuXHRcdFx0XHRjb2wgPSB0aGlzXHJcblxyXG5cdFx0XHQkKHRoaXMpLmhlaWdodChoZWlnaHRzW3Jvd10pXHJcblxyXG5cdFx0aHMgPSBNYXRoLnJvdW5kICgxMiAtIHN1bSkgLyAyXHJcblx0XHRpZiBjb2w/IGFuZCBocyA+IDBcclxuXHRcdFx0cCA9IHByZWZpeFswXVxyXG5cclxuXHRcdFx0Zm9yIGkgaW4gWzEuLjEyXVxyXG5cdFx0XHRcdCQoY29sKS5yZW1vdmVDbGFzcyhcImNvbC0je3B9LW9mZnNldC0je2l9XCIpXHJcblx0XHRcdCQoY29sKS5hZGRDbGFzcyhcImNvbC0je3B9LW9mZnNldC0je2hzfVwiKVxyXG5cclxuYWZ0ZXJMb2FkZWQgPSAtPlxyXG5cdCQoJ2ltZycpXHJcblx0XHQub24oJ2xvYWQnLCBlcXVhbGl6ZSlcclxuXHJcblxyXG4kIC0+XHJcblx0I2FmdGVyTG9hZGVkKClcclxuXHQjJCh3aW5kb3cpLm9uKCdyZXNpemVkJywgZXF1YWxpemUpXHJcblx0I2VxdWFsaXplKCkiLCJzcGVlZCA9IDFcclxuXHJcblxyXG5rZXlEb3duID0gKGV2ZW50KSAtPlxyXG5cdHNwZWVkID0gMTAgaWYgZXZlbnQud2hpY2ggPT0gMTdcclxuXHRzcGVlZCA9IDEwMCBpZiBldmVudC53aGljaCA9PSAxNlxyXG5cclxua2V5VXAgPSAoZXZlbnQpIC0+XHJcblx0c3BlZWQgPSAxIGlmIGV2ZW50LndoaWNoID09IDE3IG9yIGV2ZW50LndoaWNoID09IDE2XHJcblxyXG5cclxubW91c2VXaGVlbCA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygnbW91c2VXaGVlbCcpXHJcblx0bWluID0gcGFyc2VJbnQgKCQodGhpcykuYXR0cignbWluJykgPyAwKVxyXG5cdG1heCA9IHBhcnNlSW50ICgkKHRoaXMpLmF0dHIoJ21heCcpID8gMTAwKVxyXG5cdHN0ZXAgPSBwYXJzZUludCAoJCh0aGlzKS5hdHRyKCdzdGVwJykgPyAxKVxyXG5cclxuXHRjaGFuZ2UgPSBldmVudC5kZWx0YVkgKiBzdGVwICogc3BlZWRcclxuXHR2YWx1ZSA9IHBhcnNlSW50ICQodGhpcykudmFsKCkgPyAwXHJcblx0dmFsdWUgPSBNYXRoLmNsYW1wIHZhbHVlICsgY2hhbmdlLCBtaW4sIG1heFxyXG5cclxuXHQkKHRoaXMpXHJcblx0XHQudmFsIHZhbHVlXHJcblx0XHQudHJpZ2dlciAnY2hhbmdlJ1xyXG5cclxuXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG5yYW5nZUNoYW5nZWQgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ3JhbmdlQ2hhbmdlZCcpXHJcblx0b3V0cHV0ID0gJCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLnJhbmdlLXZhbHVlJylcclxuXHRiZWZvcmUgPSAoJChvdXRwdXQpLmRhdGEgJ2JlZm9yZScpID8gJydcclxuXHRhZnRlciA9ICgkKG91dHB1dCkuZGF0YSAnYWZ0ZXInKSA/ICcnXHJcblx0dmFsdWUgPSAkKHRoaXMpLnZhbCgpID8gMFxyXG5cclxuXHQkKG91dHB1dCkudGV4dCBiZWZvcmUgKyB2YWx1ZSArIGFmdGVyXHJcblxyXG5cclxubnVtYmVyRGVjcmVhc2UgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ251bWJlckRlY3JlYXNlJylcclxuXHRpbnB1dCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0JylcclxuXHRtaW4gPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWluJykgPyAwKVxyXG5cdG1heCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtYXgnKSA/IDEwMClcclxuXHRzdGVwID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ3N0ZXAnKSA/IDEpXHJcblxyXG5cdHZhbHVlID0gcGFyc2VJbnQgKCQoaW5wdXQpLnZhbCgpID8gMClcclxuXHR2YWx1ZSA9IE1hdGguY2xhbXAodmFsdWUgLSBzcGVlZCAqIHN0ZXAsIG1pbiwgbWF4KVxyXG5cdCQoaW5wdXQpLnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJylcclxuXHJcblxyXG5udW1iZXJJbmNyZWFzZSA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygnbnVtYmVySW5jcmVhc2UnKVxyXG5cdGlucHV0ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKVxyXG5cdG1pbiA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtaW4nKSA/IDApXHJcblx0bWF4ID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21heCcpID8gMTAwKVxyXG5cdHN0ZXAgPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignc3RlcCcpID8gMSlcclxuXHJcblx0dmFsdWUgPSBwYXJzZUludCAoJChpbnB1dCkudmFsKCkgPyAwKVxyXG5cdHZhbHVlID0gTWF0aC5jbGFtcCh2YWx1ZSArIHNwZWVkICogc3RlcCwgbWluLCBtYXgpXHJcblx0JChpbnB1dCkudmFsKHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cclxuXHJcblxyXG5cclxuJCAtPiBcclxuXHQkKHdpbmRvdylcclxuXHRcdC5rZXl1cCBrZXlVcFxyXG5cdFx0LmtleWRvd24ga2V5RG93blxyXG5cclxuXHQkKCdpbnB1dFt0eXBlPW51bWJlcl0sIGlucHV0W3R5cGU9cmFuZ2VdJylcclxuXHRcdC5iaW5kICdtb3VzZXdoZWVsJywgbW91c2VXaGVlbFxyXG5cclxuXHQkKCdpbnB1dFt0eXBlPXJhbmdlXScpXHJcblx0XHQuY2hhbmdlIHJhbmdlQ2hhbmdlZFxyXG5cdFx0Lm1vdXNlbW92ZSByYW5nZUNoYW5nZWRcclxuXHJcblx0JCgnLm51bWJlci1taW51cycpLmNoaWxkcmVuKCdidXR0b24nKVxyXG5cdFx0LmNsaWNrIG51bWJlckRlY3JlYXNlXHJcblxyXG5cclxuXHQkKCcubnVtYmVyLXBsdXMnKS5jaGlsZHJlbignYnV0dG9uJylcclxuXHRcdC5jbGljayBudW1iZXJJbmNyZWFzZVxyXG5cclxuIiwiXHJcblxyXG5cclxuJCgtPlxyXG5cclxuXHRjb25zb2xlLmxvZygkKGRvY3VtZW50KS5zaXplKCkpXHJcblxyXG5cdGhlbHAgPSBmYWxzZVxyXG5cclxuXHJcblx0c2l6ZSA9IChlbGVtZW50KSAtPlxyXG5cclxuXHRcdHt3aWR0aDogJChlbGVtZW50KS53aWR0aCgpLCBoZWlnaHQ6ICQoZWxlbWVudCkuaGVpZ2h0KCl9XHJcblxyXG5cdHBvc2l0aW9uID0gKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0JChlbGVtZW50KS5vZmZzZXQoKVxyXG5cclxuXHJcblxyXG5cdHNob3cgPSAtPlxyXG5cclxuXHRcdGlmIG5vdCBoZWxwXHJcblxyXG5cdFx0XHRoZWxwID0gdHJ1ZVxyXG5cclxuXHRcdFx0XHJcblx0XHRcdG1haW5PdmVybGF5ID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHRcdC5hdHRyKCdpZCcsICdtYWluT3ZlcmxheScpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdvdmVybGF5JylcclxuXHRcdFx0XHQuY3NzKHNpemUoZG9jdW1lbnQpKVxyXG5cdFx0XHRcdC5jbGljayhoaWRlKVxyXG5cdFx0XHRcdC5oaWRlKClcclxuXHJcblxyXG5cclxuXHRcdFx0bmF2T3ZlcmxheSA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0XHQuYXR0cignaWQnLCAnbmF2T3ZlcmxheScpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdvdmVybGF5JylcclxuXHRcdFx0XHQuY3NzKCdwb3NpdGlvbicsICdmaXhlZCcpXHJcblx0XHRcdFx0LmNzcygnei1pbmRleCcsIDEwMDAwMClcclxuXHRcdFx0XHQuY3NzKHNpemUoJyNtYWluTmF2JykpXHJcblx0XHRcdFx0LmNsaWNrKGhpZGUpXHJcblx0XHRcdFx0LmhpZGUoKVxyXG5cclxuXHJcblxyXG5cdFx0XHRjb25zb2xlLmxvZygkKCcjbWFpbkNvbnRlbnQgW2RhdGEtaGVscF0nKSlcclxuXHRcdFx0Y29uc29sZS5sb2coJCgnI21haW5OYXYgW2RhdGEtaGVscF0nKSlcclxuXHJcblxyXG5cclxuXHJcblx0XHRcdCQoJyNtYWluQ29udGVudCBbZGF0YS1oZWxwXScpLmVhY2goLT5cclxuXHJcblx0XHRcdFx0Y29weSA9ICQodGhpcykuY2xvbmUoKVxyXG5cdFx0XHRcdHAgPSBwb3NpdGlvbih0aGlzKVxyXG5cdFx0XHRcdHMgPSBzaXplKHRoaXMpXHJcblxyXG5cdFx0XHRcdCQoY29weSlcclxuXHRcdFx0XHRcdC5hZGRDbGFzcygnaGVscGVyJylcclxuXHRcdFx0XHRcdC5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJylcclxuXHRcdFx0XHRcdC50b29sdGlwKHtwbGFjZW1lbnQ6ICdhdXRvIHRvcCcsIHRpdGxlOiAkKHRoaXMpLmRhdGEoJ2hlbHAnKX0pXHJcblx0XHRcdFx0XHQuY3NzKHApXHJcblx0XHRcdFx0XHQuY3NzKHMpXHJcblxyXG5cdFx0XHRcdCQoY29weSkuZmluZCgnW3RpdGxlXScpLnJlbW92ZUF0dHIoJ3RpdGxlJylcclxuXHJcblx0XHRcdFx0JChtYWluT3ZlcmxheSlcclxuXHRcdFx0XHRcdC5hcHBlbmQoY29weSlcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0JCgnI21haW5OYXYgW2RhdGEtaGVscF0nKS5lYWNoKC0+XHJcblxyXG5cdFx0XHRcdGNvcHkgPSAkKHRoaXMpLmNsb25lKClcclxuXHRcdFx0XHRwID0gcG9zaXRpb24odGhpcylcclxuXHRcdFx0XHRzID0gc2l6ZSh0aGlzKVxyXG5cclxuXHRcdFx0XHQkKGNvcHkpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2hlbHBlcicpXHJcblx0XHRcdFx0XHQuY3NzKCdwb3NpdGlvbicsICdhYnNvbHV0ZScpXHJcblx0XHRcdFx0XHQudG9vbHRpcCh7cGxhY2VtZW50OiAnYXV0byB0b3AnLCB0aXRsZTogJCh0aGlzKS5kYXRhKCdoZWxwJyl9KVxyXG5cdFx0XHRcdFx0LmNzcyhwKVxyXG5cdFx0XHRcdFx0LmNzcyhzKVxyXG5cclxuXHRcdFx0XHQkKGNvcHkpLmZpbmQoJ1t0aXRsZV0nKS5yZW1vdmVBdHRyKCd0aXRsZScpXHJcblxyXG5cdFx0XHRcdCQobmF2T3ZlcmxheSlcclxuXHRcdFx0XHRcdC5hcHBlbmQoY29weSlcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0JCgnYm9keScpXHJcblx0XHRcdFx0LmFwcGVuZChtYWluT3ZlcmxheSlcclxuXHRcdFx0XHQuYXBwZW5kKG5hdk92ZXJsYXkpXHJcblxyXG5cdFx0XHQkKG1haW5PdmVybGF5KS5mYWRlSW4oKVxyXG5cdFx0XHQkKG5hdk92ZXJsYXkpLmZhZGVJbigpXHJcblxyXG5cclxuXHRoaWRlID0gLT5cclxuXHJcblx0XHRpZiBoZWxwXHJcblxyXG5cdFx0XHRoZWxwID0gZmFsc2VcclxuXHRcdFx0JCgnLm92ZXJsYXknKS5mYWRlT3V0KHtjb21wbGV0ZTogLT5cclxuXHJcblx0XHRcdFx0JCgnLm92ZXJsYXknKS5yZW1vdmUoKVxyXG5cdFx0XHR9KVxyXG5cclxuXHJcblxyXG5cdCQoJyNoZWxwQnRuJykuY2xpY2soLT5cclxuXHJcblx0XHRzaG93KClcclxuXHQpXHJcblxyXG5cdCQoZG9jdW1lbnQpLmtleWRvd24oKGV2ZW50KSAtPlxyXG5cclxuXHRcdGhpZGUoKSBpZiBldmVudC53aGljaCA9PSAyN1xyXG5cdClcclxuKSIsImxhc3RUaW1lID0gMFxyXG52ZW5kb3JzID0gWyd3ZWJraXQnLCAnbW96J11cclxuXHJcbmlmIG5vdCB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICBmb3IgdmVuZG9yIGluIHZlbmRvcnNcclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvciArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3IgKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcblxyXG53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIG9yPSAoY2FsbGJhY2ssIGVsZW1lbnQpIC0+XHJcbiAgICBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpXHJcblxyXG4gICAgaWQgPSB3aW5kb3cuc2V0VGltZW91dCgtPlxyXG4gICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbClcclxuICAgICwgdGltZVRvQ2FsbClcclxuXHJcbiAgICBpZFxyXG5cclxud2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIG9yPSAoaWQpIC0+XHJcbiAgICBjbGVhclRpbWVvdXQoaWQpIiwiXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCgnLmltYWdlLXByZXZpZXcnKS5lYWNoIC0+XHJcblx0XHRwcmV2aWV3ID0gdGhpc1xyXG5cdFx0aWQgPSAkKHRoaXMpLmRhdGEoJ2ZvcicpXHJcblx0XHQkKCcjJyArIGlkKS5jaGFuZ2UoKGV2ZW50KSAtPiBcclxuXHJcblx0XHRcdHBhdGggPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGV2ZW50LnRhcmdldC5maWxlc1swXSlcclxuXHRcdFx0JChwcmV2aWV3KS5hdHRyICdzcmMnLCBwYXRoIGlmIHBhdGg/XHJcblxyXG5cdFx0XHRcclxuXHRcdCkudHJpZ2dlciAnY2hhbmdlJ1xyXG4iLCJcclxuXHJcbnNldCA9IChsYW5nKSAtPlxyXG5cdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9sYW5nLycgKyBsYW5nXHJcblxyXG5cclxuXHJcblxyXG5cclxuYnV0dG9uID0gKCkgLT5cclxuXHRzZXQoJCh0aGlzKS5kYXRhKCdsYW5nJykpXHJcblxyXG5cclxuc2VsZWN0ID0gKCkgLT5cclxuXHRzZXQoJCh0aGlzKS52YWwoKSlcclxuXHJcblxyXG5cclxuJCAtPlxyXG5cdCQoJy5sYW5ndWFnZS1zZWxlY3QnKS5jaGFuZ2Uoc2VsZWN0KVxyXG5cdCQoJy5sYW5ndWFnZS1idXR0b24nKS5jbGljayhidXR0b24pXHJcbiIsIm5hdmZpeCA9IC0+XHJcblx0aGVpZ2h0ID0gJCgnI21haW5OYXYnKS5oZWlnaHQoKSArIDEwXHJcblx0JCgnYm9keScpLmNzcygncGFkZGluZy10b3AnLCBoZWlnaHQgKyAncHgnKVxyXG5cclxuXHJcbiQgLT5cclxuXHQkKHdpbmRvdykucmVzaXplIC0+IG5hdmZpeCgpXHJcblx0bmF2Zml4KCkiLCJcclxuXHJcbmltYWdlRm9yRnJhbWUgPSAoZnJhbWUpIC0+XHJcblx0Jy9pbWFnZXMvcGxhbnRzL3BsYW50LScgKyBmcmFtZSArICcucG5nJ1xyXG5cclxucmVmcmVzaFBsYW50ID0gKHBsYW50KSAtPiBcclxuXHRub3cgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHRzdGFydCA9IHBhcnNlSW50ICQocGxhbnQpLmRhdGEgJ3N0YXJ0J1xyXG5cdGVuZCA9IHBhcnNlSW50ICQocGxhbnQpLmRhdGEgJ2VuZCdcclxuXHR3YXRlcmluZyA9IHBhcnNlSW50ICQocGxhbnQpLmRhdGEgJ3dhdGVyaW5nJ1xyXG5cdG5vdyA9IE1hdGgubWluIG5vdywgd2F0ZXJpbmdcclxuXHRmcmFtZSA9IE1hdGguZmxvb3IoMTcgKiBNYXRoLmNsYW1wKChub3cgLSBzdGFydCkgLyAoZW5kIC0gc3RhcnQpLCAwLCAxKSkgXHJcblx0JChwbGFudCkuYXR0ciAnc3JjJywgaW1hZ2VGb3JGcmFtZSBmcmFtZVxyXG5cclxuXHRzZXRUaW1lb3V0ICgtPiByZWZyZXNoUGxhbnQgcGxhbnQpLCAxMDAwIGlmIGZyYW1lIDwgMTdcclxuXHJcbiQgLT5cclxuXHQkKCcucGxhbnRhdGlvbi1wbGFudCcpLmVhY2ggLT4gcmVmcmVzaFBsYW50IHRoaXNcclxuXHJcblx0JCgnI3NlZWRzTW9kYWwnKS5vbiAnc2hvdy5icy5tb2RhbCcsIChldmVudCkgLT5cclxuXHRcdHNsb3QgPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpLmRhdGEgJ3Nsb3QnXHJcblx0XHQkKHRoaXMpLmZpbmQoJ2lucHV0W25hbWU9c2xvdF0nKS52YWwgc2xvdCIsInVybCA9ICcvYXBpL2NoYXJhY3Rlcic7XHJcblxyXG5cclxuc2V0UHJvZ3Jlc3MgPSAob2JqZWN0LCB2YWx1ZSwgbWluVmFsdWUsIG1heFZhbHVlLCBsYXN0VXBkYXRlLCBuZXh0VXBkYXRlKSAtPlxyXG5cclxuXHRiYXIgPSAkKCcuJyArIG9iamVjdCArICctYmFyJylcclxuXHR0aW1lciA9ICQoJy4nICsgb2JqZWN0ICsgJy10aW1lcicpXHJcblxyXG5cclxuXHRpZiBiYXIubGVuZ3RoID4gMFxyXG5cdFx0Y2hpbGQgPSAkKGJhcikuY2hpbGRyZW4gJy5wcm9ncmVzcy1iYXInXHJcblxyXG5cdFx0JChjaGlsZClcclxuXHRcdFx0LmRhdGEgJ21heCcsIG1heFZhbHVlXHJcblx0XHRcdC5kYXRhICdtaW4nLCBtaW5WYWx1ZVxyXG5cdFx0XHQuZGF0YSAnbm93JywgdmFsdWVcclxuXHRcdGJhclswXS51cGRhdGU/KClcclxuXHJcblxyXG5cdGlmIHRpbWVyLmxlbmd0aCA+IDBcclxuXHRcdGNoaWxkID0gJCh0aW1lcikuY2hpbGRyZW4gJy5wcm9ncmVzcy1iYXInXHJcblxyXG5cdFx0aWYgbmV4dFVwZGF0ZT9cclxuXHRcdFx0JChjaGlsZClcclxuXHRcdFx0XHQuZGF0YSAnbWF4JywgbmV4dFVwZGF0ZVxyXG5cdFx0XHRcdC5kYXRhICdtaW4nLCBsYXN0VXBkYXRlXHJcblx0XHRlbHNlXHJcblx0XHRcdCQoY2hpbGQpXHJcblx0XHRcdFx0LmRhdGEgJ21heCcsIDFcclxuXHRcdFx0XHQuZGF0YSAnbWluJywgMFxyXG5cclxuXHJcbnNldFZhbHVlcyA9IChvYmplY3QsIHZhbHVlLCBtaW5WYWx1ZSwgbWF4VmFsdWUpIC0+XHJcblx0JCgnLicgKyBvYmplY3QgKyAnLW5vdycpXHJcblx0XHQudGV4dCB2YWx1ZVxyXG5cclxuXHQkKCcuJyArIG9iamVjdCArICctbWluJylcclxuXHRcdC50ZXh0IG1pblZhbHVlXHJcblxyXG5cdCQoJy4nICsgb2JqZWN0ICsgJy1tYXgnKVxyXG5cdFx0LnRleHQgbWF4VmFsdWVcclxuXHJcbnNldFZhbHVlID0gKG9iamVjdCwgdmFsdWUpIC0+XHJcblx0JCgnLicgKyBvYmplY3QpXHJcblx0XHQudGV4dCB2YWx1ZVxyXG5cclxuXHJcblxyXG5cclxuZmlsbCA9IChkYXRhKSAtPlxyXG5cdHNldFByb2dyZXNzICdoZWFsdGgnLCBkYXRhLmhlYWx0aCwgMCwgZGF0YS5tYXhIZWFsdGgsIGRhdGEuaGVhbHRoVXBkYXRlLCBkYXRhLm5leHRIZWFsdGhVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ2hlYWx0aCcsIGRhdGEuaGVhbHRoLCAwLCBkYXRhLm1heEhlYWx0aFxyXG5cclxuXHRzZXRQcm9ncmVzcyAnZW5lcmd5JywgZGF0YS5lbmVyZ3ksIDAsIGRhdGEubWF4RW5lcmd5LCBkYXRhLmVuZXJneVVwZGF0ZSwgZGF0YS5uZXh0RW5lcmd5VXBkYXRlXHJcblx0c2V0VmFsdWVzICdlbmVyZ3knLCBkYXRhLmVuZXJneSwgMCwgZGF0YS5tYXhFbmVyZ3lcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ3dhbnRlZCcsIGRhdGEud2FudGVkLCAwLCA2LCBkYXRhLndhbnRlZFVwZGF0ZSwgZGF0YS5uZXh0V2FudGVkVXBkYXRlXHJcblx0c2V0VmFsdWVzICd3YW50ZWQnLCBkYXRhLndhbnRlZCwgMCwgNlxyXG5cclxuXHRzZXRQcm9ncmVzcyAnZXhwZXJpZW5jZScsIGRhdGEuZXhwZXJpZW5jZSwgMCwgZGF0YS5tYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdleHBlcmllbmNlJywgZGF0YS5leHBlcmllbmNlLCAwLCBkYXRhLm1heEV4cGVyaWVuY2VcclxuXHJcblxyXG5cdHNldFByb2dyZXNzICdwbGFudGF0b3InLCBkYXRhLnBsYW50YXRvckV4cGVyaWVuY2UsIDAsIGRhdGEucGxhbnRhdG9yTWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAncGxhbnRhdG9yJywgZGF0YS5wbGFudGF0b3JFeHBlcmllbmNlLCAwLCBkYXRhLnBsYW50YXRvck1heEV4cGVyaWVuY2VcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ3NtdWdnbGVyJywgZGF0YS5zbXVnZ2xlckV4cGVyaWVuY2UsIDAsIGRhdGEuc211Z2dsZXJNYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdzbXVnZ2xlcicsIGRhdGEuc211Z2dsZXJFeHBlcmllbmNlLCAwLCBkYXRhLnNtdWdnbGVyTWF4RXhwZXJpZW5jZVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnZGVhbGVyJywgZGF0YS5kZWFsZXJFeHBlcmllbmNlLCAwLCBkYXRhLmRlYWxlck1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ2RlYWxlcicsIGRhdGEuZGVhbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5kZWFsZXJNYXhFeHBlcmllbmNlXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQjc2V0VmFsdWUgJ2xldmVsJywgZGF0YS5sZXZlbFxyXG5cdCNzZXRWYWx1ZSAncGxhbnRhdG9yLWxldmVsJywgZGF0YS5wbGFudGF0b3JMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnc211Z2dsZXItbGV2ZWwnLCBkYXRhLnNtdWdnbGVyTGV2ZWxcclxuXHQjc2V0VmFsdWUgJ2RlYWxlci1sZXZlbCcsIGRhdGEuZGVhbGVyTGV2ZWxcclxuXHQjc2V0VmFsdWUgJ3N0cmVuZ3RoJywgZGF0YS5zdHJlbmd0aCxcclxuXHQjc2V0VmFsdWUgJ3BlcmNlcHRpb24nLCBkYXRhLnBlcmNlcHRpb25cclxuXHQjc2V0VmFsdWUgJ2VuZHVyYW5jZScsIGRhdGEuZW5kdXJhbmNlXHJcblx0I3NldFZhbHVlICdjaGFyaXNtYScsIGRhdGEuY2hhcmlzbWFcclxuXHQjc2V0VmFsdWUgJ2ludGVsbGlnZW5jZScsIGRhdGEuaW50ZWxsaWdlbmNlXHJcblx0I3NldFZhbHVlICdhZ2lsaXR5JywgZGF0YS5hZ2lsaXR5XHJcblx0I3NldFZhbHVlICdsdWNrJywgZGF0YS5sdWNrICsgJyUnXHJcblx0I3NldFZhbHVlICdzdGF0aXN0aWNQb2ludHMnLCBkYXRhLnN0YXRpc3RpY1BvaW50c1xyXG5cdCNzZXRWYWx1ZSAndGFsZW50UG9pbnRzJywgZGF0YS50YWxlbnRQb2ludHNcclxuXHQjc2V0VmFsdWUgJ21vbmV5JywgJyQnICsgZGF0YS5tb25leVxyXG5cdCNzZXRWYWx1ZSAncmVwb3J0cycsIGRhdGEucmVwb3J0c0NvdW50XHJcblx0I3NldFZhbHVlICdtZXNzYWdlcycsIGRhdGEubWVzc2FnZXNDb3VudFxyXG5cclxuXHRzY29wZSA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KS5zY29wZSgpXHJcblxyXG5cdGlmIHNjb3BlPyBhbmQgc2NvcGUucGxheWVyP1xyXG5cdFx0I3Njb3BlLnBsYXllci5sZXZlbCA9IGRhdGEubGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIucGxhbnRhdG9yTGV2ZWwgPSBkYXRhLnBsYW50YXRvckxldmVsXHJcblx0XHQjc2NvcGUucGxheWVyLnNtdWdnbGVyTGV2ZWwgPSBkYXRhLnNtdWdnbGVyTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuZGVhbGVyTGV2ZWwgPSBkYXRhLmRlYWxlckxldmVsXHJcblx0XHQjc2NvcGUucGxheWVyLnN0cmVuZ3RoID0gZGF0YS5zdHJlbmd0aFxyXG5cdFx0I3Njb3BlLnBsYXllci5wZXJjZXB0aW9uID0gZGF0YS5wZXJjZXB0aW9uXHJcblx0XHQjc2NvcGUucGxheWVyLmVuZHVyYW5jZSA9IGRhdGEuZW5kdXJhbmNlXHJcblx0XHQjc2NvcGUucGxheWVyLmNoYXJpc21hID0gZGF0YS5jaGFyaXNtYVxyXG5cdFx0I3Njb3BlLnBsYXllci5pbnRlbGxpZ2VuY2UgPSBkYXRhLmludGVsbGlnZW5jZVxyXG5cdFx0I3Njb3BlLnBsYXllci5hZ2lsaXR5ID0gZGF0YS5hZ2lsaXR5XHJcblx0XHQjc2NvcGUucGxheWVyLmx1Y2sgPSBkYXRhLmx1Y2tcclxuXHRcdCNzY29wZS5wbGF5ZXIucmVzcGVjdCA9IGRhdGEucmVzcGVjdFxyXG5cdFx0I3Njb3BlLnBsYXllci53ZWlnaHQgPSBkYXRhLndlaWdodFxyXG5cdFx0I3Njb3BlLnBsYXllci5jYXBhY2l0eSA9IGRhdGEuY2FwYWNpdHlcclxuXHRcdCNzY29wZS5wbGF5ZXIubWluRGFtYWdlID0gZGF0YS5taW5EYW1hZ2VcclxuXHRcdCNzY29wZS5wbGF5ZXIubWF4RGFtYWdlID0gZGF0YS5tYXhEYW1hZ2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuZGVmZW5zZSA9IGRhdGEuZGVmZW5zZVxyXG5cdFx0I3Njb3BlLnBsYXllci5jcml0Q2hhbmNlID0gZGF0YS5jcml0Q2hhbmNlXHJcblx0XHQjc2NvcGUucGxheWVyLnNwZWVkID0gZGF0YS5zcGVlZFxyXG5cdFx0I3Njb3BlLnBsYXllci5leHBlcmllbmNlTW9kaWZpZXIgPSBkYXRhLmV4cGVyaWVuY2VNb2RpZmllclxyXG5cdFx0I3Njb3BlLnBsYXllci5tb25leU1vZGlmaWVyID0gZGF0YS5tb25leU1vZGlmaWVyXHJcblxyXG5cdFx0Zm9yIGssIHYgb2YgZGF0YVxyXG5cdFx0XHRzY29wZS5wbGF5ZXJba10gPSB2XHJcblxyXG5cdFx0c2NvcGUuJGFwcGx5KClcclxuXHJcblxyXG5cclxuXHJcbmxvYWRlZCA9IChkYXRhKSAtPlxyXG5cclxuXHRmaWxsIGRhdGFcclxuXHJcblx0aWYgZGF0YS5yZWxvYWRcclxuXHJcblx0XHR3aW5kb3cubG9jYXRpb24ucmVmcmVzaCgpXHJcblx0ZWxzZVxyXG5cdFx0JC5hamF4IHtcclxuXHJcblx0XHRcdHVybDogdXJsICsgJy9ub3RpZmljYXRpb25zJyxcclxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0c3VjY2Vzczogbm90aWZ5XHJcblx0XHR9XHJcblxyXG5cdFx0JC5hamF4IHtcclxuXHJcblx0XHRcdHVybDogdXJsICsgJy9tZXNzYWdlcycsXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IG1lc3NhZ2UsXHJcblx0XHR9XHJcblxyXG5cdHNldFRpbWVvdXQgbG9hZCwgZGF0YS5uZXh0VXBkYXRlICogMTAwMFxyXG5cclxuXHJcbm5vdGlmeSA9IChkYXRhKSAtPlxyXG5cdGZvciBuIGluIGRhdGFcclxuXHRcdHdpbmRvdy5ub3RpZnkge1xyXG5cclxuXHRcdFx0dGl0bGU6ICc8c3Ryb25nPicgKyBuLnRpdGxlICsgJzwvc3Ryb25nPicsXHJcblx0XHRcdG1lc3NhZ2U6ICcnLFxyXG5cdFx0XHR1cmw6ICcvcmVwb3J0cy8nICsgbi5pZCxcclxuXHJcblx0XHR9XHJcblxyXG5cdGlmIHdpbmRvdy5hY3RpdmVcclxuXHRcdHdpbmRvdy5ub3RpZnlTaG93KClcclxuXHJcbm1lc3NhZ2UgPSAoZGF0YSkgLT5cclxuXHRmb3IgbiBpbiBkYXRhXHJcblx0XHR3aW5kb3cubm90aWZ5IHtcclxuXHJcblx0XHRcdHRpdGxlOiAnPHN0cm9uZz4nICsgbi5hdXRob3IgKyAnPC9zdHJvbmc+OiAnICsgbi50aXRsZSArICc8YnIvPicsXHJcblx0XHRcdG1lc3NhZ2U6IG4uY29udGVudCxcclxuXHRcdFx0dXJsOiAnL21lc3NhZ2VzL2luYm94LycgKyBuLmlkLFxyXG5cclxuXHRcdH1cclxuXHJcblx0aWYgd2luZG93LmFjdGl2ZVxyXG5cdFx0d2luZG93Lm5vdGlmeVNob3coKVxyXG5cclxuXHJcblxyXG5sb2FkID0gLT5cclxuXHJcblx0JC5hamF4IHtcclxuXHJcblx0XHR1cmw6IHVybCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0c3VjY2VzczogbG9hZGVkXHJcblx0fVxyXG5cclxuXHJcblxyXG5cdFxyXG4kKHdpbmRvdykuZm9jdXMgLT5cclxuXHRsb2FkKClcclxuXHJcblxyXG4kIC0+XHJcblx0bG9hZCgpIiwiXHJcbnNxdWFyZSA9IC0+XHJcblxyXG5cdCQoJy5zcXVhcmUnKS5lYWNoIC0+XHJcblxyXG5cdFx0aWYgJCh0aGlzKS5kYXRhKCdzcXVhcmUnKSA9PSAnd2lkdGgnXHJcblxyXG5cdFx0XHQkKHRoaXMpLndpZHRoICQodGhpcykuaGVpZ2h0KClcclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdCQodGhpcykuaGVpZ2h0ICQodGhpcykud2lkdGgoKVxyXG5cclxuJCAtPlxyXG5cdCQod2luZG93KS5yZXNpemUgLT4gXHJcblx0XHRzcXVhcmUoKVxyXG5cdFx0XHJcblx0c3F1YXJlKCkiLCJcclxuY2hhbmdlZCA9IC0+IFxyXG5cdGN1cnJlbnQgPSBwYXJzZUludCAoJCgnI2N1cnJlbnRTdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpID8gMClcclxuXHRsZWZ0ID0gcGFyc2VJbnQgJCgnI3N0YXRpc3RpY3NQb2ludHMnKS50ZXh0KClcclxuXHRvbGQgPSBwYXJzZUludCAoJCh0aGlzKS5kYXRhKCdvbGQnKSA/IDApXHJcblx0dmFsID0gcGFyc2VJbnQgKCQodGhpcykudmFsKCkgPyAwKVxyXG5cdGRpZmYgPSB2YWwgLSBvbGRcclxuXHJcblx0ZGlmZiA9IGxlZnQgaWYgZGlmZiA+IGxlZnRcclxuXHR2YWwgPSBvbGQgKyBkaWZmXHJcblx0bGVmdCAtPSBkaWZmXHJcblxyXG5cdGlmIG5vdCBpc05hTiBkaWZmXHJcblxyXG5cdFx0JCh0aGlzKVxyXG5cdFx0XHQudmFsIHZhbFxyXG5cdFx0XHQuZGF0YSAnb2xkJywgdmFsXHJcblxyXG5cdFx0JCgnI3N0YXRpc3RpY3NQb2ludHMnKVxyXG5cdFx0XHQudGV4dCBsZWZ0XHJcblxyXG5cdFx0JCgnLnN0YXRpc3RpYycpLmVhY2ggLT5cclxuXHRcdFx0dmFsID0gcGFyc2VJbnQgJCh0aGlzKS52YWwoKSA/IDBcclxuXHRcdFx0JCh0aGlzKS5hdHRyICdtYXgnLCBsZWZ0ICsgdmFsXHJcblxyXG5cclxucmFuZG9tID0gKG1pbiwgbWF4KSAtPiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbilcclxuXHJcbnJhbmRvbUluID0gKGFycmF5KSAtPlxyXG5cdGluZGV4ID0gcmFuZG9tKDAsIGFycmF5Lmxlbmd0aCAtIDEpXHJcblx0YXJyYXlbaW5kZXhdXHJcblxyXG5cclxuXHJcblxyXG5cclxucm9sbCA9IC0+XHJcblxyXG5cdHJvbGxhYmxlID0gJCgnLnN0YXRpc3RpYy5yb2xsYWJsZScpXHJcblx0JChyb2xsYWJsZSkudmFsKDApLnRyaWdnZXIoJ2NoYW5nZScpXHJcblx0cG9pbnRzID0gcGFyc2VJbnQgJCgnI3N0YXRpc3RpY3NQb2ludHMnKS50ZXh0KClcclxuXHJcblxyXG5cdGZvciBpIGluIFsxLi5wb2ludHNdXHJcblxyXG5cdFx0c3RhdGlzdGljID0gcmFuZG9tSW4ocm9sbGFibGUpXHJcblx0XHR2YWwgPSBwYXJzZUludCAkKHN0YXRpc3RpYykudmFsKClcclxuXHRcdCQoc3RhdGlzdGljKS52YWwodmFsICsgMSlcclxuXHJcblxyXG5cdCQocm9sbGFibGUpLnRyaWdnZXIgJ2NoYW5nZSdcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuJCAtPiBcclxuXHQkKCcuc3RhdGlzdGljJylcclxuXHRcdC5iaW5kICdrZXl1cCBpbnB1dCBjaGFuZ2UnLCBjaGFuZ2VkXHJcblx0XHQudHJpZ2dlciAnY2hhbmdlJ1xyXG5cclxuXHQkKCcuc3RhdFJvbGxlcicpXHJcblx0XHQuY2xpY2socm9sbClcclxuXHJcblx0cm9sbCgpXHJcbiIsIlxyXG5yZWZyZXNoaW5nID0gZmFsc2VcclxuXHJcbnJlZnJlc2ggPSAtPlxyXG5cdHdpbmRvdy5sb2NhdGlvbi5yZWZyZXNoKCkgaWYgbm90IHJlZnJlc2hpbmdcclxuXHRyZWZyZXNoaW5nID0gdHJ1ZVxyXG5cclxudXBkYXRlID0gKHRpbWVyKSAtPlxyXG5cdGJhciA9ICQodGltZXIpLmNoaWxkcmVuKCcucHJvZ3Jlc3MtYmFyJykubGFzdCgpXHJcblx0bGFiZWwgPSAkKHRpbWVyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWxhYmVsJ1xyXG5cdHRpbWUgPSBNYXRoLnJvdW5kIChuZXcgRGF0ZSkuZ2V0VGltZSgpIC8gMTAwMC4wXHJcblxyXG5cclxuXHRtaW4gPSAkKGJhcikuZGF0YSAnbWluJ1xyXG5cdG1heCA9ICQoYmFyKS5kYXRhICdtYXgnXHJcblx0c3RvcCA9ICQoYmFyKS5kYXRhICdzdG9wJ1xyXG5cdGNhID0gJChiYXIpLmRhdGEoJ2NhJylcclxuXHRjYiA9ICQoYmFyKS5kYXRhKCdjYicpXHJcblxyXG5cclxuXHJcblx0cmV2ZXJzZWQgPSBCb29sZWFuKCQoYmFyKS5kYXRhKCdyZXZlcnNlZCcpID8gZmFsc2UpXHJcblx0cmVsb2FkID0gQm9vbGVhbigkKGJhcikuZGF0YSgncmVsb2FkJykgPyB0cnVlKVxyXG5cclxuXHRpZiBzdG9wP1xyXG5cdFx0dGltZSA9IE1hdGgubWluIHRpbWUsIHN0b3BcclxuXHJcblx0bm93ID0gTWF0aC5jbGFtcCh0aW1lLCBtaW4sIG1heClcclxuXHJcblxyXG5cdHBlcmNlbnQgPSAobm93IC0gbWluKSAvIChtYXggLSBtaW4pXHJcblx0cGVyY2VudCA9IDEgLSBwZXJjZW50IGlmIHJldmVyc2VkXHJcblxyXG5cclxuXHJcblxyXG5cdCQoYmFyKS5jc3MgJ3dpZHRoJywgKHBlcmNlbnQgKiAxMDApICsgJyUnXHJcblx0JChiYXIpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsIE1hdGgubGVycENvbG9ycyhwZXJjZW50LCBjYSwgY2IpKSBpZiBjYT8gYW5kIGNiP1xyXG5cdCQobGFiZWwpLnRleHQgd2luZG93LnRpbWVGb3JtYXQ/IG1heCAtIG5vd1xyXG5cclxuXHRyZWZyZXNoKCkgaWYgdGltZSA+IG1heCBhbmQgcmVsb2FkXHJcblxyXG5cdHNldFRpbWVvdXQoLT4gXHJcblxyXG5cdFx0dXBkYXRlKHRpbWVyKVxyXG5cclxuXHQsIDEwMDApICNpZiB0aW1lIDw9IG1heFxyXG5cclxuXHJcbnVwZGF0ZU5hdiA9ICh0aW1lcikgLT5cclxuXHJcblx0dGltZSA9IE1hdGgucm91bmQgKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwLjBcclxuXHRtaW4gPSAkKHRpbWVyKS5kYXRhICdtaW4nXHJcblx0bWF4ID0gJCh0aW1lcikuZGF0YSAnbWF4J1xyXG5cdG5vdyA9IE1hdGguY2xhbXAodGltZSwgbWluLCBtYXgpXHJcblxyXG5cdHBlcmNlbnQgPSAxIC0gKG5vdyAtIG1pbikgLyAobWF4IC0gbWluKVxyXG5cclxuXHQkKHRpbWVyKS5jc3MoJ3dpZHRoJywgKHBlcmNlbnQgKiAxMDApICsgJyUnKVxyXG5cclxuXHRzZXRUaW1lb3V0KC0+IFxyXG5cclxuXHRcdHVwZGF0ZU5hdih0aW1lcilcclxuXHJcblx0LCAxMDAwKVxyXG5cclxuXHJcblxyXG5cclxuJCAtPlxyXG5cdCQoJy5wcm9ncmVzcy10aW1lJykuZWFjaCAtPlxyXG5cdFx0dXBkYXRlIHRoaXNcclxuXHJcblx0JCgnLm5hdi10aW1lciA+IC5uYXYtdGltZXItYmFyJykuZWFjaCAtPlxyXG5cdFx0dXBkYXRlTmF2IHRoaXNcclxuXHJcblxyXG5cclxuXHJcbiIsIiQgLT5cclxuXHQkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZWFjaCgtPlxyXG5cclxuXHRcdG9wdGlvbnMgPSB7XHJcblxyXG5cdFx0XHRodG1sOiB0cnVlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdhdXRvIGxlZnQnXHJcblx0XHR9XHJcblxyXG5cdFx0dHJpZ2dlciA9ICQodGhpcykuZGF0YSgndHJpZ2dlcicpXHJcblxyXG5cdFx0aWYgdHJpZ2dlcj9cclxuXHRcdFx0b3B0aW9ucy50cmlnZ2VyID0gdHJpZ2dlclxyXG5cclxuXHJcblx0XHQkKHRoaXMpLnRvb2x0aXAob3B0aW9ucylcclxuXHQpIiwiXHJcbiQgLT5cclxuXHJcblx0dHV0b3JpYWxzID0ge31cclxuXHQkKCcudHV0b3JpYWwtc3RlcCcpLnBvcG92ZXIoe3RyaWdnZXI6ICdtYW51YWwnLCBwbGFjZW1lbnQ6ICdib3R0b20nfSlcclxuXHJcblx0c2hvdyA9IChzdGVwKSAtPlxyXG5cclxuXHRcdGlmIHN0ZXA/XHJcblxyXG5cdFx0XHQkKHN0ZXAuZWxlbWVudHMpXHJcblx0XHRcdFx0LmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ3R1dG9yaWFsLWFjdGl2ZScpXHJcblx0XHRcdFx0LmZpcnN0KClcclxuXHRcdFx0XHQucG9wb3Zlcignc2hvdycpXHJcblxyXG5cclxuXHRjbGlja2VkID0gKGV2ZW50KSAtPlxyXG5cclxuXHRcdG5leHQgPSB0dXRvcmlhbHNbdGhpcy5zdGVwLm5hbWVdLnNoaWZ0KClcclxuXHJcblx0XHRpZiBuZXh0P1xyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0ZGF0YToge25hbWU6IHRoaXMuc3RlcC5uYW1lLCBzdGFnZTogbmV4dC5pbmRleH0sXHJcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoLT5cclxuXHJcblx0XHRcdFx0c2hvdyhuZXh0KVxyXG5cdFx0XHQsIDUwMClcclxuXHRcdGVsc2VcclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0ZGF0YToge25hbWU6IHRoaXMuc3RlcC5uYW1lLCBzdGFnZTogdGhpcy5zdGVwLmluZGV4ICsgMX0sXHJcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0fSlcclxuXHRcdFxyXG5cclxuXHJcblxyXG5cdFx0JCh0aGlzLnN0ZXAuZWxlbWVudHMpLnVuYmluZCgnY2xpY2snLCBjbGlja2VkKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ3R1dG9yaWFsLWFjdGl2ZScpXHJcblx0XHRcdC5wb3BvdmVyKCdoaWRlJylcclxuXHJcblx0XHQjZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cdFx0I2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG5cclxuXHRyZWNlaXZlID0gKG9iamVjdCwgbmFtZSwgZGF0YSkgLT5cclxuXHJcblx0XHRpZiBkYXRhLnN0YWdlIDwgMFxyXG5cclxuXHJcblx0XHRcdG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwgZmFkZScpXHJcblx0XHRcdGRpYWxvZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWRpYWxvZycpXHJcblx0XHRcdGNvbnRlbnQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1jb250ZW50JylcclxuXHRcdFx0aGVhZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtaGVhZGVyJylcclxuXHRcdFx0Ym9keSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWJvZHknKVxyXG5cdFx0XHRmb290ZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1mb290ZXInKVxyXG5cdFx0XHR0aXRsZSA9ICQoJzxoND48L2g0PicpLmFkZENsYXNzKCdtb2RhbC10aXRsZScpXHJcblxyXG5cdFx0XHRncm91cCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2J0bi1ncm91cCcpXHJcblx0XHRcdGJ0bjEgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdidG4gYnRuLXN1Y2Nlc3MnKS5hdHRyKCd2YWx1ZScsICd5ZXMnKS50ZXh0KGkxOG4ueWVzKVxyXG5cdFx0XHRidG4yID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnRuIGJ0bi1kYW5nZXInKS5hdHRyKCd2YWx1ZScsICdubycpLnRleHQoaTE4bi5ubylcclxuXHJcblx0XHRcdCQoYnRuMSkuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YToge25hbWU6IG5hbWUsIGFjdGl2ZTogMX0sXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcdFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdCQobW9kYWwpLm1vZGFsKCdoaWRlJylcclxuXHJcblx0XHRcdFx0bG9hZChvYmplY3QsIG5hbWUsIGRhdGEpXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQoYnRuMikuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YToge25hbWU6IG5hbWUsIGFjdGl2ZTogMH0sXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcdFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdCQobW9kYWwpLm1vZGFsKCdoaWRlJylcclxuXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQodGl0bGUpXHJcblx0XHRcdFx0LnRleHQoZGF0YS50aXRsZSlcclxuXHJcblx0XHRcdCQoYm9keSlcclxuXHRcdFx0XHQudGV4dChkYXRhLmRlc2NyaXB0aW9uKVxyXG5cclxuXHRcdFx0JChoZWFkZXIpXHJcblx0XHRcdFx0LmFwcGVuZCh0aXRsZSlcclxuXHJcblxyXG5cdFx0XHQkKGdyb3VwKVxyXG5cdFx0XHRcdC5hcHBlbmQoYnRuMilcclxuXHRcdFx0XHQuYXBwZW5kKGJ0bjEpXHJcblxyXG5cdFx0XHQkKGZvb3RlcilcclxuXHRcdFx0XHQuYXBwZW5kKGdyb3VwKVxyXG5cclxuXHJcblx0XHRcdCQoY29udGVudClcclxuXHRcdFx0XHQuYXBwZW5kKGhlYWRlcilcclxuXHRcdFx0XHQuYXBwZW5kKGJvZHkpXHJcblx0XHRcdFx0LmFwcGVuZChmb290ZXIpXHJcblxyXG5cdFx0XHQkKGRpYWxvZylcclxuXHRcdFx0XHQuYXBwZW5kKGNvbnRlbnQpXHJcblxyXG5cdFx0XHQkKG1vZGFsKVxyXG5cdFx0XHRcdC5hcHBlbmQoZGlhbG9nKVxyXG5cclxuXHRcdFx0JCgnYm9keScpXHJcblx0XHRcdFx0LmFwcGVuZChtb2RhbClcclxuXHJcblx0XHRcdCQobW9kYWwpLm1vZGFsKHtiYWNrZHJvcDogJ3N0YXRpYycsIHNob3c6IHRydWUsIGtleWJvYXJkOiBmYWxzZX0pXHJcblxyXG5cclxuXHRcdGVsc2VcclxuXHRcdFx0bG9hZChvYmplY3QsIG5hbWUsIGRhdGEpXHJcblxyXG5cclxuXHJcblx0bG9hZCA9IChvYmplY3QsIG5hbWUsIGRhdGEpIC0+XHJcblxyXG5cclxuXHRcdHR1dG9yaWFsID0gW11cclxuXHRcdGRlcHRoID0gJChvYmplY3QpLnBhcmVudHMoJ1tkYXRhLXR1dG9yaWFsPXRydWVdJykubGVuZ3RoICsgMVxyXG5cclxuXHJcblx0XHQkKG9iamVjdCkuZmluZCgnLnR1dG9yaWFsLXN0ZXAnKS5lYWNoKC0+XHJcblxyXG5cclxuXHRcdFx0c3RlcCA9IG51bGxcclxuXHRcdFx0aW5kZXggPSAkKHRoaXMpLmRhdGEoJ3R1dG9yaWFsLWluZGV4JylcclxuXHJcblx0XHRcdHJldHVybiBpZiBpbmRleCA8IGRhdGEuc3RhZ2Ugb3IgJCh0aGlzKS5wYXJlbnRzKCdbZGF0YS10dXRvcmlhbD10cnVlXScpLmxlbmd0aCAhPSBkZXB0aFxyXG5cclxuXHJcblxyXG5cdFx0XHRpZiB0dXRvcmlhbFtpbmRleF0/XHJcblx0XHRcdFx0c3RlcCA9IHR1dG9yaWFsW2luZGV4XVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0c3RlcCA9IHtcclxuXHJcblx0XHRcdFx0XHRlbGVtZW50czogW10sXHJcblx0XHRcdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHRcdFx0aW5kZXg6IGluZGV4LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0dXRvcmlhbFtpbmRleF0gPSBzdGVwXHJcblxyXG5cclxuXHRcdFx0c3RlcC5lbGVtZW50cy5wdXNoKHRoaXMpXHJcblx0XHRcdHRoaXMuc3RlcCA9IHN0ZXBcclxuXHRcdClcclxuXHJcblx0XHR0dXRvcmlhbCA9IHR1dG9yaWFsLmZpbHRlcigoZWxlbWVudCkgLT5cclxuXHJcblx0XHRcdGlmIGVsZW1lbnQ/XHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0KVxyXG5cclxuXHJcblxyXG5cdFx0dHV0b3JpYWxzW25hbWVdID0gdHV0b3JpYWxcclxuXHRcdHNob3codHV0b3JpYWwuc2hpZnQoKSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdCQoJ1tkYXRhLXR1dG9yaWFsPXRydWUnKS5lYWNoKC0+XHJcblxyXG5cdFx0bmFtZSA9ICQodGhpcykuZGF0YSgndHV0b3JpYWwtbmFtZScpXHJcblxyXG5cdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0ZGF0YToge25hbWU6IG5hbWV9LFxyXG5cdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT5cclxuXHRcdFx0XHRyZWNlaXZlKHRoaXMsIG5hbWUsIGRhdGEpIGlmIGRhdGEuYWN0aXZlXHJcblx0XHR9KVxyXG5cdCkiLCJ3aW5kb3cuZm9ybWF0IG9yPSBcclxuXHR0aW1lOlxyXG5cdFx0ZGF5OiAnZCdcclxuXHRcdGhvdXI6ICdoJ1xyXG5cdFx0bWludXRlOiAnbSdcclxuXHRcdHNlY29uZDogJ3MnXHJcblxyXG5cclxuXHJcblxyXG53aW5kb3cuYWN0aXZlID89IGZhbHNlXHJcblxyXG5cclxuXHJcbiQod2luZG93KS5mb2N1cyAtPlxyXG5cdHdpbmRvdy5hY3RpdmUgPSB0cnVlXHJcblxyXG4kKHdpbmRvdykuYmx1ciAtPlxyXG5cdHdpbmRvdy5hY3RpdmUgPSBmYWxzZVxyXG5cclxuJCh3aW5kb3cpLnJlc2l6ZSAtPlxyXG5cdGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRvKSBpZiB0aGlzLnJlc2l6ZVRvXHJcblx0dGhpcy5yZXNpemVUbyA9IHNldFRpbWVvdXQoLT5cclxuXHRcdCQodGhpcykudHJpZ2dlcigncmVzaXplZCcpXHJcblx0LCA1MDApXHJcblx0XHJcblxyXG5cclxuXHJcbndpbmRvdy5scGFkIG9yPSAodmFsdWUsIHBhZGRpbmcpIC0+XHJcbiAgemVyb2VzID0gXCIwXCJcclxuICB6ZXJvZXMgKz0gXCIwXCIgZm9yIGkgaW4gWzEuLnBhZGRpbmddXHJcblxyXG4gICh6ZXJvZXMgKyB2YWx1ZSkuc2xpY2UocGFkZGluZyAqIC0xKVxyXG5cclxuXHJcbnRpbWVTZXBhcmF0ZSA9ICh2YWx1ZSkgLT5cclxuXHRpZiB2YWx1ZS5sZW5ndGggPiAwXHJcblx0XHR2YWx1ZSArICcgJ1xyXG5cdGVsc2VcclxuXHRcdHZhbHVlXHJcblxyXG50aW1lRm9ybWF0ID0gKHRleHQsIHZhbHVlLCBmb3JtYXQpIC0+XHJcblx0dGV4dCA9IHRpbWVTZXBhcmF0ZSh0ZXh0KVxyXG5cclxuXHRpZiB0ZXh0Lmxlbmd0aCA+IDBcclxuXHRcdHRleHQgKz0gd2luZG93LmxwYWQgdmFsdWUsIDJcclxuXHRlbHNlIFxyXG5cdFx0dGV4dCArPSB2YWx1ZVxyXG5cclxuXHR0ZXh0ICsgZm9ybWF0XHJcblxyXG5cclxud2luZG93LnRpbWVGb3JtYXQgb3I9ICh2YWx1ZSkgLT5cclxuXHRcclxuXHR0ZXh0ID0gJydcclxuXHRkYXRlID0gbmV3IERhdGUodmFsdWUgKiAxMDAwKVxyXG5cdGQgPSBkYXRlLmdldFVUQ0RhdGUoKSAtIDFcclxuXHRoID0gZGF0ZS5nZXRVVENIb3VycygpXHJcblx0bSA9IGRhdGUuZ2V0VVRDTWludXRlcygpXHJcblx0cyA9IGRhdGUuZ2V0VVRDU2Vjb25kcygpXHJcblxyXG5cclxuXHR0ZXh0ICs9IGQgKyBmb3JtYXQudGltZS5kYXkgaWYgZCA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBoLCBmb3JtYXQudGltZS5ob3VyKSBpZiBoID4gMFxyXG5cdHRleHQgPSB0aW1lRm9ybWF0KHRleHQsIG0sIGZvcm1hdC50aW1lLm1pbnV0ZSkgaWYgaCA+IDAgb3IgbSA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBzLCBmb3JtYXQudGltZS5zZWNvbmQpIGlmIGggPiAwIG9yIG0gPiAwIG9yIHMgPiAwXHJcblxyXG5cdHRleHRcclxuXHJcbndpbmRvdy50aW1lRm9ybWF0U2hvcnQgb3I9ICh2YWx1ZSkgLT5cclxuXHJcblx0dGV4dCA9ICcnXHJcblx0ZGF0ZSA9IG5ldyBEYXRlKHZhbHVlICogMTAwMClcclxuXHRkID0gZGF0ZS5nZXRVVENEYXRlKCkgLSAxXHJcblx0aCA9IGRhdGUuZ2V0VVRDSG91cnMoKVxyXG5cdG0gPSBkYXRlLmdldFVUQ01pbnV0ZXMoKVxyXG5cdHMgPSBkYXRlLmdldFVUQ1NlY29uZHMoKVxyXG5cclxuXHJcblx0cmV0dXJuIGQgKyBmb3JtYXQudGltZS5kYXkgaWYgZCA+IDBcclxuXHRyZXR1cm4gdGltZUZvcm1hdCh0ZXh0LCBoLCBmb3JtYXQudGltZS5ob3VyKSBpZiBoID4gMFxyXG5cdHJldHVybiB0aW1lRm9ybWF0KHRleHQsIG0sIGZvcm1hdC50aW1lLm1pbnV0ZSkgaWYgbSA+IDBcclxuXHRyZXR1cm4gdGltZUZvcm1hdCh0ZXh0LCBzLCBmb3JtYXQudGltZS5zZWNvbmQpIGlmIHMgPiAwXHJcblxyXG5cclxuXHJcblxyXG5yZWZyZXNoaW5nID0gZmFsc2VcclxuXHJcblxyXG53aW5kb3cubG9jYXRpb24ucmVmcmVzaCBvcj0gLT5cclxuXHRpZiBub3QgcmVmcmVzaGluZ1xyXG5cdFx0cmVmcmVzaGluZyA9IHRydWVcclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSlcclxuXHJcblxyXG5cclxuXHJcbm5vdGlmaWNhdGlvbnMgPSBbXVxyXG53aW5kb3cubm90aWZ5IG9yPSAocHJvcHMpLT5cclxuXHRub3RpZmljYXRpb25zLnB1c2ggcHJvcHNcclxuXHJcblxyXG5jbG9uZSA9IChvYmopIC0+XHJcblx0cmV0dXJuIG9iaiAgaWYgb2JqIGlzIG51bGwgb3IgdHlwZW9mIChvYmopIGlzbnQgXCJvYmplY3RcIlxyXG5cdHRlbXAgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKClcclxuXHRmb3Iga2V5IG9mIG9ialxyXG5cdFx0dGVtcFtrZXldID0gY2xvbmUob2JqW2tleV0pXHJcblx0dGVtcFxyXG5cclxuc2hvd05vdGlmeSA9IChuLCBpKSAtPlxyXG5cdGNvbnNvbGUubG9nKCdQJywgbiwgaSk7XHJcblx0c2V0VGltZW91dCAoLT4gXHJcblx0XHRjb25zb2xlLmxvZygnUycsIG4sIGkpO1xyXG5cdFx0JC5ub3RpZnkobiwge1xyXG5cclxuXHRcdFx0cGxhY2VtZW50OiB7XHJcblxyXG5cdFx0XHRcdGZyb206ICdib3R0b20nLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtb3VzZV9vdmVyOiAncGF1c2UnLFxyXG5cclxuXHRcdFx0fSkpLCBpICogMTAwMFxyXG5cdFxyXG5cclxuXHJcblxyXG53aW5kb3cubm90aWZ5U2hvdyBvcj0gLT5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblxyXG5cdFx0Zm9yIG5vdGlmaWNhdGlvbiwgaW5kZXggaW4gbm90aWZpY2F0aW9uc1xyXG5cdFx0XHRzaG93Tm90aWZ5ICQuZXh0ZW5kKHt9LCBub3RpZmljYXRpb24pLCBpbmRleFxyXG5cdFx0bm90aWZpY2F0aW9ucyA9IFtdXHJcblxyXG5cclxuXHJcbiQod2luZG93KS5mb2N1cyAtPiB3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuTWF0aC5jbGFtcCBvcj0gKHZhbHVlLCBtaW4sIG1heCkgLT5cclxuXHRNYXRoLm1heChNYXRoLm1pbih2YWx1ZSwgbWF4KSwgbWluKVxyXG5cclxuXHJcbk1hdGgubGVycCBvcj0gKGksIGEsIGIpIC0+XHJcblx0KGEgKiBpKSArIChiICogKDEgLSBpKSlcclxuXHJcblxyXG5cclxuTWF0aC5oZXhUb1JnYiBvcj0gKGhleCkgLT4gXHJcbiAgICByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbiAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcclxuXHJcbiAgICB9IGlmIHJlc3VsdDtcclxuICAgIG51bGw7XHJcblxyXG5NYXRoLnJnYlRvSGV4IG9yPSAociwgZywgYikgLT5cclxuICAgIHJldHVybiBcIiNcIiArICgoMSA8PCAyNCkgKyAociA8PCAxNikgKyAoZyA8PCA4KSArIGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxuXHJcblxyXG5NYXRoLmxlcnBDb2xvcnMgb3I9IChpLCBhLCBiKSAtPlxyXG5cclxuXHRjYSA9IE1hdGguaGV4VG9SZ2IgYVxyXG5cdGNiID0gTWF0aC5oZXhUb1JnYiBiXHJcblxyXG5cdGNjID0ge1xyXG5cdFx0cjogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuciwgY2IucikpLFxyXG5cdFx0ZzogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuZywgY2IuZykpLFxyXG5cdFx0YjogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuYiwgY2IuYikpLFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE1hdGgucmdiVG9IZXgoY2MuciwgY2MuZywgY2MuYilcclxuXHJcblxyXG5cclxuXHJcblxyXG51cGRhdGVQcm9ncmVzcyA9IC0+XHJcblx0YmFyID0gJCh0aGlzKS5jaGlsZHJlbignLnByb2dyZXNzLWJhcicpXHJcblx0bGFiZWwgPSAkKHRoaXMpLmNoaWxkcmVuKCcucHJvZ3Jlc3MtbGFiZWwnKVxyXG5cclxuXHRtaW4gPSAkKGJhcikuZGF0YSgnbWluJylcclxuXHRtYXggPSAkKGJhcikuZGF0YSgnbWF4JylcclxuXHRjYSA9ICQoYmFyKS5kYXRhKCdjYScpXHJcblx0Y2IgPSAkKGJhcikuZGF0YSgnY2InKVxyXG5cdG5vdyA9IE1hdGguY2xhbXAoJChiYXIpLmRhdGEoJ25vdycpLCBtaW4sIG1heClcclxuXHRyZXZlcnNlZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JldmVyc2VkJykgPyBmYWxzZSlcclxuXHJcblx0cGVyY2VudCA9IChub3cgLSBtaW4pIC8gKG1heCAtIG1pbikgKiAxMDBcclxuXHRwZXJjZW50ID0gMTAwIC0gcGVyY2VudCBpZiByZXZlcnNlZFxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0JChiYXIpLmNzcygnd2lkdGgnLCBwZXJjZW50ICsgJyUnKVxyXG5cdCQoYmFyKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBNYXRoLmxlcnBDb2xvcnMocGVyY2VudCAvIDEwMCwgY2EsIGNiKSkgaWYgY2E/IGFuZCBjYj9cclxuXHJcblxyXG5cclxuXHQkKGxhYmVsKS50ZXh0KG5vdyArICcgLyAnICsgbWF4KVxyXG5cclxuJCAtPiBcclxuXHQkKCcucHJvZ3Jlc3MnKS5lYWNoIC0+XHJcblx0XHR0aGlzLnVwZGF0ZSBvcj0gdXBkYXRlUHJvZ3Jlc3NcclxuXHJcblxyXG5cclxucmVsTW91c2VDb29yZHMgPSBgZnVuY3Rpb24gKGV2ZW50KXtcclxuICAgIHZhciB0b3RhbE9mZnNldFggPSAwO1xyXG4gICAgdmFyIHRvdGFsT2Zmc2V0WSA9IDA7XHJcbiAgICB2YXIgY2FudmFzWCA9IDA7XHJcbiAgICB2YXIgY2FudmFzWSA9IDA7XHJcbiAgICB2YXIgY3VycmVudEVsZW1lbnQgPSB0aGlzO1xyXG5cclxuICAgIGRve1xyXG4gICAgICAgIHRvdGFsT2Zmc2V0WCArPSBjdXJyZW50RWxlbWVudC5vZmZzZXRMZWZ0IC0gY3VycmVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB0b3RhbE9mZnNldFkgKz0gY3VycmVudEVsZW1lbnQub2Zmc2V0VG9wIC0gY3VycmVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gICAgfVxyXG4gICAgd2hpbGUoY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5vZmZzZXRQYXJlbnQpXHJcblxyXG4gICAgY2FudmFzWCA9IGV2ZW50LnBhZ2VYIC0gdG90YWxPZmZzZXRYO1xyXG4gICAgY2FudmFzWSA9IGV2ZW50LnBhZ2VZIC0gdG90YWxPZmZzZXRZO1xyXG5cclxuICAgIHJldHVybiB7eDpjYW52YXNYLCB5OmNhbnZhc1l9XHJcbn1gXHJcblxyXG5IVE1MQ2FudmFzRWxlbWVudC5wcm90b3R5cGUucmVsTW91c2VDb29yZHMgPSByZWxNb3VzZUNvb3JkcztcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4oLT5cclxuXHJcblx0b2xkU2hvdyA9ICQuZm4uc2hvd1xyXG5cclxuXHQjIyNcclxuXHJcblxyXG5cdCQuZm4uc2hvdyA9IChzcGVlZCwgb2xkQ2FsbGJhY2spIC0+XHJcblxyXG5cdFx0Y29uc29sZS5sb2coJ3Nob3cnLCB0aGlzKVxyXG5cclxuXHRcdG5ld0NhbGxiYWNrID0gLT5cclxuXHJcblx0XHRcdG9sZENhbGxiYWNrLmFwcGx5KHRoaXMpIGlmICQuaXNGdW5jdGlvbihvbGRDYWxsYmFjaylcclxuXHRcdFx0JCh0aGlzKS50cmlnZ2VyKCdhZnRlclNob3cnKVxyXG5cclxuXHRcdCQodGhpcykudHJpZ2dlcignYmVmb3JlU2hvdycpXHJcblxyXG5cdFx0ZGVlcCA9ICQodGhpcykuZmluZCgnW2RhdGEtZGVlcHNob3ddJylcclxuXHJcblx0XHRpZiBkZWVwLmxlbmd0aFxyXG5cdFx0XHRkZWVwLnNob3coKVxyXG5cclxuXHRcdG9sZFNob3cuYXBwbHkodGhpcywgW3NwZWVkLCBuZXdDYWxsYmFja10pXHJcblx0IyMjXHJcbikoKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblN0cmluZy5wcm90b3R5cGUuZXNjYXBlIG9yPSAtPlxyXG5cdHRoaXMucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCBcIlxcXFwkMVwiKVxyXG5cclxuXHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgb3I9IChzZWFyY2gsIHJlcGxhY2UpIC0+XHJcblx0dGhpcy5yZXBsYWNlKG5ldyBSZWdFeHAoc2VhcmNoLmVzY2FwZSgpLCAnZ2knKSwgcmVwbGFjZSlcclxuXHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==