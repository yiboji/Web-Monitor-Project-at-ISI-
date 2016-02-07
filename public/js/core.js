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
	$scope.series = ["Nexus 0"];
	$scope.data = [[]];

	$http.get('/api/data')
	.success(function(data){
		console.log("Client:initial get"+data);
		var count = 0;
		var vtotal = 0;
		var atotal = 0;
		var ptotal = 0;
		for(var item in data){
			if(count%10==0){
				//$scope.labels.push($scope.labels.length.toString());
				$scope.labels.push(~~(count*3/60)+"h"+count*3%60+'m');
				$scope.data[0].push(data[item].cap);	
			}
			vtotal += data[item].volt;
			atotal += data[item].curr;
			count ++;
		}
		console.log("average is "+vtotal/count);
		$scope.volave = (vtotal/count).toFixed(2);
		$scope.hours= ~~(count/20.0);
		$scope.minutes= (3*count)%60;
		//$scope.curave = atotal/count;
		//$scope.powave = vtotal*atotal;
	})
	.error(function(err){
		console.log("client:ERROR:"+err);
	});
	$scope.onClick = function(points,evt){
		console.log(points,evt);
	};
});
