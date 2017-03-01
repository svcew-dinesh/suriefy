/**
 * Created by dinesh on 28/2/17.
 */
(function () {

    var app = angular.module('myApp', ['ngMessages']);

    // angular constants
    app.constant("REGEXP", {
        "EMAIL": new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*.(\.[a-z]{2,50})$', 'i'),
        "PHONE": new RegExp('^[1-9][0-9]{9}$', 'i'),
        "ZIP": new RegExp('^[1-9][0-9]{5}$', 'i')
    });

    app.config(function ($interpolateProvider, $httpProvider) {
        // interpolation will make us to define starting and ending braces as we want
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');

        //this is used to set cookies and headers, which are used to send http requests through angular
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    });

    // service to get, post, put and delete records from DB
    // $q is used as a promise i.e. a backend call will wait data comes from backend
    app.service('contactService', function ($http, $q) {

        this.addContact = function (query) {
            var deffered = $q.defer();
            var config = {
                method: "post",
                url: "/api/userContacts",
                data: query
            };
            $http(config).then(function (response) {
                deffered.resolve(response.data);
            }, function (data) {
                deffered.reject(data);
            });

            return deffered.promise;
        };

        this.getContacts = function () {
            var deffered = $q.defer();
            var config = {
                method: "get",
                url: "/api/userContacts"
            };
            $http(config).then(function (response) {
                deffered.resolve(response.data);
            }, function (data) {
                deffered.reject(data);
            });

            return deffered.promise;
        };

        this.deleteContact = function (data) {

            var deffered = $q.defer();
            var config = {
                method: "delete",
                url: "/api/userContacts/?id=" + data
            };
            $http(config).then(function (response) {
                deffered.resolve(response);
            }, function (response) {
                deffered.reject(response);
            });
            return deffered.promise;
        };

        this.updateContact = function (data) {
            var deffered = $q.defer();
            var config = {
                method: "put",
                url: "/api/userContacts",
                data: data
            };
            $http(config).then(function (response) {
                deffered.resolve(response);
            }, function (response) {
                deffered.reject(response);
            });
            return deffered.promise;
        };
    });

    // controller used to handle actiond  such as add, edit, update and delete from view
    app.controller('contactListController', ['$scope', '$timeout', 'contactService', function ($scope, $timeout, contactService) {
        $scope.userContacts = [];
        $scope.user = {};

        $scope.getContacts = function () {
            $('#mydiv').show();
            contactService.getContacts().then(function (data) {
                $scope.userContacts = data;
                $scope.reset();
                $('#mydiv').hide();
            }, function () {
                console.log("error");
                $('#mydiv').hide();
            });
        };

        $scope.add = function (userContact) {
            contactService.addContact(userContact);
            $scope.user = {};
            $timeout(function () {
                $scope.getContacts();
                $scope.$apply();
            }, 0);
        };

        $scope.edit = function (userContact) {
            $scope.user = angular.copy(userContact);
        };

        $scope.update = function (userContact) {
            contactService.updateContact(userContact);
            $scope.user = {};
            $timeout(function () {
                $scope.getContacts();
                $scope.$apply();
            }, 0);
        };

        $scope.delete = function (userId) {
            contactService.deleteContact(userId);
            $scope.user = {};
            $timeout(function () {
                $scope.getContacts();
                $scope.$apply();
            }, 0);
        };

        $scope.reset = function () {
            $scope.userDetails.$setPristine();
        };

        $scope.getContacts();
    }]);

    // directive to check mail regex
    app.directive('cemail', ["REGEXP", function (REGEXP) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.cemail = function (modelValue, viewValue) {
                    var inputVal = modelValue || viewValue;
                    if (angular.isString(inputVal) && inputVal.length > 0 && !REGEXP.EMAIL.test(inputVal)) {
                        return false;
                    }
                    return true;
                }
            }
        };
    }]);

    // directive to check phone regex
    app.directive('cphone', ["REGEXP", function (REGEXP) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.cphone = function (modelValue, viewValue) {
                    var inputVal = modelValue || viewValue;
                    if (angular.isString(inputVal) && inputVal.length > 0 && !REGEXP.PHONE.test(inputVal)) {
                        return false;
                    }
                    return true;
                }
            }
        };
    }]);

    // directive to check zip regex
    app.directive('czip', ["REGEXP", function (REGEXP) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.czip = function (modelValue, viewValue) {
                    var inputVal = modelValue || viewValue;
                    if (angular.isString(inputVal) && inputVal.length > 0 && !REGEXP.ZIP.test(inputVal)) {
                        return false;
                    }
                    return true;
                }
            }
        };
    }]);

})();