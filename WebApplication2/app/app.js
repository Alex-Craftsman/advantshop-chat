function elemscrolltop() {
    var height = document.getElementById('chat').scrollHeight - 50;
    document.getElementById('chat').scrollTop = height;
}



var app = angular.module('app', []);
app.controller('homecontroller', function ($scope, $http) {
    $scope.message = { text: '' };
    $scope.messages = [];
    $scope.user = { name: '' };
    $scope.users = [];
    $scope.userId = {};
    $scope.reg = true;
    $scope.chat = $.connection.chatHub;

    function InitMessages() {
        $scope.chat.server.onload();
    }

    function addUser() {

        function initUsers() {
            $scope.chat.server.initusers();
        }
        console.log("s");
        if (localStorage.getItem("user") !== null) {
            $scope.user = JSON.parse(localStorage.getItem("user"));
            $scope.chat.server.connect($scope.user.name);
            $scope.reg = false;
        }

        else {
            localStorage.setItem("user", JSON.stringify($scope.user));
            $scope.user = JSON.parse(localStorage.getItem("user"));
            $scope.chat.server.connect($scope.user.name);
            $scope.reg = false;
        }
    }
    
    $scope.chat.client.onNewUserConnected = function (id, name) {
        $scope.messages.push(name + " присоединился!");
        elemscrolltop();
    }

    $scope.chat.client.GetMessages = function (message) {
        $scope.messages.push(message);
        elemscrolltop();
        $scope.$apply();
    }

    $scope.chat.client.addMessage = function (message) {
        $scope.messages.push(message);
        elemscrolltop();
        $scope.$apply();
    }

    $scope.chat.client.GetUsersName = function (user) {
        $scope.users.push(user);
        $scope.$apply();
    }
    
    $scope.chat.client.onConnected = function (id) {
        $scope.userId = id;
        $scope.$apply();
    }

    $scope.chat.client.onDoubleName = function (error) {
        alert(error);
        localStorage.removeItem("user");
        location.reload();
    }

    $.connection.hub.start().done(function () {
        if (localStorage.getItem("user") !== null) {
            $scope.user = JSON.parse(localStorage.getItem("user"));
            addUser();
            InitMessages();
        }
        $scope.adduser = function () {
            addUser();
            InitMessages();
        }
    });

    $scope.sendmessage = function () {
        $scope.chat.server.send($scope.user.name, $scope.message.text);
        $scope.message = {}
    };
});



