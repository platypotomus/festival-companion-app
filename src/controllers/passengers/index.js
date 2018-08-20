function passengersIndexCtrl($http, $scope, $state) {
  $http({
    method: 'GET',
    url: `/api/festival/${$state.params.festivalId}/carShares/${$state.params.carShareId}/passengers`
  })
    .then(res => {
      $scope.passengers = res.data;
    });
}

export default passengersIndexCtrl;
