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

        document.getElementById("profileSlot").textContent = profile.slot;

        getCharacterData(profileId);
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

async function getCharacterData(profileID) {
    try {
        const response = await fetch(`/character/${profileID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const characterButtons = document.getElementById('character-buttons');
        characterButtons.replaceChildren();

        data.character.forEach((character) => {
            const characterElement = document.createElement('button');
            characterElement.type = 'button';
            characterElement.textContent =
                `${character.name} - Level ${character.level} - Unlocked: ${character.unlocked}`;
            characterElement.disabled = !character.unlocked; // Disable button if character is not unlocked
            characterElement.addEventListener('click', () => selectCharacter(character.id));
            characterButtons.appendChild(characterElement);
        });
        console.log(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function unlockCharacter(characterID) {
    const profileID = localStorage.getItem('profile');
    const response = await fetch(`/character/${characterID}/unlock`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileID })
    });

    if (!response.ok) {
        throw new Error('Could not unlock character');
    }

    await getCharacterData(localStorage.getItem('profile'));
}

async function updateCharacterLevel(characterID, level) {
    const profileID = localStorage.getItem('profile');
    const response = await fetch(`/character/${characterID}/level`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level, profileID })
    });

    if (!response.ok) {
        throw new Error('Could not update character level');
    }

    await getCharacterData(localStorage.getItem('profile'));
}

function selectCharacter(characterID) {
    console.log(`Selected character ${characterID}`);
}

window.onload = updateProfileData;