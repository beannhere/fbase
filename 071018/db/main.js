'use strict';


var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var titleInput = document.getElementById('new-post-title');
var firstName = document.getElementById('new-record-fname');
var signInButton = document.getElementById('sign-in-button');
var addPost = document.getElementById('add-post');
var addButton = document.getElementById('add');
var userPostsSection = document.getElementById('user-posts-list');
var myPostsMenuButton = document.getElementById('menu-my-posts');
var today = moment().format('MM/DD/YYYY');
var listeningFirebaseRefs = [];

function writeNewPost(uid, username, picture, title, body, fname) {
  var postData = {
    uid: uid,
    body: body,
    title: title,
    first_name: fname,
    created_date: today,
    created_by: 'Admin'
  };

  var newPostKey = firebase.database().ref().child('posts').push().key;
  var updates = {};
  updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  return firebase.database().ref().update(updates);
}


/**
 * Creates a post element.
 */
function createPostElement(postId, title, text, author, authorId, authorPic, createdDate, createdBy) {
  var uid = 'UID-001';

  var html =
      '<div class="post post-' + postId + ' mdl-cell mdl-cell--12-col ' +
                  'mdl-cell--6-col-tablet mdl-cell--4-col-desktop mdl-grid mdl-grid--no-spacing">' +
        '<div class="mdl-card mdl-shadow--2dp">' +
          '<div class="mdl-card__title mdl-color--light-blue-600 mdl-color-text--white">' +
            '<h4 class="mdl-card__title-text"></h4>' +
          '</div>' +
          '<div class="header">' +
            '<div>' +
              '<div class="avatar"></div>' +
              '<div class="username mdl-color-text--black"></div>' +
            '</div>' +
          '</div>' +          
          '<div class="text"></div>' +
          '<div class="comments-container"></div>' +
          '<div class="created_by"></div>' +   
	  '<div class="created_date"></div>' +                 
        '</div>' +
      '</div>';

  var div = document.createElement('div');
  div.innerHTML = html;
  var postElement = div.firstChild;  

  postElement.getElementsByClassName('text')[0].innerText = text;
  postElement.getElementsByClassName('created_date')[0].innerText = createdDate;
  postElement.getElementsByClassName('created_by')[0].innerText = createdBy;
  postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = title;
  postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
  postElement.getElementsByClassName('avatar')[0].style.backgroundImage = 'url("' +
      (authorPic || './silhouette.jpg') + '")';
  return postElement;
}

function createNewComment(postId, username, uid, text) {
  firebase.database().ref('post-comments/' + postId).push({
    text: text,
    author: username,
    uid: uid
  });
}

function setCommentValues(postElement, id, text, author) {
  var comment = postElement.getElementsByClassName('comment-' + id)[0];
  comment.getElementsByClassName('comment')[0].innerText = text;
  comment.getElementsByClassName('fp-username')[0].innerText = author;
}

function startDatabaseQueries() {

  var myUserId = 'UID-001';
  var userPostsRef = firebase.database().ref('user-posts/' + myUserId);

  var fetchPosts = function(postsRef, sectionElement) {
    postsRef.on('child_added', function(data) {
      var author = data.val().uid || 'Anonymous';
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      containerElement.insertBefore(
        createPostElement(data.key, 
		data.val().title, 
		data.val().body, 
		author, 
		data.val().uid, 
		data.val().authorPic,
		data.val().created_date,
		data.val().created_by),
        containerElement.firstChild);
    });
    postsRef.on('child_changed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var postElement = containerElement.getElementsByClassName('post-' + data.key)[0];
      postElement.getElementsByClassName('mdl-card__title-text')[0].innerText = data.val().title;
      postElement.getElementsByClassName('username')[0].innerText = data.val().uid;
      postElement.getElementsByClassName('text')[0].innerText = data.val().body;
    });
    postsRef.on('child_removed', function(data) {
      var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
      var post = containerElement.getElementsByClassName('post-' + data.key)[0];
      post.parentElement.removeChild(post);
    });
  };

  fetchPosts(userPostsRef, userPostsSection);
  listeningFirebaseRefs.push(userPostsRef);
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    first_name: name,
    last_name: name,
    age: null,
    email: email
  });
}

function cleanupUi() {
  userPostsSection.getElementsByClassName('posts-container')[0].innerHTML = '';
  listeningFirebaseRefs.forEach(function(ref) {
    ref.off();
  });
  listeningFirebaseRefs = [];
}


function onAuthStateChanged(user) {
    writeUserData('UID-001', '', '', '');
    startDatabaseQueries();

}

function newPostForCurrentUser(title, text, fname) {  
    var username = 'Ann';
    return writeNewPost('UID-001', username,'//:photoURL',title, text, fname);
}


function showPost(sectionElement, buttonElement) {
  userPostsSection.style.display = 'contents';

  addPost.style.display = 'none';
  myPostsMenuButton.classList.remove('is-active');

  if (sectionElement) {
    sectionElement.style.display = 'block';
  }
  if (buttonElement) {
    buttonElement.classList.add('is-active');
  }
}

window.addEventListener('load', function() {  
  firebase.auth().onAuthStateChanged(onAuthStateChanged);
  messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    var title = titleInput.value;
    var fname = firstName.value;

    if (text && title) {
      newPostForCurrentUser(title, text, fname).then(function() {
        myPostsMenuButton.click();
      });
      messageInput.value = '';
      titleInput.value = '';
    }
  };

  myPostsMenuButton.onclick = function() {
    showPost(userPostsSection, myPostsMenuButton);
  };

  addButton.onclick = function() {
    showPost(addPost);
    messageInput.value = '';
    titleInput.value = '';
  };
}, false);

