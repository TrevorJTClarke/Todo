var todoApp = angular.module('todo', ['ngResource']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    config(function($routeProvider) {
        $routeProvider.
          when('/', {controller:TodoCtrl, templateUrl:'partials/todo'}).
          when('/todos', {controller:TodoCtrl, templateUrl:'partials/todo'}).
          otherwise({redirectTo:'/login'});
      });
    $locationProvider.html5Mode(true);
  }]);

function HomeCtrl($scope,$location) {
    $http.get('/login').then(function($res) {
        $scope.todos = $res.data.todos;
    });
}

function LoginCtrl($scope,$location) {
    // $scope.onLoginClick = function()
    // {
    //     // a direct window.location to overcome Angular intercepting your call!
    //     window.location = "/auth/twitter";
    // }
}

function TodoCtrl($scope, $element, $http) {
    $http.get('/list').then(function($res) {
        $scope.todos = $res.data.todos;
    });

    $scope.addTodo = function() {
        $scope.todos.unshift({content:$scope.todoText, done:false});

        $http.post('/create', {content:$scope.todoText, done:false}).then(function () {    
            
        });

        $scope.todoText = '';
    };

    $scope.removeTodo = function(todo) {
        var ID = todo._id;
        $scope.todos.splice($scope.todos.indexOf(todo), 1);
        
        $http.post('/destroy/'+ID).then(function () {
            console.log('todo deleted');
        });
    };
    $scope.todoDone = function(todo) {
        var ID = todo._id;
        console.log(ID);

        $scope.todos.splice($scope.todos.indexOf(todo), 1);
        $scope.todos.unshift({content:todo.content, done:true});

        $http.post('/done/'+ID).then( function () {
            console.log('checked as done');
        });
    };
    $scope.todoNotDone = function(todo) {
        var ID = todo._id;
        console.log(ID);

        $scope.todos.splice($scope.todos.indexOf(todo), 1);
        $scope.todos.unshift({content:todo.content, done:false});

        $http.post('/update/'+ID).then( function () {
            console.log('checked as not done');
        });
    };

    $scope.$watch('todoText', function(newValue, oldValue) { 
        console.log('hello');
    });
}

// todoApp.directive('doneUpdate', function(todo) {
//     return function(scope, element, attrs) {
//         scope.$watch(attrs.doneUpdate, function(todo) {
//             if(todo) {
//                 console.log('here');
//             } else {
//                 console.log('else');
//             }
//         }, true);
//     }
// });

function EditCtrl($scope, $element) {
    $scope.editEn = false;

    $scope.enabEdit = function() {
        $scope.editEn = true;
        $scope.todoName = $scope.todo.content;
    },

    $scope.cancelEdit = function() {
        $scope.editEn = false;
    },

    $scope.saveEdit = function(todo) {
        if ($scope.todoName === "") {
            return false;
        }
        var ID = todo._id;
        todo.content = $scope.todoName;
        $.post('/update/'+ID, $scope.todo);
        $scope.cancelEdit();
    }
}
