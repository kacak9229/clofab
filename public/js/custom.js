$(function() {

  var socket = io();


  function friendRequests(data) {
    var html = '';
    html += '<li class=' + data._id + '>';
    html += '<span class="item"><span class="item-left">'
    html += '<img class="img-responsive friend-request-img" src='+ data.picture + ' alt=""/>';
    html += '<span class="item-info">';
    html += '<span>' + data.username + '</span>';
    html += '</span>';
    html += '<span class="item-right button-request">';
    html += '<button class="btn btn-xs btn-danger pull-right" id="decline-friend-request" value=' +  data._id + '>Decline</button>';
    html += '<button class="btn btn-xs btn-success pull-right" id="add-friend-request" value=' +  data._id + '>Accept</button>';
    html += '</span></span></li>';
    
    return html;
  }

  function chatTo(message, targetedUser) {
    socket.emit('chatTo', { message: message, targetedUser });
  }

  var userId = $('#userId').val();

  $('#sendMessage').submit(function(){
    var input = $('#message').val();
    var targetedUser = $('#targetedUser').val();
    chatTo(input, targetedUser);
    $('#message').val('');
    return false;
  });

  // Message Whatsapp
  // socket.on('incomingChat', function(data) {
  //   var username = $('#username').val();
  //   var html = '';
  //   if (data.sender === username) {
  //     html += '<div class="bubble right">';
  //     html +=  '<p>' + data.message + '</p>';
  //     html += '<small class="time">12:03<i class="material-icons">done</i></small>'
  //     html += '</div>';
  //   } else {
  //     html += '<div class="bubble left">';
  //     html +=  '<p>' + data.message + '</p>';
  //     html += '<small class="time">12:03<i class="material-icons">done</i></small>'
  //     html += '</div>';
  //   }

  //   $('.chat-msgs').append(html);
  // });


  // Custom Message
  socket.on('incomingChat', function(data) {
    var username = $('#username').val();
    var html = '';
    if (data.sender === username) {
      html += '<div class="message right">';
      html += '<span class="pic"><img src="' + data.picture + '>" alt="user"></span>';
      html += '<div class="bubble right">';
      html += '<p>' + data.message + '</p>';
      html += '<small class="time">12:03<i class="material-icons sent">done_all</i></small>';
      html += '</div></div>';
      
    } else {
      html += '<div class="message left">';
      html += '<span class="pic"><img src="' + data.picture + '>" alt="user"></span>';
      html += '<div class="bubble left"'>;
      html += '<p>' + data.message + '</p>';
      html += '<small class="time">12:03<i class="material-icons sent">done_all</i></small>';
      html += '</div></div>';
      
    }

    $('.chat-msgs').append(html);

  })

  $('#post-form').submit(function(){
    var post = $('#post').val();
    socket.emit('post', post);
    $('#post').val('');
    return false;
  });


  socket.on('connection', function() {
    $('#online').html('Online');
  });

  socket.on('disconnect', function() {
    $('#online').html('Offline');
  });

  socket.on('post', function(data) {
    console.log(data);
    $('#newPost').append('<li class="list-group-item">' + data.post.content + '</li>');
  });

  socket.emit('join', 'addRooms');

  $(document).on('click', "#addFriend", function(e){

    e.preventDefault();
    var room = 'addRooms';
    var userId = $('#userId').val();
    var socketId = $('#socketId').val();
    $('#addFriend').removeClass('btn-default').addClass('btn-success')
    .html('<span class="glyphicon glyphicon-ok"></span> Added').attr('id', 'addFriend');
    $('#addFriend').prop('disabled', true);
    socket.emit('friendsRequest', {
      userId: userId,
    });
  });

  socket.on('friendsRequest', function(data) {
    var totalRequests = parseInt($('#totalRequests').html());
    totalRequests += 1;
    $('#totalRequests').html(totalRequests);
    $('#friendsRequested').append(friendRequests(data));
  });


  $(document).on('click', '#add-friend-request', function(e) {
    var userId = $(this).val();
    console.log(userId);
    $.ajax({
      type: 'POST',
      url: '/accept-friend',
      data: {
        userId
      },
      success: function(response) {
        $('#' + userId).remove();
        var totalRequests = parseInt($('#totalRequests').html());
        totalRequests -= 1;
        $('#totalRequests').html(totalRequests);
      }
    });
  });





});
