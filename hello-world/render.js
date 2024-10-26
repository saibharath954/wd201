const time = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms)
    })
}

const fetchUserDetails = async (userId) => {
    console.log("Fetching user details");
    await time(500);
    return `http://image.example.com/${userId}`;
};

const downloadImage = async (imageURL) => {
    console.log("Downloading image");
    await time(500);
    return `Image data for ${imageURL}`
};

// eslint-disable-next-line no-unused-vars
const render = async (image) => {
    await time(300);
    console.log("Render image");
};

const run = async () => {
    const imageURL = await fetchUserDetails("john");
    const image = await downloadImage(imageURL);
    await render(image);
}

run();
