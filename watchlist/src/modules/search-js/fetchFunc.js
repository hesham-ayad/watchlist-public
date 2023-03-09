export async function attemptFetch(url) {

    try {
        const resJson = await fetch(url);
        const res = await resJson.json();

        return res;

    } catch (e) {
        return null;
    }
}