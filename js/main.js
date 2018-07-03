var pageMenu = document.getElementById('page-menu'),
		faculties = document.getElementById('menu-faculties'),
		facultiesItem = document.getElementById('facult-item'),
		exit = document.getElementById('exit'),
		facultiesList = document.getElementById('faculties'),
		scrollWidth = ScrollWidth();

		window.addEventListener('resize', function () {
			scrollWidth = ScrollWidth();
		});

		pageMenu.onclick = function() {
			faculties.style.display = 'block';
			facultiesList.classList.add('faculties-new');
			document.body.style.paddingRight = scrollWidth + 'px';
			document.body.classList.add('modal-open');
			getData();
		}

		exit.onclick = function() {
			faculties.style.display = 'none';
			document.body.style.paddingRight = '0';
			document.body.classList.remove('modal-open');
		}
		
		function getData() {
			$.ajax({
					dataType: "json",
				  type: "GET",
				  url: "http://univercity.milim.online/get_facult.php",
				  success: function(msg){
				  	showResult(msg);
				  },
				  error: function (jqXHR, exception) {
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

		function showResult(msg) {
			var facul = '';

					exit.style.color = 'white';
					exit.style.font = "bold 50px arial, serif";
					exit.style.position = "absolute";
					exit.style.top = "15px";
					exit.style.right = "35px";
					exit.onmouseover = function () {
						this.style.color = "blue";
					}
					exit.onmouseout = function () {
						this.style.color = "white";
					}
				facultiesItem.style.backgroundImage = 'url(img/girl.png)';
				for(i=0; i < msg.length; i++) {
					let faculty = msg[i];
						facultiesList.innerHTML = '';
						facul += '<span onclick = "getProfessor('+ faculty['id'] +')">' + faculty['name'] + '</span>';
						facultiesList.innerHTML = facul;
				}
		}

		function getProfessor(id) {
			facultiesList.innerHTML = '';
				$.ajax({
						dataType: "json",
					  type: "GET",
					  url: "http://univercity.milim.online/get_prep.php?id=" + id,
					  success: function(prf){
					  	facultiesList.classList.remove('faculties-new');
					  	showResultProf(prf);
						},
						error: function (jqXHR, exception) {
							let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
					 	}
				});
		}

		function showResultProf(prf) {
			let professorsList = '';

			for(i=0; i < prf.length; i++) {
						let professorItem = prf[i];
						professorsList += '<span><a href="rateprof.html?id='+ professorItem['id'] +'&gender='+ professorItem['gender'] +'">' + professorItem['name'] + '</a></span>';
						facultiesItem.style.backgroundImage = 'url(img/background-faculties.png)';
					}
				facultiesList.innerHTML = professorsList;
			}

		function searchProf() {
			let searchField = document.getElementById('search'),
					queryProf = document.getElementById('search').value,
					searchList = document.getElementById('slist');
				 	
				 	searchField.onclick = function() {
					 	searchList.style.display = 'none';
					}
					
					if (queryProf.length > 0) {
						$.ajax({
								dataType: "json",
							  type: "GET",
							  url: "http://univercity.milim.online/search_prep.php?q=" + queryProf,
							  success: function(prf){
							    searchList.style.display = 'block';
									let searchListItems = '';
									
									for (i=0; i<prf.length; i++) {
											let professor = prf[i];
											searchListItems += '<span><a href="rateprof.html?id='+ professor['id'] +'&gender='+ professor['gender'] +'">' + professor['name'] + '</a></span>';
									}
									searchList.innerHTML = searchListItems;
								},
								error: function (jqXHR, exception) {
									let msg = getErrorMessage(jqXHR, exception);
						    	alert(msg);
				 				} 
						});
					} else {
					searchList.style.display = 'none';
					}	
		}

function ScrollWidth () {
	var div = document.createElement('div');

	div.style.height = '50px';
	div.style.visibility = 'hidden';

	document.body.appendChild(div);
	var scrollWidth = div.clientWidth;
	div.style.overflowY = 'scroll';
	scrollWidth -= div.clientWidth;
	document.body.removeChild(div);

	return scrollWidth;
}
	