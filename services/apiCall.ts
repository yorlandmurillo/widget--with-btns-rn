export default async function apiGetCall(url: string){
    try{
        const response = await fetch(url)
        const json = await response.json();
        return json;
    }
    catch(error){
        console.error('Error fetching API:', error);
        throw error;
    }
}