let id = get('id');

const ADDMARK_URL = `https://univercity.milimapp.online/add_mark.php?id_prep=${id}&point=`;
const ADDCOMMENT_URL = `https://univercity.milimapp.online/insert_comment.php?id=${id}`;
const ALLCOMMENTS_URL = `https://univercity.milimapp.online/get_comments_by_id.php?id=${id}`;
const PROFESSORINFO_URL = `https://univercity.milimapp.online/get_one_prep.php?id=${id}`;

const btnCloseSuccessColor = '#188A00';
const btnCloseErrorColor = '#A60000';
const modalSuccessBgColor = '#74E868';
const modalErrorBgColor = '#ff3d54';

let modal = document.querySelector('.modal');
let modalContent = document.querySelector('.modal-content');
let text = document.querySelector('.modal-content-text');
let modalBtnClose = document.querySelector('.modal-close');
let commentForm = document.querySelector('#comment-form');
let commentText = document.getElementById('comment-text');
let nickname = document.getElementById('nickname');
let classfield = document.getElementById('classfield');
let grade = document.getElementById('grade');
let commentsList = document.getElementById('commentslist');

let rate = document.querySelector('.btn-rate');

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
	if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
	  return decodeURIComponent(name[1]);
	}	
}

rate.addEventListener('click', rateProfessor);
commentForm.addEventListener('submit', addComment);

function rateProfessor() {
	let stars = document.getElementsByTagName('input');
	let value = '';
	let rateResult = document.getElementById('ratepoint');

	for (let i=0; i < stars.length; i++) {
		if (stars[i].type === 'radio' && stars[i].checked) {
			value = stars[i].value;
			sendMark(value);
			showModal('Your vote is succeed added!', modalSuccessBgColor, btnCloseSuccessColor);
		} else if (stars[i].type === 'radio' && !stars[i].checked) {
			showModal('Please, vote for your professor!', modalErrorBgColor, btnCloseErrorColor);
		}
	} 
	
	function sendMark (value) {
		getData('GET', ADDMARK_URL + value, getProfInfo, getErrorMessage);
	}
}

function addComment(event) {
	event.preventDefault();

	if (commentText.value !== '' && nickname.value !== '' && classfield.value !== '' && grade.value !== '') {
		getData('GET', ADDCOMMENT_URL + '&text=' + commentText.value + "&from=" + nickname.value + "&class=" + classfield.value + "&grade=" + grade.value, getAllComments, getErrorMessage);
		showModal('We added your feedback. Thanks!', modalSuccessBgColor, btnCloseSuccessColor);
		clearForm(commentText, nickname, classfield, grade);
	} else {
		showModal('Please, fill all fields in the form!', modalErrorBgColor, btnCloseErrorColor);
	}
}

function clearForm(...args){
	args.forEach(item => item.value = '');
}

function showModal(txt, bgColor, btnColor) {
	modal.style.display = 'block';
	modalContent.style.background = bgColor;
	modalBtnClose.style.color = btnColor;
	text.innerText = txt;
}

modalBtnClose.addEventListener('click', closeModal);

function closeModal() {
	modal.style.display = 'none';
}

function getAllComments() {
	getData('GET', ALLCOMMENTS_URL, showComments, getErrorMessage);
}

function showComments(prf){
 	renderData(prf, commentsTemplate, commentsList);
}

function commentsTemplate(comment){
	return (`
		<div class="comment">
			<div class="comment-classgrade">
				<div class="comment-class">
					<h4>class:</h4>
					<span>${comment.class}</span>
				</div>
				<div class="comment-grade">
					<h4>grade:</h4>
					<span>${comment.grade}</span>
				</div>
			</div>
			<div class="comment-text">
				<h4>${comment.from_user}</h4>
				<p>${comment.content_text}</p>
			</div>
		</div>
	`);
}

function showProfessorInfo(prf){
	document.getElementById('profname').innerHTML = prf.name;
	let rate = prf.rate + '';
	if (rate.length > 1) {
		rate = rate.substring(0, 3);
	}
	document.getElementById('ratepoint').innerText = rate;
	document.getElementById('ratecount').innerHTML = `(${prf.rates_count})`;
}

function getProfInfo () {
	getData('GET', PROFESSORINFO_URL, showProfessorInfo, getErrorMessage);	
}

function renderData(data, templateFn, container){
	let temporaryData = '';
	
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