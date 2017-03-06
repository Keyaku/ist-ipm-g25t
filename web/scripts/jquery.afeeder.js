/*
** aFeeder jQuery RSS Feed Plugin
** Uses rss2json, https://rss2json.com/
** Author: @Keyaku, https://github.com/Keyaku
*/

(function($) {
    $.fn.aFeeder = function(opt) {
        var def = $.extend({
			feedURL       : null,
			offline       : false,
			key           : '0000000000000000000000000000000000000000',
			maxCount      : 5,
			showDesc      : true,
			descCharLimit : 0,
			onComplete    : function() {},
        }, opt);

		var container = $(this);

		/* Stop everything if feedURL is undefined */
		if (def.feedURL == undefined) {
			/* If it's not supposed to be offline, attach a message */
			if (!offline) {
				container.empty();
				container.append("<p>No feed URL defined.</p>");
			}
			return;
		}

        $.ajax({
            url: 'https://api.rss2json.com/v1/api.json',
			method: 'GET',
            dataType: "json",
			data: {
				rss_url: def.feedURL,
	            api_key: def.key,
	            count: def.maxCount,
			}
		}).done(function(response) {
			/* Throw error message */
			if (response.status != 'ok') { throw response.message; }

			/* Parsing HTML */
			var s = "";
			$.each(response.items, function(i, item) {
				/* Opening list item */
				s += "<li"

				/* Fetching image */
				// FIXME: Doesn't work properly or at all
				if (item.content.includes("<img")) {
					var img = item.content;
					img = img.substring(img.indexOf("src=\"") + 5);
					img = img.substring(0, img.indexOf("\""));

					s += ' style="background-image: url(\'' + img + '\'); background-size: cover;"';
				}

				/* Closing link */
				s += '><a class="newsTitle" href="' + item.link + '">' + item.title + '</a>';

				/* Showing description */
				if (def.showDesc) {
					s += '<div class="newsDescription">';
					if (def.descCharLimit > 0 && item.description.length > def.descCharLimit) {
						s += item.description.substring(0, def.descCharLimit) + '...';
					} else {
						s += item.description;
					}
					s += '</div>';
				}

				/* Closing list item */
				s += "</li>"
			});

			/* Appending final HTML string */
			container.empty();
			container.append('<ul class="overview">' + s + '</ul>');

			/* Activating attached callback */
			def.onComplete();
		});
    };
})(jQuery);
