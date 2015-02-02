requirejs.config({
    baseUrl: 'static/js/libs',
    paths: {
        app: 'static/js/app',
        map: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCmOLri_CF9WwC15VZOBtYXKYSPfoDb7Is'
    }
});


requirejs([
  'jquery',
  'bootstrap'
],
function ($, bootstrap, maps) {

});