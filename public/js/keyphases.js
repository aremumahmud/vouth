const voiceAuthenticationPassphrases = [
    // Nature & Environment
    "Blooming flowers bring joy.",
    "Crystal clear waters flow.",
    "Dancing leaves in the breeze.",
    "Eagles soar through the sky.",
    "Fireflies flicker in the night.",
    "Gentle rain patters on leaves.",
    "Majestic mountains stand tall.",
    "Ocean waves crash on the shore.",
    "Raindrops create tiny rainbows.",
    "Sunbeams warm the earth.",

    // Food & Beverages
    "Aromatic coffee fills the air.",
    "Baking cookies in the oven.",
    "Bubbling hot chocolate warms you up.",
    "Freshly squeezed orange juice.",
    "Luscious ripe berries burst with flavor.",
    "Savory cheese melts on your tongue.",
    "Spicy salsa adds a kick.",
    "Steaming cup of tea on a rainy day.",
    "Sweet slice of cake for dessert.",
    "Toasty warm bread right out of the oven.",

    // Animals & Pets
    "Birds chirping a happy tune.",
    "Cat purring on your lap.",
    "Dog barking at the door.",
    "Dolphins leaping in the ocean.",
    "Elephants trumpeting in the distance.",
    "Horses galloping across the field.",
    "Owls hooting in the night.",
    "Rabbits hopping through the grass.",
    "Seahorses dancing in the reef.",
    "Whales singing their soulful song.",

    // Hobbies & Activities
    "Brushing your teeth before bed.",
    "Catching a beautiful sunset.",
    "Cheering on your favorite team.",
    "Dancing to your favorite music.",
    "Feeling the sand between your toes.",
    "Listening to the sound of laughter.",
    "Reading a captivating book.",
    "Taking a deep breath of fresh air.",
    "Watching a star-filled night sky.",
    "Writing a heartfelt letter.",

    // Personal & Inspirational
    "Always believe in yourself.",
    "Embrace the journey, not just the destination.",
    "Every new day brings new possibilities.",
    "Gratitude is the key to happiness.",
    "Kindness matters, big or small.",
    "Laughter is the best medicine.",
    "Never give up on your dreams.",
    "Peace begins within yourself.",
    "Spread love and positivity.",
    "Strive for progress, not perfection.",

    // Numbers & Colors
    "Counting stars on a clear night.",
    "Five senses connect you to the world.",
    "Four seasons bring change and beauty.",
    "Golden sunset paints the sky.",
    "Green leaves swaying in the wind.",
    "Indigo hues of a twilight sky.",
    "Orange peel brings a citrusy scent.",
    "Pink flowers bloom in springtime.",
    "Purple grapes bursting with juice.",
    "Rainbow colors after a summer storm.",

    // Everyday Objects & Activities
    "Clicking your pen while thinking.",
    "Closing your eyes and taking a deep breath.",
    "Coffee mug warming your hands.",
    "Keys jingling in your pocket.",
    "Putting on your favorite shoes.",
    "Raindrops tapping on the window pane.",
    "Ringing of a doorbell announcing visitors.",
    "Rustling of leaves under your feet.",
    "Smiling at a stranger passing by.",
    "Turning the page of a book.",

    // Rhyming & Alliteration
    "Bright sunshine, warms your spine.",
    "Cozy blankets, warm nights.",
    "Dancing dreams, joyful beams.",
    "Gentle breeze, rustling trees.",
    "Happy heart, brand new start.",
    "Laughter and cheer, throughout the year.",
    "Open mind, new things you'll find.",
    "Sparkling stars, shine from afar.",
    "Sweet melodies, gentle breeze.",
    "Tranquil thoughts, calm your knots.",

    // Holidays & Celebrations
    "Bells ringing on Christmas morn.",
    "Bonfire crackling on a summer night.",
    "Fireworks illuminate the sky.",
    "Laughter fills the air on Thanksgiving Day.",
    "New Year's resolutions for a fresh start.",
    "Party music playing in the background.",
    "Pumpkin spice fills the air in autumn.",
    "Sparkling lights twinkle on a Christmas tree.",
    "Sweet treats on Halloween night."
];


voiceAuthenticationPassphrases.forEach(passphrase => {
    document.getElementById('keyphase').innerHTML += `<option value="${passphrase}">${passphrase}</option>`
})