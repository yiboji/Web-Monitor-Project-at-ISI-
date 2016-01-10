//model
var monitor = angular.module("monitor",["chart.js"]);
var socket = io();
var dataset = [[]];
var labelset = [];

socket.on('chart',function(data){
	var $scope= angular.element($("#mychart")).scope();
	$scope.$apply(function(){
		console.log("Just Insert:"+data);
		$scope.labels.push($scope.labels.length);
		$scope.data[0].push(data.cap);
	});
});



//controller part
monitor.config(['ChartJsProvider', function (ChartJsProvider) {
	// Configure all charts
	ChartJsProvider.setOptions({
	  //colours: ['#FF5252', '#FF8A80'],
	  responsive: false
	});
	// Configure all line charts
	ChartJsProvider.setOptions('Line', {
	  //datasetFill: false
	});
}]);

monitor.controller("LineCtrl",function($scope,$http){
	$scope.labels = [];
	$scope.series = ["Nexus 1"];
	$scope.data = [[]];

	$http.get('/api/data')
	.success(function(data){
		console.log("Client:initial get"+data);
		for(var item in data){
			$scope.labels.push($scope.labels.length.toString());
			$scope.data[0].push(data[item].cap);	
		}
	})
	.error(function(err){
		console.log("client:ERROR:"+err);
	});
	$scope.labels = labelset;
	$scope.data = dataset;
	$scope.onClick = function(points,evt){
		console.log(points,evt);
	};
});
