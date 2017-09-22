$(document).ready(function () {
	
	const USERS = 'users';
	const URL = 'http://www.json-generator.com/api/json/get/cgmZpkYnYi';
	
	var UsersModel = Backbone.Model.extend({
		
		getModifiedUsers: function(){
			return JSON.parse(localStorage.getItem(USERS));
		}, 
		
		saveModifiedUsers: function(users){
			localStorage.setItem(USERS, users);
		}, 
		
		modifyUsers: function (users) {
				let newUsers = [];
				users.forEach(function (user) {
					if (user.isActive || user.index == 0) {
						user.friends.forEach(function (trueUser) {
							let obj = {};
							let name = trueUser.name;
							obj.firstName = name.substring(0, name.indexOf(" "));
							obj.lastName = name.substring(name.indexOf(" ") + 1);
							newUsers.push(obj);
						})
					}
				});
				return {newUsers: newUsers}
			}
	});
	
	var usersModel = new UsersModel();

	var UsersListView = Backbone.View.extend({
			el: '#container',

			events: {
				'click .deleteString': 'deleteString'
			},

			render: function (data) {
				var source = $('#template').html();
				var template = Handlebars.compile(source);
				var html = template(data);
				this.$el.append(html);
				$('.stringTable:odd').addClass('oddColorBg');
				$('.stringTable:even').addClass('evenColorBg');
			},
			deleteString: function (ev) {
				let delFirstName = $(ev.target).parent().siblings("td").eq(0).text();
				let delLastName = $(ev.target).parent().siblings("td").eq(1).text();
				$(ev.target).parent().parent().remove();
				let users = this.model.getModifiedUsers();
				
				delUsersArr = users.newUsers.filter(function (user) {
						return (user.firstName != delFirstName && user.lastName != delLastName);
					})
                this.model.saveModifiedUsers(JSON.stringify({newUsers: delUsersArr}));						
			}
		});
	var usersListView = new UsersListView({model : usersModel});

	var FormView = Backbone.View.extend({
			el: '#form',

			events: {
				'change #select': 'select',
				'keyup #search': 'search',
				'click #reset': 'reset'
			},

			select: function (ev) {
				let val = $(ev.target).val();
				let users = JSON.parse(localStorage.getItem(USERS));
				let firstNameSort = users.newUsers.sort(function (a, b) {
						return a[val] > b[val];
					});
				this.clear();
				usersListView.render({
					newUsers: firstNameSort
				})
			},
			search: function (ev) {
				let input = $(ev.target).val().toLowerCase();
				let users = this.model.getModifiedUsers();
				let usersFilter = users.newUsers.filter(function (user) {
						return ((user.firstName).toLowerCase().indexOf(input) !== -1)
						 || ((user.lastName).toLowerCase().indexOf(input) !== -1);
					});
				this.clear();
				usersListView.render({
					newUsers: usersFilter
				})
			},
			reset: function () {
				this.clear();
				let users = this.model.getModifiedUsers();
				usersListView.render(users);
			},
			clear: function () {
				$('.stringTable').empty();
			}
		});

	var formView = new FormView({model : usersModel});

	$.ajax({
		type: "GET",
		dataType: "jsonp",
		url: URL,
		success: function (result) {
			let newUsers = usersModel.modifyUsers(result);
			usersModel.saveModifiedUsers(JSON.stringify(newUsers))
			usersListView.render(newUsers)
		}
	});

});