//******IMT Routines ********

function gaussianRandom(mean, sigma) {
  let u = Math.random()*0.682;
  return ((u % 1e-8 > 5e-9 ? 1 : -1) * (Math.sqrt(-Math.log(Math.max(1e-9, u)))-0.618))*1.618 * sigma + mean;
}

// Arithmetic mean
let getMean = function (data) {
    return data.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / data.length;
};

// Standard deviation
let getSD = function (data) {
    let m = getMean(data);
    return Math.sqrt(data.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (data.length - 1));
};

// arrayMax
let arrayMax = function (data) {
    return data.reduce(function (a, b) {
        return Math.max(a, b);
    });
};

// arrayMin
let arrayMin = function (data) {
    return data.reduce(function (a, b) {
        return Math.min(a, b);
    });
};

function shuffle(array) {
for (let i = array.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  [array[i], array[j]] = [array[j], array[i]];
}
}

function linspace(a,b,n) {
  if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
  if(n<2) { return n===1?[a]:[]; }
  var i,ret = Array(n);
  n--;
  for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
  return ret;
}

function randomInts(dataSetSize, minValue, maxValue) {
return new Array(dataSetSize).fill(0).map(function(n) {
  return Math.floor(Math.random() * (maxValue - minValue) + minValue);
});
}

function distance (pointA, pointB) {

var a = pointA[0] - pointB[0];
var b = pointA[1] - pointB[1];
return Math.trunc(Math.sqrt( a*a + b*b ));

}

function cancelAllAnimationFrames(){
 var id = window.requestAnimationFrame(function(){});
 while(id--){
   window.cancelAnimationFrame(id);
 }
}

function pad (myNum, size) {
var s = String(myNum);
while (s.length < (size || 2)) {s = "0" + s;}
return s;
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

// For storing data locally
function downloadData(file, text) {

  //creating an invisible element
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8, '
  + encodeURIComponent(text));
  element.setAttribute('download', file);

  //the above code is equivalent to
  // <a href="path of file" download="file name">

  document.body.appendChild(element);

  //onClick property
  element.click();

  document.body.removeChild(element);
}
