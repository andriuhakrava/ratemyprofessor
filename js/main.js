let openMenuBtn = document.querySelector('#page-menu'),
		modal = document.querySelector('.modal'),
		modalContent = document.querySelector('.modal-content'),
		closeMenuBtn = document.querySelector('.close'),
		facultiesList = document.querySelector('.faculties-list'),
		searchField = document.querySelector('#search'),
		searchResults = document.querySelector('.search-results'),
		bgUrlFaculties = 'url(img/bg-girl.png)',
		bgUrlProfessors = 'url(img/bg-faculties.png)',
		scrollWidth = ScrollWidth();

const FACULTIESLIST_URL = 'https://univercity.milimapp.online/get_facult.php';
const PROFESSORSLIST_URL = 'https://univercity.milimapp.online/get_prep.php?id=';
const PROFESSOR_URL = 'https://univercity.milimapp.online/search_prep.php?q=';

searchField.addEventListener('keyup', searchProfessor);

window.addEventListener('resize', function () {
	scrollWidth = ScrollWidth();
});

openMenuBtn.onclick = function() {
	modal.style.display = 'block';
	facultiesList.classList.add('faculties-new');
	document.body.style.paddingRight = scrollWidth + 'px';
	document.body.classList.add('modal-open');
	getFacultiesList();
}

closeMenuBtn.onclick = function() {
	modal.style.display = 'none';
	document.body.style.paddingRight = '0';
	document.body.classList.remove('modal-open');
}
		
function getFacultiesList() {
	getData('GET', FACULTIESLIST_URL, showFacultiesList, getErrorMessage);
}

function showFacultiesList(msg) {
	renderData(msg, bgUrlFaculties, templateFacultiesList, facultiesList);
}

function getProfessorsList(id) {
	facultiesList.innerHTML = '';
	facultiesList.classList.remove('faculties-new');

	getData('GET', PROFESSORSLIST_URL + id, showProfessorsList, getErrorMessage);
}

function showProfessorsList(prf) {
	renderData(prf, bgUrlProfessors, templateProfessor, facultiesList);
} 

function searchProfessor() {
	let	queryProfessor = searchField.value;

 	searchField.onclick = function() {
	 	searchResults.style.display = 'none';
	}

	if (queryProfessor.length > 0){
		getData('GET', PROFESSOR_URL + queryProfessor, showProfessor, getErrorMessage);
	} else {
		searchResults.style.display = 'none';
	}
}

function showProfessor(prf){
	if (prf.length > 0){
    searchResults.style.display = 'block';

		renderData(prf, null, templateProfessor, searchResults);
	}
  else {
  	searchResults.style.display = 'none';
  }
}

function templateFacultiesList(data){
	return (`
		<span onclick = "getProfessorsList('${data['id']}')">
			${data['name']}
		</span>
	`);
}

function templateProfessor(data){
	return (`
		<span>
			<a href="rateprof.html?id=${data['id']}&gender=${data['gender']}">
				${data['name']}
			</a>
		</span>
	`);
}

function renderData(data, backgroundImg = '', templateFn, container){
	let temporaryData = '';

	modalContent.style.backgroundImage = backgroundImg;
	
	data.forEach(item => {
		temporaryData += templateFn(item);
	});
	
	container.innerHTML = temporaryData;
}

function getData(type, url, successFn, errorFn){
	$.ajax({
	  type,
	  url,
	  success: function(msg){
	  	successFn(msg);
	  },
	  error: function (jqXHR, exception) {
	  	let msg = errorFn(jqXHR, exception);
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

function ScrollWidth () {
	let div = document.createElement('div');

	div.style.height = '50px';
	div.style.visibility = 'hidden';

	document.body.appendChild(div);

	let scrollWidth = div.clientWidth;
	
	div.style.overflowY = 'scroll';
	scrollWidth -= div.clientWidth;
	document.body.removeChild(div);

	return scrollWidth;
}
	