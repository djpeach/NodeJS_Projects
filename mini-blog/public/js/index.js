const address = 'http://localhost:3000';

let deletePost = function() {
	let url = `${address}/posts/${this.value}`
	let options = {
		mode: 'cors',
		method: 'DELETE'
	};
	fetch(url, options)
		.then(() => {
			loadPosts();
	});
};

let createPost = function() {
	let url = `${address}/posts`;
	let options = {
		mode: 'cors',
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json; charset=utf-8',
			'Accept': 'application/json'
		}),
		body: JSON.stringify({
			title: document.getElementById('title').value,
			body: document.getElementById('body').value
		})
	};
	fetch(url, options).then(() => { 
		document.getElementById('title').value = '';
		document.getElementById('body').value = '';
		loadPosts(); 
	});
};

let updatePost = function() {
	let url = `${address}/posts/${this.value}`;
	let options = {
		mode: 'cors',
		method: 'PUT',
		headers: new Headers({
			'Content-Type': 'application/json; charset=utf-8',
			'Accept': 'application/json'
		}),
		body: JSON.stringify({
			title: document.getElementById('edit-title').value,
			body: document.getElementById('edit-body').value
		})
	};
	fetch(url, options).then(() => { loadPosts(); });
};

let editPost = function() {
	let url = `${address}/posts/${this.value}`;
	let options = {
		mode: 'cors',
		method: 'GET'
	}
	fetch(url, options).then((fetch_results) => fetch_results.json())
		.then((post) => {
			let post_title = post.title;
			document.getElementById(this.value).innerHTML = `
		    <div class='text-right'>
				  <div class="form-group row">
				    <label for="title" class='text-left col-2'>Title:</label>
				    <input class="rounded form-control col-9" id="edit-title" name='title' value='${post.title}'/>
				  </div>
				  <div class="form-group row">
				    <label for="body" class='text-left col-2'>Body:</label>
				    <textarea rows='4' class='col-9 text-left form-control' id='edit-body' name='body'>${post.body}</textarea>
				  </div>
				  <button id='editedPostSubmit' class="btn btn-primary" value=${post._id}>Update</button>
				</div>
			`;
			document.getElementById('editedPostSubmit').addEventListener('click', updatePost);
		});
};

let loadPosts = function() {
	let options = {
		mode: 'cors',
		method: 'GET'
	};
	fetch(`${address}/`, options)
		.then((fetch_results) => fetch_results.json())
		.then((json_results) => {
			let postList = '';
			json_results.forEach((post) => {
				postList = postList.concat(`
					<div class='row'>
						<div class="card col-11 my-1">
						  <div class="card-body" id=${post._id}>
						    <h5 class="card-title">${post.title}</h5>
						    <p class="card-text">${post.body}</p>
						  </div>
						</div>
						<div class='col-1'>
							<button href='#' value=${post._id} class='my-1 btn btn-sm btn-outline-primary edit-post'>Edit</a>
							<button href='#' value=${post._id} class='btn btn-sm btn-outline-danger delete-post'>Delete</a>
						</div>
					</div>
				`);
			});
			document.getElementById('posts').innerHTML = postList;
			document.querySelectorAll('button.edit-post').forEach((link) => {link.addEventListener('click', editPost)});
			document.querySelectorAll('button.delete-post').forEach((link) => {link.addEventListener('click', deletePost)});
		});
};

let start = () => {
	loadPosts();
	document.getElementById('newPostSubmit').addEventListener('click', createPost);
};

start();