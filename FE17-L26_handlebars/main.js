$(document).ready(function () {

    let container = $('#container');

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://www.json-generator.com/api/json/get/cgmZpkYnYi",
        success: function (result) {
            let newUsers = modifyObject(result);
            localStorage.setItem('users', JSON.stringify(newUsers));
            render(newUsers);
        }
    });

    function modifyObject(users) {
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

    function render(data) {

        let source = $('#template').html();
        let template = Handlebars.compile(source);
        let html = template(data);
        container.append(html);
        eventRemove();
        $('.stringTable:odd').addClass('oddColorBg');
        $('.stringTable:even').addClass('evenColorBg');

    }

    function clear() {
        $('.stringTable').empty();
    }

    $('#select').change(function () {
        let val = $(this).val();
        let users = JSON.parse(localStorage.getItem('users'));
        let firstNameSort = users.newUsers.sort(function (a, b) {
            return a[val] > b[val];
        });
        clear();
        render({newUsers: firstNameSort});

    });

    $('.reset').click(function () {
        clear();
        let users = JSON.parse(localStorage.getItem('users'));
        render(users);
    });

    $('#search').keyup(function () {
        let input = $('#search').val().toLowerCase();
        let users = JSON.parse(localStorage.getItem('users'));
        let usersFilter = users.newUsers.filter(function (user) {
            return ((user.firstName).toLowerCase().indexOf(input) !== -1)
                || ((user.lastName).toLowerCase().indexOf(input) !== -1);
        });
        clear();
        render({newUsers: usersFilter});
    });

    function eventRemove() {

        $('.deleteString').click(function (event) {
            let delFirstName =  $(this).parent().siblings("td").eq(0).text();
            let delLastName = $(this).parent().siblings("td").eq(1).text();
            $(this).parent().parent().remove();
        });
    }
});


