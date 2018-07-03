window.onload = function() {
		if (get('gender') == 'm'){
				document.getElementById('photo').setAttribute('src', 'img/avatar-male.png');
			} else if (get('gender') == 'w'){
				document.getElementById('photo').setAttribute('src', 'img/avatar-female.png');
			}
		getProfInfo();
		getAllComments();
	}

	function get(name){
		  if(name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
		      return decodeURIComponent(name[1]);
	}

	let id = get('id');

	function addComment() {
		let commentText = document.getElementById('comment').value,
				nickname = document.getElementById('nickname').value,
				classfield = document.getElementById('classfield').value,
				grade = document.getElementById('grade').value;

					$.ajax({ 
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/insert_comment.php?id=" + id + "&text=" 
					  + commentText + "&from=" + nickname + "&class=" + classfield + "&grade=" + grade,
					  success: function(prf){
					   	getAllComments();
					  	showSuccessModal();
					   	document.getElementById('comment').value = '';
					   	document.getElementById('nickname').value = '';
					   	document.getElementById('classfield').value = '';
					   	document.getElementById('grade').value = '';
					},
						error: function getErrorMessage (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					}
			});	
	} 

		function getErrorMessage(jqXHR, exception) {
			if (jqXHR.status === 0) { return 'Not connect.\n Verify Network.'; }
		  if (jqXHR.status == 404) { return 'Requested page not found. [404]'; }
		  if (jqXHR.status == 500) { return 'Internal Server Error [500].'; }
		  if (exception === 'parsererror') { return 'Requested JSON parse failed.'; }
		  if (exception === 'timeout') { return 'Time out error.'; }
		  if (exception === 'abort') { return 'Ajax request aborted.'; }
		  return 'Uncaught Error.\n' + jqXHR.responseText;
		}

	function showSuccessModal () {
		let commentModal = document.getElementById('comment-success');
				commentModal.style.display = 'block';
	}

	let commentClose = document.getElementById('commentclose');
	
	commentClose.onclick =  function closeSuccessModal() {
		let commentModal = document.getElementById('comment-success');
				commentModal.style.display = 'none';
	}

	function getAllComments() {
			$.ajax({ 
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/get_comments_by_id.php?id=" + id,
					  success: function(prf){
					    let commentsAll = document.getElementById('commentslist');
					    let commentsList = '';
					    for (i=0; i<prf.length; i++) {
					    	let com = prf[i];
					    	let commentItem = "<div class=\"comment\"><div class=\"comment-classgrade\"><div class=\"comment-class\"><h4>class:</h4><span>" + com['class'] + "</span></div><div class=\"comment-grade\"><h4>grade:</h4><span>" + com['grade'] + "</span></div></div><div class=\"comment-text\"><h4>" 
					    		+ com['from_user'] + "</h4><p>" + com['content_text'] + "</p></div></div>";
					    	commentsList += commentItem;
					    }
							commentsAll.innerHTML = commentsList;
					},
						error: function (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					}
			});	
	}

	let rate = document.getElementById('ratebutt');
	
		rate.onclick = function () {
			
			let stars = document.getElementsByTagName('input');
			let value = '';
			let rateResult = document.getElementById('ratepoint');

			for(i=0; i<stars.length; i++) {
				if (stars[i].type === 'radio' && stars[i].checked) {
					value = stars[i].value;
					sendMark(value);
				}
			} 

			function sendMark (value) {
				$.ajax({ 
							dataType: "json",
						  type: "GET",
							url: "http://univercity.milim.online/add_mark.php?id_prep=" + id + "&point=" + value,
						  success: function(prf){
						    console.log("Відповідь сервера: " + prf);
						    getProfInfo();
						},
							error: function (jqXHR, exception) {
								let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
						}
				});
			}
		}

	function getProfInfo () {
			$.ajax({ 
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/get_one_prep.php?id=" + id,
					  success: function(prf){
					  	document.getElementById('profname').innerHTML = prf['name'];
					  	var rate = prf['rate'] + '';
					  	if (rate.length > 1) {
					  		rate = rate.substring(0, 3);
					  	}
					  	document.getElementById('ratepoint').innerText = rate;
					  	document.getElementById('ratecount').innerHTML = '(' + prf['rates_count'] + ')';
					    console.log("Відповідь сервера: " + prf);
					},
						error: function (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					}
			});	
	}