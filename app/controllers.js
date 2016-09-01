'use strict';

/* Controllers */

var CAControllers = angular.module('CAControllers', []);

CAControllers.controller('TimeCtrl', ['$scope',
    function ($scope){

    }
]);

CAControllers.controller('TimetableCtrl', ['$scope',
    function ($scope){
        document.getElementById("NavTitle").innerHTML = "Catherine ♥︎ Ant"

        var d = new Date();
        //得到1970年一月一日到现在的秒数
        var len = d.getTime();
        //本地时间与GMT时间的时间偏移差
        var offset = d.getTimezoneOffset() * 60000;
        //得到现在的格林尼治时间
        var utcTime = len + offset;
        // 洛杉矶时间
        var currentDate = new Date(utcTime + 3600000 * -7);

        $scope.today = (new Date(utcTime + 3600000 * -7)).toString('ddd MMM dd yyyy');

        $scope.getUpAt = ""
        if ((new Date(utcTime + 3600000 * -7)).addDays(1).is().monday()) {
            $scope.getUpAt = "7 AM😬";
        } else if ((new Date(utcTime + 3600000 * -7)).addDays(1).is().weekday()) {
            $scope.getUpAt = "6 AM😪";
        } else {
            $scope.getUpAt = "WHENEVER🌝";
        }

        $scope.isMinimumDay = "NO😑";

        $scope.nextHoliday = "";
        if (!(new Date(utcTime + 3600000 * -7)).addDays(1).is().weekday()) {
            $scope.nextHoliday = "TOMORROW💃🏻💃🏻💃🏻"
        } else if (!(new Date(utcTime + 3600000 * -7)).addDays(2).is().weekday()) {
            $scope.nextHoliday = "2 days😃"
        } else {
            var dayDif = parseInt(((new Date(utcTime + 3600000 * -7)).next().saturday().getTime() - (new Date(utcTime + 3600000 * -7)).getTime()) /  1000  /  60  /  60  / 24) - 1
            $scope.nextHoliday = dayDif + " days😃"
        }
    }
]);

