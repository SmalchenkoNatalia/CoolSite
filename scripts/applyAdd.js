var doc = document.getElementById("applyAdd");
var data = doc.dataset.src.split(".");

function CreateApply(clientName, clientSurname, clientEmail, clientPhone, application, confirmed) {
	$.ajax({
		url: "/api/applies",
		contentType: "application/json",
		method: "POST",
		data: JSON.stringify({
			clientName: clientName,
			clientSurname: clientSurname,
			clientEmail: clientEmail,
			clientPhone: clientPhone,
			application: application,
			confirmed: confirmed
		}),
		success: function () {
			reset();
		}
	})
}
$("form").submit(function (e) {
	e.preventDefault();
	var clientName = this.elements["clientName"].value;
	var clientSurname = this.elements["clientSurname"].value;
	var clientEmail = this.elements["clientEmail"].value;
	var clientPhone = this.elements["clientPhone"].value;
	var application = this.elements["application"].value;
	if(formValid(clientName, clientSurname, clientEmail, clientPhone, application)) {
		if(data[1]=="true") {
			if(data[0]=="UKR") alert("Підтвердження заявки прийде на електронну пошту");
			else alert("Confirmation of the application will be sent by e-mail");
			CreateApply(clientName, clientSurname, clientEmail, clientPhone, application, "false");
		}else {
			if(data[0]=="UKR") alert("Заявка підтверджена");
			else alert("The application is confirmed");
			CreateApply(clientName, clientSurname, clientEmail, clientPhone, application, "true");
		}
	}
});

function reset() {
	var form = document.forms["applyForm"];
	form.reset();
}

function formValid(clientName, clientSurname, clientEmail, clientPhone, application) {
	if((!clientName.length)) {
		if(data[0]=="UKR") alert("Поле з прізвищем або іменем не повинні бути пустим");
		else  alert("The field with the last name or first name must not be empty");
		return false;
	}
	if((!clientSurname.length)) {
		if(data[0]=="UKR") alert("Поле з прізвищем або іменем не повинні бути пустим");
		else  alert("The field with the last name or first name must not be empty");
		return false;
	}
	let mailValidation = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/;
	let validMail = mailValidation.test(clientEmail);
	console.log("invalid");
	if(!validMail) {
		if(data[0]=="UKR") alert("Введена пошта є некоректною");
		else alert("The mail you entered is incorrect");
		return false;
	}
	let phoneValidation = /^\+38\s\([0-9]{3}\)\s[0-9]{7}$/;
	let validPhone = phoneValidation.test(clientPhone);
	if(!validPhone) {
		if(data[0]=="UKR") alert("Неправильний формат телефону");
		else alert("Wrong phone format");
		return false;
	}
	if(!application.length) {
		if(data[0]=="UKR") alert("Текст заявки не може бути пустим");
		else alert("The text of the application cannot be empty");
		return false;
	}
	return true;
}
