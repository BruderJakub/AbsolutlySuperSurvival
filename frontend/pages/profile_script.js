// Function to fetch all profile Data
async function fetchProfileData() {
    try {
        const response = await fetch('/profile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const profileData = document.getElementById('profile-data');
        profileData.replaceChildren();

        data.profile.forEach((profile) => {
            const profileElement = document.createElement('p');
            profileElement.textContent = `${profile.name} - Level ${profile.level} - Money: ${profile.money}`;
            profileData.appendChild(profileElement);
        });
        console.log(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to fetch single profile Data by ID
async function getSingleProfileData(profileID) {
    try {
        const response = await fetch(`/profile/${profileID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const profileData = document.getElementById(`profile-data-${profileID}`);
        profileData.replaceChildren();
        
        data.profile.forEach((profile) => {
            const profileElement = document.createElement('p');
            profileElement.textContent = `${profile.name} - Level ${profile.level} - Money: ${profile.money}`;
            profileData.appendChild(profileElement);
        });
        console.log(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function getCharacterData(profileID) {
    try {
        const response = await fetch(`/character/${profileID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const characterData = document.getElementById(`character-data-${profileID}`);
        characterData.replaceChildren();

        data.character.forEach((character) => {
            const characterElement = document.createElement('p');
            characterElement.textContent = `${character.name} - Level ${character.level} - Unlocked: ${character.unlocked}`;
            characterData.appendChild(characterElement);
        });
        console.log(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


async function updateProfileData() {
    fetchProfileData();
    getSingleProfileData(1);
    getSingleProfileData(2);
    getSingleProfileData(3);
    getCharacterData(1);
    getCharacterData(2);
    getCharacterData(3);
}

// Call the function when the page loads
window.onload = updateProfileData;