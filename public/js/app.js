// Copy the city page url to the user's clipboard
var clipboardButton = $('.copy-city-url'),
		clipboard = new Clipboard('.copy-city-url');

clipboard.on('success', function(e){
	$(clipboardButton).addClass('url-copy-success');
});

// Remove the class added after the animation completes
$(clipboardButton).on('webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function(){
	$(clipboardButton).removeClass('url-copy-success');
});