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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF2YXRhci5jb2ZmZWUiLCJiYXR0bGUuY29mZmVlIiwiY2xvY2suY29mZmVlIiwiZGlhbG9nLmNvZmZlZSIsImVxdWFsaXplci5jb2ZmZWUiLCJmb3JtLmNvZmZlZSIsImllZml4LmNvZmZlZSIsImltYWdlUHJldmlldy5jb2ZmZWUiLCJsYW5ndWFnZS5jb2ZmZWUiLCJuYXZmaXguY29mZmVlIiwicGxhbnRhdGlvbi5jb2ZmZWUiLCJwbGF5ZXIuY29mZmVlIiwic3F1YXJlLmNvZmZlZSIsInN0YXRpc3RpY3MuY29mZmVlIiwidGltZXIuY29mZmVlIiwidG9vbHRpcC5jb2ZmZWUiLCJ0dXRvcmlhbC5jb2ZmZWUiLCJ1dGlscy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxTQUFBO0lBQ1QsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLFdBQWIsQ0FBeUIsUUFBekI7SUFDQSxDQUFBLENBQUUsU0FBRixDQUFZLENBQUMsR0FBYixDQUFpQixDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsSUFBUixDQUFhLFFBQWIsQ0FBakI7V0FDQSxDQUFBLENBQUUsSUFBRixDQUFPLENBQUMsUUFBUixDQUFpQixRQUFqQjtFQUhTOztFQU1WLENBQUEsQ0FBRSxTQUFBO1dBQ0QsQ0FBQSxDQUFFLFNBQUYsQ0FBWSxDQUFDLEtBQWIsQ0FBbUIsT0FBbkIsQ0FBMkIsQ0FBQyxLQUE1QixDQUFBLENBQW1DLENBQUMsT0FBcEMsQ0FBNEMsT0FBNUM7RUFEQyxDQUFGO0FBTkE7OztBQ0ZBO0FBQUEsTUFBQTs7RUFBQSxNQUFBLEdBQ0M7SUFBQSxRQUFBLEVBQVUsRUFBVjtJQUNBLFdBQUEsRUFBYSxFQURiO0lBRUEsWUFBQSxFQUFjLEVBRmQ7SUFHQSxNQUFBLEVBQVEsQ0FIUjs7O0VBT0s7SUFHUSxtQkFBQyxJQUFELEVBQU8sSUFBUDtBQUVaLFVBQUE7TUFBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQUE7TUFDWixL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S0FBbEM7SUFFWCxPQUFBLEdBQVUsQ0FBQyxHQUFBLEdBQU0sR0FBUCxDQUFBLEdBQWMsQ0FBQyxHQUFBLEdBQU0sR0FBUCxDQUFkLEdBQTRCO0lBQ3RDLElBQTJCLFFBQTNCO01BQUEsT0FBQSxHQUFVLEdBQUEsR0FBTSxRQUFoQjs7SUFNQSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsR0FBUCxDQUFXLE9BQVgsRUFBb0IsT0FBQSxHQUFVLEdBQTlCO0lBQ0EsSUFBMEUsWUFBQSxJQUFRLFlBQWxGO01BQUEsQ0FBQSxDQUFFLEdBQUYsQ0FBTSxDQUFDLEdBQVAsQ0FBVyxrQkFBWCxFQUErQixJQUFJLENBQUMsVUFBTCxDQUFnQixPQUFBLEdBQVUsR0FBMUIsRUFBK0IsRUFBL0IsRUFBbUMsRUFBbkMsQ0FBL0IsRUFBQTs7V0FJQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsSUFBVCxDQUFjLEdBQUEsR0FBTSxLQUFOLEdBQWMsR0FBNUI7RUF2QmdCOztFQXlCakIsQ0FBQSxDQUFFLFNBQUE7V0FDRCxDQUFBLENBQUUsV0FBRixDQUFjLENBQUMsSUFBZixDQUFvQixTQUFBO2FBQ25CLElBQUksQ0FBQyxXQUFMLElBQUksQ0FBQyxTQUFXO0lBREcsQ0FBcEI7RUFEQyxDQUFGOztFQU1BLGNBQUEsR0FBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQmpCLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxjQUE1QixHQUE2QztBQTNON0MiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5jbGlja2VkID0gLT5cclxuXHQkKCcuYXZhdGFyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcblx0JCgnI2F2YXRhcicpLnZhbCgkKHRoaXMpLmRhdGEoJ2F2YXRhcicpKVxyXG5cdCQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblxyXG5cclxuJCAtPlxyXG5cdCQoJy5hdmF0YXInKS5jbGljayhjbGlja2VkKS5maXJzdCgpLnRyaWdnZXIoJ2NsaWNrJykiLCJjb25maWcgPVxyXG5cdGZvbnRTaXplOiAzMFxyXG5cdGJhckZvbnRTaXplOiAyMFxyXG5cdG5hbWVGb250U2l6ZTogMzBcclxuXHRtYXJnaW46IDVcclxuXHJcblxyXG5cclxuY2xhc3MgQ2hhcmFjdGVyXHJcblxyXG5cclxuXHRjb25zdHJ1Y3RvcjogKHRlYW0sIGRhdGEpIC0+XHJcblxyXG5cdFx0aW1hZ2UgPSBuZXcgSW1hZ2UoKVxyXG5cdFx0aW1hZ2Uuc3JjID0gZGF0YS5hdmF0YXJcclxuXHRcdGltYWdlLm9ubG9hZCA9ID0+XHJcblx0XHRcdEBhdmF0YXIgPSBpbWFnZVxyXG5cclxuXHJcblxyXG5cdFx0QHRlYW0gPSB0ZWFtXHJcblx0XHRAbmFtZSA9IGRhdGEubmFtZVxyXG5cdFx0QGlkID0gZGF0YS5pZFxyXG5cdFx0QGxldmVsID0gZGF0YS5sZXZlbFxyXG5cdFx0QGhlYWx0aCA9IGRhdGEuaGVhbHRoXHJcblx0XHRAbWF4SGVhbHRoID0gZGF0YS5tYXhIZWFsdGhcclxuXHJcblxyXG5cdGRyYXc6IChjb250ZXh0LCBzaXplKSAtPlxyXG5cdFx0aWYgQHRlYW0gPT0gJ3JlZCdcclxuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDIxNywgODMsIDc5LCAxKSdcclxuXHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMC40KSdcclxuXHRcdGVsc2VcclxuXHRcdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDUxLCAxMjIsIDE4MywgMSknXHJcblx0XHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoNTEsIDEyMiwgMTgzLCAwLjQpJ1xyXG5cclxuXHRcdGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlUmVjdCgwLCAwLCBzaXplLCBzaXplKVxyXG5cclxuXHRcdGlmIEBhdmF0YXI/XHJcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKEBhdmF0YXIsIGNvbmZpZy5tYXJnaW4sIGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcubWFyZ2luICogMiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyKVxyXG5cclxuXHRcdHRleHQgPSBAbmFtZSArICcgKCcgKyBAbGV2ZWwgKyAnKSdcclxuXHJcblx0XHRjb250ZXh0LmZvbnQgPSBjb25maWcubmFtZUZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHRcdGNvbnRleHQubGluZVdpZHRoID0gMVxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcclxuXHRcdGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMDAwMCdcclxuXHRcdG1lYXN1cmUgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBjb25maWcubmFtZUZvbnRTaXplKVxyXG5cdFx0Y29udGV4dC5zdHJva2VUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBjb25maWcubmFtZUZvbnRTaXplKVxyXG5cclxuXHJcblx0XHRjb250ZXh0LmZvbnQgPSBjb25maWcuYmFyRm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cdFx0Y29udGV4dC5zdHJva2VTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNyknXHJcblx0XHRjb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKDAsIDAsIDAsIDAuNCknXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLm1hcmdpbiAqIDIsIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHRcdGNvbnRleHQuc3Ryb2tlUmVjdChjb25maWcubWFyZ2luLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC0gY29uZmlnLm1hcmdpbiwgc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyLCBjb25maWcuYmFyRm9udFNpemUpXHJcblxyXG5cdFx0Y29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgyMTcsIDgzLCA3OSwgMSknXHJcblx0XHRjb250ZXh0LmZpbGxSZWN0KGNvbmZpZy5tYXJnaW4sIHNpemUgLSBjb25maWcuYmFyRm9udFNpemUgLSBjb25maWcubWFyZ2luLCAoc2l6ZSAtIGNvbmZpZy5tYXJnaW4gKiAyKSAqIChAaGVhbHRoIC8gQG1heEhlYWx0aCksIGNvbmZpZy5iYXJGb250U2l6ZSlcclxuXHJcblx0XHR0ZXh0ID0gTWF0aC5yb3VuZChAaGVhbHRoKSArICcgLyAnICsgQG1heEhlYWx0aFxyXG5cdFx0bWVhc3VyZSA9IGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAwMDAnXHJcblx0XHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIChzaXplIC0gbWVhc3VyZS53aWR0aCkgLyAyLCBzaXplIC0gY29uZmlnLmJhckZvbnRTaXplIC8gMilcclxuXHJcblxyXG5cclxuXHJcblxyXG5jbGFzcyBCYXR0bGVcclxuXHJcblx0c3BlZWQ6IFxyXG5cdFx0dmlldzogMy4wXHJcblx0XHRpbmZvOiAzLjBcclxuXHRcdG5leHQ6IDMuMFxyXG5cclxuXHJcblxyXG5cclxuXHRjb25zdHJ1Y3Q6IC0+XHJcblxyXG5cclxuXHJcblx0bG9hZDogLT5cclxuXHJcblx0XHRpZiBiYXR0bGVMb2c/XHJcblx0XHRcdEBjYW52YXMgPSAkKCcjYmF0dGxlVmlldycpWzBdXHJcblx0XHRcdEBjb250ZXh0ID0gQGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcblx0XHRcdEBpbmRleCA9IDBcclxuXHRcdFx0QGNoYXJhY3RlcnMgPSBbXVxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHRcdFx0QG9mZnNldCA9IDBcclxuXHRcdFx0QHBhdXNlID0gZmFsc2VcclxuXHJcblx0XHRcdCQoQGNhbnZhcykuY2xpY2soKGV2ZW50KSA9PiBAY2xpY2soZXZlbnQpKVxyXG5cdFx0XHQkKGRvY3VtZW50KS5rZXlkb3duKChldmVudCkgPT4gQGtleShldmVudCkpXHJcblxyXG5cdFx0XHRmb3IgZGF0YSBpbiBiYXR0bGVMb2dbJ3RlYW1zJ11bJ3JlZCddXHJcblx0XHRcdFx0Y2hhcmFjdGVyID0gbmV3IENoYXJhY3RlcigncmVkJywgZGF0YSlcclxuXHRcdFx0XHRAY2hhcmFjdGVyc1tjaGFyYWN0ZXIuaWRdID0gY2hhcmFjdGVyXHJcblxyXG5cclxuXHRcdFx0Zm9yIGRhdGEgaW4gYmF0dGxlTG9nWyd0ZWFtcyddWydibHVlJ11cclxuXHRcdFx0XHRjaGFyYWN0ZXIgPSBuZXcgQ2hhcmFjdGVyKCdibHVlJywgZGF0YSlcclxuXHRcdFx0XHRAY2hhcmFjdGVyc1tjaGFyYWN0ZXIuaWRdID0gY2hhcmFjdGVyXHJcblxyXG5cdFx0XHRAY29udGV4dC5mb250ID0gY29uZmlnLmZvbnRTaXplICsgJ3B4IFJvYm90bydcclxuXHJcblxyXG5cdFx0XHRAYWN0aW9uID0gYmF0dGxlTG9nWydsb2cnXVtAaW5kZXhdXHJcblx0XHRcdEBhdHRhY2tlciA9IEBjaGFyYWN0ZXJzW0BhY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdEBkZWZlbmRlciA9IEBjaGFyYWN0ZXJzW0BhY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0XHR0cnVlXHJcblx0XHRlbHNlXHJcblx0XHRcdGZhbHNlXHJcblxyXG5cdGRyYXdDaGFyYWN0ZXJzOiAoYXR0YWNrZXIsIGRlZmVuZGVyKSAtPlxyXG5cclxuXHRcdHNpemUgPSBAY2FudmFzLmhlaWdodCAqIDAuNlxyXG5cdFx0aGFsZldpZHRoID0gQGNhbnZhcy53aWR0aCAvIDJcclxuXHJcblx0XHRAY29udGV4dC5zYXZlKClcclxuXHRcdEBjb250ZXh0LnRyYW5zbGF0ZSgoaGFsZldpZHRoIC0gc2l6ZSkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSBzaXplKSAvIDIpXHJcblx0XHRhdHRhY2tlci5kcmF3KEBjb250ZXh0LCBzaXplKVxyXG5cdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoKGhhbGZXaWR0aCAtIHNpemUpIC8gMiArIGhhbGZXaWR0aCwgKEBjYW52YXMuaGVpZ2h0IC0gc2l6ZSkgLyAyKVxyXG5cdFx0ZGVmZW5kZXIuZHJhdyhAY29udGV4dCwgc2l6ZSlcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0ZHJhd0luZm86ICh0ZXh0KSAtPlxyXG5cdFx0aGFsZldpZHRoID0gQGNhbnZhcy53aWR0aCAvIDJcclxuXHRcdGhhbGZIZWlnaHQgPSBAY2FudmFzLmhlaWdodCAvIDJcclxuXHRcdGJsb2NrU2l6ZSA9IEBjYW52YXMuaGVpZ2h0ICogMC42XHJcblxyXG5cdFx0c3RhclJhZGl1cyA9IDUwXHJcblx0XHRzdGFyV2lkdGggPSBzdGFyUmFkaXVzICogMlxyXG5cdFx0c3RhclggPSBoYWxmV2lkdGggKyAoYmxvY2tTaXplICsgc3RhclJhZGl1cykgLyAyXHJcblx0XHRzdGFyWSA9IGhhbGZIZWlnaHRcclxuXHRcdHN0YXJXID0gKGJsb2NrU2l6ZSAqIDAuNykgLyBzdGFyV2lkdGhcclxuXHRcdHN0YXJIID0gMS4yXHJcblx0XHRzdGFyUGlrZXMgPSAxM1xyXG5cclxuXHRcdEBjb250ZXh0LmZvbnQgPSBjb25maWcuZm9udFNpemUgKyAncHggUm9ib3RvJ1xyXG5cdFx0bWVhc3VyZSA9IEBjb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQpXHJcblx0XHR0ZXh0WCA9IHN0YXJYIC0gbWVhc3VyZS53aWR0aCAvIDJcclxuXHRcdHRleHRZID0gaGFsZkhlaWdodFxyXG5cclxuXHJcblxyXG5cdFx0QGNvbnRleHQuc2F2ZSgpXHJcblx0XHRAY29udGV4dC5saW5lV2lkdGggPSAyXHJcblx0XHRAY29udGV4dC50cmFuc2xhdGUoc3RhclgsIHN0YXJZKVxyXG5cdFx0QGNvbnRleHQuc2NhbGUoc3RhclcsIHN0YXJIKVxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyNGRkZGRkYnXHJcblx0XHRAY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0QGRyYXdTdGFyKHN0YXJQaWtlcywgc3RhclJhZGl1cyAqIDAuNiwgc3RhclJhZGl1cylcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQudHJhbnNsYXRlKHRleHRYLCB0ZXh0WSlcclxuXHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFRleHQodGV4dCwgMCwgMClcclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0ZHJhd1N0YXI6IChwaWtlcywgaW5uZXJSYWRpdXMsIG91dGVyUmFkaXVzKSAtPlxyXG5cdFx0cm90ID0gTWF0aC5QSSAvIDIgKiAzXHJcblx0XHRzdGVwID0gTWF0aC5QSSAvIHBpa2VzXHJcblxyXG5cdFx0QGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHRcdHggPSBNYXRoLmNvcyhyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdHkgPSBNYXRoLnNpbihyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdEBjb250ZXh0Lm1vdmVUbyh4LCB5KVxyXG5cdFx0cm90ICs9IHN0ZXBcclxuXHJcblx0XHRmb3IgaSBpbiBbMS4ucGlrZXNdXHJcblx0XHRcdHggPSBNYXRoLmNvcyhyb3QpICogaW5uZXJSYWRpdXNcclxuXHRcdFx0eSA9IE1hdGguc2luKHJvdCkgKiBpbm5lclJhZGl1c1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8oeCwgeSlcclxuXHRcdFx0cm90ICs9IHN0ZXBcclxuXHJcblx0XHRcdHggPSBNYXRoLmNvcyhyb3QpICogb3V0ZXJSYWRpdXNcclxuXHRcdFx0eSA9IE1hdGguc2luKHJvdCkgKiBvdXRlclJhZGl1c1xyXG5cdFx0XHRAY29udGV4dC5saW5lVG8oeCwgeSlcclxuXHRcdFx0cm90ICs9IHN0ZXBcclxuXHJcblx0XHRAY29udGV4dC5saW5lVG8oMCwgLW91dGVyUmFkaXVzKVxyXG5cdFx0QGNvbnRleHQuZmlsbCgpXHJcblx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cdFx0QGNvbnRleHQuY2xvc2VQYXRoKClcclxuXHRcdFxyXG5cclxuXHJcblxyXG5cclxuXHRkcmF3OiAoZGVsdGEpLT5cclxuXHJcblx0XHRAY29udGV4dC5maWxsU3R5bGUgPSAnI0ZGRkZGRidcclxuXHRcdEBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBAY2FudmFzLndpZHRoLCBAY2FudmFzLmhlaWdodClcclxuXHRcdEBvZmZzZXQgKz0gQHNwZWVkW0BzdGF0ZV0gKiBkZWx0YVxyXG5cdFx0YW5pbWF0ZSA9IHRydWVcclxuXHJcblx0XHRpZiBAc3RhdGUgPT0gJ3ZpZXcnIGFuZCBhbmltYXRlXHJcblx0XHRcdGFjdGlvbiA9IGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0XHRhdHRhY2tlciA9IEBjaGFyYWN0ZXJzW2FjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0ZGVmZW5kZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cdFx0XHRpZihhY3Rpb24udHlwZSA9PSAnaGl0JylcclxuXHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBhY3Rpb24uaGVhbHRoXHJcblxyXG5cdFx0XHRAZHJhd0NoYXJhY3RlcnMoYXR0YWNrZXIsIGRlZmVuZGVyKVxyXG5cclxuXHRcdFx0aWYoQG9mZnNldCA+IDEuMCBhbmQgbm90IEBwYXVzZSlcclxuXHRcdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdFx0ZGVmZW5kZXIuc3RhcnRIZWFsdGggPSBkZWZlbmRlci5oZWFsdGhcclxuXHJcblx0XHRcdFx0aWYgYWN0aW9uLnR5cGUgPT0gJ2hpdCdcclxuXHRcdFx0XHRcdGRlZmVuZGVyLmVuZEhlYWx0aCA9IE1hdGgubWF4KGRlZmVuZGVyLmhlYWx0aCAtIGFjdGlvbi5kYW1hZ2UsIDApXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuZW5kSGVhbHRoID0gZGVmZW5kZXIuaGVhbHRoXHJcblxyXG5cdFx0XHRcdEBzdGF0ZSA9ICdpbmZvJ1xyXG5cclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICdpbmZvJyBhbmQgYW5pbWF0ZVxyXG5cdFx0XHRhY3Rpb24gPSBiYXR0bGVMb2dbJ2xvZyddW0BpbmRleF1cclxuXHRcdFx0YXR0YWNrZXIgPSBAY2hhcmFjdGVyc1thY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdGRlZmVuZGVyID0gQGNoYXJhY3RlcnNbYWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0QGRyYXdDaGFyYWN0ZXJzKGF0dGFja2VyLCBkZWZlbmRlcilcclxuXHJcblx0XHRcdGlmIEBvZmZzZXQgPD0gMS4wXHJcblx0XHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSBAb2Zmc2V0XHJcblx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gZGVmZW5kZXIuc3RhcnRIZWFsdGhcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIEBvZmZzZXQgPD0gMi4wXHJcblx0XHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IDEuMFxyXG5cclxuXHRcdFx0XHRcdGkgPSBNYXRoLmNsYW1wKEBvZmZzZXQgLSAxLjAsIDAsIDEpXHJcblx0XHRcdFx0XHRkZWZlbmRlci5oZWFsdGggPSBNYXRoLmxlcnAoaSwgZGVmZW5kZXIuZW5kSGVhbHRoLCBkZWZlbmRlci5zdGFydEhlYWx0aClcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0ZGVmZW5kZXIuaGVhbHRoID0gZGVmZW5kZXIuZW5kSGVhbHRoXHJcblx0XHRcdFx0XHRAY29udGV4dC5nbG9iYWxBbHBoYSA9IE1hdGgubWF4KDMuMCAtIEBvZmZzZXQsIDApXHJcblxyXG5cdFx0XHRpZihAb2Zmc2V0ID4gNC4wKVxyXG5cdFx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHRcdFx0XHRAc3RhdGUgPSAnbmV4dCdcclxuXHJcblx0XHRcdGlmIGFjdGlvbi50eXBlID09ICdoaXQnXHJcblx0XHRcdFx0dGV4dCA9IGFjdGlvbi5kYW1hZ2VcclxuXHJcblx0XHRcdFx0aWYgYWN0aW9uLmNyaXRcclxuXHRcdFx0XHRcdHRleHQgKz0gJyEnXHJcblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0dGV4dCA9ICdkb2RnZSdcclxuXHJcblxyXG5cclxuXHRcdFx0QGRyYXdJbmZvKHRleHQpXHJcblxyXG5cclxuXHRcdFx0QGNvbnRleHQuZ2xvYmFsQWxwaGEgPSAxLjBcclxuXHRcdFx0YW5pbWF0ZSA9IGZhbHNlXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICduZXh0JyBhbmQgYW5pbWF0ZVxyXG5cclxuXHRcdFx0cHJldkFjdGlvbiA9IGJhdHRsZUxvZ1snbG9nJ11bQGluZGV4XVxyXG5cdFx0XHRuZXh0QWN0aW9uID0gYmF0dGxlTG9nWydsb2cnXVtAaW5kZXggKyAxXVxyXG5cclxuXHJcblx0XHRcdHByZXZBdHRhY2tlciA9IEBjaGFyYWN0ZXJzW3ByZXZBY3Rpb24uYXR0YWNrZXJdXHJcblx0XHRcdHByZXZEZWZlbmRlciA9IEBjaGFyYWN0ZXJzW3ByZXZBY3Rpb24uZGVmZW5kZXJdXHJcblxyXG5cclxuXHRcdFx0cG9zaXRpb24gPSAoQGNhbnZhcy5oZWlnaHQgLyAyKSAqIEBvZmZzZXRcclxuXHJcblx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRAY29udGV4dC50cmFuc2xhdGUoMCwgLXBvc2l0aW9uKVxyXG5cdFx0XHRAZHJhd0NoYXJhY3RlcnMocHJldkF0dGFja2VyLCBwcmV2RGVmZW5kZXIpXHJcblx0XHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblx0XHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0XHRAY29udGV4dC50cmFuc2xhdGUoMCwgQGNhbnZhcy5oZWlnaHQgLSBwb3NpdGlvbilcclxuXHJcblx0XHRcdGlmIG5leHRBY3Rpb24/XHJcblx0XHRcdFx0bmV4dEF0dGFja2VyID0gQGNoYXJhY3RlcnNbbmV4dEFjdGlvbi5hdHRhY2tlcl1cclxuXHRcdFx0XHRuZXh0RGVmZW5kZXIgPSBAY2hhcmFjdGVyc1tuZXh0QWN0aW9uLmRlZmVuZGVyXVxyXG5cclxuXHRcdFx0XHRpZihuZXh0QWN0aW9uLnR5cGUgPT0gJ2hpdCcpXHJcblx0XHRcdFx0XHRuZXh0RGVmZW5kZXIuaGVhbHRoID0gbmV4dEFjdGlvbi5oZWFsdGhcclxuXHJcblx0XHRcdFx0QGRyYXdDaGFyYWN0ZXJzKG5leHRBdHRhY2tlciwgbmV4dERlZmVuZGVyKVxyXG5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHRleHQgPSAnRW5kJ1xyXG5cdFx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0XHRcdG1lYXN1cmUgPSBAY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KVxyXG5cdFx0XHRcdEBjb250ZXh0LmZpbGxUZXh0KHRleHQsIChAY2FudmFzLndpZHRoIC0gbWVhc3VyZS53aWR0aCkgLyAyLCAoQGNhbnZhcy5oZWlnaHQgLSAxNSkgLyAyKVxyXG5cclxuXHRcdFx0QGNvbnRleHQucmVzdG9yZSgpXHJcblxyXG5cdFx0XHRpZiBAb2Zmc2V0ID4gMi4wXHJcblx0XHRcdFx0QGluZGV4KytcclxuXHRcdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdFx0aWYgbmV4dEFjdGlvbj9cclxuXHRcdFx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdEBzdGF0ZSA9ICdlbmQnXHJcblxyXG5cdFx0XHRhbmltYXRlID0gZmFsc2VcclxuXHJcblxyXG5cdFx0aWYgQHN0YXRlID09ICdlbmQnIGFuZCBhbmltYXRlXHJcblx0XHRcdHRleHQgPSAnRW5kJ1xyXG5cdFx0XHRAb2Zmc2V0ID0gMC4wXHJcblx0XHRcdEBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJ1xyXG5cdFx0XHRtZWFzdXJlID0gQGNvbnRleHQubWVhc3VyZVRleHQodGV4dClcclxuXHRcdFx0QGNvbnRleHQuZmlsbFRleHQodGV4dCwgKEBjYW52YXMud2lkdGggLSBtZWFzdXJlLndpZHRoKSAvIDIsIChAY2FudmFzLmhlaWdodCAtIDE1KSAvIDIpXHJcblx0XHRcdGFuaW1hdGUgPSBmYWxzZVxyXG5cclxuXHJcblxyXG5cclxuXHRcdHdpZHRoID0gQGNhbnZhcy53aWR0aCAtIDRcclxuXHRcdGhlaWdodCA9IEBjYW52YXMuaGVpZ2h0IC0gMlxyXG5cclxuXHRcdEBjb250ZXh0LnNhdmUoKVxyXG5cdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAncmdiYSgwLCAwLCAwLCAwLjcpJ1xyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoMCwgMCwgMCwgMC40KSdcclxuXHRcdEBjb250ZXh0LmZpbGxSZWN0KDIsIGhlaWdodCAtIDIwLCB3aWR0aCwgMjApXHJcblx0XHRAY29udGV4dC5zdHJva2VSZWN0KDIsIGhlaWdodCAtIDIwLCB3aWR0aCwgMjApXHJcblxyXG5cdFx0QGNvbnRleHQuZmlsbFN0eWxlID0gJyM1QkMwREUnXHJcblx0XHRAY29udGV4dC5maWxsUmVjdCgyLCBoZWlnaHQgLSAyMCwgd2lkdGggKiAoTWF0aC5taW4oQGluZGV4IC8gKGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSksIDEpKSwgMjApXHJcblx0XHRAY29udGV4dC5saW5lV2lkdGggPSA1XHJcblxyXG5cdFx0Zm9yIG1hcmsgaW4gYmF0dGxlTG9nWydtYXJrcyddXHJcblxyXG5cdFx0XHRpZiBtYXJrLnR5cGUgPT0gJ2ZhaW50ZWQnXHJcblx0XHRcdFx0QGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI0Q5NTM0RidcclxuXHJcblx0XHRcdGF0ID0gKG1hcmsuYXQgLyAoYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKSkgKiB3aWR0aFxyXG5cclxuXHRcdFx0QGNvbnRleHQuYmVnaW5QYXRoKClcclxuXHRcdFx0QGNvbnRleHQubW92ZVRvKGF0IC0gQGNvbnRleHQubGluZVdpZHRoIC8gMiArIDIsIGhlaWdodCAtIDIwKVxyXG5cdFx0XHRAY29udGV4dC5saW5lVG8oYXQgLSBAY29udGV4dC5saW5lV2lkdGggLyAyICsgMiwgaGVpZ2h0KVxyXG5cdFx0XHRAY29udGV4dC5zdHJva2UoKVxyXG5cclxuXHRcdEBjb250ZXh0LnJlc3RvcmUoKVxyXG5cclxuXHJcblxyXG5cclxuXHRjbGljazogKGV2ZW50KSAtPlxyXG5cdFx0Y29vcmRzID0gQGNhbnZhcy5yZWxNb3VzZUNvb3JkcyhldmVudClcclxuXHRcdHggPSBjb29yZHMueFxyXG5cdFx0eSA9IGNvb3Jkcy55XHJcblxyXG5cdFx0bCA9IDJcclxuXHRcdHIgPSBsICsgQGNhbnZhcy53aWR0aCAtIDRcclxuXHRcdGIgPSBAY2FudmFzLmhlaWdodCAtIDJcclxuXHRcdHQgPSBiIC0gMjBcclxuXHJcblxyXG5cdFx0aWYgeCA+PSBsIGFuZCB4IDw9IHIgYW5kIHkgPj0gdCBhbmQgeSA8PSBiXHJcblx0XHRcdEBpbmRleCA9IE1hdGgucm91bmQoKHggLSBsKSAvIChyIC0gbCkgKiAoYmF0dGxlTG9nWydsb2cnXS5sZW5ndGggLSAxKSlcclxuXHRcdFx0QHN0YXRlID0gJ3ZpZXcnXHJcblx0XHRcdEBvZmZzZXQgPSAwLjBcclxuXHJcblx0a2V5OiAoZXZlbnQpIC0+XHJcblxyXG5cdFx0aWYgZXZlbnQud2hpY2ggPT0gMzJcclxuXHRcdFx0QHBhdXNlID0gIUBwYXVzZVxyXG5cclxuXHJcblx0XHRpZiBldmVudC53aGljaCA9PSAzN1xyXG5cdFx0XHRAaW5kZXggPSBNYXRoLm1heChAaW5kZXggLSAxLCAwKVxyXG5cdFx0XHRAb2Zmc2V0ID0gMS4wXHJcblx0XHRcdEBzdGF0ZSA9ICd2aWV3J1xyXG5cclxuXHRcdGlmIGV2ZW50LndoaWNoID09IDM5XHJcblx0XHRcdEBpbmRleCA9IE1hdGgubWluKEBpbmRleCArIDEsIGJhdHRsZUxvZ1snbG9nJ10ubGVuZ3RoIC0gMSlcclxuXHRcdFx0QG9mZnNldCA9IDEuMFxyXG5cdFx0XHRAc3RhdGUgPSAndmlldydcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuYmF0dGxlID0gbmV3IEJhdHRsZTtcclxuXHJcbmxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuaW50ZXJ2YWwgPSAxMDAwIC8gNjBcclxuYWNjdW11bGF0b3IgPSAwLjBcclxuXHJcblxyXG5yZXF1ZXN0RnJhbWUgPSAodGltZSktPlxyXG5cclxuXHRkZWx0YSA9IE1hdGgubWF4KHRpbWUgLSBsYXN0VGltZSwgMClcclxuXHRsYXN0VGltZSA9IHRpbWUgXHJcblx0YWNjdW11bGF0b3IgKz0gZGVsdGFcclxuXHJcblx0d2hpbGUgYWNjdW11bGF0b3IgPj0gaW50ZXJ2YWxcclxuXHRcdGFjY3VtdWxhdG9yIC09IGludGVydmFsXHJcblx0XHRiYXR0bGUuZHJhdyhpbnRlcnZhbCAvIDEwMDApXHJcblxyXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVxdWVzdEZyYW1lKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiQgLT5cclxuXHRpZiBiYXR0bGUubG9hZCgpXHJcblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RGcmFtZSkiLCJcclxuXHJcbnVwZGF0ZSA9ICgpIC0+XHJcblxyXG5cdGRhdGUgPSBuZXcgRGF0ZSgpXHJcblx0bm93ID0gTWF0aC5yb3VuZChkYXRlLmdldFRpbWUoKSAvIDEwMDApXHJcblx0JCgnLmN1cnJlbnQtdGltZScpLnRleHQoZGF0ZS50b1VUQ1N0cmluZygpKVxyXG5cclxuXHQkKCcudGltZS1sZWZ0JykuZWFjaCgtPlxyXG5cclxuXHRcdHRvID0gJCh0aGlzKS5kYXRhKCd0bycpXHJcblx0XHQkKHRoaXMpLnRleHQod2luZG93LnRpbWVGb3JtYXQoTWF0aC5tYXgodG8gLSBub3csIDApKSlcclxuXHQpXHJcblxyXG5cclxuXHRzZXRUaW1lb3V0KHVwZGF0ZSwgMTAwMClcclxuXHJcblxyXG5cclxuJCAtPlxyXG5cdHVwZGF0ZSgpIiwiXHJcblxyXG5kaWFsb2dzID0gW11cclxuXHJcblxyXG5zaG93ID0gKGRpYWxvZykgLT5cclxuXHJcblx0ZGlzbWlzc2libGUgPSAoJChkaWFsb2cpLmRhdGEoJ2Rpc21pc3NpYmxlJykpID8gdHJ1ZVxyXG5cdGNvbnNvbGUubG9nKGRpc21pc3NpYmxlKVxyXG5cclxuXHJcblx0aWYgZGlzbWlzc2libGVcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiB0cnVlLCBzaG93OiB0cnVlLCBrZXlib2FyZDogdHJ1ZX0pXHJcblxyXG5cdGVsc2VcclxuXHJcblx0XHQkKGRpYWxvZykubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywgc2hvdzogdHJ1ZSwga2V5Ym9hcmQ6IGZhbHNlfSlcclxuXHJcblxyXG4kIC0+XHJcblx0ZGlhbG9ncyA9ICQoJy5tb2RhbC5hdXRvc2hvdycpXHJcblxyXG5cclxuXHQkKGRpYWxvZ3MpLmVhY2goKGluZGV4KSAtPlxyXG5cclxuXHRcdGlmIGluZGV4ID09IDBcclxuXHRcdFx0c2hvdyh0aGlzKVxyXG5cclxuXHRcdGlmIGluZGV4IDwgKGRpYWxvZ3MubGVuZ3RoIC0gMSlcclxuXHRcdFx0JCh0aGlzKS5vbignaGlkZGVuLmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cclxuXHRcdFx0XHRzaG93KGRpYWxvZ3NbaW5kZXggKyAxXSlcclxuXHRcdFx0KVxyXG5cdCkiLCJ3aWR0aHMgPVxyXG5cdHhzOiA3NjgsXHJcblx0c206IDk5MixcclxuXHRtZDogMTIwMCxcclxuXHJcblxyXG5cclxuZ2V0UHJlZml4ID0gLT5cclxuXHR3aWR0aCA9ICQod2luZG93KS53aWR0aCgpXHJcblxyXG5cdGlmIHdpZHRoIDwgd2lkdGhzLnhzXHJcblx0XHRbJ3hzJ11cclxuXHRlbHNlIGlmIHdpZHRoIDwgd2lkdGhzLnNtXHJcblx0XHRbJ3NtJywgJ3hzJ11cclxuXHRlbHNlIGlmIHdpZHRoIDwgd2lkdGhzLm1kXHJcblx0XHRbJ21kJywgJ3NtJywgJ3hzJ11cclxuXHRlbHNlXHJcblx0XHRbJ2xnJywgJ21kJywgJ3NtJywgJ3hzJ11cclxuXHJcblxyXG5nZXRDb2x1bW5zID0gKHByZWZpeCkgLT5cclxuXHRyZXN1bHQgPSBbXVxyXG5cdGZvciBwIGluIHByZWZpeFxyXG5cdFx0Zm9yIGkgaW4gWzEuLjEyXVxyXG5cdFx0XHRyZXN1bHQucHVzaChcImNvbC0je3B9LSN7aX1cIilcclxuXHRyZXN1bHRcclxuXHJcblxyXG5cclxuZ2V0U2l6ZSA9IChvYmplY3QsIHByZWZpeCkgLT5cclxuXHRmb3IgcCBpbiBwcmVmaXhcclxuXHRcdHJlZ2V4cCA9IG5ldyBSZWdFeHAoXCJjb2wtI3twfS0oXFxcXGQrKVwiKVxyXG5cdFx0c2l6ZSA9ICQob2JqZWN0KS5hdHRyKCdjbGFzcycpLm1hdGNoKHJlZ2V4cCk/WzFdXHJcblx0XHRyZXR1cm4gcGFyc2VJbnQoc2l6ZSkgaWYgc2l6ZT9cclxuXHRyZXR1cm4gbnVsbFxyXG5cclxuXHJcblxyXG5cclxuZXF1YWxpemUgPSAtPlxyXG5cdHByZWZpeCA9IGdldFByZWZpeCgpXHJcblx0Y29sdW1ucyA9IGdldENvbHVtbnMocHJlZml4KVxyXG5cdHNlbGVjdG9yID0gJy4nICsgY29sdW1ucy5qb2luKCcsLicpXHJcblx0XHJcblx0I2NvbnNvbGUubG9nKCdwcmVmaXg6ICcsIHByZWZpeClcclxuXHQjY29uc29sZS5sb2coJ2NvbHVtbnM6ICcsIGNvbHVtbnMpXHJcblx0I2NvbnNvbGUubG9nKCdzZWxlY3RvcjogJywgc2VsZWN0b3IpXHJcblxyXG5cclxuXHQkKCcucm93LmVxdWFsaXplJykuZWFjaCAtPlxyXG5cdFx0I2NvbnNvbGUubG9nKCduZXcgcm93JylcclxuXHRcdGhlaWdodHMgPSBbXVxyXG5cdFx0cm93ID0gMFxyXG5cdFx0c3VtID0gMFxyXG5cclxuXHRcdCQodGhpcykuY2hpbGRyZW4oc2VsZWN0b3IpLmVhY2ggLT5cclxuXHRcdFx0c2l6ZSA9IGdldFNpemUodGhpcywgcHJlZml4KVxyXG5cdFx0XHRzdW0gKz0gc2l6ZVxyXG5cclxuXHRcdFx0I2NvbnNvbGUubG9nKCdzaXplOiAnLCBzaXplKVxyXG5cdFx0XHQjY29uc29sZS5sb2coJ3N1bTogJywgc3VtKVxyXG5cclxuXHRcdFx0aWYgc3VtID4gMTJcclxuXHRcdFx0XHRzdW0gLT0gMTJcclxuXHRcdFx0XHRyb3crK1xyXG5cdFx0XHRcdCNjb25zb2xlLmxvZygnbmV4dCByb3cgJywgcm93LCBzaXplKVxyXG5cclxuXHRcdFx0aGVpZ2h0c1tyb3ddID89IDBcclxuXHRcdFx0aGVpZ2h0c1tyb3ddID0gTWF0aC5tYXgoaGVpZ2h0c1tyb3ddLCAkKHRoaXMpLmhlaWdodCgpKVxyXG5cdFx0XHQjY29uc29sZS5sb2coJ2hlaWdodCAnLCBoZWlnaHRzW3Jvd10pXHJcblxyXG5cdFx0cm93ID0gMFxyXG5cdFx0c3VtID0gMFxyXG5cdFx0Y29sID0gbnVsbFxyXG5cclxuXHRcdCQodGhpcykuY2hpbGRyZW4oc2VsZWN0b3IpLmVhY2ggLT5cclxuXHRcdFx0c3VtICs9IGdldFNpemUodGhpcywgcHJlZml4KVxyXG5cdFx0XHRjb2wgPz0gdGhpc1xyXG5cclxuXHRcdFx0aWYgc3VtID4gMTJcclxuXHRcdFx0XHRzdW0gLT0gMTJcclxuXHRcdFx0XHRyb3crK1xyXG5cdFx0XHRcdGNvbCA9IHRoaXNcclxuXHJcblx0XHRcdCQodGhpcykuaGVpZ2h0KGhlaWdodHNbcm93XSlcclxuXHJcblx0XHRocyA9IE1hdGgucm91bmQgKDEyIC0gc3VtKSAvIDJcclxuXHRcdGlmIGNvbD8gYW5kIGhzID4gMFxyXG5cdFx0XHRwID0gcHJlZml4WzBdXHJcblxyXG5cdFx0XHRmb3IgaSBpbiBbMS4uMTJdXHJcblx0XHRcdFx0JChjb2wpLnJlbW92ZUNsYXNzKFwiY29sLSN7cH0tb2Zmc2V0LSN7aX1cIilcclxuXHRcdFx0JChjb2wpLmFkZENsYXNzKFwiY29sLSN7cH0tb2Zmc2V0LSN7aHN9XCIpXHJcblxyXG5hZnRlckxvYWRlZCA9IC0+XHJcblx0JCgnaW1nJylcclxuXHRcdC5vbignbG9hZCcsIGVxdWFsaXplKVxyXG5cclxuXHJcbiQgLT5cclxuXHQjYWZ0ZXJMb2FkZWQoKVxyXG5cdCMkKHdpbmRvdykub24oJ3Jlc2l6ZWQnLCBlcXVhbGl6ZSlcclxuXHQjZXF1YWxpemUoKSIsInNwZWVkID0gMVxyXG5cclxuXHJcbmtleURvd24gPSAoZXZlbnQpIC0+XHJcblx0c3BlZWQgPSAxMCBpZiBldmVudC53aGljaCA9PSAxN1xyXG5cdHNwZWVkID0gMTAwIGlmIGV2ZW50LndoaWNoID09IDE2XHJcblxyXG5rZXlVcCA9IChldmVudCkgLT5cclxuXHRzcGVlZCA9IDEgaWYgZXZlbnQud2hpY2ggPT0gMTcgb3IgZXZlbnQud2hpY2ggPT0gMTZcclxuXHJcblxyXG5tb3VzZVdoZWVsID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdtb3VzZVdoZWVsJylcclxuXHRtaW4gPSBwYXJzZUludCAoJCh0aGlzKS5hdHRyKCdtaW4nKSA/IDApXHJcblx0bWF4ID0gcGFyc2VJbnQgKCQodGhpcykuYXR0cignbWF4JykgPyAxMDApXHJcblx0c3RlcCA9IHBhcnNlSW50ICgkKHRoaXMpLmF0dHIoJ3N0ZXAnKSA/IDEpXHJcblxyXG5cdGNoYW5nZSA9IGV2ZW50LmRlbHRhWSAqIHN0ZXAgKiBzcGVlZFxyXG5cdHZhbHVlID0gcGFyc2VJbnQgJCh0aGlzKS52YWwoKSA/IDBcclxuXHR2YWx1ZSA9IE1hdGguY2xhbXAgdmFsdWUgKyBjaGFuZ2UsIG1pbiwgbWF4XHJcblxyXG5cdCQodGhpcylcclxuXHRcdC52YWwgdmFsdWVcclxuXHRcdC50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cdGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcbnJhbmdlQ2hhbmdlZCA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygncmFuZ2VDaGFuZ2VkJylcclxuXHRvdXRwdXQgPSAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcucmFuZ2UtdmFsdWUnKVxyXG5cdGJlZm9yZSA9ICgkKG91dHB1dCkuZGF0YSAnYmVmb3JlJykgPyAnJ1xyXG5cdGFmdGVyID0gKCQob3V0cHV0KS5kYXRhICdhZnRlcicpID8gJydcclxuXHR2YWx1ZSA9ICQodGhpcykudmFsKCkgPyAwXHJcblxyXG5cdCQob3V0cHV0KS50ZXh0IGJlZm9yZSArIHZhbHVlICsgYWZ0ZXJcclxuXHJcblxyXG5udW1iZXJEZWNyZWFzZSA9IChldmVudCkgLT5cclxuXHRjb25zb2xlLmxvZygnbnVtYmVyRGVjcmVhc2UnKVxyXG5cdGlucHV0ID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignaW5wdXQnKVxyXG5cdG1pbiA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdtaW4nKSA/IDApXHJcblx0bWF4ID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21heCcpID8gMTAwKVxyXG5cdHN0ZXAgPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignc3RlcCcpID8gMSlcclxuXHJcblx0dmFsdWUgPSBwYXJzZUludCAoJChpbnB1dCkudmFsKCkgPyAwKVxyXG5cdHZhbHVlID0gTWF0aC5jbGFtcCh2YWx1ZSAtIHNwZWVkICogc3RlcCwgbWluLCBtYXgpXHJcblx0JChpbnB1dCkudmFsKHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UnKVxyXG5cclxuXHJcbm51bWJlckluY3JlYXNlID0gKGV2ZW50KSAtPlxyXG5cdGNvbnNvbGUubG9nKCdudW1iZXJJbmNyZWFzZScpXHJcblx0aW5wdXQgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLmNoaWxkcmVuKCdpbnB1dCcpXHJcblx0bWluID0gcGFyc2VJbnQgKCQoaW5wdXQpLmF0dHIoJ21pbicpID8gMClcclxuXHRtYXggPSBwYXJzZUludCAoJChpbnB1dCkuYXR0cignbWF4JykgPyAxMDApXHJcblx0c3RlcCA9IHBhcnNlSW50ICgkKGlucHV0KS5hdHRyKCdzdGVwJykgPyAxKVxyXG5cclxuXHR2YWx1ZSA9IHBhcnNlSW50ICgkKGlucHV0KS52YWwoKSA/IDApXHJcblx0dmFsdWUgPSBNYXRoLmNsYW1wKHZhbHVlICsgc3BlZWQgKiBzdGVwLCBtaW4sIG1heClcclxuXHQkKGlucHV0KS52YWwodmFsdWUpLnRyaWdnZXIoJ2NoYW5nZScpXHJcblxyXG5cclxuXHJcblxyXG4kIC0+IFxyXG5cdCQod2luZG93KVxyXG5cdFx0LmtleXVwIGtleVVwXHJcblx0XHQua2V5ZG93biBrZXlEb3duXHJcblxyXG5cdCQoJ2lucHV0W3R5cGU9bnVtYmVyXSwgaW5wdXRbdHlwZT1yYW5nZV0nKVxyXG5cdFx0LmJpbmQgJ21vdXNld2hlZWwnLCBtb3VzZVdoZWVsXHJcblxyXG5cdCQoJ2lucHV0W3R5cGU9cmFuZ2VdJylcclxuXHRcdC5jaGFuZ2UgcmFuZ2VDaGFuZ2VkXHJcblx0XHQubW91c2Vtb3ZlIHJhbmdlQ2hhbmdlZFxyXG5cclxuXHQkKCcubnVtYmVyLW1pbnVzJykuY2hpbGRyZW4oJ2J1dHRvbicpXHJcblx0XHQuY2xpY2sgbnVtYmVyRGVjcmVhc2VcclxuXHJcblxyXG5cdCQoJy5udW1iZXItcGx1cycpLmNoaWxkcmVuKCdidXR0b24nKVxyXG5cdFx0LmNsaWNrIG51bWJlckluY3JlYXNlXHJcblxyXG4iLCJsYXN0VGltZSA9IDBcclxudmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcblxyXG5pZiBub3Qgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgZm9yIHZlbmRvciBpbiB2ZW5kb3JzXHJcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3IgKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgd2luZG93W3ZlbmRvciArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxyXG5cclxud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSBvcj0gKGNhbGxiYWNrLCBlbGVtZW50KSAtPlxyXG4gICAgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG5cclxuICAgIGlkID0gd2luZG93LnNldFRpbWVvdXQoLT5cclxuICAgICAgICBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpXHJcbiAgICAsIHRpbWVUb0NhbGwpXHJcblxyXG4gICAgaWRcclxuXHJcbndpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSBvcj0gKGlkKSAtPlxyXG4gICAgY2xlYXJUaW1lb3V0KGlkKSIsIlxyXG5cclxuXHJcblxyXG4kIC0+IFxyXG5cdCQoJy5pbWFnZS1wcmV2aWV3JykuZWFjaCAtPlxyXG5cdFx0cHJldmlldyA9IHRoaXNcclxuXHRcdGlkID0gJCh0aGlzKS5kYXRhKCdmb3InKVxyXG5cdFx0JCgnIycgKyBpZCkuY2hhbmdlKChldmVudCkgLT4gXHJcblx0XHRcdFxyXG5cdFx0XHRwYXRoID0gVVJMLmNyZWF0ZU9iamVjdFVSTChldmVudC50YXJnZXQuZmlsZXNbMF0pXHJcblx0XHRcdCQocHJldmlldykuYXR0ciAnc3JjJywgcGF0aFxyXG5cdFx0KS50cmlnZ2VyICdjaGFuZ2UnXHJcbiIsIlxyXG5cclxuc2V0ID0gKGxhbmcpIC0+XHJcblx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xhbmcvJyArIGxhbmdcclxuXHJcblxyXG5cclxuXHJcblxyXG5idXR0b24gPSAoKSAtPlxyXG5cdHNldCgkKHRoaXMpLmRhdGEoJ2xhbmcnKSlcclxuXHJcblxyXG5zZWxlY3QgPSAoKSAtPlxyXG5cdHNldCgkKHRoaXMpLnZhbCgpKVxyXG5cclxuXHJcblxyXG4kIC0+XHJcblx0JCgnLmxhbmd1YWdlLXNlbGVjdCcpLmNoYW5nZShzZWxlY3QpXHJcblx0JCgnLmxhbmd1YWdlLWJ1dHRvbicpLmNsaWNrKGJ1dHRvbilcclxuIiwibmF2Zml4ID0gLT5cclxuXHRoZWlnaHQgPSAkKCcjbWFpbk5hdicpLmhlaWdodCgpICsgMTBcclxuXHQkKCdib2R5JykuY3NzKCdwYWRkaW5nLXRvcCcsIGhlaWdodCArICdweCcpXHJcblxyXG5cclxuJCAtPlxyXG5cdCQod2luZG93KS5yZXNpemUgLT4gbmF2Zml4KClcclxuXHRuYXZmaXgoKSIsIlxyXG5cclxuaW1hZ2VGb3JGcmFtZSA9IChmcmFtZSkgLT5cclxuXHQnL2ltYWdlcy9wbGFudHMvcGxhbnQtJyArIGZyYW1lICsgJy5wbmcnXHJcblxyXG5yZWZyZXNoUGxhbnQgPSAocGxhbnQpIC0+IFxyXG5cdG5vdyA9IE1hdGgucm91bmQoKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwKVxyXG5cdHN0YXJ0ID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnc3RhcnQnXHJcblx0ZW5kID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnZW5kJ1xyXG5cdHdhdGVyaW5nID0gcGFyc2VJbnQgJChwbGFudCkuZGF0YSAnd2F0ZXJpbmcnXHJcblx0bm93ID0gTWF0aC5taW4gbm93LCB3YXRlcmluZ1xyXG5cdGZyYW1lID0gTWF0aC5mbG9vcigxNyAqIE1hdGguY2xhbXAoKG5vdyAtIHN0YXJ0KSAvIChlbmQgLSBzdGFydCksIDAsIDEpKSBcclxuXHQkKHBsYW50KS5hdHRyICdzcmMnLCBpbWFnZUZvckZyYW1lIGZyYW1lXHJcblxyXG5cdHNldFRpbWVvdXQgKC0+IHJlZnJlc2hQbGFudCBwbGFudCksIDEwMDAgaWYgZnJhbWUgPCAxN1xyXG5cclxuJCAtPlxyXG5cdCQoJy5wbGFudGF0aW9uLXBsYW50JykuZWFjaCAtPiByZWZyZXNoUGxhbnQgdGhpc1xyXG5cclxuXHQkKCcjc2VlZHNNb2RhbCcpLm9uICdzaG93LmJzLm1vZGFsJywgKGV2ZW50KSAtPlxyXG5cdFx0c2xvdCA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkuZGF0YSAnc2xvdCdcclxuXHRcdCQodGhpcykuZmluZCgnaW5wdXRbbmFtZT1zbG90XScpLnZhbCBzbG90IiwidXJsID0gJy9hcGkvY2hhcmFjdGVyJztcclxuXHJcblxyXG5zZXRQcm9ncmVzcyA9IChvYmplY3QsIHZhbHVlLCBtaW5WYWx1ZSwgbWF4VmFsdWUsIGxhc3RVcGRhdGUsIG5leHRVcGRhdGUpIC0+XHJcblxyXG5cdGJhciA9ICQoJy4nICsgb2JqZWN0ICsgJy1iYXInKVxyXG5cdHRpbWVyID0gJCgnLicgKyBvYmplY3QgKyAnLXRpbWVyJylcclxuXHJcblxyXG5cdGlmIGJhci5sZW5ndGggPiAwXHJcblx0XHRjaGlsZCA9ICQoYmFyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWJhcidcclxuXHJcblx0XHQkKGNoaWxkKVxyXG5cdFx0XHQuZGF0YSAnbWF4JywgbWF4VmFsdWVcclxuXHRcdFx0LmRhdGEgJ21pbicsIG1pblZhbHVlXHJcblx0XHRcdC5kYXRhICdub3cnLCB2YWx1ZVxyXG5cdFx0YmFyWzBdLnVwZGF0ZT8oKVxyXG5cclxuXHJcblx0aWYgdGltZXIubGVuZ3RoID4gMFxyXG5cdFx0Y2hpbGQgPSAkKHRpbWVyKS5jaGlsZHJlbiAnLnByb2dyZXNzLWJhcidcclxuXHJcblx0XHRpZiBuZXh0VXBkYXRlP1xyXG5cdFx0XHQkKGNoaWxkKVxyXG5cdFx0XHRcdC5kYXRhICdtYXgnLCBuZXh0VXBkYXRlXHJcblx0XHRcdFx0LmRhdGEgJ21pbicsIGxhc3RVcGRhdGVcclxuXHRcdGVsc2VcclxuXHRcdFx0JChjaGlsZClcclxuXHRcdFx0XHQuZGF0YSAnbWF4JywgMVxyXG5cdFx0XHRcdC5kYXRhICdtaW4nLCAwXHJcblxyXG5cclxuc2V0VmFsdWVzID0gKG9iamVjdCwgdmFsdWUsIG1pblZhbHVlLCBtYXhWYWx1ZSkgLT5cclxuXHQkKCcuJyArIG9iamVjdCArICctbm93JylcclxuXHRcdC50ZXh0IHZhbHVlXHJcblxyXG5cdCQoJy4nICsgb2JqZWN0ICsgJy1taW4nKVxyXG5cdFx0LnRleHQgbWluVmFsdWVcclxuXHJcblx0JCgnLicgKyBvYmplY3QgKyAnLW1heCcpXHJcblx0XHQudGV4dCBtYXhWYWx1ZVxyXG5cclxuc2V0VmFsdWUgPSAob2JqZWN0LCB2YWx1ZSkgLT5cclxuXHQkKCcuJyArIG9iamVjdClcclxuXHRcdC50ZXh0IHZhbHVlXHJcblxyXG5cclxuXHJcblxyXG5maWxsID0gKGRhdGEpIC0+XHJcblx0c2V0UHJvZ3Jlc3MgJ2hlYWx0aCcsIGRhdGEuaGVhbHRoLCAwLCBkYXRhLm1heEhlYWx0aCwgZGF0YS5oZWFsdGhVcGRhdGUsIGRhdGEubmV4dEhlYWx0aFVwZGF0ZVxyXG5cdHNldFZhbHVlcyAnaGVhbHRoJywgZGF0YS5oZWFsdGgsIDAsIGRhdGEubWF4SGVhbHRoXHJcblxyXG5cdHNldFByb2dyZXNzICdlbmVyZ3knLCBkYXRhLmVuZXJneSwgMCwgZGF0YS5tYXhFbmVyZ3ksIGRhdGEuZW5lcmd5VXBkYXRlLCBkYXRhLm5leHRFbmVyZ3lVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ2VuZXJneScsIGRhdGEuZW5lcmd5LCAwLCBkYXRhLm1heEVuZXJneVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnd2FudGVkJywgZGF0YS53YW50ZWQsIDAsIDYsIGRhdGEud2FudGVkVXBkYXRlLCBkYXRhLm5leHRXYW50ZWRVcGRhdGVcclxuXHRzZXRWYWx1ZXMgJ3dhbnRlZCcsIGRhdGEud2FudGVkLCAwLCA2XHJcblxyXG5cdHNldFByb2dyZXNzICdleHBlcmllbmNlJywgZGF0YS5leHBlcmllbmNlLCAwLCBkYXRhLm1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ2V4cGVyaWVuY2UnLCBkYXRhLmV4cGVyaWVuY2UsIDAsIGRhdGEubWF4RXhwZXJpZW5jZVxyXG5cclxuXHJcblx0c2V0UHJvZ3Jlc3MgJ3BsYW50YXRvcicsIGRhdGEucGxhbnRhdG9yRXhwZXJpZW5jZSwgMCwgZGF0YS5wbGFudGF0b3JNYXhFeHBlcmllbmNlLCBudWxsLCBudWxsXHJcblx0c2V0VmFsdWVzICdwbGFudGF0b3InLCBkYXRhLnBsYW50YXRvckV4cGVyaWVuY2UsIDAsIGRhdGEucGxhbnRhdG9yTWF4RXhwZXJpZW5jZVxyXG5cclxuXHRzZXRQcm9ncmVzcyAnc211Z2dsZXInLCBkYXRhLnNtdWdnbGVyRXhwZXJpZW5jZSwgMCwgZGF0YS5zbXVnZ2xlck1heEV4cGVyaWVuY2UsIG51bGwsIG51bGxcclxuXHRzZXRWYWx1ZXMgJ3NtdWdnbGVyJywgZGF0YS5zbXVnZ2xlckV4cGVyaWVuY2UsIDAsIGRhdGEuc211Z2dsZXJNYXhFeHBlcmllbmNlXHJcblxyXG5cdHNldFByb2dyZXNzICdkZWFsZXInLCBkYXRhLmRlYWxlckV4cGVyaWVuY2UsIDAsIGRhdGEuZGVhbGVyTWF4RXhwZXJpZW5jZSwgbnVsbCwgbnVsbFxyXG5cdHNldFZhbHVlcyAnZGVhbGVyJywgZGF0YS5kZWFsZXJFeHBlcmllbmNlLCAwLCBkYXRhLmRlYWxlck1heEV4cGVyaWVuY2VcclxuXHJcblxyXG5cclxuXHJcblxyXG5cdCNzZXRWYWx1ZSAnbGV2ZWwnLCBkYXRhLmxldmVsXHJcblx0I3NldFZhbHVlICdwbGFudGF0b3ItbGV2ZWwnLCBkYXRhLnBsYW50YXRvckxldmVsXHJcblx0I3NldFZhbHVlICdzbXVnZ2xlci1sZXZlbCcsIGRhdGEuc211Z2dsZXJMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnZGVhbGVyLWxldmVsJywgZGF0YS5kZWFsZXJMZXZlbFxyXG5cdCNzZXRWYWx1ZSAnc3RyZW5ndGgnLCBkYXRhLnN0cmVuZ3RoLFxyXG5cdCNzZXRWYWx1ZSAncGVyY2VwdGlvbicsIGRhdGEucGVyY2VwdGlvblxyXG5cdCNzZXRWYWx1ZSAnZW5kdXJhbmNlJywgZGF0YS5lbmR1cmFuY2VcclxuXHQjc2V0VmFsdWUgJ2NoYXJpc21hJywgZGF0YS5jaGFyaXNtYVxyXG5cdCNzZXRWYWx1ZSAnaW50ZWxsaWdlbmNlJywgZGF0YS5pbnRlbGxpZ2VuY2VcclxuXHQjc2V0VmFsdWUgJ2FnaWxpdHknLCBkYXRhLmFnaWxpdHlcclxuXHQjc2V0VmFsdWUgJ2x1Y2snLCBkYXRhLmx1Y2sgKyAnJSdcclxuXHQjc2V0VmFsdWUgJ3N0YXRpc3RpY1BvaW50cycsIGRhdGEuc3RhdGlzdGljUG9pbnRzXHJcblx0I3NldFZhbHVlICd0YWxlbnRQb2ludHMnLCBkYXRhLnRhbGVudFBvaW50c1xyXG5cdCNzZXRWYWx1ZSAnbW9uZXknLCAnJCcgKyBkYXRhLm1vbmV5XHJcblx0I3NldFZhbHVlICdyZXBvcnRzJywgZGF0YS5yZXBvcnRzQ291bnRcclxuXHQjc2V0VmFsdWUgJ21lc3NhZ2VzJywgZGF0YS5tZXNzYWdlc0NvdW50XHJcblxyXG5cdHNjb3BlID0gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLnNjb3BlKClcclxuXHJcblx0aWYgc2NvcGU/IGFuZCBzY29wZS5wbGF5ZXI/XHJcblx0XHQjc2NvcGUucGxheWVyLmxldmVsID0gZGF0YS5sZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5wbGFudGF0b3JMZXZlbCA9IGRhdGEucGxhbnRhdG9yTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuc211Z2dsZXJMZXZlbCA9IGRhdGEuc211Z2dsZXJMZXZlbFxyXG5cdFx0I3Njb3BlLnBsYXllci5kZWFsZXJMZXZlbCA9IGRhdGEuZGVhbGVyTGV2ZWxcclxuXHRcdCNzY29wZS5wbGF5ZXIuc3RyZW5ndGggPSBkYXRhLnN0cmVuZ3RoXHJcblx0XHQjc2NvcGUucGxheWVyLnBlcmNlcHRpb24gPSBkYXRhLnBlcmNlcHRpb25cclxuXHRcdCNzY29wZS5wbGF5ZXIuZW5kdXJhbmNlID0gZGF0YS5lbmR1cmFuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuY2hhcmlzbWEgPSBkYXRhLmNoYXJpc21hXHJcblx0XHQjc2NvcGUucGxheWVyLmludGVsbGlnZW5jZSA9IGRhdGEuaW50ZWxsaWdlbmNlXHJcblx0XHQjc2NvcGUucGxheWVyLmFnaWxpdHkgPSBkYXRhLmFnaWxpdHlcclxuXHRcdCNzY29wZS5wbGF5ZXIubHVjayA9IGRhdGEubHVja1xyXG5cdFx0I3Njb3BlLnBsYXllci5yZXNwZWN0ID0gZGF0YS5yZXNwZWN0XHJcblx0XHQjc2NvcGUucGxheWVyLndlaWdodCA9IGRhdGEud2VpZ2h0XHJcblx0XHQjc2NvcGUucGxheWVyLmNhcGFjaXR5ID0gZGF0YS5jYXBhY2l0eVxyXG5cdFx0I3Njb3BlLnBsYXllci5taW5EYW1hZ2UgPSBkYXRhLm1pbkRhbWFnZVxyXG5cdFx0I3Njb3BlLnBsYXllci5tYXhEYW1hZ2UgPSBkYXRhLm1heERhbWFnZVxyXG5cdFx0I3Njb3BlLnBsYXllci5kZWZlbnNlID0gZGF0YS5kZWZlbnNlXHJcblx0XHQjc2NvcGUucGxheWVyLmNyaXRDaGFuY2UgPSBkYXRhLmNyaXRDaGFuY2VcclxuXHRcdCNzY29wZS5wbGF5ZXIuc3BlZWQgPSBkYXRhLnNwZWVkXHJcblx0XHQjc2NvcGUucGxheWVyLmV4cGVyaWVuY2VNb2RpZmllciA9IGRhdGEuZXhwZXJpZW5jZU1vZGlmaWVyXHJcblx0XHQjc2NvcGUucGxheWVyLm1vbmV5TW9kaWZpZXIgPSBkYXRhLm1vbmV5TW9kaWZpZXJcclxuXHJcblx0XHRmb3IgaywgdiBvZiBkYXRhXHJcblx0XHRcdHNjb3BlLnBsYXllcltrXSA9IHZcclxuXHJcblx0XHRzY29wZS4kYXBwbHkoKVxyXG5cclxuXHJcblxyXG5cclxubG9hZGVkID0gKGRhdGEpIC0+XHJcblxyXG5cdGZpbGwgZGF0YVxyXG5cclxuXHRpZiBkYXRhLnJlbG9hZFxyXG5cclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWZyZXNoKClcclxuXHRlbHNlXHJcblx0XHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHRcdCQuYWpheCB7XHJcblxyXG5cdFx0XHRcdHVybDogdXJsICsgJy9ub3RpZmljYXRpb25zJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdFx0c3VjY2Vzczogbm90aWZ5XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCQuYWpheCB7XHJcblxyXG5cdFx0XHRcdHVybDogdXJsICsgJy9tZXNzYWdlcycsXHJcblx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdFx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0XHRcdHN1Y2Nlc3M6IG1lc3NhZ2UsXHJcblx0XHRcdH1cclxuXHJcblx0c2V0VGltZW91dCBsb2FkLCBkYXRhLm5leHRVcGRhdGUgKiAxMDAwXHJcblxyXG5cclxubm90aWZ5ID0gKGRhdGEpIC0+XHJcblx0Zm9yIG4gaW4gZGF0YVxyXG5cdFx0d2luZG93Lm5vdGlmeSB7XHJcblxyXG5cdFx0XHR0aXRsZTogJzxzdHJvbmc+JyArIG4udGl0bGUgKyAnPC9zdHJvbmc+JyxcclxuXHRcdFx0bWVzc2FnZTogJycsXHJcblx0XHRcdHVybDogJy9yZXBvcnRzLycgKyBuLmlkLFxyXG5cclxuXHRcdH1cclxuXHJcblx0aWYgd2luZG93LmFjdGl2ZVxyXG5cdFx0d2luZG93Lm5vdGlmeVNob3coKVxyXG5cclxubWVzc2FnZSA9IChkYXRhKSAtPlxyXG5cdGZvciBuIGluIGRhdGFcclxuXHRcdHdpbmRvdy5ub3RpZnkge1xyXG5cclxuXHRcdFx0dGl0bGU6ICc8c3Ryb25nPicgKyBuLmF1dGhvciArICc8L3N0cm9uZz46ICcgKyBuLnRpdGxlICsgJzxici8+JyxcclxuXHRcdFx0bWVzc2FnZTogbi5jb250ZW50LFxyXG5cdFx0XHR1cmw6ICcvbWVzc2FnZXMvaW5ib3gvJyArIG4uaWQsXHJcblxyXG5cdFx0fVxyXG5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblx0XHR3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5cclxuXHJcbmxvYWQgPSAtPlxyXG5cclxuXHQkLmFqYXgge1xyXG5cclxuXHRcdHVybDogdXJsLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRzdWNjZXNzOiBsb2FkZWRcclxuXHR9XHJcblxyXG5cclxuXHJcblx0XHJcbiQod2luZG93KS5mb2N1cyAtPlxyXG5cdGxvYWQoKVxyXG5cclxuXHJcbiQgLT5cclxuXHRsb2FkKCkiLCJcclxuc3F1YXJlID0gLT5cclxuXHJcblx0JCgnLnNxdWFyZScpLmVhY2ggLT5cclxuXHJcblx0XHRpZiAkKHRoaXMpLmRhdGEoJ3NxdWFyZScpID09ICd3aWR0aCdcclxuXHJcblx0XHRcdCQodGhpcykud2lkdGggJCh0aGlzKS5oZWlnaHQoKVxyXG5cdFx0ZWxzZVxyXG5cclxuXHRcdFx0JCh0aGlzKS5oZWlnaHQgJCh0aGlzKS53aWR0aCgpXHJcblxyXG4kIC0+XHJcblx0JCh3aW5kb3cpLnJlc2l6ZSAtPiBcclxuXHRcdHNxdWFyZSgpXHJcblx0XHRcclxuXHRzcXVhcmUoKSIsIlxyXG5jaGFuZ2VkID0gLT4gXHJcblx0Y3VycmVudCA9IHBhcnNlSW50ICgkKCcjY3VycmVudFN0YXRpc3RpY3NQb2ludHMnKS50ZXh0KCkgPyAwKVxyXG5cdGxlZnQgPSBwYXJzZUludCAkKCcjc3RhdGlzdGljc1BvaW50cycpLnRleHQoKVxyXG5cdG9sZCA9IHBhcnNlSW50ICgkKHRoaXMpLmRhdGEoJ29sZCcpID8gMClcclxuXHR2YWwgPSBwYXJzZUludCAoJCh0aGlzKS52YWwoKSA/IDApXHJcblx0ZGlmZiA9IHZhbCAtIG9sZFxyXG5cclxuXHRkaWZmID0gbGVmdCBpZiBkaWZmID4gbGVmdFxyXG5cdHZhbCA9IG9sZCArIGRpZmZcclxuXHRsZWZ0IC09IGRpZmZcclxuXHJcblx0aWYgbm90IGlzTmFOIGRpZmZcclxuXHJcblx0XHQkKHRoaXMpXHJcblx0XHRcdC52YWwgdmFsXHJcblx0XHRcdC5kYXRhICdvbGQnLCB2YWxcclxuXHJcblx0XHQkKCcjc3RhdGlzdGljc1BvaW50cycpXHJcblx0XHRcdC50ZXh0IGxlZnRcclxuXHJcblx0XHQkKCcuc3RhdGlzdGljJykuZWFjaCAtPlxyXG5cdFx0XHR2YWwgPSBwYXJzZUludCAkKHRoaXMpLnZhbCgpID8gMFxyXG5cdFx0XHQkKHRoaXMpLmF0dHIgJ21heCcsIGxlZnQgKyB2YWxcclxuXHJcblxyXG5yYW5kb20gPSAobWluLCBtYXgpIC0+IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluKVxyXG5cclxucmFuZG9tSW4gPSAoYXJyYXkpIC0+XHJcblx0aW5kZXggPSByYW5kb20oMCwgYXJyYXkubGVuZ3RoIC0gMSlcclxuXHRhcnJheVtpbmRleF1cclxuXHJcblxyXG5cclxuXHJcblxyXG5yb2xsID0gLT5cclxuXHJcblx0cm9sbGFibGUgPSAkKCcuc3RhdGlzdGljLnJvbGxhYmxlJylcclxuXHQkKHJvbGxhYmxlKS52YWwoMCkudHJpZ2dlcignY2hhbmdlJylcclxuXHRwb2ludHMgPSBwYXJzZUludCAkKCcjc3RhdGlzdGljc1BvaW50cycpLnRleHQoKVxyXG5cclxuXHJcblx0Zm9yIGkgaW4gWzEuLnBvaW50c11cclxuXHJcblx0XHRzdGF0aXN0aWMgPSByYW5kb21Jbihyb2xsYWJsZSlcclxuXHRcdHZhbCA9IHBhcnNlSW50ICQoc3RhdGlzdGljKS52YWwoKVxyXG5cdFx0JChzdGF0aXN0aWMpLnZhbCh2YWwgKyAxKVxyXG5cclxuXHJcblx0JChyb2xsYWJsZSkudHJpZ2dlciAnY2hhbmdlJ1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4kIC0+IFxyXG5cdCQoJy5zdGF0aXN0aWMnKVxyXG5cdFx0LmJpbmQgJ2tleXVwIGlucHV0IGNoYW5nZScsIGNoYW5nZWRcclxuXHRcdC50cmlnZ2VyICdjaGFuZ2UnXHJcblxyXG5cdCQoJy5zdGF0Um9sbGVyJylcclxuXHRcdC5jbGljayhyb2xsKVxyXG5cclxuXHRyb2xsKClcclxuIiwiXHJcbnJlZnJlc2hpbmcgPSBmYWxzZVxyXG5cclxucmVmcmVzaCA9IC0+XHJcblx0d2luZG93LmxvY2F0aW9uLnJlZnJlc2goKSBpZiBub3QgcmVmcmVzaGluZ1xyXG5cdHJlZnJlc2hpbmcgPSB0cnVlXHJcblxyXG51cGRhdGUgPSAodGltZXIpIC0+XHJcblx0YmFyID0gJCh0aW1lcikuY2hpbGRyZW4oJy5wcm9ncmVzcy1iYXInKS5sYXN0KClcclxuXHRsYWJlbCA9ICQodGltZXIpLmNoaWxkcmVuICcucHJvZ3Jlc3MtbGFiZWwnXHJcblx0dGltZSA9IE1hdGgucm91bmQgKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxMDAwLjBcclxuXHJcblxyXG5cdG1pbiA9ICQoYmFyKS5kYXRhICdtaW4nXHJcblx0bWF4ID0gJChiYXIpLmRhdGEgJ21heCdcclxuXHRzdG9wID0gJChiYXIpLmRhdGEgJ3N0b3AnXHJcblx0Y2EgPSAkKGJhcikuZGF0YSgnY2EnKVxyXG5cdGNiID0gJChiYXIpLmRhdGEoJ2NiJylcclxuXHJcblxyXG5cclxuXHRyZXZlcnNlZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JldmVyc2VkJykgPyBmYWxzZSlcclxuXHRyZWxvYWQgPSBCb29sZWFuKCQoYmFyKS5kYXRhKCdyZWxvYWQnKSA/IHRydWUpXHJcblxyXG5cdGlmIHN0b3A/XHJcblx0XHR0aW1lID0gTWF0aC5taW4gdGltZSwgc3RvcFxyXG5cclxuXHRub3cgPSBNYXRoLmNsYW1wKHRpbWUsIG1pbiwgbWF4KVxyXG5cclxuXHJcblx0cGVyY2VudCA9IChub3cgLSBtaW4pIC8gKG1heCAtIG1pbilcclxuXHRwZXJjZW50ID0gMSAtIHBlcmNlbnQgaWYgcmV2ZXJzZWRcclxuXHJcblxyXG5cclxuXHJcblx0JChiYXIpLmNzcyAnd2lkdGgnLCAocGVyY2VudCAqIDEwMCkgKyAnJSdcclxuXHQkKGJhcikuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgTWF0aC5sZXJwQ29sb3JzKHBlcmNlbnQsIGNhLCBjYikpIGlmIGNhPyBhbmQgY2I/XHJcblx0JChsYWJlbCkudGV4dCB3aW5kb3cudGltZUZvcm1hdD8gbWF4IC0gbm93XHJcblxyXG5cdHJlZnJlc2goKSBpZiB0aW1lID4gbWF4IGFuZCByZWxvYWRcclxuXHJcblx0c2V0VGltZW91dCAtPiB1cGRhdGUgdGltZXIsIDEwMDAgI2lmIHRpbWUgPD0gbWF4XHJcblxyXG5cclxuJCAtPlxyXG5cdCQoJy5wcm9ncmVzcy10aW1lJykuZWFjaCAtPlxyXG5cdFx0dXBkYXRlIHRoaXNcclxuXHJcblxyXG5cclxuXHJcbiIsIiQgLT5cclxuXHQkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZWFjaCgtPlxyXG5cclxuXHRcdG9wdGlvbnMgPSB7XHJcblxyXG5cdFx0XHRodG1sOiB0cnVlLFxyXG5cdFx0XHRwbGFjZW1lbnQ6ICdhdXRvIGxlZnQnXHJcblx0XHR9XHJcblxyXG5cdFx0dHJpZ2dlciA9ICQodGhpcykuZGF0YSgndHJpZ2dlcicpXHJcblxyXG5cdFx0aWYgdHJpZ2dlcj9cclxuXHRcdFx0b3B0aW9ucy50cmlnZ2VyID0gdHJpZ2dlclxyXG5cclxuXHJcblx0XHQkKHRoaXMpLnRvb2x0aXAob3B0aW9ucylcclxuXHQpIiwiXHJcbiQgLT5cclxuXHJcblx0dHV0b3JpYWxzID0ge31cclxuXHQkKCcudHV0b3JpYWwtc3RlcCcpLnBvcG92ZXIoe3RyaWdnZXI6ICdtYW51YWwnLCBwbGFjZW1lbnQ6ICdib3R0b20nfSlcclxuXHJcblx0c2hvdyA9IChzdGVwKSAtPlxyXG5cclxuXHRcdGlmIHN0ZXA/XHJcblxyXG5cdFx0XHQkKHN0ZXAuZWxlbWVudHMpXHJcblx0XHRcdFx0LmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0XHQuYWRkQ2xhc3MoJ3R1dG9yaWFsLWFjdGl2ZScpXHJcblx0XHRcdFx0LmZpcnN0KClcclxuXHRcdFx0XHQucG9wb3Zlcignc2hvdycpXHJcblxyXG5cclxuXHRjbGlja2VkID0gKCkgLT5cclxuXHJcblx0XHRuZXh0ID0gdHV0b3JpYWxzW3RoaXMuc3RlcC5uYW1lXS5zaGlmdCgpXHJcblxyXG5cdFx0aWYgbmV4dD9cclxuXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IG5leHQuaW5kZXh9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KC0+XHJcblxyXG5cdFx0XHRcdHNob3cobmV4dClcclxuXHRcdFx0LCA1MDApXHJcblx0XHRlbHNlXHJcblx0XHRcdCQuYWpheCh7XHJcblxyXG5cdFx0XHRcdHVybDogJy9hcGkvY2hhcmFjdGVyL3R1dG9yaWFsJyxcclxuXHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IHtuYW1lOiB0aGlzLnN0ZXAubmFtZSwgc3RhZ2U6IHRoaXMuc3RlcC5pbmRleCArIDF9LFxyXG5cdFx0XHRcdG1ldGhvZDogJ1BPU1QnLFx0XHJcblx0XHRcdH0pXHJcblx0XHRcclxuXHJcblxyXG5cclxuXHRcdCQodGhpcy5zdGVwLmVsZW1lbnRzKS51bmJpbmQoJ2NsaWNrJywgY2xpY2tlZClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCd0dXRvcmlhbC1hY3RpdmUnKVxyXG5cdFx0XHQucG9wb3ZlcignaGlkZScpXHJcblxyXG5cclxuXHRyZWNlaXZlID0gKG9iamVjdCwgbmFtZSwgZGF0YSkgLT5cclxuXHJcblx0XHRpZiBkYXRhLnN0YWdlIDwgMFxyXG5cclxuXHJcblx0XHRcdG1vZGFsID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwgZmFkZScpXHJcblx0XHRcdGRpYWxvZyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWRpYWxvZycpXHJcblx0XHRcdGNvbnRlbnQgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1jb250ZW50JylcclxuXHRcdFx0aGVhZGVyID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnbW9kYWwtaGVhZGVyJylcclxuXHRcdFx0Ym9keSA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ21vZGFsLWJvZHknKVxyXG5cdFx0XHRmb290ZXIgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdtb2RhbC1mb290ZXInKVxyXG5cdFx0XHR0aXRsZSA9ICQoJzxoND48L2g0PicpLmFkZENsYXNzKCdtb2RhbC10aXRsZScpXHJcblxyXG5cdFx0XHRncm91cCA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2J0bi1ncm91cCcpXHJcblx0XHRcdGJ0bjEgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdidG4gYnRuLXN1Y2Nlc3MnKS5hdHRyKCd2YWx1ZScsICd5ZXMnKS50ZXh0KCd5ZXMnKVxyXG5cdFx0XHRidG4yID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnYnRuIGJ0bi1kYW5nZXInKS5hdHRyKCd2YWx1ZScsICdubycpLnRleHQoJ25vJylcclxuXHJcblx0XHRcdCQoYnRuMSkuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YToge25hbWU6IG5hbWUsIGFjdGl2ZTogMX0sXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcdFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdCQobW9kYWwpLm1vZGFsKCdoaWRlJylcclxuXHJcblx0XHRcdFx0bG9hZChvYmplY3QsIG5hbWUsIGRhdGEpXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQoYnRuMikuY2xpY2soLT5cclxuXHJcblx0XHRcdFx0JC5hamF4KHtcclxuXHJcblx0XHRcdFx0XHR1cmw6ICcvYXBpL2NoYXJhY3Rlci90dXRvcmlhbCcsXHJcblx0XHRcdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRcdFx0ZGF0YToge25hbWU6IG5hbWUsIGFjdGl2ZTogMH0sXHJcblx0XHRcdFx0XHRtZXRob2Q6ICdQT1NUJyxcdFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdCQobW9kYWwpLm1vZGFsKCdoaWRlJylcclxuXHJcblx0XHRcdClcclxuXHJcblx0XHRcdCQodGl0bGUpXHJcblx0XHRcdFx0LnRleHQoZGF0YS50aXRsZSlcclxuXHJcblx0XHRcdCQoYm9keSlcclxuXHRcdFx0XHQudGV4dChkYXRhLmRlc2NyaXB0aW9uKVxyXG5cclxuXHRcdFx0JChoZWFkZXIpXHJcblx0XHRcdFx0LmFwcGVuZCh0aXRsZSlcclxuXHJcblxyXG5cdFx0XHQkKGdyb3VwKVxyXG5cdFx0XHRcdC5hcHBlbmQoYnRuMilcclxuXHRcdFx0XHQuYXBwZW5kKGJ0bjEpXHJcblxyXG5cdFx0XHQkKGZvb3RlcilcclxuXHRcdFx0XHQuYXBwZW5kKGdyb3VwKVxyXG5cclxuXHJcblx0XHRcdCQoY29udGVudClcclxuXHRcdFx0XHQuYXBwZW5kKGhlYWRlcilcclxuXHRcdFx0XHQuYXBwZW5kKGJvZHkpXHJcblx0XHRcdFx0LmFwcGVuZChmb290ZXIpXHJcblxyXG5cdFx0XHQkKGRpYWxvZylcclxuXHRcdFx0XHQuYXBwZW5kKGNvbnRlbnQpXHJcblxyXG5cdFx0XHQkKG1vZGFsKVxyXG5cdFx0XHRcdC5hcHBlbmQoZGlhbG9nKVxyXG5cclxuXHRcdFx0JCgnYm9keScpXHJcblx0XHRcdFx0LmFwcGVuZChtb2RhbClcclxuXHJcblx0XHRcdCQobW9kYWwpLm1vZGFsKHtiYWNrZHJvcDogJ3N0YXRpYycsIHNob3c6IHRydWUsIGtleWJvYXJkOiBmYWxzZX0pXHJcblxyXG5cclxuXHRcdGVsc2VcclxuXHRcdFx0bG9hZChvYmplY3QsIG5hbWUsIGRhdGEpXHJcblxyXG5cclxuXHJcblx0bG9hZCA9IChvYmplY3QsIG5hbWUsIGRhdGEpIC0+XHJcblxyXG5cdFx0dHV0b3JpYWwgPSBbXVxyXG5cclxuXHRcdCQob2JqZWN0KS5maW5kKCcudHV0b3JpYWwtc3RlcCcpLmVhY2goLT5cclxuXHJcblx0XHRcdHN0ZXAgPSBudWxsXHJcblx0XHRcdGluZGV4ID0gJCh0aGlzKS5kYXRhKCd0dXRvcmlhbC1pbmRleCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gaWYgaW5kZXggPCBkYXRhLnN0YWdlXHJcblxyXG5cclxuXHJcblx0XHRcdGlmIHR1dG9yaWFsW2luZGV4XT9cclxuXHRcdFx0XHRzdGVwID0gdHV0b3JpYWxbaW5kZXhdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzdGVwID0ge1xyXG5cclxuXHRcdFx0XHRcdGVsZW1lbnRzOiBbXSxcclxuXHRcdFx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdFx0XHRpbmRleDogaW5kZXgsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHR1dG9yaWFsW2luZGV4XSA9IHN0ZXBcclxuXHJcblxyXG5cdFx0XHRzdGVwLmVsZW1lbnRzLnB1c2godGhpcylcclxuXHRcdFx0dGhpcy5zdGVwID0gc3RlcFxyXG5cdFx0KVxyXG5cclxuXHRcdHR1dG9yaWFsID0gdHV0b3JpYWwuZmlsdGVyKChlbGVtZW50KSAtPlxyXG5cclxuXHRcdFx0aWYgZWxlbWVudD9cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHQpXHJcblxyXG5cclxuXHJcblx0XHR0dXRvcmlhbHNbbmFtZV0gPSB0dXRvcmlhbFxyXG5cdFx0c2hvdyh0dXRvcmlhbC5zaGlmdCgpKVxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0JCgnW2RhdGEtdHV0b3JpYWw9dHJ1ZScpLmVhY2goLT5cclxuXHJcblx0XHRuYW1lID0gJCh0aGlzKS5kYXRhKCd0dXRvcmlhbC1uYW1lJylcclxuXHJcblx0XHQkLmFqYXgoe1xyXG5cclxuXHRcdFx0dXJsOiAnL2FwaS9jaGFyYWN0ZXIvdHV0b3JpYWwnLFxyXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdFx0XHRkYXRhOiB7bmFtZTogbmFtZX0sXHJcblx0XHRcdG1ldGhvZDogJ0dFVCcsXHJcblx0XHRcdHN1Y2Nlc3M6IChkYXRhKSA9PlxyXG5cdFx0XHRcdHJlY2VpdmUodGhpcywgbmFtZSwgZGF0YSkgaWYgZGF0YS5hY3RpdmVcclxuXHRcdH0pXHJcblx0KSIsIndpbmRvdy5mb3JtYXQgb3I9IFxyXG5cdHRpbWU6XHJcblx0XHRkYXk6ICdkJ1xyXG5cdFx0aG91cjogJ2gnXHJcblx0XHRtaW51dGU6ICdtJ1xyXG5cdFx0c2Vjb25kOiAncydcclxuXHJcblxyXG5cclxuXHJcbndpbmRvdy5hY3RpdmUgPz0gZmFsc2VcclxuXHJcblxyXG5cclxuJCh3aW5kb3cpLmZvY3VzIC0+XHJcblx0d2luZG93LmFjdGl2ZSA9IHRydWVcclxuXHJcbiQod2luZG93KS5ibHVyIC0+XHJcblx0d2luZG93LmFjdGl2ZSA9IGZhbHNlXHJcblxyXG4kKHdpbmRvdykucmVzaXplIC0+XHJcblx0Y2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVG8pIGlmIHRoaXMucmVzaXplVG9cclxuXHR0aGlzLnJlc2l6ZVRvID0gc2V0VGltZW91dCgtPlxyXG5cdFx0JCh0aGlzKS50cmlnZ2VyKCdyZXNpemVkJylcclxuXHQsIDUwMClcclxuXHRcclxuXHJcblxyXG5cclxud2luZG93LmxwYWQgb3I9ICh2YWx1ZSwgcGFkZGluZykgLT5cclxuICB6ZXJvZXMgPSBcIjBcIlxyXG4gIHplcm9lcyArPSBcIjBcIiBmb3IgaSBpbiBbMS4ucGFkZGluZ11cclxuXHJcbiAgKHplcm9lcyArIHZhbHVlKS5zbGljZShwYWRkaW5nICogLTEpXHJcblxyXG5cclxudGltZVNlcGFyYXRlID0gKHZhbHVlKSAtPlxyXG5cdGlmIHZhbHVlLmxlbmd0aCA+IDBcclxuXHRcdHZhbHVlICsgJyAnXHJcblx0ZWxzZVxyXG5cdFx0dmFsdWVcclxuXHJcbnRpbWVGb3JtYXQgPSAodGV4dCwgdmFsdWUsIGZvcm1hdCkgLT5cclxuXHR0ZXh0ID0gdGltZVNlcGFyYXRlKHRleHQpXHJcblxyXG5cdGlmIHRleHQubGVuZ3RoID4gMFxyXG5cdFx0dGV4dCArPSB3aW5kb3cubHBhZCB2YWx1ZSwgMlxyXG5cdGVsc2UgXHJcblx0XHR0ZXh0ICs9IHZhbHVlXHJcblxyXG5cdHRleHQgKyBmb3JtYXRcclxuXHJcblxyXG53aW5kb3cudGltZUZvcm1hdCBvcj0gKHZhbHVlKSAtPlxyXG5cdHRleHQgPSAnJ1xyXG5cdGRhdGUgPSBuZXcgRGF0ZSh2YWx1ZSAqIDEwMDApXHJcblx0ZCA9IGRhdGUuZ2V0VVRDRGF0ZSgpIC0gMVxyXG5cdGggPSBkYXRlLmdldFVUQ0hvdXJzKClcclxuXHRtID0gZGF0ZS5nZXRVVENNaW51dGVzKClcclxuXHRzID0gZGF0ZS5nZXRVVENTZWNvbmRzKClcclxuXHJcblx0dGV4dCArPSBkICsgZm9ybWF0LnRpbWUuZGF5IGlmIGQgPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgaCwgZm9ybWF0LnRpbWUuaG91cikgaWYgaCA+IDBcclxuXHR0ZXh0ID0gdGltZUZvcm1hdCh0ZXh0LCBtLCBmb3JtYXQudGltZS5taW51dGUpIGlmIGggPiAwIG9yIG0gPiAwXHJcblx0dGV4dCA9IHRpbWVGb3JtYXQodGV4dCwgcywgZm9ybWF0LnRpbWUuc2Vjb25kKSBpZiBoID4gMCBvciBtID4gMCBvciBzID4gMFxyXG5cclxuXHR0ZXh0XHJcblxyXG5yZWZyZXNoaW5nID0gZmFsc2VcclxuXHJcblxyXG53aW5kb3cubG9jYXRpb24ucmVmcmVzaCBvcj0gLT5cclxuXHRpZiBub3QgcmVmcmVzaGluZ1xyXG5cdFx0cmVmcmVzaGluZyA9IHRydWVcclxuXHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSlcclxuXHJcblxyXG5cclxuXHJcbm5vdGlmaWNhdGlvbnMgPSBbXVxyXG53aW5kb3cubm90aWZ5IG9yPSAocHJvcHMpLT5cclxuXHRub3RpZmljYXRpb25zLnB1c2ggcHJvcHNcclxuXHJcblxyXG5jbG9uZSA9IChvYmopIC0+XHJcblx0cmV0dXJuIG9iaiAgaWYgb2JqIGlzIG51bGwgb3IgdHlwZW9mIChvYmopIGlzbnQgXCJvYmplY3RcIlxyXG5cdHRlbXAgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKClcclxuXHRmb3Iga2V5IG9mIG9ialxyXG5cdFx0dGVtcFtrZXldID0gY2xvbmUob2JqW2tleV0pXHJcblx0dGVtcFxyXG5cclxuc2hvd05vdGlmeSA9IChuLCBpKSAtPlxyXG5cdGNvbnNvbGUubG9nKCdQJywgbiwgaSk7XHJcblx0c2V0VGltZW91dCAoLT4gXHJcblx0XHRjb25zb2xlLmxvZygnUycsIG4sIGkpO1xyXG5cdFx0JC5ub3RpZnkobiwge1xyXG5cclxuXHRcdFx0cGxhY2VtZW50OiB7XHJcblxyXG5cdFx0XHRcdGZyb206ICdib3R0b20nLFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtb3VzZV9vdmVyOiAncGF1c2UnLFxyXG5cclxuXHRcdFx0fSkpLCBpICogMTAwMFxyXG5cdFxyXG5cclxuXHJcblxyXG53aW5kb3cubm90aWZ5U2hvdyBvcj0gLT5cclxuXHRpZiB3aW5kb3cuYWN0aXZlXHJcblxyXG5cdFx0Zm9yIG5vdGlmaWNhdGlvbiwgaW5kZXggaW4gbm90aWZpY2F0aW9uc1xyXG5cdFx0XHRzaG93Tm90aWZ5ICQuZXh0ZW5kKHt9LCBub3RpZmljYXRpb24pLCBpbmRleFxyXG5cdFx0bm90aWZpY2F0aW9ucyA9IFtdXHJcblxyXG5cclxuXHJcbiQod2luZG93KS5mb2N1cyAtPiB3aW5kb3cubm90aWZ5U2hvdygpXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuTWF0aC5jbGFtcCBvcj0gKHZhbHVlLCBtaW4sIG1heCkgLT5cclxuXHRNYXRoLm1heChNYXRoLm1pbih2YWx1ZSwgbWF4KSwgbWluKVxyXG5cclxuXHJcbk1hdGgubGVycCBvcj0gKGksIGEsIGIpIC0+XHJcblx0KGEgKiBpKSArIChiICogKDEgLSBpKSlcclxuXHJcblxyXG5cclxuTWF0aC5oZXhUb1JnYiBvcj0gKGhleCkgLT4gXHJcbiAgICByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbiAgICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcclxuXHJcbiAgICB9IGlmIHJlc3VsdDtcclxuICAgIG51bGw7XHJcblxyXG5NYXRoLnJnYlRvSGV4IG9yPSAociwgZywgYikgLT5cclxuICAgIHJldHVybiBcIiNcIiArICgoMSA8PCAyNCkgKyAociA8PCAxNikgKyAoZyA8PCA4KSArIGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxuXHJcblxyXG5NYXRoLmxlcnBDb2xvcnMgb3I9IChpLCBhLCBiKSAtPlxyXG5cclxuXHRjYSA9IE1hdGguaGV4VG9SZ2IgYVxyXG5cdGNiID0gTWF0aC5oZXhUb1JnYiBiXHJcblxyXG5cdGNjID0ge1xyXG5cdFx0cjogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuciwgY2IucikpLFxyXG5cdFx0ZzogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuZywgY2IuZykpLFxyXG5cdFx0YjogTWF0aC5yb3VuZChNYXRoLmxlcnAoaSwgY2EuYiwgY2IuYikpLFxyXG5cdH1cclxuXHJcblx0cmV0dXJuIE1hdGgucmdiVG9IZXgoY2MuciwgY2MuZywgY2MuYilcclxuXHJcblxyXG5cclxuXHJcblxyXG51cGRhdGVQcm9ncmVzcyA9IC0+XHJcblx0YmFyID0gJCh0aGlzKS5jaGlsZHJlbignLnByb2dyZXNzLWJhcicpXHJcblx0bGFiZWwgPSAkKHRoaXMpLmNoaWxkcmVuKCcucHJvZ3Jlc3MtbGFiZWwnKVxyXG5cclxuXHRtaW4gPSAkKGJhcikuZGF0YSgnbWluJylcclxuXHRtYXggPSAkKGJhcikuZGF0YSgnbWF4JylcclxuXHRjYSA9ICQoYmFyKS5kYXRhKCdjYScpXHJcblx0Y2IgPSAkKGJhcikuZGF0YSgnY2InKVxyXG5cdG5vdyA9IE1hdGguY2xhbXAoJChiYXIpLmRhdGEoJ25vdycpLCBtaW4sIG1heClcclxuXHRyZXZlcnNlZCA9IEJvb2xlYW4oJChiYXIpLmRhdGEoJ3JldmVyc2VkJykgPyBmYWxzZSlcclxuXHJcblx0cGVyY2VudCA9IChub3cgLSBtaW4pIC8gKG1heCAtIG1pbikgKiAxMDBcclxuXHRwZXJjZW50ID0gMTAwIC0gcGVyY2VudCBpZiByZXZlcnNlZFxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0JChiYXIpLmNzcygnd2lkdGgnLCBwZXJjZW50ICsgJyUnKVxyXG5cdCQoYmFyKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBNYXRoLmxlcnBDb2xvcnMocGVyY2VudCAvIDEwMCwgY2EsIGNiKSkgaWYgY2E/IGFuZCBjYj9cclxuXHJcblxyXG5cclxuXHQkKGxhYmVsKS50ZXh0KG5vdyArICcgLyAnICsgbWF4KVxyXG5cclxuJCAtPiBcclxuXHQkKCcucHJvZ3Jlc3MnKS5lYWNoIC0+XHJcblx0XHR0aGlzLnVwZGF0ZSBvcj0gdXBkYXRlUHJvZ3Jlc3NcclxuXHJcblxyXG5cclxucmVsTW91c2VDb29yZHMgPSBgZnVuY3Rpb24gKGV2ZW50KXtcclxuICAgIHZhciB0b3RhbE9mZnNldFggPSAwO1xyXG4gICAgdmFyIHRvdGFsT2Zmc2V0WSA9IDA7XHJcbiAgICB2YXIgY2FudmFzWCA9IDA7XHJcbiAgICB2YXIgY2FudmFzWSA9IDA7XHJcbiAgICB2YXIgY3VycmVudEVsZW1lbnQgPSB0aGlzO1xyXG5cclxuICAgIGRve1xyXG4gICAgICAgIHRvdGFsT2Zmc2V0WCArPSBjdXJyZW50RWxlbWVudC5vZmZzZXRMZWZ0IC0gY3VycmVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcclxuICAgICAgICB0b3RhbE9mZnNldFkgKz0gY3VycmVudEVsZW1lbnQub2Zmc2V0VG9wIC0gY3VycmVudEVsZW1lbnQuc2Nyb2xsVG9wO1xyXG4gICAgfVxyXG4gICAgd2hpbGUoY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5vZmZzZXRQYXJlbnQpXHJcblxyXG4gICAgY2FudmFzWCA9IGV2ZW50LnBhZ2VYIC0gdG90YWxPZmZzZXRYO1xyXG4gICAgY2FudmFzWSA9IGV2ZW50LnBhZ2VZIC0gdG90YWxPZmZzZXRZO1xyXG5cclxuICAgIHJldHVybiB7eDpjYW52YXNYLCB5OmNhbnZhc1l9XHJcbn1gXHJcblxyXG5IVE1MQ2FudmFzRWxlbWVudC5wcm90b3R5cGUucmVsTW91c2VDb29yZHMgPSByZWxNb3VzZUNvb3JkczsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=