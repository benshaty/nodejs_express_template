
const _submit = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const initParam = {
        "method": "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    };  
    fetch("/api/auth", initParam)
        .then((res) => res.json())
        .then((res) => {
            console.log(res.message);
            if (res.login)
                window.location.assign(res.url);
            else
                document.getElementById("alertBox").innerHTML = res.message;
        });
    return false;
}