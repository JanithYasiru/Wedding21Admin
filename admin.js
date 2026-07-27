import { db } from "./firebase.js";


import {

    collection,

    getDocs,

    deleteDoc,

    doc,

    setDoc,

    updateDoc

}

    from

    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



window.adminRSVP = async function (id, response) {


    const guestRef = doc(

        db,

        "Guests",

        id

    );



    let data = {


        rsvp: response,


        respondedAt:

            response === "PENDING"

                ?

                null

                :

                new Date()


    };



    await updateDoc(

        guestRef,

        data

    );



    showToast(
        "RSVP Updated ❤️"
    );





    loadGuests();

    loadDashboard();


}


const buttons = document.querySelectorAll(".nav-btn");

const pages = document.querySelectorAll(".page");


// =====================================
// LOAD GUESTS FROM FIREBASE
// =====================================


async function loadGuests() {


    const guestList =
        document.getElementById(
            "guestList"
        );



    guestList.innerHTML = "";


    const snapshot =
        await getDocs(
            collection(
                db,
                "Guests"
            )
        );


    const rsvpSnapshot =
        await getDocs(
            collection(
                db,
                "RSVP"
            )
        );


    let rsvpList = {};



    rsvpSnapshot.forEach(item => {


        rsvpList[item.id] = item.data();



    });



    snapshot.forEach((document) => {


        const guest =
            document.data();



        const guestID =
            document.id;



        guestList.innerHTML +=



            `
    
    <div class="guest-card">
    
    
    <div class="guest-name">
    
    ${guest.name}
    
    </div>
    
    
    
    <div class="guest-category">
    
    ${guest.category}
    
    </div>
    
    
    
    <div class="guest-link">
    
    
    🔗
    
    https://janithyasiru.github.io/Wedding21/?guest=${guestID}
    
    
    </div>
    
    
    
    <div class="guest-status">


RSVP :

${guest.rsvp || "PENDING"}


<br>


${guest.respondedAt

                ?

                "Responded: " +
                new Date(
                    guest.respondedAt.seconds * 1000
                )
                    .toLocaleString()

                :

                ""

            }


</div>


<div class="rsvp-controls">


<button
class="yes-btn"
onclick="adminRSVP('${guestID}','YES')">

✅ Confirm

</button>


<button
class="no-btn"
onclick="adminRSVP('${guestID}','NO')">

❌ Decline

</button>


<button
class="pending-btn"
onclick="adminRSVP('${guestID}','PENDING')">

⏳ Pending

</button>


</div>
    
    
    
    <div class="card-actions">
    
    
    <button 
    class="copy-btn"
    onclick="copyLink('${guestID}')">
    
    📋 Copy
    
    
    </button>
    
    
    
    
    <button 
    class="whatsapp-btn"
    onclick="shareWhatsApp('${guestID}','${guest.name}')">
    
    
    📱 WhatsApp
    
    
    </button>
    
    
    
    <button 
    class="delete-btn"
    onclick="deleteGuest('${guestID}','${guest.name}')">
    
    
    🗑 Delete
    
    
    </button>
    
    
    
    </div>
    
    
    </div>
    
    `;



    });


}



loadGuests();



window.copyLink = function (id) {


    const link =

        `https://janithyasiru.github.io/Wedding21/?guest=${id}`;



    navigator.clipboard.writeText(link);


    showToast(
        "Invitation link copied ❤️"
    );



}



window.shareWhatsApp = function (id, name) {



    const link =

        `https://janithyasiru.github.io/Wedding21/?guest=${id}`;



    const message =

        `Dear ${name},
            
            You are warmly invited to celebrate our wedding ❤️
            
            Please open your invitation:
            
            ${link}
            
            With love,
            Janith & Senuri 💍`;



    window.open(

        "https://wa.me/?text="

        +
        encodeURIComponent(message)

    );


}


window.deleteGuest=function(id,name){


    showConfirm(
    
    `
    Delete
    
    <strong>
    ${name}
    </strong>
    
    ?
    
    <br><br>
    
    This cannot be undone.
    
    `,
    
    async function(){
    
    
    
    await deleteDoc(
    
    doc(
    
    db,
    
    "Guests",
    
    id
    
    )
    
    );
    
    
    
    showToast(
    "Guest deleted successfully",
    "success"
    );
    
    
    
    loadGuests();
    
    
    
    }
    
    
    
    );
    
    
    
    }






buttons.forEach(button => {

    button.addEventListener("click", () => {

        if (button.dataset.page === "rsvp") {

            loadRSVP();

        }

        buttons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        pages.forEach(page => page.classList.remove("active-page"));

        document
            .getElementById(button.dataset.page)
            .classList.add("active-page");

    });

});











const guestList = document.getElementById("guestList");







const addGuestBtn =
    document.getElementById("addGuestBtn");


const guestForm =
    document.getElementById("guestForm");



addGuestBtn.onclick = function () {

    guestForm.classList.remove("hidden");

};





document.getElementById(
    "cancelGuestBtn"
).onclick = function () {


    guestForm.classList.add("hidden");


};





function generateCode() {


    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


}





document.getElementById(
    "saveGuestBtn"
)
    .onclick = async function () {



        const code = generateCode();


        const guest = {


            guestID: code,


            name:
                document.getElementById(
                    "newGuestName"
                ).value,


            category:
                document.getElementById(
                    "newGuestCategory"
                ).value,


            whatsapp:
                document.getElementById(
                    "newGuestPhone"
                ).value,


            email:
                document.getElementById(
                    "newGuestEmail"
                ).value,


            createdAt:
                new Date(),


            respondedAt:
                null,


            rsvp:
                "PENDING"


        };



        showToast(
            "Guest Added Successfully ❤️",
            "success"
            );


        await setDoc(

            doc(

                db,

                "Guests",

                code

            ),

            guest

        );





        




        location.reload();


    };

