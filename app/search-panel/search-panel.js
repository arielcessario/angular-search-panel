(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    //console.log(currentScriptPath);

    angular.module('nombreapp.ac-search-panel', ['ngRoute'])
        .directive('acSearchPanel', AcSearchPanel)
        .service('acSearchPanelService', AcSearchPanelService);


    AcSearchPanel.$inject = ['$location', '$route', '$timeout', '$document'];

    function AcSearchPanel($location, $route, $timeout, $document) {
        return {
            restrict: 'AE',
            scope: {
                obj: '=',
                objName: '=',
                dataSet: '=',
                nombre: '@',
                nombref: '@',
                width: '@',
                fontSize: '@',
                url:'='
            },
            templateUrl: currentScriptPath.replace('.js', '.html'),
            controller: function ($scope, $compile, $http) {
                var vm = this;
                vm.selected = {};
                vm.list = [];
                vm.mostrarPanel = mostrarPanel;
                vm.ocultarPanel = ocultarPanel;
                vm.select = select;

                //$document.on('click', mostrarPanel);


                function select() {
                    console.log('lañsdfkjasñdfj');
                }

                function ocultarPanel() {
                    var element = document.getElementById("ac-live-search" + $scope.nombre);
                    angular.element(element).css({opacity: '0'});
                    angular.element(element).css({zIndex: '-1'});
                }

                function ocultarTodo() {
                    var elements = document.getElementsByClassName('ac-live-search');
                    for (var i = 0; i < elements.length; i++) {
                        angular.element(elements[i]).css({opacity: '0'});
                        angular.element(elements[i]).css({zIndex: '-1'});
                    }

                    //for (var e in elements){
                    //    console.log(e);
                    //}
                }


                function mostrarPanel() {

                    ocultarTodo();

                    if ($scope.objName != undefined && $scope.objName.length > 3) {
                        var element = document.getElementById("ac-live-search" + $scope.nombre);
                        //var top = parseInt($scope.fontSize) + parseInt($scope.top);

                        angular.element(element).css({position: 'fixed'});
                        angular.element(element).css({backgroundColor: 'blue'});
                        angular.element(element).css({width: $scope.width + 'px'});
                        angular.element(element).css({height: $scope.fontSize + 'px'});
                        //angular.element(element).css({top: top+ 'px'});
                        angular.element(element).css({left: $scope.left + 'px'});
                        angular.element(element).css({margin: '2px'});

                        angular.element(element).css({opacity: '1'});
                        angular.element(element).css({zIndex: '1'});
                    } else {
                        ocultarPanel();
                    }
                }

            },
            link: function (scope, element, attr) {
                scope.identifier = 'input' + scope.nombre;
                $timeout(
                    function load() {
                        var input = document.getElementById('input' + scope.nombre);
                        angular.element(input).css({width: scope.width + 'px'});
                    }
                );
                scope.top = element[0].offsetTop;
                scope.left = element[0].offsetLeft;
            },
            controllerAs: 'acSearchCtrl'
        };
    }

    AcSearchPanelService.$inject = ['$http'];
    function AcSearchPanelService($http){
        var service = {};

        service.Get = Get;

        return service;

        function Get(url, _function){
            return $http.post(url, {function:_function});
        }


    }

})();