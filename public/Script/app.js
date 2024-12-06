// immediately invoked function expression

(function(){
    function start(){
        console.log("app started")
    }
    window.addEventListener("load",start);
})();

// FOR CONTACT US PAGE:
(function () {
    'use strict';
    var forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();