CAControllers.controller('HomeworkCtrl', ['$scope', '$wilddogArray', "$window",
    function ($scope, $wilddogArray, $window){
        document.getElementById("NavTitle").innerHTML = "Catherine ♥︎ Ant"

        var ref = new Wilddog("https://chengkang.wilddogio.com/homework");

        $scope.switchTab = function(tabIndex) {
            var todoDom = $('#todo');
            var doneDom = $('#done');
            var lateDom = $('#late');

            var tab1 = $('#tab1');
            var tab2 = $('#tab2');
            var tab3 = $('#tab3');

            console.info("Tab Switched!");
            if (tabIndex == 0) {
                tab1.attr('class', 'is-active');
                tab2.attr('class', '');
                tab3.attr('class', '');

                todoDom.show();
                doneDom.hide();
                lateDom.hide();
            } else if (tabIndex == 1) {
                tab1.attr('class', '');
                tab2.attr('class', 'is-active');
                tab3.attr('class', '');

                todoDom.hide();
                doneDom.show();
                lateDom.hide();
            } else if (tabIndex == 2) {
                tab1.attr('class', '');
                tab2.attr('class', '');
                tab3.attr('class', 'is-active');

                todoDom.hide();
                doneDom.hide();
                lateDom.show();
            }
        };

        var selectedHomeworkId = "";
        $scope.showModal = function (homework) {
            console.log(homework);

            var modal = $("#modal");
            // var title = $("#modal-title");
            var content = $("#modal-content");
            var editBtn = $("#edit-btn");

            selectedHomeworkId = homework.$id

            content.html("<strong>Subject:</strong>&nbsp;&nbsp;&nbsp;&nbsp;"+homework.subject+"<br><strong>Content:</strong>&nbsp;&nbsp;&nbsp;&nbsp;"+homework.content+"<br><strong>Deadline:</strong>&nbsp;&nbsp;&nbsp;&nbsp;"+homework.deadline);
            modal.attr("class", "modal is-active");

            editBtn.attr("href", "#homework-edit/id="+homework.$id)
        }

        $scope.hideModal = function () {
            var modal = $("#modal");
            modal.attr("class", "modal");
        }

        $scope.markDone = function () {
            ref.child(selectedHomeworkId).update({"done":"YES", "doneAt":Wilddog.ServerValue.TIMESTAMP});
            // $scope.hideModal();
            $window.location.href = "#assignments";
        }

        $scope.deleteHomework = function () {
            ref.child(selectedHomeworkId).remove();
            // $scope.hideModal();
            $window.location.href = "#assignments";
        }

        $scope.getTimeText = function (dateText) {

            var d = new Date();
            //得到1970年一月一日到现在的秒数
            var len = d.getTime();
            //本地时间与GMT时间的时间偏移差
            var offset = d.getTimezoneOffset() * 60000;
            //得到现在的格林尼治时间
            var utcTime = len + offset;
            // 洛杉矶时间
            var currentDate = new Date(utcTime + 3600000 * -7);

            if (dateText.length > 10) {
                dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
            }

            var dayDif = Math.ceil((Date.parse(dateText).getTime() - currentDate.getTime()) /  1000  /  60  /  60  / 24)

            if (dayDif > 1) {
                return dayDif + " days left"
            } else if (dayDif == 1) {
                return "Tomorrow"
            } else if (dayDif == 0) {
                return "Today"
            } else {
                return -dayDif + " days ago"
            }
        }

        $scope.getStatus = function (dateText) {

            var d = new Date();
            //得到1970年一月一日到现在的秒数
            var len = d.getTime();
            //本地时间与GMT时间的时间偏移差
            var offset = d.getTimezoneOffset() * 60000;
            //得到现在的格林尼治时间
            var utcTime = len + offset;
            // 洛杉矶时间
            var currentDate = new Date(utcTime + 3600000 * -7);

            if (dateText.length > 10) {
                dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
            }

            var dayDif = Math.ceil((Date.parse(dateText).getTime() - currentDate.getTime()) /  1000  /  60  /  60  / 24)

            if (dayDif > 1) {
                return "nohurry"
            } else if (dayDif >= 0) {
                return "tight"
            } else {
                return "late"
            }
        }
        
        // 创建一个同步数组
        $scope.todo = $wilddogArray(ref.orderByChild("done").equalTo("NO"));
        $scope.done = $wilddogArray(ref.orderByChild("done").equalTo("YES"));

        $scope.todoList = [];
        $scope.doneList = [];
        $scope.lateList = [];

        // 奖励花花
        $scope.flowerCount = 0;
        
        $scope.todo.$loaded().then(function () {
            //to make sure that $scope.blogs is already loaded, otherwise length doesn't exist

            $scope.todoList = [];
            $scope.lateList = [];

            for(var i=0;i<$scope.todo.length;i++){
                var dateText = $scope.todo[i].deadline
                if (dateText.length > 10) {
                    dateText = dateText.substring(0,10) + "T" + dateText.substring(11)
                }
                $scope.todo[i].timestamp = Date.parse(dateText).getTime()

                var status = $scope.getStatus($scope.todo[i].deadline);
                if (status == "late") {
                    $scope.lateList.push($scope.todo[i]);
                } else if (status == "nohurry") {
                    $scope.todo[i].nohurry = true;
                    $scope.todoList.push($scope.todo[i]);
                } else {
                    $scope.todo[i].nohurry = false;
                    $scope.todoList.push($scope.todo[i]);
                }
            }

            if ($scope.lateList.length == 0) {
                $("#no-late-work-notif").show();
                $scope.flowerCount += 10;
            } else {
                $("#no-late-work-notif").hide();
            }
        });
        $scope.done.$loaded().then(function () {
            $scope.doneList = [];

            for(var i=0;i<$scope.done.length;i++){
                $scope.flowerCount += $scope.done[i].type == "Test" ? 10 : ($scope.done[i].type == "Quiz" ? 3 : 1);

                var dateText = $scope.done[i].deadline
                if (dateText.length > 10) {
                    dateText = dateText.substring(0,10) + "T" + dateText.substring(11);
                }
                $scope.done[i].timestamp = Date.parse(dateText).getTime();

                $scope.doneList.push($scope.todo[i]);
            }
        });
    }
]);

CAControllers.controller('HomeworkNewCtrl', ['$scope', '$wilddogArray', "$window",
    function ($scope, $wilddogArray, $window){
        
        var ref = new Wilddog("https://chengkang.wilddogio.com/homework");
        // 创建一个同步数组
        $scope.homeworks = $wilddogArray(ref);

        $scope.addHomework = function() {
            $scope.homeworks.$add({
                subject: $scope.subject,
                type: $scope.type,
                deadline:$scope.deadline,
                content: $scope.content,
                done:"NO",
                createAt:Wilddog.ServerValue.TIMESTAMP,
            });

            $window.location.href = "#assignments";
        };
    }
]);

CAControllers.controller('HomeworkEditCtrl', ['$scope', '$wilddogObject', "$routeParams",
    function ($scope, $wilddogObject, $routeParams){
        
        var ref = new Wilddog("https://chengkang.wilddogio.com/homework/"+$routeParams.id);
        // 创建一个同步数组
        var data = $wilddogObject(ref);

        data.$bindTo($scope,"homework")
    }
]);
