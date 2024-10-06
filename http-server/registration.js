const setDOB = () => {
    const dob = document.getElementById("dob");
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear()-55);
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear()-18);

    dob.setAttribute('min',minAge.toISOString().split("T")[0]);
    dob.setAttribute('max',maxAge.toISOString().split("T")[0]);
}
setDOB();

const saveUserForm = (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptTermsAndConditions = document.getElementById("acceptTerms").checked;

    const entry = {
        name,
        email,
        password,
        dob,
        acceptTermsAndConditions
    };

    let userEntries = retrieveEntries();
    userEntries.push(entry);

    localStorage.setItem("user-entries", JSON.stringify(userEntries));
    displayEntries();

    userForm.reset();
};

const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if (entries) {
        entries = JSON.parse(entries);
    } else {
        entries = [];
    }
    return entries;
};

const displayEntries = () => {
    const entries = retrieveEntries();

    const tableEntries = entries.map((entry) => {
        const nameCell = '<td class="border border-black px-4 py-2">'+entry.name+'</td>';
        const emailCell = '<td class="border border-black px-4 py-2">'+entry.email+'</td>';
        const passwordCell = '<td class="border border-black px-4 py-2">'+entry.password+'</td>';
        const dobCell = '<td class="border border-black px-4 py-2">'+entry.dob+'</td>';
        const acceptTermsCell = '<td class="border border-black px-4 py-2">'+entry.acceptTermsAndConditions+'</td>';

        const row = '<tr>'+nameCell+emailCell+passwordCell+dobCell+acceptTermsCell+'</tr>'

        return row;
    }).join("");

    const table = '<table><thead class="bg-blue-600 text-white"><tr><th class="px-4 py-2 border border-black">Name</th><th class="px-4 py-2 border border-black">Email</th><th class="px-4 py-2 border border-black">Password</th><th class="px-4 py-2 border border-black">Dob</th><th class="px-4 py-2 border border-black">Accepted terms?</th></tr></thead><tbody>'+tableEntries+'</tbody></table>';

    document.getElementById("table").innerHTML = table;
};

let userForm = document.getElementById("form");
userForm.addEventListener("submit", saveUserForm);

displayEntries();