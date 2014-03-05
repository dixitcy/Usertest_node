// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial page load
  populateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#btnAddUser').on('click', addUser);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});


// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/userlist', function( data ) {
    userListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });
    // Inject the whole content string into our existing HTML table
    $('#userList table tbody').html(tableContent);
  });
};


function showUserInfo(event){

  //Prevent link from firing
  event.preventDefault();

  //Retrieve username from link 'rel' attribute
  var thisUserName = $(this).attr('rel');

  //Get index og object based on id value
  var arrayPosition = userListData.map(function(arrayItem){
    return arrayItem.username;
  }).indexOf(thisUserName);

  //Get userObj
  var thisUserObject = userListData[arrayPosition];

  //Populate info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};



function deleteUser(event){
  event.preventDefault();

  var confirmation = confirm('Are you sure you want to delete this user?');
  if(confirmation === true){
    
    $.ajax({
      type: 'DELETE',
      url: '/deleteuser/'+ $(this).attr('rel')
    }).done(function(response){
      if(response.msg === ''){
      }
      else{
        alert('Error'+ response.msg);
      }
      populateTable();

    });
  }
  else{

    return false;

  }
};






//AddUser
function addUser(event){

  event.preventDefault();

  //Validating if all the required fields are filled 
  var errorCount = 0;
  $('#addUser input').each(function(index, val){
    if($(this).val() === ''){ errorCount++; console.log(errorCount); }
  });

  
  if(errorCount === 0) {

    //Compiling all user's info into one object
    var newUser = {
      'username' : $('#addUser fieldset input#inputUserName').val(),
      'email' : $('#addUser fieldset input#inputUserEmail').val(),
      'fullname' : $('#addUser fieldset input#inputUserFullname').val(),
      'age' : $('#addUser fieldset input#inputUserAge').val(),
      'gender' : $('#addUser fieldset input#inputUserGender').val(),
      'location' : $('#addUser fieldset input#inputUserLocation').val(),
    }

    //Using AJAX to POST the compiled user info to our adduser service in user.js
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/adduser',
      dataType: 'JSON'
    }).done(function(response){

      //check if response is successfull blank msg
      if(response.msg ===''){

        $('#addUser fieldset input').val('');
        populateTable();

      }
      else{

        alert('Error:' + response.msg);

      }
    });
  }
  else{

    alert('Please fill in all the fields');
    return false;

  }
};

