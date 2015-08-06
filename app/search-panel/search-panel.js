(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    //console.log(currentScriptPath);

    angular.module('ac-search-panel', ['ngRoute'])
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
                nombreVisible: '@nombreVisible',
                nombre: '@',
                nombref: '@',
                width: '@',
                fontSize: '@',
                func:'=',
                extraFilter: '='
            },
            templateUrl: currentScriptPath.replace('.js', '.html'),
            controller: function ($scope, $compile, $http) {
                var vm = this;
                vm.selected = {};
                vm.list = [];
                vm.mostrarPanel = mostrarPanel;
                vm.ocultarPanel = ocultarPanel;
                vm.move = move;
                vm.select = select;
                vm.func = $scope.func;
                vm.data = [];
                vm.extraFilter = $scope.extraFilter;
                vm.indexSelected = 0;

                $scope.$watch(
                    'extraFilter', function(){
                        //console.log($scope.extraFilter);
                        vm.extraFilter = $scope.extraFilter;
                    }
                );

                //$document.on('click', mostrarPanel);
                ocultarTodo();

                function select(index) {

                    $scope.obj = vm.data[index];

                    if(vm.data[index].nombre !== undefined && vm.data[index].nombre !== ''){
                        $scope.objName = vm.data[index].nombre;
                        if(vm.data[index].apellido !== undefined && vm.data[index].apellido !== ''){
                            $scope.objName = $scope.objName + ' ' + vm.data[index].apellido;
                        }
                    }else if(vm.data[index].descripcion !== undefined && vm.data[index].descripcion !== ''){
                        $scope.objName = vm.data[index].descripcion;
                    }



                    ocultarPanel();
                }

                function ocultarPanel() {
                    var element = document.getElementById("ac-live-search" + $scope.nombre);
                    //angular.element(element).css({opacity: '0'});
                    angular.element(element).css({WebkitClipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'});
                    angular.element(element).css({clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'});
                    angular.element(element).css({zIndex: '-1'});
                }

                function ocultarTodo() {
                    var elements = document.getElementsByClassName('ac-live-search');
                    for (var i = 0; i < elements.length; i++) {
                        //angular.element(elements[i]).css({opacity: '0'});
                        angular.element(elements[i]).css({WebkitClipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'});
                        angular.element(elements[i]).css({clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'});
                        angular.element(elements[i]).css({zIndex: '-1'});
                    }

                    //for (var e in elements){
                    //    console.log(e);
                    //}
                }


                function mostrarPanel() {

                    ocultarTodo();

                    $timeout(
                        function showPanel() {
                            $scope.$watch(
                                'objName', function(){
                                    vm.objName = $scope.objName;
                                }
                            );
                            //console.log(vm.objName);

                            if(vm.objName === undefined){
                                $scope.obj = undefined;
                            }


                            if (vm.objName !== undefined && vm.objName.length >= 3) {
                                var element = document.getElementById("ac-live-search" + $scope.nombre);

                                if(vm.extraFilter != '' && vm.extraFilter !== undefined){
                                    vm.func($scope.objName, vm.extraFilter, function(data){

                                        showResults(clone(data), element);

                                    });
                                }else{

                                    vm.func($scope.objName, function(data){

                                        showResults(clone(data), element);

                                    });

                                }






                                //var top = parseInt($scope.fontSize) + parseInt($scope.top);
                            } else {

                                ocultarPanel();
                            }
                        }
                    );
                }

                function clone(obj) {
                    if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
                        return obj;

                    var temp = obj.constructor(); // changed

                    for(var key in obj) {
                        if(Object.prototype.hasOwnProperty.call(obj, key)) {
                            obj['isActiveClone'] = null;
                            temp[key] = clone(obj[key]);
                            delete obj['isActiveClone'];
                        }
                    }

                    return temp;
                }

                function move(event){
                    //console.log(event);

                    if(vm.data.length > 0){
                        if(event.keyCode == 40 && vm.indexSelected < vm.data.length){
                            vm.indexSelected += 1;
                        }

                        if(event.keyCode == 38 && vm.indexSelected > 0){
                            vm.indexSelected -= 1;
                        }


                        if(event.keyCode == 13){
                            select(vm.indexSelected);
                        }

                    }
                }


                function showResults(data, element){
                    if(data.length>0){
                        vm.data = [];

                        vm.data = data;

                        var heightPanel = 32 * data.length;


                        angular.element(element).css({position: 'absolute'});
                        angular.element(element).css({width: $scope.width + 'px'});
                        angular.element(element).css({height: heightPanel + 'px'});
                        //angular.element(element).css({top: top+ 'px'});
                        //angular.element(element).css({marginTop: '-35px'});
                        angular.element(element).css({left: $scope.left + 'px'});
                        angular.element(element).css({margin: '2px'});


                        angular.element(element).css({WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'});
                        angular.element(element).css({clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'});

                        //angular.element(element).css({opacity: '1'});
                        angular.element(element).css({zIndex: '1'});
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