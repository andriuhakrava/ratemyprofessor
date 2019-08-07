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

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const FACULTIESLIST_URL = 'http://univercity.milimapp.online/get_facult.php';
const PROFESSORSLIST_URL = 'http://univercity.milimapp.online/get_prep.php?id=';
const PROFESSOR_URL = 'http://univercity.milimapp.online/search_prep.php?q=';

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
	getData(FACULTIESLIST_URL, showFacultiesList, getErrorMessage);
}

function showFacultiesList(msg) {
	renderData(msg, bgUrlFaculties, templateFacultiesList, facultiesList);
}

function getProfessorsList(id) {
	facultiesList.innerHTML = '';
	facultiesList.classList.remove('faculties-new');

	getData(PROFESSORSLIST_URL + id, showProfessorsList, getErrorMessage);
}

function showProfessorsList(prf) {
	renderData(prf, bgUrlProfessors, templateProfessor, facultiesList);
} 

function searchProfessor() {
	let queryProfessor = searchField.value;

 	searchField.onclick = function() {
	 	searchResults.style.display = 'none';
	}

	if (queryProfessor.length > 0){
		getData(PROFESSOR_URL + queryProfessor, showProfessor, getErrorMessage);
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

function getData(url, successFn, errorFn){
	fetch(PROXY_URL + url)
		.then(response => response.json())
		.then(result => successFn(result))
		.catch(err => errorFn(err));
}

function getErrorMessage(err){
	alert(err);
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
	