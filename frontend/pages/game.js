let profileId = localStorage.getItem("profile");

document.getElementById("selectedProfileId").textContent = profileId;

async function getSingleProfileData(profileID) {
    try {
        const response = await fetch(`/profile/${profileID}`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const profileData = document.getElementById("profile-data");
        profileData.replaceChildren();

        data.profile.forEach((profile) => {
            const profileElement = document.createElement("p");
            profileElement.textContent =
                `${profile.name} - Level ${profile.level} - Money: ${profile.money}`;

            profileData.appendChild(profileElement);
        });

        console.log(data);

    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
    }
}

async function updateProfileData() {
    await getSingleProfileData(profileId);
}

window.addEventListener("DOMContentLoaded", updateProfileData);