
if (window.location.pathname === '/') {
  const navtop = document.querySelector('navtop');
  navtop.style.display = "none";
}

if (window.location.pathname === '/user/new-activity' || window.location.pathname === '/user/activity/:id/edit' || window.location.pathname === '/login' || window.location.pathname === "/signup" || window.location.pathname === '/user/edit-profile' ) {

  const logo = document.querySelector('#iclogo') 
  logo.style.display = 'none';
}
console.log(window.location.pathname);



function goBack() {
    window.history.back();
  }


  