function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

var myPrettyCode = function() {
  radio=document.getElementById("radio").value;
  radioGauss=document.getElementById("radioGauss").value;

  alturaGauss=document.getElementById("alturaGauss").value;
    alert(alturaGauss);
     setVars(radio,radioGauss,alturaGauss);

};
