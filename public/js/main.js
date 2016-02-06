$(document).ready(function() {

	// Active states
	var activeUser = $('.users .active').find("p.name").text(),
	activeUserPhoto = $('.user.active').find(".pic").children("img").attr("src");
	$('#recipient').text(activeUser);
	$('.message.left').find('.pic').children('img').attr('src', activeUserPhoto);

	// // Triger the recipient name and image
	// $('.user').click(function() {
	// 	var name = $(this).find("p.name").text(),
	// 	photo = $(this).find('img').attr('src');
	// 	$('#recipient').text(name);
	// 	// alert(photo);
	// 	$('.message.left').find('.pic').children('img').attr('src', photo);
	// });

$(document).on('click', '.user', function() {
	var userId = $(this).find("#userId").val();
	$.ajax({
		url: '/api/message/' + userId,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			data.room.messages.forEach(function(message) {
				var html = '';
				if (message.creator._id !== userId) {

					html += '<div class="message right">';
					html += '<span class="pic"><img src="' + message.creator.picture + '" alt="user"></span>';
					html += '<div class="bubble right">';
					html += '<p>' + message.message + '</p>';
					html += '<small class="time">12:03<i class="material-icons sent">done_all</i></small>';
					html += '</div></div>';

				} else {
					html += '<div class="message left">';
					html += '<span class="pic"><img src="' + message.creator.picture + '" alt="user"></span>';
					html += '<div class="bubble left">';
					html += '<p>' + message.message + '</p>';
					html += '<small class="time">12:03<i class="material-icons sent">done_all</i></small>';
					html += '</div></div>';

				}

				$('.chat-msgs').append(html);
			})
		}

	});

})

});