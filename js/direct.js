	window.onload = function () {
				getAllComments();
		}

		let lastId = 0;
		function getAllComments () {
			$.ajax({ 
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/get_all_comments.php",
					  success: function(prf){
					    console.log("Відповідь сервера: " + prf);
					 		let commentsList = document.getElementById('commentslist'); 
						 	let commentsArray = '';
					   	for (i=0; i<prf.length; i++) {
					    	let com = prf[i];
					    	let commentHTML = "<div class=\"comment\"><div class=\"comment-delete\" onclick=\"deleteComment("+ com['id'] +");\">X</div><div class=\"comment-classgrade\"><div class=\"comment-class\"><h4>class:</h4><span>" + com['class'] + "</span></div><div class=\"comment-grade\"><h4>grade:</h4><span>" + com['grade'] + "</span></div></div><div class=\"comment-text\"><h4>" 
					    		+ com['from_user'] + "</h4><p>" + com['content_text'] + "</p></div></div>";
					    	commentsArray += commentHTML;
					    	lastId = com['id'];
					    }
					   commentsList.innerHTML = commentsArray;
					},
						error: function getErrorMessage (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					}
			});	
		}

		function deleteComment(id) {
			$.ajax({ 
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/delete_comment.php?id=" + id,
					  success: function(prf){
					    console.log("Відповідь сервера: " + prf);
					    showDeleteModal();
					  	getAllComments();
					},
						error: function getErrorMessage (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					}
			});	
		}

		function showDeleteModal() {
			let deleteModal = document.getElementById('comment-failed');
			let commentClose = document.getElementById('commentclose');
			
			deleteModal.style.display = 'block';

			commentClose.onclick =  function closeDeleteModal() {
				deleteModal.style.display = 'none';
			}
		}

		function moreComments() {
			$.ajax({ 
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/get_all_comments.php?id=" + lastId,
					  success: function(prf){
					    console.log("Відповідь сервера: " + prf);
						  let commentsList = document.getElementById('commentslist'); 
						 	let commentsArray = '';
					   	for (i=0; i<prf.length; i++) {
					    	let com = prf[i];
					    	let commentHTML = "<div class=\"comment\"><div class=\"comment-delete\" onclick=\"deleteComment("+ com['id'] +");\">X</div><div class=\"comment-classgrade\"><div class=\"comment-class\"><h4>class:</h4><span>" + com['class'] + "</span></div><div class=\"comment-grade\"><h4>grade:</h4><span>" + com['grade'] + "</span></div></div><div class=\"comment-text\"><h4>" 
					    		+ com['from_user'] + "</h4><p>" + com['content_text'] + "</p></div></div>";
					    	commentsArray += commentHTML;
					    	lastId = com['id'];
					    }
					   commentsList.innerHTML += commentsArray;
					   if (prf.length == 0) {
					   	showEmptyModal();
					   }
					},
						error: function getErrorMessage (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					}
			});	
		}

		function showEmptyModal() {
			let emptyModal = document.getElementById('comment-empty');
			let emptyClose = document.getElementById('emptyclose');
					
					emptyModal.style.display = 'block';
			
			emptyClose.onclick =  function closeEmptyModal() {
					emptyModal.style.display = 'none';
			}
		}