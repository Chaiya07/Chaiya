const payBtn = document.querySelector(".btn-buy");

payBtn.addEventListener("click", () => {
    fetch("/stripe-checkout", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem("cartItems")) || [],
        }),
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    })
    .then((url) => {
        location.href = url;
    })
    .catch((err) => console.error("Error:", err));
});