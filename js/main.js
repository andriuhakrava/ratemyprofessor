let pageMenu = document.getElementById('page-menu'),
		faculties = document.getElementById('menu-faculties'),
		facultiesList = document.getElementById('facult-item'),
		exit = document.getElementById('exit'),
		list = document.getElementById('faculties');

		pageMenu.onclick = function() {
			faculties.style.display = 'block';
			getData();
		}

		exit.onclick = function() {
			faculties.style.display = 'none';
		}
		
		function getData() {
				$.ajax({
					dataType: "json",
				  type: "GET",
				  url: "http://univercity.milim.online/get_facult.php",
				  success: function(msg){
				  	showResult(msg);
				    console.log("Відповідь сервера: " + msg);
				  },
				  error: function (jqXHR, exception) {
				  }
				});
		}

		function showResult(msg) {
			let facul = '';

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

			facultiesList.style.backgroundImage = 'url(img/girl.png)';

			for(i=0; i < msg.length; i++) {
				let faculty = msg[i];
					list.innerHTML = '';
					facul += '<span onclick = "getProfessor('+ faculty['id'] +')">' + faculty['name'] + '</span>';
					list.innerHTML = facul;
			}
		}

		function getProfessor(id) {
			list.innerHTML = '';
			console.log(id);
			$.ajax({
					dataType: "json",
				  type: "GET",
				  url: "http://univercity.milim.online/get_prep.php?id=" + id,
				  success: function(prf){
				  	showResultProf(prf);
				    console.log("Відповідь сервера: " + prf);
				},
					error: function (jqXHR, exception) {
				 }
			});
		}

		function showResultProf(prf) {
			let professors = '';

			for(i=0; i < prf.length; i++) {
						console.log(i);
						let profy = prf[i];
						console.log(profy);
						professors += '<span><a href="rateprof.html?id='+ profy['id'] +'&gender='+ profy['gender'] +'">' + profy['name'] + '</a></span>';
						facultiesList.style.backgroundImage = 'url(img/background-faculties.png)';					
					}
				list.innerHTML = professors;
			}

			function searchProf() {
				let searchField = document.getElementById('search');
				let queryProf = document.getElementById('search').value;
				 let searchList = document.getElementById('slist');
				 searchField.onclick = function() {
				 	searchList.style.display = 'none';
				 }
				if (queryProf.length > 0) {
					$.ajax({
					dataType: "json",
				  type: "GET",
				  url: "http://univercity.milim.online/search_prep.php?q=" + queryProf,
				  success: function(prf){
				    console.log("Відповідь сервера: " + prf);
				    	slist.style.display = 'block';
							
							let slistItems = '';
							for (i=0; i<prf.length; i++) {
								let professor = prf[i];
								slistItems += '<span><a href="rateprof.html?id='+ professor['id'] +'&gender='+ professor['gender'] +'">' + professor['name'] + '</a></span>';
							}

							searchList.innerHTML = slistItems;
				},
					error: function (jqXHR, exception) {
				 } 
			});

				} else {
					searchList.style.display = 'none';
				}	
	}
