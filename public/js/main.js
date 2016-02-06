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

	$(document).on('click', '#userId', function() {
		var userId = $(this).val();
		console.log(userId);
		$.ajax({
			url: '/api/message/' + userId,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				console.log(data);
			}
			
		});

	})

});