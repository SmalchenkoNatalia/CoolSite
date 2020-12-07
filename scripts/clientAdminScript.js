// Отримання всіх статей
function GetArticles() {
	$.ajax({
		url: "/api/articles",
		type: "GET",
		contentType: "application/json",
		success: function (articles) {
			var rows = "";
			$.each(articles, function (index, article) {
				rows += row(article);
			})
			$("table tbody").append(rows);
		}
	});
}
// Отримання однієї статті
function GetArticle(id) {
	$.ajax({
		url: "/api/articles/"+id,
		type: "GET",
		contentType: "application/json",
		success: function (article) {
			var form = document.forms["articleForm"];
			form.elements["id"].value = article._id;
			form.elements["name"].value = article.name;
			form.elements["article"].value = article.article;
			form.elements["lang"].value = article.lang
		}
	});
}
function CreateArticle(name, article, lang) {
	$.ajax({
		url: "api/articles",
		contentType: "application/json",
		method: "POST",
		data: JSON.stringify({
			name: name,
			article: article,
			lang:lang
		}),
		success: function (article) {
			reset();
			$("table tbody").append(row(article));
		}
	})
}
function EditArticle(articleId, name, article, lang) {
	$.ajax({
		url: "api/articles",
		contentType: "application/json",
		method: "PUT",
		data: JSON.stringify({
			id: articleId,
			name: name,
			article: article,
			lang: lang
		}),
		success: function (article) {
			reset();
			console.log(article);
			$("tr[data-rowid='" + article._id + "']").replaceWith(row(article));
		}
	})
}

// скидання формы
function reset() {
	var form = document.forms["articleForm"];
	form.reset();
	form.elements["id"].value = 0;
}

function DeleteArticle(id) {
	$.ajax({
		url: "api/articles/"+id,
		contentType: "application/json",
		method: "DELETE",
		success: function (article) {
			console.log(article);
			$("tr[data-rowid='" + article._id + "']").remove();
		}
	})
}
// створення рядка таблиці
var row = function (article) {
	return "<tr data-rowid='" + article._id + "'><td>" + article._id + "</td>" +
			"<td>" + article.name + "</td><td>" + article.lang + "</td><td>" + 
			"<a class='editLink' data-id='" + article._id + "'>Змінити</a> | "
			+ "<a class='removeLink' data-id='" + article._id + "'>Видалити</a></td></tr>";
}
$("#reset").click(function (e) {
	e.preventDefault();
	reset();
})
$("form").submit(function (e) {
	e.preventDefault();
	var id = this.elements["id"].value;
	var name = this.elements["name"].value;
	var article = this.elements["article"].value;
	var lang = this.elements["lang"].value
	if (id == 0)
		CreateArticle(name, article, lang);
	else
		EditArticle(id, name, article, lang);
});
$("body").on("click", ".editLink", function () {
	var id = $(this).data("id");
	GetArticle(id);
})
$("body").on("click", ".removeLink", function () {
	var id = $(this).data("id");
	DeleteArticle(id);
})

GetArticles();
