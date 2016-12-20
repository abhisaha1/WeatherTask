const $ = require('jquery');
const weatherJson = require('./weather-icons.json');
$(function() {
    let townContainer = [];
    let tileCount = 1; 

    const params = {
        townInput: $('input[name="town"]'),
        addTownBtn: $('button[name="add-town"]'),
        removeBtn: 'button[name="remove-town"]',
        template: $('.template'),
        tiles: $('.tiles'),
    }

    /* Add Town Action */
    params.addTownBtn.click(function() {
        var town = params.townInput.val();
        var weatherType = $('.weather-type:checked').val();
        if (town === "") {
            alert('Please, enter a valid town');
            return false;
        }
        addTile(town, weatherType);
        params.townInput.val(""); 
        return false;
    });

    /* Remove Rown Action */
    $(document).on('click', params.removeBtn, function() {
        $(this).closest('.tile-town').remove();
        return false;
    });

    /* Combine town and type of selection */
    const combineTownType = function(town, type) {
      return  (town + '-' + type).toLowerCase();
    }

    /* Add Tile */
    const addTile = function(town, type) {
        type = (typeof type == 'undefined') ? 'current': type;
        let totalDays = 1;
        if (type == 'forecast') {
            totalDays = 4;
        }
        if(townContainer.indexOf(combineTownType(town,type)) >= 0) {
           alert('Town already exist');
           return;
        }

        for (let day = 1; day <= totalDays; day++) {
            let $tileFactory = params.template.clone().removeClass('template')
                                .attr('rel', town)
                                .attr('data-day', day)
                                .attr('data-id',tileCount);

            $('h1.city-title', $tileFactory).text(town);
            params.tiles.append($tileFactory);
            fillTile(town, tileCount, type);
            tileCount++;
        }
    };

    /* Fill tile with information */
    const fillTile = function(town, tileCount, type) {
        let $tile = $('.tile-town[rel="' + town + '"][data-id="' + tileCount + '"]');
        let url = 'http://api.openweathermap.org/data/2.5/weather';

        if (type == 'forecast') {
            url = 'http://api.openweathermap.org/data/2.5/forecast';
        }

        $.ajax({
            url: url,
            data: {
                'q': town,
                'units': 'metric',
                'APPID': 'a6ba8b9fe621c2e1e9449f47554818c4'
            },
            success: function(response) {
                if (response.cod == 200) {
                    let day = $tile.attr('data-day');
                    let weatherDay = (type == 'forecast') ? response.list[8 * day]: response;
                    let date = new Date(weatherDay.dt * 1000);
                    $('.date', $tile).text(date.toLocaleDateString());
                    $('h1.city-title', $tile).text(response.name);
                    $('.degrees .temp-real', $tile).html(weatherDay.main.temp.toFixed(1) + '&deg;C');
                    $('.degrees .temp-max', $tile).html(weatherDay.main.temp_max.toFixed(1) + '&deg;C');
                    $('.degrees .temp-min', $tile).html(weatherDay.main.temp_min.toFixed(1) + '&deg;C');
                    $('#condition', $tile).text(weatherDay.weather[0].description);
                    $('.speed', $tile).text(weatherDay.wind.speed + ' m/s');
                    $('.icon', $tile).html('<i class="' + translateIcon(weatherDay.weather[0].main) + '"></i>');
                    townContainer.push(combineTownType(town,type));
                    
                } else {
                    $('h1', $tile).text('Town not found');
                    $('#wind', $tile).text('');
                }
            },
            error: function(error) {
                console.log(error);
            }
        });


    };

    const translateIcon = function(weather) {
        let prefix = 'wi ';
        let icon = (weatherJson[weather] && weatherJson[weather].icon) || weatherJson['Sunny'].icon;
        return prefix + icon;
    };

    /** 
     * addTitle(city, type) 
     * type - current/forecast
     * */
    addTile('Berlin','current');
    addTile('Hamburg','forecast');
});