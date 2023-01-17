export default class Helper{
    static clearAxiosError = (str) => {
        return str.replaceAll("\"", "");
    }
    static shortTxt = (str) => {
        return `${str.length > 15 ? str.slice(0, 15) + '...' : str}`;
    }
}