// =====================================
// DASHBOARD MONITORING
// =====================================


async function loadDashboard() {


    let total = 0;

    let yes = 0;

    let no = 0;

    let latest = null;



    const snapshot =
        await getDocs(
            collection(db, "Guests")
        );



    snapshot.forEach(item => {


        const guest = item.data();


        total++;


        if (guest.rsvp === "YES")
            yes++;


        else if (guest.rsvp === "NO")
            no++;




        if (

            guest.rsvp !== "PENDING" &&

            guest.respondedAt

        ) {


            if (

                !latest ||

                guest.respondedAt.seconds >

                latest.respondedAt.seconds

            ) {


                latest = {

                    name: guest.name,

                    category: guest.category,

                    phone: guest.whatsapp,

                    rsvp: guest.rsvp,

                    respondedAt: guest.respondedAt

                };


            }


        }


    });



    let pending =
        total - yes - no;



    document.getElementById("totalCount").innerHTML = total;

    document.getElementById("yesCount").innerHTML = yes;

    document.getElementById("noCount").innerHTML = no;

    document.getElementById("pendingCount").innerHTML = pending;



    let percentage = 0;


    if (total)

        percentage = Math.round(
            (yes / total) * 100
        );



    document.getElementById(
        "progressBar"
    )
        .style.width = percentage + "%";


    document.getElementById(
        "percentage"
    )
        .innerHTML =
        percentage + "% Confirmed";





    const latestBox =
        document.getElementById(
            "latestRSVP"
        );



    if (latest) {


        latestBox.innerHTML = `
    
    <div class="rsvp-item">
    
    
    <h3>
    
    ${latest.name}
    
    </h3>
    
    
    <p>
    
    Category:
    ${latest.category}
    
    </p>
    
    
    <p>
    
    Response:
    
    ${latest.rsvp === "YES"

                ?

                "✅ Coming"

                :

                "❌ Not Coming"

            }
    
    </p>
    
    
    
    <p>
    
    📱 ${latest.phone || "No phone"}
    
    </p>
    
    
    
    <p>
    
    🕒
    
    ${new Date(
                latest.respondedAt.seconds * 1000
            )
                .toLocaleString()

            }
    
    </p>
    
    
    </div>
    
    
    `;



    }

    else {


        latestBox.innerHTML =
            "No responses yet";


    }



}


loadDashboard();








// =================================
// RSVP TAB
// =================================


let currentFilter = "ALL";



window.loadRSVP = function () {



    const box =
        document.getElementById(
            "rsvpList"
        );



    if (!box) return;



    box.innerHTML = "Loading...";



    getDocs(
        collection(db, "Guests")

    )
        .then(snapshot => {


            let html = `


<div class="rsvp-table">


<div class="rsvp-row rsvp-header">

<div>Name</div>

<div>Category</div>

<div>Status</div>

<div>Responded</div>

</div>


`;




            snapshot.forEach(item => {


                const guest = item.data();



                if (

                    currentFilter !== "ALL"

                    &&

                    guest.rsvp !== currentFilter

                )

                    return;



                let status =
                    guest.rsvp || "PENDING";



                let statusClass = "status-pending";


                if (status === "YES")

                    statusClass = "status-yes";


                if (status === "NO")

                    statusClass = "status-no";



                let date = "-";



                if (guest.respondedAt) {

                    date =
                        new Date(

                            guest.respondedAt.seconds * 1000

                        )

                            .toLocaleString();

                }



                html += `


<div class="rsvp-row">


<div>

${guest.name}

</div>


<div>

${guest.category}

</div>


<div class="${statusClass}">

${status === "YES"

                        ?

                        "✅ Coming"

                        :

                        status === "NO"

                            ?

                            "❌ Not Coming"

                            :

                            "⏳ Pending"

                    }


</div>


<div>

${date}

</div>


</div>


`;



            });



            html += "</div>";



            box.innerHTML = html;



        });


}





window.filterRSVP = function (type) {


    currentFilter = type;


    loadRSVP();


}





// ===============================
// TOAST MESSAGE SYSTEM
// ===============================


window.showToast = function (
    message,
    type = "success"
) {


    const box =
        document.getElementById(
            "toastBox"
        );



    const toast =
        document.createElement(
            "div"
        );



    toast.className =
        "toast " + type;



    toast.innerHTML =

        `
    
    <span>
    
    ${type === "success"

            ?

            "✅"

            :

            type === "error"

                ?

                "❌"

                :

                "⚠️"

        }
    
    </span>
    
    ${message}
    
    `;



    box.appendChild(toast);



    setTimeout(() => {


        toast.classList.add(
            "hide"
        );



        setTimeout(() => {


            toast.remove();


        }, 400);



    }, 3000);



}



// =================================
// CONFIRMATION MODAL SYSTEM
// =================================


let confirmCallback=null;



window.showConfirm=function(
message,
callback
){


const modal =
document.getElementById(
"confirmModal"
);



document.getElementById(
"confirmMessage"
)
.innerHTML=message;



modal.classList.add(
"show"
);



confirmCallback=callback;


}





document.getElementById(
"cancelConfirm"
)
.onclick=function(){


document.getElementById(
"confirmModal"
)
.classList.remove(
"show"
);


confirmCallback=null;


}





document.getElementById(
"acceptConfirm"
)
.onclick=function(){



if(confirmCallback){

confirmCallback();

}



document.getElementById(
"confirmModal"
)
.classList.remove(
"show"
);


}