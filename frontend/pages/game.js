async function updateProfileData() {
    const profileId = localStorage.getItem("profile");

    if (!profileId) {
        console.error("No profile selected.");
        return;
    }

    try {
        const response = await fetch(`/profile/${profileId}`);

        if (!response.ok) {
            throw new Error("Could not load profile");
        }

        const data = await response.json();
        const profile = data.profile[0];

        document.getElementById("profileName").textContent =
            `Name: ${profile.name}`;

        document.getElementById("profileLevel").textContent =
            `Level: ${profile.level}`;

        document.getElementById("profileMoney").textContent =
            `Money: ${profile.money}`;
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

window.onload = updateProfileData;