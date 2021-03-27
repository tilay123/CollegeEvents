const waitlist = document.querySelector('#wait-list');

// create element and render waitlist
function renderCafe(doc) {
    let li = document.createElement('li');
    let Fnmae = document.createElement('span');
    let Lname = document.createElement('span');
    let Eventname = document.createElement('span');
    let Eventtime = document.createElement('span');
    let Eventlocation = document.createElement('span');

    li.setAttribute('data-id',doc.id);
    fname.textContent = doc.data().firstname;
    Lname.textContent = doc.data().lastname;
    Eventname.textContent = doc.data().eventname;
    Eventtime.textContent = doc.data().eventtime;
    Eventlocation.textContent = doc.data().eventlocation;

    li.appendChild(fname);
    li.appendChild(lname);
    li.appendChild(Eventname);
    li.appendChild(Eventtime);
    li.appendChild(Eventlocation);

    waitlist.appendChild(li);
}


db.collection('Waitlist').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        rederCafe(doc);
    })
});



form.addEventListener('submit',(e) => {
    e.preventDefault();
    db.collection('Waitlist').add({
        firtname: form.FirstName.value,
        lastname: form.Lastname.value,
        EventName: form.EventName.value,
        evnettime: form.EventTime.value,
        location: form.Location.value

    });
    form.FirstName.value = ' ';
    form.Lastname.value= ' ';
    form.EventName.value= ' ';
    form.EventTime.value= ' ';
    form.Location.value= ' ';

})