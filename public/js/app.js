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
  var Battle, Character, accumulator, battle, config, interval, lastTime, requestFrame;

  config = {
    fontSize: 30,
    barFontSize: 20,
    nameFontSize: 30,
    margin: 5
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
    function Battle() {}

    Battle.prototype.speed = {
      view: 3.0,
      info: 3.0,
      next: 3.0
    };

    Battle.prototype.construct = function() {};

    Battle.prototype.load = function() {
      var character, data, j, k, len, len1, ref, ref1;
      if (typeof battleLog !== "undefined" && battleLog !== null) {
        this.canvas = $('#battleView')[0];
        this.context = this.canvas.getContext('2d');
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
        ref = battleLog['teams']['red'];
        for (j = 0, len = ref.length; j < len; j++) {
          data = ref[j];
          character = new Character('red', data);
          this.characters[character.id] = character;
        }
        ref1 = battleLog['teams']['blue'];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          data = ref1[k];
          character = new Character('blue', data);
          this.characters[character.id] = character;
        }
        this.context.font = config.fontSize + 'px Roboto';
        this.action = battleLog['log'][this.index];
        this.attacker = this.characters[this.action.attacker];
        this.defender = this.characters[this.action.defender];
        return true;
      } else {
        return false;
      }
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

    Battle.prototype.draw = function(delta) {
      var action, animate, at, attacker, defender, height, i, j, len, mark, measure, nextAction, nextAttacker, nextDefender, position, prevAction, prevAttacker, prevDefender, ref, text, width;
      this.context.fillStyle = '#FFFFFF';
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.offset += this.speed[this.state] * delta;
      animate = true;
      if (this.state === 'view' && animate) {
        action = battleLog['log'][this.index];
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
        action = battleLog['log'][this.index];
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
          text = 'dodge';
        }
        this.drawInfo(text);
        this.context.globalAlpha = 1.0;
        animate = false;
      }
      if (this.state === 'next' && animate) {
        prevAction = battleLog['log'][this.index];
        nextAction = battleLog['log'][this.index + 1];
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
          text = 'End';
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
        text = 'End';
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
      this.context.fillRect(2, height - 20, width * (Math.min(this.index / (battleLog['log'].length - 1), 1)), 20);
      this.context.lineWidth = 5;
      ref = battleLog['marks'];
      for (j = 0, len = ref.length; j < len; j++) {
        mark = ref[j];
        if (mark.type === 'fainted') {
          this.context.strokeStyle = '#D9534F';
        }
        at = (mark.at / (battleLog['log'].length - 1)) * width;
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
        this.index = Math.round((x - l) / (r - l) * (battleLog['log'].length - 1));
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
        this.index = Math.min(this.index + 1, battleLog['log'].length - 1);
        this.offset = 1.0;
        return this.state = 'view';
      }
    };

    return Battle;

  })();

  battle = new Battle;

  lastTime = new Date().getTime();

  interval = 1000 / 60;

  accumulator = 0.0;

  requestFrame = function(time) {
    var delta;
    delta = Math.max(time - lastTime, 0);
    lastTime = time;
    accumulator += delta;
    while (accumulator >= interval) {
      accumulator -= interval;
      battle.draw(interval / 1000);
    }
    return window.requestAnimationFrame(requestFrame);
  };

  $(function() {
    if (battle.load()) {
      return window.requestAnimationFrame(requestFrame);
    }
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
      join: 120
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
      this.input = $(element).find('.input');
      this.output = $(element).find('.output');
      this.sendBtn = $(element).find('.send');
      this.clearBtn = $(element).find('.clear');
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
      this.update();
    }

    Chat.prototype.getErrorText = function(name, args) {
      var k, ref, text, v;
      text = (ref = i18l.chat.errors[name]) != null ? ref : i18l.chat.errors.unknown;
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
      var command, func, k, matches, message, now, v;
      now = Math.round((new Date()).getTime() / 1000);
      message = $(this.input).val();
      matches = message.match(/^\/(\w+)/i);
      if (typeof matches === "function" ? matches(matches[1] != null) : void 0) {
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
      $.ajax({
        url: this.messageUrl,
        success: (function(_this) {
          return function(data) {
            return _this.onSent(data);
          };
        })(this),
        data: {
          message: $(this.input).val()
        },
        dataType: 'json',
        method: 'POST'
      });
      this.sent = now;
      return $(this.sendBtn).data('time', this.sent + this.cooldown);
    };

    Chat.prototype.receive = function() {
      $.ajax({
        url: this.messageUrl,
        data: {
          time: this.time
        },
        success: (function(_this) {
          return function(data) {
            return _this.onReceived(data);
          };
        })(this),
        dataType: 'json',
        method: 'GET'
      });
      return this.touch();
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
      var author, message, time;
      message = $(this.output).find('.chat-message').last();
      if (message.length === 0) {
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
      message = $(this.output).find('.chat-message').last();
      return message.scrollTop(message[0].scrollHeight - message.height());
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

    Chat.prototype.update = function() {
      var callback;
      callback = (function(_this) {
        return function() {
          return _this.update();
        };
      })(this);
      this.receive();
      return setTimeout(callback, this.interval * 1000);
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
        var interval, time;
        time = parseInt($(this).data('time'));
        interval = now - time;
        if (interval < 60) {
          return $(this).text('few seconds ago');
        } else {
          return $(this).text(window.timeFormatShort(interval) + ' ago');
        }
      });
      $('.chat .send').each(function() {
        var interval, text, time;
        time = parseInt($(this).data('time'));
        text = $(this).data('text');
        interval = time - now;
        if (interval > 0) {
          return $(this).text(window.timeFormat(interval)).addClass('disabled');
        } else {
          return $(this).text(text).removeClass('disabled');
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
    console.log(dismissible);
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
        'O.o': 'suprised.png',
        ':p': 'tongue.png'
      },
      url: '/images/emoticons/{name}'
    };

    function Emoticons(url, emoticons) {
      this.url = url != null ? url : defaults.url;
      this.set = $.extend({}, defaults.emoticons, emoticons != null ? emoticons : {});
    }

    Emoticons.prototype.insert = function(text) {
      var emoticon, k, lc, ref, uc, url, v;
      ref = this.set;
      for (k in ref) {
        v = ref[k];
        lc = k.toLowerCase();
        uc = k.toUpperCase();
        url = this.url.replace('{name}', v);
        emoticon = '<img class="emoticon" src="' + url + '" alt="' + k + '"/>';
        if (lc === uc) {
          text = text.replace(lc, emoticon);
        } else {
          text = text.replace(lc, emoticon).replace(uc, emoticon);
        }
      }
      return text;
    };

    return Emoticons;

  })();

  counter = 0;

  $(function() {
    var emoticons;
    console.log('Document ready #' + (++counter));
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
        return $(preview).attr('src', path);
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
        btn1 = $('<div></div>').addClass('btn btn-success').attr('value', 'yes').text('yes');
        btn2 = $('<div></div>').addClass('btn btn-danger').attr('value', 'no').text('no');
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
  var base, clone, notifications, refreshing, relMouseCoords, showNotify, timeFormat, timeSeparate, updateProgress;

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

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb2ZmZWUiLCJhdmF0YXIuY29mZmVlIiwiYmF0dGxlLmNvZmZlZSIsImNoYXQuY29mZmVlIiwiY2xvY2suY29mZmVlIiwiZGlhbG9nLmNvZmZlZSIsImVtb3RpY29uLmNvZmZlZSIsImVxdWFsaXplci5jb2ZmZWUiLCJmb3JtLmNvZmZlZSIsImllZml4LmNvZmZlZSIsImltYWdlUHJldmlldy5jb2ZmZWUiLCJsYW5ndWFnZS5jb2ZmZWUiLCJuYXZmaXguY29mZmVlIiwicGxhbnRhdGlvbi5jb2ZmZWUiLCJwbGF5ZXIuY29mZmVlIiwic3F1YXJlLmNvZmZlZSIsInN0YXRpc3RpY3MuY29mZmVlIiwidGltZXIuY29mZmVlIiwidG9vbHRpcC5jb2ZmZWUiLCJ0dXRvcmlhbC5jb2ZmZWUiLCJ1dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUE7RUFBQSxJQUFDLENBQUEsR0FBRCxHQUFPLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUF1QixFQUF2Qjs7RUFJUCxJQUFDLENBQUEsR0FBRyxDQUFDLFVBQUwsQ0FBZ0IsZ0JBQWhCLEVBQWtDLFNBQUMsTUFBRDtXQUdqQyxNQUFNLENBQUMsS0FBUCxHQUFlLFNBQUMsS0FBRCxFQUFRLFNBQVI7QUFFZCxVQUFBO01BQUEsQ0FBQSx1QkFBSSxZQUFZO01BQ2hCLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsRUFBYSxDQUFiO2FBRUosSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFBLEdBQVEsQ0FBbkIsQ0FBQSxHQUF3QjtJQUxWO0VBSGtCLENBQWxDOztFQWNBLElBQUMsQ0FBQSxHQUFHLENBQUMsVUFBTCxDQUFnQixrQkFBaEIsRUFBb0MsU0FBQyxNQUFELEdBQUEsQ0FBcEM7QUFsQkE7OztBQ0pBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsU0FBQTtJQUNULENBQUEsQ0FBRSxTQUFGLENBQVksQ0FBQyxXQUFiLENBQXlCLFFBQXpCO0lBQ0EsQ0FBQSxDQUFFLFNB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ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcblxyXG5cclxuXHJcbkBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnZ2FtZScsIFtdKVxyXG5cclxuXHJcblxyXG5AYXBwLmNvbnRyb2xsZXIoJ0dhbWVDb250cm9sbGVyJywgKCRzY29wZSkgLT5cclxuXHJcblxyXG5cdCRzY29wZS5yb3VuZCA9ICh2YWx1ZSwgcHJlY2lzaW9uKSAtPlxyXG5cclxuXHRcdHAgPSBwcmVjaXNpb24gPyAwXHJcblx0XHRuID0gTWF0aC5wb3coMTAsIHApXHJcblxyXG5cdFx0TWF0aC5yb3VuZCh2YWx1ZSAqIG4pIC8gblxyXG5cclxuKVxyXG5cclxuXHJcblxyXG5AYXBwLmNvbnRyb2xsZXIoJ1BsYXllckNvbnRyb2xsZXInLCAoJHNjb3BlKSAtPlxyXG5cclxuXHJcbilcclxuXHJcbiIsIlxyXG5cclxuY2xpY2tlZCA9IC0+XHJcblx0JCgnLmF2YXRhcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdCQoJyNhdmF0YXInKS52YWwoJCh0aGlzKS5kYXRhKCdhdmF0YXInKSlcclxuXHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cclxuXHJcbiQgLT5cclxuXHQkKCcuYXZhdGFyJykuY2xpY2soY2xpY2tlZCkuZmlyc3QoKS50cmlnZ2VyKCdjbGljaycpIiwiY29uZmlnID1cclxuXHRmb250U2l6ZTogMzBcclxuXHRiYXJGb250U2l6ZTogMjBcclxuXHRuYW1lRm9udFNpemU6IDMwXHJcblx0bWFyZ2luOiA1XHJcblxyXG5cclxuXHJcbmNsYXNzIENoYXJhY3RlclxyXG5cclxuXHJcblx0Y29uc3RydWN0b3I6ICh0ZWFtLCBkYXRhKSAtPlxyXG5cclxuXHRcdGltYWdlID0gbmV3IEltYWdlKClcclxuXHRcdGltYWdlLnNyYyA9IGRhdGEuYXZhdGFyXHJcblx0XHRpbWFnZS5vbmxvYWQgPSA9PlxyXG5cdFx0XHRAYXZhdGFyID0gaW1hZ2VcclxuXHJcblxyXG5cclxuXHRcdEB0ZWFtID0gdGVhbVxyXG5cdFx0QG5hbWUgPSBkYXRhLm5hbWVcclxuXHRcdEBpZCA9IGRhdGEuaWRcclxuXHRcdEBsZXZlbCA9IGRhdGEubGV2ZWxcclxuXHRcdEBoZWFsdGggPSBkYXRhLmhlYWx0aFxyXG5cdFx0QG1heEhlYWx0aCA9IGRhdGEubWF4SGVhbHRoXHJcblxyXG5cclxuXHRkcmF3OiAoY29udGV4dCwgc2l6ZSkgLT5cclxuXHRcdGlmIEB0ZWFtID09ICdyZWQnXHJcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMSknXHJcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjE3LCA4MywgNzksIDAuNCknXHJcblx0XHRlbHNlXHJcblx0XHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSg1MSwgMTIyLCAxODMsIDEpJ1xyXG5cdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDUxLCAxMjIsIDE4MywgMC40KSdcclxuXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KDAsIDAsIHNpemUsIHNpemUpXHJcblx0XHRjb250ZXh0LnN0cm9rZVJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSlcclxuXHJcblx0XHRpZiBAYXZhdGFyP1xyXG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZShAYXZhdGFyLCBjb25maWcubWFyZ2luLCBjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIsIHNpemUgLSBjb25maWcubWFyZ2luICogMilcclxuXHJcblx0XHR0ZXh0ID0gQG5hbWUgKyAnICgnICsgQGxldmVsICsgJyknXHJcblxyXG5cdFx0Y29udGV4dC5mb250ID0gY29uZmlnLm5hbWVGb250U2l6ZSArICdweCBSb2JvdG8nXHJcblx0XHRjb250ZXh0LmxpbmVXaWR0aCA9IDFcclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRtZWFzdXJlID0gY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0LCAoc2l6ZSAtIG1lYXN1cmUud2lkdGgpIC8gMiwgY29uZmlnLm5hbWVGb250U2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCAoc2l6ZSAtIG1lYXN1cmUud2lkdGgpIC8gMiwgY29uZmlnLm5hbWVGb250U2l6ZSlcclxuXHJcblxyXG5cdFx0Y29udGV4dC5mb250ID0gY29uZmlnLmJhckZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjcpJ1xyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjQpJ1xyXG5cdFx0Y29udGV4dC5maWxsUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyLCBjb25maWcuYmFyRm9udFNpemUpXHJcblx0XHRjb250ZXh0LnN0cm9rZVJlY3QoY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5iYXJGb250U2l6ZSAtIGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcubWFyZ2luICogMiwgY29uZmlnLmJhckZvbnRTaXplKVxyXG5cclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMjE3LCA4MywgNzksIDEpJ1xyXG5cdFx0Y29udGV4dC5maWxsUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgKHNpemUgLSBjb25maWcubWFyZ2luICogMikgKiAoQGhlYWx0aCAvIEBtYXhIZWFsdGgpLCBjb25maWcuYmFyRm9udFNpemUpXHJcblxyXG5cdFx0dGV4dCA9IE1hdGgucm91bmQoQGhlYWx0aCkgKyAnIC8gJyArIEBtYXhIZWFsdGhcclxuXHRcdG1lYXN1cmUgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0LCAoc2l6ZSAtIG1lYXN1cmUud2lkdGgpIC8gMiwgc2l6ZSAtIGNvbmZpZy5iYXJGb250U2l6ZSAvIDIpXHJcblxyXG5cclxuXHJcblxyXG5cclxuY2xhc3MgQmF0dGxlXHJcblxyXG5cdHNwZWVkOiBcclxuXHRcdHZpZXc6IDMuMFxyXG5cdFx0aW5mbzogMy4wXHJcblx0XHRuZXh0OiAzLjBcclxuXHJcblxyXG5cclxuXHJcblx0Y29uc3RydWN0OiAtPlxyXG5cclxuXHJcblxyXG5cdGxvYWQ6IC0+XHJcblxyXG5cdFx0aWYgYmF0dGxlTG9nP1xyXG5cdFx0XHRAY2FudmFzID0gJCgnI2JhdHRsZVZpZXcnKVswXVxyXG5cdFx0XHRAY29udGV4dCA9IEBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG5cdFx0XHRAaW5kZXggPSAwXHJcblx0XHRcdEBjaGFyYWN0ZXJzID0gW11cclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRcdEBvZmZzZXQgPSAwXHJcblx0XHRcdEBwYXVzZSA9IGZhbHNlXHJcblxyXG5cdFx0XHQkKEBjYW52YXMpLmNsaWNrKChldmVudCkgPT4gQGNsaWNrKGV2ZW50KSlcclxuXHRcdFx0JChkb2N1bWVudCkua2V5ZG93bigoZXZlbnQpID0+IEBrZXkoZXZlbnQpKVxyXG5cclxuXHRcdFx0Zm9yIGRhdGEgaW4gYmF0dGxlTG9nWyd0ZWFtcyddWydyZWQnXVxyXG5cdFx0XHRcdGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoJ3JlZCcsIGRhdGEpXHJcblx0XHRcdFx0QGNoYXJhY3RlcnNbY2hhcmFjdGVyLmlkXSA9IGNoYXJhY3RlclxyXG5cclxuXHJcblx0XHRcdGZvciBkYXRhIGluIGJhdHRsZUxvZ1sndGVhbXMnXVsnYmx1ZSddXHJcblx0XHRcdFx0Y2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcignYmx1ZScsIGRhdGEpXHJcblx0XHRcdFx0QGNoYXJhY3RlcnNbY2hhcmFjdGVyLmlkXSA9IGNoYXJhY3RlclxyXG5cclxuXHRcdFx0QGNvbnRleHQuZm9udCA9IGNvbmZpZy5mb250U2l6ZSArICdweCBSb2JvdG8nXHJcblxyXG5cclxuXHRcdFx0QGFjdGlvbiA9IGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0XHRAYXR0YWNrZXIgPSBAY2hhcmFjdGVyc1tAYWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRAZGVmZW5kZXIgPSBAY2hhcmFjdGVyc1tAYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0dHJ1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRmYWxzZVxyXG5cclxuXHRkcmF3Q2hhcmFjdGVyczogKGF0dGFja2VyLCBkZWZlbmRlcikgLT5cclxuXHJcblx0XHRzaXplID0gQGNhbnZhcy5oZWlnaHQgKiAwLjZcclxuXHRcdGhhbGZXaWR0aCA9IEBjYW52YXMud2lkdGggLyAyXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoKGhhbGZXaWR0aCAtIHNpemUpIC8gMiwgKEBjYW52YXMuaGVpZ2h0IC0gc2l6ZSkgLyAyKVxyXG5cdFx0YXR0YWNrZXIuZHJhdyhAY29udGV4dCwgc2l6ZSlcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKChoYWxmV2lkdGggLSBzaXplKSAvIDIgKyBoYWxmV2lkdGgsIChAY2FudmFzLmhlaWdodCAtIHNpemUpIC8gMilcclxuXHRcdGRlZmVuZGVyLmRyYXcoQGNvbnRleHQsIHNpemUpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdGRyYXdJbmZvOiAodGV4dCkgLT5cclxuXHRcdGhhbGZXaWR0aCA9IEBjYW52YXMud2lkdGggLyAyXHJcblx0XHRoYWxmSGVpZ2h0ID0gQGNhbnZhcy5oZWlnaHQgLyAyXHJcblx0XHRibG9ja1NpemUgPSBAY2FudmFzLmhlaWdodCAqIDAuNlxyXG5cclxuXHRcdHN0YXJSYWRpdXMgPSA1MFxyXG5cdFx0c3RhcldpZHRoID0gc3RhclJhZGl1cyAqIDJcclxuXHRcdHN0YXJYID0gaGFsZldpZHRoICsgKGJsb2NrU2l6ZSArIHN0YXJSYWRpdXMpIC8gMlxyXG5cdFx0c3RhclkgPSBoYWxmSGVpZ2h0XHJcblx0XHRzdGFyVyA9IChibG9ja1NpemUgKiAwLjcpIC8gc3RhcldpZHRoXHJcblx0XHRzdGFySCA9IDEuMlxyXG5cdFx0c3RhclBpa2VzID0gMTNcclxuXHJcblx0XHRAY29udGV4dC5mb250ID0gY29uZmlnLmZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdG1lYXN1cmUgPSBAY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0dGV4dFggPSBzdGFyWCAtIG1lYXN1cmUud2lkdGggLyAyXHJcblx0XHR0ZXh0WSA9IGhhbGZIZWlnaHRcclxuXHJcblxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQubGluZVdpZHRoID0gMlxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKHN0YXJYLCBzdGFyWSlcclxuXHRcdEBjb250ZXh0LnNjYWxlKHN0YXJXLCBzdGFySClcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkZGRkZGJ1xyXG5cdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdEBkcmF3U3RhcihzdGFyUGlrZXMsIHN0YXJSYWRpdXMgKiAwLjYsIHN0YXJSYWRpdXMpXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSh0ZXh0WCwgdGV4dFkpXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIDAsIDApXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdGRyYXdTdGFyOiAocGlrZXMsIGlubmVyUmFkaXVzLCBvdXRlclJhZGl1cykgLT5cclxuXHRcdHJvdCA9IE1hdGguUEkgLyAyICogM1xyXG5cdFx0c3RlcCA9IE1hdGguUEkgLyBwaWtlc1xyXG5cclxuXHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHR5ID0gTWF0aC5zaW4ocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRAY29udGV4dC5tb3ZlVG8oeCwgeSlcclxuXHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0Zm9yIGkgaW4gWzEuLnBpa2VzXVxyXG5cdFx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIGlubmVyUmFkaXVzXHJcblx0XHRcdHkgPSBNYXRoLnNpbihyb3QpICogaW5uZXJSYWRpdXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKHgsIHkpXHJcblx0XHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0XHR4ID0gTWF0aC5jb3Mocm90KSAqIG91dGVyUmFkaXVzXHJcblx0XHRcdHkgPSBNYXRoLnNpbihyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKHgsIHkpXHJcblx0XHRcdHJvdCArPSBzdGVwXHJcblxyXG5cdFx0QGNvbnRleHQubGluZVRvKDAsIC1vdXRlclJhZGl1cylcclxuXHRcdEBjb250ZXh0LmZpbGwoKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHRcdEBjb250ZXh0LmNsb3NlUGF0aCgpXHJcblx0XHRcclxuXHJcblxyXG5cclxuXHJcblx0ZHJhdzogKGRlbHRhKS0+XHJcblxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRAY29udGV4dC5jbGVhclJlY3QoMCwgMCwgQGNhbnZhcy53aWR0aCwgQGNhbnZhcy5oZWlnaHQpXHJcblx0XHRAb2Zmc2V0ICs9IEBzcGVlZFtAc3RhdGVdICogZGVsdGFcclxuXHRcdGFuaW1hdGUgPSB0cnVlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICd2aWV3JyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHRhY3Rpb24gPSBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0YXR0YWNrZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdGRlZmVuZGVyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0aWYoYWN0aW9uLnR5cGUgPT0gJ2hpdCcpXHJcblx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gYWN0aW9uLmhlYWx0aFxyXG5cclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKGF0dGFja2VyLCBkZWZlbmRlcilcclxuXHJcblx0XHRcdGlmKEBvZmZzZXQgPiAxLjAgYW5kIG5vdCBAcGF1c2UpXHJcblx0XHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRcdGRlZmVuZGVyLnN0YXJ0SGVhbHRoID0gZGVmZW5kZXIuaGVhbHRoXHJcblxyXG5cdFx0XHRcdGlmIGFjdGlvbi50eXBlID09ICdoaXQnXHJcblx0XHRcdFx0XHRkZWZlbmRlci5lbmRIZWFsdGggPSBNYXRoLm1heChkZWZlbmRlci5oZWFsdGggLSBhY3Rpb24uZGFtYWdlLCAwKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmVuZEhlYWx0aCA9IGRlZmVuZGVyLmhlYWx0aFxyXG5cclxuXHRcdFx0XHRAc3RhdGUgPSAnaW5mbydcclxuXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnaW5mbycgYW5kIGFuaW1hdGVcclxuXHRcdFx0YWN0aW9uID0gYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdGF0dGFja2VyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHRcdEBkcmF3Q2hhcmFjdGVycyhhdHRhY2tlciwgZGVmZW5kZXIpXHJcblxyXG5cdFx0XHRpZiBAb2Zmc2V0IDw9IDEuMFxyXG5cdFx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gQG9mZnNldFxyXG5cdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IGRlZmVuZGVyLnN0YXJ0SGVhbHRoXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBAb2Zmc2V0IDw9IDIuMFxyXG5cdFx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjBcclxuXHJcblx0XHRcdFx0XHRpID0gTWF0aC5jbGFtcChAb2Zmc2V0IC0gMS4wLCAwLCAxKVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gTWF0aC5sZXJwKGksIGRlZmVuZGVyLmVuZEhlYWx0aCwgZGVmZW5kZXIuc3RhcnRIZWFsdGgpXHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmhlYWx0aCA9IGRlZmVuZGVyLmVuZEhlYWx0aFxyXG5cdFx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBNYXRoLm1heCgzLjAgLSBAb2Zmc2V0LCAwKVxyXG5cclxuXHRcdFx0aWYoQG9mZnNldCA+IDQuMClcclxuXHRcdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdFx0QHN0YXRlID0gJ25leHQnXHJcblxyXG5cdFx0XHRpZiBhY3Rpb24udHlwZSA9PSAnaGl0J1xyXG5cdFx0XHRcdHRleHQgPSBhY3Rpb24uZGFtYWdlXHJcblxyXG5cdFx0XHRcdGlmIGFjdGlvbi5jcml0XHJcblx0XHRcdFx0XHR0ZXh0ICs9ICchJ1xyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSAnZG9kZ2UnXHJcblxyXG5cclxuXHJcblx0XHRcdEBkcmF3SW5mbyh0ZXh0KVxyXG5cclxuXHJcblx0XHRcdEBjb250ZXh0Lmdsb2JhbEFscGhhID0gMS4wXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnbmV4dCcgYW5kIGFuaW1hdGVcclxuXHJcblx0XHRcdHByZXZBY3Rpb24gPSBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0bmV4dEFjdGlvbiA9IGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4ICsgMV1cclxuXHJcblxyXG5cdFx0XHRwcmV2QXR0YWNrZXIgPSBAY2hhcmFjdGVyc1twcmV2QWN0aW9uLmF0dGFja2VyXVxyXG5cdFx0XHRwcmV2RGVmZW5kZXIgPSBAY2hhcmFjdGVyc1twcmV2QWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHJcblx0XHRcdHBvc2l0aW9uID0gKEBjYW52YXMuaGVpZ2h0IC8gMikgKiBAb2Zmc2V0XHJcblxyXG5cdFx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdFx0QGNvbnRleHQudHJhbnNsYXRlKDAsIC1wb3NpdGlvbilcclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKHByZXZBdHRhY2tlciwgcHJldkRlZmVuZGVyKVxyXG5cdFx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cdFx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdFx0QGNvbnRleHQudHJhbnNsYXRlKDAsIEBjYW52YXMuaGVpZ2h0IC0gcG9zaXRpb24pXHJcblxyXG5cdFx0XHRpZiBuZXh0QWN0aW9uP1xyXG5cdFx0XHRcdG5leHRBdHRhY2tlciA9IEBjaGFyYWN0ZXJzW25leHRBY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdFx0bmV4dERlZmVuZGVyID0gQGNoYXJhY3RlcnNbbmV4dEFjdGlvbi5kZWZlbmRlcl1cclxuXHJcblx0XHRcdFx0aWYobmV4dEFjdGlvbi50eXBlID09ICdoaXQnKVxyXG5cdFx0XHRcdFx0bmV4dERlZmVuZGVyLmhlYWx0aCA9IG5leHRBY3Rpb24uaGVhbHRoXHJcblxyXG5cdFx0XHRcdEBkcmF3Q2hhcmFjdGVycyhuZXh0QXR0YWNrZXIsIG5leHREZWZlbmRlcilcclxuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0ZXh0ID0gJ0VuZCdcclxuXHRcdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdFx0XHRtZWFzdXJlID0gQGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdFx0XHRAY29udGV4dC5maWxsVGV4dCh0ZXh0LCAoQGNhbnZhcy53aWR0aCAtIG1lYXN1cmUud2lkdGgpIC8gMiwgKEBjYW52YXMuaGVpZ2h0IC0gMTUpIC8gMilcclxuXHJcblx0XHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdFx0aWYgQG9mZnNldCA+IDIuMFxyXG5cdFx0XHRcdEBpbmRleCsrXHJcblx0XHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRcdGlmIG5leHRBY3Rpb24/XHJcblx0XHRcdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRAc3RhdGUgPSAnZW5kJ1xyXG5cclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cclxuXHRcdGlmIEBzdGF0ZSA9PSAnZW5kJyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHR0ZXh0ID0gJ0VuZCdcclxuXHRcdFx0QG9mZnNldCA9IDAuMFxyXG5cdFx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIChAY2FudmFzLndpZHRoIC0gbWVhc3VyZS53aWR0aCkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSAxNSkgLyAyKVxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblxyXG5cclxuXHJcblx0XHR3aWR0aCA9IEBjYW52YXMud2lkdGggLSA0XHJcblx0XHRoZWlnaHQgPSBAY2FudmFzLmhlaWdodCAtIDJcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC43KSdcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNCknXHJcblx0XHRAY29udGV4dC5maWxsUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGgsIDIwKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGgsIDIwKVxyXG5cclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjNUJDMERFJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFJlY3QoMiwgaGVpZ2h0IC0gMjAsIHdpZHRoICogKE1hdGgubWluKEBpbmRleCAvIChiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpLCAxKSksIDIwKVxyXG5cdFx0QGNvbnRleHQubGluZVdpZHRoID0gNVxyXG5cclxuXHRcdGZvciBtYXJrIGluIGJhdHRsZUxvZ1snbWFya3MnXVxyXG5cclxuXHRcdFx0aWYgbWFyay50eXBlID09ICdmYWludGVkJ1xyXG5cdFx0XHRcdEBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyNEOTUzNEYnXHJcblxyXG5cdFx0XHRhdCA9IChtYXJrLmF0IC8gKGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSkpICogd2lkdGhcclxuXHJcblx0XHRcdEBjb250ZXh0LmJlZ2luUGF0aCgpXHJcblx0XHRcdEBjb250ZXh0Lm1vdmVUbyhhdCAtIEBjb250ZXh0LmxpbmVXaWR0aCAvIDIgKyAyLCBoZWlnaHQgLSAyMClcclxuXHRcdFx0QGNvbnRleHQubGluZVRvKGF0IC0gQGNvbnRleHQubGluZVdpZHRoIC8gMiArIDIsIGhlaWdodClcclxuXHRcdFx0QGNvbnRleHQuc3Ryb2tlKClcclxuXHJcblx0XHRAY29udGV4dC5yZXN0b3JlKClcclxuXHJcblxyXG5cclxuXHJcblx0Y2xpY2s6IChldmVudCkgLT5cclxuXHRcdGNvb3JkcyA9IEBjYW52YXMucmVsTW91c2VDb29yZHMoZXZlbnQpXHJcblx0XHR4ID0gY29vcmRzLnhcclxuXHRcdHkgPSBjb29yZHMueVxyXG5cclxuXHRcdGwgPSAyXHJcblx0XHRyID0gbCArIEBjYW52YXMud2lkdGggLSA0XHJcblx0XHRiID0gQGNhbnZhcy5oZWlnaHQgLSAyXHJcblx0XHR0ID0gYiAtIDIwXHJcblxyXG5cclxuXHRcdGlmIHggPj0gbCBhbmQgeCA8PSByIGFuZCB5ID49IHQgYW5kIHkgPD0gYlxyXG5cdFx0XHRAaW5kZXggPSBNYXRoLnJvdW5kKCh4IC0gbCkgLyAociAtIGwpICogKGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSkpXHJcblx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblxyXG5cdGtleTogKGV2ZW50KSAtPlxyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDMyXHJcblx0XHRcdEBwYXVzZSA9ICFAcGF1c2VcclxuXHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMzdcclxuXHRcdFx0QGluZGV4ID0gTWF0aC5tYXgoQGluZGV4IC0gMSwgMClcclxuXHRcdFx0QG9mZnNldCA9IDEuMFxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAzOVxyXG5cdFx0XHRAaW5kZXggPSBNYXRoLm1pbihAaW5kZXggKyAxLCBiYXR0bGVMb2dbJ2xvZyddLmxlbmd0aCAtIDEpXHJcblx0XHRcdEBvZmZzZXQgPSAxLjBcclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbmJhdHRsZSA9IG5ldyBCYXR0bGU7XHJcblxyXG5sYXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbmludGVydmFsID0gMTAwMCAvIDYwXHJcbmFjY3VtdWxhdG9yID0gMC4wXHJcblxyXG5cclxucmVxdWVzdEZyYW1lID0gKHRpbWUpLT5cclxuXHJcblx0ZGVsdGEgPSBNYXRoLm1heCh0aW1lIC0gbGFzdFRpbWUsIDApXHJcblx0bGFzdFRpbWUgPSB0aW1lIFxyXG5cdGFjY3VtdWxhdG9yICs9IGRlbHRhXHJcblxyXG5cdHdoaWxlIGFjY3VtdWxhdG9yID49IGludGVydmFsXHJcblx0XHRhY2N1bXVsYXRvciAtPSBpbnRlcnZhbFxyXG5cdFx0YmF0dGxlLmRyYXcoaW50ZXJ2YWwgLyAxMDAwKVxyXG5cclxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RGcmFtZSlcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4kIC0+XHJcblx0aWYgYmF0dGxlLmxvYWQoKVxyXG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZXF1ZXN0RnJhbWUpIiwiXHJcblxyXG5jbGFzcyBAQ2hhdFxyXG5cclxuXHRkZWZhdWx0cyA9IHtcclxuXHJcblx0XHRtZXNzYWdlVXJsOiBudWxsLFxyXG5cdFx0cGxheWVyVXJsOiBudWxsLFxyXG5cdFx0ZW1vdGljb25Vcmw6IG51bGwsXHJcblx0XHRpbnRlcnZhbDogMixcclxuXHRcdGhpc3Rvcnk6IDAsXHJcblx0XHRtaW5MZW5ndGg6IDEsXHJcblx0XHRtYXhMZW5ndGg6IDUxMixcclxuXHRcdGNvb2xkb3duOiA2MCxcclxuXHRcdGpvaW46IDEyMCxcclxuXHR9XHJcblxyXG5cdGNvbW1hbmRzID0ge1xyXG5cclxuXHRcdCdjbGVhcic6ICdjbGVhck91dHB1dCcsXHJcblx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKGVsZW1lbnQsIG9wdGlvbnMpIC0+XHJcblxyXG5cdFx0b3B0ID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKVxyXG5cclxuXHRcdEBtZXNzYWdlVXJsID0gb3B0Lm1lc3NhZ2VVcmxcclxuXHRcdEBwbGF5ZXJVcmwgPSBvcHQucGxheWVyVXJsXHJcblx0XHRAZW1vdGljb25zID0gbmV3IEVtb3RpY29ucygpXHJcblxyXG5cclxuXHJcblx0XHRAaW5wdXQgPSAkKGVsZW1lbnQpLmZpbmQoJy5pbnB1dCcpXHJcblx0XHRAb3V0cHV0ID0gJChlbGVtZW50KS5maW5kKCcub3V0cHV0JylcclxuXHRcdEBzZW5kQnRuID0gJChlbGVtZW50KS5maW5kKCcuc2VuZCcpXHJcblx0XHRAY2xlYXJCdG4gPSAkKGVsZW1lbnQpLmZpbmQoJy5jbGVhcicpXHJcblxyXG5cclxuXHJcblxyXG5cdFx0JChAc2VuZEJ0bikuY2xpY2soID0+XHJcblxyXG5cdFx0XHRAc2VuZCgpXHJcblx0XHRcdEBjbGVhcklucHV0KClcclxuXHRcdClcclxuXHJcblx0XHQkKEBjbGVhckJ0bikuY2xpY2soID0+XHJcblxyXG5cdFx0XHRAY2xlYXJPdXRwdXQoKVxyXG5cdFx0KVxyXG5cclxuXHRcdEBpbnRlcnZhbCA9IG9wdC5pbnRlcnZhbFxyXG5cclxuXHJcblx0XHRAam9pbiA9IG9wdC5qb2luXHJcblxyXG5cdFx0QGNvb2xkb3duID0gb3B0LmNvb2xkb3duXHJcblx0XHRAc2VudCA9IE1hdGgucm91bmQoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDEwMDApIC0gQGNvb2xkb3duXHJcblxyXG5cdFx0QHRvdWNoKClcclxuXHRcdEB0aW1lID0gTWF0aC5tYXgoQHRpbWUgLSBvcHQuaGlzdG9yeSwgMClcclxuXHJcblxyXG5cdFx0QHVwZGF0ZSgpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0Z2V0RXJyb3JUZXh0OiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHR0ZXh0ID0gaTE4bC5jaGF0LmVycm9yc1tuYW1lXSA/IGkxOGwuY2hhdC5lcnJvcnMudW5rbm93blxyXG5cclxuXHRcdGlmIGFyZ3M/IGFuZCB0eXBlb2YoYXJncykgPT0gJ29iamVjdCdcclxuXHJcblx0XHRcdGZvciBrLCB2IG9mIGFyZ3NcclxuXHRcdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCc6JyArIGssIHYpXHJcblxyXG5cdFx0dGV4dFxyXG5cclxuXHJcblxyXG5cdGVycm9yOiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHRhbGVydCA9ICQoJzxkaXY+PC9kaXY+JylcclxuXHRcdFx0LmFkZENsYXNzKCdhbGVydCcpXHJcblx0XHRcdC5hZGRDbGFzcygnYWxlcnQtZGFuZ2VyJylcclxuXHRcdFx0LnRleHQoQGdldEVycm9yVGV4dChuYW1lLCBhcmdzKSlcclxuXHJcblx0XHQkKEBvdXRwdXQpXHJcblx0XHRcdC5hcHBlbmQoYWxlcnQpXHJcblxyXG5cdGFsZXJ0OiAobmFtZSwgYXJncykgLT5cclxuXHJcblx0XHRhbGVydChAZ2V0RXJyb3JUZXh0KG5hbWUsIGFyZ3MpKVxyXG5cclxuXHJcblxyXG5cclxuXHR0b3VjaDogLT5cclxuXHRcdEB0aW1lID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHJcblxyXG5cdHNlbmQ6IC0+XHJcblxyXG5cdFx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMTAwMClcclxuXHRcdG1lc3NhZ2UgPSAkKEBpbnB1dCkudmFsKClcclxuXHJcblx0XHRtYXRjaGVzID0gbWVzc2FnZS5tYXRjaCgvXlxcLyhcXHcrKS9pKVxyXG5cclxuXHJcblxyXG5cdFx0aWYgbWF0Y2hlcz8gbWF0Y2hlc1sxXT9cclxuXHRcdFx0Y29tbWFuZCA9IG1hdGNoZXNbMV1cclxuXHJcblx0XHRcdGZvciBrLCB2IG9mIGNvbW1hbmRzXHJcblxyXG5cdFx0XHRcdGlmIGNvbW1hbmQudG9Mb3dlckNhc2UoKSA9PSBrLnRvTG93ZXJDYXNlKClcclxuXHJcblx0XHRcdFx0XHRmdW5jID0gdGhpc1t2XVxyXG5cclxuXHRcdFx0XHRcdGlmIHR5cGVvZihmdW5jKSA9PSAnZnVuY3Rpb24nXHJcblx0XHRcdFx0XHRcdGZ1bmMuY2FsbCh0aGlzKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdEBlcnJvcignY21kTm90Rm91bmQnLCB7J25hbWUnOiBjb21tYW5kfSlcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdGlmIG1lc3NhZ2UubGVuZ3RoIDwgQG1pbkxlbmd0aFxyXG5cdFx0XHRAYWxlcnQoJ3Rvb1Nob3J0JywgeydtaW4nOiBAbWluTGVuZ3RofSlcclxuXHRcdFx0cmV0dXJuIFxyXG5cclxuXHRcdGlmIG1lc3NhZ2UubGVuZ3RoID4gQG1heExlbmd0aFxyXG5cdFx0XHRhbGVydCgndG9vTG9uZycsIHsnbWF4JzogQG1heExlbmd0aH0pXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIEBzZW50ICsgQGNvb2xkb3duID4gbm93XHJcblx0XHRcdEBhbGVydCgnY29vbGRvd24nKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cclxuXHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHR1cmw6IEBtZXNzYWdlVXJsLFxyXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4gQG9uU2VudChkYXRhKSxcclxuXHRcdFx0ZGF0YToge21lc3NhZ2U6ICQoQGlucHV0KS52YWwoKX0sXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHR9KVxyXG5cclxuXHRcdEBzZW50ID0gbm93XHJcblx0XHQkKEBzZW5kQnRuKS5kYXRhKCd0aW1lJywgQHNlbnQgKyBAY29vbGRvd24pXHJcblxyXG5cclxuXHRyZWNlaXZlOiAtPlxyXG5cclxuXHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHR1cmw6IEBtZXNzYWdlVXJsLFxyXG5cdFx0XHRkYXRhOiB7dGltZTogQHRpbWV9LFxyXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgPT4gQG9uUmVjZWl2ZWQoZGF0YSksXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHR9KVxyXG5cclxuXHRcdEB0b3VjaCgpXHJcblxyXG5cclxuXHJcblx0Y2xlYXJPdXRwdXQ6IC0+XHJcblxyXG5cdFx0JChAb3V0cHV0KS5lbXB0eSgpXHJcblxyXG5cclxuXHRjbGVhcklucHV0OiAtPlxyXG5cclxuXHRcdCQoQGlucHV0KS52YWwoJycpXHJcblxyXG5cclxuXHJcblx0Z2V0TWVzc2FnZTogKGRhdGEpIC0+XHJcblx0XHQkKCc8cD48L3A+JylcclxuXHRcdFx0Lmh0bWwoQGVtb3RpY29ucy5pbnNlcnQoZGF0YS5tZXNzYWdlKSlcclxuXHRcdFx0LmFwcGVuZChcclxuXHJcblx0XHRcdFx0JCgnPHNtYWxsPjwvc21hbGw+JylcclxuXHRcdFx0XHRcdC5hZGRDbGFzcygnY2hhdC10aW1lJylcclxuXHRcdFx0XHRcdC5kYXRhKCd0aW1lJywgZGF0YS50aW1lKVxyXG5cdFx0XHQpXHJcblxyXG5cclxuXHJcblx0bmV3TWVzc2FnZTogKGRhdGEpIC0+XHJcblxyXG5cdFx0cm93ID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ3JvdycpXHJcblx0XHRcdC5hZGRDbGFzcygnY2hhdC1tZXNzYWdlJylcclxuXHRcdFx0LmRhdGEoJ3RpbWUnLCBkYXRhLnRpbWUpXHJcblx0XHRcdC5kYXRhKCdhdXRob3InLCBkYXRhLmF1dGhvcilcclxuXHJcblx0XHRjb2wxID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NvbC14cy0xJylcclxuXHJcblx0XHRjb2wyID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NvbC14cy0xMScpXHJcblxyXG5cdFx0aWYgQHBsYXllclVybD9cclxuXHJcblx0XHRcdGRpdjEgPSAkKCc8YT48L2E+JylcclxuXHRcdFx0XHQuYXR0cignaHJlZicsIEBnZXRQbGF5ZXJVcmwoZGF0YS5hdXRob3IpKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygnY2hhdC1hdXRob3InKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHJcblx0XHRcdGRpdjEgPSAkKCc8ZGl2PjwvZGl2PicpXHJcblx0XHRcdFx0LmFkZENsYXNzKCdjaGF0LWF1dGhvcicpXHJcblxyXG5cclxuXHJcblx0XHRkaXYyID0gJCgnPGRpdj48L2Rpdj4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtY29udGVudCcpXHJcblxyXG5cclxuXHJcblxyXG5cdFx0YXZhdGFyID0gJCgnPGltZz48L2ltZz4nKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ2ltZy1yZXNwb25zaXZlJylcclxuXHRcdFx0LmFkZENsYXNzKCdjaGF0LWF2YXRhcicpXHJcblx0XHRcdC5hdHRyKCdzcmMnLCBkYXRhLmF2YXRhcilcclxuXHJcblxyXG5cdFx0YXV0aG9yID0gJCgnPHA+PC9wPicpLmFwcGVuZChcclxuXHJcblx0XHRcdCQoJzxzdHJvbmc+PC9zdHJvbmc+JylcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ2NoYXQtbmFtZScpXHJcblx0XHRcdFx0LnRleHQoZGF0YS5hdXRob3IpLFxyXG5cdFx0KVxyXG5cclxuXHRcdG1lc3NhZ2UgPSBAZ2V0TWVzc2FnZShkYXRhKVxyXG5cclxuXHJcblxyXG5cdFx0JChkaXYxKS5hcHBlbmQoYXZhdGFyKS5hcHBlbmQoYXV0aG9yKVxyXG5cdFx0JChkaXYyKS5hcHBlbmQobWVzc2FnZSlcclxuXHRcdCQoY29sMSkuYXBwZW5kKGRpdjEpXHJcblx0XHQkKGNvbDIpLmFwcGVuZChkaXYyKVxyXG5cdFx0JChyb3cpLmFwcGVuZChjb2wxKS5hcHBlbmQoY29sMilcclxuXHRcdCQoQG91dHB1dCkuYXBwZW5kKHJvdylcclxuXHJcblxyXG5cdG1vZGlmeU1lc3NhZ2U6IChtZXNzYWdlLCBkYXRhKSAtPlxyXG5cclxuXHRcdCQobWVzc2FnZSkuZmluZCgnLmNoYXQtY29udGVudCcpLmFwcGVuZChcclxuXHJcblx0XHRcdEBnZXRNZXNzYWdlKGRhdGEpXHJcblx0XHQpXHJcblxyXG5cclxuXHJcblx0YWRkTWVzc2FnZTogKGRhdGEpLT5cclxuXHJcblx0XHRtZXNzYWdlID0gJChAb3V0cHV0KS5maW5kKCcuY2hhdC1tZXNzYWdlJykubGFzdCgpXHJcblxyXG5cdFx0aWYgbWVzc2FnZS5sZW5ndGggPT0gMFxyXG5cdFx0XHRcclxuXHRcdFx0QG5ld01lc3NhZ2UoZGF0YSlcclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdHRpbWUgPSAkKG1lc3NhZ2UpLmRhdGEoJ3RpbWUnKVxyXG5cdFx0XHRhdXRob3IgPSAkKG1lc3NhZ2UpLmRhdGEoJ2F1dGhvcicpXHJcblxyXG5cdFx0XHRpZiBhdXRob3IgPT0gZGF0YS5hdXRob3IgYW5kIChkYXRhLnRpbWUgLSB0aW1lKSA8PSBAam9pblxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdEBtb2RpZnlNZXNzYWdlKG1lc3NhZ2UsIGRhdGEpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0QG5ld01lc3NhZ2UoZGF0YSlcclxuXHJcblxyXG5cdFx0bWVzc2FnZSA9ICQoQG91dHB1dCkuZmluZCgnLmNoYXQtbWVzc2FnZScpLmxhc3QoKVxyXG5cclxuXHRcdG1lc3NhZ2Uuc2Nyb2xsVG9wKG1lc3NhZ2VbMF0uc2Nyb2xsSGVpZ2h0IC0gbWVzc2FnZS5oZWlnaHQoKSlcclxuXHJcblxyXG5cclxuXHJcblx0b25TZW50OiAoZGF0YSkgLT5cclxuXHJcblx0XHRAZXJyb3IoZGF0YS5yZWFzb24sIGRhdGEuYXJncykgaWYgZGF0YS5zdGF0dXMgPT0gJ2Vycm9yJ1xyXG5cclxuXHJcblx0b25SZWNlaXZlZDogKGRhdGEpIC0+XHJcblxyXG5cdFx0Zm9yIG1lc3NhZ2UgaW4gZGF0YVxyXG5cdFx0XHRAYWRkTWVzc2FnZShtZXNzYWdlKVxyXG5cclxuXHR1cGRhdGU6IC0+XHJcblxyXG5cdFx0Y2FsbGJhY2sgPSAoKSA9PlxyXG5cdFx0XHRAdXBkYXRlKClcclxuXHJcblx0XHRAcmVjZWl2ZSgpXHJcblx0XHRzZXRUaW1lb3V0KGNhbGxiYWNrLCBAaW50ZXJ2YWwgKiAxMDAwKVxyXG5cclxuXHJcblx0Z2V0UGxheWVyVXJsOiAobmFtZSkgLT5cclxuXHJcblx0XHRyZXR1cm4gQHBsYXllclVybC5yZXBsYWNlKCd7bmFtZX0nLCBuYW1lKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQoLT5cclxuXHJcblx0dXBkYXRlID0gKCkgLT5cclxuXHJcblx0XHRub3cgPSBNYXRoLnJvdW5kKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cclxuXHRcdCQoJy5jaGF0IC5jaGF0LXRpbWUnKS5lYWNoKC0+XHJcblxyXG5cdFx0XHR0aW1lID0gcGFyc2VJbnQoJCh0aGlzKS5kYXRhKCd0aW1lJykpXHJcblx0XHRcdGludGVydmFsID0gbm93IC0gdGltZVxyXG5cclxuXHJcblx0XHRcdGlmIGludGVydmFsIDwgNjBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQkKHRoaXMpLnRleHQoJ2ZldyBzZWNvbmRzIGFnbycpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0JCh0aGlzKS50ZXh0KHdpbmRvdy50aW1lRm9ybWF0U2hvcnQoaW50ZXJ2YWwpICsgJyBhZ28nKVxyXG5cdFx0KVxyXG5cclxuXHRcdCQoJy5jaGF0IC5zZW5kJykuZWFjaCgtPlxyXG5cclxuXHRcdFx0dGltZSA9IHBhcnNlSW50KCQodGhpcykuZGF0YSgndGltZScpKVxyXG5cdFx0XHR0ZXh0ID0gJCh0aGlzKS5kYXRhKCd0ZXh0JylcclxuXHRcdFx0aW50ZXJ2YWwgPSB0aW1lIC0gbm93XHJcblxyXG5cdFx0XHRpZiBpbnRlcnZhbCA+IDBcclxuXHJcblx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0LnRleHQod2luZG93LnRpbWVGb3JtYXQoaW50ZXJ2YWwpKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdkaXNhYmxlZCcpXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0LnRleHQodGV4dClcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxyXG5cclxuXHRcdClcclxuXHJcblxyXG5cdFx0c2V0VGltZW91dCh1cGRhdGUsIDEwMDApXHJcblxyXG5cdHVwZGF0ZSgpXHJcbikiLCJcclxuXHJcbnVwZGF0ZSA9ICgpIC0+XHJcblxyXG5cdGRhdGUgPSBuZXcgRGF0ZSgpXHJcblx0bm93ID0gTWF0aC5yb3VuZChkYXRlLmdldFRpbWUoKSAvIDEwMDApXHJcblx0JCgnLmN1cnJlbnQtdGltZScpLnRleHQoZGF0ZS50b1VUQ1N0cmluZygpKVxyXG5cclxuXHQkKCcudGltZS1sZWZ0JykuZWFjaCgtPlxyXG5cclxuXHRcdHRvID0gJCh0aGlzKS5kYXRhKCd0bycpXHJcblx0XHQkKHRoaXMpLnRleHQod2luZG93LnRpbWVGb3JtYXQoTWF0aC5tYXgodG8gLSBub3csIDApKSlcclxuXHQpXHJcblxyXG5cclxuXHRzZXRUaW1lb3V0KHVwZGF0ZSwgMTAwMClcclxuXHJcblxyXG5cclxuJCAtPlxyXG5cdHVwZGF0ZSgpIiwiXHJcblxyXG5kaWFsb2dzID0gW11cclxuXHJcblxyXG5zaG93ID0gKGRpYWxvZykgLT5cclxuXHJcblx0ZGlzbWlzc2libGUgPSAoJChkaWFsb2cpLmRhdGEoJ2Rpc21pc3NpYmxlJykpID8gdHJ1ZVxyXG5cdGNvbnNvbGUubG9nKGRpc21pc3NpYmxlKVxyXG5cclxuXHJcblx0aWYgZGlzbWlzc2libGVcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiB0cnVlLCBzaG93OiB0cnVlLCBrZXlib2FyZDogdHJ1ZX0pXHJcblxyXG5cdGVsc2VcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywgc2hvdzogdHJ1ZSwga2V5Ym9hcmQ6IGZhbHNlfSlcclxuXHJcblxyXG4kIC0+XHJcblx0ZGlhbG9ncyA9ICQoJy5tb2RhbC5hdXRvc2hvdycpXHJcblxyXG5cclxuXHQkKGRpYWxvZ3MpLmVhY2goKGluZGV4KSAtPlxyXG5cclxuXHRcdGlmIGluZGV4ID09IDBcclxuXHRcdFx0c2hvdyh0aGlzKVxyXG5cclxuXHRcdGlmIGluZGV4IDwgKGRpYWxvZ3MubGVuZ3RoIC0gMSlcclxuXHRcdFx0JCh0aGlzKS5vbignaGlkZGVuLmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cclxuXHRcdFx0XHRzaG93KGRpYWxvZ3NbaW5kZXggKyAxXSlcclxuXHRcdFx0KVxyXG5cdCkiLCJcclxuXHJcblxyXG5jbGFzcyBARW1vdGljb25zXHJcblxyXG5cdGRlZmF1bHRzID0ge1xyXG5cclxuXHRcdGVtb3RpY29uczoge1xyXG5cclxuXHRcdFx0JzspJzogJ2JsaW5rLnBuZycsXHJcblx0XHRcdCc6RCc6ICdncmluLnBuZycsXHJcblx0XHRcdCc6KCc6ICdzYWQucG5nJyxcclxuXHRcdFx0JzopJzogJ3NtaWxlLnBuZycsXHJcblx0XHRcdCdCKSc6ICdzdW5nbGFzc2VzLnBuZycsXHJcblx0XHRcdCdPLm8nOiAnc3VwcmlzZWQucG5nJyxcclxuXHRcdFx0JzpwJzogJ3Rvbmd1ZS5wbmcnLCBcclxuXHRcdH0sXHJcblxyXG5cdFx0dXJsOiAnL2ltYWdlcy9lbW90aWNvbnMve25hbWV9JyxcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Y29uc3RydWN0b3I6ICh1cmwsIGVtb3RpY29ucykgLT5cclxuXHJcblx0XHRAdXJsID0gdXJsID8gZGVmYXVsdHMudXJsXHJcblx0XHRAc2V0ID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLmVtb3RpY29ucywgZW1vdGljb25zID8ge30pXHJcblxyXG5cclxuXHRpbnNlcnQ6ICh0ZXh0KSAtPlxyXG5cclxuXHRcdGZvciBrLCB2IG9mIEBzZXRcclxuXHJcblx0XHRcdGxjID0gay50b0xvd2VyQ2FzZSgpXHJcblx0XHRcdHVjID0gay50b1VwcGVyQ2FzZSgpXHJcblx0XHRcdHVybCA9IEB1cmwucmVwbGFjZSgne25hbWV9JywgdilcclxuXHJcblx0XHRcdGVtb3RpY29uID0gJzxpbWcgY2xhc3M9XCJlbW90aWNvblwiIHNyYz1cIicgKyB1cmwgKyAnXCIgYWx0PVwiJyArIGsgKyAnXCIvPidcclxuXHJcblx0XHRcdGlmIGxjID09IHVjXHJcblxyXG5cdFx0XHRcdHRleHQgPSB0ZXh0XHJcblx0XHRcdFx0XHQucmVwbGFjZShsYywgZW1vdGljb24pXHJcblx0XHRcdGVsc2VcclxuXHJcblx0XHRcdFx0dGV4dCA9IHRleHRcclxuXHRcdFx0XHRcdC5yZXBsYWNlKGxjLCBlbW90aWNvbilcclxuXHRcdFx0XHRcdC5yZXBsYWNlKHVjLCBlbW90aWNvbilcclxuXHJcblx0XHR0ZXh0XHJcblxyXG5cclxuY291bnRlciA9IDBcclxuXHJcblxyXG4kKC0+XHJcblxyXG5cdGNvbnNvbGUubG9nKCdEb2N1bWVudCByZWFkeSAjJyArICgrK2NvdW50ZXIpKVxyXG5cclxuXHRlbW90aWNvbnMgPSBuZXcgRW1vdGljb25zKClcclxuXHJcblx0JCgnW2RhdGEtZW1vdGljb25zPXRydWVdJykuZWFjaCgtPlxyXG5cclxuXHRcdHRleHQgPSAkKHRoaXMpLnRleHQoKVxyXG5cdFx0dGV4dCA9IGVtb3RpY29ucy5pbnNlcnQodGV4dClcclxuXHRcdCQodGhpcykuaHRtbCh0ZXh0KVxyXG5cdClcclxuKSIsIndpZHRocyA9XHJcblx0eHM6IDc2OCxcclxuXHRzbTogOTkyLFxyXG5cdG1kOiAxMjAwLFxyXG5cclxuXHJcblxyXG5nZXRQcmVmaXggPSAtPlxyXG5cdHdpZHRoID0gJCh3aW5kb3cpLndpZHRoKClcclxuXHJcblx0aWYgd2lkdGggPCB3aWR0aHMueHNcclxuXHRcdFsneHMnXVxyXG5cdGVsc2UgaWYgd2lkdGggPCB3aWR0aHMuc21cclxuXHRcdFsnc20nLCAneHMnXVxyXG5cdGVsc2UgaWYgd2lkdGggPCB3aWR0aHMubWRcclxuXHRcdFsnbWQnLCAnc20nLCAneHMnXVxyXG5cdGVsc2VcclxuXHRcdFsnbGcnLCAnbWQnLCAnc20nLCAneHMnXVxyXG5cclxuXHJcbmdldENvbHVtbnMgPSAocHJlZml4KSAtPlxyXG5cdHJlc3VsdCA9IFtdXHJcblx0Zm9yIHAgaW4gcHJlZml4XHJcblx0XHRmb3IgaSBpbiBbMS4uMTJdXHJcblx0XHRcdHJlc3VsdC5wdXNoKFwiY29sLSN7cH0tI3tpfVwiKVxyXG5cdHJlc3VsdFxyXG5cclxuXHJcblxyXG5nZXRTaXplID0gKG9iamVjdCwgcHJlZml4KSAtPlxyXG5cdGZvciBwIGluIHByZWZpeFxyXG5cdFx0cmVnZXhwID0gbmV3IFJlZ0V4cChcImNvbC0je3B9LShcXFxcZCspXCIpXHJcblx0XHRzaXplID0gJChvYmplY3QpLmF0dHIoJ2NsYXNzJykubWF0Y2gocmVnZXhwKT9bMV1cclxuXHRcdHJldHVybiBwYXJzZUludChzaXplKSBpZiBzaXplP1xyXG5cdHJldHVybiBudWxsXHJcblxyXG5cclxuXHJcblxyXG5lcXVhbGl6ZSA9IC0+XHJcblx0cHJlZml4ID0gZ2V0UHJlZml4KClcclxuXHRjb2x1bW5zID0gZ2V0Q29sdW1ucyhwcmVmaXgpXHJcblx0c2VsZWN0b3IgPSAnLicgKyBjb2x1bW5zLmpvaW4oJywuJylcclxuXHRcclxuXHQjY29uc29sZS5sb2coJ3ByZWZpeDogJywgcHJlZml4KVxyXG5cdCNjb25zb2xlLmxvZygnY29sdW1uczogJywgY29sdW1ucylcclxuXHQjY29uc29sZS5sb2coJ3NlbGVjdG9yOiAnLCBzZWxlY3RvcilcclxuXHJcblxyXG5cdCQoJy5yb3cuZXF1YWxpemUnKS5lYWNoIC0+XHJcblx0XHQjY29uc29sZS5sb2coJ25ldyByb3cnKVxyXG5cdFx0aGVpZ2h0cyA9IFtdXHJcblx0XHRyb3cgPSAwXHJcblx0XHRzdW0gPSAwXHJcblxyXG5cdFx0JCh0aGlzKS5jaGlsZHJlbihzZWxlY3RvcikuZWFjaCAtPlxyXG5cdFx0XHRzaXplID0gZ2V0U2l6ZSh0aGlzLCBwcmVmaXgpXHJcblx0XHRcdHN1bSArPSBzaXplXHJcblxyXG5cdFx0XHQjY29uc29sZS5sb2coJ3NpemU6ICcsIHNpemUpXHJcblx0XHRcdCNjb25zb2xlLmxvZygnc3VtOiAnLCBzdW0pXHJcblxyXG5cdFx0XHRpZiBzdW0gPiAxMlxyXG5cdFx0XHRcdHN1bSAtPSAxMlxyXG5cdFx0XHRcdHJvdysrXHJcblx0XHRcdFx0I2NvbnNvbGUubG9nKCduZXh0IHJvdyAnLCByb3csIHNpemUpXHJcblxyXG5cdFx0XHRoZWlnaHRzW3Jvd10gPz0gMFxyXG5cdFx0XHRoZWlnaHRzW3Jvd10gPSBNYXRoLm1heChoZWlnaHRzW3Jvd10sICQodGhpcykuaGVpZ2h0KCkpXHJcblx0XHRcdCNjb25zb2xlLmxvZygnaGVpZ2h0ICcsIGhlaWdodHNbcm93XSlcclxuXHJcblx0XHRyb3cgPSAwXHJcblx0XHRzdW0gPSAwXHJcblx0XHRjb2wgPSBudWxsXHJcblxyXG5cdFx0JCh0aGlzKS5jaGlsZHJlbihzZWxlY3RvcikuZWFjaCAtPlxyXG5cdFx0XHRzdW0gKz0gZ2V0U2l6ZSh0aGlzLCBwcmVmaXgpXHJcblx0XHRcdGNvbCA/PSB0aGlzXHJcblxyXG5cdFx0XHRpZiBzdW0gPiAxMlxyXG5cdFx0XHRcdHN1bSAtPSAxMlxyXG5cdFx0XHRcdHJvdysrXHJcblx0XHRcdFx0Y29sID0gdGhpc1xyXG5cclxuXHRcdFx0JCh0aGlzKS5oZWlnaHQoaGVpZ2h0c1tyb3ddKVxyXG5cclxuXHRcdGhzID0gTWF0aC5yb3VuZCAoMTIgLSBzdW0pIC8gMlxyXG5cdFx0aWYgY29sPyBhbmQgaHMgPiAwXHJcblx0XHRcdHAgPSBwcmVmaXhbMF1cclxuXHJcblx0XHRcdGZvciBpIGluIFsxLi4xMl1cclxuXHRcdFx0XHQkKGNvbCkucmVtb3ZlQ2xhc3MoXCJjb2wtI3twfS1vZmZzZXQtI3tpfVwiKVxyXG5cdFx0XHQkKGNvbCkuYWRkQ2xhc3MoXCJjb2wtI3twfS1vZmZzZXQtI3toc31cIilcclxuXHJcbmFmdGVyTG9hZGVkID0gLT5cclxuXHQkKCdpbWcnKVxyXG5cdFx0Lm9uKCdsb2FkJywgZXF1YWxpemUpXHJcblxyXG5cclxuJCAtPlxyXG5cdCNhZnRlckxvYWRlZCgpXHJcblx0IyQod2luZG93KS5vbigncmVzaXplZCcsIGVxdWFsaXplKVxyXG5cdCNlcXVhbGl6ZSgpIiwic3BlZWQgPSAxXHJcblxyXG5cclxua2V5RG93biA9IChldmVudCkgLT5cclxuXHRzcGVlZCA9IDEwIGlmIGV2ZW50LndoaWNoID09IDE3XHJcblx0c3BlZWQgPSAxMDAgaWYgZXZlbnQud2hpY2ggPT0gMTZcclxuXHJcbmtleVVwID0gKGV2ZW50KSAtPlxyXG5cdHNwZWVkID0gMSBpZiBldmVudC53aGljaCA9PSAxNyBvciBldmVudC53aGljaCA9PSAxNlxyXG5cclxuXHJcbm1vdXNlV2hlZWwgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ21vdXNlV2hlZWwnKVxyXG5cdG1pbiA9IHBhcnNlSW50ICgkKHRoaXMpLmF0dHIoJ21pbicpID8gMClcclxuXHRtYXggPSBwYXJzZUludCAoJCh0aGlzKS5hdHRyKCdtYXgnKSA/IDEwMClcclxuXHRzdGVwID0gcGFyc2VJbnQgKCQodGhpcykuYXR0cignc3RlcCcpID8gMSlcclxuXHJcblx0Y2hhbmdlID0gZXZlbnQuZGVsdGFZICogc3RlcCAqIHNwZWVkXHJcblx0dmFsdWUgPSBwYXJzZUludCAkKHRoaXMpLnZhbCgpID8gMFxyXG5cdHZhbHVlID0gTWF0aC5jbGFtcCB2YWx1ZSArIGNoYW5nZSwgbWluLCBtYXhcclxuXHJcblx0JCh0aGlzKVxyXG5cdFx0LnZhbCB2YWx1ZVxyXG5cdFx0LnRyaWdnZXIgJ2NoYW5nZSdcclxuXHJcblx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxucmFuZ2VDaGFuZ2VkID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdyYW5nZUNoYW5nZWQnKVxyXG5cdG91dHB1dCA9ICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5yYW5nZS12YWx1ZScpXHJcblx0YmVmb3JlID0gKCQob3V0cHV0KS5kYXRhICdiZWZvcmUnKSA/ICcnXHJcblx0YWZ0ZXIgPSAoJChvdXRwdXQpLmRhdGEgJ2FmdGVyJykgPyAnJ1xyXG5cdHZhbHVlID0gJCh0aGlzKS52YWwoKSA/IDBcclxuXHJcblx0JChvdXRwdXQpLnRleHQgYmVmb3JlICsgdmFsdWUgKyBhZnRlclxyXG5cclxuXHJcbm51bWJlckRlY3JlYXNlID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdudW1iZXJEZWNyZWFzZScpXHJcblx0aW5wdXQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpXHJcblx0bWluID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21pbicpID8gMClcclxuXHRtYXggPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWF4JykgPyAxMDApXHJcblx0c3RlcCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdzdGVwJykgPyAxKVxyXG5cclxuXHR2YWx1ZSA9IHBhcnNlSW50ICgkKGlucHV0KS52YWwoKSA/IDApXHJcblx0dmFsdWUgPSBNYXRoLmNsYW1wKHZhbHVlIC0gc3BlZWQgKiBzdGVwLCBtaW4sIG1heClcclxuXHQkKGlucHV0KS52YWwodmFsdWUpLnRyaWdnZXIoJ2NoYW5nZScpXHJcblxyXG5cclxubnVtYmVySW5jcmVhc2UgPSAoZXZlbnQpIC0+XHJcblx0Y29uc29sZS5sb2coJ251bWJlckluY3JlYXNlJylcclxuXHRpbnB1dCA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0JylcclxuXHRtaW4gPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWluJykgPyAwKVxyXG5cdG1heCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtYXgnKSA/IDEwMClcclxuXHRzdGVwID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ3N0ZXAnKSA/IDEpXHJcblxyXG5cdHZhbHVlID0gcGFyc2VJbnQgKCQoaW5wdXQpLnZhbCgpID8gMClcclxuXHR2YWx1ZSA9IE1hdGguY2xhbXAodmFsdWUgKyBzcGVlZCAqIHN0ZXAsIG1pbiwgbWF4KVxyXG5cdCQoaW5wdXQpLnZhbCh2YWx1ZSkudHJpZ2dlcignY2hhbmdlJylcclxuXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCh3aW5kb3cpXHJcblx0XHQua2V5dXAga2V5VXBcclxuXHRcdC5rZXlkb3duIGtleURvd25cclxuXHJcblx0JCgnaW5wdXRbdHlwZT1udW1iZXJdLCBpbnB1dFt0eXBlPXJhbmdlXScpXHJcblx0XHQuYmluZCAnbW91c2V3aGVlbCcsIG1vdXNlV2hlZWxcclxuXHJcblx0JCgnaW5wdXRbdHlwZT1yYW5nZV0nKVxyXG5cdFx0LmNoYW5nZSByYW5nZUNoYW5nZWRcclxuXHRcdC5tb3VzZW1vdmUgcmFuZ2VDaGFuZ2VkXHJcblxyXG5cdCQoJy5udW1iZXItbWludXMnKS5jaGlsZHJlbignYnV0dG9uJylcclxuXHRcdC5jbGljayBudW1iZXJEZWNyZWFzZVxyXG5cclxuXHJcblx0JCgnLm51bWJlci1wbHVzJykuY2hpbGRyZW4oJ2J1dHRvbicpXHJcblx0XHQuY2xpY2sgbnVtYmVySW5jcmVhc2VcclxuXHJcbiIsImxhc3RUaW1lID0gMFxyXG52ZW5kb3JzID0gWyd3ZWJraXQnLCAnbW96J11cclxuXHJcbmlmIG5vdCB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICBmb3IgdmVuZG9yIGluIHZlbmRvcnNcclxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvciArICdSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3IgKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcblxyXG53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIG9yPSAoY2FsbGJhY2ssIGVsZW1lbnQpIC0+XHJcbiAgICBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpXHJcblxyXG4gICAgaWQgPSB3aW5kb3cuc2V0VGltZW91dCgtPlxyXG4gICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbClcclxuICAgICwgdGltZVRvQ2FsbClcclxuXHJcbiAgICBpZFxyXG5cclxud2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIG9yPSAoaWQpIC0+XHJcbiAgICBjbGVhclRpbWVvdXQoaWQpIiwiXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCgnLmltYWdlLXByZXZpZXcnKS5lYWNoIC0+XHJcblx0XHRwcmV2aWV3ID0gdGhpc1xyXG5cdFx0aWQgPSAkKHRoaXMpLmRhdGEoJ2ZvcicpXHJcblx0XHQkKCcjJyArIGlkKS5jaGFuZ2UoKGV2ZW50KSAtPiBcclxuXHRcdFx0XHJcblx0XHRcdHBhdGggPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGV2ZW50LnRhcmdldC5maWxlc1swXSlcclxuXHRcdFx0JChwcmV2aWV3KS5hdHRyICdzcmMnLCBwYXRoXHJcblx0XHQpLnRyaWdnZXIgJ2NoYW5nZSdcclxuIiwiXHJcblxyXG5zZXQgPSAobGFuZykgLT5cclxuXHR3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbGFuZy8nICsgbGFuZ1xyXG5cclxuXHJcblxyXG5cclxuXHJcbmJ1dHRvbiA9ICgpIC0+XHJcblx0c2V0KCQodGhpcykuZGF0YSgnbGFuZycpKVxyXG5cclxuXHJcbnNlbGVjdCA9ICgpIC0+XHJcblx0c2V0KCQodGhpcykudmFsKCkpXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHQkKCcubGFuZ3VhZ2Utc2VsZWN0JykuY2hhbmdlKHNlbGVjdClcclxuXHQkKCcubGFuZ3VhZ2UtYnV0dG9uJykuY2xpY2soYnV0dG9uKVxyXG4iLCJuYXZmaXggPSAtPlxyXG5cdGhlaWdodCA9ICQoJyNtYWluTmF2JykuaGVpZ2h0KCkgKyAxMFxyXG5cdCQoJ2JvZHknKS5jc3MoJ3BhZGRpbmctdG9wJywgaGVpZ2h0ICsgJ3B4JylcclxuXHJcblxyXG4kIC0+XHJcblx0JCh3aW5kb3cpLnJlc2l6ZSAtPiBuYXZmaXgoKVxyXG5cdG5hdmZpeCgpIiwiXHJcblxyXG5pbWFnZUZvckZyYW1lID0gKGZyYW1lKSAtPlxyXG5cdCcvaW1hZ2VzL3BsYW50cy9wbGFudC0nICsgZnJhbWUgKyAnLnBuZydcclxuXHJcbnJlZnJlc2hQbGFudCA9IChwbGFudCkgLT4gXHJcblx0bm93ID0gTWF0aC5yb3VuZCgobmV3IERhdGUpLmdldFRpbWUoKSAvIDEwMDApXHJcblx0c3RhcnQgPSBwYXJzZUludCAkKHBsYW50KS5kYXRhICdzdGFydCdcclxuXHRlbmQgPSBwYXJzZUludCAkKHBsYW50KS5kYXRhICdlbmQnXHJcblx0d2F0ZXJpbmcgPSBwYXJzZUludCAkKHBsYW50KS5kYXRhICd3YXRlcmluZydcclxuXHRub3cgPSBNYXRoLm1pbiBub3csIHdhdGVyaW5nXHJcblx0ZnJhbWUgPSBNYXRoLmZsb29yKDE3ICogTWF0aC5jbGFtcCgobm93IC0gc3RhcnQpIC8gKGVuZCAtIHN0YXJ0KSwgMCwgMSkpIFxyXG5cdCQocGxhbnQpLmF0dHIgJ3NyYycsIGltYWdlRm9yRnJhbWUgZnJhbWVcclxuXHJcblx0c2V0VGltZW91dCAoLT4gcmVmcmVzaFBsYW50IHBsYW50KSwgMTAwMCBpZiBmcmFtZSA8IDE3XHJcblxyXG4kIC0+XHJcblx0JCgnLnBsYW50YXRpb24tcGxhbnQnKS5lYWNoIC0+IHJlZnJlc2hQbGFudCB0aGlzXHJcblxyXG5cdCQoJyNzZWVkc01vZGFsJykub24gJ3Nob3cuYnMubW9kYWwnLCAoZXZlbnQpIC0+XHJcblx0XHRzbG90ID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KS5kYXRhICdzbG90J1xyXG5cdFx0JCh0aGlzKS5maW5kKCdpbnB1dFtuYW1lPXNsb3RdJykudmFsIHNsb3QiLCJ1cmwgPSAnL2FwaS9jaGFyYWN0ZXInO1xyXG5cclxuXHJcbnNldFByb2dyZXNzID0gKG9iamVjdCwgdmFsdWUsIG1pblZhbHVlLCBtYXhWYWx1ZSwgbGFzdFVwZGF0ZSwgbmV4dFVwZGF0ZSkgLT5cclxuXHJcblx0YmFyID0gJCgnLicgKyBvYmplY3QgKyAnLWJhcicpXHJcblx0dGltZXIgPSAkKCcuJyArIG9iamVjdCArICctdGltZXInKVxyXG5cclxuXHJcblx0aWYgYmFyLmxlbmd0aCA+IDBcclxuXHRcdGNoaWxkID0gJChiYXIpLmNoaWxkcmVuICcucHJvZ3Jlc3MtYmFyJ1xyXG5cclxuXHRcdCQoY2hpbGQpXHJcblx0XHRcdC5kYXRhICdtYXgnLCBtYXhWYWx1ZVxyXG5cdFx0XHQuZGF0YSAnbWluJywgbWluVmFsdWVcclxuXHRcdFx0LmRhdGEgJ25vdycsIHZhbHVlXHJcblx0XHRiYXJbMF0udXBkYXRlPygpXHJcblxyXG5cclxuXHRpZiB0aW1lci5sZW5ndGggPiAwXHJcblx0XHRjaGlsZCA9ICQodGltZXIpLmNoaWxkcmVuICcucHJvZ3Jlc3MtYmFyJ1xyXG5cclxuXHRcdGlmIG5leHRVcGRhdGU/XHJcblx0XHRcdCQoY2hpbGQpXHJcblx0XHRcdFx0LmRhdGEgJ21heCcsIG5leHRVcGRhdGVcclxuXHRcdFx0XHQuZGF0YSAnbWluJywgbGFzdFVwZGF0ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQkKGNoaWxkKVxyXG5cdFx0XHRcdC5kYXRhICdtYXgnLCAxXHJcblx0XHRcdFx0LmRhdGEgJ21pbicsIDBcclxuXHJcblxyXG5zZXRWYWx1ZXMgPSAob2JqZWN0LCB2YWx1ZSwgbWluVmFsdWUsIG1heFZhbHVlKSAtPlxyXG5cdCQoJy4nICsgb2JqZWN0ICsgJy1ub3cnKVxyXG5cdFx0LnRleHQgdmFsdWVcclxuXHJcblx0JCgnLicgKyBvYmplY3QgKyAnLW1pbicpXHJcblx0XHQudGV4dCBtaW5WYWx1ZVxyXG5cclxuXHQkKCcuJyArIG9iamVjdCArICctbWF4JylcclxuXHRcdC50ZXh0IG1heFZhbHVlXHJcblxyXG5zZXRWYWx1ZSA9IChvYmplY3QsIHZhbHVlKSAtPlxyXG5cdCQoJy4nICsgb2JqZWN0KVxyXG5cdFx0LnRleHQgdmFsdWVcclxuXHJcblxyXG5cclxuXHJcbmZpbGwgPSAoZGF0YSkgLT5cclxuXHRzZXRQcm9ncmVzcyAnaGVhbHRoJywgZGF0YS5oZWFsdGgsIDAsIGRhdGEubWF4SGVhbHRoLCBkYXRhLmhlYWx0aFVwZGF0ZSwgZGF0YS5uZXh0SGVhbHRoVXBkYXRlXHJcblx0c2V0VmFsdWVzICdoZWFsdGgnLCBkYXRhLmhlYWx0aCwgMCwgZGF0YS5tYXhIZWFsdGhcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ2VuZXJneScsIGRhdGEuZW5lcmd5LCAwLCBkYXRhLm1heEVuZXJneSwgZGF0YS5lbmVyZ3lVcGRhdGUsIGRhdGEubmV4dEVuZXJneVVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnZW5lcmd5JywgZGF0YS5lbmVyZ3ksIDAsIGRhdGEubWF4RW5lcmd5XHJcblxyXG5cdHNldFByb2dyZXNzICd3YW50ZWQnLCBkYXRhLndhbnRlZCwgMCwgNiwgZGF0YS53YW50ZWRVcGRhdGUsIGRhdGEubmV4dFdhbnRlZFVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnd2FudGVkJywgZGF0YS53YW50ZWQsIDAsIDZcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ2V4cGVyaWVuY2UnLCBkYXRhLmV4cGVyaWVuY2UsIDAsIGRhdGEubWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnZXhwZXJpZW5jZScsIGRhdGEuZXhwZXJpZW5jZSwgMCwgZGF0YS5tYXhFeHBlcmllbmNlXHJcblxyXG5cclxuXHRzZXRQcm9ncmVzcyAncGxhbnRhdG9yJywgZGF0YS5wbGFudGF0b3JFeHBlcmllbmNlLCAwLCBkYXRhLnBsYW50YXRvck1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ3BsYW50YXRvcicsIGRhdGEucGxhbnRhdG9yRXhwZXJpZW5jZSwgMCwgZGF0YS5wbGFudGF0b3JNYXhFeHBlcmllbmNlXHJcblxyXG5cdHNldFByb2dyZXNzICdzbXVnZ2xlcicsIGRhdGEuc211Z2dsZXJFeHBlcmllbmNlLCAwLCBkYXRhLnNtdWdnbGVyTWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnc211Z2dsZXInLCBkYXRhLnNtdWdnbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5zbXVnZ2xlck1heEV4cGVyaWVuY2VcclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ2RlYWxlcicsIGRhdGEuZGVhbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5kZWFsZXJNYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdkZWFsZXInLCBkYXRhLmRlYWxlckV4cGVyaWVuY2UsIDAsIGRhdGEuZGVhbGVyTWF4RXhwZXJpZW5jZVxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0I3NldFZhbHVlICdsZXZlbCcsIGRhdGEubGV2ZWxcclxuXHQjc2V0VmFsdWUgJ3BsYW50YXRvci1sZXZlbCcsIGRhdGEucGxhbnRhdG9yTGV2ZWxcclxuXHQjc2V0VmFsdWUgJ3NtdWdnbGVyLWxldmVsJywgZGF0YS5zbXVnZ2xlckxldmVsXHJcblx0I3NldFZhbHVlICdkZWFsZXItbGV2ZWwnLCBkYXRhLmRlYWxlckxldmVsXHJcblx0I3NldFZhbHVlICdzdHJlbmd0aCcsIGRhdGEuc3RyZW5ndGgsXHJcblx0I3NldFZhbHVlICdwZXJjZXB0aW9uJywgZGF0YS5wZXJjZXB0aW9uXHJcblx0I3NldFZhbHVlICdlbmR1cmFuY2UnLCBkYXRhLmVuZHVyYW5jZVxyXG5cdCNzZXRWYWx1ZSAnY2hhcmlzbWEnLCBkYXRhLmNoYXJpc21hXHJcblx0I3NldFZhbHVlICdpbnRlbGxpZ2VuY2UnLCBkYXRhLmludGVsbGlnZW5jZVxyXG5cdCNzZXRWYWx1ZSAnYWdpbGl0eScsIGRhdGEuYWdpbGl0eVxyXG5cdCNzZXRWYWx1ZSAnbHVjaycsIGRhdGEubHVjayArICclJ1xyXG5cdCNzZXRWYWx1ZSAnc3RhdGlzdGljUG9pbnRzJywgZGF0YS5zdGF0aXN0aWNQb2ludHNcclxuXHQjc2V0VmFsdWUgJ3RhbGVudFBvaW50cycsIGRhdGEudGFsZW50UG9pbnRzXHJcblx0I3NldFZhbHVlICdtb25leScsICckJyArIGRhdGEubW9uZXlcclxuXHQjc2V0VmFsdWUgJ3JlcG9ydHMnLCBkYXRhLnJlcG9ydHNDb3VudFxyXG5cdCNzZXRWYWx1ZSAnbWVzc2FnZXMnLCBkYXRhLm1lc3NhZ2VzQ291bnRcclxuXHJcblx0c2NvcGUgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSkuc2NvcGUoKVxyXG5cclxuXHRpZiBzY29wZT8gYW5kIHNjb3BlLnBsYXllcj9cclxuXHRcdCNzY29wZS5wbGF5ZXIubGV2ZWwgPSBkYXRhLmxldmVsXHJcblx0XHQjc2NvcGUucGxheWVyLnBsYW50YXRvckxldmVsID0gZGF0YS5wbGFudGF0b3JMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5zbXVnZ2xlckxldmVsID0gZGF0YS5zbXVnZ2xlckxldmVsXHJcblx0XHQjc2NvcGUucGxheWVyLmRlYWxlckxldmVsID0gZGF0YS5kZWFsZXJMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5zdHJlbmd0aCA9IGRhdGEuc3RyZW5ndGhcclxuXHRcdCNzY29wZS5wbGF5ZXIucGVyY2VwdGlvbiA9IGRhdGEucGVyY2VwdGlvblxyXG5cdFx0I3Njb3BlLnBsYXllci5lbmR1cmFuY2UgPSBkYXRhLmVuZHVyYW5jZVxyXG5cdFx0I3Njb3BlLnBsYXllci5jaGFyaXNtYSA9IGRhdGEuY2hhcmlzbWFcclxuXHRcdCNzY29wZS5wbGF5ZXIuaW50ZWxsaWdlbmNlID0gZGF0YS5pbnRlbGxpZ2VuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuYWdpbGl0eSA9IGRhdGEuYWdpbGl0eVxyXG5cdFx0I3Njb3BlLnBsYXllci5sdWNrID0gZGF0YS5sdWNrXHJcblx0XHQjc2NvcGUucGxheWVyLnJlc3BlY3QgPSBkYXRhLnJlc3BlY3RcclxuXHRcdCNzY29wZS5wbGF5ZXIud2VpZ2h0ID0gZGF0YS53ZWlnaHRcclxuXHRcdCNzY29wZS5wbGF5ZXIuY2FwYWNpdHkgPSBkYXRhLmNhcGFjaXR5XHJcblx0XHQjc2NvcGUucGxheWVyLm1pbkRhbWFnZSA9IGRhdGEubWluRGFtYWdlXHJcblx0XHQjc2NvcGUucGxheWVyLm1heERhbWFnZSA9IGRhdGEubWF4RGFtYWdlXHJcblx0XHQjc2NvcGUucGxheWVyLmRlZmVuc2UgPSBkYXRhLmRlZmVuc2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuY3JpdENoYW5jZSA9IGRhdGEuY3JpdENoYW5jZVxyXG5cdFx0I3Njb3BlLnBsYXllci5zcGVlZCA9IGRhdGEuc3BlZWRcclxuXHRcdCNzY29wZS5wbGF5ZXIuZXhwZXJpZW5jZU1vZGlmaWVyID0gZGF0YS5leHBlcmllbmNlTW9kaWZpZXJcclxuXHRcdCNzY29wZS5wbGF5ZXIubW9uZXlNb2RpZmllciA9IGRhdGEubW9uZXlNb2RpZmllclxyXG5cclxuXHRcdGZvciBrLCB2IG9mIGRhdGFcclxuXHRcdFx0c2NvcGUucGxheWVyW2tdID0gdlxyXG5cclxuXHRcdHNjb3BlLiRhcHBseSgpXHJcblxyXG5cclxuXHJcblxyXG5sb2FkZWQgPSAoZGF0YSkgLT5cclxuXHJcblx0ZmlsbCBkYXRhXHJcblxyXG5cdGlmIGRhdGEucmVsb2FkXHJcblxyXG5cdFx0d2luZG93LmxvY2F0aW9uLnJlZnJlc2goKVxyXG5cdGVsc2VcclxuXHRcdGlmIHdpbmRvdy5hY3RpdmVcclxuXHRcdFx0JC5hamF4IHtcclxuXHJcblx0XHRcdFx0dXJsOiB1cmwgKyAnL25vdGlmaWNhdGlvbnMnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0XHRzdWNjZXNzOiBub3RpZnlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JC5hamF4IHtcclxuXHJcblx0XHRcdFx0dXJsOiB1cmwgKyAnL21lc3NhZ2VzJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdFx0c3VjY2VzczogbWVzc2FnZSxcclxuXHRcdFx0fVxyXG5cclxuXHRzZXRUaW1lb3V0IGxvYWQsIGRhdGEubmV4dFVwZGF0ZSAqIDEwMDBcclxuXHJcblxyXG5ub3RpZnkgPSAoZGF0YSkgLT5cclxuXHRmb3IgbiBpbiBkYXRhXHJcblx0XHR3aW5kb3cubm90aWZ5IHtcclxuXHJcblx0XHRcdHRpdGxlOiAnPHN0cm9uZz4nICsgbi50aXRsZSArICc8L3N0cm9uZz4nLFxyXG5cdFx0XHRtZXNzYWdlOiAnJyxcclxuXHRcdFx0dXJsOiAnL3JlcG9ydHMvJyArIG4uaWQsXHJcblxyXG5cdFx0fVxyXG5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHR3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5tZXNzYWdlID0gKGRhdGEpIC0+XHJcblx0Zm9yIG4gaW4gZGF0YVxyXG5cdFx0d2luZG93Lm5vdGlmeSB7XHJcblxyXG5cdFx0XHR0aXRsZTogJzxzdHJvbmc+JyArIG4uYXV0aG9yICsgJzwvc3Ryb25nPjogJyArIG4udGl0bGUgKyAnPGJyLz4nLFxyXG5cdFx0XHRtZXNzYWdlOiBuLmNvbnRlbnQsXHJcblx0XHRcdHVybDogJy9tZXNzYWdlcy9pbmJveC8nICsgbi5pZCxcclxuXHJcblx0XHR9XHJcblxyXG5cdGlmIHdpbmRvdy5hY3RpdmVcclxuXHRcdHdpbmRvdy5ub3RpZnlTaG93KClcclxuXHJcblxyXG5cclxubG9hZCA9IC0+XHJcblxyXG5cdCQuYWpheCB7XHJcblxyXG5cdFx0dXJsOiB1cmwsXHJcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdHN1Y2Nlc3M6IGxvYWRlZFxyXG5cdH1cclxuXHJcblxyXG5cclxuXHRcclxuJCh3aW5kb3cpLmZvY3VzIC0+XHJcblx0bG9hZCgpXHJcblxyXG5cclxuJCAtPlxyXG5cdGxvYWQoKSIsIlxyXG5zcXVhcmUgPSAtPlxyXG5cclxuXHQkKCcuc3F1YXJlJykuZWFjaCAtPlxyXG5cclxuXHRcdGlmICQodGhpcykuZGF0YSgnc3F1YXJlJykgPT0gJ3dpZHRoJ1xyXG5cclxuXHRcdFx0JCh0aGlzKS53aWR0aCAkKHRoaXMpLmhlaWdodCgpXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHQkKHRoaXMpLmhlaWdodCAkKHRoaXMpLndpZHRoKClcclxuXHJcbiQgLT5cclxuXHQkKHdpbmRvdykucmVzaXplIC0+IFxyXG5cdFx0c3F1YXJlKClcclxuXHRcdFxyXG5cdHNxdWFyZSgpIiwiXHJcbmNoYW5nZWQgPSAtPiBcclxuXHRjdXJyZW50ID0gcGFyc2VJbnQgKCQoJyNjdXJyZW50U3RhdGlzdGljc1BvaW50cycpLnRleHQoKSA/IDApXHJcblx0bGVmdCA9IHBhcnNlSW50ICQoJyNzdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpXHJcblx0b2xkID0gcGFyc2VJbnQgKCQodGhpcykuZGF0YSgnb2xkJykgPyAwKVxyXG5cdHZhbCA9IHBhcnNlSW50ICgkKHRoaXMpLnZhbCgpID8gMClcclxuXHRkaWZmID0gdmFsIC0gb2xkXHJcblxyXG5cdGRpZmYgPSBsZWZ0IGlmIGRpZmYgPiBsZWZ0XHJcblx0dmFsID0gb2xkICsgZGlmZlxyXG5cdGxlZnQgLT0gZGlmZlxyXG5cclxuXHRpZiBub3QgaXNOYU4gZGlmZlxyXG5cclxuXHRcdCQodGhpcylcclxuXHRcdFx0LnZhbCB2YWxcclxuXHRcdFx0LmRhdGEgJ29sZCcsIHZhbFxyXG5cclxuXHRcdCQoJyNzdGF0aXN0aWNzUG9pbnRzJylcclxuXHRcdFx0LnRleHQgbGVmdFxyXG5cclxuXHRcdCQoJy5zdGF0aXN0aWMnKS5lYWNoIC0+XHJcblx0XHRcdHZhbCA9IHBhcnNlSW50ICQodGhpcykudmFsKCkgPyAwXHJcblx0XHRcdCQodGhpcykuYXR0ciAnbWF4JywgbGVmdCArIHZhbFxyXG5cclxuXHJcbnJhbmRvbSA9IChtaW4sIG1heCkgLT4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW4pXHJcblxyXG5yYW5kb21JbiA9IChhcnJheSkgLT5cclxuXHRpbmRleCA9IHJhbmRvbSgwLCBhcnJheS5sZW5ndGggLSAxKVxyXG5cdGFycmF5W2luZGV4XVxyXG5cclxuXHJcblxyXG5cclxuXHJcbnJvbGwgPSAtPlxyXG5cclxuXHRyb2xsYWJsZSA9ICQoJy5zdGF0aXN0aWMucm9sbGFibGUnKVxyXG5cdCQocm9sbGFibGUpLnZhbCgwKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cdHBvaW50cyA9IHBhcnNlSW50ICQoJyNzdGF0aXN0aWNzUG9pbnRzJykudGV4dCgpXHJcblxyXG5cclxuXHRmb3IgaSBpbiBbMS4ucG9pbnRzXVxyXG5cclxuXHRcdHN0YXRpc3RpYyA9IHJhbmRvbUluKHJvbGxhYmxlKVxyXG5cdFx0dmFsID0gcGFyc2VJbnQgJChzdGF0aXN0aWMpLnZhbCgpXHJcblx0XHQkKHN0YXRpc3RpYykudmFsKHZhbCArIDEpXHJcblxyXG5cclxuXHQkKHJvbGxhYmxlKS50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQgLT4gXHJcblx0JCgnLnN0YXRpc3RpYycpXHJcblx0XHQuYmluZCAna2V5dXAgaW5wdXQgY2hhbmdlJywgY2hhbmdlZFxyXG5cdFx0LnRyaWdnZXIgJ2NoYW5nZSdcclxuXHJcblx0JCgnLnN0YXRSb2xsZXInKVxyXG5cdFx0LmNsaWNrKHJvbGwpXHJcblxyXG5cdHJvbGwoKVxyXG4iLCJcclxucmVmcmVzaGluZyA9IGZhbHNlXHJcblxyXG5yZWZyZXNoID0gLT5cclxuXHR3aW5kb3cubG9jYXRpb24ucmVmcmVzaCgpIGlmIG5vdCByZWZyZXNoaW5nXHJcblx0cmVmcmVzaGluZyA9IHRydWVcclxuXHJcbnVwZGF0ZSA9ICh0aW1lcikgLT5cclxuXHRiYXIgPSAkKHRpbWVyKS5jaGlsZHJlbignLnByb2dyZXNzLWJhcicpLmxhc3QoKVxyXG5cdGxhYmVsID0gJCh0aW1lcikuY2hpbGRyZW4gJy5wcm9ncmVzcy1sYWJlbCdcclxuXHR0aW1lID0gTWF0aC5yb3VuZCAobmV3IERhdGUpLmdldFRpbWUoKSAvIDEwMDAuMFxyXG5cclxuXHJcblx0bWluID0gJChiYXIpLmRhdGEgJ21pbidcclxuXHRtYXggPSAkKGJhcikuZGF0YSAnbWF4J1xyXG5cdHN0b3AgPSAkKGJhcikuZGF0YSAnc3RvcCdcclxuXHRjYSA9ICQoYmFyKS5kYXRhKCdjYScpXHJcblx0Y2IgPSAkKGJhcikuZGF0YSgnY2InKVxyXG5cclxuXHJcblxyXG5cdHJldmVyc2VkID0gQm9vbGVhbigkKGJhcikuZGF0YSgncmV2ZXJzZWQnKSA/IGZhbHNlKVxyXG5cdHJlbG9hZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JlbG9hZCcpID8gdHJ1ZSlcclxuXHJcblx0aWYgc3RvcD9cclxuXHRcdHRpbWUgPSBNYXRoLm1pbiB0aW1lLCBzdG9wXHJcblxyXG5cdG5vdyA9IE1hdGguY2xhbXAodGltZSwgbWluLCBtYXgpXHJcblxyXG5cclxuXHRwZXJjZW50ID0gKG5vdyAtIG1pbikgLyAobWF4IC0gbWluKVxyXG5cdHBlcmNlbnQgPSAxIC0gcGVyY2VudCBpZiByZXZlcnNlZFxyXG5cclxuXHJcblxyXG5cclxuXHQkKGJhcikuY3NzICd3aWR0aCcsIChwZXJjZW50ICogMTAwKSArICclJ1xyXG5cdCQoYmFyKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBNYXRoLmxlcnBDb2xvcnMocGVyY2VudCwgY2EsIGNiKSkgaWYgY2E/IGFuZCBjYj9cclxuXHQkKGxhYmVsKS50ZXh0IHdpbmRvdy50aW1lRm9ybWF0PyBtYXggLSBub3dcclxuXHJcblx0cmVmcmVzaCgpIGlmIHRpbWUgPiBtYXggYW5kIHJlbG9hZFxyXG5cclxuXHRzZXRUaW1lb3V0IC0+IHVwZGF0ZSB0aW1lciwgMTAwMCAjaWYgdGltZSA8PSBtYXhcclxuXHJcblxyXG4kIC0+XHJcblx0JCgnLnByb2dyZXNzLXRpbWUnKS5lYWNoIC0+XHJcblx0XHR1cGRhdGUgdGhpc1xyXG5cclxuXHJcblxyXG5cclxuIiwiJCAtPlxyXG5cdCQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5lYWNoKC0+XHJcblxyXG5cdFx0b3B0aW9ucyA9IHtcclxuXHJcblx0XHRcdGh0bWw6IHRydWUsXHJcblx0XHRcdHBsYWNlbWVudDogJ2F1dG8gbGVmdCdcclxuXHRcdH1cclxuXHJcblx0XHR0cmlnZ2VyID0gJCh0aGlzKS5kYXRhKCd0cmlnZ2VyJylcclxuXHJcblx0XHRpZiB0cmlnZ2VyP1xyXG5cdFx0XHRvcHRpb25zLnRyaWdnZXIgPSB0cmlnZ2VyXHJcblxyXG5cclxuXHRcdCQodGhpcykudG9vbHRpcChvcHRpb25zKVxyXG5cdCkiLCJcclxuJCAtPlxyXG5cclxuXHR0dXRvcmlhbHMgPSB7fVxyXG5cdCQoJy50dXRvcmlhbC1zdGVwJykucG9wb3Zlcih7dHJpZ2dlcjogJ21hbnVhbCcsIHBsYWNlbWVudDogJ2JvdHRvbSd9KVxyXG5cclxuXHRzaG93ID0gKHN0ZXApIC0+XHJcblxyXG5cdFx0aWYgc3RlcD9cclxuXHJcblx0XHRcdCQoc3RlcC5lbGVtZW50cylcclxuXHRcdFx0XHQuYmluZCgnY2xpY2snLCBjbGlja2VkKVxyXG5cdFx0XHRcdC5hZGRDbGFzcygndHV0b3JpYWwtYWN0aXZlJylcclxuXHRcdFx0XHQuZmlyc3QoKVxyXG5cdFx0XHRcdC5wb3BvdmVyKCdzaG93JylcclxuXHJcblxyXG5cdGNsaWNrZWQgPSAoKSAtPlxyXG5cclxuXHRcdG5leHQgPSB0dXRvcmlhbHNbdGhpcy5zdGVwLm5hbWVdLnNoaWZ0KClcclxuXHJcblx0XHRpZiBuZXh0P1xyXG5cclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0ZGF0YToge25hbWU6IHRoaXMuc3RlcC5uYW1lLCBzdGFnZTogbmV4dC5pbmRleH0sXHJcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdHNldFRpbWVvdXQoLT5cclxuXHJcblx0XHRcdFx0c2hvdyhuZXh0KVxyXG5cdFx0XHQsIDUwMClcclxuXHRcdGVsc2VcclxuXHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0ZGF0YToge25hbWU6IHRoaXMuc3RlcC5uYW1lLCBzdGFnZTogdGhpcy5zdGVwLmluZGV4ICsgMX0sXHJcblx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHRcclxuXHRcdFx0fSlcclxuXHRcdFxyXG5cclxuXHJcblxyXG5cdFx0JCh0aGlzLnN0ZXAuZWxlbWVudHMpLnVuYmluZCgnY2xpY2snLCBjbGlja2VkKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ3R1dG9yaWFsLWFjdGl2ZScpXHJcblx0XHRcdC5wb3BvdmVyKCdoaWRlJylcclxuXHJcblxyXG5cdHJlY2VpdmUgPSAob2JqZWN0LCBuYW1lLCBkYXRhKSAtPlxyXG5cclxuXHRcdGlmIGRhdGEuc3RhZ2UgPCAwXHJcblxyXG5cclxuXHRcdFx0bW9kYWwgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbCBmYWRlJylcclxuXHRcdFx0ZGlhbG9nID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtZGlhbG9nJylcclxuXHRcdFx0Y29udGVudCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWNvbnRlbnQnKVxyXG5cdFx0XHRoZWFkZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1oZWFkZXInKVxyXG5cdFx0XHRib2R5ID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtYm9keScpXHJcblx0XHRcdGZvb3RlciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWZvb3RlcicpXHJcblx0XHRcdHRpdGxlID0gJCgnPGg0PjwvaDQ+JykuYWRkQ2xhc3MoJ21vZGFsLXRpdGxlJylcclxuXHJcblx0XHRcdGdyb3VwID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnRuLWdyb3VwJylcclxuXHRcdFx0YnRuMSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2J0biBidG4tc3VjY2VzcycpLmF0dHIoJ3ZhbHVlJywgJ3llcycpLnRleHQoJ3llcycpXHJcblx0XHRcdGJ0bjIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdidG4gYnRuLWRhbmdlcicpLmF0dHIoJ3ZhbHVlJywgJ25vJykudGV4dCgnbm8nKVxyXG5cclxuXHRcdFx0JChidG4xKS5jbGljaygtPlxyXG5cclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7bmFtZTogbmFtZSwgYWN0aXZlOiAxfSxcclxuXHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0JChtb2RhbCkubW9kYWwoJ2hpZGUnKVxyXG5cclxuXHRcdFx0XHRsb2FkKG9iamVjdCwgbmFtZSwgZGF0YSlcclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0JChidG4yKS5jbGljaygtPlxyXG5cclxuXHRcdFx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRkYXRhOiB7bmFtZTogbmFtZSwgYWN0aXZlOiAwfSxcclxuXHRcdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0JChtb2RhbCkubW9kYWwoJ2hpZGUnKVxyXG5cclxuXHRcdFx0KVxyXG5cclxuXHRcdFx0JCh0aXRsZSlcclxuXHRcdFx0XHQudGV4dChkYXRhLnRpdGxlKVxyXG5cclxuXHRcdFx0JChib2R5KVxyXG5cdFx0XHRcdC50ZXh0KGRhdGEuZGVzY3JpcHRpb24pXHJcblxyXG5cdFx0XHQkKGhlYWRlcilcclxuXHRcdFx0XHQuYXBwZW5kKHRpdGxlKVxyXG5cclxuXHJcblx0XHRcdCQoZ3JvdXApXHJcblx0XHRcdFx0LmFwcGVuZChidG4yKVxyXG5cdFx0XHRcdC5hcHBlbmQoYnRuMSlcclxuXHJcblx0XHRcdCQoZm9vdGVyKVxyXG5cdFx0XHRcdC5hcHBlbmQoZ3JvdXApXHJcblxyXG5cclxuXHRcdFx0JChjb250ZW50KVxyXG5cdFx0XHRcdC5hcHBlbmQoaGVhZGVyKVxyXG5cdFx0XHRcdC5hcHBlbmQoYm9keSlcclxuXHRcdFx0XHQuYXBwZW5kKGZvb3RlcilcclxuXHJcblx0XHRcdCQoZGlhbG9nKVxyXG5cdFx0XHRcdC5hcHBlbmQoY29udGVudClcclxuXHJcblx0XHRcdCQobW9kYWwpXHJcblx0XHRcdFx0LmFwcGVuZChkaWFsb2cpXHJcblxyXG5cdFx0XHQkKCdib2R5JylcclxuXHRcdFx0XHQuYXBwZW5kKG1vZGFsKVxyXG5cclxuXHRcdFx0JChtb2RhbCkubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywgc2hvdzogdHJ1ZSwga2V5Ym9hcmQ6IGZhbHNlfSlcclxuXHJcblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsb2FkKG9iamVjdCwgbmFtZSwgZGF0YSlcclxuXHJcblxyXG5cclxuXHRsb2FkID0gKG9iamVjdCwgbmFtZSwgZGF0YSkgLT5cclxuXHJcblx0XHR0dXRvcmlhbCA9IFtdXHJcblxyXG5cdFx0JChvYmplY3QpLmZpbmQoJy50dXRvcmlhbC1zdGVwJykuZWFjaCgtPlxyXG5cclxuXHRcdFx0c3RlcCA9IG51bGxcclxuXHRcdFx0aW5kZXggPSAkKHRoaXMpLmRhdGEoJ3R1dG9yaWFsLWluZGV4JylcclxuXHJcblx0XHRcdHJldHVybiBpZiBpbmRleCA8IGRhdGEuc3RhZ2VcclxuXHJcblxyXG5cclxuXHRcdFx0aWYgdHV0b3JpYWxbaW5kZXhdP1xyXG5cdFx0XHRcdHN0ZXAgPSB0dXRvcmlhbFtpbmRleF1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHN0ZXAgPSB7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbWVudHM6IFtdLFxyXG5cdFx0XHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0XHRcdGluZGV4OiBpbmRleCxcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dHV0b3JpYWxbaW5kZXhdID0gc3RlcFxyXG5cclxuXHJcblx0XHRcdHN0ZXAuZWxlbWVudHMucHVzaCh0aGlzKVxyXG5cdFx0XHR0aGlzLnN0ZXAgPSBzdGVwXHJcblx0XHQpXHJcblxyXG5cdFx0dHV0b3JpYWwgPSB0dXRvcmlhbC5maWx0ZXIoKGVsZW1lbnQpIC0+XHJcblxyXG5cdFx0XHRpZiBlbGVtZW50P1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdClcclxuXHJcblxyXG5cclxuXHRcdHR1dG9yaWFsc1tuYW1lXSA9IHR1dG9yaWFsXHJcblx0XHRzaG93KHR1dG9yaWFsLnNoaWZ0KCkpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQkKCdbZGF0YS10dXRvcmlhbD10cnVlJykuZWFjaCgtPlxyXG5cclxuXHRcdG5hbWUgPSAkKHRoaXMpLmRhdGEoJ3R1dG9yaWFsLW5hbWUnKVxyXG5cclxuXHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdGRhdGE6IHtuYW1lOiBuYW1lfSxcclxuXHRcdFx0bWV0aG9kOiAnR0VUJyxcclxuXHRcdFx0c3VjY2VzczogKGRhdGEpID0+XHJcblx0XHRcdFx0cmVjZWl2ZSh0aGlzLCBuYW1lLCBkYXRhKSBpZiBkYXRhLmFjdGl2ZVxyXG5cdFx0fSlcclxuXHQpIiwid2luZG93LmZvcm1hdCBvcj0gXHJcblx0dGltZTpcclxuXHRcdGRheTogJ2QnXHJcblx0XHRob3VyOiAnaCdcclxuXHRcdG1pbnV0ZTogJ20nXHJcblx0XHRzZWNvbmQ6ICdzJ1xyXG5cclxuXHJcblxyXG5cclxud2luZG93LmFjdGl2ZSA/PSBmYWxzZVxyXG5cclxuXHJcblxyXG4kKHdpbmRvdykuZm9jdXMgLT5cclxuXHR3aW5kb3cuYWN0aXZlID0gdHJ1ZVxyXG5cclxuJCh3aW5kb3cpLmJsdXIgLT5cclxuXHR3aW5kb3cuYWN0aXZlID0gZmFsc2VcclxuXHJcbiQod2luZG93KS5yZXNpemUgLT5cclxuXHRjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUbykgaWYgdGhpcy5yZXNpemVUb1xyXG5cdHRoaXMucmVzaXplVG8gPSBzZXRUaW1lb3V0KC0+XHJcblx0XHQkKHRoaXMpLnRyaWdnZXIoJ3Jlc2l6ZWQnKVxyXG5cdCwgNTAwKVxyXG5cdFxyXG5cclxuXHJcblxyXG53aW5kb3cubHBhZCBvcj0gKHZhbHVlLCBwYWRkaW5nKSAtPlxyXG4gIHplcm9lcyA9IFwiMFwiXHJcbiAgemVyb2VzICs9IFwiMFwiIGZvciBpIGluIFsxLi5wYWRkaW5nXVxyXG5cclxuICAoemVyb2VzICsgdmFsdWUpLnNsaWNlKHBhZGRpbmcgKiAtMSlcclxuXHJcblxyXG50aW1lU2VwYXJhdGUgPSAodmFsdWUpIC0+XHJcblx0aWYgdmFsdWUubGVuZ3RoID4gMFxyXG5cdFx0dmFsdWUgKyAnICdcclxuXHRlbHNlXHJcblx0XHR2YWx1ZVxyXG5cclxudGltZUZvcm1hdCA9ICh0ZXh0LCB2YWx1ZSwgZm9ybWF0KSAtPlxyXG5cdHRleHQgPSB0aW1lU2VwYXJhdGUodGV4dClcclxuXHJcblx0aWYgdGV4dC5sZW5ndGggPiAwXHJcblx0XHR0ZXh0ICs9IHdpbmRvdy5scGFkIHZhbHVlLCAyXHJcblx0ZWxzZSBcclxuXHRcdHRleHQgKz0gdmFsdWVcclxuXHJcblx0dGV4dCArIGZvcm1hdFxyXG5cclxuXHJcbndpbmRvdy50aW1lRm9ybWF0IG9yPSAodmFsdWUpIC0+XHJcblx0XHJcblx0dGV4dCA9ICcnXHJcblx0ZGF0ZSA9IG5ldyBEYXRlKHZhbHVlICogMTAwMClcclxuXHRkID0gZGF0ZS5nZXRVVENEYXRlKCkgLSAxXHJcblx0aCA9IGRhdGUuZ2V0VVRDSG91cnMoKVxyXG5cdG0gPSBkYXRlLmdldFVUQ01pbnV0ZXMoKVxyXG5cdHMgPSBkYXRlLmdldFVUQ1NlY29uZHMoKVxyXG5cclxuXHJcblx0dGV4dCArPSBkICsgZm9ybWF0LnRpbWUuZGF5IGlmIGQgPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgaCwgZm9ybWF0LnRpbWUuaG91cikgaWYgaCA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBtLCBmb3JtYXQudGltZS5taW51dGUpIGlmIGggPiAwIG9yIG0gPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgcywgZm9ybWF0LnRpbWUuc2Vjb25kKSBpZiBoID4gMCBvciBtID4gMCBvciBzID4gMFxyXG5cclxuXHR0ZXh0XHJcblxyXG53aW5kb3cudGltZUZvcm1hdFNob3J0IG9yPSAodmFsdWUpIC0+XHJcblxyXG5cdHRleHQgPSAnJ1xyXG5cdGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSAqIDEwMDApXHJcblx0ZCA9IGRhdGUuZ2V0VVRDRGF0ZSgpIC0gMVxyXG5cdGggPSBkYXRlLmdldFVUQ0hvdXJzKClcclxuXHRtID0gZGF0ZS5nZXRVVENNaW51dGVzKClcclxuXHRzID0gZGF0ZS5nZXRVVENTZWNvbmRzKClcclxuXHJcblxyXG5cdHJldHVybiBkICsgZm9ybWF0LnRpbWUuZGF5IGlmIGQgPiAwXHJcblx0cmV0dXJuIHRpbWVGb3JtYXQodGV4dCwgaCwgZm9ybWF0LnRpbWUuaG91cikgaWYgaCA+IDBcclxuXHRyZXR1cm4gdGltZUZvcm1hdCh0ZXh0LCBtLCBmb3JtYXQudGltZS5taW51dGUpIGlmIG0gPiAwXHJcblx0cmV0dXJuIHRpbWVGb3JtYXQodGV4dCwgcywgZm9ybWF0LnRpbWUuc2Vjb25kKSBpZiBzID4gMFxyXG5cclxuXHJcblxyXG5cclxucmVmcmVzaGluZyA9IGZhbHNlXHJcblxyXG5cclxud2luZG93LmxvY2F0aW9uLnJlZnJlc2ggb3I9IC0+XHJcblx0aWYgbm90IHJlZnJlc2hpbmdcclxuXHRcdHJlZnJlc2hpbmcgPSB0cnVlXHJcblx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpXHJcblxyXG5cclxuXHJcblxyXG5ub3RpZmljYXRpb25zID0gW11cclxud2luZG93Lm5vdGlmeSBvcj0gKHByb3BzKS0+XHJcblx0bm90aWZpY2F0aW9ucy5wdXNoIHByb3BzXHJcblxyXG5cclxuY2xvbmUgPSAob2JqKSAtPlxyXG5cdHJldHVybiBvYmogIGlmIG9iaiBpcyBudWxsIG9yIHR5cGVvZiAob2JqKSBpc250IFwib2JqZWN0XCJcclxuXHR0ZW1wID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpXHJcblx0Zm9yIGtleSBvZiBvYmpcclxuXHRcdHRlbXBba2V5XSA9IGNsb25lKG9ialtrZXldKVxyXG5cdHRlbXBcclxuXHJcbnNob3dOb3RpZnkgPSAobiwgaSkgLT5cclxuXHRjb25zb2xlLmxvZygnUCcsIG4sIGkpO1xyXG5cdHNldFRpbWVvdXQgKC0+IFxyXG5cdFx0Y29uc29sZS5sb2coJ1MnLCBuLCBpKTtcclxuXHRcdCQubm90aWZ5KG4sIHtcclxuXHJcblx0XHRcdHBsYWNlbWVudDoge1xyXG5cclxuXHRcdFx0XHRmcm9tOiAnYm90dG9tJyxcclxuXHRcdFx0fSxcclxuXHRcdFx0bW91c2Vfb3ZlcjogJ3BhdXNlJyxcclxuXHJcblx0XHRcdH0pKSwgaSAqIDEwMDBcclxuXHRcclxuXHJcblxyXG5cclxud2luZG93Lm5vdGlmeVNob3cgb3I9IC0+XHJcblx0aWYgd2luZG93LmFjdGl2ZVxyXG5cclxuXHRcdGZvciBub3RpZmljYXRpb24sIGluZGV4IGluIG5vdGlmaWNhdGlvbnNcclxuXHRcdFx0c2hvd05vdGlmeSAkLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uKSwgaW5kZXhcclxuXHRcdG5vdGlmaWNhdGlvbnMgPSBbXVxyXG5cclxuXHJcblxyXG4kKHdpbmRvdykuZm9jdXMgLT4gd2luZG93Lm5vdGlmeVNob3coKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbk1hdGguY2xhbXAgb3I9ICh2YWx1ZSwgbWluLCBtYXgpIC0+XHJcblx0TWF0aC5tYXgoTWF0aC5taW4odmFsdWUsIG1heCksIG1pbilcclxuXHJcblxyXG5NYXRoLmxlcnAgb3I9IChpLCBhLCBiKSAtPlxyXG5cdChhICogaSkgKyAoYiAqICgxIC0gaSkpXHJcblxyXG5cclxuXHJcbk1hdGguaGV4VG9SZ2Igb3I9IChoZXgpIC0+IFxyXG4gICAgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxyXG4gICAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxyXG4gICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXHJcblxyXG4gICAgfSBpZiByZXN1bHQ7XHJcbiAgICBudWxsO1xyXG5cclxuTWF0aC5yZ2JUb0hleCBvcj0gKHIsIGcsIGIpIC0+XHJcbiAgICByZXR1cm4gXCIjXCIgKyAoKDEgPDwgMjQpICsgKHIgPDwgMTYpICsgKGcgPDwgOCkgKyBiKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcblxyXG5cclxuTWF0aC5sZXJwQ29sb3JzIG9yPSAoaSwgYSwgYikgLT5cclxuXHJcblx0Y2EgPSBNYXRoLmhleFRvUmdiIGFcclxuXHRjYiA9IE1hdGguaGV4VG9SZ2IgYlxyXG5cclxuXHRjYyA9IHtcclxuXHRcdHI6IE1hdGgucm91bmQoTWF0aC5sZXJwKGksIGNhLnIsIGNiLnIpKSxcclxuXHRcdGc6IE1hdGgucm91bmQoTWF0aC5sZXJwKGksIGNhLmcsIGNiLmcpKSxcclxuXHRcdGI6IE1hdGgucm91bmQoTWF0aC5sZXJwKGksIGNhLmIsIGNiLmIpKSxcclxuXHR9XHJcblxyXG5cdHJldHVybiBNYXRoLnJnYlRvSGV4KGNjLnIsIGNjLmcsIGNjLmIpXHJcblxyXG5cclxuXHJcblxyXG5cclxudXBkYXRlUHJvZ3Jlc3MgPSAtPlxyXG5cdGJhciA9ICQodGhpcykuY2hpbGRyZW4oJy5wcm9ncmVzcy1iYXInKVxyXG5cdGxhYmVsID0gJCh0aGlzKS5jaGlsZHJlbignLnByb2dyZXNzLWxhYmVsJylcclxuXHJcblx0bWluID0gJChiYXIpLmRhdGEoJ21pbicpXHJcblx0bWF4ID0gJChiYXIpLmRhdGEoJ21heCcpXHJcblx0Y2EgPSAkKGJhcikuZGF0YSgnY2EnKVxyXG5cdGNiID0gJChiYXIpLmRhdGEoJ2NiJylcclxuXHRub3cgPSBNYXRoLmNsYW1wKCQoYmFyKS5kYXRhKCdub3cnKSwgbWluLCBtYXgpXHJcblx0cmV2ZXJzZWQgPSBCb29sZWFuKCQoYmFyKS5kYXRhKCdyZXZlcnNlZCcpID8gZmFsc2UpXHJcblxyXG5cdHBlcmNlbnQgPSAobm93IC0gbWluKSAvIChtYXggLSBtaW4pICogMTAwXHJcblx0cGVyY2VudCA9IDEwMCAtIHBlcmNlbnQgaWYgcmV2ZXJzZWRcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdCQoYmFyKS5jc3MoJ3dpZHRoJywgcGVyY2VudCArICclJylcclxuXHQkKGJhcikuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgTWF0aC5sZXJwQ29sb3JzKHBlcmNlbnQgLyAxMDAsIGNhLCBjYikpIGlmIGNhPyBhbmQgY2I/XHJcblxyXG5cclxuXHJcblx0JChsYWJlbCkudGV4dChub3cgKyAnIC8gJyArIG1heClcclxuXHJcbiQgLT4gXHJcblx0JCgnLnByb2dyZXNzJykuZWFjaCAtPlxyXG5cdFx0dGhpcy51cGRhdGUgb3I9IHVwZGF0ZVByb2dyZXNzXHJcblxyXG5cclxuXHJcbnJlbE1vdXNlQ29vcmRzID0gYGZ1bmN0aW9uIChldmVudCl7XHJcbiAgICB2YXIgdG90YWxPZmZzZXRYID0gMDtcclxuICAgIHZhciB0b3RhbE9mZnNldFkgPSAwO1xyXG4gICAgdmFyIGNhbnZhc1ggPSAwO1xyXG4gICAgdmFyIGNhbnZhc1kgPSAwO1xyXG4gICAgdmFyIGN1cnJlbnRFbGVtZW50ID0gdGhpcztcclxuXHJcbiAgICBkb3tcclxuICAgICAgICB0b3RhbE9mZnNldFggKz0gY3VycmVudEVsZW1lbnQub2Zmc2V0TGVmdCAtIGN1cnJlbnRFbGVtZW50LnNjcm9sbExlZnQ7XHJcbiAgICAgICAgdG90YWxPZmZzZXRZICs9IGN1cnJlbnRFbGVtZW50Lm9mZnNldFRvcCAtIGN1cnJlbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgIH1cclxuICAgIHdoaWxlKGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQub2Zmc2V0UGFyZW50KVxyXG5cclxuICAgIGNhbnZhc1ggPSBldmVudC5wYWdlWCAtIHRvdGFsT2Zmc2V0WDtcclxuICAgIGNhbnZhc1kgPSBldmVudC5wYWdlWSAtIHRvdGFsT2Zmc2V0WTtcclxuXHJcbiAgICByZXR1cm4ge3g6Y2FudmFzWCwgeTpjYW52YXNZfVxyXG59YFxyXG5cclxuSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnJlbE1vdXNlQ29vcmRzID0gcmVsTW91c2VDb29yZHM7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9