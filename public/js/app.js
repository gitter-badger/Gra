(function() {
  var equalize, getColumns, getPrefix, getSize, widths;

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

  $(function() {
    $(window).resize(function() {
      return equalize();
    });
    return equalize();
  });

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
    output = $(this).parent().children('.range-value');
    before = (ref = $(output).data('before')) != null ? ref : '';
    after = (ref1 = $(output).data('after')) != null ? ref1 : '';
    value = (ref2 = $(this).val()) != null ? ref2 : 0;
    return $(output).text(before + value + after);
  };

  numberDecrease = function(event) {
    var input, max, min, ref, ref1, ref2, ref3, step, value;
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
  var fill, load, loaded, notify, setProgress, setValue, setValues, url;

  url = '/api/character';

  setProgress = function(object, value, minValue, maxValue, lastUpdate, nextUpdate) {
    var bar, child, timer;
    bar = $('.' + object + '-bar');
    timer = $('.' + object + '-timer');
    if (bar.length > 0) {
      child = $(bar).children('.progress-bar');
      $(child).data('max', maxValue).data('min', minValue).data('now', value);
      bar[0].update();
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
    setValue('level', data.level);
    setValue('plantator-level', data.plantatorLevel);
    setValue('smuggler-level', data.smugglerLevel);
    setValue('dealer-level', data.dealerLevel);
    setValue('strength', data.strength, setValue('perception', data.perception));
    setValue('endurance', data.endurance);
    setValue('charisma', data.charisma);
    setValue('intelligence', data.intelligence);
    setValue('agility', data.agility);
    setValue('luck', data.luck + '%');
    setValue('statisticPoints', data.statisticPoints);
    setValue('talentPoints', data.talentPoints);
    setValue('money', '$' + data.money);
    return setValue('reports', data.reportsCount);
  };

  loaded = function(data) {
    fill(data);
    if (data.reload) {
      window.reload();
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
    return window.notifyShow();
  };

  load = function() {
    $.ajax({
      url: url,
      dataType: 'json',
      method: 'GET',
      success: loaded
    });
    return $.ajax({
      url: url + '/notifications',
      dataType: 'json',
      mathod: 'GET',
      success: notify
    });
  };

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
  var changed;

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

  $(function() {
    return $('.statistic').bind('keyup input change', changed).trigger('change');
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
    var bar, label, max, min, now, percent, ref, ref1, reload, reversed, stop, time;
    bar = $(timer).children('.progress-bar').last();
    label = $(timer).children('.progress-label');
    time = Math.round((new Date).getTime() / 1000.0);
    min = $(bar).data('min');
    max = $(bar).data('max');
    stop = $(bar).data('stop');
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
    return $('[data-toggle="tooltip"]').tooltip({
      html: true,
      placement: 'auto left'
    });
  });

}).call(this);

(function() {
  var base, clone, notifications, showNotify, timeFormat, timeSeparate, updateProgress;

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

  (base = window.location).refresh || (base.refresh = function() {
    var loc;
    loc = window.location;
    return window.location = loc.protocol + '//' + loc.host + loc.pathname + loc.search;
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

  updateProgress = function() {
    var bar, label, max, min, now, percent, ref, reversed;
    bar = $(this).children('.progress-bar');
    label = $(this).children('.progress-label');
    min = $(bar).data('min');
    max = $(bar).data('max');
    now = Math.clamp($(bar).data('now'), min, max);
    reversed = Boolean((ref = $(bar).data('reversed')) != null ? ref : false);
    percent = (now - min) / (max - min) * 100;
    if (reversed) {
      percent = 100 - percent;
    }
    $(bar).css('width', percent + '%');
    return $(label).text(now + ' / ' + max);
  };

  $(function() {
    return $('.progress').each(function() {
      return this.update || (this.update = updateProgress);
    });
  });

}).call(this);

//# sourceMappingURL=app.js.map